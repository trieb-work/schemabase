import { HttpClient } from "@eci/http";
import { env } from "@eci/util/env";
describe("productdatafeed", () => {
  const variants = ["facebookcommerce", "googlemerchant"];

  for (const variant of variants) {
    describe(variant, () => {
      it("generates a product data feed", async () => {
        const http = new HttpClient();

        const url = `${env.require(
          "ECI_BASE_URL",
        )}/api/product-data-feed/cksq51dwk00009ci06armhpsq?variant=${variant}`;

        const res = await http
          .call<string>({
            method: "GET",
            url,
          })
          .catch((err) => {
            console.error(err);
            throw err;
          });

        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toEqual("text/csv");
        expect(res.headers["cache-control"]).toEqual(
          "s-maxage=1, stale-while-revalidate",
        );
        expect(res.data).toMatchSnapshot();
      }, 20_000);
    });
  }
});
