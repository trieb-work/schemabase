/*
  Warnings:

  - You are about to drop the column `contactId` on the `ZohoContact` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `ZohoContact` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `ZohoContact` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `ZohoContact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `discountValueNet` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `ZohoContact` DROP COLUMN `contactId`,
    DROP COLUMN `email`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`;

-- AlterTable
ALTER TABLE `ZohoInvoice` ADD COLUMN `zohoContactPersonId` VARCHAR(191) NULL,
    ADD COLUMN `zohoContactPersonZohoAppId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ZohoPayment` ADD COLUMN `zohoContactPersonId` VARCHAR(191) NULL,
    ADD COLUMN `zohoContactPersonZohoAppId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ZohoSalesOrder` ADD COLUMN `zohoContactPersonId` VARCHAR(191) NULL,
    ADD COLUMN `zohoContactPersonZohoAppId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ZohoContactPerson` (
    `id` VARCHAR(191) NOT NULL,
    `zohoContactId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `contactId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoContactPerson_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
