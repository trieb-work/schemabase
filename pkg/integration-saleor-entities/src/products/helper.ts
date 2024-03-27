import { ILogger } from "@eci/pkg/logger";
import { ProductMediaType, SaleorClient } from "@eci/pkg/saleor";

/**
 * Saleor helper function to sort
 * a video as the last item in the list
 */
const sortVideoOrder = async (
    saleorClient: SaleorClient,
    logger: ILogger,
    productId: string,
    media: {
        __typename?: "ProductMedia" | undefined;
        id: string;
        metafield?: string | null | undefined;
        type: ProductMediaType;
        sortOrder?: number | null | undefined;
    }[],
) => {
    if (media[0].type === "VIDEO") {
        // first item is a video. Creating a new
        // array with the video as the last item.
        // taking only the ids of the media to send it to saleor
        const video = media.shift();
        const mediaIds = media.map((m) => m.id);
        if (video) mediaIds.push(video.id);

        logger.info(`Reordering media for product ${productId}`);
        const res = await saleorClient.ProductMediaReorder({
            productId,
            mediaIds,
        });
        return res.productMediaReorder;
    }
    return;
};

export { sortVideoOrder };
