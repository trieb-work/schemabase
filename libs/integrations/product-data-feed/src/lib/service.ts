import ObjectsToCsv from "objects-to-csv";
import { htmlToText } from "html-to-text";
import { Product as RawProduct } from "@eci/adapters/saleor";
// @ts-expect-error it doesn't detec types for some reason
import edjsHTML from "editorjs-html";
import { generateUnitPrice } from "./generate-unit-price";
import { FeedVariant, Product } from "./types";

export interface ProductDataFeedService {
  generateCSV: (
    storefrontProductUrl: string,
    feedVariant: FeedVariant,
    channelSlug: string,
  ) => Promise<string>;
}

export type ProductDataFeedServiceConfig = {
  saleorClient: {
    getProducts: (variables: {
      first: number;
      channel: string;
    }) => Promise<RawProduct[]>;
  };
  channelSlug: string;
};

/**
 * Generate product data as .csv
 */

export class ProductDataFeedGenerator implements ProductDataFeedService {
  public readonly saleorClient: {
    getProducts: (variables: {
      first: number;
      channel: string;
    }) => Promise<RawProduct[]>;
  };
  public readonly channelSlug: string;

  public constructor(config: ProductDataFeedServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.channelSlug = config.channelSlug;
  }

  public async generateCSV(
    storefrontProductUrl: string,
    feedVariant: FeedVariant,
  ): Promise<string> {
    const products = await this.generate(storefrontProductUrl, feedVariant);
    const csv = new ObjectsToCsv(products);
    return await csv.toString();
  }

  private async generate(
    storefrontProductUrl: string,
    feedVariant: FeedVariant,
  ): Promise<Product[]> {
    const rawProducts = await this.saleorClient.getProducts({
      first: 100,
      channel: this.channelSlug,
    });
    const products: Product[] = [];

    for (const rawProduct of rawProducts) {
      // we get the brand from a product attribute called brand
      const brand = rawProduct.attributes.find(
        (x) => x.attribute.name === "brand",
      )?.values[0]?.name;
      const googleProductCategory = rawProduct.attributes.find(
        (x) => x.attribute.name === "googleProductCategory",
      )?.values[0]?.name;

      // if we want to prefer the title instead of the seoTitle
      // const title = product.name ? product.name : product.seoTitle;

      const title = rawProduct.seoTitle ? rawProduct.seoTitle : rawProduct.name;

      let description = "";
      try {
        description = rawProduct.descriptionJson
          ? edjsHTML().parse(JSON.parse(rawProduct.descriptionJson))
          : rawProduct.seoDescription;
      } catch (err) {
        // console.warn(err)
      }

      description =
        feedVariant == "facebookcommerce"
          ? htmlToText(description)
          : description;

      const { hasVariants } = rawProduct.productType;

      if (!rawProduct.variants) {
        continue;
      }

      for (const variant of rawProduct.variants) {
        if (!variant) {
          continue;
        }

        const gtin = hasVariants
          ? variant.metadata?.find((x) => x?.key === "EAN")?.value
          : rawProduct.metadata?.find((x) => x?.key === "EAN")?.value;
        const unit_pricing_measure =
          variant.weight && rawProduct.weight
            ? generateUnitPrice(variant.weight, rawProduct.weight)
            : undefined;
        const product: Product = {
          id: variant.sku,
          title: hasVariants ? `${title} (${variant.name})` : title,
          description,
          rich_text_description:
            feedVariant === "facebookcommerce" ? description : undefined,
          image_link: hasVariants
            ? variant.images && variant.images.length > 0
              ? variant.images[0]?.url
              : ""
            : rawProduct.images && rawProduct.images.length > 0
            ? rawProduct.images[1]?.url
            : "",
          additional_image_link: hasVariants
            ? variant.images?.[1]?.url
            : rawProduct.images?.[2]?.url,
          link: storefrontProductUrl + rawProduct.slug,
          price: `${variant?.pricing?.priceUndiscounted?.gross.amount} ${variant?.pricing?.priceUndiscounted?.gross.currency}`,
          sale_price: `${variant?.pricing?.price?.gross.amount} ${variant.pricing?.price?.gross.currency}`,
          condition: "new",
          gtin,
          brand: brand ?? undefined,
          unit_pricing_measure,
          availability:
            variant.quantityAvailable < 1 || !rawProduct.isAvailableForPurchase
              ? "out of stock"
              : "in stock",
          google_product_category: googleProductCategory ?? undefined,
        };

        products.push(product);
      }
    }
    return products;
  }
}
