import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts/dist/v2";
import { RedisConnection, WorkflowScheduler } from "@eci/pkg/scheduler/scheduler";
import { createWorkflowFactory } from "@eci/pkg/scheduler/workflow";
import { ZohoSyncInvoicesWorkflow } from "./workflows";

interface CronClients {
    logger: ILogger;
    prisma: PrismaClient;
    redisConnection: RedisConnection;
}

export async function scheduleAllWorkflows(clients: CronClients) {
    const scheduler = new WorkflowScheduler(clients);

    /**
     * Scheduling of Zoho Workflows
     */
    const enabledZohoIntegrations = await clients.prisma.saleorZohoIntegration.findMany({
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
        const zoho = new Zoho(await ZohoApiClient.fromOAuth({
            orgId: enabledZohoIntegration.zohoApp.orgId,
            client: {
                id: enabledZohoIntegration.zohoApp.clientId,
                secret: enabledZohoIntegration.zohoApp.clientSecret,
            },
        }));
        const tenantClients = {
            zoho,
            logger: clients.logger,
            prisma: clients.prisma,
        }
        if (enabledZohoIntegration.syncInvoices) {
            scheduler.schedule(
                createWorkflowFactory(ZohoSyncInvoicesWorkflow, tenantClients, {
                    zohoApp: enabledZohoIntegration.zohoApp,
                }),
                {
                    cron: `*/5 * * * *`, // every 5min
                    timeout: 5 * 60, // 5min timeout
                },
                [enabledZohoIntegration.tenantId, enabledZohoIntegration.id]
            );
        }
        // if(enabledZohoIntegration.syncOrders){
        //     scheduler.schedule(
        //         createWorkflowFactory(ZohoSyncOrdersWorkflow, tenantClients, {
        //             zohoApp: enabledZohoIntegration.zohoApp,
        //         }),
        //         {
        //             cron: `*/5 * * * *`, // every 5min
        //             timeout: 5 * 60, // 5min timeout
        //         },
        //     );
        // }
        // if(enabledZohoIntegration.syncProductStocks){
        //     scheduler.schedule(
        //         createWorkflowFactory(ZohoSyncProductStocksWorkflow, tenantClients, {
        //             zohoApp: enabledZohoIntegration.zohoApp,
        //         }),
        //         {
        //             cron: `*/5 * * * *`, // every 5min
        //             timeout: 5 * 60, // 5min timeout
        //         },
        //     );
        // }
        // if(enabledZohoIntegration.syncPayments){
        //     scheduler.schedule(
        //         createWorkflowFactory(ZohoSyncPaymentsWorkflow, tenantClients, {
        //             zohoApp: enabledZohoIntegration.zohoApp,
        //         }),
        //         {
        //             cron: `*/5 * * * *`, // every 5min
        //             timeout: 5 * 60, // 5min timeout
        //         },
        //     );
        // }
    }
}