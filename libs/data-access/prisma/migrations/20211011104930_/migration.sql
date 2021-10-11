/*
  Warnings:

  - A unique constraint covering the columns `[strapiAppId]` on the table `StrapiToZohoIntegration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StrapiToZohoIntegration_strapiAppId_unique" ON "StrapiToZohoIntegration"("strapiAppId");
