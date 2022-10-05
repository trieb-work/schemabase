import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import type { Prisma, PrismaClient, ZohoApp } from "@eci/pkg/prisma";

export async function prismaZohoAppEntryToClient(
  zohoApp: ZohoApp,
): Promise<Zoho> {
  
  // TODO: better fix the datacenter here. Check, that it is a valid value
  const dc = zohoApp.datacenter as any;

  return new Zoho(
    await ZohoApiClient.fromOAuth({
      orgId: zohoApp.orgId,
      dc,
      client: {
        id: zohoApp.clientId,
        secret: zohoApp.clientSecret,
      },
    }),
  );
}

export async function createZohoClient(
  zohoAppId: string,
  prisma: PrismaClient,
): Promise<Zoho> {
  const zohoApp = await prisma.zohoApp.findUnique({
    where: {
      id: zohoAppId,
    },
  });
  if (!zohoApp)
    throw new Error(`Could not find zoho app with provided id ${zohoAppId}`);
  return prismaZohoAppEntryToClient(zohoApp);
}

export async function getZohoClientAndEntry<
  T extends Prisma.ZohoAppInclude | null | undefined,
>(zohoAppId: string, prisma: PrismaClient, include: T) {
  const zohoApp = await prisma.zohoApp.findUnique({
    where: {
      id: zohoAppId,
    },
    include,
  });
  if (!zohoApp)
    throw new Error(`Could not find zoho app with provided id ${zohoAppId}`);
  const client = await prismaZohoAppEntryToClient(zohoApp);
  return { client, zohoApp };
}
