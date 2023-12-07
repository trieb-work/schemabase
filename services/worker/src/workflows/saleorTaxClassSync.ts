import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorTaxClassSyncService } from "@eci/pkg/integration-saleor-entities/src/taxes";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorTaxClassSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type SaleorTaxClassSyncWorkflowConfig = {
    installedSaleorAppId: string;
};

export class SaleorTaxClassSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private installedSaleorAppId: string;

    private ctx: RuntimeContext;

    public constructor(
        ctx: RuntimeContext,
        clients: SaleorTaxClassSyncWorkflowClients,
        config: SaleorTaxClassSyncWorkflowConfig,
    ) {
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.logger = ctx.logger.with({
            workflow: SaleorTaxClassSyncWf.name,
            installedSaleorAppId: this.installedSaleorAppId,
        });
        this.prisma = clients.prisma;
        this.ctx = ctx;
        this.installedSaleorAppId = config.installedSaleorAppId;
    }

    /**
     * Sync all saleor taxClasses with the schemabase database
     */
    public async run(): Promise<void> {
        this.logger.info("Starting saleor taxClasses sync workflow run");
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry(
                this.installedSaleorAppId,
                this.prisma,
            );

        const saleorTaxClassSyncService = new SaleorTaxClassSyncService({
            logger: this.logger,
            saleorClient,
            db: this.prisma,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            installedSaleorApp: installedSaleorApp,
        });
        await saleorTaxClassSyncService.syncToECI();
        this.ctx.job.updateProgress(50);
        await saleorTaxClassSyncService.syncFromECI();
        this.logger.info("Finished saleor taxClasses sync workflow run");
    }
}
