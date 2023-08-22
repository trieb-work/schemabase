import { CountryCode, KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { isSameHour, subHours, subYears } from "date-fns";
import { uniqueStringAddress } from "@eci/pkg/miscHelper/uniqueStringAddress";
import { id } from "@eci/pkg/ids";

interface KencoveApiAppAddressSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppAddressSyncService {
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  public readonly kencoveApiApp: KencoveApiApp;

  private readonly cronState: CronStateHandler;

  public constructor(config: KencoveApiAppAddressSyncServiceConfig) {
    this.logger = config.logger;
    this.db = config.db;
    this.kencoveApiApp = config.kencoveApiApp;
    this.cronState = new CronStateHandler({
      tenantId: this.kencoveApiApp.tenantId,
      appId: this.kencoveApiApp.id,
      db: this.db,
      syncEntity: "addresses",
    });
  }

  public async syncToECI() {
    const cronState = await this.cronState.get();
    const now = new Date();
    let createdGte: Date;
    if (!cronState.lastRun) {
      createdGte = subYears(now, 1);
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from: ${createdGte}`,
      );
    } else {
      // for security purposes, we sync one hour more than the last run
      createdGte = subHours(cronState.lastRun, 1);
      this.logger.info(`Setting GTE date to ${createdGte}.`);
    }

    const client = new KencoveApiClient(this.kencoveApiApp);
    const addresses = await client.getAddresses(createdGte);
    this.logger.info(`Found ${addresses.length} addresses to sync`);
    const existingAddresses = await this.db.kencoveApiAddress.findMany({
      where: {
        kencoveApiAppId: this.kencoveApiApp.id,
        id: {
          in: addresses.map((a) => a.id),
        },
      },
    });

    for (const address of addresses) {
      if (!address.street || !address.city || !address.fullname) {
        this.logger.warn(
          `Address ${address.id} has no street/city/fullname.\
           Skipping: ${JSON.stringify(address)}`,
        );
        continue;
      }
      const existingAddress = existingAddresses.find(
        (a) => a.id === address.id,
      );

      const createdAt = new Date(address.createdAt);
      const updatedAt = new Date(address.updatedAt);

      const normalizedName = uniqueStringAddress(address);

      const countryCodeValid = Object.values(CountryCode).includes(
        address.countryCode as any,
      );

      /**
       * Only update or create if the address does not exist or if the address
       * has been updated since the last sync
       */
      if (
        !existingAddress ||
        !isSameHour(existingAddress.updatedAt, createdAt)
      ) {
        const internalContact = await this.db.kencoveApiContact.findUnique({
          where: {
            id_kencoveApiAppId: {
              id: address.customerId,
              kencoveApiAppId: this.kencoveApiApp.id,
            },
          },
        });

        const internalAddress = await this.db.address.upsert({
          where: {
            normalizedName_tenantId: {
              normalizedName,
              tenantId: this.kencoveApiApp.tenantId,
            },
          },
          create: {
            id: id.id("address"),
            normalizedName,
            tenant: {
              connect: {
                id: this.kencoveApiApp.tenantId,
              },
            },
            street: address.street,
            additionalAddressLine: address.additionalAddressLine,
            plz: address.zip,
            city: address.city,
            countryCode: countryCodeValid
              ? (address.countryCode as CountryCode)
              : undefined,
            company: address.company,
            phone: address.phone,
            fullname: address.fullname,
            state: address.state,
            contact: internalContact
              ? { connect: { id: internalContact.contactId } }
              : {},
          },
          update: {},
        });

        await this.db.kencoveApiAddress.upsert({
          where: {
            id_kencoveApiAppId: {
              id: address.id,
              kencoveApiAppId: this.kencoveApiApp.id,
            },
          },
          create: {
            id: address.id,
            createdAt,
            updatedAt,
            kencoveApiAppId: this.kencoveApiApp.id,
            addressId: internalAddress.id,
          },
          update: {
            createdAt,
            updatedAt,
            addressId: internalAddress.id,
          },
        });
      }
    }
  }
}
