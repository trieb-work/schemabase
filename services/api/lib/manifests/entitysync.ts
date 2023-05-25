import { AppPermission, WebhookManifest } from "@saleor/app-sdk/types";

const getPermissions = (): AppPermission[] => {
  return [
    "MANAGE_ORDERS",
    "MANAGE_CHANNELS",
    "MANAGE_PRODUCTS",
    "MANAGE_DISCOUNTS",
    "MANAGE_GIFT_CARD",
    "MANAGE_SHIPPING",
    "MANAGE_TAXES",
    "MANAGE_USERS",
  ];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWebhookManifest = (_baseUrl: string): WebhookManifest[] => {
  return [];
};

export const entitysync = { getPermissions, getWebhookManifest };
