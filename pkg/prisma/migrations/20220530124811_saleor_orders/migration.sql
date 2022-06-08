/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `SaleorOrder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderNumber,tenantId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `SaleorOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `orderNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SaleorOrder` DROP COLUMN `updatedAt`,
    ADD COLUMN `orderNumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_orderNumber_tenantId_key` ON `Order`(`orderNumber`, `tenantId`);
