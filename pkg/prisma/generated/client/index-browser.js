Object.defineProperty(exports, "__esModule", { value: true });

const { Decimal } = require("./runtime/index-browser");

const Prisma = {};

exports.Prisma = Prisma;

/**
 * Prisma Client JS version: 3.6.0
 * Query Engine version: dc520b92b1ebb2d28dc3161f9f82e875bd35d727
 */
Prisma.prismaVersion = {
  client: "3.6.0",
  engine: "dc520b92b1ebb2d28dc3161f9f82e875bd35d727",
};

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
};
Prisma.validator = () => (val) => val;

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = "DbNull";
Prisma.JsonNull = "JsonNull";
Prisma.AnyNull = "AnyNull";

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) {
  return x;
}

exports.Prisma.ProductDataFeedAppScalarFieldEnum = makeEnum({
  id: "id",
  productDetailStorefrontURL: "productDetailStorefrontURL",
  saleorAppId: "saleorAppId",
  tenantId: "tenantId",
});

exports.Prisma.LogisticsAppScalarFieldEnum = makeEnum({
  id: "id",
  currentOrdersCustomViewId: "currentOrdersCustomViewId",
  nextFiveDaysOrdersCustomViewId: "nextFiveDaysOrdersCustomViewId",
  currentBulkOrdersCustomViewId: "currentBulkOrdersCustomViewId",
  nextFiveDaysBulkOrdersCustomViewId: "nextFiveDaysBulkOrdersCustomViewId",
  tenantId: "tenantId",
});

exports.Prisma.ZohoAppScalarFieldEnum = makeEnum({
  id: "id",
  orgId: "orgId",
  clientId: "clientId",
  clientSecret: "clientSecret",
  tenantId: "tenantId",
});

exports.Prisma.SaleorAppScalarFieldEnum = makeEnum({
  id: "id",
  domain: "domain",
  name: "name",
  channelSlug: "channelSlug",
  tenantId: "tenantId",
});

exports.Prisma.InstalledSaleorAppScalarFieldEnum = makeEnum({
  id: "id",
  token: "token",
  saleorAppId: "saleorAppId",
});

exports.Prisma.TenantScalarFieldEnum = makeEnum({
  id: "id",
  name: "name",
});

exports.Prisma.SubscriptionScalarFieldEnum = makeEnum({
  id: "id",
  tenantId: "tenantId",
  payedUntil: "payedUntil",
});

exports.Prisma.ProductDataFeedIntegrationScalarFieldEnum = makeEnum({
  id: "id",
  enabled: "enabled",
  subscriptionId: "subscriptionId",
  tenantId: "tenantId",
  productDataFeedAppId: "productDataFeedAppId",
  saleorAppId: "saleorAppId",
});

exports.Prisma.LogisticsIntegrationScalarFieldEnum = makeEnum({
  id: "id",
  enabled: "enabled",
  subscriptionId: "subscriptionId",
  tenantId: "tenantId",
  zohoAppId: "zohoAppId",
  logisticsAppId: "logisticsAppId",
});

exports.Prisma.StrapiToZohoIntegrationScalarFieldEnum = makeEnum({
  id: "id",
  payedUntil: "payedUntil",
  enabled: "enabled",
  strapiContentType: "strapiContentType",
  subscriptionId: "subscriptionId",
  tenantId: "tenantId",
  strapiAppId: "strapiAppId",
  zohoAppId: "zohoAppId",
});

exports.Prisma.StrapiAppScalarFieldEnum = makeEnum({
  id: "id",
  name: "name",
  tenantId: "tenantId",
});

exports.Prisma.IncomingSaleorWebhookScalarFieldEnum = makeEnum({
  id: "id",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  secretId: "secretId",
  installedSaleorAppId: "installedSaleorAppId",
});

exports.Prisma.IncomingStrapiWebhookScalarFieldEnum = makeEnum({
  id: "id",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  secretId: "secretId",
  strapiAppId: "strapiAppId",
});

exports.Prisma.IncomingProductDataFeedWebhookScalarFieldEnum = makeEnum({
  id: "id",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  productDataFeedAppId: "productDataFeedAppId",
});

exports.Prisma.IncomingLogisticsWebhookScalarFieldEnum = makeEnum({
  id: "id",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  logisticsAppId: "logisticsAppId",
});

exports.Prisma.SecretKeyScalarFieldEnum = makeEnum({
  id: "id",
  name: "name",
  secret: "secret",
  createdAt: "createdAt",
});

exports.Prisma.SortOrder = makeEnum({
  asc: "asc",
  desc: "desc",
});

exports.Prisma.QueryMode = makeEnum({
  default: "default",
  insensitive: "insensitive",
});

exports.Prisma.ModelName = makeEnum({
  ProductDataFeedApp: "ProductDataFeedApp",
  LogisticsApp: "LogisticsApp",
  ZohoApp: "ZohoApp",
  SaleorApp: "SaleorApp",
  InstalledSaleorApp: "InstalledSaleorApp",
  Tenant: "Tenant",
  Subscription: "Subscription",
  ProductDataFeedIntegration: "ProductDataFeedIntegration",
  LogisticsIntegration: "LogisticsIntegration",
  StrapiToZohoIntegration: "StrapiToZohoIntegration",
  StrapiApp: "StrapiApp",
  IncomingSaleorWebhook: "IncomingSaleorWebhook",
  IncomingStrapiWebhook: "IncomingStrapiWebhook",
  IncomingProductDataFeedWebhook: "IncomingProductDataFeedWebhook",
  IncomingLogisticsWebhook: "IncomingLogisticsWebhook",
  SecretKey: "SecretKey",
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    );
  }
}
exports.PrismaClient = PrismaClient;

Object.assign(exports, Prisma);
