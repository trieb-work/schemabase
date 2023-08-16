// The KencoveApiPackageSyncService is responsible for syncing packages from the
// Odoo Kencove API to the ECI
import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import { Carrier, KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { KencoveApiClient } from "./client";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";

interface KencoveApiAppPackageSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppPackageSyncService {
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  public readonly kencoveApiApp: KencoveApiApp;

  private readonly cronState: CronStateHandler;

  public constructor(config: KencoveApiAppPackageSyncServiceConfig) {
    this.logger = config.logger;
    this.db = config.db;
    this.kencoveApiApp = config.kencoveApiApp;
    this.cronState = new CronStateHandler({
      tenantId: this.kencoveApiApp.tenantId,
      appId: this.kencoveApiApp.id,
      db: this.db,
      syncEntity: "packages",
    });
  }

  /**
   * Match the carrier names coming from kencove to our generic internal ones.
   */
  private matchCarrier(carrier: string): Carrier {
    const carrierLower = carrier.toLowerCase();
    if (carrierLower.includes("ups")) {
      return Carrier.UPS;
    }
    if (carrierLower.includes("fedex")) {
      return Carrier.FEDEX;
    }
    if (carrierLower.includes("usps")) {
      return Carrier.USPS;
    }
    if (carrierLower.includes("dhl")) {
      return Carrier.DHL;
    }

    return Carrier.UNKNOWN;
  }

  /**
   * Transform the package line items: we use the "itemCode" of the "packageItemline" from the API
   * and match it with our internal SKUs. We return PackageLineItem
   */

  public async syncToEci() {
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
    const packages = await client.getPackages(createdGte);
    this.logger.info(`Found ${packages.length} packages to sync.`);

    for (const pkg of packages) {
      // we are using the pkg.packageName as the unique identifier for packages.
      // we work with a upsert command directly.
      if (!pkg.carrierName) {
        this.logger.error(`Package ${pkg.packageName} has no carrier name.`);
        continue;
      }
      const carrier = this.matchCarrier(pkg.carrierName);

      // TEMP: when the trackingNumber is a string like: "1Z2632010391767531+1Z2632010394224148"
      // or "1Z2632010391767531,1Z2632010394224148"
      // we have a multi piece shipment, that is currently not supported by the ERP.
      // In that case, we don't write the tracking number to the package
      let trackingId: string | undefined = pkg.trackingNumber;
      if (
        pkg.trackingNumber.includes("+") ||
        pkg.trackingNumber.includes(",")
      ) {
        this.logger.warn(
          // eslint-disable-next-line max-len
          `Package ${pkg.packageName} has a multi piece shipment. We don't write the tracking number to the package.`,
        );
        trackingId = undefined;
      }

      const createdAt = new Date(pkg.createdAt);
      const updatedAt = new Date(pkg.updatedAt);

      await this.db.kencoveApiPackage.upsert({
        where: {
          id_kencoveApiAppId: {
            id: pkg.packageId,
            kencoveApiAppId: this.kencoveApiApp.id,
          },
        },
        create: {
          id: pkg.packageId,
          createdAt,
          updatedAt,
          kencoveApiApp: {
            connect: {
              id: this.kencoveApiApp.id,
            },
          },
          package: {
            connectOrCreate: {
              where: {
                number_tenantId: {
                  number: pkg.packageName,
                  tenantId: this.kencoveApiApp.tenantId,
                },
              },
              create: {
                id: id.id("package"),
                number: pkg.packageName,
                trackingId,
                carrierTrackingUrl: trackingId ? pkg.trackingUrl : undefined,
                tenant: {
                  connect: {
                    id: this.kencoveApiApp.tenantId,
                  },
                },
                carrier,
                packageLineItems: {
                  create: pkg.packageItemline.map((item, index) => ({
                    id: id.id("packageLineItem"),
                    uniqueString: uniqueStringOrderLine(
                      pkg.salesOrderNo,
                      item.itemCode,
                      item.quantity,
                      index,
                    ),
                    quantity: item.quantity,
                    tenant: {
                      connect: {
                        id: this.kencoveApiApp.tenantId,
                      },
                    },
                    productVariant: {
                      connect: {
                        sku_tenantId: {
                          sku: item.itemCode,
                          tenantId: this.kencoveApiApp.tenantId,
                        },
                      },
                    },
                  })),
                },
              },
            },
          },
        },
        update: {
          createdAt,
          updatedAt,
          package: {
            update: {
              trackingId,
              carrierTrackingUrl: trackingId ? pkg.trackingUrl : undefined,
            },
          },
        },
      });
    }
  }
}
