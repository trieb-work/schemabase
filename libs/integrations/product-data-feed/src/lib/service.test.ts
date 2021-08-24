import { ProductDataFeedGenerator } from "./service";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { WeightUnitsEnum } from "@eci/types/graphql/global";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("generate", () => {
  const generator = new ProductDataFeedGenerator(
    new ApolloClient({
      cache: new InMemoryCache(),
    }),
  );

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
    expect(csv).toMatchInlineSnapshot(`
      "id,title,description,rich_text_description,image_link,additional_image_link,link,price,sale_price,condition,gtin,brand,unit_pricing_measure,availability,google_product_category
      sku,Name (name),,,,,abcslug,undefined undefined,undefined undefined,new,,,,out of stock,
      "
    `);
  });
});
