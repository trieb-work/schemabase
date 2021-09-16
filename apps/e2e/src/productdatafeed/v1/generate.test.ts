import { HttpClient } from "@eci/http";
import { env } from "@chronark/env";
describe("productdatafeed", () => {
  const variants = ["facebookcommerce", "googlemerchant"];

  const http = new HttpClient();
  for (const variant of variants) {
    it(`generates a feed for ${variant}`, async () => {
      const res = await http
        .call<string>({
          method: "GET",
          url: `${env.require(
            "ECI_BASE_URL",
          )}/api/product-data-feed/v1/cksq51dwk00009ci06armhpsq?variant=${variant}`,
        })
        .catch((err) => {
          console.error(err.message);
          throw err;
        });
      console.log({ res });

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toEqual("text/csv");
      expect(res.headers["cache-control"]).toEqual(
        "s-maxage=1, stale-while-revalidate",
      );
      expect(res.data).toMatchSnapshot();
    }, 20_000);
  }
});
