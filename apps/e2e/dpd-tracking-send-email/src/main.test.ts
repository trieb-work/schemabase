import { PrismaClient } from "@eci/data-access/prisma";
import { HttpClient } from "@eci/http";
import { idGenerator } from "@eci/util/ids";
import faker from "faker";

const prisma = new PrismaClient();

const webhookId = idGenerator.id("publicKey");

// async function triggerWebhook(opts: {
//   pushid: string;
//   pnr: string;
//   status: string;
//   statusdate: string;
// }): Promise<void> {
//   const params = Object.entries(opts)
//     .map((kv) => kv.join("="))
//     .join("&");

//   const res = await new HttpClient().call({
//     url: `http://localhost:3000/api/tracking/dpd/v2/${webhookId}?${params}`,
//     method: "POST",
//   });
//   expect(res.status).toBe(200);
//   expect(res.data).toBe("");
// }

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
  const dpdApp = await prisma.dpdApp.create({
    data: {
      id: idGenerator.id("test"),
      name: idGenerator.id("test"),
      tenantId: tenant.id,
      webhooks: {
        create: [
          {
            id: webhookId,
          },
        ],
      },
    },
  });
  const trackingApp = await prisma.trackingEmailApp.create({
    data: {
      id: idGenerator.id("test"),
      tenantId: tenant.id,
      sender: faker.internet.email(),
      replyTo: "noreply@test.com",
    },
  });
  const integration = await prisma.trackingIntegration.create({
    data: {
      id: idGenerator.id("test"),
      tenant: {
        connect: {
          id: tenant.id,
        },
      },
      enabled: true,
      dpdApp: {
        connect: {
          id: dpdApp.id,
        },
      },
      trackingEmailApp: {
        connect: {
          id: trackingApp.id,
        },
      },
    },
  });
  await prisma.subscription.create({
    data: {
      id: idGenerator.id("test"),
      tenantId: tenant.id,
      payedUntil: new Date(Date.now() + 1000 * 60 * 60),
      trackingIntegration: {
        connect: {
          id: integration.id,
        },
      },
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
}, 100_000);

describe("with invalid webhook", () => {
  describe("without pushid", () => {
    it("does nothing", async () => {
      const res = await new HttpClient().call({
        url: `http://localhost:3000/api/tracking/dpd/v2/${webhookId}?pnr=1&pushid=456&status=start_order&statusdate=1&depot=1`,
        method: "POST",
      });
      expect(res.status).toBe(200);
      expect(res.data).toBe("<push><pushid>456</pushid><status>OK</status></push>");
    });
  });

  describe("with wrong webhook id", () => {
    it("fails with status 404", async () => {
      const res = await new HttpClient().call({
        url: "http://localhost:3000/api/tracking/dpd/v2/not-a-valid-id?pnr=1&pushid=123&status=start_order&statusdate=1&depot=1",
        method: "POST",
      });
      expect(res.status).toBe(404);
    });
  });

  describe("with valid webhook",()=>{
    it("returns the required xml",async()=>{
      const res = await new HttpClient().call({
        url: `http://localhost:3000/api/tracking/dpd/v2/${webhookId}?pnr=1&pushid=123&status=start_order&statusdate=1&depot=1`,
        method: "POST",
      });
      expect(res.status).toBe(200)
      expect(res.data).toEqual("<push><pushid>123</pushid><status>OK</status></push>")
    })


  })
});
