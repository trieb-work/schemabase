// Saleor attribute sync (SaleorAttributeSyncService). Sync saleor attributes and match
// them with our internal ones.
// use the saleorAttribute table to store the saleor ids and match them with the Attributes table
// we use the attribute normalized name as the key to match the saleor attribute
// with our internal one. it follows the same logic than the other entity syncs.

import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { normalizeStrings } from "@eci/pkg/normalization";
import {
  AttributeType,
  InstalledSaleorApp,
  PrismaClient,
} from "@eci/pkg/prisma";
import {
  AttributeCreateMutation,
  AttributeCreateMutationVariables,
  AttributeInputTypeEnum,
  AttributeSyncQuery,
  AttributeSyncQueryVariables,
  AttributeTypeEnum,
  queryWithPagination,
} from "@eci/pkg/saleor";

interface SaleorAttributeSyncServiceConfig {
  saleorClient: {
    attributeSync: (
      variables: AttributeSyncQueryVariables,
    ) => Promise<AttributeSyncQuery>;
    attributeCreate: (
      variables: AttributeCreateMutationVariables,
    ) => Promise<AttributeCreateMutation>;
  };
  installedSaleorApp: InstalledSaleorApp;
  tenantId: string;
  db: PrismaClient;
  logger: ILogger;
}

/**
 * A dynamic mapping table, that can be used to
 * map the saleor attribute types to our internal types and the other
 * way around
 */
const attributeTypeMappingSaleorSchemabase = {
  [AttributeInputTypeEnum.Dropdown]: AttributeType.DROPDOWN,
  [AttributeInputTypeEnum.Multiselect]: AttributeType.MULTISELECT,
  [AttributeInputTypeEnum.File]: AttributeType.FILE,
  [AttributeInputTypeEnum.Reference]: AttributeType.REFERENCE,
  [AttributeInputTypeEnum.Boolean]: AttributeType.BOOLEAN,
  [AttributeInputTypeEnum.Date]: AttributeType.DATE,
  [AttributeInputTypeEnum.DateTime]: AttributeType.DATE,
  [AttributeInputTypeEnum.Swatch]: AttributeType.SWATCH,
  [AttributeInputTypeEnum.PlainText]: AttributeType.PLAIN_TEXT,
  [AttributeInputTypeEnum.RichText]: AttributeType.RICH_TEXT,
  [AttributeInputTypeEnum.Numeric]: AttributeType.NUMERIC,
};

export class SaleorAttributeSyncService {
  private saleorClient: SaleorAttributeSyncServiceConfig["saleorClient"];

  private installedSaleorApp: SaleorAttributeSyncServiceConfig["installedSaleorApp"];

  private tenantId: SaleorAttributeSyncServiceConfig["tenantId"];

  private db: SaleorAttributeSyncServiceConfig["db"];

  private logger: SaleorAttributeSyncServiceConfig["logger"];

  constructor({
    saleorClient,
    installedSaleorApp,
    tenantId,
    db,
    logger,
  }: SaleorAttributeSyncServiceConfig) {
    this.saleorClient = saleorClient;
    this.installedSaleorApp = installedSaleorApp;
    this.tenantId = tenantId;
    this.db = db;
    this.logger = logger;
  }

  private matchSaleorAttributeTypeWithInternalType(
    type: AttributeInputTypeEnum,
  ): AttributeType {
    return attributeTypeMappingSaleorSchemabase[type];
  }

  private matchInternalTypeWithSaleorAttributeType(
    type: AttributeType,
  ): AttributeInputTypeEnum {
    const saleorAttributeTypeEnumKey = Object.keys(
      attributeTypeMappingSaleorSchemabase,
    ).find(
      (key) =>
        attributeTypeMappingSaleorSchemabase[key as AttributeInputTypeEnum] ===
        type,
    );
    return saleorAttributeTypeEnumKey as AttributeInputTypeEnum;
  }

  public async syncToEci() {
    const result = await queryWithPagination(({ first, after }) =>
      this.saleorClient.attributeSync({
        first,
        after,
      }),
    );

    const attributesFromSaleor =
      result.attributes?.edges?.map((edge) => edge.node) ?? [];

    this.logger.info(
      `Syncing ${attributesFromSaleor.length} attributes from Saleor`,
    );

    for (const attr of attributesFromSaleor) {
      this.logger.info(`Syncing attribute ${attr.name}`);
      if (!attr.name) continue;
      if (!attr.inputType) continue;

      const normalizedName = normalizeStrings.attributeNames(attr.name);

      const type = this.matchSaleorAttributeTypeWithInternalType(
        attr.inputType,
      );

      await this.db.saleorAttribute.upsert({
        where: {
          id_installedSaleorAppId: {
            id: attr.id,
            installedSaleorAppId: this.installedSaleorApp.id,
          },
        },
        create: {
          id: attr.id,
          installedSaleorApp: {
            connect: {
              id: this.installedSaleorApp.id,
            },
          },
          attribute: {
            connectOrCreate: {
              where: {
                normalizedName_tenantId: {
                  normalizedName,
                  tenantId: this.tenantId,
                },
              },
              create: {
                id: id.id("attribute"),
                tenant: {
                  connect: {
                    id: this.tenantId,
                  },
                },
                name: attr.name,
                normalizedName,
                type,
              },
            },
          },
        },
        update: {},
      });
    }
  }

  public async syncFromEci() {
    /**
     * Get all attributes that are not in saleor. Include all unique attribute values,
     * that are possible values for the attribute.
     */
    const attributesNotInSaleor = await this.db.attribute.findMany({
      where: {
        saleorAttributes: {
          none: {
            installedSaleorAppId: this.installedSaleorApp.id,
          },
        },
      },
      include: {
        values: {
          distinct: ["normalizedName"],
        },
      },
    });

    this.logger.info(
      `Creating ${attributesNotInSaleor.length} attributes in Saleor`,
    );

    for (const attr of attributesNotInSaleor) {
      this.logger.info(`Creating attribute ${attr.name}`);
      if (!attr.name) continue;
      if (!attr.type) continue;

      const normalizedName = normalizeStrings.attributeNames(attr.name);

      const type = this.matchInternalTypeWithSaleorAttributeType(attr.type);

      const result = await this.saleorClient.attributeCreate({
        input: {
          name: attr.name,
          slug: normalizedName,
          inputType: type,
          type: AttributeTypeEnum.ProductType,
          values: attr.values.map((value) => ({
            name: value.value,
            slug: value.normalizedName,
          })),
        },
      });
      if (
        result?.attributeCreate?.errors &&
        result?.attributeCreate?.errors?.length > 0
      ) {
        this.logger.error(
          `Could not create attribute ${attr.name} in Saleor: ${JSON.stringify(
            result.attributeCreate?.errors,
          )}`,
        );
        continue;
      }
      if (!result.attributeCreate?.attribute?.id) {
        this.logger.error(
          `Could not create attribute ${attr.name} in Saleor: ${JSON.stringify(
            result,
          )}`,
        );
        continue;
      }

      await this.db.saleorAttribute.create({
        data: {
          id: result.attributeCreate?.attribute?.id,
          installedSaleorApp: {
            connect: {
              id: this.installedSaleorApp.id,
            },
          },
          attribute: {
            connect: {
              id: attr.id,
            },
          },
        },
      });
    }
  }
}
