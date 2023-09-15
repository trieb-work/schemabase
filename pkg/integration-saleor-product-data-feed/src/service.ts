import ObjectsToCsv from "objects-to-csv";
import { htmlToText } from "html-to-text";
import { ProductsQuery } from "@eci/pkg/saleor";
import edjsHTML from "editorjs-html";
import { generateUnitPrice } from "./generate-unit-price";
import { FeedVariant, Product } from "./types";
import { ILogger } from "@eci/pkg/logger";

export interface ProductDataFeedService {
    generateCSV: (
        storefrontProductUrl: string,
        feedVariant: FeedVariant,
        channelSlug: string,
    ) => Promise<string>;
}

export interface ProductDataFeedServiceConfig {
    saleorClient: {
        products: (variables: {
            first: number;
            channel: string;
        }) => Promise<ProductsQuery>;
    };
    channelSlug: string;
    logger: ILogger;
}

/**
 * Synchronous service to load product data from saleor and return it in either
 * google or facebook syntax.
 *
 * This service is offered via the nextjs api and does not produce any messages
 * to kafka
 */
export class ProductDataFeedGenerator implements ProductDataFeedService {
    public readonly saleorClient: {
        products: (variables: {
            first: number;
            channel: string;
        }) => Promise<ProductsQuery>;
    };

    public readonly channelSlug: string;

    private readonly logger: ILogger;

    public constructor(config: ProductDataFeedServiceConfig) {
        this.saleorClient = config.saleorClient;
        this.channelSlug = config.channelSlug;
        this.logger = config.logger;
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
        this.logger.debug("Fetching products from saleor");
        const res = await this.saleorClient.products({
            first: 100,
            channel: this.channelSlug,
        });
        if (!res) {
            throw new Error("Unable to load products");
        }
        this.logger.debug(`Found ${res.products?.edges.length ?? 0} products`);
        const rawProducts = res.products?.edges.map((edge) => edge.node) ?? [];
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
            const title = rawProduct.name
                ? rawProduct.name
                : rawProduct.seoTitle;

            // if we want to prefer the seo title
            // const title = rawProduct.seoTitle ? rawProduct.seoTitle : rawProduct.name;

            let description = "";
            try {
                /**
                 * `description` looks like this:
                 * -> "{\"time\": 1633343031152, \"blocks\": [{\"data\": {\"text\": \"Hello world\"},
                 *     \"type\": \"paragraph\"}], \"version\": \"2.20.0\"}"
                 *
                 * `edjsHTML().parse(JSON.parse(description))` will return an array
                 * -> [ "<p>Hello World</p>" ]
                 */

                description = rawProduct.description
                    ? edjsHTML()
                          .parse(JSON.parse(rawProduct.description))
                          .join("")
                    : rawProduct.seoDescription ?? "";
            } catch (err) {
                this.logger.warn("Unable to parse description", {
                    description: rawProduct.description,
                    err,
                });
            }

            const { hasVariants } = rawProduct.productType;

            if (rawProduct.variants == null) {
                continue;
            }

            for (const variant of rawProduct.variants) {
                if (variant == null) {
                    continue;
                }
                if (!title) {
                    this.logger.warn(
                        `No product name found! ${rawProduct.slug}`,
                    );
                    continue;
                }

                if (!variant.sku) {
                    this.logger.warn(`No variant SKU found for ${variant.id}`);
                    continue;
                }
                if (!variant.quantityAvailable) {
                    this.logger.warn(
                        `No variant quantity available given for variant ${variant.id}` +
                            `- Product: ${title}`,
                    );
                    continue;
                }

                const gtin = hasVariants
                    ? variant.metadata?.find((x) => x?.key === "EAN")?.value
                    : rawProduct.metadata?.find((x) => x?.key === "EAN")?.value;
                const unitPriceMeasure =
                    variant.weight != null && rawProduct.weight != null
                        ? generateUnitPrice(variant.weight, rawProduct.weight)
                        : undefined;
                const product: Product = {
                    id: variant.sku,
                    title: hasVariants ? `${title} (${variant.name})` : title,
                    description: htmlToText(description),

                    image_link: hasVariants
                        ? variant.images != null && variant.images.length > 0
                            ? variant.images[0]?.url
                            : ""
                        : rawProduct.images != null &&
                          rawProduct.images.length > 0
                        ? rawProduct.images[1]?.url
                        : "",
                    additional_image_link: hasVariants
                        ? variant.images?.[1]?.url
                        : rawProduct.images?.[2]?.url,
                    link: `${storefrontProductUrl}${
                        storefrontProductUrl.endsWith("/") ? "" : "/"
                    }${rawProduct.slug}`,
                    // eslint-disable-next-line max-len
                    price: `${variant?.pricing?.priceUndiscounted?.gross.amount} ${variant?.pricing?.priceUndiscounted?.gross.currency}`,
                    // eslint-disable-next-line max-len
                    sale_price: `${variant?.pricing?.price?.gross.amount} ${variant.pricing?.price?.gross.currency}`,
                    condition: "new",
                    gtin,
                    brand: brand ?? "undefined",
                    unit_pricing_measure: unitPriceMeasure,
                    availability:
                        variant.quantityAvailable < 1 ||
                        !rawProduct.isAvailableForPurchase
                            ? "out of stock"
                            : "in stock",
                    google_product_category: googleProductCategory ?? undefined,
                };
                if (feedVariant === "facebookcommerce") {
                    product.rich_text_description = description;
                }

                products.push(product);
            }
        }
        return products;
    }
}
