import { APL, AuthData } from "@saleor/app-sdk/APL";
import { PrismaClient } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";

const prismaClient = new PrismaClient();

const prismaAPL: APL = {
  get: async (saleorApiUrl: string) => {
    console.log(
      "Get is not implemented, as we need the AppId, not only saleorApiURL (not unique in our DB)",
    );
    const t = { saleorApiUrl } as AuthData;
    return t;
  },
  set: async (authData: AuthData) => {
    const token = authData.token;
    if (!authData.domain) throw new Error("No domain set! This is mandatory");
    await prismaClient.installedSaleorApp.upsert({
      where: {
        id: authData.appId,
      },
      create: {
        id: authData.appId,
        token,
        saleorApp: {
          connectOrCreate: {
            where: {
              domain: authData.domain,
            },
            create: {
              id: id.id("publicKey"),
              name: "schemabase saleor app",
              domain: authData.domain,
              apiUrl: authData.saleorApiUrl,
            },
          },
        },
      },
      update: {
        token,
        saleorApp: {
          connectOrCreate: {
            where: {
              domain: authData.domain,
            },
            create: {
              id: id.id("publicKey"),
              name: "schemabase saleor app",
              domain: authData.domain,
            },
          },
        },
      },
    });
  },
  delete: async (saleorApiUrl: string) => {
    console.log("DELETE request for saleorApiUrl", saleorApiUrl);
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
