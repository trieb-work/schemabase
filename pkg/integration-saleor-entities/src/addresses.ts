import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { uniqueStringAddress } from "@eci/pkg/utils/uniqueStringAddress";
import { CountryCode, PrismaClient } from "@eci/pkg/prisma";
import { StandardAddressValuesFragment } from "@eci/pkg/saleor";

interface AddressesConfig {
    db: PrismaClient;
    eciOrderId?: string;
    tenantId: string;
    logger: ILogger;
    contactId: string;
}

class Addresses {
    private db: PrismaClient;

    private eciOrderId?: string;

    private tenantId: string;

    private logger: ILogger;

    /**
     * ECI internal contact Id -
     * addresses need to be related to a contact
     */
    private contactId: string;

    constructor(config: AddressesConfig) {
        this.db = config.db;
        this.eciOrderId = config.eciOrderId;
        this.tenantId = config.tenantId;
        this.logger = config.logger;
        this.contactId = config.contactId;
    }

    /**
     * function, that splits a general street with address field. Should be only used
     * for austria and germany right now
     * @param input
     */
    private splitStreetAndHouseNumber(input: string) {
        const street = input.substring(0, input.match(/[0-9]+/)?.index)?.trim();
        const inputMatch = input.match(/[0-9]+/)?.index;
        const housenumber = inputMatch ? input.substr(inputMatch) : "";

        return { street, housenumber };
    }

    private createObjectAndUniqueString(
        address: StandardAddressValuesFragment,
    ) {
        // TODO: check the country_code for validity. Just two letters or other
        const countryCodeValid = Object.values(CountryCode).includes(
            address.country.code as any,
        );

        if (!countryCodeValid)
            this.logger.error(
                `Received non valid country code: ${address.country.code}`,
            );

        const splitted = this.splitStreetAndHouseNumber(address.streetAddress1);
        /**
         * The address object
         * to use as the customer fullname. If not set, we construct
         * the name from the contactPersonDetails field
         */
        const addObj = {
            fullname: `${address.firstName} ${address.lastName}`,
            company: address.companyName,
            street: address.streetAddress1,
            additionalAddressLine: address.streetAddress2,
            plz: address.postalCode,
            city: address.city,
            countryCode: address.country.code as CountryCode,
            state: address.countryArea,
            houseNumber: splitted?.housenumber,
            streetWithoutHouseNumber: splitted?.street,
            phone: address.phone,
        };
        this.logger.debug("Constructed Address", addObj);
        const uniqueString = uniqueStringAddress(addObj);

        return { addObj, uniqueString };
    }

    /**
     * Sync Saleor Addresses with ECI DB and optionally connect them to an ECI order
     * @param shippingAddress
     * @param billingAddress
     *
     * This service is not scheduled but called by saleor order sync service instead
     */
    public async sync(
        shippingAddress: StandardAddressValuesFragment,
        billingAddress: StandardAddressValuesFragment,
    ) {
        const shippingAddr = this.createObjectAndUniqueString(shippingAddress);
        const billingAddr = this.createObjectAndUniqueString(billingAddress);

        if (this.eciOrderId) {
            this.logger.debug(
                `Syncing address with internal order id ${this.eciOrderId}`,
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
                        update: {
                            contact: {
                                connect: {
                                    id: this.contactId,
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
                                normalizedName: shippingAddr.uniqueString,
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
            });
        } else {
            this.logger.info(`Sycing address only without related order`);

            for (const addr of [shippingAddr, billingAddr]) {
                await this.db.address.upsert({
                    where: {
                        normalizedName_tenantId: {
                            normalizedName: addr.uniqueString,
                            tenantId: this.tenantId,
                        },
                    },
                    create: {
                        id: id.id("address"),
                        normalizedName: addr.uniqueString,
                        tenant: {
                            connect: {
                                id: this.tenantId,
                            },
                        },
                        ...addr.addObj,
                        contact: {
                            connect: {
                                id: this.contactId,
                            },
                        },
                    },
                    update: {
                        contact: {
                            connect: {
                                id: this.contactId,
                            },
                        },
                    },
                });
            }
        }
    }
}
const addresses = (
    db: PrismaClient,
    eciOrderId: string,
    tenantId: string,
    logger: ILogger,
    contactId: string,
) =>
    new Addresses({
        db,
        eciOrderId,
        tenantId,
        logger,
        contactId,
    });
export default addresses;
