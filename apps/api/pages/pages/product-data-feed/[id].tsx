import { NextApiRequest, NextApiResponse } from "next"
import {
  createContext,
  setupPrisma,
  setupRequestDataFeed,
  setupLogger,
  setupSaleor,
} from "@eci/context"
import { MissingHTTPBodyError, MissingHTTPHeaderError } from "@eci/util/errors"
import {
  ProductDataFeedQuery,
  ProductDataFeedQueryVariables,
  ProductDataFeed,
  Weight,
  ProductVariant,
} from "@eci/types/graphql/global"
import isEmpty from "lodash/isEmpty"
import editorjs from "editorjs-html"
import objectToCsv from "objects-to-csv"
import md5 from "md5"
import { htmlToText } from "html-to-text"

const generateUnitPrice = (variantWeight: Weight, productWeight: Weight): string | undefined => {
  if (!variantWeight?.value && !productWeight?.value) {
    return undefined
  }
  return variantWeight?.value
    ? `${variantWeight.value} ${variantWeight.unit}`
    : `${productWeight.value} ${productWeight.unit}`
}

function getHeader<T = string>(req: NextApiRequest, key: string): T {
  const value = req.headers[key] as T | undefined
  if (!value) {
    throw new MissingHTTPHeaderError(key)
  }
  return value
}

function getBodyAttribute<T = string>(req: NextApiRequest, key: string): T {
  const value = req.body[key] as T | undefined
  if (!value) {
    throw new MissingHTTPBodyError(key)
  }
  return value
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query["id"] as string
  if (!id) {
    throw new Error(`Invalid request: missing id`)
  }
  const variant = req.query["variant"] as string
  if (!variant) {
    throw new Error(`Invalid request: missing variant`)
  }

  const ctx = await createContext<"prisma" | "requestDataFeed" | "logger" | "saleor">(
    setupPrisma(),
    setupLogger(),
    setupRequestDataFeed({ id, variant }),
    setupSaleor({
      domain: getHeader(req, "x-saleor-domain"),
      authToken: getHeader(req, "x-saleor-token").replace("Bearer ", ""),
      event: getHeader(req, "x-saleor-event"),
      signature: getHeader(req, "x-saleor-signature").replace("sha1=", ""),
      appToken: getBodyAttribute(req, "app_token"),
    }),
  )

  if (!ctx.requestDataFeed.valid) {
    ctx.logger.error("Invalid request")
    return res.status(400).end()
  }

  ctx.logger.info("Creating new product datafeed")

  const rawData = await ctx.saleor.graphqlClient.query<
    ProductDataFeedQuery,
    ProductDataFeedQueryVariables
  >({
    query: ProductDataFeed,
    variables: {
      first: 100,
    },
  })
  if (!rawData?.data?.products?.edges) {
    throw new Error(`No product edges loaded`)
  }
  const finalData: {
    id: string
    title: string
    description: string
    rich_text_description: string
    image_link: string
    additional_image_link: string
    link: string
    price: string
    sale_price: string
    condition: string
    gtin: string
    brand: string
    unit_pricing_measure: string
    availability: "out of stock" | "in stock"
    google_product_category: string
  }[] = []
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
        : editorjs().parse(JSON.parse(product.descriptionJson))?.join("")

      const { hasVariants } = product.productType
      product.variants?.map((variant) => {
        const variantImageLink =
          variant?.images?.length && variant.images.length > 0 ? variant.images[0]?.url : ""
        const singleProductImageLink =
          product?.images?.length && product.images.length > 0 ? product.images[1]?.url : ""
        const additionalImageLink = hasVariants
          ? variant?.images?.[1]?.url
          : product.images?.[2]?.url
        const ean = hasVariants
          ? variant?.metadata?.find((x) => x.key === "EAN")?.value
          : product.metadata?.find((x) => x.key === "EAN")?.value
        const unit_pricing_measure = generateUnitPrice(variant?.weight, product.weight)
        const finalProduct = {
          id: variant?.sku,
          title: hasVariants ? `${title} (${variant?.name})` : title,
          description,
          rich_text_description: description,
          image_link: hasVariants ? variantImageLink : singleProductImageLink,
          additional_image_link: additionalImageLink,
          link: ctx.requestDataFeed.storefrontProductUrl + product.slug,
          price: `${variant?.pricing?.priceUndiscounted.gross.amount} ${variant?.pricing?.priceUndiscounted.gross.currency}`,
          sale_price: `${variant?.pricing.price.gross.amount} ${variant?.pricing.price.gross.currency}`,
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
        if (ctx.requestDataFeed.variant === "facebookcommerce") {
          finalProduct.description = htmlToText(finalProduct.description)
        }
        if (ctx.requestDataFeed.variant === "googlemerchant") {
          delete finalProduct.rich_text_description
        }

        finalData.push(finalProduct)
        return variant
      })
      return product
    })

  const csv = new objectToCsv(finalData)
  const returnValue = await csv.toString()

  res.setHeader("Content-Type", "text/csv")
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=productdatafeed-${md5(returnValue)}.csv`,
  )
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate")
  return res.send(returnValue)
}
