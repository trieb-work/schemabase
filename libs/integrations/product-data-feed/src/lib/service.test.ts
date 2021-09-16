import { ProductDataFeedGenerator } from "./service";
import { SaleorService, WeightUnitsEnum } from "@eci/adapters/saleor";
import { FeedVariant } from "./types";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("generate", () => {
  const mockedSaleorClient = {
    getProducts: async (_opts: { first: number; channel: string }) =>
      Promise.resolve([
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
      ]),
  } as unknown as SaleorService;
  const generator = new ProductDataFeedGenerator({
    saleorClient: mockedSaleorClient,
    channelSlug: "doesn't matter here",
  });
  const variants: FeedVariant[] = ["facebookcommerce", "googlemerchant"];
  for (const variant of variants) {
    it("converts the products correctly", async () => {
      const csv = await generator.generateCSV("abc", variant);

      expect(csv).toMatchSnapshot();
    });
  }
});
