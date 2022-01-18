/*
  Warnings:

  - You are about to drop the column `elaticLogDrainAppId` on the `IncomingWebhook` table. All the data in the column will be lost.
  - You are about to drop the `ElasticLogDrainApp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LogDrainIntegration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IncomingWebhook" DROP CONSTRAINT "IncomingWebhook_elaticLogDrainAppId_fkey";

-- DropForeignKey
ALTER TABLE "LogDrainIntegration" DROP CONSTRAINT "LogDrainIntegration_elasticLogDrainAppId_fkey";

-- DropForeignKey
ALTER TABLE "LogDrainIntegration" DROP CONSTRAINT "LogDrainIntegration_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "LogDrainIntegration" DROP CONSTRAINT "LogDrainIntegration_tenantId_fkey";

-- AlterTable
ALTER TABLE "IncomingWebhook" DROP COLUMN "elaticLogDrainAppId",
ADD COLUMN     "vercelLogDrainAppId" TEXT;

-- DropTable
DROP TABLE "ElasticLogDrainApp";

-- DropTable
DROP TABLE "LogDrainIntegration";

-- CreateTable
CREATE TABLE "ElasticCluster" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endpoint" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "ElasticCluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VercelLogDrainApp" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "configurationId" TEXT NOT NULL,
    "installationId" TEXT NOT NULL,
    "projectId" TEXT,
    "teamId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VercelLogDrainApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElasticLogDrainIntegration" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "logDrainAppId" TEXT NOT NULL,
    "elasticClusterId" TEXT NOT NULL,

    CONSTRAINT "ElasticLogDrainIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VercelLogDrainApp_configurationId_key" ON "VercelLogDrainApp"("configurationId");

-- CreateIndex
CREATE UNIQUE INDEX "VercelLogDrainApp_installationId_key" ON "VercelLogDrainApp"("installationId");

-- CreateIndex
CREATE UNIQUE INDEX "VercelLogDrainApp_projectId_key" ON "VercelLogDrainApp"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ElasticLogDrainIntegration_subscriptionId_key" ON "ElasticLogDrainIntegration"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "ElasticLogDrainIntegration_logDrainAppId_key" ON "ElasticLogDrainIntegration"("logDrainAppId");

-- CreateIndex
CREATE UNIQUE INDEX "ElasticLogDrainIntegration_elasticClusterId_key" ON "ElasticLogDrainIntegration"("elasticClusterId");

-- AddForeignKey
ALTER TABLE "ElasticLogDrainIntegration" ADD CONSTRAINT "ElasticLogDrainIntegration_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElasticLogDrainIntegration" ADD CONSTRAINT "ElasticLogDrainIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElasticLogDrainIntegration" ADD CONSTRAINT "ElasticLogDrainIntegration_logDrainAppId_fkey" FOREIGN KEY ("logDrainAppId") REFERENCES "VercelLogDrainApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElasticLogDrainIntegration" ADD CONSTRAINT "ElasticLogDrainIntegration_elasticClusterId_fkey" FOREIGN KEY ("elasticClusterId") REFERENCES "ElasticCluster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD CONSTRAINT "IncomingWebhook_vercelLogDrainAppId_fkey" FOREIGN KEY ("vercelLogDrainAppId") REFERENCES "VercelLogDrainApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
