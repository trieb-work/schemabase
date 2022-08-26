import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { uniqueStringAddress } from "@eci/pkg/miscHelper/uniqueStringAddress";
import { CountryCode, PrismaClient } from "@eci/pkg/prisma";
import { ContactPersonShortList } from "@trieb.work/zoho-ts";
import {
  Address,
  AddressWithoutAddressId,
} from "@trieb.work/zoho-ts/dist/types/address";

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

  private createECIObjectAndUniqueStringFromZohoAddress(
    address: AddressWithoutAddressId,
    customerName?: string,
  ) {
    // TODO: check the country_code for validity. Just two letters or other
    const countryCodeValid = Object.values(CountryCode).includes(
      address.country_code as any,
    );

    if (!countryCodeValid)
      this.logger.error(
        `Received non valid country code: ${address.country_code}`,
      );
    if (!(address.attention || customerName)) {
      throw new Error(
        `No attention and no customer name given! We need minimum one of it`,
      );
    }

    /**
     * The address object - we first try to use the Zoho "attention" field
     * to use as the customer fullname. If not set, we construct
     * the name from the contactPersonDetails field
     */
    const addObj = {
      fullname: address.attention || (customerName as string),
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

  // TODO:
  // Function, that works the other way around and creates a create address object
  // private createZohoAddressFromECI () {

  // }

  // Takes Zoho Addresses for a contact and sync them with the ECI DB
  public async eciContactAddAddresses(addresses: Address[]) {
    for (const zohoAddress of addresses) {
      const uniqueString =
        this.createECIObjectAndUniqueStringFromZohoAddress(zohoAddress);

      if (!zohoAddress.address_id) throw new Error(`Zoho Address ID missing. Can't sync`)
      
      await this.db.zohoa
    }
  }

  /**
   * Sync Zoho Addresses with ECI DB and connect them to an ECI order
   * @param shippingAddress
   * @param billingAddress
   * @param contactPersonDetails The customer name we use, if the attention field is not set.
   * @param customerName fallback customer name, if no attention and no contact person details exist
   */
  public async eciOrderAddAddresses(
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
    const shippingAddr = this.createECIObjectAndUniqueStringFromZohoAddress(
      shippingAddress,
      fullName,
    );
    const billingAddr = this.createECIObjectAndUniqueStringFromZohoAddress(
      billingAddress,
      fullName,
    );

    await this.db.order.update({
      where: {
        id: this.eciOrderId,
      },
      data: {
        billingAddress: {
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
              // TODO create zohoAddress
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
