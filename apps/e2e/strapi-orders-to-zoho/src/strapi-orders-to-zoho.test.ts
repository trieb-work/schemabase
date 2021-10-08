import { expect, it, describe, beforeAll, afterAll } from "@jest/globals";
import { PrismaClient } from "@eci/data-access/prisma";
import faker from "faker";
import { randomInt, createHash } from "crypto";
import { HttpClient } from "@eci/http";
import { idGenerator } from "@eci/util/ids";
import { ZohoClientInstance } from "@trieb.work/zoho-ts";
import { env } from "@chronark/env";
faker.setLocale("de");

const prisma = new PrismaClient();

const zoho = new ZohoClientInstance({
  zohoClientId: env.require("ZOHO_CLIENT_ID"),
  zohoClientSecret: env.require("ZOHO_CLIENT_SECRET"),
  zohoOrgId: env.require("ZOHO_ORG_ID"),
});

const webhookId = idGenerator.id("test");
const webhookSecret = idGenerator.id("test");
let zohoCustomerId = "";

function generateEvent(event: string, status: string, addresses = 1) {
  return {
    event,
    created_at: new Date().toISOString(),
    model: "order",
    entry: {
      id: 1,
      customerName: faker.company.companyName(),
      zohoCustomerId,
      status,
      orderId: [event, status, randomInt(1_000_000).toString()].join("-"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      addresses: [...Array(addresses)].map((_, id) => ({
        id,
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
        address: `${faker.address.streetAddress()} ${randomInt(1, 200)}`,
        zip: randomInt(1, 100_000),
        city: faker.address.cityName(),
        country: faker.address.country(),
        fullName: "fullName",
      })),
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

  const companyName = idGenerator.id("test");
  const { contact_id } = await zoho.createContact({
    company_name: companyName,
    contact_name: companyName,
    contact_type: "customer",
  });
  if (!contact_id || contact_id === "") {
    throw new Error("Unable to setup testing contact");
  }
  zohoCustomerId = contact_id;
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
    },
  });

  const secretHash = createHash("sha256").update(webhookSecret).digest("hex");
  await prisma.incomingStrapiWebhook.create({
    data: {
      id: webhookId,
      strapiApp: {
        connect: {
          id: strapiApp.id,
        },
      },
      secret: {
        create: {
          id: idGenerator.id("test"),
          secret: secretHash,
        },
      },
    },
  });

  const integration = await prisma.strapiToZohoIntegration.create({
    data: {
      id: idGenerator.id("test"),
      tenantId: tenant.id,
      enabled: true,
      strapiAppId: strapiApp.id,
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
});

describe("without authorization header", () => {
  it("fails with status 400", async () => {
    const res = await new HttpClient().call({
      url: `http://localhost:3000/api/strapi/webhook/v1/${webhookId}`,
      method: "POST",
      body: generateEvent("entry.create", "Draft"),
    });
    expect(res.status).toBe(400);
  });
});

describe("with wrong webhook id", () => {
  it("fails with status 404", async () => {
    const res = await new HttpClient().call({
      url: `http://localhost:3000/api/strapi/webhook/v1/not-a-valid-id`,
      method: "POST",
      body: generateEvent("entry.create", "Draft"),
      headers: {
        authorization: "hello",
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
      body: generateEvent("entry.create", "Draft"),
      headers: {
        authorization: "hello",
      },
    });
    expect(res.status).toBe(403);
  });
});

describe("with valid webhook content", () => {
  for (const status of ["Draft", "Sending"]) {
    describe("entry.create", () => {
      describe(`with status: ${status}`, () => {
        const event = generateEvent("entry.create", status);

        it(`syncs all orders correctly`, async () => {
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
            `BULK-${event.entry.orderId}`,
          );

          // console.warn({ordersInZoho, id: `BULK-${event.entry.orderId}`})
          expect(ordersInZoho.length).toBe(event.entry.addresses.length);
          for (const order of ordersInZoho) {
            if (status === "Sending") {
              expect(order.status).toEqual("confirmed");
            } else {
              expect(order.status).toEqual("draft");
            }
          }
        }, 60_000);
      });
    });
    describe("entry.update", () => {
      describe("when an address has been removed", () => {
        it("removes it from zoho", async () => {
          const event = generateEvent("entry.create", status, 5);
          const createRes = await new HttpClient().call<{
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
          expect(createRes.status).toBe(200);
          expect(createRes.data?.status).toEqual("received");
          expect(createRes.data?.traceId).toBeDefined();

          await new Promise((resolve) => setTimeout(resolve, 10_000));

          const ordersInZoho = await zoho.searchSalesOrdersWithScrolling(
            `BULK-${event.entry.orderId}`,
          );

          // console.warn({ordersInZoho, id: `BULK-${event.entry.orderId}`})
          expect(ordersInZoho.length).toBe(event.entry.addresses.length);

          event.entry.addresses = event.entry.addresses.slice(0, 2);

          const updateRes = await new HttpClient().call<{
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
          expect(updateRes.status).toBe(200);
          expect(updateRes.data?.status).toEqual("received");
          expect(updateRes.data?.traceId).toBeDefined();

          const ordersInZohoAfterUpdate =
            await zoho.searchSalesOrdersWithScrolling(
              `BULK-${event.entry.orderId}`,
            );

          // console.warn({ordersInZohoAfterUpdate, id: `BULK-${event.entry.orderId}`})
          expect(ordersInZohoAfterUpdate.length).toBe(
            event.entry.addresses.length,
          );
        }, 60_000);
      });
    });
  }
});
