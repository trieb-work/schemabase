/*
  Warnings:

  - You are about to drop the `DPDApp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DPDApp" DROP CONSTRAINT "DPDApp_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "IncomingDPDWebhook" DROP CONSTRAINT "IncomingDPDWebhook_dpdAppId_fkey";

-- DropForeignKey
ALTER TABLE "TrackingIntegration" DROP CONSTRAINT "TrackingIntegration_dpdAppId_fkey";

-- DropTable
DROP TABLE "DPDApp";

-- CreateTable
CREATE TABLE "DpdApp" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DpdApp.tenantId_unique" ON "DpdApp"("tenantId");

-- AddForeignKey
ALTER TABLE "DpdApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingIntegration" ADD FOREIGN KEY ("dpdAppId") REFERENCES "DpdApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingDPDWebhook" ADD FOREIGN KEY ("dpdAppId") REFERENCES "DpdApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
