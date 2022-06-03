import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts/dist/v2";
import { RedisConnection, WorkflowScheduler } from "@eci/pkg/scheduler/scheduler";
import { createWorkflowFactory } from "@eci/pkg/scheduler/workflow";
import { ZohoContactSyncWorkflow, ZohoSyncInvoicesWorkflow } from "./workflows/zohoContactSync";

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
        this.clients.logger.info("Scheduling all workflows");
        /**
         * Scheduling of Zoho Workflows
         */
        const enabledZohoIntegrations = await this.clients.prisma.saleorZohoIntegration.findMany({
            where: {
                enabled: true
                // TODO + filter auf active subscription
            }
        })
        for (const enabledZohoIntegration of enabledZohoIntegrations) {
            const { zohoAppId, installedSaleorAppId, tenantId, id, cronScheduleZoho, cronTimeoutZoho } = enabledZohoIntegration;
            const commonCronConfig = { cron: cronScheduleZoho, timeout: cronTimeoutZoho };
            const commonWorkflowConfig = {
                zohoAppId, installedSaleorAppId
            };
            if (enabledZohoIntegration.syncContacts) {
                this.scheduler.schedule(
                    createWorkflowFactory(ZohoContactSyncWorkflow, this.clients, commonWorkflowConfig),
                    { ...commonCronConfig, offset: 0, },
                    [tenantId, id]
                );
            }
            // if(enabledZohoIntegration.syncOrders){
            //     this.scheduler.schedule(
            //         createWorkflowFactory(ZohoSyncOrdersWorkflow, commonWorkflowClients, commonWorkflowConfig),
            //         { ...commonCronConfig, offset: 1, },
            //         [enabledZohoIntegration.tenantId, enabledZohoIntegration.id]
            //     );
            // }
            // if(enabledZohoIntegration.syncProductStocks){
            //     this.scheduler.schedule(
            //         createWorkflowFactory(ZohoSyncProductStocksWorkflow, commonWorkflowClients, commonWorkflowConfig),
            //         { ...commonCronConfig, offset: 2, },
            //         [enabledZohoIntegration.tenantId, enabledZohoIntegration.id]
            //     );
            // }
            // if(enabledZohoIntegration.syncPayments){
            //     this.scheduler.schedule(
            //         createWorkflowFactory(ZohoSyncPaymentsWorkflow, commonWorkflowClients, commonWorkflowConfig),
            //         { ...commonCronConfig, offset: 3, },
            //         [enabledZohoIntegration.tenantId, enabledZohoIntegration.id]
            //     );
            // }
        }
        this.clients.logger.info("Successfully scheduled all Zoho workflows");
    }
}