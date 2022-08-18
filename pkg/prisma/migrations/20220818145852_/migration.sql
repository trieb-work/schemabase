/*
  Warnings:

  - You are about to drop the column `productId` on the `XentralArtikel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[xentralId,xentralProxyAppId]` on the table `XentralArtikel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xentralNummer,xentralProxyAppId]` on the table `XentralArtikel` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `normalizedName` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `ean` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantName` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xentralId` to the `XentralArtikel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xentralNummer` to the `XentralArtikel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `normalizedName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ProductVariant` ADD COLUMN `ean` VARCHAR(191) NOT NULL,
    ADD COLUMN `variantName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `XentralArtikel` DROP COLUMN `productId`,
    ADD COLUMN `xentralId` INTEGER NOT NULL,
    ADD COLUMN `xentralNummer` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `XentralArtikel_xentralId_xentralProxyAppId_key` ON `XentralArtikel`(`xentralId`, `xentralProxyAppId`);

-- CreateIndex
CREATE UNIQUE INDEX `XentralArtikel_xentralNummer_xentralProxyAppId_key` ON `XentralArtikel`(`xentralNummer`, `xentralProxyAppId`);
