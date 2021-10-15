import {
  PrefixedOrderId,
  OrderEvent,
} from "@eci/integrations/strapi-orders-to-zoho";
import { ZohoClientInstance } from "@trieb.work/zoho-ts";

export async function verifySyncedOrders(
  zohoClient: ZohoClientInstance,
  orderId: string,
  strapiEvent: OrderEvent,
): Promise<void> {
  const zohoOrders = await zohoClient.searchSalesOrdersWithScrolling(orderId);

  if (zohoOrders.length !== strapiEvent.entry.addresses.length) {
    throw new Error(
      `expected length ${strapiEvent.entry.addresses.length}, received: ${zohoOrders.length}`,
    );
  }
  for (const zohoOrder of zohoOrders) {
    if (strapiEvent.entry.status === "Sending") {
      if (zohoOrder.status !== "confirmed") {
        throw new Error(
          `expected status: ${strapiEvent.entry.status}, received: ${zohoOrder.status}`,
        );
      }
    } else {
      // @ts-expect-error The type is just wrong
      if (zohoOrder.status !== "draft") {
        throw new Error(
          `expected status: ${strapiEvent.entry.status}, received: ${zohoOrder.status}`,
        );
      }
    }

    const orderId = new PrefixedOrderId(zohoOrder.salesorder_number).toString(
      false,
    );
    const strapiAddress = strapiEvent.entry.addresses.find(
      (addr) => addr.orderId === orderId,
    );
    if (!strapiAddress) {
      throw new Error("No matching strapi address found");
    }

    const res = await zohoClient.getSalesorderById(zohoOrder.salesorder_id);
    if (!res || !res.shipping_address) {
      throw new Error(
        `Unable to load order from zoho: ${zohoOrder.salesorder_id}`,
      );
    }
    const zohoAddr = res.shipping_address;

    if (
      zohoAddr.address !== strapiAddress.address ||
      zohoAddr.city !== strapiAddress.city ||
      zohoAddr.zip !== strapiAddress.zip ||
      zohoAddr.country !== strapiAddress.country
    ) {
      throw new Error(
        `expected: ${JSON.stringify(
          strapiAddress,
          null,
          2,
        )}, received: ${JSON.stringify(zohoAddr, null, 2)}`,
      );
    }
  }
}
