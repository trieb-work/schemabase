-- AlterTable
ALTER TABLE `Order` MODIFY `orderStatus` ENUM('draft', 'unconfirmed', 'confirmed', 'closed', 'canceled') NOT NULL DEFAULT 'draft',
    MODIFY `paymentStatus` ENUM('unpaid', 'fullyPaid', 'partiallyPaid', 'fullyRefunded', 'partiallyRefunded') NOT NULL DEFAULT 'unpaid';
