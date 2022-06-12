import { Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { HttpError } from "@eci/pkg/errors";

export interface Return {
  /* eslint-disable camelcase */
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
  /* eslint-enable camelcase */
}

export interface ZohoLogisticsService {
  getCurrentPackageStats: () => Promise<Return>;
}

interface CustomFields {
  currentOrdersReadyToFulfill: string;
  nextFiveDaysOrders: string;
  currentBulkOrders: string;
  nextFiveDaysBulkOrders: string;
}

/**
 * LogisticsStats is a synchronous service that allows our logistics team to access information
 * about upcoming orders from zoho.
 * They will call our api and we either return cached data or fetch fresh data from zoho.
 */
export class LogisticStats implements ZohoLogisticsService {
  private readonly zoho: Zoho;

  private readonly logger: ILogger;

  private readonly customFields: CustomFields;

  private constructor(config: {
    zoho: Zoho;
    logger: ILogger;
    customFields: CustomFields;
  }) {
    this.zoho = config.zoho;
    this.logger = config.logger.with({ integration: "zoho-logistics" });
    this.customFields = config.customFields;
  }

  public static async new(config: {
    zoho: Zoho;
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

    return instance;
  }

  public async getCurrentPackageStats(): Promise<Return> {
    this.logger.debug("fetching salesorders from Zoho");
    const now = new Date().toUTCString();
    const currentOrdersReady = (
      await this.zoho.salesOrder.list({
        customViewId: this.customFields.currentOrdersReadyToFulfill,
      })
    ).length;
    const currentBulkOrders = (
      await this.zoho.salesOrder.list({
        customViewId: this.customFields.currentBulkOrders,
      })
    ).length;
    const nextFiveDaysOrders = (
      await this.zoho.salesOrder.list({
        customViewId: this.customFields.nextFiveDaysOrders,
      })
    ).length;
    const nextFiveDaysBulkOrders = (
      await this.zoho.salesOrder.list({
        customViewId: this.customFields.nextFiveDaysBulkOrders,
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
          next_five_days: nextFiveDaysOrders + nextFiveDaysBulkOrders,
        },
      },
      creation_time: now,
    };
  }
}
