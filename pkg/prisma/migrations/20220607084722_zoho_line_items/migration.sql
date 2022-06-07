/*
  Warnings:

  - You are about to drop the `ZohoLineItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `ZohoLineItems`;

-- CreateTable
CREATE TABLE `SaleorLineItem` (
    `id` VARCHAR(191) NOT NULL,
    `lineItemId` VARCHAR(191) NOT NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorLineItem_id_installedSaleorAppId_key`(`id`, `installedSaleorAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZohoLineItem` (
    `id` VARCHAR(191) NOT NULL,
    `lineItemId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoLineItem_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tax` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `percentage` DOUBLE NOT NULL,

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
