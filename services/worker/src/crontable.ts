import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import {
  RedisConnection,
  WorkflowScheduler,
} from "@eci/pkg/scheduler/scheduler";
import { createWorkflowFactory } from "@eci/pkg/scheduler/workflow";
import { BraintreeTransactionSyncWf } from "./workflows";
import { DHLTrackingSyncWf } from "./workflows/dhlTrackingSync";
import { SaleorOrderSyncWf } from "./workflows/saleorOrderSync";
import { SaleorPackageSyncWf } from "./workflows/saleorPackageSync";
import { SaleorPaymentSyncWf } from "./workflows/saleorPaymentSync";
import { SaleorProductSyncWf } from "./workflows/saleorProductSync";
import { SaleorWarehouseSyncWf } from "./workflows/saleorWarehouseSync";
import { XentralArtikelSyncWf } from "./workflows/xentralArtikelSync";
import { XentralAuftragSyncWf } from "./workflows/xentralAuftragSync";
import { XentralLieferscheinSyncWf } from "./workflows/xentralLieferscheinSync";
import { ZohoContactSyncWf } from "./workflows/zohoContactSync";
import { ZohoInvoiceSyncWf } from "./workflows/zohoInvoiceSync";
import { ZohoItemSyncWf } from "./workflows/zohoItemSync";
import { ZohoPackageSyncWf } from "./workflows/zohoPackageSync";
import { ZohoPaymentSyncWf } from "./workflows/zohoPaymentSync";
import { ZohoSalesOrderSyncWf } from "./workflows/zohoSalesOrderSync";
import { ZohoTaxSyncWf } from "./workflows/zohoTaxSync";
import { ZohoWarehouseSyncWf } from "./workflows/zohoWarehouseSync";
import { DatevContactSyncWf } from "./workflows/datevContactSync";
import { UPSTrackingSyncWf } from "./workflows/upsTrackingSync";

interface CronClients {
  logger: ILogger;
  prisma: PrismaClient;
  redisConnection: RedisConnection;
}

export class CronTable {
  private readonly clients: CronClients;

  readonly scheduler: WorkflowScheduler;

  constructor(clients: CronClients) {
    this.scheduler = new WorkflowScheduler(clients);
    this.clients = clients;
  }

  public async scheduleTenantWorkflows(): Promise<void> {
    this.clients.logger.info("Starting the scheduling of all workflows...");

    const enabledZohoApps = await this.clients.prisma.zohoApp.findMany({
      where: {
        enabled: true,
      },
    });
    const enabledXentralApps =
      await this.clients.prisma.xentralProxyApp.findMany({
        where: {
          enabled: true,
        },
      });

    const enabledDhlTrackingApps =
      await this.clients.prisma.dHLTrackingApp.findMany({
        where: {
          enabled: true,
        },
      });

    const enabledUpsTrackingApps =
      await this.clients.prisma.uPSTrackingApp.findMany({
        where: {
          enabled: true,
        },
      });

    const enabledDatevApps = await this.clients.prisma.datevApp.findMany({
      where: {
        enabled: true,
      },
    });

    for (const enabledDatevApp of enabledDatevApps) {
      const { id, cronTimeout, cronSchedule, tenantId } = enabledDatevApp;
      const commonCronConfig = {
        cron: cronSchedule,
        timeout: cronTimeout,
      };
      const commonWorkflowConfig = {
        datevApp: enabledDatevApp,
      };

      new WorkflowScheduler(this.clients).schedule(
        createWorkflowFactory(
          DatevContactSyncWf,
          this.clients,
          commonWorkflowConfig,
        ),
        { ...commonCronConfig, offset: 0 },
        [tenantId.substring(0, 5), id.substring(0, 5)],
      );
    }

    /**
     * XentralApp Workflows
     */
    for (const enabledXentralApp of enabledXentralApps) {
      const { id, cronTimeout, cronSchedule, tenantId } = enabledXentralApp;
      const commonCronConfig = {
        cron: cronSchedule,
        timeout: cronTimeout,
      };
      const commonWorkflowConfig = {
        xentralProxyApp: enabledXentralApp,
      };

      if (enabledXentralApp.syncProducts) {
        new WorkflowScheduler(this.clients).schedule(
          createWorkflowFactory(
            XentralArtikelSyncWf,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 0 },
          [tenantId.substring(0, 5), id.substring(0, 5)],
        );
      }

      if (enabledXentralApp.syncOrders) {
        new WorkflowScheduler(this.clients).schedule(
          createWorkflowFactory(
            XentralAuftragSyncWf,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 20 },
          [tenantId.substring(0, 5), id.substring(0, 5)],
        );
      }

      if (enabledXentralApp.syncPackages) {
        new WorkflowScheduler(this.clients).schedule(
          createWorkflowFactory(
            XentralLieferscheinSyncWf,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 30 },
          [tenantId.substring(0, 5), id.substring(0, 5)],
        );
      }
    }

    /**
     * DHL Tracking App Workflow
     */
    for (const enabledDhlTrackingApp of enabledDhlTrackingApps) {
      const { id, cronTimeout, cronSchedule, tenantId } = enabledDhlTrackingApp;
      const commonCronConfig = {
        cron: cronSchedule,
        timeout: cronTimeout,
      };
      const commonWorkflowConfig = {
        dhlTrackingApp: enabledDhlTrackingApp,
      };
      new WorkflowScheduler(this.clients).schedule(
        createWorkflowFactory(
          DHLTrackingSyncWf,
          this.clients,
          commonWorkflowConfig,
        ),
        { ...commonCronConfig, offset: 0 },
        [tenantId.substring(0, 5), id.substring(0, 5)],
      );
    }

    /**
     * UPS Tracking App Workflow
     */
    for (const enabledUpsTrackingApp of enabledUpsTrackingApps) {
      const { id, cronTimeout, cronSchedule, tenantId } = enabledUpsTrackingApp;
      const commonCronConfig = {
        cron: cronSchedule,
        timeout: cronTimeout,
      };
      const commonWorkflowConfig = {
        upsTrackingApp: enabledUpsTrackingApp,
      };
      new WorkflowScheduler(this.clients).schedule(
        createWorkflowFactory(
          UPSTrackingSyncWf,
          this.clients,
          commonWorkflowConfig,
        ),
        { ...commonCronConfig, offset: 0 },
        [tenantId.substring(0, 5), id.substring(0, 5)],
      );
    }

    /**
     * Zoho Workflows
     */
    for (const enabledZohoApp of enabledZohoApps) {
      const { cronSchedule, id, cronTimeout, tenantId } = enabledZohoApp;
      const commonCronConfig = {
        cron: cronSchedule,
        timeout: cronTimeout,
      };
      const commonWorkflowConfig = {
        zohoAppId: id,
      };

      if (enabledZohoApp.syncWarehouses) {
        new WorkflowScheduler(this.clients).schedule(
          createWorkflowFactory(
            ZohoWarehouseSyncWf,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 0 },
          [tenantId.substring(0, 5), id.substring(0, 5)],
        );
      }

      if (enabledZohoApp.syncTaxes) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoTaxSyncWf,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 1 },
          [tenantId.substring(0, 5), id.substring(0, 5)],
        );
      }

      if (enabledZohoApp.syncContacts) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoContactSyncWf,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 2 },
          [tenantId.substring(0, 5), id.substring(0, 5)],
        );
      }

      if (enabledZohoApp.syncProducts) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoItemSyncWf,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 3 },
          [tenantId.substring(0, 5), id.substring(0, 5)],
        );
      }

      if (enabledZohoApp.syncOrders) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoSalesOrderSyncWf,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 4 },
          [tenantId.substring(0, 5), id.substring(0, 5)],
        );
      }

      if (enabledZohoApp.syncInvoices) {
        new WorkflowScheduler(this.clients).schedule(
          createWorkflowFactory(
            ZohoInvoiceSyncWf,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 8 },
          [tenantId.substring(0, 5), id.substring(0, 5)],
        );
      }

      if (enabledZohoApp.syncPayments) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoPaymentSyncWf,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 10 },
          [tenantId.substring(0, 5), id.substring(0, 5)],
        );
      }
    }

    /**
     * Schedule all braintree workflows
     */
    const enabledBraintreeApps =
      await this.clients.prisma.braintreeApp.findMany({
        where: {
          enabled: true,
        },
      });
    for (const app of enabledBraintreeApps) {
      const { tenantId, cronSchedule, cronTimeout, id } = app;
      const commonCronConfig = {
        cron: cronSchedule,
        timeout: cronTimeout,
      };
      new WorkflowScheduler(this.clients).schedule(
        createWorkflowFactory(BraintreeTransactionSyncWf, this.clients, {
          braintreeAppId: app.id,
        }),
        { ...commonCronConfig, offset: 0 },
        [tenantId.substring(0, 5), id.substring(0, 5)],
      );
    }
  }
}
