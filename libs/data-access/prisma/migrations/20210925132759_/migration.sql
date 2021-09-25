/*
  Warnings:

  - You are about to drop the column `lastUsed` on the `SecretKey` table. All the data in the column will be lost.
  - You are about to drop the `IncomingWebhook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IncomingWebhook" DROP CONSTRAINT "IncomingWebhook_productDataFeedId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingWebhook" DROP CONSTRAINT "IncomingWebhook_saleorAppId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingWebhook" DROP CONSTRAINT "IncomingWebhook_secretId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingWebhook" DROP CONSTRAINT "IncomingWebhook_strapiAppId_fkey";

-- AlterTable
ALTER TABLE "SecretKey" DROP COLUMN "lastUsed";

-- DropTable
DROP TABLE "IncomingWebhook";

-- CreateTable
CREATE TABLE "IncomingSaleorWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "secretId" TEXT NOT NULL,
    "saleorAppId" TEXT NOT NULL,

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
    "secretId" TEXT NOT NULL,
    "productDataFeedAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IncomingSaleorWebhook_secretId_unique" ON "IncomingSaleorWebhook"("secretId");

-- CreateIndex
CREATE UNIQUE INDEX "IncomingStrapiWebhook_secretId_unique" ON "IncomingStrapiWebhook"("secretId");

-- CreateIndex
CREATE UNIQUE INDEX "IncomingProductDataFeedWebhook_secretId_unique" ON "IncomingProductDataFeedWebhook"("secretId");

-- AddForeignKey
ALTER TABLE "IncomingSaleorWebhook" ADD FOREIGN KEY ("secretId") REFERENCES "SecretKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingSaleorWebhook" ADD FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingStrapiWebhook" ADD FOREIGN KEY ("secretId") REFERENCES "SecretKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingStrapiWebhook" ADD FOREIGN KEY ("strapiAppId") REFERENCES "StrapiApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingProductDataFeedWebhook" ADD FOREIGN KEY ("secretId") REFERENCES "SecretKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingProductDataFeedWebhook" ADD FOREIGN KEY ("productDataFeedAppId") REFERENCES "ProductDataFeedApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
