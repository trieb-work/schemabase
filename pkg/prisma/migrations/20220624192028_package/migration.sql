/*
  Warnings:

  - A unique constraint covering the columns `[trackingId,tenantId]` on the table `Package` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number,tenantId]` on the table `Package` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Package_trackingId_key` ON `Package`;

-- AlterTable
ALTER TABLE `Package` ADD COLUMN `number` VARCHAR(191) NOT NULL,
    ADD COLUMN `tenantId` VARCHAR(191) NOT NULL,
    MODIFY `carrier` ENUM('DPD', 'DHL', 'UPS', 'UNKNOWN') NOT NULL,
    MODIFY `state` ENUM('INIT', 'INFORMATION_RECEIVED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED_ATTEMPT', 'DELIVERED', 'AVAILABLE_FOR_PICKUP', 'EXCEPTION', 'EXPIRED', 'PENDING') NOT NULL DEFAULT 'INIT',
    MODIFY `trackingId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ZohoPackage` (
    `id` VARCHAR(191) NOT NULL,
    `shipmentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `packageId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoPackage_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Package_trackingId_tenantId_key` ON `Package`(`trackingId`, `tenantId`);

-- CreateIndex
CREATE UNIQUE INDEX `Package_number_tenantId_key` ON `Package`(`number`, `tenantId`);
