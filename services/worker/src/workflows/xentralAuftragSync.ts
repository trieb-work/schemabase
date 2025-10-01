import { XentralProxyOrderSyncService } from "@eci/pkg/integration-xentralProxy-entities";
import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { XentralXmlClient } from "@eci/pkg/xentral";
import { XentralRestClient } from "@eci/pkg/xentral/src/rest";

export type XentralAuftragSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type XentralAuftragSyncWorkflowConfig = {
    xentralProxyApp: XentralProxyApp;
};

export class XentralAuftragSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private xentralProxyApp: XentralProxyApp;

    private ctx: RuntimeContext;

    public constructor(
        ctx: RuntimeContext,
        clients: XentralAuftragSyncWorkflowClients,
        config: XentralAuftragSyncWorkflowConfig,
    ) {
        this.xentralProxyApp = config.xentralProxyApp;
        this.logger = ctx.logger.with({
            workflow: XentralAuftragSyncWf.name,
            xentralProxyApp: this.xentralProxyApp,
        });
        this.prisma = clients.prisma;
        this.ctx = ctx;
    }

    /**
     * Sync all zoho invoices into ECI-DB
     */
    public async run(): Promise<void> {
        this.logger.info(
            `Starting xentral Auftrag sync workflow run for xentral URL ${this.xentralProxyApp.url}`,
        );

        const xentralXmlClient = new XentralXmlClient(this.xentralProxyApp);
        const xentralRestClient = new XentralRestClient(this.xentralProxyApp);
        const xentralAuftragSync = new XentralProxyOrderSyncService({
            xentralXmlClient,
            xentralRestClient,
            logger: this.logger,
            db: this.prisma,
            xentralProxyApp: this.xentralProxyApp,
            redisConnection: this.ctx.redisConnection,
        });
        await xentralAuftragSync.syncFromECI();
        this.logger.info("Finished xentral Auftrag sync workflow run");
    }
}
