-- AlterTable
ALTER TABLE "IncomingWebhook" ADD COLUMN     "elaticLogDrainAppId" TEXT;

-- CreateTable
CREATE TABLE "ElasticLogDrainApp" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "elasticEndpoint" TEXT NOT NULL,
    "elasticUsername" TEXT NOT NULL,
    "elasticPassword" TEXT NOT NULL,
    "vercelConfigurationId" TEXT NOT NULL,
    "vercelProjectId" TEXT NOT NULL,
    "vercelTeamId" TEXT,

    CONSTRAINT "ElasticLogDrainApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogDrainIntegration" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "elasticLogDrainAppId" TEXT NOT NULL,

    CONSTRAINT "LogDrainIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ElasticLogDrainApp_vercelConfigurationId_key" ON "ElasticLogDrainApp"("vercelConfigurationId");

-- CreateIndex
CREATE UNIQUE INDEX "ElasticLogDrainApp_vercelProjectId_key" ON "ElasticLogDrainApp"("vercelProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "LogDrainIntegration_subscriptionId_key" ON "LogDrainIntegration"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "LogDrainIntegration_elasticLogDrainAppId_key" ON "LogDrainIntegration"("elasticLogDrainAppId");

-- AddForeignKey
ALTER TABLE "LogDrainIntegration" ADD CONSTRAINT "LogDrainIntegration_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogDrainIntegration" ADD CONSTRAINT "LogDrainIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogDrainIntegration" ADD CONSTRAINT "LogDrainIntegration_elasticLogDrainAppId_fkey" FOREIGN KEY ("elasticLogDrainAppId") REFERENCES "DpdApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingWebhook" ADD CONSTRAINT "IncomingWebhook_elaticLogDrainAppId_fkey" FOREIGN KEY ("elaticLogDrainAppId") REFERENCES "ElasticLogDrainApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
