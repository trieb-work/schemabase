import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts/dist/v2";
import { RedisConnection, WorkflowScheduler } from "@eci/pkg/scheduler/scheduler";
import { createWorkflowFactory } from "@eci/pkg/scheduler/workflow";
import { ZohoSyncInvoicesWorkflow } from "./workflows";

interface CronClients {
    logger: ILogger;
    prisma: PrismaClient;
    redisConnection: RedisConnection;
}

async function prismaZohoAppEntryToClient(zohoApp: ZohoApp): Promise<Zoho> {
    return new Zoho(await ZohoApiClient.fromOAuth({
        orgId: zohoApp.orgId,
        client: {
            id: zohoApp.clientId,
            secret: zohoApp.clientSecret,
        },
    }));
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
            select: {
                id: true,
                tenantId: true,
                syncInvoices: true,
                syncOrders: true,
                syncPayments: true,
                syncProductStocks: true,
                zohoApp: true,
                installedSaleorApp: true,
            },
            where: {
                enabled: true
            }
        })
        for (const enabledZohoIntegration of enabledZohoIntegrations) {
            const zoho = await prismaZohoAppEntryToClient(enabledZohoIntegration.zohoApp);
            const commonWorkflowClients = { 
                ...this.clients,
                zoho
            };
            const commonCronConfig = {
                cron: `*/5 * * * *`, // every 5min
                timeout: 5 * 60, // 5min timeout
            }
            const commonWorkflowConfig = {
                zohoApp: enabledZohoIntegration.zohoApp
            };
            if (enabledZohoIntegration.syncInvoices) {
                this.scheduler.schedule(
                    createWorkflowFactory(ZohoSyncInvoicesWorkflow, commonWorkflowClients, commonWorkflowConfig),
                    { ...commonCronConfig, offset: 0, },
                    [enabledZohoIntegration.tenantId, enabledZohoIntegration.id]
                );
            }
            // if(enabledZohoIntegration.syncOrders){
            //     this.scheduler.schedule(
            //         createWorkflowFactory(ZohoSyncOrdersWorkflow, commonWorkflowClients, commonWorkflowConfig),
            //         { ...commonCronConfig, offset: 0, },
            //         [enabledZohoIntegration.tenantId, enabledZohoIntegration.id]
            //     );
            // }
            // if(enabledZohoIntegration.syncProductStocks){
            //     this.scheduler.schedule(
            //         createWorkflowFactory(ZohoSyncProductStocksWorkflow, commonWorkflowClients, commonWorkflowConfig),
            //         { ...commonCronConfig, offset: 0, },
            //         [enabledZohoIntegration.tenantId, enabledZohoIntegration.id]
            //     );
            // }
            // if(enabledZohoIntegration.syncPayments){
            //     this.scheduler.schedule(
            //         createWorkflowFactory(ZohoSyncPaymentsWorkflow, commonWorkflowClients, commonWorkflowConfig),
            //         { ...commonCronConfig, offset: 0, },
            //         [enabledZohoIntegration.tenantId, enabledZohoIntegration.id]
            //     );
            // }
        }
        this.clients.logger.info("Successfully scheduled all Zoho workflows");
    }
}