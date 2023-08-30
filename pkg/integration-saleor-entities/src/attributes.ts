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
  AttributeInputTypeEnum,
  AttributeSyncQuery,
  AttributeSyncQueryVariables,
  queryWithPagination,
} from "@eci/pkg/saleor";

interface SaleorAttributeSyncServiceConfig {
  saleorClient: {
    attributeSync: (
      variables: AttributeSyncQueryVariables,
    ) => Promise<AttributeSyncQuery>;
  };
  installedSaleorApp: InstalledSaleorApp;
  tenantId: string;
  db: PrismaClient;
  logger: ILogger;
}

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

  private matchAttributeType(type: AttributeInputTypeEnum): AttributeType {
    switch (type) {
      case AttributeInputTypeEnum.Dropdown:
        return AttributeType.DROPDOWN;
      case AttributeInputTypeEnum.Multiselect:
        return AttributeType.MULTISELECT;
      case AttributeInputTypeEnum.File:
        return AttributeType.FILE;
      case AttributeInputTypeEnum.Reference:
        return AttributeType.REFERENCE;
      case AttributeInputTypeEnum.Boolean:
        return AttributeType.BOOLEAN;
      case AttributeInputTypeEnum.Date:
        return AttributeType.DATE;
      case AttributeInputTypeEnum.DateTime:
        return AttributeType.DATE;
      case AttributeInputTypeEnum.Swatch:
        return AttributeType.SWATCH;
      case AttributeInputTypeEnum.PlainText:
        return AttributeType.PLAIN_TEXT;
      case AttributeInputTypeEnum.RichText:
        return AttributeType.RICH_TEXT;
      case AttributeInputTypeEnum.Numeric:
        return AttributeType.NUMERIC;
    }
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

      const type = this.matchAttributeType(attr.inputType);

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
}
