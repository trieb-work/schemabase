/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import {
    InputMaybe,
    MetadataInput,
    queryWithPagination,
    SaleorClient,
} from "@eci/pkg/saleor";
import { Contact, PrismaClient } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";

import { subHours } from "date-fns";
import { id } from "@eci/pkg/ids";
import { sha256 } from "@eci/pkg/hash";

interface SaleorCustomerSyncServiceConfig {
    saleorClient: SaleorClient;
    channelSlug: string;
    installedSaleorAppId: string;
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
}

export class SaleorCustomerSyncService {
    public readonly saleorClient: SaleorClient;

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

    private async updateContactInSaleor({
        saleorCustomerId,
        contact,
    }: {
        saleorCustomerId: string;
        contact: Contact;
    }) {
        const { externalIdentifier, externalIdentifier2 } = contact;

        const metadataInput: InputMaybe<MetadataInput[]> = [];
        const privateMetadataInput: InputMaybe<MetadataInput[]> = [];

        if (externalIdentifier) {
            metadataInput.push({
                key: "avataxCustomerCode",
                value: externalIdentifier,
            });
        }
        if (externalIdentifier2) {
            metadataInput.push({
                key: "customerCode",
                value: externalIdentifier2,
            });
        }
        const response = await this.saleorClient.updateSaleorCustomer({
            id: saleorCustomerId,
            input: {
                metadata: metadataInput,
                privateMetadata: privateMetadataInput,
            },
        });

        if (response.customerUpdate?.errors.length) {
            this.logger.error(
                `Error updating Saleor customer ${saleorCustomerId}: ${JSON.stringify(
                    response.customerUpdate.errors,
                )}`,
            );
        }
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
            this.logger.info(`Syncing contact ${contact.id} to ECI`, {
                email: contact.email,
                firstName: contact.firstName,
                lastName: contact.lastName,
            });

            const existingContact = await this.db.saleorCustomer.findUnique({
                where: {
                    id_installedSaleorAppId: {
                        id: contact.id,
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                include: {
                    customer: true,
                },
            });

            const dataHash = sha256({
                metadata: contact.metadata,
                privateMetadata: contact.privateMetadata,
                email: contact.email,
                firstName: contact.firstName,
                lastName: contact.lastName,
            });

            if (dataHash === existingContact?.dataHash) {
                this.logger.info(`Contact ${contact.id} is up to date`);
                continue;
            }

            const internalContact = await this.db.saleorCustomer.upsert({
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
                    dataHash,
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
                    dataHash,
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
                        update: {
                            email: contact.email.toLowerCase(),
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                        },
                    },
                },
                include: {
                    customer: true,
                },
            });

            const externalIdentifier =
                internalContact.customer.externalIdentifier;
            const saleorAvataxCustomerId = contact.metadata.find(
                (k) => k.key === "avataxCustomerCode",
            )?.value;

            /**
             * The Saleor customer app gets a avatax code from Odoo
             * faster than the ECI, so we need to set this identifier
             * here
             */
            if (!externalIdentifier && saleorAvataxCustomerId) {
                await this.db.contact.update({
                    where: {
                        id: internalContact.customerId,
                    },
                    data: {
                        externalIdentifier: saleorAvataxCustomerId,
                    },
                });
            }

            if (
                (!internalContact.customer.firstName && contact.firstName) ||
                (!internalContact.customer.lastName && contact.lastName)
            ) {
                await this.db.contact.update({
                    where: {
                        id: internalContact.customerId,
                    },
                    data: {
                        firstName: contact.firstName,
                        lastName: contact.lastName,
                    },
                });
            }
        }
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
            include: {
                saleorCustomers: {
                    where: {
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
            `ECI returned ${contacts.length} contacts that might need an update in Saleor`,
        );

        for (const contact of contacts) {
            const saleorCustomerId = contact.saleorCustomers[0].id;
            if (!saleorCustomerId) {
                this.logger.error(
                    `Contact ${contact.id} has no saleorCustomerId. Skipping`,
                );
                continue;
            }
            this.logger.info(`Updating contact ${contact.id} in Saleor`, {
                externalIdentifier: contact.externalIdentifier,
                externalIdentifier2: contact.externalIdentifier2,
                saleorCustomerId,
            });

            await this.updateContactInSaleor({
                saleorCustomerId,
                contact,
            });
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }
}
