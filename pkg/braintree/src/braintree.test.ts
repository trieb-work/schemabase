import { PrismaClient } from "@eci/pkg/prisma";
import { BraintreeTransaction, BraintreeClient } from "./braintree";
import { describe, test, beforeAll, expect } from "@jest/globals";
import { krypto } from "@eci/pkg/krypto";

const prismaClient = new PrismaClient();
let braintree: BraintreeClient;

describe("Braintree Class Unit Test", () => {
    beforeAll(async () => {
        const braintreeConf = await prismaClient.braintreeApp.findUnique({
            where: {
                id: "test",
            },
        });
        if (!braintreeConf || !braintreeConf.merchantId)
            throw new Error("No braintree config with id `test` found!");
        const merchantId = await krypto.decrypt(braintreeConf.merchantId);
        const privateKey = await krypto.decrypt(braintreeConf.privateKey);
        const publicKey = await krypto.decrypt(braintreeConf.publicKey);

        braintree = new BraintreeClient({
            merchantId,
            privateKey,
            publicKey,
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
