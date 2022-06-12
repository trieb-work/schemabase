/*
  Warnings:

  - Added the required column `taxPercentage` to the `LineItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LineItem` ADD COLUMN `discountValueNet` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `taxPercentage` DOUBLE NOT NULL,
    ADD COLUMN `totalPriceGross` DOUBLE NULL,
    ADD COLUMN `totalPriceNet` DOUBLE NULL;
