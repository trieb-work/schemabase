import { ProductDataFeedGenerator } from "./service";
import { SaleorClient, WeightUnitsEnum } from "@eci/adapters/saleor";
import { FeedVariant } from "./types";
import { NoopLogger } from "@eci/util/logger";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("generate", () => {
  const mockedSaleorClient = {
    products: async (variables: { first: number; channel: string }) =>
      Promise.resolve({
        products: {
          edges: [
            {
              node: {
                __typename: "Product",
                name: "Name",
                slug: "slug",
                seoDescription: "SeoDescription",
                productType: {
                  hasVariants: true,
                  __typename: "ProductType",
                  name: "name",
                  id: "id",
                },
                channel: variables.channel,
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
            },
          ],
        },
      }),
  } as unknown as SaleorClient;
  const generator = new ProductDataFeedGenerator({
    saleorClient: mockedSaleorClient,
    channelSlug: "doesn't matter here",
    logger: new NoopLogger(),
  });
  const variants: FeedVariant[] = ["facebookcommerce", "googlemerchant"];
  for (const variant of variants) {
    it("converts the products correctly", async () => {
      const csv = await generator.generateCSV("abc", variant);

      expect(csv).toMatchSnapshot();
    });
  }
});
