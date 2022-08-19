/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import { XentralClient } from "@eci/pkg/xentral";
import { ArtikelCreateRequest } from "@eci/pkg/xentral/src/types";

interface XentralProxyProductVariantSyncServiceConfig {
  xentralProxyApp: XentralProxyApp;
  db: PrismaClient;
  logger: ILogger;
  warehouseId: string;
}

export class XentralProxyProductVariantSyncService {
  private readonly logger: ILogger;

  public readonly tenantId: string;

  public readonly warehouseId: string;

  public readonly xentralProxyApp: XentralProxyApp;

  private readonly db: PrismaClient;

  public constructor(config: XentralProxyProductVariantSyncServiceConfig) {
    this.logger = config.logger;
    this.tenantId = config.xentralProxyApp.tenantId;
    this.xentralProxyApp = config.xentralProxyApp;
    this.warehouseId = config.warehouseId;
    this.db = config.db;
  }

  public async syncFromECI(): Promise<void> {
    this.logger.info("Starting sync of ECI Orders to XentralProxy Aufträge");
    const xentralClient = new XentralClient(this.xentralProxyApp);
    const productVariants = await this.db.productVariant.findMany({
      where: {
        xentralArtikel: {
          none: {
            xentralProxyAppId: this.xentralProxyApp.id,
          },
        },
      },
      include: {
        xentralArtikel: true,
        product: true,
      },
    });
    for (const productVariant of productVariants) {
      const artikel: ArtikelCreateRequest = {
        name_de: `${productVariant.product.name} (${productVariant.variantName})`,
        artikel: productVariant.sku,
        ean: productVariant.ean || undefined,
        nummer: "NEW",
        aktiv: 1,
        lagerartikel: 0,
        typ: "3_kat",
      };
      const xentralResData = await xentralClient.ArtikelCreate(artikel);
      const createdXentralArtikel = await this.db.xentralArtikel.create({
        data: {
          id: xentralResData.id.toString(),
          xentralNummer: xentralResData.nummer,
          xentralProxyApp: {
            connect: {
              id: this.xentralProxyApp.id,
            },
          },
          productVariant: {
            connect: {
              id: productVariant.id,
            },
          },
        },
      });
      this.logger.info(
        "Created new xentralArtikel for current productVariant",
        {
          productVariantId: productVariant.id,
          tenantId: this.tenantId,
          productVariantName: productVariant.variantName,
          xentralArtikelId: createdXentralArtikel.id,
          xentralArtikelNummer: createdXentralArtikel.xentralNummer,
        },
      );
    }
  }
}
