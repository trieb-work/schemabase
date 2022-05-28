/*
  Warnings:

  - You are about to drop the column `channelSlug` on the `SaleorApp` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[domain,channelSlug]` on the table `InstalledSaleorApp` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[saleorAppId,domain]` on the table `InstalledSaleorApp` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[domain,tenantId]` on the table `SaleorApp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domain` to the `InstalledSaleorApp` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `InstalledSaleorApp_saleorAppId_key` ON `InstalledSaleorApp`;

-- DropIndex
DROP INDEX `SaleorApp_domain_channelSlug_key` ON `SaleorApp`;

-- AlterTable
ALTER TABLE `InstalledSaleorApp` ADD COLUMN `channelSlug` VARCHAR(191) NULL,
    ADD COLUMN `domain` VARCHAR(191) NOT NULL,
    MODIFY `type` ENUM('productdatafeed', 'zohointegration', 'mailchimpintegration', 'paymentgatewaybanktransfer', 'paymentgatewaybraintree') NULL;

-- AlterTable
ALTER TABLE `SaleorApp` DROP COLUMN `channelSlug`;

-- CreateIndex
CREATE UNIQUE INDEX `InstalledSaleorApp_domain_channelSlug_key` ON `InstalledSaleorApp`(`domain`, `channelSlug`);

-- CreateIndex
CREATE UNIQUE INDEX `InstalledSaleorApp_saleorAppId_domain_key` ON `InstalledSaleorApp`(`saleorAppId`, `domain`);

-- CreateIndex
CREATE UNIQUE INDEX `SaleorApp_domain_tenantId_key` ON `SaleorApp`(`domain`, `tenantId`);
