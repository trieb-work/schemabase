-- AlterTable
ALTER TABLE `Order` ADD COLUMN `readyToFullfill` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `XentralProxyApp` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `XentralProxyApp_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `XentralProxyIntegration` (
    `id` VARCHAR(191) NOT NULL,
    `payedUntil` DATETIME(3) NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `subscriptionId` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `xentralProxyAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `XentralProxyIntegration_subscriptionId_key`(`subscriptionId`),
    UNIQUE INDEX `XentralProxyIntegration_xentralProxyAppId_key`(`xentralProxyAppId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `XentralProxyAuftrag` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `xentralProxyAppId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
