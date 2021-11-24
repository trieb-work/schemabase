import { expect } from "@jest/globals";
import { HttpClient } from "@eci/http";
import faker from "faker";
import { createHash, randomInt } from "crypto";
import { z } from "zod";
import { addressValidation } from "@eci/integrations/strapi-orders-to-zoho";

faker.setLocale("de");

export function generateAddress(
  prefix: string,
  orderId: number,
  rowId: number,
): z.infer<typeof addressValidation> {
  const country = faker.address.country();
  return {
    orderId: [prefix, orderId, rowId].join("-"),
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    address: `${faker.address.streetAddress()} ${randomInt(1, 200)}`,
    zip: randomInt(1, 100_000).toString(),
    city: faker.address.cityName(),
    country,
    companyName: faker.company.companyName(),
    shippingCosts: parseInt(
      createHash("sha256").update(country).digest("hex").slice(0, 1),
      16,
    ),
  };
}

export async function triggerWebhook(
  webhookId: string,
  webhookSecret: string,
  event: unknown,
): Promise<string> {
  const url = `http://localhost:3000/api/strapi/webhook/v1/${webhookId}`;

  const res = await new HttpClient().call<{
    status: string;
    traceId: string;
    jobId: string;
  }>({
    url,
    method: "POST",
    body: event,
    headers: {
      authorization: webhookSecret,
    },
  });
  expect(res.status).toBe(200);
  expect(res.data?.status).toEqual("received");
  expect(res.data?.traceId).toBeDefined();
  expect(res.data?.jobId).toBeDefined();

  return res.data!.jobId;
}
