-- CreateTable
CREATE TABLE `SaleorPackage` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `packageId` VARCHAR(191) NOT NULL,
    `installedSaleorAppId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SaleorPackage_id_installedSaleorAppId_key`(`id`, `installedSaleorAppId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
