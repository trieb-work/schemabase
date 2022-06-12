/*
  Warnings:

  - You are about to drop the column `createdAt` on the `SaleorProductVariant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[normalizedName,tenantId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `normalizedName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SaleorProductVariant` DROP COLUMN `createdAt`;

-- CreateIndex
CREATE UNIQUE INDEX `Product_normalizedName_tenantId_key` ON `Product`(`normalizedName`, `tenantId`);
