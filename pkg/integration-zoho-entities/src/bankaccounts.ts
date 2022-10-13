import type { Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { checkCurrency } from "@eci/pkg/normalization/src/currency";

export interface ZohoBankAccountsSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoApp;
}

export class ZohoBankAccountsSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoApp;

  private readonly tenantId: string;

  public constructor(config: ZohoBankAccountsSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
    this.tenantId = this.zohoApp.tenantId;
  }

  /**
   * Pull all bank accounts from Zoho and sync them with internal gateways
   */
  public async syncToECI() {
    const accounts = await this.zoho.bankaccount.list();
    for (const account of accounts) {
      try {
        const data = {
          name: account.account_name,
          currency: checkCurrency(account.currency_code), // TODO handle throw error
          active: account.is_active,
        };

        /**
         * Upsert the Zoho Bank Accounts. Don't link internal payment methods. We have to do that manually
         */
        await this.db.zohoBankAccount.upsert({
          where: {
            id_zohoAppId: {
              zohoAppId: this.zohoApp.id,
              id: account.account_id,
            },
          },
          create: {
            id: account.account_id,
            zohoApp: {
              connect: {
                id: this.zohoApp.id,
              },
            },
            ...data,
          },
          update: data,
        });
      } catch (err) {
        if (err instanceof Error) {
          this.logger.error(
            "An error occured during syncToECI zohoBankAccount upsert or currency check: " +
              err.message,
          );
        } else {
          this.logger.error(
            // eslint-disable-next-line max-len
            "An error occured during syncToECI zohoBankAccount upsert or currency check - UNKNOWN ERROR: " +
              JSON.stringify(err, null, 2),
          );
        }
      }
    }
    const zohoBankAccounts = await this.db.zohoBankAccount.findMany({
      where: {
        zohoAppId: this.zohoApp.id,
      },
      include: {
        paymentMethod: true,
      },
    });
    const zohoBankAccountsWithoutPaymentMethod = zohoBankAccounts.filter(
      (zba) => !zba.paymentMethod,
    );
    if (zohoBankAccountsWithoutPaymentMethod.length > 0) {
      this.logger.warn(
        // eslint-disable-next-line max-len
        `We have ${zohoBankAccountsWithoutPaymentMethod.length} zohoBankAccount(s) without payment method(s)`,
        {
          zohoBankAccountNamessWithoutPaymentMethod:
            zohoBankAccountsWithoutPaymentMethod.map((zba) => zba.name),
          zohoBankAccountIDsWithoutPaymentMethod:
            zohoBankAccountsWithoutPaymentMethod.map((zba) => zba.id),
        },
      );
    }
    const zohoBankAccountsWithWrongCurrency = zohoBankAccounts.filter(
      (zba) =>
        zba?.paymentMethod && zba?.paymentMethod?.currency !== zba?.currency,
    );
    if (zohoBankAccountsWithWrongCurrency.length > 0) {
      this.logger.error(
        // eslint-disable-next-line max-len
        `We have ${zohoBankAccountsWithWrongCurrency.length} zohoBankAccount(s) with wrong currency`,
        {
          zohoBankAccountNamessWithoutPaymentMethod:
            zohoBankAccountsWithWrongCurrency.map((zba) => zba.name),
          zohoBankAccountIDsWithoutPaymentMethod:
            zohoBankAccountsWithWrongCurrency.map((zba) => zba.id),
        },
      );
    }
    const paymentMethod = await this.db.paymentMethod.findMany({
      where: {
        tenantId: this.tenantId,
      },
      include: {
        zohoBankAccounts: true,
      },
    });
    const paymentMethodWithoutZohoBankAccounts = paymentMethod.filter(
      (pm) => pm.zohoBankAccounts.length === 0,
    );
    if (paymentMethodWithoutZohoBankAccounts.length > 0) {
      this.logger.warn(
        `We have ${paymentMethodWithoutZohoBankAccounts.length} payment method(s) without zoho ` +
          `bank accounts attached. This will potentially make problems in Payments Sync.`,
        {
          zohoBankAccountGatewayTypeWithoutPaymentMethod:
            paymentMethodWithoutZohoBankAccounts.map((pm) => pm.gatewayType),
          zohoBankAccountMethodTypeWithoutPaymentMethod:
            paymentMethodWithoutZohoBankAccounts.map((pm) => pm.methodType),
          zohoBankAccountCurrenciesWithoutPaymentMethod:
            paymentMethodWithoutZohoBankAccounts.map((pm) => pm.currency),
          zohoBankAccountIDsWithoutPaymentMethod:
            paymentMethodWithoutZohoBankAccounts.map((pm) => pm.id),
        },
      );
    }
    const paymentMethodWithWrongCurrency = paymentMethod.filter(
      (pm) =>
        pm?.zohoBankAccounts &&
        pm?.zohoBankAccounts?.some((zba) => zba.currency !== pm?.currency),
    );
    if (paymentMethodWithWrongCurrency.length > 0) {
      this.logger.error(
        `We have ${paymentMethodWithWrongCurrency.length} payment method(s) with wrong currency`,
        {
          zohoBankAccountGatewayTypeWithoutPaymentMethod:
            paymentMethodWithWrongCurrency.map((pm) => pm.gatewayType),
          zohoBankAccountMethodTypeWithoutPaymentMethod:
            paymentMethodWithWrongCurrency.map((pm) => pm.methodType),
          zohoBankAccountCurrenciesWithoutPaymentMethod:
            paymentMethodWithWrongCurrency.map((pm) => pm.currency),
          zohoBankAccountIDsWithoutPaymentMethod:
            paymentMethodWithWrongCurrency.map((pm) => pm.id),
        },
      );
    }
  }
}
