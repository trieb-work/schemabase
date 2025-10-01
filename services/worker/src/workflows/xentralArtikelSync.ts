import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { XentralProxyProductVariantSyncService } from "@eci/pkg/integration-xentralProxy-entities/src/artikel";

export type XentralArtikelSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type XentralArtikelSyncWorkflowConfig = {
    xentralProxyApp: XentralProxyApp;
};

export class XentralArtikelSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private xentralProxyApp: XentralProxyApp;

    public constructor(
        ctx: RuntimeContext,
        clients: XentralArtikelSyncWorkflowClients,
        config: XentralArtikelSyncWorkflowConfig,
    ) {
        this.xentralProxyApp = config.xentralProxyApp;
        this.logger = ctx.logger.with({
            workflow: XentralArtikelSyncWf.name,
            xentralProxyApp: this.xentralProxyApp,
        });
        this.prisma = clients.prisma;
    }

    /**
     * Sync all zoho invoices into ECI-DB
     */
    public async run(): Promise<void> {
        this.logger.info(
            `Starting xentral artikel sync workflow run for xentral URL ${this.xentralProxyApp.url}`,
        );

        const xentralArtikelSync = new XentralProxyProductVariantSyncService({
            logger: this.logger,
            db: this.prisma,
            xentralProxyApp: this.xentralProxyApp,
        });
        await xentralArtikelSync.syncFromECI();
        this.logger.info("Finished xentral artikel sync workflow run");
    }
}
