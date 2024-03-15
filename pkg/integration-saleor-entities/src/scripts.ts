import { createSaleorClient, queryWithPagination } from "@eci/pkg/saleor";

const main = async () => {
    const saleorClient = createSaleorClient({
        traceId: "tr_1",
        graphqlEndpoint: "https://ken-dev-test.saleor.cloud/graphql/",
        token: "Z4caQOJSBFm68ptbh7SkZlFN1uqlE4",
    });
    const result = await queryWithPagination(({ first, after }) =>
        saleorClient.productTest({
            first,
            after,
        }),
    );

    if (!result.products?.edges.length) {
        console.log("No products found");
        return;
    }

    /**
     * items without channel listings
     */
    const itemsWithoutChannelListings = result.products.edges.filter(
        (edge) => edge.node.channelListings?.length === 0,
    );

    console.log(
        `Found ${itemsWithoutChannelListings.length} products without channel listings`,
    );

    await saleorClient.deleteProducts({
        ids: itemsWithoutChannelListings.map((edge) => edge.node.id),
    });
};

main();
