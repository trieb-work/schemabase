/*
  Warnings:

  - You are about to drop the column `saleorAppId` on the `IncomingSaleorWebhook` table. All the data in the column will be lost.
  - You are about to drop the column `appToken` on the `SaleorApp` table. All the data in the column will be lost.
  - Added the required column `installedSaleorAppId` to the `IncomingSaleorWebhook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saleorAppId` to the `ProductDataFeedApp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IncomingSaleorWebhook" DROP CONSTRAINT "IncomingSaleorWebhook_saleorAppId_fkey";

-- DropIndex
DROP INDEX "SaleorApp.domain_unique";

-- AlterTable
ALTER TABLE "IncomingSaleorWebhook" DROP COLUMN "saleorAppId",
ADD COLUMN     "installedSaleorAppId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductDataFeedApp" ADD COLUMN     "saleorAppId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SaleorApp" DROP COLUMN "appToken",
ALTER COLUMN "channelSlug" DROP NOT NULL;

-- CreateTable
CREATE TABLE "InstalledSaleorApp" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "saleorAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstalledSaleorApp.saleorAppId_unique" ON "InstalledSaleorApp"("saleorAppId");

-- AddForeignKey
ALTER TABLE "ProductDataFeedApp" ADD FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstalledSaleorApp" ADD FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingSaleorWebhook" ADD FOREIGN KEY ("installedSaleorAppId") REFERENCES "InstalledSaleorApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
