/*
  Warnings:

  - A unique constraint covering the columns `[id,orderNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,sku]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,domain]` on the table `SaleorApp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Order_id_orderNumber_key` ON `Order`(`id`, `orderNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductVariant_id_sku_key` ON `ProductVariant`(`id`, `sku`);

-- CreateIndex
CREATE UNIQUE INDEX `SaleorApp_id_domain_key` ON `SaleorApp`(`id`, `domain`);
