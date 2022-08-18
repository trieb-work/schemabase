/*
  Warnings:

  - You are about to drop the column `country` on the `Address` table. All the data in the column will be lost.
  - Added the required column `countryCode` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Address` DROP COLUMN `country`,
    ADD COLUMN `countryCode` VARCHAR(191) NOT NULL,
    MODIFY `additionalAddressLine` VARCHAR(191) NULL,
    MODIFY `countryArea` VARCHAR(191) NULL,
    MODIFY `company` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL;
