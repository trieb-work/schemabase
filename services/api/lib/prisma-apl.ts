import { APL, AuthData } from "@saleor/app-sdk/apl";
import { PrismaClient } from "@eci/pkg/prisma";

const prismaClient = new PrismaClient();

const prismaAPL: APL = {
  get: async (saleorApiUrl: string) => {
    const response = await prismaClient.
    const response = await client.get(saleorApiUrl);
    if (response) {
      return JSON.parse(response);
    }
  },
  set: async (authData: AuthData) => {
    const token = authData.token;
    const app = await prismaClient.installedSaleorApp.upsert({
      where: {
        id: authData.appId,
      },
      create: {
        id: authData.appId,
        token,
        webhooks: {
          create: {
            id: id.id("publicKey"),
            name: "Catch all",
            secret: {
              create: {
                id: id.id("publicKey"),
                secret: id.id("secretKey"),
              },
            },
          },
        },
        saleorApp: {
          connectOrCreate: {
            where: {
              domain_tenantId: {
                domain,
                tenantId,
              },
            },
            create: {
              id: id.id("publicKey"),
              name: "eCommerce Integration",
              // channelSlug: "",
              tenantId,
              domain,
            },
          },
        },
      },
      update: {
        token,
        saleorApp: {
          connectOrCreate: {
            where: {
              domain_tenantId: {
                domain,
                tenantId,
              },
            },
            create: {
              id: id.id("publicKey"),
              name: "eCommerce Integration",
              // channelSlug: "",
              tenantId,
              domain,
            },
          },
        },
      },
      include: {
        saleorApp: true,
        webhooks: {
          include: { secret: true },
        },
      },
    });

  },
  delete: async (saleorApiUrl: string) => {
    await client.del(saleorApiUrl);
  },
  getAll: async () => {
    throw new Error("Not implemented.");
  },
  isReady: async () => {
    await prismaClient.$connect();

    return {
      ready: true,
    };
  },
  isConfigured: async () => {
    return {
      configured: true,
    };
  },
};

export default prismaAPL;
