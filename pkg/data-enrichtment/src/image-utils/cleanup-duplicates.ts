import { PrismaClient } from "@eci/pkg/prisma";
import { ImageHasher } from "./image-hash";

interface DuplicateGroup {
    hash: string;
    mediaIds: string[];
}

/**
 * Utility to detect and clean up duplicate images across the database
 */
export class ImageDuplicateCleanup {
    constructor(private prisma: PrismaClient) {}

    /**
     * Process all media entries, generate hashes, and identify duplicates
     * @param dryRun If true, only report duplicates without marking them as deleted
     * @param tenantId Optional tenant ID to process images for a specific tenant only
     */
    public async cleanupDuplicateImages(
        dryRun = true,
        tenantId?: string,
    ): Promise<void> {
        console.log("Starting duplicate image cleanup...");

        // Get all non-deleted media entries that need hash generation
        const mediaToProcess = await this.prisma.media.findMany({
            where: {
                deleted: false,
                dataHash: null,
                ...(tenantId && { tenantId }),
            },
        });

        console.log(
            `Found ${mediaToProcess.length} media entries that need hash generation`,
        );

        // Generate and store hashes
        for (const media of mediaToProcess) {
            try {
                const hash = await ImageHasher.generateImageHash(media.url);
                await this.prisma.media.update({
                    where: { id: media.id },
                    data: { dataHash: hash },
                });
                console.log(`Generated hash for ${media.url}: ${hash}`);
            } catch (error) {
                console.error(`Failed to process ${media.url}: ${error}`);
            }
        }

        // Get all media entries with their hashes and references
        const mediaEntries = await this.prisma.media.findMany({
            where: {
                deleted: false,
                dataHash: { not: null },
                ...(tenantId && { tenantId }),
            },
            include: {
                products: true,
                productVariants: true,
                categories: true,
                saleorMedia: true,
            },
        });

        // Group by hash
        const hashMap = new Map<string, string[]>();
        for (const media of mediaEntries) {
            if (!media.dataHash) continue;
            const existing = hashMap.get(media.dataHash) || [];
            existing.push(media.id);
            hashMap.set(media.dataHash, existing);
        }

        // Find duplicate groups
        const duplicateGroups: DuplicateGroup[] = Array.from(hashMap.entries())
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, ids]) => ids.length > 1)
            .map(([hash, ids]) => ({ hash, mediaIds: ids }));

        console.log(
            `Found ${duplicateGroups.length} groups of duplicate images`,
        );

        if (dryRun) {
            // Just report the duplicates
            for (const group of duplicateGroups) {
                const entries = mediaEntries.filter((m) =>
                    group.mediaIds.includes(m.id),
                );
                console.log("\nDuplicate group:");
                for (const entry of entries) {
                    console.log(`  - ${entry.url} (ID: ${entry.id})`);
                    if (entry.products.length)
                        console.log(
                            `    Used in ${entry.products.length} products`,
                        );
                    if (entry.productVariants.length)
                        console.log(
                            `    Used in ${entry.productVariants.length} variants`,
                        );
                    if (entry.categories.length)
                        console.log(
                            `    Used in ${entry.categories.length} categories`,
                        );
                    if (entry.saleorMedia.length)
                        console.log(
                            `    Has ${entry.saleorMedia.length} Saleor references`,
                        );
                }
            }
        } else {
            // Process each duplicate group
            for (const group of duplicateGroups) {
                const entries = mediaEntries.filter((m) =>
                    group.mediaIds.includes(m.id),
                );

                // Sort by usage (keep the most used one)
                entries.sort((a, b) => {
                    const usageA =
                        a.products.length +
                        a.productVariants.length +
                        a.categories.length +
                        a.saleorMedia.length;
                    const usageB =
                        b.products.length +
                        b.productVariants.length +
                        b.categories.length +
                        b.saleorMedia.length;
                    return usageB - usageA;
                });

                // Keep the first one (most used), mark others as deleted
                const [keep, ...duplicates] = entries;

                if (duplicates.length > 0) {
                    console.log(`\nKeeping ${keep.url} (ID: ${keep.id})`);
                    console.log(`Marking as deleted:`);

                    await this.prisma.media.updateMany({
                        where: { id: { in: duplicates.map((d) => d.id) } },
                        data: { deleted: true },
                    });

                    for (const dupe of duplicates) {
                        console.log(`  - ${dupe.url} (ID: ${dupe.id})`);
                    }
                }
            }
        }
    }
}
