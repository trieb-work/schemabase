import { Carrier, Language, PackageState, PrismaClient } from "@eci/pkg/prisma";
import { HttpClient } from "@eci/pkg/http";
import { id } from "@eci/pkg/ids";
import faker from "faker";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { randomUUID } from "crypto";
const prisma = new PrismaClient();

const webhookId = id.id("publicKey");

beforeAll(async () => {
  const tenant = await prisma.tenant.create({
    data: {
      id: id.id("test"),
      name: faker.company.companyName(),
    },
  });

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
      sender: "servus@pfefferundfrost.de",
      replyTo: "servus@pfefferundfrost.de",
    },
  });
  for (const state of Object.values(PackageState)) {
    await prisma.sendgridTemplate.create({
      data: {
        id: id.id("test"),
        name: id.id("test"),
        templateId: "d-22ba8412d0c149108bdd8f1b4fd3b8b0",
        language: Language.EN,
        packageState: state,
        subject: "Hello from jest",
        trackingEmailApp: {
          connect: {
            id: trackingApp.id,
          },
        },
      },
    });
  }
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
        const email = "andreas@trieb.work";
        await prisma.order.create({
          data: {
            id: id.id("order"),
            externalOrderId: randomUUID(),
            email,
            language: Language.DE,
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
          include: { events: { include: { sentEmail: true } } },
        });

        expect(storedPackage).toBeDefined();
        expect(storedPackage!.events.length).toBe(1);
        expect(storedPackage!.events[0].state).toEqual(
          PackageState.FAILED_ATTEMPT,
        );
        expect(storedPackage!.events[0].sentEmail?.email).toEqual(email);
      });
    });
  });
});
