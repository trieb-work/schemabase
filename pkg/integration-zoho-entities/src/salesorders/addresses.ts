import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { uniqueStringAddress } from "@eci/pkg/miscHelper/uniqueStringAddress";
import { CountryCode, PrismaClient } from "@eci/pkg/prisma";
import { ContactPersonShortList } from "@trieb.work/zoho-ts";
import { AddressWithoutAddressId } from "@trieb.work/zoho-ts/dist/types/address";

interface AddressesConfig {
  db: PrismaClient;
  eciOrderId: string;
  tenantId: string;
  logger: ILogger;
}

class Addresses {
  private db: PrismaClient;

  private eciOrderId: string;

  private tenantId: string;

  private logger: ILogger;

  constructor(config: AddressesConfig) {
    this.db = config.db;
    this.eciOrderId = config.eciOrderId;
    this.tenantId = config.tenantId;
    this.logger = config.logger;
  }

  private createObjectAndUniqueString(
    address: AddressWithoutAddressId,
    customerName: string,
  ) {
    // TODO: check the country_code for validity. Just two letters or other
    const countryCodeValid = Object.values(CountryCode).includes(
      address.country_code as any,
    );

    if (!countryCodeValid)
      this.logger.error(
        `Received non valid country code: ${address.country_code}`,
      );

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
      countryCode: countryCodeValid
        ? (address.country_code as CountryCode)
        : CountryCode.DE,
    };
    const uniqueString = uniqueStringAddress(addObj);

    return { addObj, uniqueString };
  }

  /**
   * Sync Zoho Addresses with ECI DB and connect them to an ECI order
   * @param shippingAddress
   * @param billingAddress
   * @param contactPersonDetails The customer name we use, if the attention field is not set.
   * @param customerName fallback customer name, if no attention and no contact person details exist
   */
  public async sync(
    shippingAddress: AddressWithoutAddressId,
    billingAddress: AddressWithoutAddressId,
    contactPersonDetails: ContactPersonShortList[],
    customerName: string,
  ) {
    const contactPerson = contactPersonDetails?.[0];
    const fullName =
      contactPerson?.first_name && contactPerson?.last_name
        ? contactPerson.first_name + " " + contactPerson.last_name
        : customerName;
    const shippingAddr = this.createObjectAndUniqueString(
      shippingAddress,
      fullName,
    );
    const billingAddr = this.createObjectAndUniqueString(
      billingAddress,
      fullName,
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
const addresses = (
  db: PrismaClient,
  eciOrderId: string,
  tenantId: string,
  logger: ILogger,
) =>
  new Addresses({
    db,
    eciOrderId,
    tenantId,
    logger,
  });
export default addresses;
