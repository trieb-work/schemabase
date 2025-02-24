# Data Enrichment

This package contains utilities for enriching and managing data across the platform.

## Features

### Image Utils

The `image-utils` module provides utilities for managing and analyzing images:

#### Image Hash Detection

The `ImageHasher` class provides functionality to detect duplicate images by generating and comparing unique hashes:

```typescript
import { ImageHasher } from "./image-utils/image-hash";

// Generate hash for a single image
const hash = await ImageHasher.generateImageHash(
    "https://example.com/image.jpg",
);

// Compare two images
const areIdentical = await ImageHasher.areImagesIdentical(
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
);
```

This is useful for:

-   Detecting duplicate product images in Saleor
-   Cleaning up redundant images in the database
-   Ensuring image uniqueness during imports

The hash is generated using SHA-256 on the raw image data, ensuring that even if images are renamed or stored in different locations, duplicates can still be detected.

#### Image Duplicate Cleanup

The `ImageDuplicateCleanup` utility helps identify and clean up duplicate images across your database:

```typescript
import { PrismaClient } from "@prisma/client";
import { ImageDuplicateCleanup } from "./image-utils/cleanup-duplicates";

const prisma = new PrismaClient();
const cleanup = new ImageDuplicateCleanup(prisma);

// Run in dry-run mode first to see what would be cleaned up
await cleanup.cleanupDuplicateImages(true);

// Actually perform the cleanup
await cleanup.cleanupDuplicateImages(false);
```

You can also use the CLI tool:

```bash
# Dry run - just show duplicates
pnpm tsx src/image-utils/cleanup-duplicates-cli.ts

# Actually mark duplicates as deleted
pnpm tsx src/image-utils/cleanup-duplicates-cli.ts --execute

# Process images for a specific tenant
pnpm tsx src/image-utils/cleanup-duplicates-cli.ts --tenant=your-tenant-id
```

The cleanup process:
1. Generates hashes for all non-deleted media entries
2. Groups images by their hash to find duplicates
3. For each group of duplicates:
   - Keeps the most referenced image (used in most products/variants/categories)
   - Marks other duplicates as deleted
4. Preserves all relationships while marking duplicates as deleted
