import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorAttributeSyncService } from "@eci/pkg/integration-saleor-entities/src/attributes";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorAttributeSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type SaleorAttributeSyncWorkflowConfig = {
    installedSaleorAppId: string;
    orderPrefix: string;
};

export class SaleorAttributeSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private installedSaleorAppId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: SaleorAttributeSyncWorkflowClients,
        config: SaleorAttributeSyncWorkflowConfig,
    ) {
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.logger = ctx.logger.with({
            workflow: SaleorAttributeSyncWf.name,
            installedSaleorAppId: this.installedSaleorAppId,
        });
        this.prisma = clients.prisma;
    }

    public async run(): Promise<void> {
        this.logger.info("Starting saleor Attribute sync workflow run");
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry(
                this.installedSaleorAppId,
                this.prisma,
            );

        const saleorAttributeSyncService = new SaleorAttributeSyncService({
            logger: this.logger,
            saleorClient,
            db: this.prisma,
            installedSaleorApp: installedSaleorApp,
            tenantId: installedSaleorApp.saleorApp.tenantId,
        });
        await saleorAttributeSyncService.syncToEci();
        await saleorAttributeSyncService.syncFromEci();

        this.logger.info("Finished saleor Attribute sync workflow run");
    }
}
