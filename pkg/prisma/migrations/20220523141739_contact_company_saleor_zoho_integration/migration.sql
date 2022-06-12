/*
  Warnings:

  - You are about to drop the column `saleorAppId` on the `ProductDataFeedIntegration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Contact` ADD COLUMN `companyId` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ProductDataFeedIntegration` DROP COLUMN `saleorAppId`,
    ADD COLUMN `installedSaleorAppId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Company_tenantId_key`(`tenantId`),
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
    `syncOrders` BOOLEAN NOT NULL DEFAULT false,
    `syncInvoices` BOOLEAN NOT NULL DEFAULT false,
    `syncPayments` BOOLEAN NOT NULL DEFAULT false,
    `syncProductStocks` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `SaleorZohoIntegration_subscriptionId_key`(`subscriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Contact_companyId_key` ON `Contact`(`companyId`);
