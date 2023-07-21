// the kencoveApiAppattributesync class that is used to sync attributes.
// from kencove to our internal database. It works similar than the product sync
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { isSameHour, subHours, subYears } from "date-fns";
import { uniqueStringAddress } from "@eci/pkg/miscHelper/uniqueStringAddress";
import { id } from "@eci/pkg/ids";

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

  public async syncToEci() {
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

    const client = new KencoveApiClient(this.kencoveApiApp);
    const kencoveApiAppattributes = await client.getAttributes(createdGte);
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

    for (const kenAttribute of existingkencoveApiAppAttributes) {
      const existingkencoveApiAppAttribute =
        existingkencoveApiAppAttributes.find(
          (attribute) => attribute.id === kenAttribute.id,
        );
    }
  }
}
