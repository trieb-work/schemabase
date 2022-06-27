-- AlterTable
ALTER TABLE `LineItem` ADD COLUMN `packageId` VARCHAR(191) NULL,
    MODIFY `taxPercentage` DOUBLE NOT NULL DEFAULT 19;
