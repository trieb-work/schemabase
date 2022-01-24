import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from "@jest/globals";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import faker from "faker";
import { createHash, randomInt } from "crypto";
import { HttpClient } from "@eci/pkg/http";
import { id } from "@eci/pkg/ids";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts/dist/v2";
import { env } from "@eci/pkg/env";
import { generateAddress, triggerWebhook } from "./util";
import { OrderEvent } from "@eci/pkg/integration-bulkorders";
import { verifySyncedOrders } from "./verifySyncedOrders";

config({ path: ".env.local" });

/**
 * Delete contacts and orders after the test cases
 */
const CLEAN_UP = true;

/**
 * Wait for some time after sending a webhook until the message has propagated
 * through our system and entities have been created in zoho.
 */
const waitForPropagation = async () => {
  await new Promise((resolve) => setTimeout(resolve, 30000));
};

const prisma = new PrismaClient();
let zoho: Zoho;

//   zohoClientId: env.require("ZOHO_CLIENT_ID"),
//   zohoClientSecret: env.require("ZOHO_CLIENT_SECRET"),
//   zohoOrgId: env.require("ZOHO_ORG_ID"),
// });

const createdContactIds: string[] = [];

const webhookId = id.id("publicKey");
const webhookSecret = id.id("test");
const prefix = "TEST";

async function generateEvent(
  event: "entry.create" | "entry.update" | "entry.delete",
  status: "Draft" | "Confirmed",
  addresses = 1,
): Promise<OrderEvent> {
  const companyName = id.id("test");

  // eslint-disable-next-line camelcase
  const { contact_id } = await zoho.contact.create({
    company_name: companyName,
    contact_name: companyName,
    // contact_type: "customer",
  });
  // eslint-disable-next-line camelcase
  if (!contact_id || contact_id === "") {
    throw new Error("Unable to setup testing contact");
  }
  createdContactIds.push(contact_id);
  const orderId = randomInt(999_999_999);
  return {
    event,
    created_at: new Date().toISOString(),
    model: "bulkorder",
    entry: {
      id: orderId,
      prefix,
      zohoCustomerId: contact_id,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      addresses: [...Array(addresses)].map((_, rowId) =>
        generateAddress(prefix, orderId, rowId),
      ),
      products: [
        {
          quantity: randomInt(1, 6),
          product: {
            /**
             * Currently hardcoded.
             * This can fail if the item does not exist in zoho.
             * https://inventory.zoho.eu/app#/inventory/items/116240000000378951
             */
            zohoId: "116240000000112128",
          },
        },
      ],
    },
  };
}

beforeAll(async () => {
  const cookies = env.get("ZOHO_COOKIES");
  zoho = new Zoho(
    cookies
      ? await ZohoApiClient.fromCookies({
          orgId: env.require("ZOHO_ORG_ID"),
          cookie: cookies,
          zsrfToken: env.require("ZOHO_ZCSRF_TOKEN"),
        })
      : await ZohoApiClient.fromOAuth({
          orgId: env.require("ZOHO_ORG_ID"),
          client: {
            id: env.require("ZOHO_CLIENT_ID"),
            secret: env.require("ZOHO_CLIENT_SECRET"),
          },
        }),
  );

  const tenant = await prisma.tenant.create({
    data: {
      id: id.id("test"),
      name: faker.company.companyName(),
    },
  });

  /**
   * Upserting because there is a unique constraint on the domain
   */
  const strapiApp = await prisma.strapiApp.create({
    data: {
      id: id.id("test"),
      name: id.id("test"),
      tenantId: tenant.id,
      webhooks: {
        create: [
          {
            id: webhookId,
            secret: {
              create: {
                id: id.id("test"),
                secret: createHash("sha256")
                  .update(webhookSecret)
                  .digest("hex"),
              },
            },
          },
        ],
      },
    },
  });

  const integration = await prisma.strapiToZohoIntegration.create({
    data: {
      id: id.id("test"),
      tenant: {
        connect: {
          id: tenant.id,
        },
      },
      enabled: true,
      strapiApp: {
        connect: {
          id: strapiApp.id,
        },
      },
      zohoApp: {
        create: {
          id: id.id("test"),
          orgId: env.require("ZOHO_ORG_ID"),
          clientId: env.require("ZOHO_CLIENT_ID"),
          clientSecret: env.require("ZOHO_CLIENT_SECRET"),
          tenant: {
            connect: {
              id: tenant.id,
            },
          },
        },
      },
    },
  });
  await prisma.subscription.create({
    data: {
      id: id.id("test"),
      tenantId: tenant.id,
      payedUntil: new Date(Date.now() + 1000 * 60 * 60),
      strapiToZohoIntegration: {
        connect: {
          id: integration.id,
        },
      },
    },
  });
});

afterEach(async () => {
  if (CLEAN_UP) {
    try {
      const ordersInZoho = await zoho.salesOrder.search(`${prefix}-`);
      await zoho.salesOrder.delete(ordersInZoho.map((o) => o.salesorder_id));
    } catch (err) {
      console.error("Unable to clean up", err);
      throw err;
    }
  }
}, 30_000);

afterAll(async () => {
  await prisma.$disconnect();
  if (CLEAN_UP) {
    /** Clean up created entries */
    try {
      for (const id of createdContactIds) {
        await zoho.contact.delete(id);
      }
    } catch (err) {
      console.error("Unable to clean up", err);
      throw err;
    }
  }
}, 100_000);

describe("with invalid webhook", () => {
  describe("without authorization header", () => {
    it("fails with status 400", async () => {
      const res = await new HttpClient().call({
        url: `http://localhost:3000/api/strapi/webhook/v1/${webhookId}`,
        method: "POST",
        body: await generateEvent("entry.create", "Draft"),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("with wrong webhook id", () => {
    it("fails with status 404", async () => {
      const res = await new HttpClient().call({
        url: "http://localhost:3000/api/strapi/webhook/v1/not-a-valid-id",
        method: "POST",
        body: await generateEvent("entry.create", "Draft"),
        headers: {
          authorization: webhookSecret,
        },
      });
      expect(res.status).toBe(404);
    });
  });
  describe("with wrong authorization secret", () => {
    it("fails with status 403", async () => {
      const res = await new HttpClient().call({
        url: `http://localhost:3000/api/strapi/webhook/v1/${webhookId}`,
        method: "POST",
        body: await generateEvent("entry.create", "Draft"),
        headers: {
          authorization: "hello",
        },
      });
      expect(res.status).toBe(403);
    });
  });
});
describe("with valid webhook", () => {
  describe("entry.create", () => {
    describe("with multiple products", () => {
      describe("with different taxes", () => {
        it("applies the highest tax to shipping costs", async () => {
          const event = await generateEvent("entry.create", "Draft", 1);
          event.entry.products.push({
            product: {
              zohoId: "116240000000677007",
            },
            quantity: 5,
          });

          await triggerWebhook(webhookId, webhookSecret, event);
          await waitForPropagation();

          const salesOrders = await verifySyncedOrders(zoho, event);

          const createdOrder = await zoho.salesOrder.retrieve(
            salesOrders[0].salesorder_id,
          );

          expect(createdOrder?.shipping_charge_tax_percentage).toBe(19);
        }, 100_000);
      });
    });
    describe("with only required fields", () => {
      it("syncs all orders correctly", async () => {
        const event = await generateEvent("entry.create", "Draft");

        await triggerWebhook(webhookId, webhookSecret, event);

        await waitForPropagation();

        await verifySyncedOrders(zoho, event);
      }, 100_000);
    });

    describe("with street2", () => {
      it("syncs all orders correctly", async () => {
        const event = await generateEvent("entry.create", "Draft");
        event.entry.addresses = event.entry.addresses.map((a) => ({
          ...a,
          street2: "Imagine a street name here",
        }));

        await triggerWebhook(webhookId, webhookSecret, event);

        await waitForPropagation();

        await verifySyncedOrders(zoho, event);
      }, 100_000);
    });

    describe("with terminationDate", () => {
      it("syncs all orders correctly", async () => {
        const event = await generateEvent("entry.create", "Draft");
        event.entry.terminationDate = "2022-10-02";

        await triggerWebhook(webhookId, webhookSecret, event);

        await waitForPropagation();

        await verifySyncedOrders(zoho, event);
      }, 100_000);
    });
    describe("with different products for an address", () => {
      it("syncs all orders correctly", async () => {
        const event = await generateEvent("entry.create", "Draft");
        event.entry.addresses[0].products = [
          {
            quantity: 2000,
            product: {
              /**
               * Currently hardcoded.
               * This can fail if the item does not exist in zoho.
               * https://inventory.zoho.eu/app#/inventory/items/116240000000378951
               */
              zohoId: "116240000000112128",
            },
          },
        ];

        await triggerWebhook(webhookId, webhookSecret, event);

        await waitForPropagation();

        await verifySyncedOrders(zoho, event);
      }, 100_000);
    });
  });

  describe("entry.update", () => {
    describe("with a new address", () => {
      it("adds a new zoho order", async () => {
        const event = await generateEvent("entry.create", "Draft");

        /**
         * Create first order
         */
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();
        /**
         * If we do not wait the search on zoho will not return the created
         * order yet.
         */
        await new Promise((resolve) => setTimeout(resolve, 5_000));
        /**
         * Create second order
         */
        event.event = "entry.update";
        event.entry.addresses.push(
          generateAddress(
            event.entry.prefix,
            event.entry.id,
            event.entry.addresses.length + 1,
          ),
        );
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        await verifySyncedOrders(zoho, event);
      }, 100_000);
    });
    describe("with a modified address", () => {
      describe("with an optional key added", () => {
        it("replaces the edited order", async () => {
          const event = await generateEvent("entry.create", "Draft");

          /**
           * Create first orders
           */
          await triggerWebhook(webhookId, webhookSecret, event);
          await waitForPropagation();

          event.event = "entry.update";
          event.entry.addresses[0].street2 = "Additional street info";
          await triggerWebhook(webhookId, webhookSecret, event);
          await waitForPropagation();

          await verifySyncedOrders(zoho, event);
        }, 100_000);
      });

      it("replaces the modified order", async () => {
        const event = await generateEvent("entry.create", "Draft");

        /**
         * Create first orders
         */
        await triggerWebhook(webhookId, webhookSecret, event);

        /**
         * If we do not wait the search on zoho will not return the created
         * order yet.
         */
        await new Promise((resolve) => setTimeout(resolve, 5_000));

        event.event = "entry.update";
        event.entry.addresses[0].address = "ChangedStreet 5";
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        await verifySyncedOrders(zoho, event);
      }, 100_000);
    });
    describe("with a modified product", () => {
      it("replaces the modified order", async () => {
        const event = await generateEvent("entry.create", "Draft");

        /**
         * Create first orders
         */
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        /**
         * Shuffle addresses aroujd
         */
        event.event = "entry.update";
        event.entry.products[0].quantity = 999;
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        const ordersInZohoAfterUpdate = await zoho.salesOrder.search(
          event.entry.addresses[0].orderId.split("-").slice(0, 2).join("-"),
        );

        expect(ordersInZohoAfterUpdate.length).toBe(
          event.entry.addresses.length,
        );

        // expect(ordersInZohoAfterUpdate[0].quantity).toBe(999);

        for (const order of ordersInZohoAfterUpdate) {
          expect(order.status).toEqual("draft");
        }
      }, 100_000);
      it("does not create duplicate addresses", async () => {
        const n = 7;
        const event = await generateEvent("entry.create", "Draft", n);

        /**
         * Create first orders
         */
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        /**
         * Shuffle addresses aroujd
         */
        event.event = "entry.update";
        event.entry.products[0].quantity = 999;
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        const contact = await zoho.contact.retrieve(event.entry.zohoCustomerId);
        if (contact == null) {
          throw new Error(`Contact not found: ${event.entry.zohoCustomerId}`);
        }

        expect(contact.addresses.length).toBe(n);

        const ordersInZohoAfterUpdate = await zoho.salesOrder.search(
          event.entry.addresses[0].orderId.split("-").slice(0, 2).join("-"),
        );

        expect(ordersInZohoAfterUpdate.length).toBe(
          event.entry.addresses.length,
        );

        // expect(ordersInZohoAfterUpdate[0].quantity).toBe(999);

        for (const order of ordersInZohoAfterUpdate) {
          expect(order.status).toEqual("draft");
        }
      }, 100_000);
    });
    describe("with an address deleted", () => {
      it("removes the deleted order", async () => {
        const event = await generateEvent("entry.create", "Draft");

        /**
         * Create first orders
         */
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        event.event = "entry.update";
        event.entry.addresses = [];
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        await verifySyncedOrders(zoho, event);
      }, 100_000);
    });
    describe("with an product price edited", () => {
      it("syncs correctly", async () => {
        const event = await generateEvent("entry.create", "Draft");

        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        event.event = "entry.update";
        event.entry.addresses[0].products = [
          {
            quantity: randomInt(1, 6),
            price: 2000,
            product: {
              /**
               * Currently hardcoded.
               * This can fail if the item does not exist in zoho.
               * https://inventory.zoho.eu/app#/inventory/items/116240000000378951
               */
              zohoId: "116240000000112128",
            },
          },
        ];
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        await verifySyncedOrders(zoho, event);
      }, 100_000);
    });
    describe("with shuffled addresses", () => {
      it("does not modify the zoho orders", async () => {
        const event = await generateEvent("entry.create", "Draft", 2);

        /**
         * Create first orders
         */
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        /**
         * Shuffle addresses around
         */
        event.event = "entry.update";
        event.entry.addresses.reverse();
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        const orderId = event.entry.addresses[0].orderId
          .split("-")
          .slice(0, 2)
          .join("-");

        const zohoOrders = await zoho.salesOrder.search(orderId);

        expect(zohoOrders.length).toBe(event.entry.addresses.length);
      }, 100_000);
    });

    describe("when one changes, one is removed, one is created, and one stays the same", () => {
      it("syncs correctly", async () => {
        const event = await generateEvent("entry.create", "Draft", 3);
        /**
         * Create first orders
         */
        await triggerWebhook(webhookId, webhookSecret, event);
        await waitForPropagation();

        /**
         * Shuffle addresses around
         */
        event.event = "entry.update";
        event.entry.addresses[1].street2 = "new Street 2 info";
        event.entry.addresses[2] = generateAddress(
          prefix,
          event.entry.id,
          2000,
        );

        await triggerWebhook(webhookId, webhookSecret, event);

        await waitForPropagation();

        const zohoOrders = await zoho.salesOrder
          .search([event.entry.prefix, event.entry.id].join("-"))
          .catch((err) => {
            console.error(err);
            throw err;
          });

        expect(zohoOrders.length).toBe(event.entry.addresses.length);
      }, 100_000);
    });
  });
});
