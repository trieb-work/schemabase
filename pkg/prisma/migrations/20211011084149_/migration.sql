/*
  Warnings:

  - You are about to drop the column `creditCardAccountId` on the `ZohoApp` table. All the data in the column will be lost.
  - You are about to drop the column `customFunctionID` on the `ZohoApp` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `ZohoApp` table. All the data in the column will be lost.
  - You are about to drop the column `payPalAccountId` on the `ZohoApp` table. All the data in the column will be lost.
  - You are about to drop the column `webhookID` on the `ZohoApp` table. All the data in the column will be lost.
  - You are about to drop the column `webhookToken` on the `ZohoApp` table. All the data in the column will be lost.
  - Added the required column `zohoAppId` to the `StrapiToZohoIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StrapiToZohoIntegration" ADD COLUMN     "zohoAppId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ZohoApp" DROP COLUMN "creditCardAccountId",
DROP COLUMN "customFunctionID",
DROP COLUMN "enabled",
DROP COLUMN "payPalAccountId",
DROP COLUMN "webhookID",
DROP COLUMN "webhookToken";

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD FOREIGN KEY ("zohoAppId") REFERENCES "ZohoApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
