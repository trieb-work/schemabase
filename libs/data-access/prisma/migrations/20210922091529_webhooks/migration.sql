/*
  Warnings:

  - You are about to drop the `AddressVerificationConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BraintreeConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EasyPostConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ElasticConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GoogleOAuthConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LexofficeConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MailchimpConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MailgunConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RedisConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleorWebhook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackAndTraceConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackAndTraceEmails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AddressVerificationConfig" DROP CONSTRAINT "AddressVerificationConfig_easyPostConfId_fkey";

-- DropForeignKey
ALTER TABLE "BraintreeConfig" DROP CONSTRAINT "BraintreeConfig_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "EasyPostConfig" DROP CONSTRAINT "EasyPostConfig_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "EasyPostConfig" DROP CONSTRAINT "EasyPostConfig_trackAndTraceConfigId_fkey";

-- DropForeignKey
ALTER TABLE "LexofficeConfig" DROP CONSTRAINT "LexofficeConfig_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "MailchimpConfig" DROP CONSTRAINT "MailchimpConfig_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "MailgunConfig" DROP CONSTRAINT "MailgunConfig_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "MailgunConfig" DROP CONSTRAINT "MailgunConfig_trackAndTraceConfigId_fkey";

-- DropForeignKey
ALTER TABLE "SaleorWebhook" DROP CONSTRAINT "SaleorWebhook_saleorAppId_fkey";

-- DropForeignKey
ALTER TABLE "TrackAndTraceConfig" DROP CONSTRAINT "TrackAndTraceConfig_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "TrackAndTraceEmails" DROP CONSTRAINT "TrackAndTraceEmails_trackAndTraceConfId_fkey";

-- DropTable
DROP TABLE "AddressVerificationConfig";

-- DropTable
DROP TABLE "BraintreeConfig";

-- DropTable
DROP TABLE "EasyPostConfig";

-- DropTable
DROP TABLE "ElasticConfig";

-- DropTable
DROP TABLE "GoogleOAuthConfig";

-- DropTable
DROP TABLE "LexofficeConfig";

-- DropTable
DROP TABLE "MailchimpConfig";

-- DropTable
DROP TABLE "MailgunConfig";

-- DropTable
DROP TABLE "RedisConfig";

-- DropTable
DROP TABLE "SaleorWebhook";

-- DropTable
DROP TABLE "TrackAndTraceConfig";

-- DropTable
DROP TABLE "TrackAndTraceEmails";

-- DropEnum
DROP TYPE "Language";

-- CreateTable
CREATE TABLE "Strapi" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastUsed" TIMESTAMP(3),
    "secretId" TEXT NOT NULL,
    "strapiId" TEXT,
    "saleorApp" TEXT,
    "productDataFeedId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecretKey" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsed" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IncomingWebhook_secretId_unique" ON "IncomingWebhook"("secretId");

-- AddForeignKey
ALTER TABLE "Strapi" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD FOREIGN KEY ("secretId") REFERENCES "SecretKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD FOREIGN KEY ("strapiId") REFERENCES "Strapi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD FOREIGN KEY ("saleorApp") REFERENCES "SaleorApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD FOREIGN KEY ("productDataFeedId") REFERENCES "ProductDataFeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
