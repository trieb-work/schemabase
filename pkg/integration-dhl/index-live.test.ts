import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { DHLTrackingSyncService } from "./index";

/// Use this file to locally run this service

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DHL package sync", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync packages", async () => {
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "pk_7f16573fece94114847dc81d3214eef4",
        // id: "test",
      },
    });
    if (!tenant)
      throw new Error("Testing Tenant or zoho app/integration not found in DB");

    const dhlTrackingApp = await prismaClient.dHLTrackingApp.findUnique({
      where: {
        id: "dhl_tr_vqw435068q0uj1q34ojt",
      },
    });
    if (!dhlTrackingApp) throw new Error("DHL Tracking App not found");

    const service = new DHLTrackingSyncService({
      logger: new AssertionLogger(),
      db: prismaClient,
      dhlTrackingApp,
    });

    await service.syncToECI();
  }, 1000000);
});
