-- CreateTable
CREATE TABLE `Contact` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Contact_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `externalOrderId` VARCHAR(191) NOT NULL,
    `language` ENUM('DE', 'EN') NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Order_externalOrderId_key`(`externalOrderId`),
    UNIQUE INDEX `Order_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ElasticCluster` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `endpoint` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `index` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VercelLogDrainApp` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `configurationId` VARCHAR(191) NOT NULL,
    `installationId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `teamId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VercelLogDrainApp_configurationId_key`(`configurationId`),
    UNIQUE INDEX `VercelLogDrainApp_installationId_key`(`installationId`),
    UNIQUE INDEX `VercelLogDrainApp_projectId_key`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ElasticLogDrainIntegration` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `subscriptionId` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `logDrainAppId` VARCHAR(191) NOT NULL,
    `elasticClusterId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ElasticLogDrainIntegration_subscriptionId_key`(`subscriptionId`),
    UNIQUE INDEX `ElasticLogDrainIntegration_logDrainAppId_key`(`logDrainAppId`),
    UNIQUE INDEX `ElasticLogDrainIntegration_elasticClusterId_key`(`elasticClusterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Package` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `carrier` ENUM('DPD', 'UNKNOWN') NOT NULL,
    `state` ENUM('INIT', 'INFORMATION_RECEIVED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED_ATTEMPT', 'DELIVERED', 'AVAILABLE_FOR_PICKUP', 'EXCEPTION', 'EXPIRED', 'PENDING') NOT NULL,
    `trackingId` VARCHAR(191) NOT NULL,
    `carrierTrackingUrl` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Package_trackingId_key`(`trackingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackageEvent` (
    `id` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `state` ENUM('INIT', 'INFORMATION_RECEIVED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED_ATTEMPT', 'DELIVERED', 'AVAILABLE_FOR_PICKUP', 'EXCEPTION', 'EXPIRED', 'PENDING') NOT NULL,
    `message` VARCHAR(191) NULL,
    `packageId` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionalEmail` (
    `id` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `sentEmailId` VARCHAR(191) NOT NULL,
    `packageEventId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TransactionalEmail_packageEventId_key`(`packageEventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrackingEmailApp` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `defaultLanguage` ENUM('DE', 'EN') NOT NULL,
    `sender` VARCHAR(191) NOT NULL,
    `replyTo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SendgridTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `packageState` ENUM('INIT', 'INFORMATION_RECEIVED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED_ATTEMPT', 'DELIVERED', 'AVAILABLE_FOR_PICKUP', 'EXCEPTION', 'EXPIRED', 'PENDING') NULL,
    `language` ENUM('DE', 'EN') NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `templateId` VARCHAR(191) NOT NULL,
    `trackingEmailAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SendgridTemplate_trackingEmailAppId_language_packageState_key`(`trackingEmailAppId`, `language`, `packageState`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DpdApp` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DpdApp_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductDataFeedApp` (
    `id` VARCHAR(191) NOT NULL,
    `productDetailStorefrontURL` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProductDataFeedApp_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogisticsApp` (
    `id` VARCHAR(191) NOT NULL,
    `currentOrdersCustomViewId` VARCHAR(191) NOT NULL,
    `nextFiveDaysOrdersCustomViewId` VARCHAR(191) NOT NULL,
    `currentBulkOrdersCustomViewId` VARCHAR(191) NOT NULL,
    `nextFiveDaysBulkOrdersCustomViewId` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `LogisticsApp_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoApp` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `clientSecret` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoApp_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleorApp` (
    `id` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `channelSlug` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorApp_domain_channelSlug_key`(`domain`, `channelSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstalledSaleorApp` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `saleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `InstalledSaleorApp_saleorAppId_key`(`saleorAppId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tenant` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `payedUntil` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrackingIntegration` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `subscriptionId` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `dpdAppId` VARCHAR(191) NOT NULL,
    `trackingEmailAppId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NULL,

    UNIQUE INDEX `TrackingIntegration_subscriptionId_key`(`subscriptionId`),
    UNIQUE INDEX `TrackingIntegration_dpdAppId_key`(`dpdAppId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductDataFeedIntegration` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `subscriptionId` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `productDataFeedAppId` VARCHAR(191) NOT NULL,
    `saleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProductDataFeedIntegration_subscriptionId_key`(`subscriptionId`),
    UNIQUE INDEX `ProductDataFeedIntegration_productDataFeedAppId_key`(`productDataFeedAppId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogisticsIntegration` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `subscriptionId` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,
    `logisticsAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `LogisticsIntegration_subscriptionId_key`(`subscriptionId`),
    UNIQUE INDEX `LogisticsIntegration_logisticsAppId_key`(`logisticsAppId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StrapiToZohoIntegration` (
    `id` VARCHAR(191) NOT NULL,
    `payedUntil` DATETIME(3) NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `strapiContentType` VARCHAR(191) NOT NULL DEFAULT 'bulkorder',
    `subscriptionId` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `strapiAppId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `StrapiToZohoIntegration_subscriptionId_key`(`subscriptionId`),
    UNIQUE INDEX `StrapiToZohoIntegration_strapiAppId_key`(`strapiAppId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StrapiApp` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncomingWebhook` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `dpdAppId` VARCHAR(191) NULL,
    `logisticsAppId` VARCHAR(191) NULL,
    `productDataFeedAppId` VARCHAR(191) NULL,
    `zohoAppId` VARCHAR(191) NULL,
    `strapiAppId` VARCHAR(191) NULL,
    `installedSaleorAppId` VARCHAR(191) NULL,
    `vercelLogDrainAppId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SecretKey` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `secret` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `incomingWebhookId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SecretKey_incomingWebhookId_key`(`incomingWebhookId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ContactToOrder` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ContactToOrder_AB_unique`(`A`, `B`),
    INDEX `_ContactToOrder_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
