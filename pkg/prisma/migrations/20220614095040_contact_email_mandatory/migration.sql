/*
  Warnings:

  - Made the column `email` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Contact` MODIFY `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SaleorZohoIntegration` MODIFY `cronScheduleSaleor` VARCHAR(191) NOT NULL DEFAULT '0/30 * * * *',
    MODIFY `cronScheduleZoho` VARCHAR(191) NOT NULL DEFAULT '0/30 * * * *';
