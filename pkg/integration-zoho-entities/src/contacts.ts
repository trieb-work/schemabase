import { Zoho, Contact, ContactPerson } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { CronStateHandler } from "@eci/pkg/cronstate";

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
        (contact) => new Date(contact.last_modified_time) > cronState.lastRun,
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

      // Only create a company if the contact is marked as "business" in Zoho
      const companyCreate =
        contact.customer_sub_type === "business"
          ? {
              connectOrCreate: {
                where: {
                  name_tenantId: {
                    tenantId,
                    name: contact.company_name,
                  },
                },
                create: {
                  id: id.id("company"),
                  name: contact.company_name,
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

      await this.db.contact.update({
        where: {
          email_tenantId: {
            tenantId,
            email: lowercaseEmail,
          },
        },
        data: {
          company: companyCreate,
        },
      });
    }

    // we get all contact persons now. We can't filter contact persons API calls
    // by timestamps or anything, so this might take a lot of API calls and should not
    // be run too frequently
    const contactPersons: ContactPerson[] =
      await this.zoho.contactperson.list();

    for (const contactPerson of contactPersons) {
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
            connect: {
              id_zohoAppId: {
                id: contactPerson.contact_person_id,
                zohoAppId: this.zohoApp.id,
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
