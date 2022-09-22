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
    // TODO artikel get
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
    this.logger.info(`Syncing ${productVariants.length} productVariant(s) to xentral Artikel-Stammdaten`);
    for (const productVariant of productVariants) {
      const loggerFields = {
        sku: productVariant.sku,
        variantName: productVariant.variantName,
        productName: productVariant.product.name,
      };
      this.logger.debug("Syncing productVariant to xentral Artikel-Stammdaten", loggerFields)
      const artikel: ArtikelCreateRequest = {
        projekt: this.xentralProxyApp.projectId,
        name_de: productVariant.product.name + (productVariant.variantName ? ` (${productVariant.variantName})` : ''),
        // artikel: productVariant.sku, // TODO seems like this feeld does not exist
        // herstellernummer: productVariant.sku,
        ean: productVariant.ean || undefined,
        nummer: "NEW",
        kundennummer: productVariant.sku,
        aktiv: 1,
        // TODO: muss lagerartikel sein sonst kann auftrag nicht fortgeführt werden
        lagerartikel: 1, // TODO: lagereinlagerungen müssen dann gemacht werden
        typ: "3_kat",
        // TODO: Altersfreigabe
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
