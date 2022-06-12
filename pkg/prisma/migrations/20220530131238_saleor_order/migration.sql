/*
  Warnings:

  - Added the required column `orderId` to the `SaleorOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Order_externalOrderId_key` ON `Order`;

-- AlterTable
ALTER TABLE `Order` MODIFY `externalOrderId` VARCHAR(191) NULL,
    MODIFY `language` ENUM('DE', 'EN') NOT NULL DEFAULT 'DE';

-- AlterTable
ALTER TABLE `SaleorOrder` ADD COLUMN `orderId` VARCHAR(191) NOT NULL;
