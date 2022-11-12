import { Order, ZohoContactPerson, Contact } from "@prisma/client";
import { Warning } from "../utils";

type OrderWithZohoContacts = Order & {
  mainContact:
    | (Contact & {
        zohoContactPersons: ZohoContactPerson[];
      })
    | null;
};

export function orderToMainContactPerson(
  order: OrderWithZohoContacts,
): ZohoContactPerson {
  if (!order.mainContact) {
    throw new Error(
      `No main contact given for ${order.orderNumber} - ${order.id}`,
    );
  }

  if (
    !order.mainContact.zohoContactPersons ||
    order.mainContact.zohoContactPersons.length === 0
  ) {
    throw new Warning(
      "No zohoContactPersons set for the mainContact of this order. " +
        "Aborting sync of this order. Try again after zoho contacts sync.",
    );
  }
  if (order.mainContact.zohoContactPersons.length > 1) {
    /// We have multiple contact persons with the same Email addresses to choose from.
    /// We try to filter now for "primary" contact persons only.
    const primaryContactPerson = order.mainContact.zohoContactPersons.find(
      (c) => c.isPrimary === true,
    );
    if (!primaryContactPerson)
      throw new Error(
        "Multiple zohoContactPersons set for the mainContact of this order." +
          "Filtering for primary ony did not work. Aborting sync of this order.",
      );
    return primaryContactPerson;
  }
  return order.mainContact.zohoContactPersons[0];
  // return order.mainContact.zohoContactPersons[0].zohoContactId;
}
