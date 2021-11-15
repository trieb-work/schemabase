import { PrismaClient } from "@eci/data-access/prisma";
import faker from "faker";
import { createHash } from "crypto";
import { HttpClient } from "@eci/http";
import { idGenerator } from "@eci/util/ids";
import { ZohoClientInstance } from "@trieb.work/zoho-ts";
import { env } from "@chronark/env";
import { randomInt } from "crypto";
import { generateAddress, triggerWebhook } from "./util";
import { OrderEvent } from "@eci/integrations/strapi-orders-to-zoho";
import { verifySyncedOrders } from "./verifySyncedOrders";

const prisma = new PrismaClient();

const zoho = new ZohoClientInstance({
  zohoClientId: env.require("ZOHO_CLIENT_ID"),
  zohoClientSecret: env.require("ZOHO_CLIENT_SECRET"),
  zohoOrgId: env.require("ZOHO_ORG_ID"),
});

const createdContactIds: string[] = [];

const webhookId = idGenerator.id("test");
const webhookSecret = idGenerator.id("test");
const prefix = "TEST";

async function generateEvent(
  event: "entry.create" | "entry.update" | "entry.delete",
  status: "Draft" | "Confirmed",
  addresses = 1,
): Promise<OrderEvent> {
  const companyName = idGenerator.id("test");

  const { contact_id } = await zoho.createContact({
    company_name: companyName,
    contact_name: companyName,
    contact_type: "customer",
  });
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
  await zoho.authenticate();

  const tenant = await prisma.tenant.create({
    data: {
      id: idGenerator.id("test"),
      name: faker.company.companyName(),
    },
  });

  /**
   * Upserting because there is a unique constraint on the domain
   */
  const strapiApp = await prisma.strapiApp.create({
    data: {
      id: idGenerator.id("test"),
      name: idGenerator.id("test"),
      tenantId: tenant.id,
      webhooks: {
        create: [
          {
            id: webhookId,
            secret: {
              create: {
                id: idGenerator.id("test"),
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
      id: idGenerator.id("test"),
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
          id: idGenerator.id("test"),
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
      id: idGenerator.id("test"),
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

afterAll(async () => {
  await prisma.$disconnect();

  /** Clean up created entries */
  const ordersInZoho = await zoho.searchSalesOrdersWithScrolling({
    searchString: `${prefix}-`,
  });
  for (const order of ordersInZoho) {
    await zoho.deleteSalesorder(order.salesorder_id);
  }
  for (const contactId of createdContactIds) {
    await zoho.deleteContact(contactId);
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
        url: `http://localhost:3000/api/strapi/webhook/v1/not-a-valid-id`,
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

          /**
           * Wait for requests to happen in the background
           */
          await new Promise((resolve) => setTimeout(resolve, 30_000));

          const salesOrders = await verifySyncedOrders(zoho, event);

          const createdOrder = await zoho.getSalesorder(
            salesOrders[0].salesorder_number,
          );

          expect(createdOrder?.shipping_charge_tax_percentage).toBe(19);
        }, 100_000);
      });
    });
    describe("with only required fields", () => {
      it(`syncs all orders correctly`, async () => {
        const event = await generateEvent("entry.create", "Draft");

        await triggerWebhook(webhookId, webhookSecret, event);

        /**
         * Wait for requests to happen in the background
         */
        await new Promise((resolve) => setTimeout(resolve, 30_000));

        await verifySyncedOrders(zoho, event);
      }, 100_000);
    });

    describe("with street2", () => {
      it(`syncs all orders correctly`, async () => {
        const event = await generateEvent("entry.create", "Draft");
        event.entry.addresses = event.entry.addresses.map((a) => ({
          ...a,
          street2: "Imagine a street name here",
        }));

        await triggerWebhook(webhookId, webhookSecret, event);

        /**
         * Wait for requests to happen in the background
         */
        await new Promise((resolve) => setTimeout(resolve, 30_000));

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

        /**
         * Wait for requests to happen in the background
         */
        await new Promise((resolve) => setTimeout(resolve, 30_000));

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

          /**
           * If we do not wait the search on zoho will not return the created
           * order yet.
           */
          await new Promise((resolve) => setTimeout(resolve, 5_000));

          event.event = "entry.update";
          event.entry.addresses[0].street2 = "Additional street info";
          await triggerWebhook(webhookId, webhookSecret, event);

          /**
           * Wait for requests to happen in the background
           */
          await new Promise((resolve) => setTimeout(resolve, 30_000));

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

        /**
         * Wait for requests to happen in the background
         */
        await new Promise((resolve) => setTimeout(resolve, 30_000));

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
        await new Promise((resolve) => setTimeout(resolve, 30_000));
        /**
         * Shuffle addresses aroujd
         */
        event.event = "entry.update";
        event.entry.products[0].quantity = 999;
        await triggerWebhook(webhookId, webhookSecret, event);

        /**
         * Wait for requests to happen in the background
         */
        await new Promise((resolve) => setTimeout(resolve, 30_000));

        const ordersInZohoAfterUpdate =
          await zoho.searchSalesOrdersWithScrolling({
            searchString: event.entry.addresses[0].orderId
              .split("-")
              .slice(0, 2)
              .join("-"),
          });

        expect(ordersInZohoAfterUpdate.length).toBe(
          event.entry.addresses.length,
        );

        expect(ordersInZohoAfterUpdate[0].quantity).toBe(999);

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
        await new Promise((resolve) => setTimeout(resolve, 30_000));

        event.event = "entry.update";
        event.entry.addresses = [];
        await triggerWebhook(webhookId, webhookSecret, event);

        /**
         * Wait for requests to happen in the background
         */
        await new Promise((resolve) => setTimeout(resolve, 30_000));

        await verifySyncedOrders(zoho, event);
      }, 100_000);
    });
    describe("with shuffled addresses", () => {
      it.skip("does not modify the zoho orders", async () => {
        const event = await generateEvent("entry.create", "Draft", 2);

        /**
         * Create first orders
         */
        await triggerWebhook(webhookId, webhookSecret, event);
        await new Promise((resolve) => setTimeout(resolve, 30_000));

        /**
         * Shuffle addresses around
         */
        event.event = "entry.update";
        event.entry.addresses.reverse();
        await triggerWebhook(webhookId, webhookSecret, event);

        /**
         * Wait for requests to happen in the background
         */
        await new Promise((resolve) => setTimeout(resolve, 30_000));

        const orderId = event.entry.addresses[0].orderId
          .split("-")
          .slice(0, 2)
          .join("-");

        const zohoOrders = await zoho.searchSalesOrdersWithScrolling({
          searchString: orderId,
        });

        expect(zohoOrders.length).toBe(event.entry.addresses.length);
      }, 100_000);
    });

    describe("when one order changes, one is removed, one is created, and one stays the same", () => {
      it("syncs correctly", async () => {
        const event = await generateEvent("entry.create", "Draft", 3);
        /**
         * Create first orders
         */
        await triggerWebhook(webhookId, webhookSecret, event);
        await new Promise((resolve) => setTimeout(resolve, 30_000));

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

        /**
         * Wait for requests to happen in the background
         */
        await new Promise((resolve) => setTimeout(resolve, 30_000));

        const zohoOrders = await zoho.searchSalesOrdersWithScrolling({
          searchString: [event.entry.prefix, event.entry.id].join("-"),
        });

        expect(zohoOrders.length).toBe(event.entry.addresses.length);
      }, 100_000);
    });
  });
});
