-- CreateTable
CREATE TABLE "LogisticsApp" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN DEFAULT false,
    "currentOrdersCustomViewId" TEXT NOT NULL,
    "currentBulkOrdersCustomViewId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "logisticsIntegrationId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogisticsIntegration" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "zohoAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingLogisticsWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "secretId" TEXT NOT NULL,
    "logisticsAppId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LogisticsApp.tenantId_unique" ON "LogisticsApp"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "LogisticsIntegration.subscriptionId_unique" ON "LogisticsIntegration"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "IncomingLogisticsWebhook_secretId_unique" ON "IncomingLogisticsWebhook"("secretId");

-- AddForeignKey
ALTER TABLE "LogisticsApp" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsApp" ADD FOREIGN KEY ("logisticsIntegrationId") REFERENCES "LogisticsIntegration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsIntegration" ADD FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsIntegration" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsIntegration" ADD FOREIGN KEY ("zohoAppId") REFERENCES "ZohoApp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingLogisticsWebhook" ADD FOREIGN KEY ("secretId") REFERENCES "SecretKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingLogisticsWebhook" ADD FOREIGN KEY ("logisticsAppId") REFERENCES "LogisticsApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
