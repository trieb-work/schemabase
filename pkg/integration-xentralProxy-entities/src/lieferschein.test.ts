import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { XentralRestClient } from "@eci/pkg/xentral/src/rest";
import { XentralXmlClient } from "@eci/pkg/xentral/src/xml";
import { XentralProxyLieferscheinSyncService } from "./lieferschein";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("XentralProxy Entity Sync Orders Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync orders to Xentral via XentralProxy", async () => {
    const xentralProxyApp = await prismaClient.xentralProxyApp.findUnique({
      where: {
        // id: "test",
        id: "xpa_gigago",
      },
    });
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        // id: "test",
        id: "pk_7f165pf-prod",
      },
    });

    if (!xentralProxyApp || !tenant)
      throw new Error(
        "Testing Tenant or xentral app/integration not found in DB",
      );
    const xentralXmlClient = new XentralXmlClient(xentralProxyApp);
    const xentralRestClient = new XentralRestClient(xentralProxyApp);
    const service = new XentralProxyLieferscheinSyncService({
      xentralXmlClient,
      xentralRestClient,
      logger: new AssertionLogger(),
      db: prismaClient,
      xentralProxyApp,
      // warehouseId: xentralProxyIntegration.warehouseId,
    });
    await service.syncToECI();
  }, 1000000);
});
