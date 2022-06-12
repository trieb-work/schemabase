/*
  Warnings:

  - A unique constraint covering the columns `[name,tenantId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,tenantId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Company_tenantId_key` ON `Company`;

-- DropIndex
DROP INDEX `Contact_tenantId_key` ON `Contact`;

-- DropIndex
DROP INDEX `Payment_tenantId_key` ON `Payment`;

-- AlterTable
ALTER TABLE `Company` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ZohoContact` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `contactId` VARCHAR(191) NOT NULL,
    `zohoAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ZohoContact_id_zohoAppId_key`(`id`, `zohoAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CronJobState` (
    `id` VARCHAR(191) NOT NULL,
    `lastRun` DATETIME(3) NULL,
    `lastRunStatus` ENUM('success', 'failure') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Company_name_tenantId_key` ON `Company`(`name`, `tenantId`);

-- CreateIndex
CREATE UNIQUE INDEX `Contact_email_tenantId_key` ON `Contact`(`email`, `tenantId`);
