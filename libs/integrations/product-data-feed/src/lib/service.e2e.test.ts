import { ProductDataFeedGenerator } from "./service";
import { createGraphqlClient } from "@eci/graphql-client";

describe("e2e", () => {
  const generator = new ProductDataFeedGenerator({
    saleorGraphqlClient: createGraphqlClient(
      "https://pundf-test-api.triebwork.com/graphql/",
    ),
    channelSlug: "storefront",
  });

  it("returns all products in csv format", async () => {
    const csv = await generator.generateCSV("abc", "facebookcommerce");

    expect(csv).toMatchSnapshot();
  });
});
