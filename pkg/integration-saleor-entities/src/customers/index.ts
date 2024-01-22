/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import { queryWithPagination, SaleorCronCustomersQuery } from "@eci/pkg/saleor";
import { PrismaClient } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";

import { subHours } from "date-fns";
import { id } from "@eci/pkg/ids";

interface SaleorCustomerSyncServiceConfig {
    saleorClient: {
        saleorCronCustomers: (variables: {
            first: number;
            after: string;
            updatedAtGte: Date;
        }) => Promise<SaleorCronCustomersQuery>;
    };
    channelSlug: string;
    installedSaleorAppId: string;
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
}

export class SaleorCustomerSyncService {
    public readonly saleorClient: {
        saleorCronCustomers: (variables: {
            first: number;
            after: string;
            updatedAtGte: Date;
        }) => Promise<SaleorCronCustomersQuery>;
    };

    private readonly logger: ILogger;

    public readonly installedSaleorAppId: string;

    public readonly tenantId: string;

    private readonly cronState: CronStateHandler;

    private readonly db: PrismaClient;

    public constructor(config: SaleorCustomerSyncServiceConfig) {
        this.saleorClient = config.saleorClient;
        this.logger = config.logger;
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.tenantId = config.tenantId;
        this.db = config.db;
        this.cronState = new CronStateHandler({
            tenantId: this.tenantId,
            appId: this.installedSaleorAppId,
            db: this.db,
            syncEntity: "contacts",
        });
    }

    public async syncToECI(): Promise<void> {
        const cronState = await this.cronState.get();

        let createdGte: Date;
        if (!cronState.lastRun) {
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing all customers without a last_updated filter`,
            );
        } else {
            createdGte = subHours(cronState.lastRun, 3);
            this.logger.info(
                `Setting GTE date to ${createdGte}. Asking Saleor for customers with lastUpdated GTE.`,
            );
        }

        const result = await queryWithPagination(({ first, after }) =>
            this.saleorClient.saleorCronCustomers({
                first,
                after,
                updatedAtGte: createdGte,
            }),
        );

        const contacts = result.customers?.edges.map((c) => c.node);

        if (!contacts || contacts.length === 0) {
            this.logger.info("Saleor returned no contacts. Finishing sync run");
            return;
        }

        this.logger.info(`Saleor returned ${contacts.length} contacts`);

        for (const contact of contacts) {
            await this.db.saleorCustomer.upsert({
                where: {
                    id_installedSaleorAppId: {
                        id: contact.id,
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                create: {
                    id: contact.id,
                    createdAt: new Date(contact.dateJoined),
                    updatedAt: new Date(contact.updatedAt),
                    customer: {
                        connectOrCreate: {
                            where: {
                                email_tenantId: {
                                    email: contact.email.toLowerCase(),
                                    tenantId: this.tenantId,
                                },
                            },
                            create: {
                                id: id.id("contact"),
                                email: contact.email.toLowerCase(),
                                firstName: contact.firstName,
                                lastName: contact.lastName,
                                tenant: {
                                    connect: {
                                        id: this.tenantId,
                                    },
                                },
                            },
                        },
                    },
                    installedSaleorApp: {
                        connect: {
                            id: this.installedSaleorAppId,
                        },
                    },
                },
                update: {
                    updatedAt: new Date(contact.updatedAt),
                },
            });
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }

    /**
     * get all contacts that have been updated since the last sync.
     * We currently don't create, but just update contacts from Saleor.
     * We update the externalIdentifier on the contact
     */
    public async syncFromECI(): Promise<void> {
        const cronState = await this.cronState.get();

        let createdGte: Date | undefined = undefined;
        if (!cronState.lastRun) {
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing all customers without a last_updated filter`,
            );
        } else {
            createdGte = subHours(cronState.lastRun, 3);
            this.logger.info(
                `Setting GTE date to ${createdGte}. Asking Saleor for customers with lastUpdated GTE.`,
            );
        }

        /**
         * get all contacts that have a saleor contact that have been changed since the last run
         */
        const contacts = await this.db.contact.findMany({
            where: {
                tenantId: this.tenantId,
                updatedAt: createdGte
                    ? {
                          gte: createdGte,
                      }
                    : undefined,
                saleorCustomers: {
                    some: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
            },
        });

        if (!contacts || contacts.length === 0) {
            this.logger.info("ECI returned no contacts. Finishing sync run");
            return;
        }

        this.logger.info(
            `ECI returned ${contacts.length} contacts to update in Saleor`,
        );

        // for (const contact of contacts) {
        // }
    }
}
