import { expect, it, describe, beforeAll, afterAll } from "@jest/globals";
import { PrismaClient } from "@eci/data-access/prisma";
import faker from "faker";
import { createHash } from "crypto";
import { HttpClient } from "@eci/http";
import { idGenerator } from "@eci/util/ids";
import { ZohoClientInstance } from "@trieb.work/zoho-ts";
import { env } from "@chronark/env";
import { randomInt } from "crypto";
import { generateAddress, sendWebhook } from "./util";
import { PrefixedOrderId } from "@eci/integrations/strapi-orders-to-zoho";
const prisma = new PrismaClient();

const zoho = new ZohoClientInstance({
  zohoClientId: env.require("ZOHO_CLIENT_ID"),
  zohoClientSecret: env.require("ZOHO_CLIENT_SECRET"),
  zohoOrgId: env.require("ZOHO_ORG_ID"),
});

const createdContactIds: string[] = [];

const webhookId = idGenerator.id("test");
const webhookSecret = idGenerator.id("test");

async function generateEvent(event: string, status: string, addresses = 1) {
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
  const orderId = randomInt(1_000_000);
  return {
    event,
    created_at: new Date().toISOString(),
    model: "bulkOrder",
    entry: {
      id: 1,
      customerName: faker.company.companyName(),
      zohoCustomerId: contact_id,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      addresses: [...Array(addresses)].map((_, rowId) =>
        generateAddress(orderId, rowId),
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
            zohoId: "116240000000378951",
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
      payedUntil: new Date(Date.now() + 1000 * 60 * 5),
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

  // /** Clean up created entries */
  // const ordersInZoho = await zoho.searchSalesOrdersWithScrolling("BULK-");
  // for (const order of ordersInZoho) {
  //   await zoho.deleteSalesorder(order.salesorder_id);
  // }
  // for (const contactId of createdContactIds) {
  //   await zoho.deleteContact(contactId);
  // }
});

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
  for (const status of ["Draft", "Sending"]) {
    describe(`status: ${status}`, () => {
      describe("entry.create", () => {
        it(`syncs all orders correctly`, async () => {
          const event = await generateEvent("entry.create", status);

          const res = await new HttpClient().call<{
            status: string;
            traceId: string;
          }>({
            url: `http://localhost:3000/api/strapi/webhook/v1/${webhookId}`,
            method: "POST",
            body: event,
            headers: {
              authorization: webhookSecret,
            },
          });
          expect(res.status).toBe(200);
          expect(res.data?.status).toEqual("received");
          expect(res.data?.traceId).toBeDefined();

          /**
           * Wait for requests to happen in the background
           */
          await new Promise((resolve) => setTimeout(resolve, 15_000));

          const ordersInZoho = await zoho.searchSalesOrdersWithScrolling(
            new PrefixedOrderId(event.entry.addresses[0].orderId)
              .searchFragment,
          );

          expect(ordersInZoho.length).toBe(event.entry.addresses.length);
          for (const order of ordersInZoho) {
            if (status === "Sending") {
              expect(order.status).toEqual("confirmed");
            } else {
              expect(order.status).toEqual("draft");
            }
          }
        });
      });

      describe("entry.update", () => {
        describe("with a new address", () => {
          it("adds a new zoho order", async () => {
            const event = await generateEvent("entry.create", status);

            /**
             * Create first order
             */
            const res = await sendWebhook(webhookId, webhookSecret, event);
            expect(res.status).toBe(200);

            /**
             * Create second order
             */
            event.event = "entry.update";
            event.entry.addresses.push(
              generateAddress(
                Number(event.entry.addresses[0].orderId.split("-")[1]),
                event.entry.addresses.length + 1,
              ),
            );
            console.warn(JSON.stringify(event, null, 2));
            const updateResponse = await sendWebhook(
              webhookId,
              webhookSecret,
              event,
            );
            expect(updateResponse.status).toBe(200);
            expect(updateResponse.data?.status).toEqual("received");
            expect(updateResponse.data?.traceId).toBeDefined();

            /**
             * Wait for requests to happen in the background
             */
            await new Promise((resolve) => setTimeout(resolve, 15_000));

            const ordersInZohoAfterUpdate =
              await zoho.searchSalesOrdersWithScrolling(
                new PrefixedOrderId(event.entry.addresses[0].orderId)
                  .searchFragment,
              );

            expect(ordersInZohoAfterUpdate.length).toBe(
              event.entry.addresses.length,
            );
            for (const order of ordersInZohoAfterUpdate) {
              if (status === "Sending") {
                expect(order.status).toEqual("confirmed");
              } else {
                expect(order.status).toEqual("draft");
              }
            }
          }, 60_000);
        });
        describe("with a modified address", () => {
          it("does replaces the modified order", async () => {
            const event = await generateEvent("entry.create", status);

            /**
             * Create first orders
             */
            const res = await sendWebhook(webhookId, webhookSecret, event);
            expect(res.status).toBe(200);
            /**
             * Shuffle addresses aroujd
             */
            event.event = "entry.update";
            event.entry.addresses[0].address = "ChangedStreet 5";
            const updateResponse = await sendWebhook(
              webhookId,
              webhookSecret,
              event,
            );
            expect(updateResponse.status).toBe(200);
            expect(updateResponse.data?.status).toEqual("received");
            expect(updateResponse.data?.traceId).toBeDefined();

            /**
             * Wait for requests to happen in the background
             */
            await new Promise((resolve) => setTimeout(resolve, 15_000));

            const ordersInZohoAfterUpdate =
              await zoho.searchSalesOrdersWithScrolling(
                new PrefixedOrderId(event.entry.addresses[0].orderId)
                  .searchFragment,
              );

            expect(ordersInZohoAfterUpdate.length).toBe(
              event.entry.addresses.length,
            );
            for (const order of ordersInZohoAfterUpdate) {
              if (status === "Sending") {
                expect(order.status).toEqual("confirmed");
              } else {
                expect(order.status).toEqual("draft");
              }
            }
          }, 60_000);
        });
        describe("with a modified product", () => {
          it("does replaces the modified order", async () => {
            const event = await generateEvent("entry.create", status);

            /**
             * Create first orders
             */
            const res = await sendWebhook(webhookId, webhookSecret, event);
            expect(res.status).toBe(200);
            await new Promise((resolve) => setTimeout(resolve, 15_000));
            /**
             * Shuffle addresses aroujd
             */
            event.event = "entry.update";
            event.entry.products[0].quantity = 999;
            const updateResponse = await sendWebhook(
              webhookId,
              webhookSecret,
              event,
            );
            expect(updateResponse.status).toBe(200);
            expect(updateResponse.data?.status).toEqual("received");
            expect(updateResponse.data?.traceId).toBeDefined();

            /**
             * Wait for requests to happen in the background
             */
            await new Promise((resolve) => setTimeout(resolve, 15_000));

            const ordersInZohoAfterUpdate =
              await zoho.searchSalesOrdersWithScrolling(
                new PrefixedOrderId(event.entry.addresses[0].orderId)
                  .searchFragment,
              );

            expect(ordersInZohoAfterUpdate.length).toBe(
              event.entry.addresses.length,
            );

            expect(ordersInZohoAfterUpdate[0].quantity).toBe(999);

            for (const order of ordersInZohoAfterUpdate) {
              if (status === "Sending") {
                expect(order.status).toEqual("confirmed");
              } else {
                expect(order.status).toEqual("draft");
              }
            }
          }, 60_000);
        });
        // describe("with a removed address", () => {});

        describe("with shuffled addresses", () => {
          it("does not modify the zoho orders", async () => {
            const event = await generateEvent("entry.create", status);

            /**
             * Create first orders
             */
            const res = await sendWebhook(webhookId, webhookSecret, event);
            expect(res.status).toBe(200);
            await new Promise((resolve) => setTimeout(resolve, 15_000));

            const ordersInZohoBeforeUpdate =
              await zoho.searchSalesOrdersWithScrolling(
                new PrefixedOrderId(event.entry.addresses[0].orderId)
                  .searchFragment,
              );
            /**
             * Shuffle addresses aroujd
             */
            event.event = "entry.update";
            event.entry.addresses.sort(() => Math.random() - 1);
            const updateResponse = await sendWebhook(
              webhookId,
              webhookSecret,
              event,
            );
            expect(updateResponse.status).toBe(200);
            expect(updateResponse.data?.status).toEqual("received");
            expect(updateResponse.data?.traceId).toBeDefined();

            /**
             * Wait for requests to happen in the background
             */
            await new Promise((resolve) => setTimeout(resolve, 15_000));

            const ordersInZohoAfterUpdate =
              await zoho.searchSalesOrdersWithScrolling(
                new PrefixedOrderId(event.entry.addresses[0].orderId)
                  .searchFragment,
              );

            expect(ordersInZohoAfterUpdate.length).toBe(
              event.entry.addresses.length,
            );

            expect(ordersInZohoBeforeUpdate).toEqual(ordersInZohoAfterUpdate);
            for (const order of ordersInZohoAfterUpdate) {
              if (status === "Sending") {
                expect(order.status).toEqual("confirmed");
              } else {
                expect(order.status).toEqual("draft");
              }
            }
          }, 60_000);
        });
      });
    });
  }
});
