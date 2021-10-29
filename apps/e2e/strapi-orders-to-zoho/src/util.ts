import { expect } from "@jest/globals";
import { HttpClient } from "@eci/http";
import faker from "faker";
import { randomInt } from "crypto";
import { z } from "zod";
import { addressValidation } from "@eci/integrations/strapi-orders-to-zoho";

faker.setLocale("de");

export function generateAddress(
  prefix: string,
  orderId: number,
  rowId: number,
): z.infer<typeof addressValidation> {
  return {
    orderId: [prefix, orderId, rowId].join("-"),
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    address: `${faker.address.streetAddress()} ${randomInt(1, 200)}`,
    zip: randomInt(1, 100_000).toString(),
    city: faker.address.cityName(),
    country: faker.address.country(),
  };
}

export async function triggerWebhook(
  webhookId: string,
  webhookSecret: string,
  event: unknown,
): Promise<void> {
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
}
