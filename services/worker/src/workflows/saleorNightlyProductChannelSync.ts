import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorChannelAvailabilitySyncService } from "@eci/pkg/integration-saleor-entities/src/products/channelAvailability";
import { subYears } from "date-fns";

export type SaleorProductChannelSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type SaleorProductChannelSyncWorkflowConfig = {
    installedSaleorAppId: string;
};

export class SaleorNightlyProductChannelSyncWf implements Workflow {
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
            workflow: SaleorNightlyProductChannelSyncWf.name,
            installedSaleorAppId: this.installedSaleorAppId,
        });
        this.prisma = clients.prisma;
        this.installedSaleorAppId = config.installedSaleorAppId;
    }

    /**
     * Sync all saleor product channel availability with the schemabase database
     */
    public async run(): Promise<void> {
        this.logger.info("Starting saleor product channel sync workflow run");
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry(
                this.installedSaleorAppId,
                this.prisma,
            );

        // Use a 1-year window to ensure we catch any missed data
        const twoYearsAgo = subYears(new Date(), 2);

        const saleorProductChannelSyncService =
            new SaleorChannelAvailabilitySyncService(
                this.prisma,
                installedSaleorApp.id,
                this.logger,
                saleorClient,
                installedSaleorApp.saleorApp.tenantId,
            );
        await saleorProductChannelSyncService.syncFromEci(twoYearsAgo);

        this.logger.info("Finished saleor product channel sync workflow run");
    }
}
