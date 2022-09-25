import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import {
  RedisConnection,
  WorkflowScheduler,
} from "@eci/pkg/scheduler/scheduler";
import { createWorkflowFactory } from "@eci/pkg/scheduler/workflow";
import { BraintreeTransactionSyncWorkflow } from "./workflows";
import { SaleorOrderSyncWorkflow } from "./workflows/saleorOrderSync";
import { SaleorPackageSyncWorkflow } from "./workflows/saleorPackageSync";
import { SaleorPaymentSyncWorkflow } from "./workflows/saleorPaymentSync";
import { SaleorProductSyncWorkflow } from "./workflows/saleorProductSync";
import { SaleorWarehouseSyncWorkflow } from "./workflows/saleorWarehouseSync";
import { ZohoContactSyncWorkflow } from "./workflows/zohoContactSync";
import { ZohoInvoiceSyncWorkflow } from "./workflows/zohoInvoiceSync";
import { ZohoItemSyncWorkflow } from "./workflows/zohoItemSync";
import { ZohoPackageSyncWorkflow } from "./workflows/zohoPackageSync";
import { ZohoPaymentSyncWorkflow } from "./workflows/zohoPaymentSync";
import { ZohoSalesOrderSyncWorkflow } from "./workflows/zohoSalesOrderSync";
import { ZohoTaxSyncWorkflow } from "./workflows/zohoTaxSync";
import { ZohoWarehouseSyncWorkflow } from "./workflows/zohoWarehouseSync";

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
            ZohoWarehouseSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 0 },
          [tenantId, id],
        );
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
      if (enabledZohoIntegration.syncTaxes) {
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
      if (enabledZohoIntegration.syncContacts) {
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
      if (enabledZohoIntegration.syncProducts) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoItemSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 3 },
          [tenantId, id],
        );

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
            ZohoSalesOrderSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 4 },
          [tenantId, id],
        );
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
      if (enabledZohoIntegration.syncInvoices) {
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
      if (enabledZohoIntegration.syncPayments) {
        this.scheduler.schedule(
          createWorkflowFactory(
            ZohoPaymentSyncWorkflow,
            this.clients,
            commonWorkflowConfig,
          ),
          { ...commonCronConfig, offset: 10 },
          [tenantId, id],
        );
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
