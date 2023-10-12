import { ILogger } from "@eci/pkg/logger";
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
            return ".png"; // fallback to .png if the extracted extension isn't recognized
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
        logger: ILogger,
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

        logger.debug(
            `Uploading image to Saleor with name: image${fileExtension}`,
        );

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

    /**
     * We upload the backgroundImage for a category to saleor in a different way, than product images.
     * We use the generic "categoryUpdate". Furthermore, we can't set metadata on that image. So we
     * can't set any information on the category image.
     */
    public async uploadCategoryImageToSaleor(
        saleorCategoryId: string,
        imageBlob: Blob,
        fileExtension: string,
        logger: ILogger,
    ): Promise<string> {
        const form = new FormData();
        form.append(
            "operations",
            JSON.stringify({
                query: `
            mutation categoryUpdate($id: ID!, $backgroundImage: Upload, $alt: String) {
                categoryUpdate(id: $id, input: {backgroundImage: $backgroundImage, backgroundImageAlt: $alt}) {
                    errors {
                        field
                        code
                        message
                    }
                    category {
                        id
                    }
                }
            }
        `,
                variables: {
                    id: saleorCategoryId,
                    backgroundImage: null,
                },
            }),
        );

        form.append(
            "map",
            JSON.stringify({ backgroundImage: ["variables.backgroundImage"] }),
        );

        // Use the file extension when appending the image to the form
        form.append(
            "backgroundImage",
            imageBlob,
            `backgroundImage${fileExtension}`,
        );

        logger.debug(
            `Uploading image to Saleor with name: backgroundImage${fileExtension}`,
        );

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

        if (res.data.categoryUpdate?.errors?.length > 0) {
            throw new Error(
                `Failed to upload image to Saleor: ${JSON.stringify(
                    res.data.categoryUpdate.errors,
                )}`,
            );
        }
        return res.data.categoryUpdate.category.id;
    }
}
