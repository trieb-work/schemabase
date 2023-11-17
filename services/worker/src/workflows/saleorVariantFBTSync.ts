/**
 * Saleor variant frequently bought together workflow
 * Is a separate workflow, as the saleor product sync workflow is a
 * long running workflow
 */
import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { FrequentlyBoughtTogether } from "@eci/pkg/integration-saleor-entities/src/products/frequentlyBoughtTogether";

export type SaleorProductSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type SaleorProductSyncWorkflowConfig = {
    installedSaleorAppId: string;
};

export class SaleorVariantFBTSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private installedSaleorAppId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: SaleorProductSyncWorkflowClients,
        config: SaleorProductSyncWorkflowConfig,
    ) {
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.logger = ctx.logger.with({
            workflow: SaleorVariantFBTSyncWf.name,
            installedSaleorAppId: this.installedSaleorAppId,
        });
        this.prisma = clients.prisma;
        this.installedSaleorAppId = config.installedSaleorAppId;
    }

    /**
     * Sync all saleor products with the schemabase database
     */
    public async run(): Promise<void> {
        this.logger.info("Starting saleor fbt variant sync workflow run");
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry(
                this.installedSaleorAppId,
                this.prisma,
            );

        const frequentlyboughttogether = new FrequentlyBoughtTogether({
            db: this.prisma,
            logger: this.logger,
            saleorClient,
            installedSaleorAppId: this.installedSaleorAppId,
            tenantId: installedSaleorApp.saleorApp.tenantId,
        });
        await frequentlyboughttogether.syncVariants();

        this.logger.info("Finished saleor fbt variant sync workflow run");
    }
}
