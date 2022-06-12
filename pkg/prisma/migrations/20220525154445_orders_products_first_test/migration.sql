-- AlterTable
ALTER TABLE `InstalledSaleorApp` ADD COLUMN `type` ENUM('productdatafeed', 'zohointegration', 'mailchimpintegration', 'paymentgatewaybanktransfer') NULL;

-- AlterTable
ALTER TABLE `SaleorZohoIntegration` ADD COLUMN `cronScheduleSaleor` VARCHAR(191) NOT NULL DEFAULT '0 * * * *',
    ADD COLUMN `cronScheduleZoho` VARCHAR(191) NOT NULL DEFAULT '0 * * * *';

-- CreateTable
CREATE TABLE `ZohoPayment` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoPayment_paymentId_key`(`paymentId`),
    UNIQUE INDEX `ZohoPayment_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleorPayment` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorPayment_paymentId_key`(`paymentId`),
    UNIQUE INDEX `SaleorPayment_id_installedSaleorAppId_key`(`id`, `installedSaleorAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleorProductVariant` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `productVariantId` VARCHAR(191) NOT NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorProductVariant_productVariantId_key`(`productVariantId`),
    UNIQUE INDEX `SaleorProductVariant_id_installedSaleorAppId_key`(`id`, `installedSaleorAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleorWarehouse` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
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
    `productVarianId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoItem_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoWarehouse` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `warehouseId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoWarehouse_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentMethod` ENUM('paypal', 'card', 'banktransfer') NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Payment_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warehouse` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Warehouse_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderLine` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `quantity` DOUBLE NOT NULL,
    `totalPriceGross` DOUBLE NOT NULL,
    `totalPriceNet` DOUBLE NOT NULL,
    `currency` ENUM('EUR', 'USD') NOT NULL DEFAULT 'EUR',
    `productVariantId` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Product_name_tenantId_key`(`name`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductVariant` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `productId` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProductVariant_sku_tenantId_key`(`sku`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
