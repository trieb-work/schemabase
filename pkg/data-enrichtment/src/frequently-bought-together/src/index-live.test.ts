// test the categories integration. Use the tenant and KencoveApiApp "test".
//

import { PrismaClient } from "@eci/pkg/prisma";
import { AssertionLogger } from "@eci/pkg/logger";
import { describe, it } from "@jest/globals";
import { FrequentlyBoughtTogetherService } from ".";

const prisma = new PrismaClient();

describe("Frequently bought together", () => {
    it("should be able to run the fbt sync", async () => {
        const service = new FrequentlyBoughtTogetherService({
            db: prisma,
            logger: new AssertionLogger(),
            tenantId: "tn_kencove235",
        });
        await service.addFBTVariants();
    }, 200000);
});
