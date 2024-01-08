import { ILogger } from "@eci/pkg/logger";
import { InstalledSaleorApp, PrismaClient, SaleorApp } from "@eci/pkg/prisma";
import { fileTypeFromBlob } from "file-type";

export class MediaUpload {
    private readonly installedSaleorApp: InstalledSaleorApp & {
        saleorApp: SaleorApp;
    };

    private readonly db: PrismaClient;

    constructor(
        installedSaleorApp: InstalledSaleorApp & { saleorApp: SaleorApp },
        db: PrismaClient,
    ) {
        this.installedSaleorApp = installedSaleorApp;
        this.db = db;
    }

    /**
     * Try to extract the file extension from the URL.
     * @param url
     * @returns
     */
    public async getFileExtension(
        url: string,
        fileBlob?: Blob,
    ): Promise<{ extension: string; fileType?: string } | undefined> {
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
            "pdf",
        ];

        if (!validExtensions.includes(extension.toLowerCase())) {
            if (!fileBlob) return undefined;
            // try to guess the file extension using the file-type library
            const guess = await fileTypeFromBlob(fileBlob);
            if (guess) {
                return { extension: `.${guess.ext}`, fileType: guess.mime };
            } else {
                return undefined;
            }
        }

        return { extension: `.${extension.toLowerCase()}` };
    }

    public async fetchMediaBlob(url: string): Promise<Blob> {
        const imgResp = await fetch(url);
        if (!imgResp.ok) {
            throw new Error("Error downloading image");
        }
        const mediaBlob = await imgResp.blob();
        if (!mediaBlob) {
            throw new Error("Failed to convert response to blob");
        }
        return mediaBlob;
    }

    /**
     * Upload the image to saleor using the GraphQL multipart request specification.
     * Returns the image id of the uploaded image.
     * @param saleorProductId
     * @param mediaBlob
     * @param fileExtension
     * @returns
     */
    public async uploadImageToSaleor({
        saleorProductId,
        mediaBlob,
        fileExtension,
        logger,
        fileType,
    }: {
        saleorProductId: string;
        mediaBlob: Blob;
        fileExtension: string;
        logger: ILogger;
        fileType?: string;
    }): Promise<string> {
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

        /**
         * set the filetype if we have one
         */
        const fileBlob = fileType
            ? mediaBlob.slice(0, mediaBlob.size, fileType)
            : mediaBlob;
        // Use the file extension when appending the image to the form
        form.append("image", fileBlob, `image${fileExtension}`);

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
        mediaBlob: Blob,
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
            mediaBlob,
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

    /**
     * The generic file upload function - can be used for example to upload files
     * and reference these files later in an file attribute. Uses the FileUpload mutation.
     * Returns just the URL of the uploaded file
     */
    public async uploadFileToSaleor(
        fileBlob: Blob,
        fileExtension: string,
        mediaId: string,
        logger: ILogger,
    ): Promise<string> {
        const form = new FormData();
        form.append(
            "operations",
            JSON.stringify({
                query: `
            mutation fileUpload($file: Upload!) {
                fileUpload(file: $file) {
                    uploadedFile {
                        url
                    }
                }
            }
        `,
                variables: {
                    file: null,
                },
            }),
        );

        form.append("map", JSON.stringify({ file: ["variables.file"] }));

        // Use the file extension when appending the image to the form
        form.append("file", fileBlob, `file${fileExtension}`);

        logger.debug(
            `Uploading file to Saleor with name: file${fileExtension}`,
        );

        const response = await fetch(this.installedSaleorApp.saleorApp.apiUrl, {
            method: "POST",
            body: form,
            headers: {
                Authorization: `Bearer ${this.installedSaleorApp.token}`,
            },
        });

        if (!response.ok) {
            console.error(await response.text());
            throw new Error("Failed to upload file to Saleor");
        }
        const res = await response.json();

        if (res.data.fileUpload?.errors?.length > 0) {
            throw new Error(
                `Failed to upload file to Saleor: ${JSON.stringify(
                    res.data.fileUpload.errors,
                )}`,
            );
        }

        /**
         * store the media URL in our DB
         */
        await this.db.saleorMedia.upsert({
            where: {
                url_installedSaleorAppId: {
                    url: res.data.fileUpload.uploadedFile.url,
                    installedSaleorAppId: this.installedSaleorApp.id,
                },
            },
            create: {
                url: res.data.fileUpload.uploadedFile.url,
                media: {
                    connect: {
                        id: mediaId,
                    },
                },
                installedSaleorApp: {
                    connect: {
                        id: this.installedSaleorApp.id,
                    },
                },
            },
            update: {},
        });

        return res.data.fileUpload.uploadedFile.url as string;
    }
}
