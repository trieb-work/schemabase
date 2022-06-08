/*
  Warnings:

  - Added the required column `totalPriceGross` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `shippingPriceGross` DOUBLE NULL,
    ADD COLUMN `shippingPriceNet` DOUBLE NULL,
    ADD COLUMN `shippingPriceTaxPercentage` DOUBLE NULL,
    ADD COLUMN `totalPriceGross` DOUBLE NOT NULL,
    ADD COLUMN `totalPriceNet` DOUBLE NULL;
