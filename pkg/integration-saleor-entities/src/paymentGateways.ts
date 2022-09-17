import { ILogger } from "@eci/pkg/logger";
import { SaleorClient } from "@eci/pkg/saleor";
import { Prisma, PrismaClient } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { checkCurrency } from "@eci/pkg/normalization/src/currency";

interface SaleorPaymentGatewaySyncServiceConfig {
  saleorClient: SaleorClient;
  installedSaleorAppId: string;
  tenantId: string;
  db: PrismaClient;
  logger: ILogger;
}

export class SaleorPaymentGatewaySyncService {
  public readonly saleorClient: SaleorClient;

  private readonly logger: ILogger;

  public readonly installedSaleorAppId: string;

  public readonly tenantId: string;

  private readonly db: PrismaClient;

  public constructor(config: SaleorPaymentGatewaySyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.logger = config.logger;
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.tenantId = config.tenantId;
    this.db = config.db;
  }

  public async syncToECI(): Promise<void> {
    const response = await this.saleorClient.paymentGateways();

    const gateways = response?.shop?.availablePaymentGateways;
    if (!gateways || gateways?.length === 0) {
      this.logger.warn(
        "Got no available payment gateways from saleor. Can't sync",
      );
      return;
    }
    this.logger.info(
      `Syncing ${gateways?.length} gateway(s) to internal ECI DB`,
    );

    for (const gateway of gateways) {
      const connectOrCreatePaymentMethods: Prisma.Enumerable<Prisma.PaymentMethodCreateOrConnectWithoutSaleorPaymentGatewayInput> =
        gateway.currencies
          .flatMap(
            (
              uncheckedCurrency,
            ): Omit<
              Prisma.PaymentMethodCreateWithoutSaleorPaymentGatewayInput,
              "tenant" | "id"
            >[] => {
              const currency = checkCurrency(uncheckedCurrency);
              switch (gateway?.name?.toLowerCase()) {
                case "vorkasse": {
                  return [
                    {
                      currency,
                      methodType: "banktransfer",
                      gatewayType: "banktransfer",
                    },
                  ];
                }
                case "braintree": {
                  return [
                    {
                      currency,
                      methodType: "card",
                      gatewayType: "braintree",
                    },
                    {
                      currency,
                      methodType: "paypal",
                      gatewayType: "braintree",
                    },
                  ];
                }
              }
              return [];
            },
          )
          .map((paymentMethodData) => ({
            where: {
              gatewayType_methodType_currency_tenantId: {
                ...paymentMethodData,
                tenantId: this.tenantId,
              },
            },
            create: {
              ...paymentMethodData,
              id: id.id("paymentMethod"),
              tenant: {
                connect: {
                  id: this.tenantId,
                },
              },
            },
          }));

      await this.db.saleorPaymentGateway.upsert({
        where: {
          id_installedSaleorAppId: {
            id: gateway.id,
            installedSaleorAppId: this.installedSaleorAppId,
          },
        },
        create: {
          id: gateway.id,
          installedSaleorApp: {
            connect: {
              id: this.installedSaleorAppId,
            },
          },
          paymentMethods: {
            connectOrCreate: connectOrCreatePaymentMethods,
          },
        },
        update: {
          paymentMethods: {
            connectOrCreate: connectOrCreatePaymentMethods,
          },
        },
      });
      this.logger.info(
        `Updated saleor payment gateway ${gateway.id} with ${connectOrCreatePaymentMethods.length} payment method(s).`,
      );
    }
  }
}
