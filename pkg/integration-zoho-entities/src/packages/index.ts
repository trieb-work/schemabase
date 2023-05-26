import { Zoho, ZohoApiError } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { Carrier, PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import {
  format,
  isAfter,
  setHours,
  subDays,
  subMonths,
  subYears,
  isEqual,
} from "date-fns";
import { id } from "@eci/pkg/ids";
import { uniqueStringPackageLineItem } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { generateTrackingPortalURL } from "@eci/pkg/integration-tracking";
import { packageToZohoLineItems } from "./lineItems";
import { sleep } from "@eci/pkg/miscHelper/time";

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

  private carrierToAftership(carrier: Carrier) {
    switch (carrier) {
      case "DHL":
        return "dhl";
      case "DPD":
        return "dpd";
      case "UPS":
        return "ups";
      default:
        return "";
    }
  }

  public async syncToECI(): Promise<void> {
    const cronState = await this.cronState.get();

    const now = new Date();
    const nowMinus20Days = setHours(subDays(now, 20), 0);
    let gteDate = format(nowMinus20Days, "yyyy-MM-dd");

    if (cronState.lastRun === null) {
      gteDate = format(subYears(now, 2), "yyyy-MM-dd");
      this.logger.info(
        `This seems to be our first sync run. Setting GTE date to ${gteDate}`,
      );
    } else {
      this.logger.info(`Setting GTE date for package creation to ${gteDate}`);
    }

    /**
     * Packages can't be filtered by "last modified time". We have to
     * try and do it like this, but its not nice.. We limit to 200 and always
     * just get the last 200 packages, that got updated last
     */
    const packages = await this.zoho.package.list({
      sortColumn: "last_modified_time",
      sortOrder: "descending",
      limit: 200,
    });

    this.logger.info(
      `We have ${packages.length} packages that we compare now with our internal DB.`,
    );
    if (packages.length === 0) {
      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
      return;
    }

    const currentPackagesInDB = await this.db.zohoPackage.findMany({
      where: {
        id: {
          in: packages.map((p) => p.package_id),
        },
      },
    });

    for (const parcel of packages) {
      const currentPackageInDB = currentPackagesInDB.find(
        (p) => p.id === parcel.package_id,
      );
      if (
        currentPackageInDB &&
        isEqual(
          currentPackageInDB.updatedAt,
          new Date(parcel.last_modified_time),
        )
      )
        continue;
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
        ? Carrier.DHL
        : lowerCaseCarrier.includes("dpd")
        ? Carrier.DPD
        : lowerCaseCarrier.includes("ups")
        ? Carrier.UPS
        : Carrier.UNKNOWN;

      if (carrier === Carrier.UNKNOWN)
        this.logger.warn(
          `Can't match the packages carrier "${lowerCaseCarrier}" to our internal carriers.`,
        );

      const carrierTrackingUrl = generateTrackingPortalURL(
        carrier,
        orderExist.language,
        parcel.tracking_number,
      );
      /**
       * Only try to update the tracking number if we have one..
       */
      const packageUpdate = parcel.tracking_number
        ? {
            trackingId: parcel.tracking_number,
            carrier,
            carrierTrackingUrl,
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
          package: {
            select: {
              packageLineItems: {
                select: {
                  _count: true,
                },
              },
            },
          },
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
          shipmentId: parcel.shipment_id || null,
          shipmentStatus: parcel.status,
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
                state: parcel.tracking_number ? "INFORMATION_RECEIVED" : "INIT",
                carrierTrackingUrl,
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
          shipmentId: parcel.shipment_id || null,
          shipmentStatus: parcel.status,
          package: {
            update: packageUpdate,
          },
        },
      });

      // only pull the full package data if something has changed since the last run
      // We compare the packageData we got before with the one we got after the update
      // We also pull the full package data if the package has no line items
      if (
        !packageBefore ||
        isAfter(currentPackage.updatedAt, packageBefore.updatedAt) ||
        packageBefore.package.packageLineItems.length === 0
      ) {
        this.logger.info(
          `Pulling full package data for ${parcel.package_id} - ${
            parcel.package_number
            // eslint-disable-next-line max-len
          }. "UpdatedAt" in DB: ${
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

        /**
         * All Zoho Warehouses for this Zoho App
         */
        const zohoWarehouses = await this.db.zohoWarehouse.findMany({
          where: {
            zohoAppId: this.zohoApp.id,
          },
        });

        for (const lineItem of fullPackage.line_items) {
          const uniqueString = uniqueStringPackageLineItem(
            parcel.package_number,
            lineItem.sku,
            lineItem.quantity,
            lineItem.item_order,
          );

          if (!lineItem.warehouse_id) {
            this.logger.warn(
              // eslint-disable-next-line max-len
              `No warehouseId given for line_item ${lineItem.line_item_id} - ${uniqueString}. This article has most probably inventory tracking disabled. This might be a problem for other systems`,
            );
          }

          const warehouseId = zohoWarehouses.find(
            (x) => x.id === lineItem?.warehouse_id,
          )?.warehouseId;

          if (!warehouseId) {
            this.logger.warn(
              // eslint-disable-next-line max-len
              `Can't find the Zoho Warehouse with id ${lineItem.warehouse_id} internally! Can't connect this line item ${uniqueString} with a warehouse`,
            );
          }

          const warehouseConnect = warehouseId
            ? {
                connect: {
                  id: warehouseId,
                },
              }
            : {};

          const upsertedLineItem = await this.db.packageLineItem.upsert({
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
              warehouse: warehouseConnect,
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
              warehouse: warehouseConnect,
              package: {
                connect: {
                  id: currentPackage.packageId,
                },
              },
            },
          });
          this.logger.info(
            // eslint-disable-next-line max-len
            `Upserted line_item ${upsertedLineItem.id} for package ${parcel.package_number} ${currentPackage.packageId} - uniqueString: ${uniqueString}`,
          );
        }
      }
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }

  public async syncFromECI(): Promise<void> {
    const packagesNotInZoho = await this.db.package.findMany({
      where: {
        tenant: {
          id: this.zohoApp.tenantId,
        },
        zohoPackage: {
          none: {
            zohoAppId: this.zohoApp.id,
          },
        },
        createdAt: {
          gt: subMonths(new Date(), 5),
        },
      },
      include: {
        packageLineItems: true,
      },
    });

    this.logger.info(
      `Received ${packagesNotInZoho.length} packages that we need to sync with Zoho`,
      {
        packageNumbers: packagesNotInZoho.map((p) => p.number),
      },
    );

    for (const p of packagesNotInZoho) {
      try {
        if (!p.trackingId && !["PICKUP", "UNKNOWN"].includes(p.carrier)) {
          this.logger.warn(
            // eslint-disable-next-line max-len
            `No tracking number found for ${p.number} and Carrier is not pickup - Carrier: ${p.carrier}`,
          );
          continue;
        }
        this.logger.info(
          // eslint-disable-next-line max-len
          `Creating package ${p.number} - Carrier: ${p.carrier} - TrackingId: ${p.trackingId} in Zoho`,
          {
            trackingId: p.trackingId,
            orderId: p.orderId,
          },
        );
        // fetch the package line items in a seperate call, as this is more efficient
        // with Planetscale
        const orderLineItems = await this.db.order.findUnique({
          where: {
            id: p.orderId,
          },
          include: {
            zohoSalesOrders: {
              select: {
                id: true,
              },
              where: {
                zohoAppId: this.zohoApp.id,
              },
            },
            orderLineItems: {
              select: {
                sku: true,
                quantity: true,
                zohoOrderLineItems: {
                  where: {
                    zohoAppId: this.zohoApp.id,
                  },
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        });

        if (!orderLineItems?.orderLineItems) {
          this.logger.warn(
            `No orderline items for order ${p.orderId} - ${p.number}`,
          );
          continue;
        }

        const salesOrderId = orderLineItems.zohoSalesOrders[0]?.id;

        if (!salesOrderId) {
          this.logger.info(
            `No salesorder id found for order ${p.orderId} - ${orderLineItems.orderNumber}.` +
              `Package ${p.number}. Maybe the salesorder sync did not create it yet!`,
          );
          continue;
        }

        const lineItems = packageToZohoLineItems(
          orderLineItems.orderLineItems,
          p.packageLineItems,
          this.logger,
        );

        const createdPackage = await this.zoho.package.create(
          {
            package_number: p.number,
            line_items: lineItems,
            date: format(p.createdAt, "yyyy-MM-dd"),
          },
          salesOrderId,
        );

        await sleep(1000);

        const shipment = await this.zoho.package.createShipment(
          {
            date: format(p.createdAt, "yyyy-MM-dd"),
            aftership_carrier_code:
              this.carrierToAftership(p.carrier) || undefined,
            delivery_method: p.carrier,
            tracking_number: p.trackingId || "",
            tracking_link: p.carrierTrackingUrl || "",
            notes: p.carrierTrackingUrl || undefined,
          },
          salesOrderId,
          createdPackage.package_id,
          true,
        );

        await this.db.zohoPackage.create({
          data: {
            id: createdPackage.package_id,
            package: {
              connect: {
                id: p.id,
              },
            },
            zohoApp: {
              connect: {
                id: this.zohoApp.id,
              },
            },
            createdAt: new Date(createdPackage.created_time),
            updatedAt: new Date(shipment.last_modified_time),
            shipmentId: shipment.shipment_id,
          },
        });
      } catch (error) {
        if (error instanceof ZohoApiError) {
          this.logger.error(
            `Error working on package ${p.id} - ${p.number}. ${error}. Code: ${error.code} `,
          );
        } else {
          this.logger.error(
            `Error working on package ${p.id} - ${p.number}. ${error}. Undefined error`,
          );
        }
      }
    }

    const packagesAlreadyDelivered = await this.db.package.findMany({
      where: {
        tenantId: this.zohoApp.tenantId,
        state: {
          in: ["DELIVERED", "AVAILABLE_FOR_PICKUP"],
        },
        zohoPackage: {
          some: {
            shipmentStatus: {
              equals: "shipped",
            },
          },
        },
      },
      include: {
        zohoPackage: {
          select: {
            id: true,
            shipmentId: true,
          },
        },
      },
    });

    this.logger.info(
      // eslint-disable-next-line max-len
      `We have ${packagesAlreadyDelivered.length} packages, that we need to mark as delivered in Zoho`,
      {
        packageIds: packagesAlreadyDelivered.map((p) => p.id),
      },
    );

    for (const p of packagesAlreadyDelivered) {
      const zohoShipmentId = p.zohoPackage[0].shipmentId;
      const zohoPackageId = p.zohoPackage[0].id;
      if (!zohoShipmentId) continue;
      this.logger.info(
        `Marking package ${p.id} - Zoho shipment id ${zohoShipmentId} as delivered`,
      );

      try {
        await this.zoho.package.markDelivered(zohoShipmentId, new Date());
      } catch (error) {
        if (error instanceof ZohoApiError) {
          if (error.code === 37135) {
            this.logger.info(
              `Package ${p.id} - shipment ${zohoShipmentId} is already delivered. Marking it in DB`,
            );
            await this.db.zohoPackage.update({
              where: {
                id_zohoAppId: {
                  id: zohoPackageId,
                  zohoAppId: this.zohoApp.id,
                },
              },
              data: {
                shipmentStatus: "delivered",
              },
            });
          } else if (error.code === 43) {
            this.logger.error(
              "We are blocked by Zoho for this API account. We don't continue",
            );
            return;
          } else {
            this.logger.error(
              `ZohoAPI error: ${error.code} - ${error.message}`,
            );
          }
        } else {
          this.logger.error(
            `Not expected error happend: ${JSON.stringify(error)}`,
          );
        }
        sleep(1000);
        continue;
      }

      await this.db.zohoPackage.update({
        where: {
          id_zohoAppId: {
            id: zohoPackageId,
            zohoAppId: this.zohoApp.id,
          },
        },
        data: {
          shipmentStatus: "delivered",
        },
      });
      await sleep(1000);
    }
  }
}
