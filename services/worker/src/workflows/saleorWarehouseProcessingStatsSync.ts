import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorWarehouseProcessingMetricsPageService } from "@eci/pkg/integration-saleor-entities";

export type SaleorWarehouseProcessingMetricsPageSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type SaleorWarehouseProcessingMetricsPageSyncWorkflowConfig = {
    installedSaleorAppId: string;
    orderPrefix: string;
};

export class SaleorWarehouseProcessingMetricsPageSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private installedSaleorAppId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: SaleorWarehouseProcessingMetricsPageSyncWorkflowClients,
        config: SaleorWarehouseProcessingMetricsPageSyncWorkflowConfig,
    ) {
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.logger = ctx.logger.with({
            workflow: SaleorWarehouseProcessingMetricsPageSyncWf.name,
            installedSaleorAppId: this.installedSaleorAppId,
        });
        this.prisma = clients.prisma;
    }

    public async run(): Promise<void> {
        this.logger.info(
            "Starting saleor WarehouseProcessingMetricsPage sync workflow run",
        );
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry(
                this.installedSaleorAppId,
                this.prisma,
            );

        const saleorWarehouseProcessingMetricsPageSyncService =
            new SaleorWarehouseProcessingMetricsPageService({
                logger: this.logger,
                saleorClient,
                db: this.prisma,
                installedSaleorAppId: this.installedSaleorAppId,
                tenantId: installedSaleorApp.saleorApp.tenantId,
            });
        await saleorWarehouseProcessingMetricsPageSyncService.syncWarehouseMetricsToSaleor();

        this.logger.info(
            "Finished saleor WarehouseProcessingMetricsPage sync workflow run",
        );
    }
}
