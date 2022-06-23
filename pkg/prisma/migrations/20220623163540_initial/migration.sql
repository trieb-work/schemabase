-- CreateTable
CREATE TABLE `SaleorOrder` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(191) NOT NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorOrder_id_installedSaleorAppId_key`(`id`, `installedSaleorAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleorLineItem` (
    `id` VARCHAR(191) NOT NULL,
    `lineItemId` VARCHAR(191) NOT NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorLineItem_id_installedSaleorAppId_key`(`id`, `installedSaleorAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleorPayment` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `saleorOrderId` VARCHAR(191) NULL,
    `paymentId` VARCHAR(191) NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorPayment_id_installedSaleorAppId_key`(`id`, `installedSaleorAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleorProductVariant` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `productVariantId` VARCHAR(191) NOT NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorProductVariant_id_installedSaleorAppId_key`(`id`, `installedSaleorAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleorWarehouse` (
    `id` VARCHAR(191) NOT NULL,
    `warehouseId` VARCHAR(191) NOT NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorWarehouse_warehouseId_key`(`warehouseId`),
    UNIQUE INDEX `SaleorWarehouse_id_installedSaleorAppId_key`(`id`, `installedSaleorAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoItem` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `productVariantId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoItem_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoContact` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoContact_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoContactPerson` (
    `id` VARCHAR(191) NOT NULL,
    `zohoContactId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `contactId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoContactPerson_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoSalesOrder` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `zohoContactId` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,
    `zohoContactPersonId` VARCHAR(191) NULL,
    `zohoContactPersonZohoAppId` VARCHAR(191) NULL,

    UNIQUE INDEX `ZohoSalesOrder_orderId_key`(`orderId`),
    UNIQUE INDEX `ZohoSalesOrder_id_zohoAppId_key`(`id`, `zohoAppId`),
    UNIQUE INDEX `ZohoSalesOrder_number_zohoAppId_key`(`number`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoInvoice` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `zohoContactId` VARCHAR(191) NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,
    `zohoContactPersonId` VARCHAR(191) NULL,
    `zohoContactPersonZohoAppId` VARCHAR(191) NULL,

    UNIQUE INDEX `ZohoInvoice_id_zohoAppId_key`(`id`, `zohoAppId`),
    UNIQUE INDEX `ZohoInvoice_number_zohoAppId_key`(`number`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoPayment` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `zohoContactId` VARCHAR(191) NULL,
    `paymentId` VARCHAR(191) NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,
    `zohoContactPersonId` VARCHAR(191) NULL,
    `zohoContactPersonZohoAppId` VARCHAR(191) NULL,

    UNIQUE INDEX `ZohoPayment_paymentId_key`(`paymentId`),
    UNIQUE INDEX `ZohoPayment_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoWarehouse` (
    `id` VARCHAR(191) NOT NULL,
    `warehouseId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoWarehouse_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoTax` (
    `id` VARCHAR(191) NOT NULL,
    `taxId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoTax_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoLineItem` (
    `id` VARCHAR(191) NOT NULL,
    `lineItemId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoLineItem_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Invoice_invoiceNumber_tenantId_key`(`invoiceNumber`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tax` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `normalizedName` VARCHAR(191) NOT NULL,
    `percentage` DOUBLE NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tax_normalizedName_tenantId_key`(`normalizedName`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `referenceNumber` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentMethod` ENUM('paypal', 'card', 'banktransfer', 'braintree', 'onlinepayment', 'unknown') NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Payment_orderId_tenantId_key`(`orderId`, `tenantId`),
    UNIQUE INDEX `Payment_referenceNumber_tenantId_key`(`referenceNumber`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Company_name_tenantId_key`(`name`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Contact_email_tenantId_key`(`email`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warehouse` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `normalizedName` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Warehouse_name_tenantId_key`(`name`, `tenantId`),
    UNIQUE INDEX `Warehouse_normalizedName_tenantId_key`(`normalizedName`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LineItem` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `uniqueString` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `taxPercentage` DOUBLE NOT NULL,
    `totalPriceNet` DOUBLE NULL,
    `totalPriceGross` DOUBLE NULL,
    `discountValueNet` DOUBLE NOT NULL DEFAULT 0,
    `productVariantId` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `LineItem_uniqueString_tenantId_key`(`uniqueString`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `externalOrderId` VARCHAR(191) NULL,
    `orderStatus` ENUM('draft', 'unconfirmed', 'confirmed', 'closed', 'canceled') NOT NULL DEFAULT 'draft',
    `paymentStatus` ENUM('unpaid', 'fullyPaid', 'partiallyPaid', 'fullyRefunded', 'partiallyRefunded') NOT NULL DEFAULT 'unpaid',
    `shipmentStatus` ENUM('pending', 'partiallyShipped', 'shipped', 'delivered') NOT NULL DEFAULT 'pending',
    `orderNumber` VARCHAR(191) NOT NULL,
    `shippingPriceNet` DOUBLE NULL,
    `shippingPriceGross` DOUBLE NULL,
    `shippingPriceTaxPercentage` DOUBLE NULL,
    `discountValueNet` DOUBLE NOT NULL DEFAULT 0,
    `totalPriceNet` DOUBLE NULL,
    `totalPriceGross` DOUBLE NOT NULL,
    `language` ENUM('DE', 'EN') NOT NULL DEFAULT 'DE',
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Order_orderNumber_tenantId_key`(`orderNumber`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NULL,
    `normalizedName` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Product_name_tenantId_key`(`name`, `tenantId`),
    UNIQUE INDEX `Product_normalizedName_tenantId_key`(`normalizedName`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductVariant` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProductVariant_sku_tenantId_key`(`sku`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Braintree` (
    `id` VARCHAR(191) NOT NULL,
    `environment` ENUM('testing', 'production') NOT NULL DEFAULT 'production',
    `merchantId` VARCHAR(191) NOT NULL,
    `publicKey` VARCHAR(191) NOT NULL,
    `privateKey` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

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
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorApp_domain_tenantId_key`(`domain`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstalledSaleorApp` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('productdatafeed', 'zohointegration', 'mailchimpintegration', 'paymentgatewaybanktransfer', 'paymentgatewaybraintree') NULL,
    `token` VARCHAR(191) NOT NULL,
    `channelSlug` VARCHAR(191) NULL,
    `saleorAppId` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `InstalledSaleorApp_domain_channelSlug_key`(`domain`, `channelSlug`),
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
    `installedSaleorAppId` VARCHAR(191) NULL,

    UNIQUE INDEX `ProductDataFeedIntegration_subscriptionId_key`(`subscriptionId`),
    UNIQUE INDEX `ProductDataFeedIntegration_productDataFeedAppId_key`(`productDataFeedAppId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CronJobState` (
    `id` VARCHAR(191) NOT NULL,
    `lastRun` DATETIME(3) NULL,
    `lastRunStatus` ENUM('success', 'failure') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleorZohoIntegration` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `subscriptionId` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,
    `orderPrefix` VARCHAR(191) NOT NULL DEFAULT 'STORE',
    `syncContacts` BOOLEAN NOT NULL DEFAULT false,
    `syncWarehouses` BOOLEAN NOT NULL DEFAULT false,
    `syncOrders` BOOLEAN NOT NULL DEFAULT false,
    `syncInvoices` BOOLEAN NOT NULL DEFAULT false,
    `syncPayments` BOOLEAN NOT NULL DEFAULT false,
    `syncProductStocks` BOOLEAN NOT NULL DEFAULT false,
    `syncProducts` BOOLEAN NOT NULL DEFAULT false,
    `syncTaxes` BOOLEAN NOT NULL DEFAULT false,
    `cronScheduleZoho` VARCHAR(191) NOT NULL DEFAULT '*/30 * * * *',
    `cronScheduleSaleor` VARCHAR(191) NOT NULL DEFAULT '*/30 * * * *',
    `cronTimeoutZoho` INTEGER NOT NULL DEFAULT 800,
    `cronTimeoutSaleor` INTEGER NOT NULL DEFAULT 600,

    UNIQUE INDEX `SaleorZohoIntegration_subscriptionId_key`(`subscriptionId`),
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
CREATE TABLE `_InvoiceToPayment` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_InvoiceToPayment_AB_unique`(`A`, `B`),
    INDEX `_InvoiceToPayment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_InvoiceToOrder` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_InvoiceToOrder_AB_unique`(`A`, `B`),
    INDEX `_InvoiceToOrder_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ContactToOrder` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ContactToOrder_AB_unique`(`A`, `B`),
    INDEX `_ContactToOrder_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
