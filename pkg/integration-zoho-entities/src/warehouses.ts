import { Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, Prisma, ZohoApp } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

type ZohoAppWithTenant = ZohoApp & Prisma.TenantInclude;

export interface ZohoWarehouseSyncConfig {
    logger: ILogger;
    zoho: Zoho;
    db: PrismaClient;
    zohoApp: ZohoAppWithTenant;
}

export class ZohoWarehouseSyncService {
    private readonly logger: ILogger;

    private readonly zoho: Zoho;

    private readonly db: PrismaClient;

    private readonly zohoApp: ZohoAppWithTenant;

    public constructor(config: ZohoWarehouseSyncConfig) {
        this.logger = config.logger;
        this.zoho = config.zoho;
        this.db = config.db;
        this.zohoApp = config.zohoApp;
    }

    public async syncToECI() {
        // Get all active Warehouses from Zoho
        const warehouses = await this.zoho.warehouse.list();
        const tenantId = this.zohoApp.tenantId;

        // Loop through every warehouse and upsert the corresponding warehouse
        for (const warehouse of warehouses) {
            const normalizedWarehouseName = normalizeStrings.warehouseNames(
                warehouse.warehouse_name,
            );

            const warehouseCreateOrConnect = {
                connectOrCreate: {
                    where: {
                        normalizedName_tenantId: {
                            tenantId,
                            normalizedName: normalizedWarehouseName,
                        },
                    },
                    create: {
                        id: id.id("warehouse"),
                        name: warehouse.warehouse_name,
                        normalizedName: normalizedWarehouseName,
                        tenant: {
                            connect: {
                                id: tenantId,
                            },
                        },
                    },
                },
            };

            await this.db.zohoWarehouse.upsert({
                where: {
                    id_zohoAppId: {
                        zohoAppId: this.zohoApp.id,
                        id: warehouse.warehouse_id,
                    },
                },
                create: {
                    id: warehouse.warehouse_id,
                    warehouse: warehouseCreateOrConnect,
                    zohoApp: {
                        connect: {
                            id: this.zohoApp.id,
                        },
                    },
                },
                update: {
                    warehouse: warehouseCreateOrConnect,
                },
            });
        }
        this.logger.info(
            `Sync finished for ${warehouses.length} Zoho Warehouse`,
        );
    }
}
