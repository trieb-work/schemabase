/*
  Warnings:

  - You are about to drop the column `paymentId` on the `SaleorPayment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `SaleorPayment_paymentId_key` ON `SaleorPayment`;

-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `orderId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SaleorPayment` DROP COLUMN `paymentId`,
    ADD COLUMN `saleorOrderId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SaleorOrder` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorOrder_id_installedSaleorAppId_key`(`id`, `installedSaleorAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
