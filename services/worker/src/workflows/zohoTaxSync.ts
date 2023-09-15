import { ZohoTaxSyncService } from "@eci/pkg/integration-zoho-entities/src/taxes";
import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { getZohoClientAndEntry } from "@eci/pkg/zoho/src/zoho";

export type ZohoTaxSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type ZohoTaxSyncWorkflowConfig = {
    zohoAppId: string;
};

export class ZohoTaxSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private zohoAppId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: ZohoTaxSyncWorkflowClients,
        config: ZohoTaxSyncWorkflowConfig,
    ) {
        this.zohoAppId = config.zohoAppId;
        this.logger = ctx.logger.with({
            workflow: ZohoTaxSyncWf.name,
            zohoAppId: this.zohoAppId,
        });
        this.prisma = clients.prisma;
    }

    public async run(): Promise<void> {
        this.logger.info("Starting Zoho Tax sync workflow run");

        const { client: zoho, zohoApp } = await getZohoClientAndEntry(
            this.zohoAppId,
            this.prisma,
            undefined,
        );
        const zohoTaxSyncService = new ZohoTaxSyncService({
            logger: this.logger,
            zoho,
            db: this.prisma,
            zohoApp,
        });
        await zohoTaxSyncService.syncToECI();

        this.logger.info("Finished Zoho Tax sync workflow run");
    }
}
