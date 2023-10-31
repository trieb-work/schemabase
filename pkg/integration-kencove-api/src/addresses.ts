import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subYears } from "date-fns";
import { uniqueStringAddress } from "@eci/pkg/utils/uniqueStringAddress";
import { id } from "@eci/pkg/ids";
import async from "async";
import { countryCodeMatch } from "@eci/pkg/utils/countryCodeMatch";

interface KencoveApiAppAddressSyncServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppAddressSyncService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    /**
     * Store the normalized name of addresses we already worked on.
     * When we have a match, we can immdediately connect this kencoveApiAddress
     * to the existing address in our DB
     */
    private readonly normalizedAddresses: Set<string> = new Set();

    private readonly cronState: CronStateHandler;

    public constructor(config: KencoveApiAppAddressSyncServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.cronState = new CronStateHandler({
            tenantId: this.kencoveApiApp.tenantId,
            appId: this.kencoveApiApp.id,
            db: this.db,
            syncEntity: "addresses",
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
        const addressesYield = client.getAddressesStream(createdGte);

        for await (const addresses of addressesYield) {
            this.logger.info(`Found ${addresses.length} addresses to sync`);

            /**
             * We can't work in parallel, as get always unique constraint
             * issues..
             */
            await async.eachLimit(addresses, 1, async (address) => {
                if (!address.street || !address.city || !address.fullname) {
                    this.logger.warn(
                        `Address ${address.id} has no street/city/fullname.\
           Skipping: ${JSON.stringify(address)}`,
                    );
                    return;
                }

                const createdAt = new Date(address.createdAt);
                const updatedAt = new Date(address.updatedAt);

                const normalizedName = uniqueStringAddress(address);

                let internalAddressExisting = false;
                if (this.normalizedAddresses.has(normalizedName)) {
                    internalAddressExisting = true;
                }

                const countryCode = address.countryCode
                    ? countryCodeMatch(address.countryCode)
                    : undefined;

                const internalContact =
                    await this.db.kencoveApiContact.findUnique({
                        where: {
                            id_kencoveApiAppId: {
                                id: address.customerId,
                                kencoveApiAppId: this.kencoveApiApp.id,
                            },
                        },
                    });

                const addrConnectOrCreate = {
                    connectOrCreate: {
                        where: {
                            normalizedName_tenantId: {
                                normalizedName,
                                tenantId: this.kencoveApiApp.tenantId,
                            },
                        },
                        create: {
                            id: id.id("address"),
                            normalizedName,
                            tenant: {
                                connect: {
                                    id: this.kencoveApiApp.tenantId,
                                },
                            },
                            street: address.street,
                            additionalAddressLine:
                                address.additionalAddressLine,
                            plz: address.zip,
                            city: address.city,
                            countryCode,
                            company: address.company,
                            phone: address.phone,
                            fullname: address.fullname,
                            state: address.state,
                            contact: internalContact
                                ? { connect: { id: internalContact.contactId } }
                                : undefined,
                        },
                    },
                };
                const addrConnect = {
                    connect: {
                        normalizedName_tenantId: {
                            normalizedName,
                            tenantId: this.kencoveApiApp.tenantId,
                        },
                    },
                };

                await this.db.kencoveApiAddress.upsert({
                    where: {
                        id_kencoveApiAppId: {
                            id: address.id,
                            kencoveApiAppId: this.kencoveApiApp.id,
                        },
                    },
                    create: {
                        id: address.id,
                        createdAt,
                        updatedAt,
                        kencoveApiApp: {
                            connect: {
                                id: this.kencoveApiApp.id,
                            },
                        },
                        address: internalAddressExisting
                            ? addrConnect
                            : addrConnectOrCreate,
                    },
                    update: {
                        createdAt,
                        updatedAt,
                        address: {
                            update: {
                                contact: internalContact
                                    ? {
                                          connect: {
                                              id: internalContact.contactId,
                                          },
                                      }
                                    : undefined,
                            },
                        },
                    },
                });

                this.normalizedAddresses.add(normalizedName);
            });
        }
        await this.cronState.set({ lastRun: now, lastRunStatus: "success" });
    }
}
