/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionId]` on the table `StrapiToZohoIntegration` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "StrapiToZohoIntegration" ADD COLUMN     "subscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "StrapiToZohoIntegration.subscriptionId_unique" ON "StrapiToZohoIntegration"("subscriptionId");

-- AddForeignKey
ALTER TABLE "StrapiToZohoIntegration" ADD FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
