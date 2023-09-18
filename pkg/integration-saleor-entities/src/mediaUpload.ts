import { InstalledSaleorApp, SaleorApp } from "@eci/pkg/prisma";

export class MediaUpload {
    private readonly installedSaleorApp: InstalledSaleorApp & {
        saleorApp: SaleorApp;
    };

    constructor(
        installedSaleorApp: InstalledSaleorApp & { saleorApp: SaleorApp },
    ) {
        this.installedSaleorApp = installedSaleorApp;
    }

    /**
     * Try to extract the file extension from the URL.
     * @param url
     * @returns
     */
    public getFileExtension(url: string): string {
        const extension = url.slice(((url.lastIndexOf(".") - 1) >>> 0) + 2);

        // Check if the derived extension is valid (e.g., 'jpg', 'png').
        // This is a rudimentary check and can be expanded based on your needs.
        const validExtensions = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "bmp",
            "tiff",
        ];
        if (!validExtensions.includes(extension.toLowerCase())) {
            return ".jpg"; // fallback to .jpg if the extracted extension isn't recognized
        }

        return `.${extension}`;
    }

    public async fetchImageBlob(url: string): Promise<Blob> {
        const imgResp = await fetch(url);
        if (!imgResp.ok) {
            throw new Error("Error downloading image");
        }
        const imageBlob = await imgResp.blob();
        if (!imageBlob) {
            throw new Error("Failed to convert response to blob");
        }
        return imageBlob;
    }

    /**
     * Upload the image to saleor using the GraphQL multipart request specification.
     * Returns the image id of the uploaded image.
     * @param saleorProductId
     * @param imageBlob
     * @param fileExtension
     * @returns
     */
    public async uploadImageToSaleor(
        saleorProductId: string,
        imageBlob: Blob,
        fileExtension: string,
    ): Promise<string> {
        const form = new FormData();
        form.append(
            "operations",
            JSON.stringify({
                query: `
            mutation productMediaCreate($productId: ID!, $alt: String, $image: Upload) {
                productMediaCreate(input: {product: $productId, alt: $alt, image: $image}) {
                    errors {
                        field
                        code
                        message
                    }
                    media {
                        id
                    }
                }
            }
        `,
                variables: {
                    productId: saleorProductId,
                    alt: "",
                    image: null,
                },
            }),
        );

        form.append("map", JSON.stringify({ image: ["variables.image"] }));

        // Use the file extension when appending the image to the form
        form.append("image", imageBlob, `image${fileExtension}`);

        const response = await fetch(this.installedSaleorApp.saleorApp.apiUrl, {
            method: "POST",
            body: form,
            headers: {
                Authorization: `Bearer ${this.installedSaleorApp.token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to upload image to Saleor");
        }
        const res = await response.json();

        if (res.data.productMediaCreate?.errors?.length > 0) {
            throw new Error(
                `Failed to upload image to Saleor: ${JSON.stringify(
                    res.data.productMediaCreate.errors,
                )}`,
            );
        }
        return res.data.productMediaCreate.media.id;
    }
}
