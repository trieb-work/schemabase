-- CreateTable
CREATE TABLE `StockEntries` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `warehouseId` VARCHAR(191) NOT NULL,
    `productVariantId` VARCHAR(191) NOT NULL,
    `actualCommittedStock` INTEGER NOT NULL DEFAULT 0,
    `actualAvailableStock` INTEGER NOT NULL DEFAULT 0,
    `actualAvailableForSaleStock` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `StockEntries_warehouseId_productVariantId_tenantId_key`(`warehouseId`, `productVariantId`, `tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
