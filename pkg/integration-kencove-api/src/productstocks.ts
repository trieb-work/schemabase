// class KencoveApiAppStockSyncService: product stock sync. Syncs the last changed product stocks
// from the kencove api to our internal db. creates warehouses if needed.
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

interface KencoveApiAppProductStocksSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppProductStockSyncService {
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  public readonly kencoveApiApp: KencoveApiApp;

  private readonly cronState: CronStateHandler;

  public constructor(config: KencoveApiAppProductStocksSyncServiceConfig) {
    this.logger = config.logger;
    this.db = config.db;
    this.kencoveApiApp = config.kencoveApiApp;
    this.cronState = new CronStateHandler({
      tenantId: this.kencoveApiApp.tenantId,
      appId: this.kencoveApiApp.id,
      db: this.db,
      syncEntity: "itemstocks",
    });
  }

  /**
   * Syncs the last changed product stocks from the kencove api to our internal db.
   * creates warehouses if needed.
   * @returns
   * @memberof KencoveApiAppStockSyncService
   * @throws
   */
  public syncToEci = async (): Promise<void> => {
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
    const stocks = await client.getProductStocks(createdGte);
    if (stocks.length === 0) {
      this.logger.info("No product stocks to sync. Exiting.");
      await this.cronState.set({ lastRun: new Date() });
      return;
    }
    this.logger.info(`Found ${stocks.length} product stocks to sync`);

    const warehouses = await this.db.kencoveApiWarehouse.findMany({
      where: {
        kencoveApiAppId: this.kencoveApiApp.id,
      },
    });
    const warehousesMap = new Map<string, string>();
    warehouses.forEach((w) => {
      warehousesMap.set(w.id, w.warehouseId);
    });
    /**
     * Create warehouses if needed. Compare the warehouse_id from warehouse_stock
     * the warehouseMap has the warehouse_id from the kencove api and the warehouseId from our internal db.
     * When no match is found, we create a new warehouse. We use the warehouse_code as warehouse name.
     * We use connectOrCreate using the normalized warehouse_code as the unique identifier.
     */
    const warehouseIds = stocks.flatMap((s) =>
      s.warehouse_stock.map((w) => w.warehouse_id),
    );
    const warehouseIdsToCreate = warehouseIds.filter(
      (w) => !warehousesMap.has(w.toString()),
    );
    if (warehouseIdsToCreate.length > 0) {
      this.logger.info(`Creating ${warehouseIdsToCreate.length} warehouses.`);
      const warehousesToCreate = warehouseIdsToCreate.map((w) => {
        const warehouseStock = stocks.find((s) =>
          s.warehouse_stock.some((ws) => ws.warehouse_id === w),
        );
        if (!warehouseStock) {
          throw new Error(
            `Could not find warehouse stock for warehouse_id ${w}`,
          );
        }
        const warehouseCode = warehouseStock.warehouse_stock.find(
          (ws) => ws.warehouse_id === w,
        )?.warehouse_code;
        if (!warehouseCode) {
          throw new Error(
            `Could not find warehouse code for warehouse_id ${w}`,
          );
        }
        return {
          id: w.toString(),
          kencoveApiApp: {
            connect: {
              id: this.kencoveApiApp.id,
            },
          },
          warehouse: {
            connectOrCreate: {
              where: {
                normalizedName_tenantId: {
                  normalizedName:
                    normalizeStrings.warehouseNames(warehouseCode),
                  tenantId: this.kencoveApiApp.tenantId,
                },
              },
              create: {
                id: id.id("warehouse"),
                name: warehouseCode,
                normalizedName: normalizeStrings.warehouseNames(warehouseCode),
                tenant: {
                  connect: {
                    id: this.kencoveApiApp.tenantId,
                  },
                },
              },
            },
          },
        };
      });
      for (const warehouseToCreate of warehousesToCreate) {
        const resp = await this.db.kencoveApiWarehouse.create({
          data: warehouseToCreate,
        });
        warehousesMap.set(resp.id, resp.warehouseId);
      }
    }

    /**
     * Create product stocks. We use connectOrCreate using the productId as the unique identifier.
     * The productId is the kencoveApiApp product id. We look up the product id in the
     * kencoveApiProduct table. We use the warehouseId from the warehouseMap to connect the
     * product stock to the warehouse.
     */
  };
}
