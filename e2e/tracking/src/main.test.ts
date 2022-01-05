import { PrismaClient, Carrier, PackageState } from "@eci/pkg/prisma";
import { HttpClient } from "@eci/pkg/http";
import { id } from "@eci/pkg/ids";
import faker from "faker";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { randomUUID } from "crypto";
const prisma = new PrismaClient();

const webhookId = id.id("publicKey");

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
      id: id.id("test"),
      name: faker.company.companyName(),
    },
  });

  /**
   * Upserting because there is a unique constraint on the domain
   */
  const dpdApp = await prisma.dpdApp.create({
    data: {
      id: id.id("test"),
      name: id.id("test"),
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
      id: id.id("test"),
      tenantId: tenant.id,
      sender: faker.internet.email(),
      replyTo: "noreply@test.com",
    },
  });
  const integration = await prisma.trackingIntegration.create({
    data: {
      id: id.id("test"),
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
      id: id.id("test"),
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
        url: `http://localhost:3000/api/tracking/dpd/v2/${webhookId}?pnr=1&pushid=456&status=start_order&statusdate=05012022100200&depot=1`,
        method: "POST",
      });
      expect(res.status).toBe(200);
      expect(res.data).toBe(
        "<push><pushid>456</pushid><status>OK</status></push>",
      );
    });
  });

  describe("with wrong webhook id", () => {
    it("fails with status 404", async () => {
      const res = await new HttpClient().call({
        url: "http://localhost:3000/api/tracking/dpd/v2/not-a-valid-id?pnr=1&pushid=123&status=start_order&statusdate=05012022100200&depot=1",
        method: "POST",
      });
      expect(res.status).toBe(404);
    });
  });

  describe("with valid webhook", () => {
    it("returns the required xml", async () => {
      const res = await new HttpClient().call({
        url: `http://localhost:3000/api/tracking/dpd/v2/${webhookId}?statusdate=05012022100200&receiver=&ref=&pnr=01906000683796&status=start_order&pod=0&weight=0&pushid=92056930&depot=0998&scaninfo=&services=`,
        method: "POST",
      });
      expect(res.status).toBe(200);
      expect(res.data).toEqual(
        "<push><pushid>92056930</pushid><status>OK</status></push>",
      );
    });
  });
  describe("e2e", () => {
    describe("default", () => {
      it("creates a new packageEvent in prisma", async () => {
        const packageId = id.id("package");
        const trackingId = randomUUID();
        await prisma.order.create({
          data: {
            id: id.id("order"),
            orderId: randomUUID(),
            email: "test@test.com",
            packages: {
              create: {
                id: packageId,
                trackingId,
                carrier: Carrier.DPD,
                state: PackageState.INIT,
                carrierTrackingUrl: "I don't know",
              },
            },
          },
        });

        await new HttpClient().call({
          url: `http://localhost:3000/api/tracking/dpd/v2/${webhookId}?statusdate=05012022100200&&pnr=${trackingId}&status=delivery_nab&pushid=1&depot=1`,
          method: "POST",
        });

        await new Promise((res) => setTimeout(res, 10_000));

        const storedPackage = await prisma.package.findUnique({
          where: {
            id: packageId,
          },
          include: { events: true },
        });

        expect(storedPackage).toBeDefined();
        expect(storedPackage!.events.length).toBe(1);
        expect(storedPackage!.events[0].state).toEqual(
          PackageState.FAILED_ATTEMPT,
        );
      });
    });
  });
});
