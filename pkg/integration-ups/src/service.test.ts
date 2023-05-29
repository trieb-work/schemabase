import { describe, test } from "@jest/globals";

const upsApi = require("ups-api");

describe("Saleor Entity Sync Packages Test", () => {
  // make sure, we have a UPS testing package

  test("Test client", async () => {
    // instance the API client with defaults
    const api = new upsApi.API({
      license: "EDD5A78BAA770E94",
    });

    // example: request tracking information
    const tracking = await api.getTrackingDetails("1Z2632010391189022");
    console.log(
      JSON.stringify(
        tracking.trackResponse.shipment[0].package[0].activity[0],
        null,
        1,
      ),
    );
  });
});
