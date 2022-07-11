import { Zoho, Contact, ContactPerson } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { Prisma, PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subDays } from "date-fns";
import { normalizeStrings } from "@eci/pkg/normalization";

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
      contactsToBeUpserted = contacts.filter(
        // @ts-ignore: Object is possibly 'null'
        (contact) =>
          new Date(contact.last_modified_time) >
          subDays(cronState.lastRun as Date, 1),
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

      await this.db.contact.upsert({
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
    }

    // we get all contact persons now. We can't filter contact persons API calls
    // by timestamps or anything, so this might take a lot of API calls and should not
    // be run too frequently
    const contactPersons: ContactPerson[] =
      await this.zoho.contactperson.list();

    const totalLength = contactPersons.length;
    this.logger.info(`We have ${totalLength} Zoho ContactPersons to upsert`);

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
                  id: contactPerson.contact_id,
                  zohoAppId: this.zohoApp.id,
                },
              },
              create: {
                id: contactPerson.contact_id,
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

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
