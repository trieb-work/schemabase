import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import { AlgoliaApp, PrismaClient } from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { Algoliasearch, BatchRequest } from "algoliasearch";

interface AlgoliaCategorySyncServiceConfig {
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
    algoliaApp: AlgoliaApp;
    algoliaClient: Algoliasearch;
}

export class AlgoliaCategorySyncService {
    private readonly db: PrismaClient;

    private readonly logger: ILogger;

    private readonly algoliaApp: AlgoliaApp;

    private readonly algoliaClient: Algoliasearch;

    private readonly cronState: CronStateHandler;

    private readonly tenantId: string;

    constructor(config: AlgoliaCategorySyncServiceConfig) {
        this.db = config.db;
        this.logger = config.logger;
        this.algoliaApp = config.algoliaApp;
        this.tenantId = config.tenantId;
        this.algoliaClient = config.algoliaClient;
        this.cronState = new CronStateHandler({
            tenantId: this.tenantId,
            appId: this.algoliaApp.id,
            db: this.db,
            syncEntity: "categories",
        });
    }

    public async syncFromECI(): Promise<void> {
        this.logger.info("Syncing categories from schemabase with algolia");

        const cronState = await this.cronState.get();

        const now = new Date();
        let createdGte: Date;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 2);
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            createdGte = subHours(cronState.lastRun, 3);
            this.logger.info(`Setting GTE date to ${createdGte}. `);
        }

        const categories = await this.db.category.findMany({
            where: {
                tenantId: this.tenantId,
                updatedAt: {
                    gte: createdGte,
                },
            },
        });

        this.logger.info(`Found ${categories.length} categories to sync`);

        const index = this.algoliaApp.categoryIndexName;

        const requests: BatchRequest[] = [];

        for (const category of categories) {
            const algoliaObject = {
                objectID: category.id,
                name: category.name,
                description: category.descriptionHTML,
                slug: category.slug,
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            };

            requests.push({
                action: "updateObject",
                body: algoliaObject,
            });
        }

        const { taskID } = await this.algoliaClient.batch({
            indexName: index,
            batchWriteParams: {
                requests,
            },
        });

        // Wait for indexing to be finished
        await this.algoliaClient.waitForTask({ indexName: index, taskID });

        this.logger.info("Synced categories to algolia");

        await this.cronState.set({ lastRun: now, lastRunStatus: "success" });
    }
}
