/*
  Warnings:

  - You are about to drop the column `appId` on the `SaleorConfig` table. All the data in the column will be lost.
  - You are about to drop the column `authToken` on the `SaleorConfig` table. All the data in the column will be lost.
  - You are about to drop the column `webhookID` on the `SaleorConfig` table. All the data in the column will be lost.
  - You are about to drop the column `webhookToken` on the `SaleorConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SaleorConfig" DROP COLUMN "appId",
DROP COLUMN "authToken",
DROP COLUMN "webhookID",
DROP COLUMN "webhookToken";
