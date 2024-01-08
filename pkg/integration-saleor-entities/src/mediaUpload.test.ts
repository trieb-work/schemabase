import { InstalledSaleorApp, PrismaClient, SaleorApp } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, expect } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { MediaUpload } from "./mediaUpload";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Saleor Media upload test", () => {
    const mockedInstalledSaleorApp = {} as InstalledSaleorApp & {
        saleorApp: SaleorApp;
    };
    const mockedPrismaClient = {} as PrismaClient;
    const upload = new MediaUpload(
        mockedInstalledSaleorApp,
        mockedPrismaClient,
    );

    const testFile =
        "https://ken-odoo-prod-public.nyc3.digitaloceanspaces.com/products/base-54787";

    test("It should work to get a file extension of media file", async () => {
        const blob = await upload.fetchMediaBlob(testFile);
        const extension = await upload.getFileExtension("noextension", blob);
        expect(extension?.extension).toBe(".jpg");
    });
});
