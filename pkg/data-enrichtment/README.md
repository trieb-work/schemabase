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
