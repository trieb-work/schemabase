-- CreateTable
CREATE TABLE "ProductDataFeedApp" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN DEFAULT false,
    "productDetailStorefrontURL" TEXT NOT NULL,
    "saleorAppId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZohoApp" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "orgId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "payPalAccountId" TEXT,
    "creditCardAccountId" TEXT,
    "webhookToken" TEXT NOT NULL,
    "webhookID" TEXT,
    "customFunctionID" TEXT,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleorApp" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channelSlug" TEXT,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstalledSaleorApp" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "saleorAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "payedUntil" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDataFeedIntegration" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "productDataFeedAppId" TEXT NOT NULL,
    "saleorAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrapiToZohoIntegration" (
    "id" TEXT NOT NULL,
    "payedUntil" TIMESTAMP(3),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "strapiAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrapiApp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingSaleorWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "secretId" TEXT NOT NULL,
    "installedSaleorAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingStrapiWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "secretId" TEXT NOT NULL,
    "strapiAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingProductDataFeedWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "secretId" TEXT,
    "productDataFeedAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecretKey" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeedApp.tenantId_unique" ON "ProductDataFeedApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ZohoApp.tenantId_unique" ON "ZohoApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleorApp.domain_channelSlug_unique" ON "SaleorApp"("domain", "channelSlug");

-- CreateIndex
CREATE UNIQUE INDEX "InstalledSaleorApp.saleorAppId_unique" ON "InstalledSaleorApp"("saleorAppId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeedIntegration.subscriptionId_unique" ON "ProductDataFeedIntegration"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeedIntegration_productDataFeedAppId_unique" ON "ProductDataFeedIntegration"("productDataFeedAppId");

-- CreateIndex
CREATE UNIQUE INDEX "IncomingSaleorWebhook_secretId_unique" ON "IncomingSaleorWebhook"("secretId");

-- CreateIndex
CREATE UNIQUE INDEX "IncomingStrapiWebhook_secretId_unique" ON "IncomingStrapiWebhook"("secretId");

-- CreateIndex
CREATE UNIQUE INDEX "IncomingProductDataFeedWebhook_secretId_unique" ON "IncomingProductDataFeedWebhook"("secretId");

-- AddForeignKey
ALTER TABLE "ProductDataFeedApp" ADD FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZohoApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleorApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstalledSaleorApp" ADD FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD FOREIGN KEY ("productDataFeedAppId") REFERENCES "ProductDataFeedApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD FOREIGN KEY ("strapiAppId") REFERENCES "StrapiApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingSaleorWebhook" ADD FOREIGN KEY ("secretId") REFERENCES "SecretKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingSaleorWebhook" ADD FOREIGN KEY ("installedSaleorAppId") REFERENCES "InstalledSaleorApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingStrapiWebhook" ADD FOREIGN KEY ("secretId") REFERENCES "SecretKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingStrapiWebhook" ADD FOREIGN KEY ("strapiAppId") REFERENCES "StrapiApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingProductDataFeedWebhook" ADD FOREIGN KEY ("secretId") REFERENCES "SecretKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingProductDataFeedWebhook" ADD FOREIGN KEY ("productDataFeedAppId") REFERENCES "ProductDataFeedApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
