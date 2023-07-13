// test the client.ts file. Use the KencoveApiApp from the database with id "test". Use the prismaClient to get the app from the database. Import
// the prisma client from @eci/pkg/prisma
// This is a test file, so it is not included in the build.
import { PrismaClient } from "@eci/pkg/prisma";
import { KencoveApiClient } from "./client";
import { beforeAll, describe, expect, it } from "@jest/globals";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

describe("KencoveApiClient", () => {
  let app: any;

  beforeAll(async () => {
    app = await prisma.kencoveApiApp.findUnique({
      where: {
        id: "test",
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
    console.debug(addresses);
    expect(addresses.length).toBeGreaterThan(0);
  });
});
