// import { PrismaClient } from "@eci/pkg/prisma";
import { BraintreeTransaction, BraintreeClient } from "./braintree";
import { describe, test, beforeAll, expect } from "@jest/globals";

// const prismaClient = new PrismaClient();
let braintree: BraintreeClient;

const merchantIdTest = "83xhsc8ghngkhp7q";
const publicKeyTest = "f66g4gs2pcqxx3rx";
const privateKeyTest = "6d576b42ff5cd9e89a2f384fad67f5cf";

describe("Braintree Class Unit Test", () => {
  beforeAll(async () => {
    // const braintreeConf = await prismaClient.braintree.findUnique({
    //   where: {
    //     id: "test",
    //   },
    // });
    // if (!braintreeConf || !braintreeConf.merchantId)
    //   throw new Error("No braintree config with id `test` found!");
    braintree = new BraintreeClient({
      merchantId: merchantIdTest,
      privateKey: privateKeyTest,
      publicKey: publicKeyTest,
      sandbox: true,
    });
  });

  test("It should work to get all transactions as list", async () => {
    const stream = braintree.listTransactionStream({
      createdAfter: new Date("2022-08-01"),
    });
    for await (const chunk of stream as unknown as Iterable<BraintreeTransaction>) {
      expect(chunk.id).toBeDefined();
    }
  });
});
