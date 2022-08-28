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
  tenantId: string;
  zohoAppId: string;
  logger: ILogger;
  contactId: string;
}

class Addresses {
  private db: PrismaClient;

  private tenantId: string;

  private logger: ILogger;

  private zohoAppId: string;

  /**
   * ECI internal contact Id -
   * addresses need to be related to a contact
   */
  private contactId: string;

  constructor(config: AddressesConfig) {
    this.db = config.db;
    this.tenantId = config.tenantId;
    this.logger = config.logger;
    this.zohoAppId = config.zohoAppId;
    this.contactId = config.contactId;

    if (!config.contactId) throw new Error("No contactId! Can't sync address");
  }

  private createECIObjectAndUniqueStringFromZohoAddress(
    address: AddressWithoutAddressId,
    customerName?: string,
    companyName?: string,
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
      companyName,
      street: address.address,
      additionalAddressLine: address.street2,
      plz: address.zip,
      city: address.city,
      countryCode: countryCodeValid
        ? (address.country_code as CountryCode)
        : CountryCode.DE,
      normalizedName: "",
    };
    const uniqueString = uniqueStringAddress(addObj);
    addObj.normalizedName = uniqueString;

    return { addObj, uniqueString };
  }

  // TODO:
  // Function, that works the other way around and creates a create address object
  // private createZohoAddressFromECI() {
  //   const zohoAddr: AddressWithoutAddressId = {
  //     attention: "",
  //   };

  //   return zohoAddr;
  // }

  // Takes Zoho Addresses for a contact and sync them with the ECI DB
  public async eciContactAddAddresses(addresses: Address[]) {
    this.logger.info(
      `Upserting ${addresses.length} addresses for Zoho contact ${this.contactId}`,
    );
    for (const zohoAddress of addresses) {
      const addressObj =
        this.createECIObjectAndUniqueStringFromZohoAddress(zohoAddress);

      if (!zohoAddress.address_id)
        throw new Error(`Zoho Address ID missing. Can't sync`);

      await this.db.zohoAddress.upsert({
        where: {
          id_zohoAppId: {
            id: zohoAddress.address_id,
            zohoAppId: this.zohoAppId,
          },
        },
        create: {
          id: zohoAddress.address_id,
          zohoApp: {
            connect: {
              id: this.zohoAppId,
            },
          },
          address: {
            connectOrCreate: {
              where: {
                normalizedName_tenantId: {
                  normalizedName: addressObj.uniqueString,
                  tenantId: this.tenantId,
                },
              },
              create: {
                id: id.id("address"),
                ...addressObj.addObj,
                tenant: {
                  connect: {
                    id: this.tenantId,
                  },
                },
                contact: {
                  connect: {
                    id: this.contactId,
                  },
                },
              },
            },
          },
        },
        update: {
          address: {
            update: {
              ...addressObj.addObj,
            },
          },
        },
      });
    }
  }

  /**
   * Sync Zoho Addresses with ECI DB and connect them to an ECI order
   * @param shippingAddress
   * @param shippingAddressId
   * @param shippingAddressCompanyName
   * @param billingAddress
   * @param billingAddressId
   * @param billingAddressCompanyName
   * @param contactPersonDetails The customer name we use, if the attention field is not set.
   * @param customerName fallback customer name, if no attention and no contact person details exist
   * @param eciOrderId
   */
  public async eciOrderAddAddresses(
    shippingAddress: AddressWithoutAddressId,
    shippingAddressId: string,
    shippingAddressCompanyName: string | undefined,
    billingAddress: AddressWithoutAddressId,
    billingAddressId: string,
    billingAddressCompanyName: string | undefined,
    contactPersonDetails: ContactPersonShortList[],
    customerName: string,
    eciOrderId: string,
  ) {
    const contactPerson = contactPersonDetails?.[0];
    const fullName =
      contactPerson?.first_name && contactPerson?.last_name
        ? contactPerson.first_name + " " + contactPerson.last_name
        : customerName;
    const shippingAddr = this.createECIObjectAndUniqueStringFromZohoAddress(
      shippingAddress,
      fullName,
      shippingAddressCompanyName,
    );
    const billingAddr = this.createECIObjectAndUniqueStringFromZohoAddress(
      billingAddress,
      fullName,
      billingAddressCompanyName,
    );

    const tenant = {
      connect: {
        id: this.tenantId,
      },
    };

    await this.db.order.update({
      where: {
        id: eciOrderId,
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
              tenantId: this.tenantId,
              contactId: this.contactId,
              zohoAddress: {
                connectOrCreate: [
                  {
                    where: {
                      id_zohoAppId: {
                        id: billingAddressId,
                        zohoAppId: this.zohoAppId,
                      },
                    },
                    create: {
                      id: billingAddressId,
                      zohoAppId: this.zohoAppId,
                    },
                  },
                ],
              },
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
              tenant,
              contact: {
                connect: {
                  id: this.contactId,
                },
              },
              zohoAddress: {
                connectOrCreate: [
                  {
                    where: {
                      id_zohoAppId: {
                        id: shippingAddressId,
                        zohoAppId: this.zohoAppId,
                      },
                    },
                    create: {
                      id: shippingAddressId,
                      zohoAppId: this.zohoAppId,
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });
  }
}
const addresses = (
  db: PrismaClient,
  tenantId: string,
  zohoAppId: string,
  logger: ILogger,
  contactId: string,
) =>
  new Addresses({
    db,
    tenantId,
    zohoAppId,
    logger,
    contactId,
  });
export default addresses;
