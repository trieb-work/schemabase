/*
  Warnings:

  - Added the required column `productId` to the `SaleorProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SaleorProductVariant` ADD COLUMN `productId` VARCHAR(191) NOT NULL;
