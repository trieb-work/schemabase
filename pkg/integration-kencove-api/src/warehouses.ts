// helper class: warehouse sync. Always keeps in the class a set of all existing warehouses,
// so that they don't get pulled from the API constantly. Publish a class, that takes
// any string and matches it internally to the warehouse normalised name.
// we always first check our internal set. When no match is there, we try to pull from the DB.
// when there is no match, we create a new warehouse in the DB and add it to the set.

import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { normalizeStrings } from "@eci/pkg/normalization";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";

interface KencoveApiWarehouseSyncConfig {
    logger: ILogger;
    db: PrismaClient;
    kencoveApiApp: KencoveApiApp;
}

export class KencoveApiWarehouseSync {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    private readonly warehouses: Set<{
        normalizedName: string;
        warehouseId: string;
    }>;

    public constructor(config: KencoveApiWarehouseSyncConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.warehouses = new Set();
    }

    /**
     * get the schemabase warehouse Id for a warehouse name. This function
     * caches results internally - call as often as needed
     * @param name
     * @returns
     */
    public async getWareHouseId(name: string) {
        const normalizedName = normalizeStrings.warehouseNames(name);
        for (const warehouse of this.warehouses) {
            if (warehouse.normalizedName === normalizedName) {
                return warehouse.warehouseId;
            }
        }
        const existingWarehouse = await this.db.warehouse.findUnique({
            where: {
                normalizedName_tenantId: {
                    normalizedName: normalizedName,
                    tenantId: this.kencoveApiApp.tenantId,
                },
            },
        });
        if (existingWarehouse) {
            this.warehouses.add({
                normalizedName,
                warehouseId: existingWarehouse.id,
            });
            return existingWarehouse.id;
        }
        this.logger.info(`Creating new warehouse internally for name: ${name}`);
        const newWarehouse = await this.db.warehouse.create({
            data: {
                id: id.id("warehouse"),
                name: name,
                normalizedName,
                tenant: {
                    connect: {
                        id: this.kencoveApiApp.tenantId,
                    },
                },
            },
        });
        this.warehouses.add({
            normalizedName,
            warehouseId: newWarehouse.id,
        });
        return newWarehouse.id;
    }
}
