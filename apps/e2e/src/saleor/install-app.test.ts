import {SaleorService} from "@eci/adapters/saleor"
import {env} from "@eci/util/env"
describe("Saleor app installation", () => {


  it("works", async () => {
    const client = new SaleorService({
      graphqlEndpoint: env.require("SALEOR_GRAPHQL_ENDPOINT")
    })

    const {id} = await client.installApp("tenantId")
    expect(id.length).toBeGreaterThan(0);
  });
});
