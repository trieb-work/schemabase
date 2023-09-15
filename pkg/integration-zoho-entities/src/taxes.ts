import { Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { Prisma, PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

export interface ZohoTaxSyncConfig {
    logger: ILogger;
    zoho: Zoho;
    db: PrismaClient;
    zohoApp: ZohoApp;
}

export class ZohoTaxSyncService {
    private readonly logger: ILogger;

    private readonly zoho: Zoho;

    private readonly db: PrismaClient;

    private readonly zohoApp: ZohoApp;

    public constructor(config: ZohoTaxSyncConfig) {
        this.logger = config.logger;
        this.zoho = config.zoho;
        this.db = config.db;
        this.zohoApp = config.zohoApp;
    }

    public async syncToECI() {
        // Get all active Items from Zoho
        const taxes = await this.zoho.tax.list();
        const tenantId = this.zohoApp.tenantId;

        // Loop through every item and upsert the corresponding
        for (const tax of taxes) {
            const normalizedTaxName = normalizeStrings.taxNames(tax.tax_name);

            const taxCreateOrConnect: Prisma.TaxCreateNestedOneWithoutZohoTaxesInput =
                {
                    connectOrCreate: {
                        where: {
                            percentage_tenantId: {
                                percentage: tax.tax_percentage,
                                tenantId: this.zohoApp.tenantId,
                            },
                        },
                        create: {
                            id: id.id("tax"),
                            name: tax.tax_name,
                            normalizedName: normalizedTaxName,
                            percentage: tax.tax_percentage,
                            tenant: {
                                connect: {
                                    id: tenantId,
                                },
                            },
                        },
                    },
                };

            await this.db.zohoTax.upsert({
                where: {
                    id_zohoAppId: {
                        zohoAppId: this.zohoApp.id,
                        id: tax.tax_id,
                    },
                },
                create: {
                    id: tax.tax_id,
                    tax: taxCreateOrConnect,
                    zohoApp: {
                        connect: {
                            id: this.zohoApp.id,
                        },
                    },
                },
                update: {
                    tax: taxCreateOrConnect,
                },
            });
            this.logger.info(
                `Synced tax ${tax.tax_name} (${tax.tax_percentage}%)`,
            );
        }

        // The taxes cleanup logic
        const allInternalTaxes = await this.db.zohoTax.findMany({
            where: {
                zohoAppId: this.zohoApp.id,
            },
        });
        // Filters the internal taxes for taxes, that are currently not active in Zoho
        const toBeDeleted = allInternalTaxes.filter(
            (tx) =>
                !taxes.find((zohoActiveTax) => zohoActiveTax.tax_id === tx.id),
        );
        if (toBeDeleted.length > 0) {
            this.logger.info(
                `We have to cleanup ${toBeDeleted.length} Zoho taxes in our DB`,
            );
            await this.db.zohoTax.deleteMany({
                where: {
                    id: {
                        in: toBeDeleted.map((d) => d.id),
                    },
                },
            });
        }

        this.logger.info(`Sync finished for ${taxes.length} Zoho Taxes`);
    }
}
