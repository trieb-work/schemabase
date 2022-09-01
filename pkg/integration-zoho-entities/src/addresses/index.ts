import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { uniqueStringAddress } from "@eci/pkg/miscHelper/uniqueStringAddress";
import {
  CountryCode,
  PrismaClient,
  Address as ECIAddress,
} from "@eci/pkg/prisma";
import { ContactPersonShortList } from "@trieb.work/zoho-ts";
import {
  Address,
  AddressWithoutAddressId,
  CreateAddress,
} from "@trieb.work/zoho-ts/dist/types/address";
import countries from "i18n-iso-countries";

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

  private companyToStreet2(companyName: string, street2?: string) {
    return this.escapeLine(companyName) + "\n" + this.escapeLine(street2 || "");
  }

  private unescapeLine(line: string) {
    return line.replace(",  ", "\n");
  }

  private escapeLine(line: string) {
    return line.replace(/, [ ]*/g, ", ").replace(/\n/g, ",  ");
  }

  /**
   * We save the company name in the street 2 field in Zoho.
   * This function returns the street2 and company name from a mixed street2 field
   * @param street2String
   */
  private companyFromStreet2(street2String: string): {
    street2?: string;
    company?: string;
  } {
    if (!street2String) return {};

    const splitted = street2String.split("\n");
    if (splitted.length === 1) return { street2: splitted[0] };

    const addressLine2 = splitted[1];
    return {
      company: this.unescapeLine(splitted[0]),
      street2: this.unescapeLine(addressLine2),
    };
  }

  /**
   * Bring the Zoho data to our internal data schema.
   * @param address The Zoho Address Object
   * @param customerName
   * @returns
   */
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
        `Received non valid country code: ${
          address.country_code
        } - address obj: ${JSON.stringify(address)}`,
      );
    if (!(address.attention || customerName)) {
      throw new Error(
        // eslint-disable-next-line max-len
        `No attention and no customer name given! We need minimum one of it. - address obj:${JSON.stringify(
          address,
        )}`,
      );
    }

    const { company, street2 } = this.companyFromStreet2(address.street2 || "");

    /**
     * The address object - we first try to use the Zoho "attention" field
     * to use as the customer fullname. If not set, we construct
     * the name from the contactPersonDetails field
     */
    const addObj = {
      fullname: address.attention || (customerName as string),
      company,
      street: address.address,
      additionalAddressLine: street2,
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

  /**
   * Create a valid Zoho address object from an ECI address object
   * @param eciAddr
   * @param orgLanguageCode the ISO language code we need to create the right country name
   * @returns
   */
  public createZohoAddressFromECI(
    eciAddr: ECIAddress,
    orgLanguageCode: "en" | "de",
  ) {
    const street2WithCompanyName = this.companyToStreet2(
      eciAddr.company || "",
      eciAddr.additionalAddressLine || "",
    );

    const country = countries.getName(eciAddr.countryCode, orgLanguageCode);
    if (!country)
      throw new Error(
        `Could not create valid country name. Can't sync address`,
      );

    const zohoAddr: CreateAddress = {
      attention: eciAddr.fullname,
      address: eciAddr.street,
      street2: street2WithCompanyName,
      city: eciAddr.city,
      zip: eciAddr.plz,
      country,
    };

    return zohoAddr;
  }

  // Takes Zoho Addresses for a contact and sync them with the ECI DB
  public async eciContactAddAddresses(
    addresses: Address[],
    customerName?: string,
  ) {
    this.logger.info(
      `Upserting ${addresses.length} addresses for Zoho contact ${this.contactId}`,
    );
    for (const zohoAddress of addresses) {
      const addressObj = this.createECIObjectAndUniqueStringFromZohoAddress(
        zohoAddress,
        customerName,
      );

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
   * @param billingAddress
   * @param billingAddressId
   * @param contactPersonDetails The customer name we use, if the attention field is not set.
   * @param customerName fallback customer name, if no attention and no contact person details exist
   * @param eciOrderId
   */
  public async eciOrderAddAddresses(
    shippingAddress: AddressWithoutAddressId,
    shippingAddressId: string,
    billingAddress: AddressWithoutAddressId,
    billingAddressId: string,
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
    );
    const billingAddr = this.createECIObjectAndUniqueStringFromZohoAddress(
      billingAddress,
      fullName,
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
