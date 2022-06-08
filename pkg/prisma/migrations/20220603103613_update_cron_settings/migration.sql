-- AlterTable
ALTER TABLE `SaleorZohoIntegration` ADD COLUMN `cronTimeoutSaleor` INTEGER NOT NULL DEFAULT 600,
    ADD COLUMN `cronTimeoutZoho` INTEGER NOT NULL DEFAULT 600,
    ADD COLUMN `syncContacts` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `syncWarehouses` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `cronScheduleSaleor` VARCHAR(191) NOT NULL DEFAULT '0/15 * * * *',
    MODIFY `cronScheduleZoho` VARCHAR(191) NOT NULL DEFAULT '0/15 * * * *';
