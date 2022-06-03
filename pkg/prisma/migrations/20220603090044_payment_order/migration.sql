/*
  Warnings:

  - A unique constraint covering the columns `[orderId,tenantId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `paymentMethod` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Payment` MODIFY `paymentMethod` ENUM('paypal', 'card', 'banktransfer') NOT NULL;

-- AlterTable
ALTER TABLE `ZohoPayment` ADD COLUMN `zohoContactId` VARCHAR(191) NULL,
    MODIFY `paymentId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ZohoInvoice` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoInvoice_id_zohoAppId_key`(`id`, `zohoAppId`),
    UNIQUE INDEX `ZohoInvoice_number_zohoAppId_key`(`number`, `zohoAppId`)
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

-- CreateIndex
CREATE UNIQUE INDEX `Payment_orderId_tenantId_key` ON `Payment`(`orderId`, `tenantId`);
