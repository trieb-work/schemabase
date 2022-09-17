import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { WarehouseStock } from "@trieb.work/zoho-ts/dist/types/item";

interface SyncStocksConfig {
  db: PrismaClient;
  logger: ILogger;
  zohoAppId: string;
  tenantId: string;
}

export class SyncStocks {
  private db: PrismaClient;

  private logger: ILogger;

  private zohoAppId: string;

  private tenantId: string;

  constructor(config: SyncStocksConfig) {
    this.db = config.db;
    this.logger = config.logger;
    this.zohoAppId = config.zohoAppId;
    this.tenantId = config.tenantId;
  }

  public async updateInECI(
    warehouseStocks: WarehouseStock[],
    eciVariantId: string,
  ) {
    for (const stocks of warehouseStocks) {
      const zohoWarehouse = await this.db.zohoWarehouse.findUnique({
        where: {
          id_zohoAppId: {
            id: stocks.warehouse_id,
            zohoAppId: this.zohoAppId,
          },
        },
      });
      if (!zohoWarehouse?.id) {
        this.logger.error(
          // eslint-disable-next-line max-len
          `No internal Zoho Warehouse with id ${stocks.warehouse_id} - ${stocks.warehouse_name} found!`,
        );
        continue;
      }
      const eciWarehouseId = zohoWarehouse?.warehouseId;

      await this.db.stockEntries.upsert({
        where: {
          warehouseId_productVariantId_tenantId: {
            warehouseId: eciWarehouseId,
            productVariantId: eciVariantId,
            tenantId: this.tenantId,
          },
        },
        create: {
          id: id.id("stockEntry"),
          warehouse: {
            connect: {
              id: eciWarehouseId,
            },
          },
          // eslint-disable-next-line prettier/prettier
          actualAvailableForSaleStock:
            stocks.warehouse_actual_available_for_sale_stock,
          actualAvailableStock: stocks.warehouse_actual_available_stock,
          actualCommittedStock: stocks.warehouse_actual_committed_stock,
          tenant: {
            connect: {
              id: this.tenantId,
            },
          },
          productVariant: {
            connect: {
              id: eciVariantId,
            },
          },
        },
        update: {
          // eslint-disable-next-line prettier/prettier
          actualAvailableForSaleStock:
            stocks.warehouse_actual_available_for_sale_stock,
          actualAvailableStock: stocks.warehouse_actual_available_stock,
          actualCommittedStock: stocks.warehouse_actual_committed_stock,
        },
      });
    }
  }
}
