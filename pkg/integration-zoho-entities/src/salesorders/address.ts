import { ILogger } from "@eci/pkg/logger";
import { Address, ZohoAddress } from "@prisma/client";
import { Warning } from "../utils";

type AddressWithZohoAddress = Address & {
  zohoAddress: ZohoAddress[];
};

/**
 * Takes ECI addresses with related Zoho addresses and filters out just the one
 * corresponding to this Zoho Contact ID.
 * Returns the Zoho Address Id
 * @param address
 * @param zohoContactId
 * @param logger
 * @returns
 */
export function addressToZohoAddressId(
  address: AddressWithZohoAddress,
  zohoContactId: string,
  logger: ILogger,
): string {
  if (!address?.zohoAddress) {
    throw new Warning(
      // eslint-disable-next-line max-len
      "No zohoAddress set for the address (shipping or billing) of this order. Aborting sync of this order. Try again after zoho address sync.",
    );
  }
  const filteredForContact = address.zohoAddress?.find(
    (a) => a.zohoContactId === zohoContactId,
  );

  if (!filteredForContact?.id) {
    throw new Warning(
      `We filtered Zoho addresses for Zoho Contact ${zohoContactId}`,
    );
  }

  if (address.zohoAddress.length > 1) {
    logger.warn(
      "Multiple zohoAddresses set for the address of this order. Selecting one!",
    );
  }
  return filteredForContact.id;
}
