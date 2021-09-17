-- CreateTable
CREATE TABLE "SaleorWebhook" (
    "id" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "saleorAppId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SaleorWebhook" ADD FOREIGN KEY ("saleorAppId") REFERENCES "SaleorApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
