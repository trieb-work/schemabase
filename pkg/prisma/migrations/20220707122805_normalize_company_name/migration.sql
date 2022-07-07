/*
  Warnings:

  - A unique constraint covering the columns `[normalizedName,tenantId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Company` ADD COLUMN `normalizedName` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Company_normalizedName_tenantId_key` ON `Company`(`normalizedName`, `tenantId`);
