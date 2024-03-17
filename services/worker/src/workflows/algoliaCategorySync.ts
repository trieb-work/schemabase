import { AlgoliaCategorySyncService } from "@eci/pkg/integration-algolia/src/categories";
import { ILogger } from "@eci/pkg/logger";
import { AlgoliaApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type AlgoliaCategorySyncWorkflowClients = {
    prisma: PrismaClient;
};

export type AlgoliaCategorySyncWorkflowConfig = {
    algoliaApp: AlgoliaApp;
};

export class AlgoliaCategorySyncWf implements Workflow {
    private prisma: PrismaClient;

    private logger: ILogger;

    private algoliaApp: AlgoliaApp;

    public constructor(
        ctx: RuntimeContext,
        clients: AlgoliaCategorySyncWorkflowClients,
        config: AlgoliaCategorySyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.algoliaApp = config.algoliaApp;
        this.logger = ctx.logger.with({
            workflow: AlgoliaCategorySyncWf.name,
            algoliaAppId: config.algoliaApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info("Starting algolia category sync workflow run");

        const algoliaCategorySyncService = new AlgoliaCategorySyncService({
            logger: this.logger,
            db: this.prisma,
            algoliaApp: this.algoliaApp,
        });
        await algoliaCategorySyncService.syncFromECI();
        this.logger.info("Finished algolia category sync workflow run");
    }
}
