// the kencoveApiAppPaymentsync class that is used to sync paymenets.
// from kencove to our internal database. It works similar than the product sync
import {
    GatewayType,
    KencoveApiApp,
    PaymentMethodType,
    PrismaClient,
} from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";

interface KencoveApiAppPaymentSyncServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppPaymentSyncService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    private readonly cronState: CronStateHandler;

    public constructor(config: KencoveApiAppPaymentSyncServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.cronState = new CronStateHandler({
            tenantId: this.kencoveApiApp.tenantId,
            appId: this.kencoveApiApp.id,
            db: this.db,
            syncEntity: "payments",
        });
    }

    private matchKencovePaymentGatewayType(input: string): GatewayType {
        const lowercasedInput = input.toLowerCase();
        if (lowercasedInput.includes("authorize"))
            return GatewayType.authorizeNet;
        if (lowercasedInput.includes("paypal")) return GatewayType.paypal;

        throw new Error(`Could not match the gateway type for ${input}`);
    }

    private matchKencovePaymentMethodType(input: string): PaymentMethodType {
        const lowercasedInput = input.toLowerCase();
        if (lowercasedInput.includes("credit card"))
            return PaymentMethodType.card;
        if (lowercasedInput.includes("paypal")) return PaymentMethodType.paypal;

        throw new Error(`Could not match the method type for ${input}`);
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
        const kencoveApiAppPaymentsYield = client.getPaymentsStream(createdGte);
        for await (const kencoveApiAppPayment of kencoveApiAppPaymentsYield) {
            this.logger.info(
                `Working on ${kencoveApiAppPayment.length} payments.`,
            );

            for (const payment of kencoveApiAppPayment) {
                const updatedAt = new Date(payment.updatedAt);
                const createdAt = new Date(payment.createdAt);
                const referenceNumber = payment.acquirer_reference;
                const gatewayType = this.matchKencovePaymentGatewayType(
                    payment.payment_method,
                );
                const methodType = this.matchKencovePaymentMethodType(
                    payment.payment_method,
                );
                if (payment.payment_state !== "done") {
                    this.logger.info(
                        `Payment ${payment.payment_id} is not done. Skipping.`,
                        {
                            aquirerReference: payment.acquirer_reference,
                            customerCode: payment.customer_code,
                        },
                    );
                    continue;
                }
                /**
                 * Get the order id by looking for the order number
                 */
                const order = await this.db.order.findUnique({
                    where: {
                        orderNumber_tenantId: {
                            orderNumber: payment.sale_order_number,
                            tenantId: this.kencoveApiApp.tenantId,
                        },
                    },
                });
                if (!order) {
                    this.logger.info(
                        `Could not find order for ${payment.sale_order_number}. Skipping.`,
                    );
                    continue;
                }

                this.logger.debug("Upserting payment", {
                    methodType,
                    gatewayType,
                    referenceNumber,
                });

                try {
                    await this.db.kencoveApiPayment.upsert({
                        where: {
                            id_kencoveApiAppId: {
                                id: payment.payment_id.toString(),
                                kencoveApiAppId: this.kencoveApiApp.id,
                            },
                        },
                        update: {
                            createdAt,
                            payment: {
                                update: {
                                    order: {
                                        connect: {
                                            id: order.id,
                                        },
                                    },
                                },
                            },
                        },
                        create: {
                            id: payment.payment_id.toString(),
                            createdAt,
                            updatedAt,
                            kencoveApiApp: {
                                connect: {
                                    id: this.kencoveApiApp.id,
                                },
                            },
                            payment: {
                                connectOrCreate: {
                                    where: {
                                        referenceNumber_tenantId: {
                                            referenceNumber,
                                            tenantId:
                                                this.kencoveApiApp.tenantId,
                                        },
                                    },
                                    create: {
                                        id: id.id("payment"),
                                        amount: payment.payment_amount,
                                        date: createdAt,
                                        referenceNumber,
                                        tenant: {
                                            connect: {
                                                id: this.kencoveApiApp.tenantId,
                                            },
                                        },
                                        paymentMethod: {
                                            connect: {
                                                gatewayType_methodType_currency_tenantId:
                                                    {
                                                        gatewayType,
                                                        methodType,
                                                        currency: "USD",
                                                        tenantId:
                                                            this.kencoveApiApp
                                                                .tenantId,
                                                    },
                                            },
                                        },
                                        order: {
                                            connect: {
                                                id: order.id,
                                            },
                                        },
                                        mainContact: {
                                            connect: {
                                                id: order.mainContactId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                } catch (error) {
                    this.logger.error("Error upserting payment", {
                        error,
                        payment,
                        currency: "USD",
                    });
                    continue;
                }
            }
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }
}
