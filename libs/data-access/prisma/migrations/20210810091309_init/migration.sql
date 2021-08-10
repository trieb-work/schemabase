-- CreateEnum
CREATE TYPE "Language" AS ENUM ('DE', 'EN');

-- CreateTable
CREATE TABLE "MailchimpConfig" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "listId" TEXT NOT NULL,
    "apiToken" TEXT NOT NULL,
    "storeUrl" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "productUrlPattern" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDataFeed" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "productDetailStorefrontURL" TEXT,
    "channel" TEXT,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EasyPostConfig" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "apiToken" TEXT,
    "webhookID" TEXT,
    "tenantId" TEXT NOT NULL,
    "trackAndTraceConfigId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddressVerificationConfig" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "easyPostConfId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BraintreeConfig" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "merchantId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LexofficeConfig" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "apiToken" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZohoConfig" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "publicId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL DEFAULT E'',
    "clientId" TEXT NOT NULL DEFAULT E'',
    "clientSecret" TEXT NOT NULL DEFAULT E'',
    "payPalAccountId" TEXT,
    "creditCardAccountId" TEXT,
    "webhookToken" TEXT NOT NULL,
    "webhookID" TEXT,
    "customFunctionID" TEXT,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailgunConfig" (
    "id" TEXT NOT NULL,
    "publicId" TEXT,
    "apiToken" TEXT NOT NULL,
    "fromDomain" TEXT NOT NULL,
    "fromTitle" TEXT,
    "fromEmail" TEXT,
    "apiHost" TEXT NOT NULL DEFAULT E'api.eu.mailgun.net',
    "tenantId" TEXT NOT NULL,
    "trackAndTraceConfigId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackAndTraceConfig" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "publicId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackAndTraceEmails" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT E'DE',
    "inTransitEmailEnabled" BOOLEAN NOT NULL,
    "inTransitEmailSubject" TEXT,
    "inTransitEmailTemplateName" TEXT,
    "outForDeliveryEmailEnabled" BOOLEAN NOT NULL,
    "outForDeliveryEmailTemplateName" TEXT,
    "outForDeliveryEmailSubject" TEXT,
    "trackAndTraceConfId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleorConfig" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "authToken" TEXT NOT NULL,
    "webhookToken" TEXT NOT NULL,
    "webhookID" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "baseUrl" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedisConfig" (
    "id" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "port" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElasticConfig" (
    "id" TEXT NOT NULL,
    "apmServer" TEXT NOT NULL,
    "apmSecretToken" TEXT NOT NULL,
    "loggingServer" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleOAuthConfig" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MailchimpConfig.tenantId_unique" ON "MailchimpConfig"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeed.tenantId_unique" ON "ProductDataFeed"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "EasyPostConfig.tenantId_unique" ON "EasyPostConfig"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "EasyPostConfig.trackAndTraceConfigId_unique" ON "EasyPostConfig"("trackAndTraceConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "AddressVerificationConfig_easyPostConfId_unique" ON "AddressVerificationConfig"("easyPostConfId");

-- CreateIndex
CREATE UNIQUE INDEX "BraintreeConfig.tenantId_unique" ON "BraintreeConfig"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "LexofficeConfig.tenantId_unique" ON "LexofficeConfig"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ZohoConfig.tenantId_unique" ON "ZohoConfig"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "MailgunConfig.tenantId_unique" ON "MailgunConfig"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "MailgunConfig.trackAndTraceConfigId_unique" ON "MailgunConfig"("trackAndTraceConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackAndTraceConfig.tenantId_unique" ON "TrackAndTraceConfig"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackAndTraceEmails.language_unique" ON "TrackAndTraceEmails"("language");

-- CreateIndex
CREATE UNIQUE INDEX "SaleorConfig.domain_unique" ON "SaleorConfig"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "SaleorConfig.tenantId_unique" ON "SaleorConfig"("tenantId");

-- AddForeignKey
ALTER TABLE "MailchimpConfig" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDataFeed" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EasyPostConfig" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EasyPostConfig" ADD FOREIGN KEY ("trackAndTraceConfigId") REFERENCES "TrackAndTraceConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressVerificationConfig" ADD FOREIGN KEY ("easyPostConfId") REFERENCES "EasyPostConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BraintreeConfig" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LexofficeConfig" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZohoConfig" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailgunConfig" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailgunConfig" ADD FOREIGN KEY ("trackAndTraceConfigId") REFERENCES "TrackAndTraceConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackAndTraceConfig" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackAndTraceEmails" ADD FOREIGN KEY ("trackAndTraceConfId") REFERENCES "TrackAndTraceConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleorConfig" ADD FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
