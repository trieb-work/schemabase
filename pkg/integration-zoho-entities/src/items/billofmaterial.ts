import { id } from "@eci/pkg/ids";
import { PrismaClient } from "@eci/pkg/prisma";

const setBOMinECI = async (
  db: PrismaClient,
  zohoAppId: string,
  tenantId: string,
  productVariantId: string,
  // eslint-disable-next-line camelcase
  mappedProducts: { item_id: string; quantity: number; item_order: number }[],
) => {
  const mappedECIvariantIds: string[] = [];
  /**
   * Loop through all child products of a parent product and upsert the bill
   * of material accordingly
   */
  for (const mappedProduct of mappedProducts) {
    const zohoItem = await db.zohoItem.findUniqueOrThrow({
      where: {
        id_zohoAppId: {
          id: mappedProduct.item_id,
          zohoAppId,
        },
      },
      select: {
        productVariantId: true,
      },
    });
    mappedECIvariantIds.push(zohoItem.productVariantId);

    await db.productVariant.update({
      where: {
        id: productVariantId,
      },
      data: {
        billOfMaterial: {
          upsert: [
            {
              where: {
                productVariantId_partId: {
                  productVariantId,
                  partId: zohoItem.productVariantId,
                },
              },
              create: {
                id: id.id("billOfMaterial"),
                part: {
                  connect: {
                    id: zohoItem.productVariantId,
                  },
                },
                quantity: mappedProduct.quantity,
                tenant: {
                  connect: {
                    id: tenantId,
                  },
                },
                order: mappedProduct.item_order,
              },
              update: {
                quantity: mappedProduct.quantity,
                order: mappedProduct.item_order,
              },
            },
          ],
        },
      },
    });
  }

  /**
   * Cleanup maybe existing, old bill of material entries
   */
  await db.billOfMaterial.deleteMany({
    where: {
      productVariantId,
      partId: {
        notIn: mappedECIvariantIds,
      },
    },
  });
};

export { setBOMinECI };
