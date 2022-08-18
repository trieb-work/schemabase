/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import {
  queryWithPagination,
  SaleorCronPackagesOverviewQuery,
  SaleorCreatePackageMutation,
  OrderFulfillInput,
  OrderFulfillLineInput,
} from "@eci/pkg/saleor";
import { PrismaClient } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";

interface XentralProxyPackageSyncServiceConfig {
  saleorClient: {
    saleorCronPackagesOverview: (variables: {
      first: number;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronPackagesOverviewQuery>;
    saleorCreatePackage: (variables: {
      order: string;
      input: OrderFulfillInput;
    }) => Promise<SaleorCreatePackageMutation>;
  };
  installedSaleorAppId: string;
  tenantId: string;
  db: PrismaClient;
  logger: ILogger;
  orderPrefix: string;
}

export class XentralProxyPackageSyncService {
  public readonly saleorClient: {
    saleorCronPackagesOverview: (variables: {
      first: number;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronPackagesOverviewQuery>;
    saleorCreatePackage: (variables: {
      order: string;
      input: OrderFulfillInput;
    }) => Promise<SaleorCreatePackageMutation>;
  };

  private readonly logger: ILogger;

  public readonly installedSaleorAppId: string;

  public readonly tenantId: string;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  private readonly orderPrefix: string;

  public constructor(config: XentralProxyPackageSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.logger = config.logger;
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.tenantId = config.tenantId;
    this.db = config.db;
    this.orderPrefix = config.orderPrefix;
    this.cronState = new CronStateHandler({
      tenantId: this.tenantId,
      appId: this.installedSaleorAppId,
      db: this.db,
      syncEntity: "packages",
    });
  }

  public async syncToECI(): Promise<void> {
    // für alle ECI-Orders ohne package
    // --> für jede order mit xentralAuftragId 
    //    --> request xentralProxy API (to get paket zusammensetzung mit tracking nummern)
    //        --> update packages in ECI-Orders
  }
}
