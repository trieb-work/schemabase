-- RenameIndex
ALTER INDEX "IncomingSaleorWebhook_secretId_unique" RENAME TO "IncomingSaleorWebhook_secretId_key";

-- RenameIndex
ALTER INDEX "IncomingStrapiWebhook_secretId_unique" RENAME TO "IncomingStrapiWebhook_secretId_key";

-- RenameIndex
ALTER INDEX "InstalledSaleorApp.saleorAppId_unique" RENAME TO "InstalledSaleorApp_saleorAppId_key";

-- RenameIndex
ALTER INDEX "LogisticsApp.tenantId_unique" RENAME TO "LogisticsApp_tenantId_key";

-- RenameIndex
ALTER INDEX "LogisticsIntegration.subscriptionId_unique" RENAME TO "LogisticsIntegration_subscriptionId_key";

-- RenameIndex
ALTER INDEX "LogisticsIntegration_logisticsAppId_unique" RENAME TO "LogisticsIntegration_logisticsAppId_key";

-- RenameIndex
ALTER INDEX "ProductDataFeedApp.tenantId_unique" RENAME TO "ProductDataFeedApp_tenantId_key";

-- RenameIndex
ALTER INDEX "ProductDataFeedIntegration.subscriptionId_unique" RENAME TO "ProductDataFeedIntegration_subscriptionId_key";

-- RenameIndex
ALTER INDEX "ProductDataFeedIntegration_productDataFeedAppId_unique" RENAME TO "ProductDataFeedIntegration_productDataFeedAppId_key";

-- RenameIndex
ALTER INDEX "SaleorApp.domain_channelSlug_unique" RENAME TO "SaleorApp_domain_channelSlug_key";

-- RenameIndex
ALTER INDEX "StrapiToZohoIntegration.subscriptionId_unique" RENAME TO "StrapiToZohoIntegration_subscriptionId_key";

-- RenameIndex
ALTER INDEX "StrapiToZohoIntegration_strapiAppId_unique" RENAME TO "StrapiToZohoIntegration_strapiAppId_key";

-- RenameIndex
ALTER INDEX "ZohoApp.tenantId_unique" RENAME TO "ZohoApp_tenantId_key";
