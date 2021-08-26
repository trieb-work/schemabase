import { ProductDataFeedGenerator } from "./service";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { WeightUnitsEnum } from "@eci/types/graphql/global";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("generate", () => {
  const generator = new ProductDataFeedGenerator({
    saleorGraphqlClient: new ApolloClient({
      cache: new InMemoryCache(),
    }),
    channelSlug: "doesn't matter here",
  });

  it("converts the products correctly", async () => {
    const getRawProductsSpy = jest
      .spyOn(generator, "getRawProducts")
      .mockResolvedValue([
        {
          __typename: "Product",
          name: "Name",
          slug: "slug",
          productType: {
            hasVariants: true,
            __typename: "ProductType",
            name: "name",
            id: "id",
          },
          variants: [
            {
              metadata: [],
              id: "id",
              name: "name",
              sku: "sku",
              quantityAvailable: 5,
              weight: {
                unit: WeightUnitsEnum.Kg,
                value: 2,
              },
            },
          ],
          attributes: [],
          metadata: [],
        },
      ]);

    const csv = await generator.generateCSV("abc", "facebookcommerce");

    expect(getRawProductsSpy).toBeCalledTimes(1);
    expect(csv).toMatchSnapshot();
  });
});
