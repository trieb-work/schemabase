import { Carrier, Language, PackageState, PrismaClient } from "@eci/pkg/prisma";
import { HttpClient } from "@eci/pkg/http";
import { id } from "@eci/pkg/ids";
import faker from "faker";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { randomUUID } from "crypto";
import { sha256 } from "@eci/pkg/hash";
const prisma = new PrismaClient();
import { env } from "@eci/pkg/env";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts/dist/v2";
const dpdWebhookId = id.id("webhook");
const zohoWebhookId = id.id("webhook");
const zohoWebhookSecret = id.id("webhookSecret");
let customerId: string;
let zoho: Zoho;
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

  const customer = await zoho.contact.create({
    contact_name: id.id("test"),
    language_code: "en",
  });
  customerId = customer.contact_id;

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
            id: dpdWebhookId,
          },
        ],
      },
    },
  });
  const trackingApp = await prisma.trackingEmailApp.create({
    data: {
      id: id.id("test"),
      tenantId: tenant.id,
      defaultLanguage: Language.EN,
      sender: "noreply@triebwork.com",
      replyTo: "noreply@triebwork.com",
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

  const zohoApp = await prisma.zohoApp.create({
    data: {
      id: id.id("test"),
      orgId: env.require("ZOHO_ORG_ID"),
      clientId: env.require("ZOHO_CLIENT_ID"),
      clientSecret: env.require("ZOHO_CLIENT_SECRET"),
      tenant: { connect: { id: tenant.id } },
      webhooks: {
        create: {
          id: zohoWebhookId,
          secret: {
            create: {
              id: id.id("test"),
              secret: sha256(zohoWebhookSecret),
            },
          },
        },
      },
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
      zohoApp: {
        connect: {
          id: zohoApp.id,
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
  await zoho.contact.delete(customerId);
}, 100_000);

describe("with invalid webhook", () => {
  describe("without pushid", () => {
    it("does nothing", async () => {
      const res = await new HttpClient().call({
        url: `http://localhost:3000/api/v1/tracking/dpd/${dpdWebhookId}?pnr=1&pushid=456&status=start_order&statusdate=05012022100200&depot=1`,
        method: "GET",
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
        url: "http://localhost:3000/api/v1/tracking/dpd/not-a-valid-id?pnr=1&pushid=123&status=start_order&statusdate=05012022100200&depot=1",
        method: "GET",
      });
      expect(res.status).toBe(404);
    });
  });

  describe("with valid webhook", () => {
    it("returns the required xml", async () => {
      const res = await new HttpClient().call({
        url: `http://localhost:3000/api/v1/tracking/dpd/${dpdWebhookId}?statusdate=05012022100200&receiver=&ref=&pnr=01906000683796&status=start_order&pod=0&weight=0&pushid=92056930&depot=0998&scaninfo=&services=`,
        method: "GET",
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
        const email = "test@trieb.work";
        await prisma.order.create({
          data: {
            id: id.id("order"),
            externalOrderId: randomUUID(),
            emails: [email],
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
          url: `http://localhost:3000/api/v1/tracking/dpd/${dpdWebhookId}?statusdate=05012022100200&&pnr=${trackingId}&status=delivery_nab&pushid=1&depot=1`,
          method: "GET",
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
        expect(storedPackage!.events[0].sentEmail).not.toBeNull();
        expect(storedPackage!.events[0].sentEmail!.email).toEqual(email);
      });
    });
  });
  describe("from zoho webhook", () => {
    it("creates a new order in the db", async () => {
      const trackingId = randomUUID();
      const payload = {
        salesorder: {
          salesorder_number: randomUUID(),
          customer_id: customerId,
          contact_person_details: [
            {
              email: "test@trieb.work",
            },
          ],
          packages: [
            {
              shipment_order: {
                tracking_number: trackingId,
                carrier: "DPD",
              },
            },
          ],
        },
      };

      const res = await new HttpClient().call({
        url: `http://localhost:3000/api/zoho/order/create/v1/${zohoWebhookId}`,
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `JSONString: ${encodeURIComponent(JSON.stringify(payload))}`,
      });
      expect(res.status).toBe(200);
      const storedPackage = await prisma.package.findUnique({
        where: {
          trackingId,
        },
        include: { order: true, events: true },
      });
      expect(storedPackage).toBeDefined();
      expect(storedPackage!.order).toBeDefined();
      expect(storedPackage!.order.externalOrderId).toEqual(
        payload.salesorder.salesorder_number,
      );
      expect(storedPackage!.order.emails).toEqual(
        payload.salesorder.contact_person_details.map((c) => c.email),
      );
      expect(storedPackage!.order.language).toBe(Language.EN);
      expect(storedPackage!.events.length).toBe(0);
      expect(storedPackage!.state).toEqual(PackageState.INIT);
    });
  });

  describe("Multiple events in the correct order", () => {
    it("Sends all required emails ", async () => {
      const packageId = id.id("package");
      const trackingId = randomUUID();
      const email = "test@trieb.work";
      await prisma.order.create({
        data: {
          id: id.id("order"),
          externalOrderId: randomUUID(),
          emails: [email],
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
        url: `http://localhost:3000/api/v1/tracking/dpd/${dpdWebhookId}?statusdate=05012022100200&&pnr=${trackingId}&status=pickup_depot&pushid=1&depot=1`,
        method: "GET",
      });

      await new Promise((res) => setTimeout(res, 2000));

      await new HttpClient().call({
        url: `http://localhost:3000/api/v1/tracking/dpd/${dpdWebhookId}?statusdate=05012022100200&&pnr=${trackingId}&status=delivery_nab&pushid=1&depot=1`,
        method: "GET",
      });

      await new Promise((res) => setTimeout(res, 2000));

      await new HttpClient().call({
        url: `http://localhost:3000/api/v1/tracking/dpd/${dpdWebhookId}?statusdate=05012022100200&&pnr=${trackingId}&status=delivery_customer&pushid=1&depot=1`,
        method: "GET",
      });

      await new Promise((res) => setTimeout(res, 2000));

      const storedPackage = await prisma.package.findUnique({
        where: {
          id: packageId,
        },
        include: { events: { include: { sentEmail: true } } },
      });

      expect(storedPackage).toBeDefined();
      expect(storedPackage!.events.length).toBe(3);
      expect(storedPackage!.state).toEqual(PackageState.DELIVERED);

      for (const event of storedPackage!.events) {
        expect(event.sentEmail).not.toBeNull();
        expect(event.sentEmail!.email).toEqual(email);
      }
    }, 60000);
  });
  describe("Multiple events in wrong order", () => {
    it("Sends all required emails ", async () => {
      const packageId = id.id("package");
      const trackingId = randomUUID();
      const email = "test@trieb.work";
      await prisma.order.create({
        data: {
          id: id.id("order"),
          externalOrderId: randomUUID(),
          emails: [email],
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
        url: `http://localhost:3000/api/v1/tracking/dpd/${dpdWebhookId}?statusdate=05012022100200&&pnr=${trackingId}&status=pickup_depot&pushid=1&depot=1`,
        method: "GET",
      });

      await new Promise((res) => setTimeout(res, 2000));

      await new HttpClient().call({
        url: `http://localhost:3000/api/v1/tracking/dpd/${dpdWebhookId}?statusdate=05012022100200&&pnr=${trackingId}&status=delivery_customer&pushid=1&depot=1`,
        method: "GET",
      });
      await new Promise((res) => setTimeout(res, 2000));
      await new HttpClient().call({
        url: `http://localhost:3000/api/v1/tracking/dpd/${dpdWebhookId}?statusdate=05012022100200&&pnr=${trackingId}&status=delivery_nab&pushid=1&depot=1`,
        method: "GET",
      });

      await new Promise((res) => setTimeout(res, 2000));

      const storedPackage = await prisma.package.findUnique({
        where: {
          id: packageId,
        },
        include: { events: { include: { sentEmail: true } } },
      });

      expect(storedPackage).toBeDefined();
      expect(storedPackage!.events.length).toBe(3);
      const events = storedPackage!.events.sort(
        (a, b) => a.time.getTime() - b.time.getTime(),
      );
      expect(events[0].sentEmail).toBeDefined();
      expect(events[1].sentEmail).toBeDefined();
      expect(events[2].sentEmail).toBeNull();
      expect(storedPackage!.state).toEqual(PackageState.DELIVERED);
    });
  });
});
