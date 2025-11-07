import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiClient } from "../client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subYears } from "date-fns";
import async from "async";

interface KencoveApiAppProductSkuSyncServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppProductSkuSyncService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    private readonly cronState: CronStateHandler;

    public constructor(config: KencoveApiAppProductSkuSyncServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.cronState = new CronStateHandler({
            tenantId: this.kencoveApiApp.tenantId,
            appId: this.kencoveApiApp.id,
            db: this.db,
            syncEntity: "items",
        });
    }

    public async syncToECI() {
        const now = new Date();
        const createdGte = subYears(now, 1);

        const client = KencoveApiClient.getInstance(
            this.kencoveApiApp,
            this.logger,
        );
        const skusStream = client.getProductSkusStream(createdGte);

        let updateCount = 0;
        for await (const skus of skusStream) {
            this.logger.info(`Found ${skus.length} product SKUs to sync`);

            // first, fetch all product variants including their kencoveApiProductVariants
            const productVariants = await this.db.productVariant.findMany({
                where: {
                    sku: {
                        in: skus.map((s) => s.default_code),
                    },
                    tenantId: this.kencoveApiApp.tenantId,
                },
                include: {
                    kencoveApiProductVariant: true,
                },
            });

            // eslint-disable-next-line @typescript-eslint/no-loop-func
            await async.eachLimit(productVariants, 1, async (p) => {
                // we check, if the kencove product variant id in our DB matches the one from the API, then we can skip update
                const variantFromApi = skus.find(
                    (s) => s.default_code === p.sku,
                );
                const kencoveIdFromApi = variantFromApi?.productId.toString();
                if (p.kencoveApiProductVariant?.[0]?.id === kencoveIdFromApi) {
                    return;
                }
                if (!kencoveIdFromApi) {
                    this.logger.error(
                        `No kencove product variant id found for product variant ${p.id}`,
                    );
                    return;
                }
                this.logger.info(
                    `Updating product variant ${p.id} with kencove product variant ${kencoveIdFromApi}`,
                    {
                        productVariantIdFromApi: kencoveIdFromApi,
                        productVariantId: p.kencoveApiProductVariant?.[0]?.id,
                        sku: p.sku,
                    },
                );
                try {
                    // if we don't have an entry for the kencove product variant, we create it
                    if (!p.kencoveApiProductVariant?.[0]) {
                        await this.db.productVariant.update({
                            where: {
                                id: p.id,
                            },
                            data: {
                                kencoveApiProductVariant: {
                                    connectOrCreate: {
                                        where: {
                                            id_kencoveApiAppId: {
                                                id: kencoveIdFromApi,
                                                kencoveApiAppId:
                                                    this.kencoveApiApp.id,
                                            },
                                        },
                                        create: {
                                            id: kencoveIdFromApi,
                                            createdAt: new Date(
                                                variantFromApi?.create_date ||
                                                    new Date(),
                                            ),
                                            updatedAt: new Date(
                                                variantFromApi?.write_date ||
                                                    new Date(),
                                            ),
                                            kencoveApiApp: {
                                                connect: {
                                                    id: this.kencoveApiApp.id,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        });
                    } else {
                        // cleanup existing entry that might be already there with the new id:
                        await this.db.kencoveApiProductVariant.deleteMany({
                            where: {
                                id: kencoveIdFromApi,
                                kencoveApiAppId: this.kencoveApiApp.id,
                            },
                        });
                        // we update the ID of the existing entry
                        await this.db.kencoveApiProductVariant.update({
                            where: {
                                id_kencoveApiAppId: {
                                    id: p.kencoveApiProductVariant?.[0]?.id,
                                    kencoveApiAppId: this.kencoveApiApp.id,
                                },
                            },
                            data: {
                                id: kencoveIdFromApi,
                                updatedAt: new Date(
                                    variantFromApi?.write_date || new Date(),
                                ),
                            },
                        });
                    }
                } catch (error) {
                    this.logger.error(
                        `Failed to update product variant ${p.id}`,
                        error instanceof Error
                            ? {
                                  error: {
                                      name: error.name,
                                      message: error.message,
                                      stack: error.stack,
                                  },
                              }
                            : { error },
                    );
                }

                updateCount++;
            });
        }

        this.logger.info(`Updated ${updateCount} product variants`);

        await this.cronState.set({ lastRun: now, lastRunStatus: "success" });
    }
}
