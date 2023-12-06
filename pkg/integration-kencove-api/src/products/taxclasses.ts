import { PrismaClient } from "@prisma/client";
import { KencoveApiProduct } from "../types";
import { normalizeStrings } from "@eci/pkg/normalization";
import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";

/**
 * Take all products, get a unique list of tax classes and
 * sync them. Return a mapping table, between the tax class string
 * from KencoveApiProduct and our internal tax class id
 * @param products
 */
const syncTaxClasses = async (
    products: KencoveApiProduct[],
    db: PrismaClient,
    tenantId: string,
    logger: ILogger,
) => {
    /**
     * Unique list of tax classes
     */
    const taxClasses = products.reduce((acc, product) => {
        if (product.product_tax_code) {
            acc.add(product.product_tax_code);
        }
        return acc;
    }, new Set<string>());

    logger.info(
        `Found ${taxClasses.size} tax classes to sync with our internal DB`,
    );

    /**
     * Sync tax classes with our DB use the normalisedName as unique identifier.
     */
    const taxClassMap = await Promise.all(
        Array.from(taxClasses).map(async (taxClass) => {
            const normalizedName = normalizeStrings.taxNames(taxClass);
            const taxClassRecord = await db.tax.upsert({
                where: {
                    normalizedName_tenantId: {
                        normalizedName,
                        tenantId,
                    },
                },
                create: {
                    id: id.id("tax"),
                    name: taxClass,
                    normalizedName,
                    percentage: 0,
                    tenant: {
                        connect: {
                            id: tenantId,
                        },
                    },
                },
                update: {},
            });
            return {
                taxClass,
                taxClassId: taxClassRecord.id,
            };
        }),
    );

    /**
     * Create a map between the tax class string from KencoveApiProduct
     * and our internal tax class id
     */
    const taxClassMapTable: Record<string, string> = taxClassMap.reduce(
        (acc, taxClass) => {
            acc[taxClass.taxClass] = taxClass.taxClassId;
            return acc;
        },
        {} as any,
    );

    return taxClassMapTable;
};

export { syncTaxClasses };
