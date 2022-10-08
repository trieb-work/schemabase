/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import { XentralXmlClient } from "@eci/pkg/xentral";
import { XentralRestClient } from "@eci/pkg/xentral/src/rest";
import { Artikel } from "@eci/pkg/xentral/src/rest/types";
import { ArtikelTypeEnum } from "@eci/pkg/xentral/src/types";
import {
  ArtikelCreateRequest,
  ArtikelCreateResponse,
} from "@eci/pkg/xentral/src/xml/types";

interface XentralProxyProductVariantSyncServiceConfig {
  xentralProxyApp: XentralProxyApp;
  db: PrismaClient;
  logger: ILogger;
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
    this.warehouseId = config.xentralProxyApp.warehouseId;
    this.db = config.db;
  }

  /**
   * This Service syncs ECI Product Variant to Xentral Artikels
   * 
   * Xentral Artikel Nummer is equal to Product Variant SKU
   * 
   */
  public async syncFromECI(): Promise<void> {
    this.logger.info("Starting sync of ECI Orders to XentralProxy Aufträge");
    const xentralXmlClient = new XentralXmlClient(this.xentralProxyApp);
    const xentralRestClient = new XentralRestClient(this.xentralProxyApp);

    const productVariants = await this.db.productVariant.findMany({
      include: {
        xentralArtikel: {
          where: {
            xentralProxyAppId: this.xentralProxyApp.id,
          },
        },
        product: true,
      },
    });
    const artikelPaginator = xentralRestClient.getArtikel({}, 1000);
    const xentralArtikelSkus: string[] = [];
    const xentralArtikels: Artikel[] = [];
    for await (const xentralArtikel of artikelPaginator) {
      const productVariant = productVariants.find((pv) => pv.sku === xentralArtikel.nummer);
      if (!productVariant) {
        this.logger.warn("Could not find internal productVariant for xentralArtikel", { xentralArtikelSku: xentralArtikel.nummer });
        continue;
      }
      xentralArtikelSkus.push(xentralArtikel.nummer);
      xentralArtikels.push(xentralArtikel);
    }
    const missingProductVariants = productVariants.filter(
      (pv) => !xentralArtikelSkus.includes(pv.sku),
    );
    const existingProductVariants = productVariants.filter((pv) =>
      xentralArtikelSkus.includes(pv.sku),
    );
    this.logger.info(
      `Syncing ${productVariants.length} (creating: ${missingProductVariants.length} / updating: ${existingProductVariants.length}) productVariant(s) to xentral Artikel-Stammdaten`,
    );

    for (const productVariant of productVariants) {
      const existingXentralArtikel = xentralArtikels.find((xa) => xa.nummer === productVariant.xentralArtikel[0].xentralNummer);
      const loggerFields = {
        sku: productVariant.sku,
        variantName: productVariant.variantName,
        productName: productVariant.product.name,
      };
      // INFO: make sure to keep this object in sync with the articel changed if check (Line 111 - 117)
      const artikel: ArtikelCreateRequest = {
        projekt: this.xentralProxyApp.projectId,
        name_de:
          productVariant.product.name +
          (productVariant.variantName
            ? ` (${productVariant.variantName})`
            : ""),
        ean: productVariant.ean || undefined,
        nummer: productVariant.sku,
        herstellernummer: productVariant.sku,
        aktiv: 1,
        // INFO: muss lagerartikel sein sonst kann auftrag nicht fortgeführt werden
        lagerartikel: 1, // TODO: wenn = 1, dann müssen lagereinlagerungen für den artikel gemacht werden (z.b. von kramer oder über sync, noch zu klären)
        typ: ArtikelTypeEnum.Versandartikel,
        // TODO: Altersfreigabe
      };

      let xentralResData: ArtikelCreateResponse;
      if (existingXentralArtikel) {
        // INFO: make sure to keep this object in sync with the ArtikelCreateRequest line 91
        if (
          (existingXentralArtikel.projekt || null) === (artikel.projekt || null) &&
          (existingXentralArtikel.name_de || null) === (artikel.name_de || null) &&
          (existingXentralArtikel.ean || null) === (artikel.ean || null) &&
          (existingXentralArtikel.herstellernummer || null) === (artikel.herstellernummer || null) &&
          (existingXentralArtikel.lagerartikel || null) === (artikel.lagerartikel || null) &&
          (existingXentralArtikel.typ || null) === (artikel.typ || null)
        ) {
          this.logger.debug("Existing Artikel in Xentral-Stammdaten is exactly the same as in ECI-DB, skipping update for this Artikel.", loggerFields);
          continue;
        }

        this.logger.info("Editing Artikel in Xentral-Stammdaten", loggerFields);
        const artikelId = String(existingXentralArtikel.id);
        await xentralXmlClient.ArtikelEdit({
          ...artikel,
          id: artikelId,
        });
        // xentralResData = await xentralXmlClient.ArtikelGet({ id: artikelId });
      } else {
        this.logger.debug("Creating Artikel in Xentral-Stammdaten)", loggerFields);
        xentralResData = await xentralXmlClient.ArtikelCreate(artikel);
        const createdXentralArtikel = await this.db.xentralArtikel.upsert({
          where: {
            xentralNummer_xentralProxyAppId: {
              xentralNummer: xentralResData.nummer,
              xentralProxyAppId: this.xentralProxyApp.id,
            },
          },
          create: {
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
          update: {},
        });
        this.logger.info(
          `Created new xentralArtikel for current productVariant`,
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
}
