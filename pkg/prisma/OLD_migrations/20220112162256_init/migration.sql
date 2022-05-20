-- CreateEnum
CREATE TYPE "PackageState" AS ENUM ('INIT', 'INFORMATION_RECEIVED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED_ATTEMPT', 'DELIVERED', 'AVAILABLE_FOR_PICKUP', 'EXCEPTION', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "Carrier" AS ENUM ('DPD');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('DE', 'EN');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "externalOrderId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "carrier" "Carrier" NOT NULL,
    "state" "PackageState" NOT NULL,
    "trackingId" TEXT NOT NULL,
    "carrierTrackingUrl" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageEvent" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "state" "PackageState" NOT NULL,
    "message" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "PackageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionalEmail" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "sentEmailId" TEXT NOT NULL,
    "packageEventId" TEXT NOT NULL,

    CONSTRAINT "TransactionalEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingEmailApp" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "replyTo" TEXT NOT NULL,

    CONSTRAINT "TrackingEmailApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SendgridTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "packageState" "PackageState" NOT NULL,
    "language" "Language" NOT NULL,
    "subject" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "trackingEmailAppId" TEXT NOT NULL,

    CONSTRAINT "SendgridTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DpdApp" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "DpdApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDataFeedApp" (
    "id" TEXT NOT NULL,
    "productDetailStorefrontURL" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "ProductDataFeedApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogisticsApp" (
    "id" TEXT NOT NULL,
    "currentOrdersCustomViewId" TEXT NOT NULL,
    "nextFiveDaysOrdersCustomViewId" TEXT NOT NULL,
    "currentBulkOrdersCustomViewId" TEXT NOT NULL,
    "nextFiveDaysBulkOrdersCustomViewId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "LogisticsApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZohoApp" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "ZohoApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleorApp" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channelSlug" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "SaleorApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstalledSaleorApp" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "saleorAppId" TEXT NOT NULL,

    CONSTRAINT "InstalledSaleorApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "payedUntil" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingIntegration" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "dpdAppId" TEXT NOT NULL,
    "trackingEmailAppId" TEXT NOT NULL,
    "zohoAppId" TEXT,

    CONSTRAINT "TrackingIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDataFeedIntegration" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "productDataFeedAppId" TEXT NOT NULL,
    "saleorAppId" TEXT NOT NULL,

    CONSTRAINT "ProductDataFeedIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogisticsIntegration" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "zohoAppId" TEXT NOT NULL,
    "logisticsAppId" TEXT NOT NULL,

    CONSTRAINT "LogisticsIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrapiToZohoIntegration" (
    "id" TEXT NOT NULL,
    "payedUntil" TIMESTAMP(3),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "strapiContentType" TEXT NOT NULL DEFAULT E'bulkorder',
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "strapiAppId" TEXT NOT NULL,
    "zohoAppId" TEXT NOT NULL,

    CONSTRAINT "StrapiToZohoIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrapiApp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "StrapiApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dpdAppId" TEXT,
    "logisticsAppId" TEXT,
    "productDataFeedAppId" TEXT,
    "zohoAppId" TEXT,
    "strapiAppId" TEXT,
    "installedSaleorAppId" TEXT,

    CONSTRAINT "IncomingWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecretKey" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incomingWebhookId" TEXT NOT NULL,

    CONSTRAINT "SecretKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_externalOrderId_key" ON "Order"("externalOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Package_trackingId_key" ON "Package"("trackingId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionalEmail_packageEventId_key" ON "TransactionalEmail"("packageEventId");

-- CreateIndex
CREATE UNIQUE INDEX "SendgridTemplate_trackingEmailAppId_language_packageState_key" ON "SendgridTemplate"("trackingEmailAppId", "language", "packageState");

-- CreateIndex
CREATE UNIQUE INDEX "DpdApp_tenantId_key" ON "DpdApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeedApp_tenantId_key" ON "ProductDataFeedApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "LogisticsApp_tenantId_key" ON "LogisticsApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ZohoApp_tenantId_key" ON "ZohoApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleorApp_domain_channelSlug_key" ON "SaleorApp"("domain", "channelSlug");

-- CreateIndex
CREATE UNIQUE INDEX "InstalledSaleorApp_saleorAppId_key" ON "InstalledSaleorApp"("saleorAppId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingIntegration_subscriptionId_key" ON "TrackingIntegration"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingIntegration_dpdAppId_key" ON "TrackingIntegration"("dpdAppId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeedIntegration_subscriptionId_key" ON "ProductDataFeedIntegration"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeedIntegration_productDataFeedAppId_key" ON "ProductDataFeedIntegration"("productDataFeedAppId");

-- CreateIndex
CREATE UNIQUE INDEX "LogisticsIntegration_subscriptionId_key" ON "LogisticsIntegration"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "LogisticsIntegration_logisticsAppId_key" ON "LogisticsIntegration"("logisticsAppId");

-- CreateIndex
CREATE UNIQUE INDEX "StrapiToZohoIntegration_subscriptionId_key" ON "StrapiToZohoIntegration"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "StrapiToZohoIntegration_strapiAppId_key" ON "StrapiToZohoIntegration"("strapiAppId");

-- CreateIndex
CREATE UNIQUE INDEX "SecretKey_incomingWebhookId_key" ON "SecretKey"("incomingWebhookId");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageEvent" ADD CONSTRAINT "PackageEvent_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionalEmail" ADD CONSTRAINT "TransactionalEmail_packageEventId_fkey" FOREIGN KEY ("packageEventId") REFERENCES "PackageEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingEmailApp" ADD CONSTRAINT "TrackingEmailApp_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SendgridTemplate" ADD CONSTRAINT "SendgridTemplate_trackingEmailAppId_fkey" FOREIGN KEY ("trackingEmailAppId") REFERENCES "TrackingEmailApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DpdApp" ADD CONSTRAINT "DpdApp_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedApp" ADD CONSTRAINT "ProductDataFeedApp_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsApp" ADD CONSTRAINT "LogisticsApp_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZohoApp" ADD CONSTRAINT "ZohoApp_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleorApp" ADD CONSTRAINT "SaleorApp_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstalledSaleorApp" ADD CONSTRAINT "InstalledSaleorApp_saleorAppId_fkey" FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD CONSTRAINT "TrackingIntegration_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD CONSTRAINT "TrackingIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD CONSTRAINT "TrackingIntegration_dpdAppId_fkey" FOREIGN KEY ("dpdAppId") REFERENCES "DpdApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD CONSTRAINT "TrackingIntegration_trackingEmailAppId_fkey" FOREIGN KEY ("trackingEmailAppId") REFERENCES "TrackingEmailApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD CONSTRAINT "TrackingIntegration_zohoAppId_fkey" FOREIGN KEY ("zohoAppId") REFERENCES "ZohoApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD CONSTRAINT "ProductDataFeedIntegration_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD CONSTRAINT "ProductDataFeedIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD CONSTRAINT "ProductDataFeedIntegration_productDataFeedAppId_fkey" FOREIGN KEY ("productDataFeedAppId") REFERENCES "ProductDataFeedApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD CONSTRAINT "ProductDataFeedIntegration_saleorAppId_fkey" FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsIntegration" ADD CONSTRAINT "LogisticsIntegration_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsIntegration" ADD CONSTRAINT "LogisticsIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsIntegration" ADD CONSTRAINT "LogisticsIntegration_zohoAppId_fkey" FOREIGN KEY ("zohoAppId") REFERENCES "ZohoApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsIntegration" ADD CONSTRAINT "LogisticsIntegration_logisticsAppId_fkey" FOREIGN KEY ("logisticsAppId") REFERENCES "LogisticsApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD CONSTRAINT "StrapiToZohoIntegration_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD CONSTRAINT "StrapiToZohoIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD CONSTRAINT "StrapiToZohoIntegration_strapiAppId_fkey" FOREIGN KEY ("strapiAppId") REFERENCES "StrapiApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD CONSTRAINT "StrapiToZohoIntegration_zohoAppId_fkey" FOREIGN KEY ("zohoAppId") REFERENCES "ZohoApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiApp" ADD CONSTRAINT "StrapiApp_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD CONSTRAINT "IncomingWebhook_dpdAppId_fkey" FOREIGN KEY ("dpdAppId") REFERENCES "DpdApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD CONSTRAINT "IncomingWebhook_logisticsAppId_fkey" FOREIGN KEY ("logisticsAppId") REFERENCES "LogisticsApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD CONSTRAINT "IncomingWebhook_productDataFeedAppId_fkey" FOREIGN KEY ("productDataFeedAppId") REFERENCES "ProductDataFeedApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD CONSTRAINT "IncomingWebhook_zohoAppId_fkey" FOREIGN KEY ("zohoAppId") REFERENCES "ZohoApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD CONSTRAINT "IncomingWebhook_strapiAppId_fkey" FOREIGN KEY ("strapiAppId") REFERENCES "StrapiApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD CONSTRAINT "IncomingWebhook_installedSaleorAppId_fkey" FOREIGN KEY ("installedSaleorAppId") REFERENCES "InstalledSaleorApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecretKey" ADD CONSTRAINT "SecretKey_incomingWebhookId_fkey" FOREIGN KEY ("incomingWebhookId") REFERENCES "IncomingWebhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
