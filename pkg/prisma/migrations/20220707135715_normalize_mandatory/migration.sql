/*
  Warnings:

  - Made the column `normalizedName` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Company` MODIFY `normalizedName` VARCHAR(191) NOT NULL;
