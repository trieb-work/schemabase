/*
  Warnings:

  - You are about to drop the `OrderLine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `SaleorPayment_paymentId_key` ON `SaleorPayment`;

-- DropTable
DROP TABLE `OrderLine`;

-- CreateTable
CREATE TABLE `ZohoLineItems` (
    `id` VARCHAR(191) NOT NULL,
    `lineItemId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoLineItems_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LineItem` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `uniqueString` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `productVariantId` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `LineItem_uniqueString_tenantId_key`(`uniqueString`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
