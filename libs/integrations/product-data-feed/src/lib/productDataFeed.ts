import ObjectsToCsv from 'objects-to-csv';
import isEmpty from 'lodash/isEmpty';
import { htmlToText } from 'html-to-text';
import { ApolloClient, NormalizedCacheObject } from "@eci/graphql-client"

import edjsHTML from 'editorjs-html';
import { ProductDataFeed } from './productDataFeed.graphql';

const edjsParser = edjsHTML();

export const generateProductDataFeed = async (saleorGraphQLClient :ApolloClient<NormalizedCacheObject>, channel :string,
    storefrontProductUrl :string, feedVariant :'googlemerchant' | 'facebookcommerce') => {
    const RawData = await saleorGraphQLClient.query<ProductDataFeedQuery, ProductDataFeedQueryVariables>({
        query: ProductDataFeed,
        variables: {
            first: 100,
            channel,
        },
    });

    const generateUnitPrice = (variantWeight :Weight, productWeight :Weight) => {
        if (!variantWeight?.value && !productWeight?.value) return undefined;
        return variantWeight?.value ? `${variantWeight.value} ${variantWeight.unit}` : `${productWeight.value} ${productWeight.unit}`;
    };
    const FinalData = [];

    RawData.data.products.edges.map((product) => product.node).map((product) => {
        // we get the brand from a product attribute called brand
        const brand = product.attributes.find((x) => x.attribute.name === 'brand')?.values[0]?.name;
        const googleProductCategory = product.attributes.find((x) => x.attribute.name === 'googleProductCategory')?.values[0]?.name;

        // if we want to prefer the title instead of the seoTitle
        // const title = product.name ? product.name : product.seoTitle;

        const title = product.seoTitle ? product.seoTitle : product.name;

        const description = isEmpty(JSON.parse(product?.descriptionJson)) ? product.seoDescription : edjsParser.parse(JSON.parse(product.descriptionJson))?.join('');

        const { hasVariants } = product.productType;

        product.variants.map((variant) => {
            const variantImageLink = variant.images.length > 0 ? variant.images[0].url : '';
            const singleProductImageLink = product.images.length > 0 ? product.images[1]?.url : '';
            const additionalImageLink = hasVariants ? variant.images?.[1]?.url : product.images?.[2]?.url;
            const ean = hasVariants ? variant.metadata?.find((x) => x.key === 'EAN')?.value : product.metadata?.find((x) => x.key === 'EAN')?.value;
            const unit_pricing_measure = generateUnitPrice(variant.weight, product.weight);
            const FinalProduct = {
                id: variant.sku,
                title: hasVariants ? `${title} (${variant.name})` : title,
                description,
                rich_text_description: description,
                image_link: hasVariants ? variantImageLink : singleProductImageLink,
                additional_image_link: additionalImageLink,
                link: storefrontProductUrl + product.slug,
                price: `${variant.pricing?.priceUndiscounted.gross.amount} ${variant.pricing?.priceUndiscounted.gross.currency}`,
                sale_price: `${variant.pricing.price.gross.amount} ${variant.pricing.price.gross.currency}`,
                condition: 'new',
                gtin: ean,
                brand,
                unit_pricing_measure,
                availability: (variant.quantityAvailable < 1 || !product.isAvailableForPurchase) ? 'out of stock' : 'in stock',
                google_product_category: googleProductCategory,
            };
            if (feedVariant === 'facebookcommerce') FinalProduct.description = htmlToText(FinalProduct.description);
            if (feedVariant === 'googlemerchant') delete FinalProduct.rich_text_description;

            FinalData.push(FinalProduct);
            return variant;
        });
        return product;
    });

    const csv = new ObjectsToCsv(FinalData);
    return csv;
};
