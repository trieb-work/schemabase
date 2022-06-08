-- AlterTable
ALTER TABLE `Order` ADD COLUMN `orderStatus` ENUM('draft', 'unconfirmed', 'confirmed', 'closed') NOT NULL DEFAULT 'draft',
    ADD COLUMN `paymentStatus` ENUM('unpaid', 'fullyPaid', 'partiallyPaid') NOT NULL DEFAULT 'unpaid',
    ADD COLUMN `shipmentStatus` ENUM('pending', 'partiallyShipped', 'shipped', 'delivered') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `SaleorZohoIntegration` ADD COLUMN `syncTaxes` BOOLEAN NOT NULL DEFAULT false;
