/*
  Warnings:

  - You are about to drop the `IncomingDPDWebhook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncomingLogisticsWebhook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncomingProductDataFeedWebhook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncomingSaleorWebhook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncomingStrapiWebhook` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[incomingWebhookId]` on the table `SecretKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `incomingWebhookId` to the `SecretKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IncomingDPDWebhook" DROP CONSTRAINT "IncomingDPDWebhook_dpdAppId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingLogisticsWebhook" DROP CONSTRAINT "IncomingLogisticsWebhook_logisticsAppId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingProductDataFeedWebhook" DROP CONSTRAINT "IncomingProductDataFeedWebhook_productDataFeedAppId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingSaleorWebhook" DROP CONSTRAINT "IncomingSaleorWebhook_installedSaleorAppId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingSaleorWebhook" DROP CONSTRAINT "IncomingSaleorWebhook_secretId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingStrapiWebhook" DROP CONSTRAINT "IncomingStrapiWebhook_secretId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingStrapiWebhook" DROP CONSTRAINT "IncomingStrapiWebhook_strapiAppId_fkey";

-- AlterTable
ALTER TABLE "SecretKey" ADD COLUMN     "incomingWebhookId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TrackingIntegration" ADD COLUMN     "zohoAppId" TEXT;

-- DropTable
DROP TABLE "IncomingDPDWebhook";

-- DropTable
DROP TABLE "IncomingLogisticsWebhook";

-- DropTable
DROP TABLE "IncomingProductDataFeedWebhook";

-- DropTable
DROP TABLE "IncomingSaleorWebhook";

-- DropTable
DROP TABLE "IncomingStrapiWebhook";

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

-- CreateIndex
CREATE UNIQUE INDEX "SecretKey_incomingWebhookId_key" ON "SecretKey"("incomingWebhookId");

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD CONSTRAINT "TrackingIntegration_zohoAppId_fkey" FOREIGN KEY ("zohoAppId") REFERENCES "ZohoApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
