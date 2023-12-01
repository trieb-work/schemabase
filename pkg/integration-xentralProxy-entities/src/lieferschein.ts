/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils";
import { ILogger } from "@eci/pkg/logger";
import { arrayFromAsyncGenerator } from "@eci/pkg/utils/array";
import {
    Carrier,
    OrderShipmentStatus,
    PrismaClient,
    XentralProxyApp,
} from "@eci/pkg/prisma";
import {
    XentralRestClient,
    XentralRestNotFoundError,
} from "@eci/pkg/xentral/src/rest";
import { XentralXmlClient } from "@eci/pkg/xentral/src/xml";
import { id } from "@eci/pkg/ids";
import { Auftrag, Trackingnummer } from "@eci/pkg/xentral/src/rest/types";
import { generateTrackingPortalURL } from "@eci/pkg/integration-tracking";
// import { subDays } from "date-fns";

interface XentralProxyLieferscheinSyncServiceConfig {
    xentralProxyApp: XentralProxyApp;
    xentralXmlClient: XentralXmlClient;
    xentralRestClient: XentralRestClient;
    db: PrismaClient;
    logger: ILogger;
}

export class XentralProxyLieferscheinSyncService {
    private readonly logger: ILogger;

    public readonly tenantId: string;

    public readonly xentralProxyApp: XentralProxyApp;

    public readonly xentralXmlClient: XentralXmlClient;

    public readonly xentralRestClient: XentralRestClient;

    private readonly db: PrismaClient;

    public constructor(config: XentralProxyLieferscheinSyncServiceConfig) {
        this.logger = config.logger;
        this.tenantId = config.xentralProxyApp.tenantId;
        this.xentralProxyApp = config.xentralProxyApp;
        this.db = config.db;
        this.xentralXmlClient = config.xentralXmlClient;
        this.xentralRestClient = config.xentralRestClient;
    }

    public async syncToECI(): Promise<void> {
        this.logger.info(
            "Starting sync of ECI Orders to XentralProxy Aufträge",
        );
        const orders = await this.db.order.findMany({
            where: {
                // TODO check which filters make sense?
                orderStatus: "confirmed",

                // We only pull orders, that are not fully shipped yet.
                shipmentStatus: {
                    notIn: ["delivered"],
                },
                // The sliding window - may be removed or changed. Orders can be created a long time ago
                // and be shipped a few month later. So this will not work
                // createdAt: {
                //   gte: subDays(new Date(), 10)
                // },
                readyToFullfill: true,
                /**
                 * only include orders which have already been transfered to the current xentral instance and
                 * therefore have one xentralProxyAuftrag with the current xentral instance
                 */
                xentralProxyAuftraege: {
                    some: {
                        xentralProxyAppId: this.xentralProxyApp.id,
                    },
                },
            },
            include: {
                shippingAddress: true,
                xentralProxyAuftraege: {
                    where: {
                        xentralProxyAppId: this.xentralProxyApp.id,
                    },
                },
                orderLineItems: true, // TODO check if package volume and shippingStatus makes sense if multiple warehouses
            },
        });
        this.logger.info(
            `Will sync Xentral Lieferscheine to Packages for ${orders.length} Orders with Xentral.`,
            {
                orderNumbers: orders.map((o) => o.orderNumber),
            },
        );
        for (const order of orders) {
            let loggingFields: Record<string, any> = {
                order: order.id,
                orderNumber: order.orderNumber,
            };
            if (
                !order.xentralProxyAuftraege ||
                order.xentralProxyAuftraege.length === 0
            ) {
                throw new Warning(
                    "No xentralProxyAuftraege set for this order. " +
                        "Aborting sync of this order. Try again after xentral auftrag sync.",
                );
            }
            if (order.xentralProxyAuftraege.length > 1) {
                this.logger.error(
                    `Multiple xentralProxyAuftraege set for the mainContact of this order: ${order.orderNumber} ` +
                        "Aborting sync of this order.",
                );
                continue;
            }
            // Main Auftrag
            const xentralParentAuftrag = order.xentralProxyAuftraege[0];
            loggingFields = {
                ...loggingFields,
                order: order.id,
                orderNumber: order.orderNumber,
                xentralParentAuftragId: xentralParentAuftrag.id,
                xentralParentAuftragBelegnr:
                    xentralParentAuftrag.xentralBelegNr,
            };
            // We need to fetch auftraege again because it could be that one Auftrag was splitted in two or more if it does not fit in one package.
            let xentralChildAndParentAuftraege: Auftrag[];
            try {
                xentralChildAndParentAuftraege = await arrayFromAsyncGenerator(
                    this.xentralRestClient.getAuftraege({
                        belegnr_startswith: xentralParentAuftrag.xentralBelegNr,
                    }),
                );
            } catch (err) {
                if (err instanceof XentralRestNotFoundError) {
                    // TODO add try/catch block from other services:
                    this.logger.error(
                        "Having an Auftrag with this belegnr in ECI DB but could not find one via xentral api.",
                    );
                    continue;
                }
                throw err;
            }
            loggingFields = {
                ...loggingFields,
                xentralChildAndParentAuftraegeIds:
                    xentralChildAndParentAuftraege.map((a) => a.id),
                xentralChildAndParentAuftraegeBelegnrs:
                    xentralChildAndParentAuftraege.map((a) => a.belegnr),
            };
            // In Xentral it's possible, that we receive empty trackingnumbers back. Maybe a failed attempt or something
            let trackingnummern: Trackingnummer[];
            try {
                trackingnummern = await arrayFromAsyncGenerator(
                    this.xentralRestClient.getTrackingnummern({
                        auftrag_startswith: xentralParentAuftrag.xentralBelegNr,
                    }),
                );
            } catch (err) {
                if (err instanceof XentralRestNotFoundError) {
                    this.logger.info(
                        "XentralRestNotFoundError: No Trackingnumbers found with this belegnr. Seems like this Auftrag has not been processed by logisitics yet.",
                        {
                            loggingFields,
                        },
                    );
                    continue;
                }
                throw err;
            }
            trackingnummern = trackingnummern.filter((x) => x.tracking);
            if (trackingnummern.length === 0) {
                this.logger.info(
                    "Length = 0: No Trackingnumbers found with this belegnr. Seems like this Auftrag has not been processed by logisitics yet.",
                    {
                        loggingFields,
                    },
                );
                continue;
            }
            loggingFields = {
                ...loggingFields,
                trackingnummern: trackingnummern.map((t) => t.tracking),
            };
            const packagedItems: { [sku: string]: number } = {};
            for (const auftrag of xentralChildAndParentAuftraege) {
                // TODO: handle
                const lieferscheine = await arrayFromAsyncGenerator(
                    this.xentralRestClient.getLieferscheine({
                        auftragid: auftrag.id,
                        include: "positionen",
                    }),
                );
                loggingFields = {
                    ...loggingFields,
                    lieferscheineIds: lieferscheine.map((t) => t.id),
                    lieferscheineBelegnrs: lieferscheine.map((t) => t.belegnr),
                };
                // Handle stornierte Lieferscheine
                for (const l of lieferscheine) {
                    if (l.status === "storniert") {
                        this.logger.info(
                            `Xentral Lieferschein belegnr ${l.belegnr} for Auftrag ${l.auftrag} is in status "storniert". Marking as deleted in DB`,
                        );
                        try {
                            await this.db.xentralLieferschein.update({
                                where: {
                                    id_xentralProxyAppId: {
                                        id: l.id,
                                        xentralProxyAppId:
                                            this.xentralProxyApp.id,
                                    },
                                },
                                data: {
                                    status: "storniert",
                                    package: {
                                        update: {
                                            active: false,
                                        },
                                    },
                                },
                            });
                        } catch (error) {}
                    }
                }

                const filteredLieferscheine = lieferscheine.filter(
                    (l) => l.status !== "storniert",
                );

                if (filteredLieferscheine.length > 1) {
                    this.logger.error(
                        "Xentral returned multiple lieferscheine for a lieferscheine search with an auftrag id",
                        {
                            xentralAuftragId: auftrag.id,
                        },
                    );
                    continue;
                }
                if (filteredLieferscheine.length === 0) {
                    this.logger.info(
                        "Xentral returned no lieferscheine for a lieferscheine search with an auftrag id. Could be that logistics partner is still processing this Auftrag.",
                        {
                            xentralAuftragId: auftrag.id,
                        },
                    );
                    continue;
                }
                const lieferschein = filteredLieferscheine[0];
                if (
                    !lieferschein.positionen ||
                    lieferschein.positionen.length === 0
                ) {
                    this.logger.error(
                        "Xentral returned a lieferschein without any positions. Aborting sync. Please check this order manually.",
                        loggingFields,
                    );
                    continue;
                }
                if (
                    lieferschein.status !== "abgeschlossen" &&
                    lieferschein.status !== "versendet"
                ) {
                    this.logger.warn(
                        `Xentral returned a lieferschein with status ${lieferschein.status}. Status must be "abgeschlossen" or "versendet". Aborting sync and retry on next run.`,
                        loggingFields,
                    );
                    continue;
                }
                const matchingTrackingnummers = trackingnummern.filter(
                    (tr) =>
                        tr.auftrag === auftrag.belegnr &&
                        tr.lieferschein === lieferschein.belegnr,
                );
                loggingFields = {
                    ...loggingFields,
                    currentXentralAuftragId: auftrag.id,
                    currentXentralAuftragBelegnr: auftrag.belegnr,
                    currentXentralAuftragStatus: auftrag.status,
                    currentXentralLieferscheinId: lieferschein.id,
                    currentXentralLieferscheinBelegnr: lieferschein.belegnr,
                    currentXentralLieferscheinStatus: lieferschein.status,
                };
                if (matchingTrackingnummers.length > 1) {
                    // TODO: possible workaround if kramer does this would be to create multiple packages but then we do not know how the positions are split up across
                    // these packages so we have to split them up "randomly"
                    this.logger.error(
                        "Xentral returned multiple trackingnumbers for one lieferschein. This is currently not supported. We just write it all to one package..",
                        loggingFields,
                    );
                    // continue;
                }
                if (matchingTrackingnummers.length === 0) {
                    if (lieferschein.status === "versendet") {
                        this.logger.error(
                            "Xentral returned no trackingnummer for this lieferscheine, but the lieferschein was in status versendet. Please contact logisitics partner and clarify if he forgot set the trackingnumber for this lieferschein.",
                            loggingFields,
                        );
                    } else {
                        this.logger.warn(
                            "Xentral returned no trackingnummer for this lieferscheine. Could be that logistics partner is still processing this Lieferschein.",
                            loggingFields,
                        );
                    }
                    continue;
                }
                const matchingTrackingnummer = matchingTrackingnummers[0];
                let carrier: Carrier = Carrier.UNKNOWN;
                if (lieferschein.versandart.toLowerCase().includes("dhl")) {
                    carrier = Carrier.DHL;
                } else if (
                    lieferschein.versandart.toLowerCase().includes("dpd")
                ) {
                    carrier = Carrier.DPD;
                } else if (
                    lieferschein.versandart.toLowerCase().includes("ups")
                ) {
                    carrier = Carrier.UPS;
                } else if (
                    lieferschein.versandart.toLowerCase().includes("wapo_3")
                ) {
                    carrier = Carrier.DHL;
                }
                // TODO: lieferschein.belegnr is unique and should be enough but only if we do not use the workaround described in line 190
                // const packageNumber = `LF-${lieferschein.belegnr}_TRN-${matchingTrackingnummer.tracking}`;
                const packageNumber = `LF-${lieferschein.belegnr}`;
                const packageCreateId = id.id("package");
                const trackingId = matchingTrackingnummer.tracking;
                const carrierTrackingUrl =
                    carrier && trackingId
                        ? generateTrackingPortalURL(
                              carrier,
                              order.language,
                              trackingId,
                          )
                        : undefined;
                loggingFields = {
                    ...loggingFields,
                    carrierTrackingUrl,
                    carrier,
                };
                this.logger.info(`Upserting ${packageNumber}`, loggingFields);
                const upsertedPackage = await this.db.package.upsert({
                    where: {
                        number_tenantId: {
                            number: packageNumber,
                            tenantId: this.tenantId,
                        },
                    },
                    update: {
                        trackingId,
                        carrierTrackingUrl,
                    },
                    create: {
                        id: packageCreateId,
                        order: {
                            connect: {
                                id: order.id,
                            },
                        },
                        carrier,
                        number: packageNumber,
                        tenant: {
                            connect: {
                                id: this.tenantId,
                            },
                        },
                        trackingId,
                        carrierTrackingUrl,
                        packageLineItems: {
                            createMany: {
                                skipDuplicates: true, // TODO check if this is needed?
                                data: lieferschein.positionen.map((p) => ({
                                    quantity: Number(p.menge),
                                    id: id.id("packageLineItem"),
                                    tenantId: this.tenantId,
                                    sku: p.nummer,
                                    uniqueString: `${packageNumber}${
                                        p.nummer
                                    }${Number(p.menge)}`,
                                    warehouseId:
                                        this.xentralProxyApp.warehouseId,
                                })),
                            },
                        },
                        xentralLieferschein: {
                            connectOrCreate: {
                                where: {
                                    id_xentralProxyAppId: {
                                        id: lieferschein.id,
                                        xentralProxyAppId:
                                            this.xentralProxyApp.id,
                                    },
                                },
                                create: {
                                    id: lieferschein.id,
                                    status: lieferschein.status,
                                    xentralBelegNr: lieferschein.belegnr,
                                    xentralProxyApp: {
                                        connect: {
                                            id: this.xentralProxyApp.id,
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                for (const pos of lieferschein.positionen) {
                    if (!packagedItems[pos.nummer]) {
                        packagedItems[pos.nummer] = Number(pos.menge);
                    } else {
                        packagedItems[pos.nummer] += Number(pos.menge);
                    }
                }
                this.logger.info(
                    packageCreateId === upsertedPackage.id
                        ? "Created new Package and XentralLieferschein for current order"
                        : "Updated Package and Trackingnumber for the current order",
                    {
                        ...loggingFields,
                        trackingnummer: matchingTrackingnummer.tracking,
                    },
                );
            }
            const skuReducedLineItems = order.orderLineItems.reduce(
                (akku, li) => ({
                    ...akku,
                    [li.sku]: (akku[li.sku] || 0) + li.quantity,
                }),
                {} as Record<string, number>,
            );
            const skuGroupedLineItems = Object.entries(skuReducedLineItems).map(
                ([sku, quantity]) => ({ sku, quantity }),
            );
            const partiallyOrFullyshippedLineItems = skuGroupedLineItems.filter(
                (li) => packagedItems[li.sku],
            );
            const fullyShippedLineItems = skuGroupedLineItems.filter((li) => {
                if (!packagedItems[li.sku]) {
                    this.logger.info(
                        "The current order has a unpackaged line item",
                        {
                            sku: li.sku,
                            orderNumber: order.orderNumber,
                        },
                    );
                    return false;
                } else if (packagedItems[li.sku] < li.quantity) {
                    this.logger.info(
                        "The current order has a underpackaged line item",
                        {
                            sku: li.sku,
                            desiredQuantity: li.quantity,
                            actualQuantity: packagedItems[li.sku],
                            orderNumber: order.orderNumber,
                        },
                    );
                    return false;
                }
                /// This check is disabled, as we can have this case for Just-in-time bundled articles. We might need to improve this check
                // else if (packagedItems[li.sku] > li.quantity) {
                //   this.logger.error(
                //     "The current order has a line item which have been shiped more than needed! Please check this Order manually.",
                //     {
                //       sku: li.sku,
                //       desiredQuantity: li.quantity,
                //       actualQuantity: packagedItems[li.sku],
                //       orderNumber: order.orderNumber,
                //     },
                //   );
                //   return true;
                // }
                else {
                    // is same as: if (packagedItems[li.sku] === li.quantity)
                    return true;
                }
            });
            let shipmentStatus: OrderShipmentStatus;
            if (partiallyOrFullyshippedLineItems.length > 0) {
                if (
                    fullyShippedLineItems.length === skuGroupedLineItems.length
                ) {
                    shipmentStatus = OrderShipmentStatus.shipped;
                } else {
                    shipmentStatus = OrderShipmentStatus.partiallyShipped;
                }
            } else {
                shipmentStatus = OrderShipmentStatus.pending;
            }
            // TODO: How to handle orders which have been shipped via multiple warehouses and especailly via multiple systems and one via Xentral and one via Zoho
            // I think we need a new integration that will handle status field updates and is independet from any service like zoho or xentral
            const updatedOrder = await this.db.order.update({
                where: {
                    id: order.id,
                },
                data: {
                    shipmentStatus,
                },
            });
            this.logger.info("Updated order shipmentStatus", {
                ...loggingFields,
                updatedOrderShipmentStatus: updatedOrder.shipmentStatus,
            });
        }
    }
}
