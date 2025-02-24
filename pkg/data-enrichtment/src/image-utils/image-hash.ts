import crypto from "crypto";
import fetch from "node-fetch";

/**
 * ImageHasher provides utilities for generating unique hashes of images
 * to identify duplicates across different sources.
 */
export class ImageHasher {
    /**
     * Generates a SHA-256 hash of an image from its URL.
     * This can be used to identify duplicate images even if they are stored
     * with different filenames or in different locations.
     *
     * @param imageUrl - The URL of the image to hash
     * @returns Promise<string> - The SHA-256 hash of the image data
     * @throws Error if the image cannot be fetched or processed
     */
    public static async generateImageHash(imageUrl: string): Promise<string> {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch image: ${response.statusText}`,
                );
            }

            const arrayBuffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const hash = crypto.createHash("sha256");
            hash.update(uint8Array);
            return hash.digest("hex");
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to generate image hash: ${errorMessage}`);
        }
    }

    /**
     * Checks if two images are identical by comparing their hashes
     *
     * @param imageUrl1 - URL of the first image
     * @param imageUrl2 - URL of the second image
     * @returns Promise<boolean> - True if the images are identical
     */
    public static async areImagesIdentical(
        imageUrl1: string,
        imageUrl2: string,
    ): Promise<boolean> {
        const [hash1, hash2] = await Promise.all([
            this.generateImageHash(imageUrl1),
            this.generateImageHash(imageUrl2),
        ]);
        return hash1 === hash2;
    }
}
