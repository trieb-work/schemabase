/*
  Warnings:

  - You are about to drop the column `enabled` on the `Tenant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "enabled";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "payedUntil" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDataFeedIntegration" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "productDataFeedId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrapiToZohoIntegration" (
    "id" TEXT NOT NULL,
    "payedUntil" TIMESTAMP(3),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "strapiId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeedIntegration.subscriptionId_unique" ON "ProductDataFeedIntegration"("subscriptionId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeedIntegration" ADD FOREIGN KEY ("productDataFeedId") REFERENCES "ProductDataFeed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD FOREIGN KEY ("strapiId") REFERENCES "Strapi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
