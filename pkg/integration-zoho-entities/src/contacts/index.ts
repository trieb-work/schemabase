/* eslint-disable max-len */
import { Zoho, Address } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { DatevApp, Prisma, PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subMonths, subYears } from "date-fns";
import { normalizeStrings } from "@eci/pkg/normalization";
import { sleep } from "@eci/pkg/utils/time";
import addresses from "../addresses";
import contactPersonSync from "./contactpersons";

export interface ZohoContactSyncConfig {
    logger: ILogger;
    zoho: Zoho;
    db: PrismaClient;
    zohoApp: ZohoApp;
    datevApp?: DatevApp;
}

export class ZohoContactSyncService {
    private readonly logger: ILogger;

    private readonly zoho: Zoho;

    private readonly db: PrismaClient;

    private readonly zohoApp: ZohoApp;

    private readonly datevApp: DatevApp | undefined;

    private readonly cronState: CronStateHandler;

    public constructor(config: ZohoContactSyncConfig) {
        this.logger = config.logger;
        this.zoho = config.zoho;
        this.db = config.db;
        this.zohoApp = config.zohoApp;
        this.datevApp = config.datevApp;
        this.cronState = new CronStateHandler({
            tenantId: this.zohoApp.tenantId,
            appId: this.zohoApp.id,
            db: this.db,
            syncEntity: "contacts",
        });
    }

    public async syncToECI(): Promise<void> {
        const tenantId = this.zohoApp.tenantId;

        const cronState = await this.cronState.get();

        const now = new Date();
        const nowMinusthreeHours = subHours(now, 1);
        let gteDate = nowMinusthreeHours;

        if (cronState.lastRun === null) {
            this.logger.info(
                "This seems to be our first sync run. Upserting ALL contacts",
            );
            gteDate = subYears(now, 2);
        } else {
            this.logger.info(`Setting GTE date to ${gteDate}`);
        }

        const contacts = await this.zoho.contact.list({
            lastModifiedTime: gteDate,
        });

        this.logger.info(
            `We have ${contacts.length} contacts that changed since last sync run.`,
            {
                zohoContactIds:
                    contacts.length > 0
                        ? contacts.map((c) => c.contact_id)
                        : undefined,
            },
        );
        if (contacts.length === 0) {
            await this.cronState.set({
                lastRun: new Date(),
                lastRunStatus: "success",
            });
            return;
        }

        try {
            for (const contact of contacts) {
                if (!contact.email) {
                    this.logger.warn(
                        // eslint-disable-next-line max-len
                        `Contact ${contact.contact_name}, Id ${contact.contact_id} has no email address - skipping sync`,
                    );
                    continue;
                }

                const isVendor = (contact.contact_type as any) === "vendor";
                const isCustomer = contact.contact_type === "customer";

                this.logger.info(
                    `Upserting Zoho contact ${contact.contact_id}`,
                );
                const email = contact.email.toLowerCase();
                const companyName = contact?.company_name;

                // Only create a company if the contact is marked as "business" in Zoho
                const companyCreate: Prisma.CompanyCreateNestedOneWithoutContactsInput =
                    contact.customer_sub_type === "business" && companyName
                        ? {
                              connectOrCreate: {
                                  where: {
                                      normalizedName_tenantId: {
                                          tenantId,
                                          normalizedName:
                                              normalizeStrings.companyNames(
                                                  companyName,
                                              ),
                                      },
                                  },
                                  create: {
                                      id: id.id("company"),
                                      name: companyName,
                                      normalizedName:
                                          normalizeStrings.companyNames(
                                              companyName,
                                          ),
                                      tenantId,
                                  },
                              },
                          }
                        : {};

                await this.db.zohoContact.upsert({
                    where: {
                        id_zohoAppId: {
                            zohoAppId: this.zohoApp.id,
                            id: contact.contact_id,
                        },
                    },
                    create: {
                        id: contact.contact_id,
                        createdAt: new Date(contact.created_time),
                        updatedAt: new Date(contact.last_modified_time),
                        zohoApp: {
                            connect: {
                                id: this.zohoApp.id,
                            },
                        },
                    },
                    update: {
                        createdAt: new Date(contact.created_time),
                        updatedAt: new Date(contact.last_modified_time),
                    },
                });

                const eciContact = await this.db.contact.upsert({
                    where: {
                        email_tenantId: {
                            tenantId,
                            email,
                        },
                    },
                    update: {
                        company: companyCreate,
                        email,
                        vendor: isVendor,
                        customer: isCustomer,
                    },
                    create: {
                        id: id.id("contact"),
                        company: companyCreate,
                        email,
                        firstName: contact?.first_name,
                        lastName: contact?.last_name,
                        vendor: isVendor,
                        customer: isCustomer,
                        tenant: {
                            connect: {
                                id: tenantId,
                            },
                        },
                    },
                });

                const contactId = contact.contact_id;

                // get the full contact, including contact persons and addresses
                const fullContact = await this.zoho.contact.get(contactId);
                if (!fullContact) {
                    this.logger.error(
                        `No Zoho contact returned for ${contactId}!`,
                    );
                    continue;
                }
                const contactPersons = fullContact?.contact_persons;

                const contactActive = fullContact?.status === "active";

                // Start the contact person logic
                const totalLength = contactPersons?.length;
                if (totalLength && totalLength > 0) {
                    await contactPersonSync(
                        this.db,
                        this.zohoApp.tenantId,
                        this.zohoApp.id,
                        contactId,
                        this.logger,
                    ).syncWithECI(contactPersons, contactActive);
                }

                const addressArray: Address[] = fullContact?.addresses || [];
                if (fullContact?.billing_address)
                    addressArray.push(fullContact.billing_address);
                if (fullContact?.shipping_address)
                    addressArray.push(fullContact.shipping_address);

                if (addressArray?.length > 0 && contactActive) {
                    try {
                        await addresses(
                            this.db,
                            this.zohoApp.tenantId,
                            this.zohoApp.id,
                            this.logger,
                            eciContact.id,
                        ).eciContactAddAddresses(
                            addressArray,
                            fullContact?.contact_id,
                            fullContact?.contact_name,
                        );
                    } catch (error) {
                        this.logger.error(error as any);
                        continue;
                    }
                } else {
                    this.logger.info(
                        // eslint-disable-next-line max-len
                        `Contact ${eciContact.id} - Zoho Contact ${contact.contact_id} has no related addresses to update`,
                    );
                }

                // We sleep here to not get blocked by Zoho
                await sleep(1500);
            }
        } catch (error) {
            this.logger.error((error as any).toString());
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }

    public async syncFromECI(): Promise<void> {
        const newContacts = await this.db.contact.findMany({
            where: {
                tenantId: this.zohoApp.tenantId,
                zohoContactPersons: {
                    none: {
                        zohoAppId: this.zohoApp.id,
                    },
                },
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                addresses: true,
                company: true,
                companyId: true,
            },
        });

        this.logger.info(
            `We have ${newContacts.length} contacts that we need to create in Zoho`,
        );

        for (const newContact of newContacts) {
            if (newContact.firstName == null || newContact.lastName == null) {
                this.logger.error(
                    `First and Last Name not set for contact ${newContact.id}, ${newContact.email} - They are mandatory for Zoho`,
                );
                continue;
            }

            /**
             * Always just chosing the first address to at least have one default address
             */
            const defaultAddress =
                newContact.addresses.length > 0
                    ? newContact.addresses[0]
                    : undefined;

            /**
             * All addresses, apart from the default one
             */
            const remainingAddresses = newContact.addresses.filter(
                (a) => a.id !== defaultAddress?.id,
            );
            const defaultZohoAddr = defaultAddress
                ? addresses(
                      this.db,
                      this.zohoApp.tenantId,
                      this.zohoApp.id,
                      this.logger,
                      "NOTNEEDED",
                  ).createZohoAddressFromECI(
                      defaultAddress,
                      this.zohoApp.orgLanguage.toLowerCase(),
                  )
                : undefined;

            this.logger.info(
                `Creating Zoho Contact now for ECI id ${newContact.id}`,
            );
            const contactCreateObject = {
                contact_name: `${newContact.firstName} ${newContact.lastName}`,
                customer_sub_type: newContact?.companyId
                    ? "business"
                    : ("individual" as "business" | "individual"),
                company_name: newContact.company?.name,
                shipping_address: defaultZohoAddr,
                billing_address: defaultZohoAddr,
                contact_persons: [
                    {
                        first_name: newContact.firstName,
                        last_name: newContact.lastName,
                        email: newContact.email,
                    },
                ],
            };
            this.logger.debug(`Sending this object`, contactCreateObject);
            const zohoContact =
                await this.zoho.contact.create(contactCreateObject);

            await this.db.contact.update({
                where: {
                    id: newContact.id,
                },
                data: {
                    zohoContactPersons: {
                        create: {
                            id: zohoContact.contact_persons[0]
                                .contact_person_id,
                            isPrimary: true,
                            active: true,
                            zohoApp: {
                                connect: {
                                    id: this.zohoApp.id,
                                },
                            },
                            zohoContact: {
                                create: {
                                    id: zohoContact.contact_id,
                                    zohoApp: {
                                        connect: {
                                            id: this.zohoApp.id,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            await sleep(1000);
            for (const addr of remainingAddresses) {
                const zohoAddrObj = addresses(
                    this.db,
                    this.zohoApp.tenantId,
                    this.zohoApp.id,
                    this.logger,
                    zohoContact.contact_id,
                ).createZohoAddressFromECI(
                    addr,
                    this.zohoApp.orgLanguage.toLowerCase(),
                );

                this.logger.debug(
                    `Sending this address update for contact ${zohoContact.contact_id}`,
                    zohoAddrObj,
                );
                const zohoAddr = await this.zoho.contact.addAddress(
                    zohoContact.contact_id,
                    zohoAddrObj,
                );
                await this.db.address.update({
                    where: {
                        id: addr.id,
                    },
                    data: {
                        zohoAddress: {
                            create: {
                                id: zohoAddr,
                                zohoContact: {
                                    connect: {
                                        id_zohoAppId: {
                                            id: zohoContact.contact_id,
                                            zohoAppId: this.zohoApp.id,
                                        },
                                    },
                                },
                                zohoApp: {
                                    connect: {
                                        id: this.zohoApp.id,
                                    },
                                },
                            },
                        },
                    },
                });
            }

            if (defaultAddress) {
                this.logger.info(
                    `Upserting now Zoho Shipping and Billing address Id for newly created Zoho contact ${zohoContact.contact_id}`,
                );
                await this.db.zohoAddress.createMany({
                    data: [
                        {
                            id: zohoContact.billing_address.address_id,
                            addressId: defaultAddress.id,
                            zohoContactId: zohoContact.contact_id,
                            zohoAppId: this.zohoApp.id,
                        },
                        {
                            id: zohoContact.shipping_address.address_id,
                            addressId: defaultAddress.id,
                            zohoContactId: zohoContact.contact_id,
                            zohoAppId: this.zohoApp.id,
                        },
                    ],
                });
            }
        }
        /**
         * These are just addresses, that do not exist yet.
         * We need to improve that to see, if a zoho address does exist, but needs
         * to be created again but for a different contact
         */
        const newAddresses = await this.db.address.findMany({
            where: {
                tenantId: this.zohoApp.tenantId,
                zohoAddress: {
                    none: {
                        zohoAppId: this.zohoApp.id,
                    },
                },
                updatedAt: {
                    gte: subMonths(new Date(), 5),
                },
            },
            include: {
                contact: {
                    select: {
                        id: true,
                        zohoContactPersons: {
                            where: {
                                zohoAppId: this.zohoApp.id,
                            },
                            select: {
                                zohoContactId: true,
                            },
                        },
                    },
                },
            },
        });
        this.logger.info(
            `We have ${newAddresses.length} addresses that need to be synced with Zoho`,
        );

        // TODO: Problem: one address internally might belong to multiple Zoho contacts. Like this, we just know,
        // if the address is connected to one Zoho Tenant or not. We might need to filter for zoho contacts as well ?! don't know..
        for (const newAddress of newAddresses) {
            if (newAddress.contact.length === 0) {
                this.logger.info(
                    `No related contact for address ${newAddress.id}. Can't sync`,
                );
                continue;
            }
            for (const contact of newAddress.contact) {
                if (contact.zohoContactPersons.length === 0) {
                    this.logger.info(
                        `No Zoho contact person for address ${newAddress.id} - contact ${contact.id}`,
                    );
                    continue;
                }
                /**
                 * Using only unique zoho contacts
                 */
                const uniqueZohoContacts = [
                    ...new Set(contact.zohoContactPersons),
                ].map((c) => c.zohoContactId);

                for (const zohoContact of uniqueZohoContacts) {
                    this.logger.info(
                        `Creating address ${newAddress.id} for Zoho Contact ${zohoContact} `,
                    );
                    const zohoAddrObj = addresses(
                        this.db,
                        this.zohoApp.tenantId,
                        this.zohoApp.id,
                        this.logger,
                        zohoContact,
                    ).createZohoAddressFromECI(
                        newAddress,
                        this.zohoApp.orgLanguage.toLowerCase(),
                    );

                    const zohoAddr = await this.zoho.contact.addAddress(
                        zohoContact,
                        zohoAddrObj,
                    );
                    await this.db.address.update({
                        where: {
                            id: newAddress.id,
                        },
                        data: {
                            zohoAddress: {
                                create: {
                                    id: zohoAddr,
                                    zohoContact: {
                                        connect: {
                                            id_zohoAppId: {
                                                id: zohoContact,
                                                zohoAppId: this.zohoApp.id,
                                            },
                                        },
                                    },
                                    zohoApp: {
                                        connect: {
                                            id: this.zohoApp.id,
                                        },
                                    },
                                },
                            },
                        },
                    });
                }
            }
        }

        if (this.datevApp && this.zohoApp.customFieldDatevCustomerId) {
            const datevUpdates = await this.db.zohoContact.findMany({
                where: {
                    zohoAppId: this.zohoApp.id,
                    datevId: null,
                },
                select: {
                    id: true,
                    zohoContactPerson: {
                        select: {
                            contact: {
                                select: {
                                    datevContacts: true,
                                },
                            },
                        },
                    },
                },
            });

            this.logger.info(
                `DATEV integration active and ${datevUpdates.length} Zoho contacts need to be updated with a DATEV customer id`,
            );
            for (const dContact of datevUpdates) {
                const datevNummer =
                    dContact.zohoContactPerson?.[0]?.contact?.datevContacts?.[0]
                        ?.datevNummer;
                if (datevNummer) {
                    this.logger.info(
                        `Updating Zoho Contact ${dContact.id} with Datev Nummer ${datevNummer}`,
                    );
                    try {
                        const res = await this.zoho.contact.update({
                            contact_id: dContact.id,
                            custom_fields: [
                                {
                                    api_name:
                                        this.zohoApp.customFieldDatevCustomerId,
                                    value: datevNummer,
                                },
                            ],
                        });

                        if (
                            (res as any)?.[
                                this.zohoApp.customFieldDatevCustomerId
                            ].toString() === datevNummer.toString()
                        ) {
                            // Updating the just updated DatevID in our DB
                            await this.db.zohoContact.update({
                                where: {
                                    id_zohoAppId: {
                                        id: dContact.id,
                                        zohoAppId: this.zohoApp.id,
                                    },
                                },
                                data: {
                                    datevId: datevNummer,
                                },
                            });
                        }
                    } catch (error) {
                        this.logger.error(
                            `Error updating user with datev id: ${error}`,
                        );
                    }

                    // ZOHO API limits
                    await sleep(1100);
                }
            }
        }
    }
}
