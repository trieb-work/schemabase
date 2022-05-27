import { Zoho, Contact } from "@trieb.work/zoho-ts/dist/v2";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, Prisma, ZohoApp } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { CronStateHandler } from "@eci/pkg/cronstate";

type ZohoAppWithTenant = ZohoApp & Prisma.TenantInclude;

export interface ZohoContactSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoAppWithTenant;
}

export class ZohoContactSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoAppWithTenant;

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
                company: companyCreate,
                email: lowercaseEmail,
                tenant: {
                  connect: {
                    id: tenantId,
                  },
                },
              },
            },
          },
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
          contact: {
            update: {
              email: lowercaseEmail,
              company: companyCreate,
            },
          },
        },
      });
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
