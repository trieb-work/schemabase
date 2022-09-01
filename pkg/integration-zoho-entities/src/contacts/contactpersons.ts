import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { ContactPersonFromContactGet } from "@trieb.work/zoho-ts/dist/types/contactPerson";

interface ContactPersonsSyncConfig {
  db: PrismaClient;
  tenantId: string;
  zohoAppId: string;
  contactId: string;
  logger: ILogger;
}

class ContactPersonsSync {
  private db: PrismaClient;
  private tenantId: string;
  private zohoAppId: string;
  private contactId: string;
  private logger: ILogger;
  constructor(config: ContactPersonsSyncConfig) {
    this.db = config.db;
    this.tenantId = config.tenantId;
    this.zohoAppId = config.zohoAppId;
    this.contactId = config.contactId;
    this.logger = config.logger;
  }

  public async syncWithECI(contactPersons: ContactPersonFromContactGet[]) {
    this.logger.info(
      `Syncing ${contactPersons.length} contactpersons for ${this.contactId}`,
    );
    for (const contactPerson of contactPersons) {
      const lowercaseEmail = contactPerson.email.toLowerCase();

      await this.db.zohoContactPerson.upsert({
        where: {
          id_zohoAppId: {
            id: contactPerson.contact_person_id,
            zohoAppId: this.zohoAppId,
          },
        },
        create: {
          id: contactPerson.contact_person_id,
          zohoContact: {
            connectOrCreate: {
              where: {
                id_zohoAppId: {
                  id: this.contactId,
                  zohoAppId: this.zohoAppId,
                },
              },
              create: {
                id: this.contactId,
                zohoApp: {
                  connect: {
                    id: this.zohoAppId,
                  },
                },
              },
            },
          },
          zohoApp: {
            connect: {
              id: this.zohoAppId,
            },
          },
          email: lowercaseEmail,
          contact: {
            connectOrCreate: {
              where: {
                email_tenantId: {
                  tenantId: this.tenantId,
                  email: lowercaseEmail,
                },
              },
              create: {
                id: id.id("contact"),
                email: lowercaseEmail,
                firstName: contactPerson.first_name,
                lastName: contactPerson.last_name,
                tenant: {
                  connect: {
                    id: this.tenantId,
                  },
                },
              },
            },
          },
        },
        update: {
          email: lowercaseEmail,
        },
      });
    }
  }
}
const contactPersonSync = (
  db: PrismaClient,
  tenantId: string,
  zohoAppId: string,
  contactId: string,
  logger: ILogger,
) => new ContactPersonsSync({ db, tenantId, zohoAppId, contactId, logger });
export default contactPersonSync;
