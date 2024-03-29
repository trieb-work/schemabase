import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorOrderSyncService } from "@eci/pkg/integration-saleor-entities/src/orders";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorOrderSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type SaleorOrderSyncWorkflowConfig = {
    installedSaleorAppId: string;
    orderPrefix: string;
};

export class SaleorOrderSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private installedSaleorAppId: string;

    private orderPrefix: string;

    public constructor(
        ctx: RuntimeContext,
        clients: SaleorOrderSyncWorkflowClients,
        config: SaleorOrderSyncWorkflowConfig,
    ) {
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.logger = ctx.logger.with({
            workflow: SaleorOrderSyncWf.name,
            installedSaleorAppId: this.installedSaleorAppId,
        });
        this.prisma = clients.prisma;
        this.orderPrefix = config.orderPrefix;
    }

    /**
     * Sync all zoho invoices into ECI-DB
     */
    public async run(): Promise<void> {
        this.logger.info("Starting saleor order sync workflow run");
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry(
                this.installedSaleorAppId,
                this.prisma,
            );

        const saleorOrderSync = new SaleorOrderSyncService({
            logger: this.logger,
            saleorClient,
            db: this.prisma,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            installedSaleorApp: installedSaleorApp,
            channelSlug: installedSaleorApp.channelSlug || "",
            orderPrefix: this.orderPrefix,
        });
        await saleorOrderSync.syncToECI();
        await saleorOrderSync.syncFromECI();

        this.logger.info("Finished saleor order sync workflow run");
    }
}
