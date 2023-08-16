// test the client.ts file. Use the KencoveApiApp from the database with id "test".
// Use the prismaClient to get the app from the database. Import
// the prisma client from @eci/pkg/prisma
// This is a test file, so it is not included in the build.
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { KencoveApiClient } from "./client";
import { beforeAll, describe, expect, it } from "@jest/globals";
import { subDays, subYears } from "date-fns";
import { NoopLogger } from "@eci/pkg/logger";
import { KencoveApiAppAddressSyncService } from "./addresses";
import { KencoveApiAppProductSyncService } from "./products";
import { KencoveApiAppAttributeSyncService } from "./attributes";

const prisma = new PrismaClient();

describe("KencoveApiClient", () => {
  let app: KencoveApiApp;

  beforeAll(async () => {
    app = await prisma.kencoveApiApp.findUniqueOrThrow({
      where: {
        id: "test",
      },
    });
    const cronIdAddresses = `${app.tenantId}_${app.id}_addresses`;
    await prisma.cronJobState.upsert({
      where: {
        id: cronIdAddresses,
      },
      update: {
        lastRun: subDays(new Date(), 1),
      },
      create: {
        id: cronIdAddresses,
        lastRun: subDays(new Date(), 1),
      },
    });
    const cronIdProducts = `${app.tenantId}_${app.id}_items`;
    await prisma.cronJobState.upsert({
      where: {
        id: cronIdProducts,
      },
      update: {
        lastRun: subDays(new Date(), 2),
      },
      create: {
        id: cronIdProducts,
        lastRun: subDays(new Date(), 2),
      },
    });
    const cronIdAttributes = `${app.tenantId}_${app.id}_attributes`;
    await prisma.cronJobState.upsert({
      where: {
        id: cronIdAttributes,
      },
      update: {
        lastRun: subDays(new Date(), 2),
      },
      create: {
        id: cronIdAttributes,
        lastRun: subDays(new Date(), 2),
      },
    });
  });

  it("should be able to get an access token", async () => {
    const client = new KencoveApiClient(app);
    const token = await client.getAccessToken();
    expect(token).toBeTruthy();
  });

  it("should be able to get a list of addresses", async () => {
    const client = new KencoveApiClient(app);
    // test the getAddresses method with a date from two days in the past
    const addresses = await client.getAddresses(subDays(new Date(), 2));
    console.debug(addresses.length);
    expect(addresses.length).toBeGreaterThan(0);
  });

  it("should be able to get a list of products", async () => {
    const client = new KencoveApiClient(app);
    // test the getProducts method with a date from two days in the past
    const products = await client.getProducts(subDays(new Date(), 2));
    console.debug(products.length);
    expect(products.length).toBeGreaterThan(0);
  });

  it("should be able to get a list of attributes", async () => {
    const client = new KencoveApiClient(app);
    // test the getAttributes method with a date from two days in the past
    const attributes = await client.getAttributes(subDays(new Date(), 100));
    console.debug(attributes.length);
    expect(attributes.length).toBeGreaterThan(0);
  });

  it("should be able to get a list of categories", async () => {
    const client = new KencoveApiClient(app);
    const categories = await client.getCategories(subYears(new Date(), 2));
    console.debug(categories.length);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should work to run the address syncToECI function", async () => {
    const client = new KencoveApiAppAddressSyncService({
      logger: new NoopLogger(),
      db: prisma,
      kencoveApiApp: app,
    });
    await client.syncToECI();
  }, 400000);

  it("should work to run the product syncToECI function", async () => {
    const client = new KencoveApiAppProductSyncService({
      logger: new NoopLogger(),
      db: prisma,
      kencoveApiApp: app,
    });
    await client.syncToECI();
  }, 400000);

  it("should work to run the attribute syncToECI function", async () => {
    const client = new KencoveApiAppAttributeSyncService({
      logger: new NoopLogger(),
      db: prisma,
      kencoveApiApp: app,
    });
    await client.syncToECI();
  }, 400000);
});
