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
      try{
        const data = {
          name: account.account_name,
          currency: checkCurrency(account.currency_code), // TODO handle throw error
          active: account.is_active,
        }
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
      } catch(err){
        if(err instanceof Error) {
          this.logger.error("An error occured during syncToECI zohoBankAccount upsert or currency check: "+err.message);
        } else {
          this.logger.error("An error occured during syncToECI zohoBankAccount upsert or currency check - UNKNOWN ERROR: "+JSON.stringify(err, null, 2));
        }
      }
    }
    const zohoBankAccounts = await this.db.zohoBankAccount.findMany({
      where: {
        zohoAppId: this.zohoApp.id,
      },
      include: {
        paymentMethods: true
      }
    })
    const zohoBankAccountsWithoutPaymentMethods = zohoBankAccounts.filter((zba) => zba.paymentMethods?.length === 0)
    if(zohoBankAccountsWithoutPaymentMethods.length > 0) {
      this.logger.warn(`We have ${zohoBankAccountsWithoutPaymentMethods.length} zohoBankAccount(s) without payment method(s)`, {
        zohoBankAccountNamessWithoutPaymentMethods: zohoBankAccountsWithoutPaymentMethods.map((zba) => zba.name),
        zohoBankAccountIDsWithoutPaymentMethods: zohoBankAccountsWithoutPaymentMethods.map((zba) => zba.id)
      })
    }
    const zohoBankAccountsWitWrongCurrency = zohoBankAccounts.filter((zba) => !zba.paymentMethods || zba.paymentMethods?.filter((pm) => pm.currency !== zba.currency).length > 0);
    if(zohoBankAccountsWitWrongCurrency.length > 0){
      this.logger.error(`We have ${zohoBankAccountsWitWrongCurrency.length} zohoBankAccount(s) with wrong currency`, {
        zohoBankAccountNamessWithoutPaymentMethods: zohoBankAccountsWitWrongCurrency.map((zba) => zba.name),
        zohoBankAccountIDsWithoutPaymentMethods: zohoBankAccountsWitWrongCurrency.map((zba) => zba.id)
      })
    }
    const paymentMethods = await this.db.paymentMethod.findMany({
      where: {
        tenantId: this.tenantId,
      },
      include: {
        zohoBankAccount: true
      }
    })
    const paymentMethodsWithoutZohoBankAccounts = paymentMethods.filter((pm) => !pm.zohoBankAccount);
    if(paymentMethodsWithoutZohoBankAccounts.length > 0) {
      this.logger.warn(`We have ${paymentMethodsWithoutZohoBankAccounts.length} payment method(s) without zoho bank accounts attached. This will potentially make problems in Payments Sync.`, {
        zohoBankAccountGatewayTypeWithoutPaymentMethods: paymentMethodsWithoutZohoBankAccounts.map((pm) => pm.gatewayType),
        zohoBankAccountMethodTypeWithoutPaymentMethods: paymentMethodsWithoutZohoBankAccounts.map((pm) => pm.methodType),
        zohoBankAccountCurrenciesWithoutPaymentMethods: paymentMethodsWithoutZohoBankAccounts.map((pm) => pm.currency),
        zohoBankAccountIDsWithoutPaymentMethods: paymentMethodsWithoutZohoBankAccounts.map((pm) => pm.id)
      })
    }
    const paymentMethodsWithWrongCurrency = paymentMethods.filter((pm) => pm.zohoBankAccount && pm.zohoBankAccount?.currency !== pm.currency);
    if(paymentMethodsWithWrongCurrency.length > 0){
      this.logger.error(`We have ${paymentMethodsWithWrongCurrency.length} payment method(s) with wrong currency`, {
        zohoBankAccountGatewayTypeWithoutPaymentMethods: paymentMethodsWithWrongCurrency.map((pm) => pm.gatewayType),
        zohoBankAccountMethodTypeWithoutPaymentMethods: paymentMethodsWithWrongCurrency.map((pm) => pm.methodType),
        zohoBankAccountCurrenciesWithoutPaymentMethods: paymentMethodsWithWrongCurrency.map((pm) => pm.currency),
        zohoBankAccountIDsWithoutPaymentMethods: paymentMethodsWithWrongCurrency.map((pm) => pm.id)
      })
    }
  }
}
