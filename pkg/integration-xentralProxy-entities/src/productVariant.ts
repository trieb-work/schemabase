/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import { XentralXmlClient } from "@eci/pkg/xentral";
import { XentralRestClient } from "@eci/pkg/xentral/src/rest";
import { Artikel } from "@eci/pkg/xentral/src/rest/types";
import { ArtikelTypeEnum } from "@eci/pkg/xentral/src/types";
import { ArtikelCreateRequest, ArtikelCreateResponse, ArtikelEditRequest } from "@eci/pkg/xentral/src/xml/types";

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
    const xentralXmlClient = new XentralXmlClient(this.xentralProxyApp);
    const xentralRestClient = new XentralRestClient(this.xentralProxyApp);
    
    const productVariants = await this.db.productVariant.findMany({
      include: {
        xentralArtikel: true,
        product: true,
      },
    });
    const artikelPaginator = xentralRestClient.getArtikel({}, 1000);
    const xentralArtikelSkus: string[] = [];
    const xentralArtikels: Artikel[] = [];
    for await (const xentralArtikel of artikelPaginator) {
      const productVariant = productVariants.find((pv) => pv.sku === xentralArtikel.nummer);
      if(!productVariant){
        this.logger.warn("Could not find internal productVariant for xentralArtikel", { xentralArtikelSku: xentralArtikel.nummer });
        continue;
      }
      xentralArtikelSkus.push(xentralArtikel.nummer);
      xentralArtikels.push(xentralArtikel);
    }
    const missingProductVariants = productVariants.filter((pv) => !xentralArtikelSkus.includes(pv.sku));
    const existingProductVariants = productVariants.filter((pv) => xentralArtikelSkus.includes(pv.sku));
    this.logger.info(`Syncing ${productVariants.length} (creating: ${missingProductVariants.length} / updating: ${existingProductVariants.length}) productVariant(s) to xentral Artikel-Stammdaten`);

    for (const productVariant of productVariants) {
      const existingXentralArtikel = xentralArtikels.find((xa) => xa.nummer === productVariant.sku);
      const loggerFields = {
        sku: productVariant.sku,
        variantName: productVariant.variantName,
        productName: productVariant.product.name,
      };
      const artikel: ArtikelCreateRequest = {
        projekt: this.xentralProxyApp.projectId,
        name_de: productVariant.product.name + (productVariant.variantName ? ` (${productVariant.variantName})` : ''),
        ean: productVariant.ean || undefined,
        nummer: productVariant.sku, // INFO: alternativ, nummer: "NEU" und sku in feld herstellernummer
        aktiv: 1,
        // INFO: muss lagerartikel sein sonst kann auftrag nicht fortgeführt werden
        lagerartikel: 1, // TODO: wenn = 1, dann müssen lagereinlagerungen für den artikel gemacht werden (z.b. von kramer oder über sync, noch zu klären)
        typ: ArtikelTypeEnum.Versandartikel,
        // TODO: Altersfreigabe
      };
      
      let xentralResData: ArtikelCreateResponse;
      if(existingXentralArtikel){
        // this.logger.debug("Editing Artikel in Xentral-Stammdaten", loggerFields);
        const artikelId = String(existingXentralArtikel.id);
        await xentralXmlClient.ArtikelEdit({
          ...artikel,
          id: artikelId,
        });
        xentralResData = await xentralXmlClient.ArtikelGet({id: artikelId});
      } else {
        // this.logger.debug("Creating Artikel in Xentral-Stammdaten)", loggerFields);
        xentralResData = await xentralXmlClient.ArtikelCreate(artikel);
      }

      const createdXentralArtikel = await this.db.xentralArtikel.upsert({
        where: {
          xentralNummer_xentralProxyAppId: {
            xentralNummer: xentralResData.nummer,
            xentralProxyAppId: this.xentralProxyApp.id,
          }
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
        update: {}
      });
      this.logger.info(
        `${existingXentralArtikel ? 'Updated' : 'Created new'} xentralArtikel for current productVariant`,
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
