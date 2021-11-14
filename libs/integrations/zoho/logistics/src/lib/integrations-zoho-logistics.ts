import { ZohoClientInstance } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/util/logger";

export type Return = {
  orders: {
    ready_to_fulfill: {
      current: number;
      next_five_days: number;
    };
    bulk_orders: {
      current: number;
      next_five_days: number;
    };
    total: {
      current: number;
      next_five_days: number;
    };
  };
};

export interface ZohoLogisticsService {
  getCurrentPackageStats: (storefrontProductUrl: string) => Promise<Return>;
}

type CustomFields = {
  currentOrdersReadyToFulfill: string;
  nextFiveDaysOrders: string;
  currentBulkOrders: string;
};

export class LogisticStats implements ZohoLogisticsService {
  private readonly zoho: ZohoClientInstance;

  private readonly logger: ILogger;

  private readonly customFields: CustomFields;

  private constructor(config: {
    zoho: ZohoClientInstance;
    logger: ILogger;
    customFields: CustomFields;
  }) {
    this.zoho = config.zoho;
    this.logger = config.logger;
    this.customFields = config.customFields;
  }

  public static async new(config: {
    zoho: ZohoClientInstance;
    logger: ILogger;
    customFields: CustomFields;
  }): Promise<LogisticStats> {
    const instance = new LogisticStats(config);
    if (!config.customFields)
      config.logger.error("Custom fields config is missing!");

    await instance.zoho.authenticate();

    return instance;
  }

  public async getCurrentPackageStats(): Promise<Return> {
    this.logger.info(
      "Logistics Integration: making upstream requests to Zoho now",
    );
    const currentOrdersReady = (
      await this.zoho.searchSalesOrdersWithScrolling({
        customViewID: this.customFields.currentOrdersReadyToFulfill,
      })
    ).length;
    const currentBulkOrders = (
      await this.zoho.searchSalesOrdersWithScrolling({
        customViewID: this.customFields.currentBulkOrders,
      })
    ).length;

    return {
      orders: {
        ready_to_fulfill: {
          current: currentOrdersReady,
          next_five_days: 0,
        },
        bulk_orders: {
          current: currentBulkOrders,
          next_five_days: 0,
        },
        total: {
          current: currentBulkOrders + currentOrdersReady,
          next_five_days: 0,
        },
      },
    };
  }
}
