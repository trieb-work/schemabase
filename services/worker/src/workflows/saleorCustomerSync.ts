import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorCustomerSyncService } from "@eci/pkg/integration-saleor-entities/src/customers";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorCustomerSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type SaleorCustomerSyncWorkflowConfig = {
    installedSaleorAppId: string;
};

export class SaleorCustomerSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private installedSaleorAppId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: SaleorCustomerSyncWorkflowClients,
        config: SaleorCustomerSyncWorkflowConfig,
    ) {
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.logger = ctx.logger.with({
            workflow: SaleorCustomerSyncWf.name,
            installedSaleorAppId: this.installedSaleorAppId,
        });
        this.prisma = clients.prisma;
        this.installedSaleorAppId = config.installedSaleorAppId;
    }

    /**
     * Sync all saleor customers
     */
    public async run(): Promise<void> {
        this.logger.info("Starting saleor customer sync workflow run");
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry(
                this.installedSaleorAppId,
                this.prisma,
            );

        const zohoContactSyncService = new SaleorCustomerSyncService({
            logger: this.logger,
            saleorClient,
            db: this.prisma,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            installedSaleorAppId: this.installedSaleorAppId,
            channelSlug: installedSaleorApp.channelSlug || "",
        });
        await zohoContactSyncService.syncToECI();
        this.logger.info("Finished saleor customer sync workflow run");
    }
}
