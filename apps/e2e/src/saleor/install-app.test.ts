import { createSaleorClient } from "@eci/adapters/saleor";
import { env } from "@chronark/env";

import { PrismaClient } from "@eci/data-access/prisma";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const tenantId = randomUUID();
const saleorInternalAppName = randomUUID();

let client = createSaleorClient({
  traceId: "test",
  graphqlEndpoint: env.require("SALEOR_GRAPHQL_ENDPOINT"),
});

beforeAll(async () => {
  await prisma.tenant.create({
    data: {
      id: tenantId,
      name: randomUUID(),
    },
  });

  const res = await client.tokenCreate({
    email: "admin@example.com",
    password: "admin",
  });
  if (!res?.tokenCreate?.token) {
    throw new Error(`Unable to get saleor token`);
  }
  client = createSaleorClient({
    traceId: "test",
    graphqlEndpoint: env.require("SALEOR_GRAPHQL_ENDPOINT"),
    token: res.tokenCreate.token,
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Saleor app installation", () => {
  it("should create a new saleor app using the manifest route", async () => {
    /**
     * Manually trigger an app installation
     */
    const installedApp = await client.appInstall({
      input: {
        activateAfterInstallation: true,
        appName: saleorInternalAppName,
        manifestUrl: `${env.require(
          "ECI_BASE_URL",
        )}/api/saleor/manifest/${tenantId}`,
      },
    });
    const appId = installedApp.appInstall?.appInstallation?.id;
    /**
     * Wait for requests to happen in the background
     */
    await new Promise((resolve) => setTimeout(resolve, 20000));

    /**
     * Load what we have stored in out db
     */
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        saleorApps: {
          include: {
            installedSaleorApp: {
              include: {
                webhooks: {
                  include: {
                    secret: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    /**
     * Assert data in our db
     */
    expect(tenant).not.toBeNull();
    console.error(tenant);
    const app = tenant!.saleorApps.find((a) => a.id === appId);
    expect(app).toBeDefined();
    expect(app!.installedSaleorApp).toBeDefined();
    expect(app!.installedSaleorApp!.webhooks.length).toBe(1);

    /**
     * Assert app exists in saleor
     */
    const appResponse = await client.app({ id: app!.id });
    expect(appResponse).not.toBeNull();
    expect(appResponse!.app).not.toBeNull();
    expect(appResponse!.app!.id).toEqual(app!.id);

    /**
     * Assert we have stored a valid access token
     */
    const res = await client.appTokenVerify({
      token: app!.installedSaleorApp!.token,
    });
    expect(res.appTokenVerify).not.toBeNull();
    expect(res.appTokenVerify!.valid).toBe(true);
  }, 60_000);
});
