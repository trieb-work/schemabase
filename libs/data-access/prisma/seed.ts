import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const tenantId = "294de72d-6498-4355-a182-422bbed7b825";
  const tenant = await prisma.tenant.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      name: "test tenant",
    },
  });

  await prisma.strapiApp.upsert({
    where: { id: "strapiId" },
    update: {},
    create: {
      id: "strapiId",
      name: "testing",
      tenant: {
        connect: {
          id: tenant.id,
        },
      },
    },
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
