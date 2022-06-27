import { Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
// import { id } from "@eci/pkg/ids";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { uniqueStringPackageLineItem } from "@eci/pkg/miscHelper/uniqueStringOrderline";

export interface ZohoPackageSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoApp;
}

export class ZohoPackageSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoApp;

  private readonly cronState: CronStateHandler;

  public constructor(config: ZohoPackageSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
    this.cronState = new CronStateHandler({
      tenantId: this.zohoApp.tenantId,
      appId: this.zohoApp.id,
      db: this.db,
      syncEntity: "packages",
    });
  }

  public async syncToECI(): Promise<void> {
    // const tenantId = this.zohoApp.tenantId;

    const cronState = await this.cronState.get();

    const now = new Date();
    const yesterdayMidnight = setHours(subDays(now, 1), 0);
    let gteDate = format(yesterdayMidnight, "yyyy-MM-dd");

    if (cronState.lastRun === null) {
      gteDate = format(subYears(now, 1), "yyyy-MM-dd");
      this.logger.info(
        `This seems to be our first sync run. Setting GTE date to ${gteDate}`,
      );
    } else {
      this.logger.info(`Setting GTE date to ${gteDate}`);
    }

    const packages = await this.zoho.package.list({
      createdDateStart: gteDate,
    });

    this.logger.info(
      `We have ${packages.length} packages that we need to sync.`,
    );
    if (packages.length === 0) {
      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
      return;
    }

    for (const parcel of packages) {
      const orderExist = await this.db.order.findUnique({
        where: {
          orderNumber_tenantId: {
            orderNumber: parcel.salesorder_number,
            tenantId: this.zohoApp.tenantId,
          },
        },
      });
      if (!orderExist?.id) {
        this.logger.info(
          // eslint-disable-next-line max-len
          `Order ${parcel.salesorder_number} not found. Can't create zoho package ${parcel.package_id}`,
        );
        continue;
      }

      this.logger.info(
        `Upserting Zoho Package ${parcel.package_id} - ${parcel.package_number}`,
      );
      const lowerCaseCarrier =
        parcel.delivery_method?.toLowerCase() ||
        parcel.carrier?.toLowerCase() ||
        "";
      const carrier = lowerCaseCarrier.includes("dhl")
        ? "DHL"
        : lowerCaseCarrier.includes("dpd")
        ? "DPD"
        : lowerCaseCarrier.includes("ups")
        ? "UPS"
        : "UNKNOWN";

      /**
       * Only try to update the tracking number if we have one..
       */
      const packageUpdate = parcel.tracking_number
        ? {
            trackingId: parcel.tracking_number,
          }
        : {};

      /**
       * The already existing package - if there. We need the data to decide,
       * if we need to pull the full line items from zoho or not
       */
      const packageBefore = await this.db.zohoPackage.findFirst({
        where: {
          id: parcel.package_id,
          zohoAppId: this.zohoApp.id,
        },
        select: {
          updatedAt: true,
        },
      });

      /**
       * The package entity that we just upserted
       */
      const currentPackage = await this.db.zohoPackage.upsert({
        where: {
          id_zohoAppId: {
            id: parcel.package_id,
            zohoAppId: this.zohoApp.id,
          },
        },
        create: {
          id: parcel.package_id,
          createdAt: new Date(parcel.date),
          updatedAt: new Date(parcel.last_modified_time),
          package: {
            connectOrCreate: {
              where: {
                number_tenantId: {
                  number: parcel.package_number,
                  tenantId: this.zohoApp.tenantId,
                },
              },
              create: {
                id: id.id("package"),
                number: parcel.package_number,
                trackingId: parcel.tracking_number,
                tenant: {
                  connect: {
                    id: this.zohoApp.tenantId,
                  },
                },
                carrier,
                order: {
                  connect: {
                    id: orderExist.id,
                  },
                },
              },
            },
          },
          zohoApp: {
            connect: {
              id: this.zohoApp.id,
            },
          },
        },
        update: {
          createdAt: new Date(parcel.date),
          updatedAt: new Date(parcel.last_modified_time),
          package: {
            update: packageUpdate,
          },
        },
      });

      // only pull the full package data if something has changed since the last run
      if (
        !packageBefore ||
        packageBefore.updatedAt.toISOString() !==
          currentPackage.updatedAt.toISOString()
      ) {
        this.logger.info(
          `Pulling full package data for ${parcel.package_id} - ${
            parcel.package_number
            // eslint-disable-next-line max-len
          }. Updated at in DB: ${
            packageBefore?.updatedAt.toISOString() || "NOT EXISTING"
          }. Updated at from Zoho: ${currentPackage.updatedAt.toISOString()}`,
        );

        /**
         * Full package data pulled from Zoho
         */
        const fullPackage = await this.zoho.package.get(parcel.package_id);

        if (!fullPackage?.line_items) {
          this.logger.error(
            `No line_items returned for Zoho package ${parcel.package_id}!`,
          );
          continue;
        }

        for (const lineItem of fullPackage.line_items) {
          const uniqueString = uniqueStringPackageLineItem(
            parcel.package_number,
            lineItem.sku,
            lineItem.quantity,
          );

          const upsertedLineItem = await this.db.lineItem.upsert({
            where: {
              uniqueString_tenantId: {
                uniqueString,
                tenantId: this.zohoApp.tenantId,
              },
            },
            create: {
              id: id.id("lineItem"),
              uniqueString,
              quantity: lineItem.quantity,
              productVariant: {
                connect: {
                  sku_tenantId: {
                    sku: lineItem.sku,
                    tenantId: this.zohoApp.tenantId,
                  },
                },
              },
              order: {
                connect: {
                  id: orderExist.id,
                },
              },
              package: {
                connect: {
                  id: currentPackage.packageId,
                },
              },
              tenant: {
                connect: {
                  id: this.zohoApp.tenantId,
                },
              },
            },
            update: {
              quantity: lineItem.quantity,
              productVariant: {
                connect: {
                  sku_tenantId: {
                    sku: lineItem.sku,
                    tenantId: this.zohoApp.tenantId,
                  },
                },
              },
            },
          });
          this.logger.info(
            `Upserted line_item ${upsertedLineItem.id} for package ${parcel.package_number}`,
          );
        }
      }
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
