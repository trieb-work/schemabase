import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import {
  RedisConnection,
  WorkflowScheduler,
} from "@eci/pkg/scheduler/scheduler";
import { createWorkflowFactory } from "@eci/pkg/scheduler/workflow";
import { BraintreeTransactionSyncWorkflow } from "./workflows";
import { DHLTrackingSyncWorkflow } from "./workflows/dhlTrackingSync";
import { SaleorOrderSyncWorkflow } from "./workflows/saleorOrderSync";
import { SaleorPackageSyncWorkflow } from "./workflows/saleorPackageSync";
import { SaleorPaymentSyncWorkflow } from "./workflows/saleorPaymentSync";
import { SaleorProductSyncWorkflow } from "./workflows/saleorProductSync";
import { SaleorWarehouseSyncWorkflow } from "./workflows/saleorWarehouseSync";
import { XentralArtikelSyncWorkflow } from "./workflows/xentralArtikelSync";
import { XentralAuftragSyncWorkflow } from "./workflows/xentralAuftragSync";
import { XentralLieferscheinSyncWorkflow } from "./workflows/xentralLieferscheinSync";
import { ZohoContactSyncWorkflow } from "./workflows/zohoContactSync";
import { ZohoInvoiceSyncWorkflow } from "./workflows/zohoInvoiceSync";
import { ZohoItemSyncWorkflow } from "./workflows/zohoItemSync";
import { ZohoPackageSyncWorkflow } from "./workflows/zohoPackageSync";
import { ZohoPaymentSyncWorkflow } from "./workflows/zohoPaymentSync";
import { ZohoSalesOrderSyncWorkflow } from "./workflows/zohoSalesOrderSync";
import { ZohoTaxSyncWorkflow } from "./workflows/zohoTaxSync";
import { ZohoWarehouseSyncWorkflow } from "./workflows/zohoWarehouseSync";
import { DatevContactSyncWorkflow } from "./workflows/datevContactSync";

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
    /**
     * Scheduling of Zoho + Saleor Workflows
     */
    const enabledZohoIntegrations =
      await this.clients.prisma.saleorZohoIntegration.findMany({
        where: {
          enabled: true,
          // TODO + filter auf active subscription
        },
      });
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
          DatevContactSyncWorkflow,
          this.clients,
          commonWorkflowConfig,
        ),
        { ...commonCronConfig, offset: 0 },
        [tenantId, id],
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
            XentralArtikelSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 0 },
          [tenantId, id],
        );
      }

      if (enabledXentralApp.syncOrders) {
        new WorkflowScheduler(this.clients).schedule(
          createWorkflowFactory(
            XentralAuftragSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 20 },
          [tenantId, id],
        );
      }

      if (enabledXentralApp.syncPackages) {
        new WorkflowScheduler(this.clients).schedule(
          createWorkflowFactory(
            XentralLieferscheinSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 30 },
          [tenantId, id],
        );
      }
    }

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
          DHLTrackingSyncWorkflow,
          this.clients,
          commonWorkflowConfig,
        ),
        { ...commonCronConfig, offset: 0 },
        [tenantId, id],
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
            ZohoWarehouseSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 0 },
          [tenantId, id],
        );
      }

      if (enabledZohoApp.syncTaxes) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoTaxSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 1 },
          [tenantId, id],
        );
      }

      if (enabledZohoApp.syncContacts) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoContactSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 2 },
          [tenantId, id],
        );
      }

      if (enabledZohoApp.syncProducts) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoItemSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 3 },
          [tenantId, id],
        );
      }

      if (enabledZohoApp.syncOrders) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoSalesOrderSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 4 },
          [tenantId, id],
        );
      }

      if (enabledZohoApp.syncInvoices) {
        new WorkflowScheduler(this.clients).schedule(
          createWorkflowFactory(
            ZohoInvoiceSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 8 },
          [tenantId, id],
        );
      }

      if (enabledZohoApp.syncPayments) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoPaymentSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 10 },
          [tenantId, id],
        );
      }
    }

    /// LEGACY - Using Integrations, not data hub setup
    for (const enabledZohoIntegration of enabledZohoIntegrations) {
      const {
        zohoAppId,
        installedSaleorAppId,
        tenantId,
        id,
        cronScheduleZoho,
        cronTimeoutZoho,
        orderPrefix,
      } = enabledZohoIntegration;
      const commonCronConfig = {
        cron: cronScheduleZoho,
        timeout: cronTimeoutZoho,
      };
      const commonWorkflowConfig = {
        zohoAppId,
        installedSaleorAppId,
        orderPrefix,
      };

      if (enabledZohoIntegration.syncWarehouses) {
        new WorkflowScheduler(this.clients).schedule(
          createWorkflowFactory(
            SaleorWarehouseSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 0 },
          [tenantId, id],
        );
      }

      if (enabledZohoIntegration.syncProducts) {
        this.scheduler.schedule(
          createWorkflowFactory(
            SaleorProductSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 3 },
          [tenantId, id],
        );
      }
      if (enabledZohoIntegration.syncOrders) {
        this.scheduler.schedule(
          createWorkflowFactory(
            SaleorOrderSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 4 },
          [tenantId, id],
        );
      }

      if (enabledZohoIntegration.syncPayments) {
        new WorkflowScheduler(this.clients).schedule(
          createWorkflowFactory(
            SaleorPaymentSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 10 },
          [tenantId, id],
        );
      }
      if (enabledZohoIntegration.syncPackages) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoPackageSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 9 },
          [tenantId, id],
        );
        this.scheduler.schedule(
          createWorkflowFactory(
            SaleorPackageSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 9 },
          [tenantId, id],
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
        createWorkflowFactory(BraintreeTransactionSyncWorkflow, this.clients, {
          braintreeAppId: app.id,
        }),
        { ...commonCronConfig, offset: 0 },
        [tenantId, id],
      );
    }
  }
}
