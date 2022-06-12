/*
  Warnings:

  - A unique constraint covering the columns `[referenceNumber,tenantId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referenceNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `referenceNumber` VARCHAR(191) NOT NULL,
    MODIFY `paymentMethod` ENUM('paypal', 'card', 'banktransfer', 'braintree', 'onlinepayment') NOT NULL;

-- AlterTable
ALTER TABLE `ZohoInvoice` ADD COLUMN `zohoContactId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_referenceNumber_tenantId_key` ON `Payment`(`referenceNumber`, `tenantId`);
