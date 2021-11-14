import { OrderEvent } from "@eci/integrations/strapi-orders-to-zoho";
import {
  SalesOrderShortSearchOverview,
  ZohoClientInstance,
} from "@trieb.work/zoho-ts";
import { expect } from "@jest/globals";
export async function verifySyncedOrders(
  zohoClient: ZohoClientInstance,
  strapiEvent: OrderEvent,
): Promise<SalesOrderShortSearchOverview[]> {
  const bulkOrderId = [strapiEvent.entry.prefix, strapiEvent.entry.id].join(
    "-",
  );

  const zohoOrders = await zohoClient.searchSalesOrdersWithScrolling({
    searchString: bulkOrderId,
  });

  expect(zohoOrders.length).toBe(strapiEvent.entry.addresses.length);
  for (const zohoOrder of zohoOrders) {
    switch (strapiEvent.entry.status) {
      case "Confirmed":
        expect(zohoOrder.status).toEqual("confirmed");
        break;
      case "Sending":
        expect(zohoOrder.status).toEqual("confirmed");
        expect(zohoOrder.cf_ready_to_fulfill).toEqual("true");
        break;
      default:
        expect(zohoOrder.status).toEqual("draft");
        break;
    }

    const strapiAddress = strapiEvent.entry.addresses.find(
      (addr) => addr.orderId === zohoOrder.salesorder_number,
    );
    if (!strapiAddress) {
      throw new Error(
        `strapiAddress is undefined: ${JSON.stringify(
          { strapiEvent, zohoOrder },
          null,
          2,
        )}`,
      );
    }

    const res = await zohoClient.getSalesorderById(zohoOrder.salesorder_id);
    if (!res || !res.shipping_address) {
      throw new Error(
        `Unable to load order from zoho: ${zohoOrder.salesorder_id}`,
      );
    }
    const zohoAddr = res.shipping_address;

    expect(zohoAddr.address).toEqual(strapiAddress.address);
    expect(zohoAddr.city).toEqual(strapiAddress.city);
    expect(zohoAddr.zip).toEqual(strapiAddress.zip);
    expect(zohoAddr.country).toEqual(strapiAddress.country);
    expect(zohoAddr.attention).toEqual(
      `${strapiAddress.name} ${strapiAddress.surname}`,
    );

    if (strapiAddress.street2) {
      expect(zohoAddr.street2).toEqual(
        `${strapiAddress.companyName} - ${strapiAddress.street2}`,
      );
    } else {
      expect(zohoAddr.street2).toEqual(strapiAddress.companyName);
    }
  }
  return zohoOrders;
}
