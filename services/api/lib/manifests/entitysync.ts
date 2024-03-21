import {
    ProductDeletedWebhooksDocument,
    ProductDeletedWebhooksSubscription,
    ProductVariantDeletedWebhooksDocument,
    ProductVariantDeletedWebhooksSubscription,
} from "@eci/pkg/saleor";
import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import { AppPermission, WebhookManifest } from "@saleor/app-sdk/types";
import { saleorApp } from "../../saleor-app";

const getName = () => "schemabase datahub";

const getPermissions = (): AppPermission[] => {
    return [
        "MANAGE_ORDERS",
        "MANAGE_ORDERS_IMPORT",
        "MANAGE_CHANNELS",
        "MANAGE_PRODUCTS",
        "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES",
        "MANAGE_DISCOUNTS",
        "MANAGE_GIFT_CARD",
        "MANAGE_SHIPPING",
        "MANAGE_USERS",
        "MANAGE_TAXES",
        "HANDLE_PAYMENTS",
    ];
};

// TODO: when app sdk supports it: add a custom schemabase header to later identify the app
export const productDeletedWebhook =
    new SaleorAsyncWebhook<ProductDeletedWebhooksSubscription>({
        name: "Customer Created in Saleor",
        webhookPath: "api/saleor/webhook/v1",
        event: "PRODUCT_DELETED",
        apl: saleorApp.apl,
        query: ProductDeletedWebhooksDocument,
    });
export const productVariantDeletedWebhook =
    new SaleorAsyncWebhook<ProductVariantDeletedWebhooksSubscription>({
        name: "Product Variant Deleted in Saleor",
        webhookPath: "api/saleor/webhook/v1",
        event: "PRODUCT_VARIANT_DELETED",
        apl: saleorApp.apl,
        query: ProductVariantDeletedWebhooksDocument,
    });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWebhookManifest = (baseUrl: string): WebhookManifest[] => {
    return [
        productDeletedWebhook.getWebhookManifest(baseUrl),
        productVariantDeletedWebhook.getWebhookManifest(baseUrl),
    ];
};

export const entitysync = { getPermissions, getWebhookManifest, getName };
