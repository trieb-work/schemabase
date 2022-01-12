/*
  Warnings:

  - You are about to drop the column `saleorAppId` on the `ProductDataFeedApp` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductDataFeedApp" DROP CONSTRAINT "ProductDataFeedApp_saleorAppId_fkey";

-- AlterTable
ALTER TABLE "ProductDataFeedApp" DROP COLUMN "saleorAppId";
