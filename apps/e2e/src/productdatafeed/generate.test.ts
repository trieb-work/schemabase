import { HttpClient } from "@eci/http";
import { env } from "@eci/util/env";
describe("productdatafeed", () => {
  it("generates a feed for facebook", async () => {
    const http = new HttpClient();
    const res = await http.call<string>({
      method: "GET",
      url: `${env.require(
        "ECI_BASE_URL",
      )}/api/product-data-feed/cksq51dwk00009ci06armhpsq?variant=facebookcommerce`,
    });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toEqual("text/csv");
    expect(res.headers["cache-control"]).toEqual(
      "s-maxage=1, stale-while-revalidate",
    );
    expect(res.data).toMatchSnapshot();
  }, 20_000);
});
