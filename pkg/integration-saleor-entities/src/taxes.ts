/**
 * Saleor tax sync service class. Pull and push tax classes from Saleor - needs min. Saleor 3.9
 * We just use the tax name to sync the classes with our DB. We don't set any taxrate per country
 */

import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { normalizeStrings } from "@eci/pkg/normalization";
import { SaleorClient, queryWithPagination } from "@eci/pkg/saleor";
import { InstalledSaleorApp, SaleorApp, PrismaClient } from "@prisma/client";

interface SaleorTaxesSyncServiceConfig {
    saleorClient: SaleorClient;
    installedSaleorApp: InstalledSaleorApp & {
        saleorApp: SaleorApp;
    };
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
}

export class SaleorTaxesSyncService {
    private readonly saleorClient: SaleorClient;

    private readonly installedSaleorApp: InstalledSaleorApp & {
        saleorApp: SaleorApp;
    };

    private readonly tenantId: string;

    private readonly db: PrismaClient;

    private readonly logger: ILogger;

    constructor(config: SaleorTaxesSyncServiceConfig) {
        this.saleorClient = config.saleorClient;
        this.installedSaleorApp = config.installedSaleorApp;
        this.tenantId = config.tenantId;
        this.db = config.db;
        this.logger = config.logger;
    }

    /**
     * Pull tax classes from Saleor and sync them with our DB
     */
    async syncToECI(): Promise<void> {
        const result = await queryWithPagination(({ first = 10, after }) =>
            this.saleorClient.saleorTaxes({
                first,
                after,
            }),
        );

        const saleorTaxClasses = result.taxClasses?.edges.map(
            (edge) => edge.node,
        );

        if (!saleorTaxClasses || saleorTaxClasses.length === 0) {
            this.logger.info("No tax classes found in Saleor");
            return;
        }

        this.logger.info(
            `Found ${saleorTaxClasses.length} tax classes in Saleor. Syncing with schemabase`,
            {
                saleorTaxClasses,
            },
        );

        const internalTaxClasses = await this.db.saleorTaxClass.findMany({
            where: {
                installedSaleorAppId: this.installedSaleorApp.id,
            },
            include: {
                tax: true,
            },
        });

        // Create new tax classes
        for (const saleorTaxClass of saleorTaxClasses) {
            const normalizedTaxName = normalizeStrings.taxNames(
                saleorTaxClass.name,
            );
            const taxClass = internalTaxClasses.find(
                (t) => t.id === saleorTaxClass.id,
            );
            if (!taxClass) {
                this.logger.info(
                    `Creating new tax class ${saleorTaxClass.name} in schemabase`,
                );
                await this.db.saleorTaxClass.create({
                    data: {
                        id: saleorTaxClass.id,
                        installedSaleorApp: {
                            connect: {
                                id: this.installedSaleorApp.id,
                            },
                        },
                        tax: {
                            connectOrCreate: {
                                where: {
                                    normalizedName_tenantId: {
                                        normalizedName: normalizedTaxName,
                                        tenantId: this.tenantId,
                                    },
                                },
                                create: {
                                    id: id.id("tax"),
                                    name: saleorTaxClass.name,
                                    normalizedName: normalizedTaxName,
                                    tenant: {
                                        connect: {
                                            id: this.tenantId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }

        // Delete tax classes that don't exist in Saleor anymore
        for (const taxClass of internalTaxClasses) {
            const saleorTaxClass = saleorTaxClasses.find(
                (st) => st.id === taxClass.id,
            );
            if (!saleorTaxClass) {
                this.logger.info(
                    `Deleting saleor tax class ${taxClass.tax.name} - Id: ${taxClass.id} from schemabase, as it doesn't exist in Saleor anymore`,
                );
                await this.db.saleorTaxClass.delete({
                    where: {
                        id_installedSaleorAppId: {
                            id: taxClass.id,
                            installedSaleorAppId: this.installedSaleorApp.id,
                        },
                    },
                });
            }
        }
    }
}
