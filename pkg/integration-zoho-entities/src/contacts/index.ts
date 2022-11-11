import { Zoho, Address } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { Prisma, PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subMonths, subYears } from "date-fns";
import { normalizeStrings } from "@eci/pkg/normalization";
import { sleep } from "@eci/pkg/miscHelper/time";
import addresses from "../addresses";
import contactPersonSync from "./contactpersons";

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
    const tenantId = this.zohoApp.tenantId;

    const cronState = await this.cronState.get();

    const now = new Date();
    const yesterdayMidnight = setHours(subDays(now, 1), 0);
    let gteDate = format(yesterdayMidnight, "yyyy-MM-dd");

    if (cronState.lastRun === null) {
      this.logger.info(
        "This seems to be our first sync run. Upserting ALL contacts",
      );
      gteDate = format(subYears(now, 2), "yyyy-MM-dd");
    } else {
      this.logger.info(`Setting GTE date to ${gteDate}`);
    }

    const contacts = await this.zoho.contact.list({
      // filterBy: "active",
      contactType: "customer",
      lastModifiedTime: `${gteDate}T01:00:00-0100`,
    });

    this.logger.info(
      `We have ${contacts.length} contacts that changed since last sync run.`,
      {
        zohoContactIds:
          contacts.length > 0 ? contacts.map((c) => c.contact_id) : undefined,
      },
    );
    if (contacts.length === 0) {
      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
      return;
    }

    try {
      for (const contact of contacts) {
        if (!contact.email) {
          this.logger.warn(
            // eslint-disable-next-line max-len
            `Contact ${contact.contact_name}, Id ${contact.contact_id} has no email address - skipping sync`,
          );
          continue;
        }

        this.logger.info(`Upserting Zoho contact ${contact.contact_id}`);
        const email = contact.email.toLowerCase();
        const companyName = contact?.company_name;

        // Only create a company if the contact is marked as "business" in Zoho
        const companyCreate: Prisma.CompanyCreateNestedOneWithoutContactsInput =
          contact.customer_sub_type === "business" && companyName
            ? {
                connectOrCreate: {
                  where: {
                    normalizedName_tenantId: {
                      tenantId,
                      normalizedName:
                        normalizeStrings.companyNames(companyName),
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
              email,
            },
          },
          update: {
            company: companyCreate,
            email,
          },
          create: {
            id: id.id("contact"),
            company: companyCreate,
            email,
            tenant: {
              connect: {
                id: tenantId,
              },
            },
          },
        });

        const contactId = contact.contact_id;

        // get the full contact, including contact persons and addresses
        const fullContact = await this.zoho.contact.get(contactId);
        const contactPersons = fullContact?.contact_persons;

        const contactActive = fullContact?.status === "active";
        // Start the contact person logic
        const totalLength = contactPersons?.length;
        if (totalLength && totalLength > 0) {
          await contactPersonSync(
            this.db,
            this.zohoApp.tenantId,
            this.zohoApp.id,
            contactId,
            this.logger,
          ).syncWithECI(contactPersons, contactActive);
        }

        const addressArray: Address[] = fullContact?.addresses || [];
        if (fullContact?.billing_address)
          addressArray.push(fullContact.billing_address);
        if (fullContact?.shipping_address)
          addressArray.push(fullContact.shipping_address);

        if (addressArray?.length > 0) {
          try {
            await addresses(
              this.db,
              this.zohoApp.tenantId,
              this.zohoApp.id,
              this.logger,
              eciContact.id,
            ).eciContactAddAddresses(addressArray, fullContact?.contact_name);
          } catch (error) {
            this.logger.error(error as any);
            continue;
          }
        } else {
          this.logger.info(
            // eslint-disable-next-line max-len
            `Contact ${eciContact.id} - Zoho Contact ${contact.contact_id} has no related addresses to update`,
          );
        }

        // We sleep here to not get blocked by Zoho
        await sleep(3000);
      }
    } catch (error) {
      this.logger.error((error as any).toString());
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }

  public async syncFromECI(): Promise<void> {
    // TODO: get all contacts from our DB, that don't have
    // a Zoho ID yet
    const newContacts = await this.db.contact.findMany({
      where: {
        tenantId: this.zohoApp.tenantId,
        zohoContactPersons: {
          none: {
            zohoAppId: this.zohoApp.id,
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        addresses: true,
        company: true,
        companyId: true,
      },
    });

    this.logger.info(
      `We have ${newContacts.length} contacts that we need to create in Zoho`,
    );

    for (const newContact of newContacts) {
      if (newContact.firstName == null || newContact.lastName == null) {
        this.logger.error(
          `First and Last Name not set for contact ${newContact.id} - They are mandatory for Zoho`,
        );
        continue;
      }

      // TODO: Possible improvement: we can set the address of an contact
      // directly as shipping and billing address without more API calls
      const zohoContact = await this.zoho.contact.create({
        contact_name: `${newContact.firstName} ${newContact.lastName}`,
        customer_sub_type: newContact?.companyId ? "business" : "individual",
        contact_persons: [
          {
            first_name: newContact.firstName,
            last_name: newContact.lastName,
            email: newContact.email,
          },
        ],
      });
      await this.db.contact.update({
        where: {
          id: newContact.id,
        },
        data: {
          zohoContactPersons: {
            create: {
              id: zohoContact.contact_persons[0].contact_person_id,
              zohoApp: {
                connect: {
                  id: this.zohoApp.id,
                },
              },
              zohoContact: {
                create: {
                  id: zohoContact.contact_id,
                  zohoApp: {
                    connect: {
                      id: this.zohoApp.id,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
    const newAddresses = await this.db.address.findMany({
      where: {
        tenantId: this.zohoApp.tenantId,
        zohoAddress: {
          none: {
            zohoAppId: this.zohoApp.id,
          },
        },
        updatedAt: {
          gte: subMonths(new Date(), 5),
        },
      },
      include: {
        contact: {
          select: {
            zohoContactPersons: {
              where: {
                zohoAppId: this.zohoApp.id,
              },
              select: {
                zohoContactId: true,
              },
            },
          },
        },
      },
    });
    this.logger.info(
      `We have ${newAddresses.length} addresses that need to be synced with Zoho`,
    );
    for (const newAddress of newAddresses) {
      const zohoContactId =
        newAddress.contact.zohoContactPersons?.[0]?.zohoContactId;
      if (!zohoContactId) {
        this.logger.error(
          `No Zoho ContactId given for ${JSON.stringify(newAddress)}`,
        );
        continue;
      }

      const zohoAddrObj = addresses(
        this.db,
        this.zohoApp.tenantId,
        this.zohoApp.id,
        this.logger,
        zohoContactId,
      ).createZohoAddressFromECI(
        newAddress,
        this.zohoApp.orgLanguage.toLowerCase(),
      );

      const zohoAddr = await this.zoho.contact.addAddress(
        zohoContactId,
        zohoAddrObj,
      );
      await this.db.address.update({
        where: {
          id: newAddress.id,
        },
        data: {
          zohoAddress: {
            create: {
              id: zohoAddr,
              zohoApp: {
                connect: {
                  id: this.zohoApp.id,
                },
              },
            },
          },
        },
      });
    }
  }
}
