import { PrismaClient } from "@eci/data-access/prisma";
import faker from "faker";
import { randomInt, randomUUID, createHash } from "crypto";
import { HttpClient } from "@eci/http";
import { idGenerator } from "@eci/util/ids";

faker.setLocale("de");

const prisma = new PrismaClient();

const webhookId = idGenerator.id("test");
const webhookSecret = idGenerator.id("test");

const eventUpdateDraft = {
  event: "entry.update",
  created_at: new Date().toISOString(),
  model: "order",
  entry: {
    id: 1,
    customerName: faker.company.companyName(),
    zohoCustomerId: "116240000000733001",
    status: "Draft",
    orderId: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    addresses: Array.from(Array(10)).map((_, id) => ({
      id,
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      address: `${faker.address.streetAddress()} ${randomInt(1, 200)}`,
      zip: randomInt(1, 100_000),
      city: faker.address.cityName(),
      country: faker.address.country(),
      fullName: "fullName",
    })),
    products: Array.from(Array(randomInt(1, 4))).map((_) => ({
      quantity: randomInt(1, 6),
      product: {
        zohoId: randomUUID(),
      },
    })),
    addressCSV: null,
  },
};

beforeAll(async () => {
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

describe("without origin header", () => {
  it("fails with status 400", async () => {
    const res = await new HttpClient().call({
      method: "POST",
      url: `http://localhost:3000/api/strapi/webhook/v1/${webhookId}`,
      headers: {
        authorization: "not empty",
      },
      body: eventUpdateDraft,
    });
    expect(res.status).toBe(400);
  });
});

describe("without authorization header", () => {
  it("fails with status 400", async () => {
    const res = await new HttpClient().call({
      url: `http://localhost:3000/api/strapi/webhook/v1/${webhookId}`,
      method: "POST",
      body: eventUpdateDraft,
      headers: {
        origin: "http://strapi:1337",
      },
    });
    expect(res.status).toBe(400);
  });
});

describe("with wrong webhook id", () => {
  it("fails with status 404", async () => {
    const res = await new HttpClient().call({
      url: `http://localhost:3000/api/strapi/webhook/v1/not-a-valid-id`,
      method: "POST",
      body: eventUpdateDraft,
      headers: {
        origin: "http://strapi:1337",
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
      body: eventUpdateDraft,
      headers: {
        origin: "http://strapi:1337",
        authorization: "hello",
      },
    });
    expect(res.status).toBe(403);
  });
});

describe("with valid webhook content", () => {
  it("returns 200 ok", async () => {
    const res = await new HttpClient().call<{
      status: string;
      traceId: string;
    }>({
      url: `http://localhost:3000/api/strapi/webhook/v1/${webhookId}`,
      method: "POST",
      body: eventUpdateDraft,
      headers: {
        origin: "http://strapi:1337",
        authorization: webhookSecret,
      },
    });
    expect(res.status).toBe(200);
    expect(res.data?.status).toEqual("received");
    expect(res.data?.traceId).toBeDefined();
  });
});
