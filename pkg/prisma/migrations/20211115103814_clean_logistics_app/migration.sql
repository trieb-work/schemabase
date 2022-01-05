/*
  Warnings:

  - You are about to drop the column `enabled` on the `LogisticsApp` table. All the data in the column will be lost.
  - You are about to drop the column `logisticsIntegrationId` on the `LogisticsApp` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `ProductDataFeedApp` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[logisticsAppId]` on the table `LogisticsIntegration` will be added. If there are existing duplicate values, this will fail.
  - Made the column `logisticsAppId` on table `IncomingLogisticsWebhook` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `logisticsAppId` to the `LogisticsIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LogisticsApp" DROP CONSTRAINT "LogisticsApp_logisticsIntegrationId_fkey";

-- AlterTable
ALTER TABLE "IncomingLogisticsWebhook" ALTER COLUMN "logisticsAppId" SET NOT NULL;

-- AlterTable
ALTER TABLE "LogisticsApp" DROP COLUMN "enabled",
DROP COLUMN "logisticsIntegrationId";

-- AlterTable
ALTER TABLE "LogisticsIntegration" ADD COLUMN     "logisticsAppId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductDataFeedApp" DROP COLUMN "enabled";

-- CreateIndex
CREATE UNIQUE INDEX "LogisticsIntegration_logisticsAppId_unique" ON "LogisticsIntegration"("logisticsAppId");

-- AddForeignKey
ALTER TABLE "LogisticsIntegration" ADD FOREIGN KEY ("logisticsAppId") REFERENCES "LogisticsApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
