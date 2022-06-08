/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `SaleorPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `SaleorPayment` ADD COLUMN `paymentId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `SaleorPayment_paymentId_key` ON `SaleorPayment`(`paymentId`);
