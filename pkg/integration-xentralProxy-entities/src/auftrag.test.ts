import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { XentralProxyOrderSyncService } from "./auftrag";
import "@eci/pkg/jest-utils/consoleFormatter";
import { XentralRestClient } from "@eci/pkg/xentral/src/rest";
import { XentralXmlClient } from "@eci/pkg/xentral/src/xml";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("XentralProxy Entity Sync Orders Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync orders to Xentral via XentralProxy", async () => {
    const xentralProxyApp = await prismaClient.xentralProxyApp.findUnique({
      where: {
        id: "xpa_gigago",
        // id: "test",
      },
    });
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "pk_7f16573fece94114847dc81d3214eef4",
        // id: "test",
      },
    });
    if (!xentralProxyApp || !tenant)
      throw new Error(
        "Testing Tenant or xentral app/integration not found in DB",
      );
    const xentralXmlClient = new XentralXmlClient(xentralProxyApp);
    const xentralRestClient = new XentralRestClient(xentralProxyApp);
    const service = new XentralProxyOrderSyncService({
      xentralXmlClient,
      xentralRestClient,
      logger: new AssertionLogger(),
      db: prismaClient,
      xentralProxyApp,
    });
    await service.syncFromECI();
  }, 1000000);
});
