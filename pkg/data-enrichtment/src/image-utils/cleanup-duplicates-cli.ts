import { PrismaClient } from "@eci/pkg/prisma";
import { ImageDuplicateCleanup } from "./cleanup-duplicates";

async function main() {
    const prisma = new PrismaClient();
    const cleanup = new ImageDuplicateCleanup(prisma);

    try {
        // Parse command line arguments
        const args = process.argv.slice(2);
        const dryRun = !args.includes("--execute");
        const tenantId = args
            .find((arg) => arg.startsWith("--tenant="))
            ?.split("=")[1];

        if (dryRun) {
            console.log(
                "Running in dry-run mode. Use --execute to actually mark duplicates as deleted.",
            );
        }

        await cleanup.cleanupDuplicateImages(dryRun, tenantId);
    } catch (error) {
        console.error("Error during cleanup:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
