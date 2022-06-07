/*
  Warnings:

  - A unique constraint covering the columns `[normalizedName,tenantId]` on the table `Tax` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `normalizedName` to the `Tax` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Tax` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tax` ADD COLUMN `normalizedName` VARCHAR(191) NOT NULL,
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ZohoTax` (
    `id` VARCHAR(191) NOT NULL,
    `taxId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoTax_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Tax_normalizedName_tenantId_key` ON `Tax`(`normalizedName`, `tenantId`);
