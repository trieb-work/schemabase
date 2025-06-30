// eslint-disable-next-line max-len
import { ILogger } from "@eci/pkg/logger";
import { InstalledSaleorApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { VariantAndVariantStocks } from "@eci/pkg/integration-saleor-entities/src/products/variantsAndVariantStocks";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { subYears } from "date-fns";

export type SaleorNightlyStockSyncWorkflowClients = {
    prisma: PrismaClient;
};

export type SaleorNightlyStockSyncWorkflowConfig = {
    installedSaleorApp: InstalledSaleorApp;
};

/**
 * This workflow runs nightly to sync stocks from ECI to Saleor
 * with a large window (1 year) to catch any data that might have been missed
 * during regular syncs
 */
export class SaleorNightlyStockSyncWf implements Workflow {
    private prisma: PrismaClient;

    private logger: ILogger;

    private installedSaleorApp: InstalledSaleorApp;

    public constructor(
        ctx: RuntimeContext,
        clients: SaleorNightlyStockSyncWorkflowClients,
        config: SaleorNightlyStockSyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.installedSaleorApp = config.installedSaleorApp;
        this.logger = ctx.logger.with({
            workflow: SaleorNightlyStockSyncWf.name,
            installedSaleorAppId: config.installedSaleorApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info(
            `Starting Saleor nightly stock sync workflow run for ${this.installedSaleorApp.id}`,
        );

        try {
            const { client: saleorClient, installedSaleorApp } =
                await getSaleorClientAndEntry(
                    this.installedSaleorApp.id,
                    this.prisma,
                );

            // Use a 1-year window to ensure we catch any missed data
            const oneYearAgo = subYears(new Date(), 1);

            const variantAndVariantStocks = new VariantAndVariantStocks({
                logger: this.logger,
                db: this.prisma,
                saleorClient,
                installedSaleorAppId: installedSaleorApp.id,
            });

            // Sync stocks with a 1-year window to catch any missed data
            await variantAndVariantStocks.syncStocks(oneYearAgo);

            this.logger.info(
                `Completed Saleor nightly stock sync workflow run for ${this.installedSaleorApp.id}`,
            );
        } catch (error) {
            this.logger.error(
                `Error in Saleor nightly stock sync workflow for ${this.installedSaleorApp.id}: ${error}`,
            );
            throw error;
        }
    }
}
