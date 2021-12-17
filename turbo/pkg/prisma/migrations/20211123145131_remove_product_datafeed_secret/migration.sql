/*
  Warnings:

  - You are about to drop the column `secretId` on the `IncomingLogisticsWebhook` table. All the data in the column will be lost.
  - You are about to drop the column `secretId` on the `IncomingProductDataFeedWebhook` table. All the data in the column will be lost.
  - Added the required column `nextFiveDaysBulkOrdersCustomViewId` to the `LogisticsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextFiveDaysOrdersCustomViewId` to the `LogisticsApp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IncomingLogisticsWebhook" DROP CONSTRAINT "IncomingLogisticsWebhook_secretId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingProductDataFeedWebhook" DROP CONSTRAINT "IncomingProductDataFeedWebhook_secretId_fkey";

-- DropIndex
DROP INDEX "IncomingLogisticsWebhook_secretId_unique";

-- DropIndex
DROP INDEX "IncomingProductDataFeedWebhook_secretId_unique";

-- AlterTable
ALTER TABLE "IncomingLogisticsWebhook" DROP COLUMN "secretId";

-- AlterTable
ALTER TABLE "IncomingProductDataFeedWebhook" DROP COLUMN "secretId";

-- AlterTable
ALTER TABLE "LogisticsApp" ADD COLUMN     "nextFiveDaysBulkOrdersCustomViewId" TEXT NOT NULL,
ADD COLUMN     "nextFiveDaysOrdersCustomViewId" TEXT NOT NULL;
