import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { ZohoItemSyncService } from "@eci/pkg/integration-zoho-entities/src/items";
import { getZohoClientAndEntry } from "@eci/pkg/zoho/src/zoho";

export type ZohoItemSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type ZohoItemSyncWorkflowConfig = {
    zohoAppId: string;
};

export class ZohoItemSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private zohoAppId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: ZohoItemSyncWorkflowClients,
        config: ZohoItemSyncWorkflowConfig,
    ) {
        this.zohoAppId = config.zohoAppId;
        this.logger = ctx.logger.with({
            workflow: ZohoItemSyncWf.name,
            zohoAppId: this.zohoAppId,
        });
        this.prisma = clients.prisma;
        this.zohoAppId = config.zohoAppId;
    }

    /**
     * Sync all zoho invoices into ECI-DB
     */
    public async run(): Promise<void> {
        this.logger.info("Starting zoho item sync workflow run");
        const { client: zoho, zohoApp } = await getZohoClientAndEntry(
            this.zohoAppId,
            this.prisma,
            undefined,
        );
        const zohoItemSyncService = new ZohoItemSyncService({
            logger: this.logger,
            zoho,
            db: this.prisma,
            zohoApp,
        });
        await zohoItemSyncService.syncToECI();
        this.logger.info("Finished zoho item sync workflow run");
    }
}
