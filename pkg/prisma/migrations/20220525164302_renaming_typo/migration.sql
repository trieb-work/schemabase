/*
  Warnings:

  - You are about to drop the column `productVarianId` on the `ZohoItem` table. All the data in the column will be lost.
  - Added the required column `productVariantId` to the `ZohoItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ZohoItem` DROP COLUMN `productVarianId`,
    ADD COLUMN `productVariantId` VARCHAR(191) NOT NULL;
