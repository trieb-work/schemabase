import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorChannelAvailabilitySyncService } from "@eci/pkg/integration-saleor-entities/src/products/channelAvailability";

export type SaleorProductChannelSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type SaleorProductChannelSyncWorkflowConfig = {
    installedSaleorAppId: string;
};

export class SaleorProductChannelSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private installedSaleorAppId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: SaleorProductChannelSyncWorkflowClients,
        config: SaleorProductChannelSyncWorkflowConfig,
    ) {
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.logger = ctx.logger.with({
            workflow: SaleorProductChannelSyncWf.name,
            installedSaleorAppId: this.installedSaleorAppId,
        });
        this.prisma = clients.prisma;
        this.installedSaleorAppId = config.installedSaleorAppId;
    }

    /**
     * Sync all saleor products with the schemabase database
     */
    public async run(): Promise<void> {
        this.logger.info("Starting saleor product sync workflow run");
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry(
                this.installedSaleorAppId,
                this.prisma,
            );

        const saleorProductChannelSyncService =
            new SaleorChannelAvailabilitySyncService(
                this.prisma,
                installedSaleorApp.id,
                this.logger,
                saleorClient,
                installedSaleorApp.saleorApp.tenantId,
            );
        await saleorProductChannelSyncService.syncFromEci();

        this.logger.info("Finished saleor product channel sync workflow run");
    }
}
