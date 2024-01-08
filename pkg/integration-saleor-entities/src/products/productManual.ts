/**
 * A class that can be used to handle the search & upload of new product manuals
 * for saleor products. It also handles the update of saleor product attributes with updates
 * product manual media
 */

import { ILogger } from "@eci/pkg/logger";
import {
    InstalledSaleorApp,
    Media,
    PrismaClient,
    SaleorApp,
} from "@eci/pkg/prisma";
// import { SaleorClient } from "@eci/pkg/saleor";
import { MediaUpload } from "../mediaUpload";

export class SaleorProductManual {
    // private readonly saleorClient: SaleorClient;

    private readonly installedSaleorApp: InstalledSaleorApp & {
        saleorApp: SaleorApp;
    };

    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    constructor(
        // saleorClient: SaleorClient,
        logger: ILogger,
        db: PrismaClient,
        installedSaleorApp: InstalledSaleorApp & {
            saleorApp: SaleorApp;
        },
    ) {
        // this.saleorClient = saleorClient;
        this.logger = logger;
        this.db = db;
        this.installedSaleorApp = installedSaleorApp;
    }

    /**
     * Takes a UPDATED_AT date and returns all product manuals from our DB that
     * have been updated since that date.
     * @param updateAtDate
     */
    public async getProductManualsFromDb(updateAtDate: Date) {
        return this.db.media.findMany({
            where: {
                products: {
                    some: {
                        saleorProducts: {
                            some: {
                                installedSaleorAppId:
                                    this.installedSaleorApp.id,
                            },
                        },
                    },
                },
                type: "MANUAL",
                updatedAt: {
                    gte: updateAtDate,
                },
            },
            include: {
                products: {
                    include: {
                        saleorProducts: true,
                    },
                },
                saleorMedia: {
                    where: {
                        installedSaleorAppId: this.installedSaleorApp.id,
                    },
                },
            },
        });
    }

    public async uploadProductManual(manual: Media) {
        const mediaUpload = new MediaUpload(this.installedSaleorApp, this.db);
        try {
            const fileBlob = await mediaUpload.fetchMediaBlob(manual.url);
            const fileExtension = await mediaUpload.getFileExtension(
                manual.url,
            );
            if (!fileExtension) {
                this.logger.error(
                    `Could not determine file extension for media ${manual.id}: ${manual.url}`,
                );
                return;
            }
            const fileURL = await mediaUpload.uploadFileToSaleor(
                fileBlob,
                fileExtension.extension,
                manual.id,
                this.logger,
            );

            this.logger.info(
                `Successfully uploaded manual ${manual.id}: ${manual.url} to saleor with url ${fileURL}`,
            );
            return fileURL;
        } catch (error: any) {
            this.logger.error(
                `Error handling media ${manual.id}: ${manual.url} - ${
                    error?.message ?? error
                }`,
            );
            return;
        }
    }
}
