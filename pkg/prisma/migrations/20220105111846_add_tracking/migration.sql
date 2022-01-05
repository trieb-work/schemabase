-- CreateEnum
CREATE TYPE "PackageState" AS ENUM ('INIT', 'INFORMATION_RECEIVED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED_ATTEMPT', 'DELIVERED', 'AVAILABLE_FOR_PICKUP', 'EXCEPTION', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "Carrier" AS ENUM ('DPD');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "email" TEXT NOT NULL,

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
CREATE TABLE "TrackingIntegration" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "dpdAppId" TEXT NOT NULL,
    "trackingEmailAppId" TEXT NOT NULL,

    CONSTRAINT "TrackingIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingDPDWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dpdAppId" TEXT NOT NULL,

    CONSTRAINT "IncomingDPDWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Package_trackingId_key" ON "Package"("trackingId");

-- CreateIndex
CREATE UNIQUE INDEX "Package_carrierTrackingUrl_key" ON "Package"("carrierTrackingUrl");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionalEmail_packageEventId_key" ON "TransactionalEmail"("packageEventId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingEmailApp_tenantId_key" ON "TrackingEmailApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SendgridTemplate_trackingEmailAppId_name_key" ON "SendgridTemplate"("trackingEmailAppId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "DpdApp_tenantId_key" ON "DpdApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingIntegration_subscriptionId_key" ON "TrackingIntegration"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingIntegration_dpdAppId_key" ON "TrackingIntegration"("dpdAppId");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "TrackingIntegration" ADD CONSTRAINT "TrackingIntegration_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD CONSTRAINT "TrackingIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD CONSTRAINT "TrackingIntegration_dpdAppId_fkey" FOREIGN KEY ("dpdAppId") REFERENCES "DpdApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD CONSTRAINT "TrackingIntegration_trackingEmailAppId_fkey" FOREIGN KEY ("trackingEmailAppId") REFERENCES "TrackingEmailApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingDPDWebhook" ADD CONSTRAINT "IncomingDPDWebhook_dpdAppId_fkey" FOREIGN KEY ("dpdAppId") REFERENCES "DpdApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
