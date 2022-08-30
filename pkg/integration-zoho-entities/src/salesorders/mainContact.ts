import { Order, ZohoContactPerson, Contact } from "@prisma/client";
import { Warning } from ".";

type OrderWithZohoContacts = Order & {
  mainContact:
    | (Contact & {
        zohoContactPersons: ZohoContactPerson[];
      })
    | null;
};

export async function orderToMainContactId(
  order: OrderWithZohoContacts,
): Promise<string> {
  const mainContact = order.mainContact;
  if (!mainContact) {
    throw new Error(
      `No main contact given for ${order.orderNumber} - ${order.id}`,
    );
  }

  if (
    !mainContact.zohoContactPersons ||
    mainContact.zohoContactPersons.length === 0
  ) {
    throw new Warning(
      // eslint-disable-next-line max-len
      "No zohoContactPersons set for the mainContact of this order. Aborting sync of this order. Try again after zoho contacts sync.",
    );
  }
  if (mainContact.zohoContactPersons.length > 1) {
    throw new Error(
      // eslint-disable-next-line max-len
      "Multiple zohoContactPersons set for the mainContact of this order. Aborting sync of this order.",
    );
  }
  return mainContact.zohoContactPersons[0].zohoContactId;
}
