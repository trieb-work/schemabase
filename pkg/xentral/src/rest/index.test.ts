import { PrismaClient } from "@eci/pkg/prisma";
import { XentralRestClient } from "./";
import { beforeAll, describe, test } from "@jest/globals";

const prismaClient = new PrismaClient();
let xentral: XentralRestClient;

describe("Xentral Class Unit Test", () => {
    beforeAll(async () => {
        const xentralApp = await prismaClient.xentralProxyApp.findUnique({
            where: {
                id: "test",
            },
        });

        xentral = new XentralRestClient({
            url: xentralApp?.url!,
            password: xentralApp?.password!,
            username: xentralApp?.username!,
            // defaultProjectId: xentralApp?.projectId,
        });
    });

    test("It should work to get all artikels", async () => {
        const paginator = xentral.getArtikel({}, 10);
        let counter = 0;
        for await (const _ of paginator) {
            counter += 1;
            console.log("counter", counter);
        }
    }, 50_000);
    test("It should work to get all trackingnummern", async () => {
        const paginator = xentral.getTrackingnummern({}, 1);
        let counter = 0;
        for await (const _ of paginator) {
            counter += 1;
            console.log("counter", counter);
        }
    }, 50_000);
});
