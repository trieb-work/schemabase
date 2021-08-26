import { HttpClient } from "@eci/http";

describe("productdatafeed", () => {
  it("generates a feed for facebook", async () => {
    const http = new HttpClient();
    const res = await http.call<string>({
      method: "GET",
      url: "http://localhost:3000/api/product-data-feed/cksq51dwk00009ci06armhpsq?variant=facebookcommerce",
    });

    expect(res.status).toBe(200);
    console.log(res.headers);
    expect(res.headers["content-type"]).toEqual("text/csv");
    expect(res.headers["cache-control"]).toEqual(
      "s-maxage=1, stale-while-revalidate",
    );
    expect(res.data).toMatchSnapshot();
  }, 20_000);
});
