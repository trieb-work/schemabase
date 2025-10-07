import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorProductSalesStatsSyncService } from "@eci/pkg/integration-saleor-entities/src/product-sales-stats";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorProductSalesStatsSyncWorkflowClients = {
    prisma: PrismaClient;
};

export type SaleorProductSalesStatsSyncWorkflowConfig = {
    installedSaleorAppId: string;
    timeframes?: number[]; // Default: [14, 30, 90]
    batchSize?: number; // Default: 50
};

export class SaleorProductSalesStatsSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private installedSaleorAppId: string;

    private ctx: RuntimeContext;

    private timeframes: number[];

    private batchSize: number;

    public constructor(
        ctx: RuntimeContext,
        clients: SaleorProductSalesStatsSyncWorkflowClients,
        config: SaleorProductSalesStatsSyncWorkflowConfig,
    ) {
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.timeframes = config.timeframes || [14, 30, 90];
        this.batchSize = config.batchSize || 50;
        this.logger = ctx.logger.with({
            workflow: SaleorProductSalesStatsSyncWf.name,
            installedSaleorAppId: this.installedSaleorAppId,
        });
        this.prisma = clients.prisma;
        this.ctx = ctx;
    }

    /**
     * Sync product sales stats to Saleor product metadata
     */
    public async run(): Promise<void> {
        this.logger.info("Starting Saleor product sales stats sync workflow");
        
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry(
                this.installedSaleorAppId,
                this.prisma,
            );

        const saleorProductSalesStatsSyncService = new SaleorProductSalesStatsSyncService({
            logger: this.logger,
            saleorClient,
            db: this.prisma,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            installedSaleorApp: installedSaleorApp,
            timeframes: this.timeframes,
            batchSize: this.batchSize,
        });

        this.ctx.job.updateProgress(10);
        const result = await saleorProductSalesStatsSyncService.syncProductSalesStats();
        this.ctx.job.updateProgress(100);

        this.logger.info("Finished Saleor product sales stats sync workflow", result);
    }
}
