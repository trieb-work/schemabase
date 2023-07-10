// address sync class. Defines the address sync method syncToEci(). Use the already defined client.ts client library.

import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subYears } from "date-fns";

interface KencoveApiAppAddressSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppAddressSyncService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    private readonly cronState: CronStateHandler;


    public constructor(config: KencoveApiAppAddressSyncServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.cronState = new CronStateHandler({
            tenantId: this.kencoveApiApp.tenantId,
            appId: this.kencoveApiApp.id,
            db: this.db,
            syncEntity: "addresses",
          });
        }

    public async syncToEci() {
        // get the cron state from the database and use it to get the fromDate needed for the getAddresses method
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
          this.logger.info(
            `Setting GTE date to ${createdGte}.`,
          );
        }

        const client = new KencoveApiClient(this.kencoveApiApp);
        const addresses = await client.getAddresses(createdGte);
        this.logger.info(`Found ${addresses.length} addresses to sync`);
        // run a loop for each address and update or create the address in the database. Only update, if the address is different than the one in the database.



}
