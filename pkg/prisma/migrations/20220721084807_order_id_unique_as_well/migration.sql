/*
  Warnings:

  - A unique constraint covering the columns `[orderId,installedSaleorAppId]` on the table `SaleorOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SaleorOrder_orderId_installedSaleorAppId_key` ON `SaleorOrder`(`orderId`, `installedSaleorAppId`);
