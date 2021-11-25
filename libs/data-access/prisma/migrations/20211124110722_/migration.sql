/*
  Warnings:

  - You are about to drop the column `secretId` on the `IncomingLogisticsWebhook` table. All the data in the column will be lost.
  - Added the required column `nextFiveDaysBulkOrdersCustomViewId` to the `LogisticsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextFiveDaysOrdersCustomViewId` to the `LogisticsApp` table without a default value. This is not possible if the table is not empty.

*/

-- DropIndex
DROP INDEX "IncomingLogisticsWebhook_secretId_unique";

-- AlterTable
ALTER TABLE "IncomingLogisticsWebhook" DROP COLUMN "secretId";

-- AlterTable
ALTER TABLE "LogisticsApp" ADD COLUMN     "nextFiveDaysBulkOrdersCustomViewId" TEXT NOT NULL,
ADD COLUMN     "nextFiveDaysOrdersCustomViewId" TEXT NOT NULL;
