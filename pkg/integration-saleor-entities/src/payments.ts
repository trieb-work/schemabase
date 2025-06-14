/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import {
    PaymentChargeStatusEnum,
    queryWithPagination,
    SaleorClient,
    TransactionDetailsFragment,
} from "@eci/pkg/saleor";
import {
    Currency,
    GatewayType,
    InstalledSaleorApp,
    Payment,
    PaymentMethodType,
    PaymentStatus,
    Prisma,
    PrismaClient,
} from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { checkCurrency } from "@eci/pkg/normalization/src/currency";
import { sleep } from "@eci/pkg/utils/time";
import { krypto } from "@eci/pkg/krypto";

interface SaleorPaymentSyncServiceConfig {
    saleorClient: SaleorClient;
    installedSaleorApp: InstalledSaleorApp;
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
    orderPrefix: string;
}

export class SaleorPaymentSyncService {
    public readonly saleorClient: SaleorClient;

    private readonly logger: ILogger;

    public readonly installedSaleorApp: InstalledSaleorApp;

    public readonly tenantId: string;

    private readonly cronState: CronStateHandler;

    private readonly db: PrismaClient;

    private readonly orderPrefix: string;

    public constructor(config: SaleorPaymentSyncServiceConfig) {
        this.saleorClient = config.saleorClient;
        this.logger = config.logger;
        this.installedSaleorApp = config.installedSaleorApp;
        this.tenantId = config.tenantId;
        this.db = config.db;
        this.orderPrefix = config.orderPrefix;
        this.cronState = new CronStateHandler({
            tenantId: this.tenantId,
            appId: this.installedSaleorApp.id,
            db: this.db,
            syncEntity: "payments",
        });
    }

    private async transactionToPaymentMethod(
        transaction: TransactionDetailsFragment,
    ): Promise<{
        type: PaymentMethodType;
        gateway: GatewayType;
        currency: Currency;
        metadataJson: any | undefined;
    }> {
        const currency = checkCurrency(
            transaction.chargedAmount.currency ||
                transaction.authorizePendingAmount.currency,
        );

        const createdBy =
            transaction.createdBy?.__typename === "App"
                ? transaction.createdBy.name
                : undefined;

        let gateway: GatewayType | undefined = undefined;
        let paymentMethod: PaymentMethodType | undefined = undefined;
        let metadataJson: any | undefined = undefined;

        if (createdBy?.toLowerCase().includes("authorize.net")) {
            gateway = GatewayType.authorizeNet;
            paymentMethod = PaymentMethodType.card;
        }
        if (createdBy?.toLowerCase().includes("manual payment method")) {
            gateway = GatewayType.banktransfer;

            /**
             * manual payment methods can set the metadata method
             */
            const method = transaction.privateMetadata.find(
                (x) => x.key === "method",
            )?.value;
            const echeck = transaction.privateMetadata.find(
                (x) => x.key === "echeck",
            )?.value;
            const prepayment =
                transaction.privateMetadata.find((x) => x.key === "prepayment")
                    ?.value || method === "prepayment";

            const customerCredit = method === "customerCredit";
            if (echeck || prepayment || customerCredit) {
                if (prepayment) {
                    paymentMethod = PaymentMethodType.banktransfer;
                }
                if (customerCredit) {
                    gateway = GatewayType.customerCredit;
                    paymentMethod = PaymentMethodType.customerCredit;
                }
                if (echeck) {
                    paymentMethod = PaymentMethodType.echeck;

                    const parsedData = JSON.parse(echeck);
                    if (
                        !parsedData.accountNumber ||
                        !parsedData.routingNumber
                    ) {
                        throw new Error(
                            `Method echeck, but missing accountNumber or routingNumber for transaction ${transaction.id}`,
                        );
                    }
                    metadataJson = await krypto.encrypt(
                        JSON.stringify(parsedData),
                    );
                }
            }
        }

        if (!gateway) {
            throw new Error(
                `Unknown gateway for transaction ${transaction.id}. Created by: ${createdBy}`,
            );
        }
        if (!paymentMethod) {
            throw new Error(
                `Unknown payment method for transaction ${
                    transaction.id
                } - metadata: ${
                    JSON.stringify(transaction.privateMetadata) || "undefined"
                }, gateway: ${gateway}`,
            );
        }

        return { currency, gateway, type: paymentMethod, metadataJson };
    }

    public async syncToECI(): Promise<void> {
        const cronState = await this.cronState.get(); // TODO add gte date filter for better scheduling so orders are most likely synced first

        const now = new Date();
        let createdGte: string;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 2).toISOString();
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            createdGte = subHours(cronState.lastRun, 3).toISOString();
            this.logger.info(
                `Setting GTE date to ${createdGte}. Asking Saleor for all orders with lastUpdated GTE.`,
            );
        }

        const result = await queryWithPagination(({ first, after }) =>
            this.saleorClient.saleorCronPayments({
                first,
                after,
                updatedAtGte: createdGte,
            }),
        );

        // Only sync active payments. For exampe if a payment was captured twice and only one was successfull, the unsuccessfull payment is unactive and should be filtered out.
        const payments = result.orders?.edges
            .flatMap((order) => order.node.payments)
            .filter((payment) => payment?.isActive)
            /**
             * We only sync fully charged payments right now
             */
            .filter(
                (payment) =>
                    payment?.chargeStatus ===
                    PaymentChargeStatusEnum.FullyCharged,
            );

        /**
         * We only sync successfull transactions, that
         * are authorized or charged successfully. We look at the most recent
         * transaction events for each payment.
         */
        const successfullTransactionsTransactionApi = result.orders?.edges
            .flatMap((order) => order.node.transactions)
            /**
             * Check, if any of the events is a successfull authorization or charge
             */
            .filter(
                (transaction) =>
                    transaction?.events.some(
                        (e) => e.type === "AUTHORIZATION_SUCCESS",
                    ) ||
                    transaction?.events.some(
                        (e) => e.type === "CHARGE_SUCCESS",
                    ),
            );

        if (!payments && !successfullTransactionsTransactionApi) {
            this.logger.info(
                "Saleor returned no orders with transactions. Don't sync anything",
            );
            return;
        }

        this.logger.info(`Syncing ${payments?.length} payments`);
        /**
         * Process legacy payments
         */
        if (payments?.length) {
            for (const payment of payments) {
                // TODO add try/catch Warning handle logic // TODO rewrite all continues with Warning try/catch logger
                if (!payment || !payment?.id) continue;
                if (!payment?.order?.id) {
                    this.logger.warn(
                        `Can't sync payment ${payment.id} - No related order id given`,
                    );
                    continue;
                }
                const saleorOrder = payment.order;

                this.logger.info(
                    `Processing payment for order ${saleorOrder.number} - ${payment.id}`,
                    {
                        referenceNumber: payment?.transactions?.[0]?.token,
                        saleorPaymentId: payment.id,
                    },
                );
                if (typeof saleorOrder.number !== "string") continue;

                /**
                 * The full order number including prefix
                 */
                const prefixedOrderNumber = `${this.orderPrefix}-${saleorOrder.number}`;

                const lowercaseEmail = saleorOrder.userEmail;

                if (!lowercaseEmail) {
                    this.logger.error(
                        `Did not receive an email address for this payment from saleor. Can't upsert payment`,
                    );
                    continue;
                }

                /**
                 * Filter out the not successfull transactions and the authorization transactions
                 */
                const successfullTransactions = payment.transactions
                    ?.filter((tr) => tr?.isSuccess)
                    .filter((tr) => tr.kind !== "AUTH");
                if (
                    !successfullTransactions ||
                    successfullTransactions?.length === 0
                ) {
                    throw new Error(
                        `No successfull transaction included in payment. Cant't sync ${payment.id}.`,
                    );
                }
                if (successfullTransactions?.length > 1) {
                    // Do not throw if gateway is triebwork.payments.rechnung because in the old version this was possible.
                    if (payment.gateway !== "triebwork.payments.rechnung") {
                        throw new Error(
                            `Multiple successfull transaction included in payment. Cant't sync ${
                                payment.id
                            }. - ${payment.order.number}. ${JSON.stringify(
                                successfullTransactions,
                            )}`,
                        );
                    }
                }
                let paymentReference = successfullTransactions?.[0]?.token;

                // TODO include payment status failed, fully charged etc. somehow!!
                // TODO test failed payments etc.
                let gatewayType: GatewayType;
                let methodType: PaymentMethodType;
                // modern webhook based integration have the schema `app:17:triebwork.payments.rechnung` and not `triebwork.payments.rechnung`
                const gatewayId = payment.gateway.startsWith("app")
                    ? payment.gateway.split(":")?.[2]
                    : payment.gateway;

                if (gatewayId === "mirumee.payments.braintree") {
                    gatewayType = "braintree";
                    // new braintree implementation has a bug and classifies PayPal payments as card payment
                    if (payment.paymentMethodType === "card") {
                        if (payment.creditCard) {
                            methodType = "card";
                        } else {
                            methodType = "paypal";
                        }
                        // old Braintree PayPal integration sets paymentMethodType correctly
                    } else if (payment.paymentMethodType === "paypal") {
                        methodType = "paypal";
                        // Edge case if applepay does not give the details back
                    } else if (
                        payment.paymentMethodType === "" &&
                        payment.creditCard === null
                    ) {
                        methodType = "card";
                    }
                } else if (gatewayId === "triebwork.payments.rechnung") {
                    methodType = "banktransfer";
                    gatewayType = "banktransfer";
                }
                if (!gatewayType!) {
                    throw new Error(
                        `Could not determine gatewayType for payment ${payment.id} with gateway ` +
                            `${payment.gateway} and paymentMethodType ${payment.paymentMethodType}.`,
                    );
                }
                if (!methodType!) {
                    throw new Error(
                        `Could not determine methodType for payment ${payment.id} with gateway ` +
                            `${payment.gateway} and paymentMethodType ${payment.paymentMethodType}.`,
                    );
                }

                const paymentMethodConnect: Prisma.PaymentMethodCreateNestedOneWithoutPaymentsInput =
                    {
                        connect: {
                            gatewayType_methodType_currency_tenantId: {
                                gatewayType,
                                methodType,
                                currency: checkCurrency(
                                    payment.total?.currency,
                                ),
                                tenantId: this.tenantId,
                            },
                        },
                    };
                // TODO wäre es nicht sicherer und einfacher den connect direkt mit orderNumber_tenantId zu machen, (Siehe INFO unten)
                // damit wir keine Payments aus saleor importieren welche keiner Order zugeordnet sind. Der Fall
                // sollte normalerweiße ja eh nicht vorkommen dass es in Saleor eine Payment ohne Order gibt richtig?
                // Dann wäre schonmal eine Fehlerquelle weniger da im Payment -> Zoho sync.
                const orderExist = await this.db.order.findUnique({
                    where: {
                        orderNumber_tenantId: {
                            orderNumber: prefixedOrderNumber,
                            tenantId: this.tenantId,
                        },
                    },
                    include: {
                        payments: true,
                    },
                });
                if (!orderExist) {
                    this.logger.info(
                        `No ECI order with number ${prefixedOrderNumber} found! Skipping..`,
                    );
                    continue;
                }

                if (
                    !paymentReference ||
                    paymentReference === "NONE_VORKASSE_TOKEN"
                ) {
                    // check, if we received this payment from a different system and need to connect them together
                    const matchingPayment = orderExist.payments.find(
                        (p) => p.amount === payment.total?.amount,
                    );
                    if (matchingPayment) {
                        /**
                         * Setting the reference number to the already existing one, to correctly match this saleor payment
                         * with an internal eci payment
                         */
                        paymentReference = matchingPayment.referenceNumber;
                        this.logger.info(
                            `Connecting saleor payment ${payment.id} - order ${payment.order.number} with ECI payment ${paymentReference}`,
                        );
                    } else {
                        this.logger.warn(
                            `No payment gateway transaction Id / or NONE_VORKASSE_TOKEN given. We use this value as internal payment reference. Cant't sync ${payment.id}`,
                        );
                        continue;
                    }
                }
                const orderConnect:
                    | Prisma.OrderCreateNestedOneWithoutPaymentsInput
                    | undefined = orderExist
                    ? {
                          connect: {
                              id: orderExist.id,
                          },
                      }
                    : undefined;

                // check, if we already have this saleor order created, so that we can
                // connect the payment
                // TODO: selbes hier wie oben mit order, lieber hier failen und mit nächstem retry anlegen (kann durch besseres scheduling vermieden werden.)
                const existingSaleorOrder =
                    await this.db.saleorOrder.findUnique({
                        where: {
                            id_installedSaleorAppId: {
                                id: saleorOrder.id,
                                installedSaleorAppId:
                                    this.installedSaleorApp.id,
                            },
                        },
                    });
                const saleorOrderConnect = existingSaleorOrder
                    ? {
                          connect: {
                              id_installedSaleorAppId: {
                                  id: existingSaleorOrder?.id,
                                  installedSaleorAppId:
                                      this.installedSaleorApp.id,
                              },
                          },
                      }
                    : undefined;

                const existingContact = await this.db.contact.findUnique({
                    where: {
                        email_tenantId: {
                            tenantId: this.tenantId,
                            email: lowercaseEmail,
                        },
                    },
                });

                if (!existingContact) {
                    this.logger.info(
                        `No contact found for email ${lowercaseEmail}. Can't upsert payment now - skipping`,
                    );
                    continue;
                }

                await this.db.saleorPayment.upsert({
                    where: {
                        id_installedSaleorAppId: {
                            id: payment.id,
                            installedSaleorAppId: this.installedSaleorApp.id,
                        },
                    },
                    create: {
                        id: payment.id,
                        createdAt: payment?.created,
                        updatedAt: payment?.modified,
                        saleorOrder: saleorOrderConnect,
                        installedSaleorApp: {
                            connect: {
                                id: this.installedSaleorApp.id,
                            },
                        },
                        payment: {
                            connectOrCreate: {
                                where: {
                                    referenceNumber_tenantId: {
                                        referenceNumber: paymentReference,
                                        tenantId: this.tenantId,
                                    },
                                },
                                create: {
                                    id: id.id("payment"),
                                    amount: payment.total?.amount as number,
                                    referenceNumber: paymentReference,
                                    date: payment.created,
                                    mainContact: {
                                        connect: {
                                            id: existingContact.id,
                                        },
                                    },
                                    tenant: {
                                        connect: {
                                            id: this.tenantId,
                                        },
                                    },
                                    paymentMethod: paymentMethodConnect,
                                    order: orderConnect,
                                },
                            },
                        },
                    },
                    update: {
                        createdAt: payment?.created,
                        updatedAt: payment?.modified,
                        saleorOrder: saleorOrderConnect,
                        payment: {
                            connectOrCreate: {
                                where: {
                                    referenceNumber_tenantId: {
                                        referenceNumber: paymentReference,
                                        tenantId: this.tenantId,
                                    },
                                },
                                create: {
                                    id: id.id("payment"),
                                    amount: payment.total?.amount as number,
                                    referenceNumber: paymentReference,
                                    tenant: {
                                        connect: {
                                            id: this.tenantId,
                                        },
                                    },
                                    paymentMethod: paymentMethodConnect,
                                    mainContact: {
                                        connect: {
                                            id: existingContact.id,
                                        },
                                    },
                                    order: orderConnect,
                                },
                            },
                            update: {
                                order: orderConnect,
                            },
                        },
                    },
                });
            }
        }

        /**
         * Process the transactions
         */
        if (successfullTransactionsTransactionApi?.length) {
            this.logger.info(
                `Processing ${successfullTransactionsTransactionApi.length} successfull transactions`,
                {
                    orderNumbers: successfullTransactionsTransactionApi.map(
                        (t) => t.order?.number,
                    ),
                },
            );
            for (const transaction of successfullTransactionsTransactionApi) {
                const lowercaseEmail =
                    transaction.order?.userEmail?.toLowerCase();
                /**
                 * We check if the pspReference is in a format like 1069951317-1081461880
                 * should be improved with metadata!
                 */
                const isPaymentProfile =
                    transaction.pspReference?.match(/\d{8,10}-\d{8,10}/);
                const paymentProfileId = isPaymentProfile
                    ? transaction.pspReference
                    : undefined;
                const paymentReference = isPaymentProfile
                    ? transaction.id
                    : transaction.pspReference;

                if (!paymentReference) {
                    this.logger.info(
                        `No payment reference found for transaction ${transaction.id}. Skipping`,
                        {
                            orderNumber: transaction.order?.number,
                            saleorOrderId: transaction.order?.id,
                            transactionId: transaction.id,
                        },
                    );
                    continue;
                }
                if (!lowercaseEmail) {
                    this.logger.info(
                        `No email found for transaction ${transaction.id}. Skipping`,
                        {
                            transactionId: transaction.id,
                            orderNumber: transaction.order?.number,
                            saleorOrderId: transaction.order?.id,
                        },
                    );
                    continue;
                }
                this.logger.debug(`Starting to process transaction`, {
                    transactionId: transaction.id,
                    orderNumber: transaction.order?.number,
                    authorizePendingAmount: transaction.authorizePendingAmount,
                    chargePendingAmount: transaction.chargePendingAmount,
                    chargedAmount: transaction.chargedAmount,
                    authorizedAmount: transaction.authorizedAmount,
                    pspReference: transaction.pspReference,
                    email: transaction.order?.userEmail,
                    paymentReference,
                    paymentProfileId,
                    isPaymentProfil: !!isPaymentProfile,
                });
                if (!transaction.order?.id) {
                    this.logger.info(
                        `No order found for transaction ${transaction.id}. Skipping`,
                        {
                            transactionId: transaction.id,
                            orderNumber: transaction.order?.number,
                            saleorOrderId: transaction.order?.id,
                        },
                    );
                    continue;
                }
                if (
                    transaction.authorizePendingAmount.amount > 0 ||
                    transaction.chargePendingAmount.amount > 0
                ) {
                    this.logger.info(
                        `Transaction ${transaction.id} is not fully captured. Skipping`,
                        {
                            transactionId: transaction.id,
                            orderNumber: transaction.order?.number,
                            saleorOrderId: transaction.order?.id,
                        },
                    );
                    continue;
                }

                /**
                 * check, that we don't have both authorized and charged amount set. We can't handle this case
                 */
                if (
                    transaction.authorizePendingAmount.amount > 0 &&
                    transaction.chargePendingAmount.amount > 0
                ) {
                    this.logger.info(
                        `Transaction ${transaction.id} has both authorized and charged amount set. Skipping`,
                        {
                            transactionId: transaction.id,
                            orderNumber: transaction.order?.number,
                            saleorOrderId: transaction.order?.id,
                        },
                    );
                    continue;
                }

                /**
                 * We currently just pull charged or authorized transactions in
                 */
                const paymentStatus: PaymentStatus =
                    transaction.chargedAmount.amount > 0
                        ? "paid"
                        : "authorized";

                const amount =
                    transaction.chargedAmount.amount ||
                    transaction.authorizedAmount.amount;

                if (!amount) {
                    this.logger.info(
                        `No amount found for transaction ${transaction.id}. Skipping`,
                        {
                            orderNumber: transaction.order?.number,
                            saleorOrderId: transaction.order?.id,
                            transactionId: transaction.id,
                        },
                    );
                    continue;
                }

                const saleorOrder = await this.db.saleorOrder.findUnique({
                    where: {
                        id_installedSaleorAppId: {
                            id: transaction.order.id,
                            installedSaleorAppId: this.installedSaleorApp.id,
                        },
                    },
                });

                /**
                 * Handle the case of imported orders / manual created transactions by staff users
                 */
                if (transaction.pspReference) {
                    const existingPayment = await this.db.payment.findUnique({
                        where: {
                            referenceNumber_tenantId: {
                                referenceNumber: transaction.pspReference,
                                tenantId: this.tenantId,
                            },
                        },
                        include: {
                            order: true,
                            saleorPayment: {
                                where: {
                                    installedSaleorAppId:
                                        this.installedSaleorApp.id,
                                },
                            },
                        },
                    });

                    if (existingPayment && existingPayment.amount === amount) {
                        /**
                         * We don't need to create a new saleor payment, if the existing one
                         * is already connected to the transaction
                         */
                        if (
                            existingPayment.saleorPayment.length &&
                            existingPayment.saleorPayment[0]?.id ===
                                transaction.id &&
                            existingPayment.orderId === saleorOrder?.orderId
                        ) {
                            continue;
                        }
                        const schemabaseOrderId = saleorOrder?.orderId;

                        if (!schemabaseOrderId) {
                            this.logger.error(
                                `No order id found for transaction ${transaction.id}`,
                                { saleorOrderId: transaction.order?.id },
                            );
                            continue;
                        }

                        // is a wrong order connected to this payment?
                        if (existingPayment.orderId !== saleorOrder?.orderId) {
                            this.logger.info(
                                `Payment ${transaction.pspReference} has a different order attached than we would assume! Upserting this`,
                                {
                                    transactionId: transaction.id,
                                    orderNumber: transaction.order?.number,
                                    saleorOrderId: transaction.order?.id,
                                },
                            );
                        }

                        this.logger.info(
                            `Payment ${transaction.pspReference} already exists. Connecting this Saleor payment to it`,
                            {
                                transactionId: transaction.id,
                                orderNumber: transaction.order?.number,
                                saleorOrderId: transaction.order?.id,
                            },
                        );
                        await this.db.saleorPayment.upsert({
                            where: {
                                id_installedSaleorAppId: {
                                    id: transaction.id,
                                    installedSaleorAppId:
                                        this.installedSaleorApp.id,
                                },
                            },
                            create: {
                                id: transaction.id,
                                createdAt: new Date(transaction.createdAt),
                                updatedAt: new Date(transaction.modifiedAt),
                                installedSaleorApp: {
                                    connect: {
                                        id: this.installedSaleorApp.id,
                                    },
                                },
                                payment: {
                                    connect: {
                                        id: existingPayment.id,
                                    },
                                },
                            },
                            update: {
                                updatedAt: new Date(transaction.modifiedAt),
                                payment: {
                                    connect: {
                                        id: existingPayment.id,
                                    },
                                    update: {
                                        referenceNumber: paymentReference,
                                        order: {
                                            connect: {
                                                id: saleorOrder?.orderId,
                                            },
                                        },
                                    },
                                },
                            },
                        });
                        continue;
                    }
                }

                /**
                 * Test, if we can process this transaction
                 */
                try {
                    await this.transactionToPaymentMethod(transaction);
                } catch (error) {
                    this.logger.error(
                        `Failed to process transaction ${transaction.id}. Skipping: ${error}`,
                        {
                            orderNumber: transaction.order?.number,
                        },
                    );
                    continue;
                }

                const { type, gateway, currency, metadataJson } =
                    await this.transactionToPaymentMethod(transaction);

                this.logger.info(`Processing transaction ${transaction.id}`, {
                    paymentStatus,
                    paymentReference,
                    userEmail: lowercaseEmail,
                    orderNumber: transaction.order?.number,
                    schemabaseOrderId: saleorOrder?.orderId,
                    saleorOrderNumber: saleorOrder?.orderNumber,
                    gateway,
                    type,
                    paymentProfileId,
                });

                if (!saleorOrder) {
                    this.logger.info(
                        `No order found for transaction ${transaction.id}. Skipping`,
                        {
                            saleorOrderId: transaction.order?.id,
                            orderNumber: transaction.order?.number,
                        },
                    );
                    continue;
                }

                try {
                    await this.db.saleorPayment.upsert({
                        where: {
                            id_installedSaleorAppId: {
                                id: transaction.id,
                                installedSaleorAppId:
                                    this.installedSaleorApp.id,
                            },
                        },
                        create: {
                            id: transaction.id,
                            installedSaleorApp: {
                                connect: {
                                    id: this.installedSaleorApp.id,
                                },
                            },
                            updatedAt: transaction.modifiedAt,
                            createdAt: transaction.createdAt,
                            payment: {
                                connectOrCreate: {
                                    where: {
                                        referenceNumber_tenantId: {
                                            referenceNumber: paymentReference,
                                            tenantId: this.tenantId,
                                        },
                                    },
                                    create: {
                                        id: id.id("payment"),
                                        amount,
                                        referenceNumber: paymentReference,
                                        paymentProfileId,
                                        metadataJson,
                                        currency,
                                        date: transaction.createdAt,
                                        status: paymentStatus,
                                        tenant: {
                                            connect: {
                                                id: this.tenantId,
                                            },
                                        },
                                        paymentMethod: {
                                            connectOrCreate: {
                                                where: {
                                                    gatewayType_methodType_currency_tenantId:
                                                        {
                                                            gatewayType:
                                                                gateway,
                                                            methodType: type,
                                                            currency,
                                                            tenantId:
                                                                this.tenantId,
                                                        },
                                                },
                                                create: {
                                                    id: id.id("paymentMethod"),
                                                    gatewayType: gateway,
                                                    methodType: type,
                                                    currency,
                                                    tenant: {
                                                        connect: {
                                                            id: this.tenantId,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        mainContact: {
                                            connect: {
                                                email_tenantId: {
                                                    email: lowercaseEmail,
                                                    tenantId: this.tenantId,
                                                },
                                            },
                                        },
                                        order: {
                                            connect: {
                                                id: saleorOrder.orderId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        update: {
                            updatedAt: transaction.modifiedAt,
                            createdAt: transaction.createdAt,
                            payment: {
                                update: {
                                    status: paymentStatus,
                                    paymentProfileId,
                                    order: {
                                        connect: {
                                            id: saleorOrder.orderId,
                                        },
                                    },
                                },
                            },
                        },
                    });
                } catch (error) {
                    throw new Error(
                        `Failed to create payment for transaction ${
                            transaction.id
                        }: ${JSON.stringify(error)}`,
                    );
                }
            }
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }

    /**
     * Should be run AFTER syncToECI() - all orders with a related SaleorOrder
     * and related payments. Tries to create these payments in saleor
     */
    public async syncFromECI(): Promise<void> {
        this.logger.info(
            "Asking DB for all Payments, that we need to create in Saleor",
        );
        /**
         * We search all payments that have a related saleor order, but that don't have any related payments in saleor,
         * but related payment in our DB. This happens, when you charge the customer in a 3rd party system
         *
         * This query is expensive right now! It uses many to many relation, which is not possible to improve / index
         */

        const paymentsNotYetInSaleor = await this.db.payment.findMany({
            where: {
                order: {
                    saleorOrders: {
                        some: {
                            installedSaleorAppId: this.installedSaleorApp.id,
                        },
                    },
                },
                // We can have multiple payments for one order. We need to find payments that do not yet have a related saleor payment
                saleorPayment: {
                    none: {
                        installedSaleorAppId: this.installedSaleorApp.id,
                    },
                },
                tenantId: this.tenantId,
            },
            include: {
                order: {
                    select: {
                        saleorOrders: true,
                    },
                },
            },
        });

        this.logger.info(
            `Received ${paymentsNotYetInSaleor.length} payments that we try to create in Saleor`,
            {
                paymentIds: paymentsNotYetInSaleor.map((p) => p.id),
            },
        );

        for (const payment of paymentsNotYetInSaleor) {
            const saleorOrder = payment.order?.saleorOrders.find(
                (o) => o.installedSaleorAppId === this.installedSaleorApp.id,
            )?.id;
            if (!saleorOrder) {
                this.logger.error(`Something went wrong`);
                continue;
            }
            this.logger.info(
                `Working on payment ${payment.id} - ${payment.referenceNumber} for saleor order ${saleorOrder}`,
            );

            if (this.installedSaleorApp.useTransactionApi) {
                await this.createTransactionInSaleor(saleorOrder, payment);
            } else {
                await this.createPaymentInSaleor(saleorOrder, payment);
            }

            await sleep(800);
        }
    }

    private async createPaymentInSaleor(
        saleorOrder: string,
        payment: Payment,
    ): Promise<void> {
        // Pull current order data from saleor - only capture payment, if payment
        // does not exit yet. Uses the orderCapture mutation from saleor
        try {
            const data = await this.saleorClient.paymentCreate({
                id: saleorOrder,
                amount: payment.amount,
            });
            if (data.orderCapture && data?.orderCapture?.errors?.length > 0) {
                this.logger.error(JSON.stringify(data.orderCapture?.errors));
                return;
            }
            const allPayments = data.orderCapture?.order?.payments;
            /**
             * Check, if we really have a payment in saleor, that is matching the one we expected to be created
             */
            const matchingPayment = allPayments?.find(
                (p) =>
                    p.capturedAmount?.amount === payment.amount &&
                    p.chargeStatus === PaymentChargeStatusEnum.FullyCharged,
            );

            if (matchingPayment) {
                await this.db.saleorPayment.create({
                    data: {
                        id: matchingPayment.id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        installedSaleorApp: {
                            connect: {
                                id: this.installedSaleorApp.id,
                            },
                        },
                        payment: {
                            connect: {
                                id: payment.id,
                            },
                        },
                    },
                });
            }
        } catch (error) {
            this.logger.error(JSON.stringify(error));
        }
    }

    private async createTransactionInSaleor(
        saleorOrder: string,
        payment: Payment,
    ): Promise<void> {
        // Pull current order data from saleor - only capture payment, if payment
        // does not exit yet. Uses the orderCapture mutation from saleor
        try {
            const data = await this.saleorClient.CreateManualTransaction({
                orderId: saleorOrder,
                amountCharged: payment.amount,
                pspReference: payment.referenceNumber,
                currency: payment.currency?.toString() || "USD",
            });
            if (
                data.transactionCreate?.errors &&
                data?.transactionCreate?.errors?.length
            ) {
                this.logger.error(
                    JSON.stringify(data.transactionCreate?.errors),
                );
                return;
            }
            if (!data.transactionCreate?.transaction?.id) {
                this.logger.error(
                    `No transaction id returned for payment ${payment.id}`,
                );
                return;
            }

            await this.db.saleorPayment.create({
                data: {
                    id: data.transactionCreate.transaction.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    installedSaleorApp: {
                        connect: {
                            id: this.installedSaleorApp.id,
                        },
                    },
                    payment: {
                        connect: {
                            id: payment.id,
                        },
                    },
                },
            });
        } catch (error) {
            this.logger.error(JSON.stringify(error));
        }
    }
}
