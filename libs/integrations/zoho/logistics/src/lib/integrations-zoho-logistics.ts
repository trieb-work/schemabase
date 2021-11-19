import { ZohoClientInstance } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/util/logger";
import { HttpError } from "@eci/util/errors";

export type Return = {
  creation_time: string;
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
  getCurrentPackageStats: () => Promise<Return>;
}

type CustomFields = {
  currentOrdersReadyToFulfill: string;
  nextFiveDaysOrders: string;
  currentBulkOrders: string;
  nextFiveDaysBulkOrders: string;
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
    this.logger = config.logger.with({ integration: "zoho-logistics" });
    this.customFields = config.customFields;
  }

  public static async new(config: {
    zoho: ZohoClientInstance;
    logger: ILogger;
    customFields: CustomFields;
  }): Promise<LogisticStats> {
    const instance = new LogisticStats(config);
    if (!config.customFields.currentBulkOrders) {
      throw new HttpError(
        500,
        "customFields.currentBulkOrders config is missing!",
      );
    }
    if (!config.customFields.currentOrdersReadyToFulfill) {
      throw new HttpError(
        500,
        "customFields.currentOrdersReadyToFulfill config is missing!",
      );
    }

    await instance.zoho.authenticate();

    return instance;
  }

  public async getCurrentPackageStats(): Promise<Return> {
    this.logger.info("fetching salesorders from Zoho");
    const now = new Date().toUTCString();
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
    const nextFiveDaysOrders = (
      await this.zoho.searchSalesOrdersWithScrolling({
        customViewID: this.customFields.nextFiveDaysOrders,
      })
    ).length;
    const nextFiveDaysBulkOrders = (
      await this.zoho.searchSalesOrdersWithScrolling({
        customViewID: this.customFields.nextFiveDaysBulkOrders,
      })
    ).length;

    return {
      orders: {
        ready_to_fulfill: {
          current: currentOrdersReady,
          next_five_days: nextFiveDaysOrders,
        },
        bulk_orders: {
          current: currentBulkOrders,
          next_five_days: nextFiveDaysBulkOrders,
        },
        total: {
          current: currentBulkOrders + currentOrdersReady,
          next_five_days: nextFiveDaysBulkOrders,
        },
      },
      creation_time: now,
    };
  }
}
