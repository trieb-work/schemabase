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
    this.logger.info(
      "Starting sync of ECI Product Variants to XentralProxy Artikel",
    );
    const xentralXmlClient = new XentralXmlClient(this.xentralProxyApp);
    const xentralRestClient = new XentralRestClient(this.xentralProxyApp);

    const productVariants = await this.db.productVariant.findMany({
      where: {
        // TODO: remove that later! This is just for the setup
        // sku: "granola-2010-peanutpower",
        active: true,
      },
      include: {
        xentralArtikel: {
          where: {
            xentralProxyAppId: this.xentralProxyApp.id,
          },
        },
        product: true,
      },
    });
    const artikelPaginator = xentralRestClient.getArtikel({}, 100);
    const xentralArtikelSkus: string[] = [];
    const xentralArtikels: Artikel[] = [];
    for await (const xentralArtikel of artikelPaginator) {
      const productVariant = productVariants.find(
        (pv) => pv.sku === xentralArtikel.nummer,
      );
      if (!productVariant) {
        this.logger.warn(
          "Could not find internal productVariant for xentralArtikel",
          { xentralArtikelSku: xentralArtikel.nummer },
        );
        continue;
      }
      xentralArtikelSkus.push(xentralArtikel.nummer);
      xentralArtikels.push(xentralArtikel);
    }
    /**
     * Articles, that exist in the ECI DB, but not in Xentral
     */
    const missingProductVariants = productVariants.filter(
      (pv) => !xentralArtikelSkus.includes(pv.sku),
    );
    const existingProductVariants = productVariants.filter((pv) =>
      xentralArtikelSkus.includes(pv.sku),
    );
    this.logger.info(
      `Syncing ${productVariants.length} (creating: ${missingProductVariants.length} / updating: ${existingProductVariants.length}) productVariant(s) to xentral Artikel-Stammdaten`,
      {
        creatingProductVariantSKUs: missingProductVariants.map((x) => x.sku)
      }
    );

    for (const productVariant of productVariants) {
      const existingXentralArtikel = xentralArtikels.find(
        (xa) => xa.nummer === productVariant.sku,
      );

      const loggerFields = {
        sku: productVariant.sku,
        variantName: productVariant.variantName,
        productName: productVariant.product.name,
        xentralId: existingXentralArtikel?.id ?? undefined,
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
        zolltarifnummer: productVariant.product.hsCode || undefined,
        herkunftsland: productVariant.product.countryOfOrigin || "DE",
        gewicht: productVariant.weight?.toString() || undefined,
        aktiv: 1,
        // INFO: muss lagerartikel sein sonst kann auftrag nicht fortgeführt werden. Bei Just-in-Time Stückliste ist es aber kein Lagerartikel
        lagerartikel: 1, // TODO: wenn = 1, dann müssen lagereinlagerungen für den artikel gemacht werden (z.b. von kramer oder über sync, noch zu klären)
        typ: ArtikelTypeEnum.Versandartikel,
        // TODO: Altersfreigabe
      };

      let xentralResData: ArtikelCreateResponse;
      if (existingXentralArtikel) {
        // INFO: make sure to keep this object in sync with the ArtikelCreateRequest line 91
        if (existingXentralArtikel.id.toString() !== productVariant.xentralArtikel[0].id) {
          this.logger.info(`Our Xentral ID ${productVariant.xentralArtikel[0].id} is different than the Xentral ID ${existingXentralArtikel.id}. Updating in our DB`)
          await this.db.xentralArtikel.update({
            where: {
              id_xentralProxyAppId: {
                id: productVariant.xentralArtikel[0].id,
                xentralProxyAppId: this.xentralProxyApp.id
              }
            },
            data: {
              id: existingXentralArtikel.id.toString()
            }
          })
        }
        if (
          (existingXentralArtikel.projekt || null) ===
            (artikel.projekt || null) &&
          (existingXentralArtikel.name_de || null) ===
            (artikel.name_de || null) &&
          (existingXentralArtikel.ean || null) === (artikel.ean || null) &&
          (existingXentralArtikel.gewicht || null) ===
            (artikel.gewicht || null) &&
          (existingXentralArtikel.herstellernummer || null) ===
            (artikel.herstellernummer || null) &&
          (existingXentralArtikel.zolltarifnummer || null) ===
            (artikel.zolltarifnummer || null) &&
          (existingXentralArtikel.herkunftsland || null) ===
            (artikel.herkunftsland || null) &&                 
          (existingXentralArtikel.typ || null) === (artikel.typ || null)
        ) {
          this.logger.debug(
            "Existing Artikel in Xentral-Stammdaten is exactly the same as in ECI-DB, skipping update for this Artikel.",
            loggerFields,
          );
          continue;
        }

        this.logger.info("Editing Artikel in Xentral-Stammdaten", loggerFields);
        const artikelId = String(existingXentralArtikel.id);
        await xentralXmlClient.ArtikelEdit({
          ...artikel,
          id: artikelId,
          /**
           * Don't update this setting. We don't want to overwrite this setting in Xentral until we
           * sync the Stücklisten feature.
           */
          lagerartikel: undefined,
        });
        // xentralResData = await xentralXmlClient.ArtikelGet({ id: artikelId });
      } else {
        this.logger.debug(
          "Creating Artikel in Xentral-Stammdaten)",
          loggerFields,
        );
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
