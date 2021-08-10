import ObjectsToCsv from "objects-to-csv"
import isEmpty from "lodash/isEmpty"
import { htmlToText } from "html-to-text"
import { GraphqlClient } from "@eci/graphql-client"
import {
  ProductDataFeed,
  ProductDataFeedQuery,
  ProductDataFeedQueryVariables,
} from "@eci/types/graphql/global"
// @ts-expect-error For some reason it does not load types
import edjsHTML from "editorjs-html"
import { generateUnitPrice } from "./generate-unit-price"

const edjsParser = edjsHTML()

/**
 * Generate product data as .csv
 */
export const generateProductDataFeed = async (
  saleorGraphQLClient: GraphqlClient,
  channel: string,
  storefrontProductUrl: string,
  feedVariant: "googlemerchant" | "facebookcommerce",
): Promise<string | null> => {
  const rawData = await saleorGraphQLClient.query<
    ProductDataFeedQuery,
    ProductDataFeedQueryVariables
  >({
    query: ProductDataFeed,
    variables: {
      first: 100,
      channel,
    },
  })

  // eslint-disable-next-line @typescript-eslint/ban-types
  const products: object[] = []

  if (!rawData.data.products) return null

  rawData.data.products.edges
    .map((product) => product.node)
    .map((product) => {
      // we get the brand from a product attribute called brand
      const brand = product.attributes.find((x) => x.attribute.name === "brand")?.values[0]?.name
      const googleProductCategory = product.attributes.find(
        (x) => x.attribute.name === "googleProductCategory",
      )?.values[0]?.name

      // if we want to prefer the title instead of the seoTitle
      // const title = product.name ? product.name : product.seoTitle;

      const title = product.seoTitle ? product.seoTitle : product.name

      const description = isEmpty(JSON.parse(product?.descriptionJson))
        ? product.seoDescription
        : edjsParser.parse(JSON.parse(product.descriptionJson))?.join("")

      const { hasVariants } = product.productType

      if (!product.variants) {
        return null
      }
      product.variants.map((variant) => {
        if (!variant) {
          return null
        }
        const variantImageLink =
          variant.images && variant.images.length > 0 ? variant.images[0]?.url : ""
        const singleProductImageLink =
          product.images && product.images.length > 0 ? product.images[1]?.url : ""
        const additionalImageLink = hasVariants
          ? variant.images?.[1]?.url
          : product.images?.[2]?.url
        const ean = hasVariants
          ? variant.metadata?.find((x) => x?.key === "EAN")?.value
          : product.metadata?.find((x) => x?.key === "EAN")?.value
        const unit_pricing_measure =
          variant.weight && product.weight
            ? generateUnitPrice(variant.weight, product.weight)
            : undefined
        const finalProduct = {
          id: variant.sku,
          title: hasVariants ? `${title} (${variant.name})` : title,
          description,
          rich_text_description: description,
          image_link: hasVariants ? variantImageLink : singleProductImageLink,
          additional_image_link: additionalImageLink,
          link: storefrontProductUrl + product.slug,
          price: `${variant?.pricing?.priceUndiscounted?.gross.amount} ${variant?.pricing?.priceUndiscounted?.gross.currency}`,
          sale_price: `${variant?.pricing?.price?.gross.amount} ${variant.pricing?.price?.gross.currency}`,
          condition: "new",
          gtin: ean,
          brand,
          unit_pricing_measure,
          availability:
            variant.quantityAvailable < 1 || !product.isAvailableForPurchase
              ? "out of stock"
              : "in stock",
          google_product_category: googleProductCategory,
        }
        if (feedVariant === "facebookcommerce")
          finalProduct.description = htmlToText(finalProduct.description)
        if (feedVariant === "googlemerchant") delete finalProduct.rich_text_description

        products.push(finalProduct)
        return variant
      })
      return product
    })

  const csv = new ObjectsToCsv(products)
  return await csv.toString()
}
