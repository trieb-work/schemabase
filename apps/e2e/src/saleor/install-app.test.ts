import { SaleorService } from "@eci/adapters/saleor";
import { env } from "@chronark/env";
describe("Saleor app installation", () => {
  it.skip("works", async () => {
    const client = new SaleorService({
      traceId: "test",
      graphqlEndpoint: env.require("SALEOR_GRAPHQL_ENDPOINT"),
    });

    const { id } = await client.installApp("tenantId");
    expect(id.length).toBeGreaterThan(0);
  });
});
