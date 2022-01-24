import { createSaleorClient } from "@eci/pkg/saleor";
import { env } from "@eci/pkg/env";
import { afterAll, describe, expect, it } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import { id } from "@eci/pkg/ids";
/**
 * The saleor endpoint reachable from outside of the cluster
 * For example: "http://localhost:8000/graphql/";
 */
const SALEOR_URL = env.require("SALEOR_URL");

// /**
//  * The saleor endpoint reachable from inside of the cluster
//  * For example: "http://saleor.eci:8000/graphql/";
//  */
// const SALEOR_URL_FROM_CONTAINER = env.require("SALEOR_URL_FROM_CONTAINER");

const prisma = new PrismaClient();

/**
 * Called directly from the host, thus we need the endpoint to reference `localhost`
 * instead of the container name
 */
const setupSaleorClient = createSaleorClient({
  traceId: "test",
  graphqlEndpoint: SALEOR_URL,
});

afterAll(async () => {
  await prisma.$disconnect();
});

/**
 * Trigger a new app installation on saleor via graphql. Saleor should then call
 * our manifest endpoint and retrieve the necessary data. Afterwards the
 * webhooks should be setup in our database as well as in saleor and be
 * connected properly.
 */
describe("Saleor app installation", () => {
  it("should create a new saleor app using the manifest route", async () => {
    const tenant = await prisma.tenant.create({
      data: {
        id: id.id("test"),
        name: id.id("test"),
      },
    });

    const setup = await setupSaleorClient.tokenCreate({
      email: "admin@example.com",
      password: "admin",
    });
    if (!setup?.tokenCreate?.token) {
      throw new Error("Unable to get saleor token");
    }
    const client = createSaleorClient({
      traceId: "test",
      graphqlEndpoint: SALEOR_URL,
      token: setup.tokenCreate.token,
    });
    /**
     * Manually trigger an app installation
     */
    await client.appInstall({
      input: {
        activateAfterInstallation: true,
        appName: id.id("test"),
        manifestUrl: `${env.require(
          "ECI_BASE_URL_FROM_CONTAINER",
        )}/api/saleor/manifest/${tenant.id}`,
      },
    });
    /**
     * Wait for requests to happen in the background
     */
    await new Promise((resolve) => setTimeout(resolve, 20000));

    /**
     * Load what we have stored in our db
     */
    const savedTenant = await prisma.tenant.findUnique({
      where: {
        id: tenant.id,
      },
      include: {
        saleorApps: {
          include: {
            installedSaleorApp: {
              include: {
                webhooks: {
                  include: { secret: true },
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
    const appInDatabase = savedTenant?.saleorApps[0].installedSaleorApp;
    if (appInDatabase == null) {
      throw new Error("Error during setup");
    }

    /**
     * Assert app exists in saleor
     */
    const appAtSaleor = await client
      .app({ id: appInDatabase.id })
      .then((res) => res.app);
    if (appAtSaleor == null) {
      throw new Error("Error during setup");
    }

    /**
     * Assert we have stored a valid access token
     */
    const appTokenVerify = await client
      .appTokenVerify({
        token: appInDatabase.token,
      })
      .then((res) => res.appTokenVerify);
    if (appTokenVerify == null) {
      throw new Error("Error during setup");
    }
    expect(appTokenVerify.valid).toBe(true);

    /**
     * Assert everything is setup correctly on saleors side
     */
    if (appAtSaleor.webhooks == null || appAtSaleor.webhooks[0] == null) {
      throw new Error("Error during setup");
    }
    const webhook = appAtSaleor.webhooks[0];
    expect(webhook.isActive).toBe(true);
    expect(webhook.secretKey).toBeDefined();
    expect(appInDatabase.webhooks[0].secret).toBeDefined();
    expect(webhook.secretKey).toEqual(appInDatabase.webhooks[0].secret!.secret);
    expect(webhook.targetUrl).toEqual(
      `${env.require("ECI_BASE_URL_FROM_CONTAINER")}/api/saleor/webhook/v1/${
        appInDatabase.webhooks[0].id
      }`,
    );
  }, 60_000);
});
