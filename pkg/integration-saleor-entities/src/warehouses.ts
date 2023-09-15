import { ILogger } from "@eci/pkg/logger";
import { WarehousesQuery } from "@eci/pkg/saleor";
import { PrismaClient } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

interface SaleorWarehouseSyncServiceConfig {
    saleorClient: {
        warehouses: (variables: { first: number }) => Promise<WarehousesQuery>;
    };
    installedSaleorAppId: string;
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
}

export class SaleorWarehouseSyncService {
    public readonly saleorClient: {
        warehouses: (variables: { first: number }) => Promise<WarehousesQuery>;
    };

    private readonly logger: ILogger;

    public readonly installedSaleorAppId: string;

    public readonly tenantId: string;

    private readonly db: PrismaClient;

    public constructor(config: SaleorWarehouseSyncServiceConfig) {
        this.saleorClient = config.saleorClient;
        this.logger = config.logger;
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.tenantId = config.tenantId;
        this.db = config.db;
    }

    public async syncToECI(): Promise<void> {
        const response = await this.saleorClient.warehouses({
            first: 100,
        });

        if (
            !response.warehouses?.edges ||
            response.warehouses?.edges.length === 0
        ) {
            this.logger.info("Got no warehouses from saleor. Can't sync");
            return;
        }

        const warehouses = response.warehouses?.edges.map((x) => x.node);
        this.logger.info(`Syncing ${warehouses?.length} warehouse(s)`);

        for (const warehouse of warehouses) {
            const normalizedWarehouseName = normalizeStrings.warehouseNames(
                warehouse.name,
            );

            const warehouseCreateOrConnect = {
                connectOrCreate: {
                    where: {
                        normalizedName_tenantId: {
                            normalizedName: normalizedWarehouseName,
                            tenantId: this.tenantId,
                        },
                    },
                    create: {
                        id: id.id("warehouse"),
                        name: warehouse.name,
                        normalizedName: normalizedWarehouseName,
                        tenant: {
                            connect: {
                                id: this.tenantId,
                            },
                        },
                    },
                },
            };

            await this.db.saleorWarehouse.upsert({
                where: {
                    id_installedSaleorAppId: {
                        id: warehouse.id,
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                create: {
                    id: warehouse.id,
                    installedSaleorApp: {
                        connect: {
                            id: this.installedSaleorAppId,
                        },
                    },
                    warehouse: warehouseCreateOrConnect,
                },
                update: {
                    warehouse: warehouseCreateOrConnect,
                },
            });
        }
    }
}
