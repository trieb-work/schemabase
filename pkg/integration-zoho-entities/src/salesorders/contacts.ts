import { Order, ZohoContactPerson, Contact } from "@prisma/client";
import { Warning } from ".";

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
      "No zohoContactPersons set for the mainContact of this order. "+
      "Aborting sync of this order. Try again after zoho contacts sync.",
    );
  }
  if (order.mainContact.zohoContactPersons.length > 1) {
    throw new Error(
      "Multiple zohoContactPersons set for the mainContact of this order. "+
      "Aborting sync of this order.",
    );
  }
  return order.mainContact.zohoContactPersons[0];
  // return order.mainContact.zohoContactPersons[0].zohoContactId;
}