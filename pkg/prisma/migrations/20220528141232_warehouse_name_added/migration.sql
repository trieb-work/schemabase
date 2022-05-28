/*
  Warnings:

  - You are about to drop the column `createdAt` on the `SaleorWarehouse` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SaleorWarehouse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,tenantId]` on the table `Warehouse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SaleorWarehouse` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `SaleorZohoIntegration` ADD COLUMN `orderPrefix` VARCHAR(191) NOT NULL DEFAULT 'STORE';

-- AlterTable
ALTER TABLE `Warehouse` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Warehouse_name_tenantId_key` ON `Warehouse`(`name`, `tenantId`);
