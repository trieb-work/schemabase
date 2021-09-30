/*
  Warnings:

  - You are about to drop the column `saleorApp` on the `IncomingWebhook` table. All the data in the column will be lost.
  - You are about to drop the column `strapiId` on the `IncomingWebhook` table. All the data in the column will be lost.
  - You are about to drop the column `productDataFeedId` on the `ProductDataFeedIntegration` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `SecretKey` table. All the data in the column will be lost.
  - You are about to drop the column `strapiId` on the `StrapiToZohoIntegration` table. All the data in the column will be lost.
  - You are about to drop the `ProductDataFeed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Strapi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZohoConfig` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productDataFeedAppId]` on the table `ProductDataFeedIntegration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productDataFeedAppId` to the `ProductDataFeedIntegration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saleorAppId` to the `ProductDataFeedIntegration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secret` to the `SecretKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strapiAppId` to the `StrapiToZohoIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IncomingWebhook" DROP CONSTRAINT "IncomingWebhook_productDataFeedId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingWebhook" DROP CONSTRAINT "IncomingWebhook_saleorApp_fkey";

-- DropForeignKey
ALTER TABLE "IncomingWebhook" DROP CONSTRAINT "IncomingWebhook_strapiId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDataFeed" DROP CONSTRAINT "ProductDataFeed_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDataFeedIntegration" DROP CONSTRAINT "ProductDataFeedIntegration_productDataFeedId_fkey";

-- DropForeignKey
ALTER TABLE "Strapi" DROP CONSTRAINT "Strapi_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "StrapiToZohoIntegration" DROP CONSTRAINT "StrapiToZohoIntegration_strapiId_fkey";

-- DropForeignKey
ALTER TABLE "ZohoConfig" DROP CONSTRAINT "ZohoConfig_tenantId_fkey";

-- AlterTable
ALTER TABLE "IncomingWebhook" DROP COLUMN "saleorApp",
DROP COLUMN "strapiId",
ADD COLUMN     "saleorAppId" TEXT,
ADD COLUMN     "strapiAppId" TEXT;

-- AlterTable
ALTER TABLE "ProductDataFeedIntegration" DROP COLUMN "productDataFeedId",
ADD COLUMN     "productDataFeedAppId" TEXT NOT NULL,
ADD COLUMN     "saleorAppId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SecretKey" DROP COLUMN "hash",
ADD COLUMN     "secret" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StrapiToZohoIntegration" DROP COLUMN "strapiId",
ADD COLUMN     "strapiAppId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProductDataFeed";

-- DropTable
DROP TABLE "Strapi";

-- DropTable
DROP TABLE "ZohoConfig";

-- CreateTable
CREATE TABLE "ProductDataFeedApp" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN DEFAULT false,
    "productDetailStorefrontURL" TEXT NOT NULL,
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
CREATE TABLE "StrapiApp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeedApp.tenantId_unique" ON "ProductDataFeedApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ZohoApp.tenantId_unique" ON "ZohoApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeedIntegration_productDataFeedAppId_unique" ON "ProductDataFeedIntegration"("productDataFeedAppId");

-- AddForeignKey
ALTER TABLE "ProductDataFeedApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZohoApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD FOREIGN KEY ("productDataFeedAppId") REFERENCES "ProductDataFeedApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD FOREIGN KEY ("strapiAppId") REFERENCES "StrapiApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD FOREIGN KEY ("productDataFeedId") REFERENCES "ProductDataFeedApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD FOREIGN KEY ("strapiAppId") REFERENCES "StrapiApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
