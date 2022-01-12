import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ProductDataFeedGenerator } from "./service";
import { SaleorClient, WeightUnitsEnum } from "@eci/pkg/saleor";
import { FeedVariant } from "./types";
import { NoopLogger } from "@eci/pkg/logger";

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
                description:
                  '{"time": 1633343031152, "blocks": [{"data": {"text": "Hello world"}, "type": "paragraph"}], "version": "2.20.0"}',

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
    it(`converts the products correctly for ${variant}`, async () => {
      const csv = await generator.generateCSV("http://baseurl.com/", variant);

      expect(csv).toMatchSnapshot();
    });
  }
});
