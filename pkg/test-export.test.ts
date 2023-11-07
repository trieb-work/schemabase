import { describe, it } from "@jest/globals";
import { PrismaClient } from "./prisma";

describe("test-export", () => {
    it("should work", async () => {
        const db = new PrismaClient();

        const resp = await db.order.findUnique({
            where: {
                id: "o_Q6uSginztcEKLzgpYthaqr",
            },
            include: {
                orderLineItems: {
                    include: {
                        productVariant: true,
                    },
                },
                shippingAddress: true,
                billingAddress: true,
                payments: {
                    include: {
                        paymentMethod: true,
                    },
                },
                mainContact: true,
            },
        });

        console.log(JSON.stringify(resp, null, 2));
    });
});
