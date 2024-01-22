import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { KencoveApiClient } from "./client";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

interface KencoveApiAppContactSyncServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppContactSyncService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    private readonly cronState: CronStateHandler;

    public constructor(config: KencoveApiAppContactSyncServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.cronState = new CronStateHandler({
            tenantId: this.kencoveApiApp.tenantId,
            appId: this.kencoveApiApp.id,
            db: this.db,
            syncEntity: "contacts",
        });
    }

    public async syncToECI() {
        const cronState = await this.cronState.get();
        const now = new Date();
        let createdGte: Date;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 1);
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            // for security purposes, we sync one hour more than the last run
            createdGte = subHours(cronState.lastRun, 1);
            this.logger.info(`Setting GTE date to ${createdGte}.`);
        }

        const client = new KencoveApiClient(this.kencoveApiApp, this.logger);

        const contactYield = client.getContactsStream(createdGte);

        if (!contactYield) {
            this.logger.info("No contacts found to sync");
            return;
        }
        /**
         * All sales channels that we have. Used to find the corresponding
         * channel for a given customer
         */
        const salesChannels = await this.db.salesChannel.findMany({
            where: {
                tenantId: this.kencoveApiApp.tenantId,
            },
        });

        for await (const contacts of contactYield) {
            this.logger.info(`Found ${contacts.length} contacts to sync`);
            for (const contact of contacts) {
                if (!contact.email) {
                    continue;
                }
                /**
                 * Lowercase email address, removing whitespace before and after, trimming
                 */
                const email = contact.email.toLowerCase().trim();

                // simple check if email is actually a valid email address, using regex
                if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    this.logger.warn(
                        `Skipping contact with invalid email address: ${email}`,
                    );
                    continue;
                }

                /**
                 * Skip contact sync if first or lastname are longer than 150 characters
                 * (we assume, that this is a mistake in the data)
                 */
                if (
                    (contact.firstname && contact?.firstname?.length > 150) ||
                    (contact.lastname && contact?.lastname?.length > 150)
                ) {
                    this.logger.warn(
                        `Skipping contact with invalid first or lastname: ${contact.firstname} ${contact.lastname}`,
                    );
                    continue;
                }

                const companyName = contact.companyname;
                const companyNameNormalized = normalizeStrings.companyNames(
                    companyName || "",
                );

                /**
                 * Contacts have corresponding sales channels.
                 * We use the normalized name to find the corresponding
                 * sales channel
                 */
                const normalizedName = normalizeStrings.channelNames(
                    contact.pricelist.name,
                );

                const salesChannel = salesChannels.find(
                    (sc) => sc.normalizedName === normalizedName,
                );

                await this.db.kencoveApiContact.upsert({
                    where: {
                        id_kencoveApiAppId: {
                            id: contact.id.toString(),
                            kencoveApiAppId: this.kencoveApiApp.id,
                        },
                    },
                    create: {
                        id: contact.id.toString(),
                        kencoveApiApp: {
                            connect: {
                                id: this.kencoveApiApp.id,
                            },
                        },
                        contact: {
                            connectOrCreate: {
                                where: {
                                    email_tenantId: {
                                        email,
                                        tenantId: this.kencoveApiApp.tenantId,
                                    },
                                },
                                create: {
                                    id: id.id("contact"),
                                    email,
                                    firstName: contact.firstname,
                                    lastName: contact.lastname,
                                    phone: contact.phone,
                                    externalIdentifier:
                                        contact.commerical_customer_code,
                                    company: companyName
                                        ? {
                                              connectOrCreate: {
                                                  where: {
                                                      normalizedName_tenantId: {
                                                          normalizedName:
                                                              companyNameNormalized,
                                                          tenantId:
                                                              this.kencoveApiApp
                                                                  .tenantId,
                                                      },
                                                  },
                                                  create: {
                                                      id: id.id("company"),
                                                      name: companyName,
                                                      normalizedName:
                                                          companyNameNormalized,
                                                      tenant: {
                                                          connect: {
                                                              id: this
                                                                  .kencoveApiApp
                                                                  .tenantId,
                                                          },
                                                      },
                                                  },
                                              },
                                          }
                                        : undefined,
                                    tenant: {
                                        connect: {
                                            id: this.kencoveApiApp.tenantId,
                                        },
                                    },
                                    channels: salesChannel
                                        ? {
                                              connect: {
                                                  id: salesChannel.id,
                                              },
                                          }
                                        : undefined,
                                },
                            },
                        },
                    },
                    update: {
                        contact: {
                            update: {
                                firstName: contact.firstname,
                                lastName: contact.lastname,
                                phone: contact.phone,
                                externalIdentifier:
                                    contact.commerical_customer_code,
                                company: companyName
                                    ? {
                                          connectOrCreate: {
                                              where: {
                                                  normalizedName_tenantId: {
                                                      normalizedName:
                                                          companyNameNormalized,
                                                      tenantId:
                                                          this.kencoveApiApp
                                                              .tenantId,
                                                  },
                                              },
                                              create: {
                                                  id: id.id("company"),
                                                  name: companyName,
                                                  normalizedName:
                                                      companyNameNormalized,
                                                  tenant: {
                                                      connect: {
                                                          id: this.kencoveApiApp
                                                              .tenantId,
                                                      },
                                                  },
                                              },
                                          },
                                      }
                                    : undefined,
                                channels: salesChannel
                                    ? {
                                          connect: {
                                              id: salesChannel.id,
                                          },
                                      }
                                    : undefined,
                            },
                        },
                    },
                });
            }
        }
        await this.cronState.set({ lastRun: now, lastRunStatus: "success" });
    }
}
