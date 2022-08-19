import { id } from "@eci/pkg/ids";
import { uniqueStringAddress } from "@eci/pkg/miscHelper/uniqueStringAddress";
import { CountryCode, PrismaClient } from "@eci/pkg/prisma";
import { ContactPersonShortList } from "@trieb.work/zoho-ts";
import { AddressWithoutAddressId } from "@trieb.work/zoho-ts/dist/types/address";

interface AddressesConfig {
  db: PrismaClient;
  eciOrderId: string;
  tenantId: string;
}

class Addresses {
  private db: PrismaClient;

  private eciOrderId: string;

  private tenantId: string;

  constructor(config: AddressesConfig) {
    this.db = config.db;
    this.eciOrderId = config.eciOrderId;
    this.tenantId = config.tenantId;
  }

  private createObjectAndUniqueString(
    address: AddressWithoutAddressId,
    customerName: string,
  ) {
    /**
     * The address object - we first try to use the Zoho "attention" field
     * to use as the customer fullname. If not set, we construct
     * the name from the contactPersonDetails field
     */
    const addObj = {
      fullname: address.attention || customerName,
      street: address.address,
      additionalAddressLine: address.street2,
      plz: address.zip,
      city: address.city,
      countryCode: address.country_code as CountryCode,
    };
    const uniqueString = uniqueStringAddress(addObj);

    return { addObj, uniqueString };
  }

  /**
   * Sync Zoho Addresses with ECI DB and connect them to an ECI order
   * @param shippingAddress
   * @param billingAddress
   * @param contactPersonDetails The customer name we use, if the attention field is not set.
   */
  public async sync(
    shippingAddress: AddressWithoutAddressId,
    billingAddress: AddressWithoutAddressId,
    contactPersonDetails: ContactPersonShortList[],
  ) {
    const customerName =
      contactPersonDetails[0].first_name +
      " " +
      contactPersonDetails[0].last_name;
    const shippingAddr = this.createObjectAndUniqueString(
      shippingAddress,
      customerName,
    );
    const billingAddr = this.createObjectAndUniqueString(
      billingAddress,
      customerName,
    );

    await this.db.order.update({
      where: {
        id: this.eciOrderId,
      },
      data: {
        invoiceAddress: {
          connectOrCreate: {
            where: {
              normalizedName_tenantId: {
                normalizedName: billingAddr.uniqueString,
                tenantId: this.tenantId,
              },
            },
            create: {
              id: id.id("address"),
              ...billingAddr.addObj,
              normalizedName: billingAddr.uniqueString,
              tenantId: this.tenantId,
            },
          },
        },
        shippingAddress: {
          connectOrCreate: {
            where: {
              normalizedName_tenantId: {
                normalizedName: shippingAddr.uniqueString,
                tenantId: this.tenantId,
              },
            },
            create: {
              id: id.id("address"),
              ...shippingAddr.addObj,
              normalizedName: shippingAddr.uniqueString,
              tenantId: this.tenantId,
            },
          },
        },
      },
    });
  }
}
const addresses = (db: PrismaClient, eciOrderId: string, tenantId: string) =>
  new Addresses({
    db,
    eciOrderId,
    tenantId,
  });
export default addresses;
