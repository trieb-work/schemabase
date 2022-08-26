import { Zoho, Contact } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { Prisma, PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { isAfter, subDays } from "date-fns";
import { normalizeStrings } from "@eci/pkg/normalization";
import { sleep } from "@eci/pkg/miscHelper/time";
import addresses from "./addresses";

export interface ZohoContactSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoApp;
}

export class ZohoContactSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoApp;

  private readonly cronState: CronStateHandler;

  public constructor(config: ZohoContactSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
    this.cronState = new CronStateHandler({
      tenantId: this.zohoApp.tenantId,
      appId: this.zohoApp.id,
      db: this.db,
      syncEntity: "contacts",
    });
  }

  public async syncToECI(): Promise<void> {
    const contacts = await this.zoho.contact.list({
      filterBy: "active",
      contactType: "customer",
    });
    const tenantId = this.zohoApp.tenantId;

    const cronState = await this.cronState.get();

    let contactsToBeUpserted: Contact[] = [];

    if (cronState.lastRun === null) {
      this.logger.info(
        "This seems to be our first sync run. Upserting ALL contacts",
      );
      contactsToBeUpserted = contacts;
    } else {
      // check if the last_updated timestamp from a contact
      // is after the last succesfull cron run (-1 day security)
      contactsToBeUpserted = contacts.filter(
        // @ts-ignore: Object is possibly 'null'
        (contact) =>
          isAfter(
            new Date(contact.last_modified_time),
            subDays(cronState.lastRun as Date, 1),
          ),
      );
    }

    this.logger.info(
      `We have ${contactsToBeUpserted.length} contacts that changed since last sync run.`,
    );
    if (contactsToBeUpserted.length === 0) {
      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
      return;
    }

    for (const contact of contactsToBeUpserted) {
      if (!contact.email) {
        this.logger.warn(
          // eslint-disable-next-line max-len
          `Contact ${contact.contact_name}, Id ${contact.contact_id} has no email address - skipping sync`,
        );
        continue;
      }

      const lowercaseEmail = contact.email.toLowerCase();
      const companyName = contact?.company_name;

      // Only create a company if the contact is marked as "business" in Zoho
      const companyCreate: Prisma.CompanyCreateNestedOneWithoutContactsInput =
        contact.customer_sub_type === "business" && companyName
          ? {
              connectOrCreate: {
                where: {
                  normalizedName_tenantId: {
                    tenantId,
                    normalizedName: normalizeStrings.companyNames(companyName),
                  },
                },
                create: {
                  id: id.id("company"),
                  name: companyName,
                  normalizedName: normalizeStrings.companyNames(companyName),
                  tenantId,
                },
              },
            }
          : {};

      await this.db.zohoContact.upsert({
        where: {
          id_zohoAppId: {
            zohoAppId: this.zohoApp.id,
            id: contact.contact_id,
          },
        },
        create: {
          id: contact.contact_id,
          createdAt: new Date(contact.created_time),
          updatedAt: new Date(contact.last_modified_time),
          zohoApp: {
            connect: {
              id: this.zohoApp.id,
            },
          },
        },
        update: {
          createdAt: new Date(contact.created_time),
          updatedAt: new Date(contact.last_modified_time),
        },
      });

      const eciContact = await this.db.contact.upsert({
        where: {
          email_tenantId: {
            tenantId,
            email: lowercaseEmail,
          },
        },
        update: {
          company: companyCreate,
          email: lowercaseEmail,
        },
        create: {
          id: id.id("contact"),
          company: companyCreate,
          email: lowercaseEmail,
          tenant: {
            connect: {
              id: tenantId,
            },
          },
        },
      });

      const contactId = contact.contact_id;

      // get the contact persons for a contact
      const contactPersons = await this.zoho.contact.listContactPersons(
        contactId,
      );

      const totalLength = contactPersons.length;
      this.logger.info(
        // eslint-disable-next-line max-len
        `We have ${totalLength} Zoho ContactPersons to upsert for Zoho Contact ${contactId}`,
      );

      for (const contactPerson of contactPersons) {
        // TODO: only update contactperson, if contact last_update
        // timestamp is new
        const lowercaseEmail = contactPerson.email.toLowerCase();

        await this.db.zohoContactPerson.upsert({
          where: {
            id_zohoAppId: {
              id: contactPerson.contact_person_id,
              zohoAppId: this.zohoApp.id,
            },
          },
          create: {
            id: contactPerson.contact_person_id,
            zohoContact: {
              connectOrCreate: {
                where: {
                  id_zohoAppId: {
                    id: contactId,
                    zohoAppId: this.zohoApp.id,
                  },
                },
                create: {
                  id: contactId,
                  zohoApp: {
                    connect: {
                      id: this.zohoApp.id,
                    },
                  },
                },
              },
            },
            zohoApp: {
              connect: {
                id: this.zohoApp.id,
              },
            },
            firstName: contactPerson.first_name,
            lastName: contactPerson.last_name,
            email: lowercaseEmail,
            contact: {
              connectOrCreate: {
                where: {
                  email_tenantId: {
                    tenantId,
                    email: lowercaseEmail,
                  },
                },
                create: {
                  id: id.id("contact"),
                  email: lowercaseEmail,
                  tenant: {
                    connect: {
                      id: tenantId,
                    },
                  },
                },
              },
            },
          },
          update: {
            firstName: contactPerson.first_name,
            lastName: contactPerson.last_name,
            email: lowercaseEmail,
          },
        });
      }

      const addressArray = contact.addresses;
      addressArray.push(contact.billing_address);
      addressArray.push(contact.shipping_address);

      await addresses(
        this.db,
        this.zohoApp.tenantId,
        this.zohoApp.id,
        this.logger,
        eciContact.id,
      ).eciContactAddAddresses(addressArray);

      // We sleep here to not get blocked by Zoho
      await sleep(3000);
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }

  // public async syncFromECI(): Promise<void> {

  // }
}
