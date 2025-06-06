// the kencoveApiAppattributesync class that is used to sync attributes.
// from kencove to our internal database. It works similar than the product sync
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { isSameHour, subHours, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";
import { cleanAttributes, kenAttributeToEciAttribute } from "./helper";

interface KencoveApiAppAttributeSyncServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppAttributeSyncService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    private readonly cronState: CronStateHandler;

    public constructor(config: KencoveApiAppAttributeSyncServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.cronState = new CronStateHandler({
            tenantId: this.kencoveApiApp.tenantId,
            appId: this.kencoveApiApp.id,
            db: this.db,
            syncEntity: "attributes",
        });
    }

    public async syncToECI() {
        const cronState = await this.cronState.get();
        const now = new Date();
        let createdGte: Date;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 1);
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            // for security purposes, we sync one hour more than the last run
            createdGte = subHours(cronState.lastRun, 1);
            this.logger.info(`Setting GTE date to ${createdGte}.`);
        }

        const client = new KencoveApiClient(this.kencoveApiApp, this.logger);
        const kencoveApiAppattributesUncleaned =
            await client.getAttributes(createdGte);
        const kencoveApiAppattributes = cleanAttributes(
            kencoveApiAppattributesUncleaned,
        ).map((attribute) => ({
            ...attribute,
            attribute_id: String(attribute.attribute_id),
        }));
        this.logger.info(
            `Found ${kencoveApiAppattributes.length} kencoveApiAppattributes to sync`,
        );
        if (kencoveApiAppattributes.length === 0) {
            this.logger.info("No kencoveApiAppattributes to sync. Exiting.");
            await this.cronState.set({ lastRun: new Date() });
            return;
        }

        const existingkencoveApiAppAttributes =
            await this.db.kencoveApiAttribute.findMany({
                where: {
                    kencoveApiAppId: this.kencoveApiApp.id,
                    id: {
                        in: kencoveApiAppattributes.map(
                            (attribute) => attribute.attribute_id,
                        ),
                    },
                },
            });

        for (const kenAttribute of kencoveApiAppattributes) {
            const existingkencoveApiAppAttribute =
                existingkencoveApiAppAttributes.find(
                    (attribute) => attribute.id === kenAttribute.attribute_id,
                );
            // if the updatedAt timestamp in our db is the same as the one from kencove,
            // we skip this attribute
            if (
                existingkencoveApiAppAttribute &&
                isSameHour(
                    existingkencoveApiAppAttribute.updatedAt,
                    new Date(kenAttribute.updatedAt),
                )
            ) {
                continue;
            }
            const createdAt = new Date(kenAttribute.createdAt);
            const updatedAt = new Date(kenAttribute.updatedAt);
            const type = kenAttributeToEciAttribute(kenAttribute.display_type);
            const normalizedName = normalizeStrings.attributeNames(
                kenAttribute.attribute_name,
            );
            await this.db.kencoveApiAttribute.upsert({
                where: {
                    id_model_kencoveApiAppId: {
                        id: kenAttribute.attribute_id,
                        kencoveApiAppId: this.kencoveApiApp.id,
                        model: kenAttribute.model,
                    },
                },
                create: {
                    id: kenAttribute.attribute_id,
                    createdAt,
                    updatedAt,
                    model: kenAttribute.model,
                    kencoveApiApp: {
                        connect: {
                            id: this.kencoveApiApp.id,
                        },
                    },
                    attribute: {
                        connectOrCreate: {
                            where: {
                                normalizedName_tenantId: {
                                    normalizedName: normalizedName,
                                    tenantId: this.kencoveApiApp.tenantId,
                                },
                            },
                            create: {
                                id: id.id("attribute"),
                                tenant: {
                                    connect: {
                                        id: this.kencoveApiApp.tenantId,
                                    },
                                },
                                name: kenAttribute.attribute_name,
                                normalizedName,
                                type: type,
                                slug: kenAttribute.slug,
                            },
                        },
                    },
                },
                update: {
                    attribute: {
                        update: {
                            normalizedName,
                            name: kenAttribute.attribute_name,
                            type,
                            slug: kenAttribute.slug,
                        },
                    },
                },
            });

            await this.cronState.set({
                lastRun: new Date(),
                lastRunStatus: "success",
            });
        }
    }
}
