import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorChannelSyncService } from "@eci/pkg/integration-saleor-entities/src/channels";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorChannelClients = {
    prisma: PrismaClient;
};
export type SaleorChannelConfig = {
    installedSaleorAppId: string;
};

export class SaleorChannelSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private installedSaleorAppId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: SaleorChannelClients,
        config: SaleorChannelConfig,
    ) {
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.logger = ctx.logger.with({
            workflow: SaleorChannelSyncWf.name,
            installedSaleorAppId: this.installedSaleorAppId,
        });
        this.prisma = clients.prisma;
        this.installedSaleorAppId = config.installedSaleorAppId;
    }

    public async run(): Promise<void> {
        this.logger.info("Starting saleor channel sync workflow run");
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry(
                this.installedSaleorAppId,
                this.prisma,
            );

        const saleorChannelSyncService = new SaleorChannelSyncService({
            logger: this.logger,
            saleorClient,
            db: this.prisma,
            installedSaleorApp: installedSaleorApp,
            tenantId: installedSaleorApp.saleorApp.tenantId,
        });
        await saleorChannelSyncService.syncToEci();

        this.logger.info("Finished saleor channel sync workflow run");
    }
}
