-- AlterTable
ALTER TABLE `Payment` MODIFY `paymentMethod` ENUM('paypal', 'card', 'banktransfer', 'braintree', 'onlinepayment', 'unknown') NOT NULL;

-- CreateTable
CREATE TABLE `ZohoSalesOrder` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `zohoContactId` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoSalesOrder_orderId_key`(`orderId`),
    UNIQUE INDEX `ZohoSalesOrder_id_zohoAppId_key`(`id`, `zohoAppId`),
    UNIQUE INDEX `ZohoSalesOrder_number_zohoAppId_key`(`number`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
