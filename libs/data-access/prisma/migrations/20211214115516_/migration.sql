-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('INIT', 'INFORMATION_RECEIVED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED_ATTEMPT', 'DELIVERED', 'AVAILABLE_FOR_PICKUP', 'EXCEPTION', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "Carrier" AS ENUM ('DPD');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "carrier" "Carrier" NOT NULL,
    "status" "PackageStatus" NOT NULL,
    "trackingId" TEXT NOT NULL,
    "carrierTrackingUrl" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageEvent" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "status" "PackageStatus" NOT NULL,
    "message" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionalEmail" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "packageEventId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingEmailApp" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "replyTo" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SendgridTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "trackingEmailAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DPDApp" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingIntegration" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "dpdAppId" TEXT NOT NULL,
    "trackingEmailAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingDPDWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dpdAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order.orderId_unique" ON "Order"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Package.trackingId_unique" ON "Package"("trackingId");

-- CreateIndex
CREATE UNIQUE INDEX "Package.carrierTrackingUrl_unique" ON "Package"("carrierTrackingUrl");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionalEmail.packageEventId_unique" ON "TransactionalEmail"("packageEventId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingEmailApp.tenantId_unique" ON "TrackingEmailApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SendgridTemplate.trackingEmailAppId_name_unique" ON "SendgridTemplate"("trackingEmailAppId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "DPDApp.tenantId_unique" ON "DPDApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingIntegration.subscriptionId_unique" ON "TrackingIntegration"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingIntegration.dpdAppId_unique" ON "TrackingIntegration"("dpdAppId");

-- AddForeignKey
ALTER TABLE "Package" ADD FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageEvent" ADD FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionalEmail" ADD FOREIGN KEY ("packageEventId") REFERENCES "PackageEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingEmailApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SendgridTemplate" ADD FOREIGN KEY ("trackingEmailAppId") REFERENCES "TrackingEmailApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DPDApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD FOREIGN KEY ("dpdAppId") REFERENCES "DPDApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD FOREIGN KEY ("trackingEmailAppId") REFERENCES "TrackingEmailApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingDPDWebhook" ADD FOREIGN KEY ("dpdAppId") REFERENCES "DPDApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterIndex
ALTER INDEX "IncomingSaleorWebhook_secretId_unique" RENAME TO "IncomingSaleorWebhook.secretId_unique";

-- AlterIndex
ALTER INDEX "IncomingStrapiWebhook_secretId_unique" RENAME TO "IncomingStrapiWebhook.secretId_unique";

-- AlterIndex
ALTER INDEX "LogisticsIntegration_logisticsAppId_unique" RENAME TO "LogisticsIntegration.logisticsAppId_unique";

-- AlterIndex
ALTER INDEX "ProductDataFeedIntegration_productDataFeedAppId_unique" RENAME TO "ProductDataFeedIntegration.productDataFeedAppId_unique";

-- AlterIndex
ALTER INDEX "StrapiToZohoIntegration_strapiAppId_unique" RENAME TO "StrapiToZohoIntegration.strapiAppId_unique";
