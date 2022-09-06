import { Address, ZohoAddress } from "@prisma/client";
import { Warning } from "../utils";

type AddressWithZohoAddress = Address & {
  zohoAddress: ZohoAddress[];
};

export function addressToZohoAddressId(
  address: AddressWithZohoAddress,
): string {
  if (!address?.zohoAddress || address.zohoAddress.length === 0) {
    throw new Warning(
      // eslint-disable-next-line max-len
      "No zohoAddress set for the address (shipping or billing) of this order. Aborting sync of this order. Try again after zoho address sync.",
    );
  }
  if (address.zohoAddress.length > 1) {
    throw new Error(
      "Multiple zohoAddresses set for the address of this order. Aborting sync of this order.",
    );
  }
  return address.zohoAddress[0].id;
}
