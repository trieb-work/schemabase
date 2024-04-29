import { CronStateHandler } from "@eci/pkg/cronstate";
import {
    BullMQProducer,
    EventSchemaRegistry,
    Message,
    Topic,
} from "@eci/pkg/events";
import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { sleep } from "@eci/pkg/utils/time";
import { FedexTrackingApp, PackageState, PrismaClient } from "@eci/pkg/prisma";
import { subMonths } from "date-fns";
import axios, { AxiosInstance } from "axios";

interface FedexTrackingSyncServiceConfig {
    fedexTrackingApp: FedexTrackingApp;
    db: PrismaClient;
    logger: ILogger;
    testMode?: boolean;
}

type FedexTrackingPackage = {
    trackingNumber: string;
    trackResults: FedexTrackingResult[];
};

type FedexTrackingResult = {
    trackingNumberInfo: {
        trackingNumber: string;
        trackingNumberUniqueId: string;
        carrierCode: string;
    };
    additionalTrackingInfo: {
        nickname: string;
        packageIdentifiers: FedexPackageIdentifier[];
        hasAssociatedShipments: boolean;
    };
    shipperInformation: {
        contact: any; // TODO: Define the type for contact
        address: FedexAddress;
    };
    recipientInformation: {
        contact: any; // TODO: Define the type for contact
        address: FedexAddress;
    };
    latestStatusDetail: FedexStatusDetail;
    dateAndTimes: FedexDateTime[];
    availableImages: any[]; // TODO: Define the type for availableImages
    packageDetails: FedexPackageDetails;
    shipmentDetails: {
        possessionStatus: boolean;
        weight: FedexWeight[];
    };
    scanEvents: FedexScanEvent[];
    availableNotifications: string[];
    deliveryDetails: {
        actualDeliveryAddress: FedexAddress;
        deliveryAttempts: string;
        receivedByName: string;
        deliveryOptionEligibilityDetails: FedexDeliveryOptionEligibility[];
    };
    originLocation: {
        locationContactAndAddress: {
            address: FedexAddress;
        };
    };
    lastUpdatedDestinationAddress: FedexAddress;
    serviceDetail: {
        type: string;
        description: string;
        shortDescription: string;
    };
    standardTransitTimeWindow: {
        window: {
            ends: string;
        };
    };
    estimatedDeliveryTimeWindow: {
        window: any; // TODO: Define the type for estimatedDeliveryTimeWindow
    };
    goodsClassificationCode: string;
    returnDetail: any; // TODO: Define the type for returnDetail
};

type FedexPackageIdentifier = {
    type: string;
    values: string[];
    trackingNumberUniqueId: string;
    carrierCode: string;
};

type FedexAddress = {
    city: string;
    stateOrProvinceCode: string;
    countryCode: string;
    residential: boolean;
    countryName: string;
    streetLines?: string[];
    postalCode?: string;
};
const FedExTrackingCodes = {
    AA: "At Airport",
    AC: "At Canada Post facility",
    AD: "At Delivery",
    AF: "At FedEx Facility",
    AO: "Shipment arriving On-time",
    AP: "At Pickup",
    AR: "Arrived",
    AX: "At USPS facility",
    CA: "Carrier", // Given the conflict, chose the last occurrence
    CH: "Location Changed",
    DD: "Delivery Delay",
    DE: "Delivery Exception",
    DL: "Delivered",
    DP: "Departed",
    DR: "Vehicle furnished but not used",
    DS: "Vehicle Dispatched",
    DY: "Delay",
    EA: "Export Approved", // Given the conflict, chose the last occurrence
    ED: "Enroute to Delivery",
    EO: "Enroute to Origin Airport",
    EP: "Enroute to Pickup",
    FD: "At FedEx Destination",
    HL: "Hold at Location",
    IT: "In Transit",
    IX: "In transit (see Details)",
    LO: "Left Origin",
    OC: "Order Created",
    OD: "Out for Delivery",
    OF: "At FedEx origin facility",
    OX: "Shipment information sent to USPS",
    PD: "Pickup Delay",
    PL: "Plane Landed",
    PM: "In Progress",
    PU: "Picked Up",
    PX: "Picked up (see Details)",
    RR: "CDO requested",
    RM: "CDO Modified",
    RC: "Recipient", // Given the conflict, chose the last occurrence
    RS: "Return to Shipper",
    RP: "Return label link emailed to return sender",
    LP: "Return label link cancelled by shipment originator",
    RG: "Return label link expiring soon",
    RD: "Return label link expired",
    SE: "Shipment Exception",
    SF: "At Sort Facility",
    SP: "Split Status", // Last valid occurrence used
    TR: "Transfer",
    CC: "Cleared Customs",
    CD: "Clearance Delay",
    CP: "Clearance in Progress",
    SH: "Shipper",
    CU: "Customs",
    BR: "Broker",
    TP: "Transfer Partner",
} as const;

type FedExTrackingStatus = keyof typeof FedExTrackingCodes;

type FedexStatusDetail = {
    code: FedExTrackingStatus;
    derivedCode: string;
    statusByLocale: string;
    description: string;
    scanLocation: FedexAddress;
    ancillaryDetails: FedexAncillaryDetail[];
};

type FedexAncillaryDetail = {
    reason: string;
    reasonDescription: string;
    action: string;
    actionDescription: string;
};

type FedexDateTime = {
    type: string;
    dateTime: string;
};

type FedexWeight = {
    value: string;
    unit: string;
};

type FedexPackageDetails = {
    packagingDescription: {
        type: string;
        description: string;
    };
    physicalPackagingType: string;
    sequenceNumber: string;
    count: string;
    weightAndDimensions: {
        weight: FedexWeight[];
        dimensions: FedexDimension[];
    };
    packageContent: any[]; // TODO: Define the type for packageContent
};

type FedexDimension = {
    length: number;
    width: number;
    height: number;
    units: string;
};

type FedexScanEvent = {
    date: string;
    eventType: string;
    eventDescription: string;
    exceptionCode: string;
    exceptionDescription: string;
    scanLocation: FedexAddress;
    locationType: string;
    derivedStatusCode: string;
    derivedStatus: string;
};

type FedexDeliveryOptionEligibility = {
    option: string;
    eligibility: string;
};

type FedexResponse = {
    transactionId: string;
    output: {
        completeTrackResults: FedexTrackingPackage[];
    };
};

export class FedexTrackingSyncService {
    private readonly logger: ILogger;

    public readonly fedexTrackingApp: FedexTrackingApp;

    private readonly db: PrismaClient;

    private readonly cronState: CronStateHandler;

    public constructor(config: FedexTrackingSyncServiceConfig) {
        this.logger = config.logger;
        this.fedexTrackingApp = config.fedexTrackingApp;
        this.db = config.db;
        this.cronState = new CronStateHandler({
            tenantId: this.fedexTrackingApp.tenantId,
            appId: this.fedexTrackingApp.id,
            db: this.db,
            syncEntity: "packageState",
        });
    }

    /**
     * parse the fedex package status codes to our internal package state
     * @param state
     * @returns
     */
    parseState = (state: FedExTrackingStatus): PackageState | null => {
        switch (state) {
            case "PU":
            case "DL":
                return PackageState.DELIVERED;
            case "AD":
            case "OD":
                return PackageState.OUT_FOR_DELIVERY;
            case "DE":
                return PackageState.EXCEPTION;
            case "DD":
            case "PM":
            case "IT":
            case "DP":
            case "IX":
                return PackageState.IN_TRANSIT;
            case "OC":
                return PackageState.INFORMATION_RECEIVED;
            default:
                return null;
        }
    };

    private async getFedexPackage(
        trackingId: string,
        fedexClient: AxiosInstance,
    ) {
        try {
            const response = await fedexClient.post<FedexResponse>(
                "/track/v1/trackingnumbers",
                {
                    includeDetailedScans: true,
                    trackingInfo: [
                        {
                            shipDateBegin: "",
                            shipDateEnd: "",
                            trackingNumberInfo: {
                                trackingNumber: trackingId,
                                carrierCode: "FDXE",
                                trackingNumberUniqueId: "",
                            },
                        },
                    ],
                },
            );

            return response.data.output.completeTrackResults[0];
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e.response?.data;
                this.logger.error(
                    `Could not fetch package data from Fedex for ${trackingId}: ${JSON.stringify(
                        error,
                    )}`,
                );
            } else {
                this.logger.error(
                    `Could not fetch package data from Fedex for ${trackingId}: ${JSON.stringify(
                        e,
                    )}`,
                );
            }
            return null;
        }
    }

    private async createAPIClient(clientId: string, clientSecret: string) {
        // Oauth2 client credentials flow for Fedex. Token URL: https://apis.fedex.com/oauth/token
        // return a axios instance with the Bearer Token from the oauth2 flow set.
        // Send client credentials in body
        const token = await axios({
            method: "post",
            url: "https://apis.fedex.com/oauth/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        });

        const instance = axios.create({
            baseURL: "https://apis.fedex.com",
            headers: {
                Authorization: `Bearer ${token.data.access_token}`,
                transId: id.id("trace"),
                transactionSrc: "schemabase",
            },
        });

        return instance;
    }

    public async syncToECI(testTrackingId?: string): Promise<void> {
        await this.cronState.get();
        const fedexClient = await this.createAPIClient(
            this.fedexTrackingApp.clientId,
            this.fedexTrackingApp.clientSecret,
        );

        /// get all Fedex packages, that are not delivered
        // with last status update older than 2 hours, to prevent too many API calls
        const fedexPackages = testTrackingId
            ? await this.db.package.findMany({
                  where: {
                      trackingId: testTrackingId,
                  },
              })
            : await this.db.package.findMany({
                  where: {
                      tenantId: this.fedexTrackingApp.tenantId,
                      carrier: "FEDEX",
                      state: {
                          not: "DELIVERED",
                      },
                      trackingId: {
                          not: null,
                      },
                      createdAt: {
                          gt: subMonths(new Date(), 2),
                      },
                      isTrackingEnabled: true,
                  },
              });

        this.logger.info(
            `Receiving ${fedexPackages.length} Fedex packages, that we pull status updates from`,
        );

        for (const p of fedexPackages) {
            if (!p.trackingId) continue;
            this.logger.info(
                `Pulling package data from Fedex for ${p.trackingId}`,
            );

            const fullPackage = await this.getFedexPackage(
                p.trackingId,
                fedexClient,
            );

            if (!fullPackage) {
                this.logger.error(
                    `Could not fetch package data from Fedex for ${p.trackingId}`,
                );
                continue;
            }

            const lastState = fullPackage.trackResults?.[0].latestStatusDetail;
            if (!lastState || !lastState.code) {
                this.logger.error(
                    `Package state from Fedex not including current status code: ${p.trackingId}`,
                    {
                        lastState,
                        trackingId: p.trackingId,
                    },
                );
                continue;
            }
            const internalState = this.parseState(lastState.code);
            if (!internalState) {
                this.logger.error(
                    `Could not parse package state ${JSON.stringify(
                        lastState,
                    )}` + `to our internal package state for ${p.trackingId}`,
                );
                continue;
            }

            /**
             * The status message coming from Fedex - like: "Processing at Fedex Facility"
             */
            const statusMessage =
                lastState.ancillaryDetails?.[0]?.reasonDescription ||
                lastState.description;

            // eslint-disable-next-line max-len
            const shipmentLocation = `${lastState.scanLocation.city}, ${lastState.scanLocation.stateOrProvinceCode}, ${lastState.scanLocation.countryCode}`;

            if (!this.fedexTrackingApp.trackingIntegrationId) {
                this.logger.info(
                    `There is no tracking integration configured for Fedex App ${this.fedexTrackingApp.id}.` +
                        "Not updating package state",
                );
                continue;
            }

            const lastScanEvent = fullPackage.trackResults[0].scanEvents[0];

            /**
             * Parse date & time
             */
            const time = new Date(lastScanEvent.date);
            const packageEvent: EventSchemaRegistry.PackageUpdate["message"] = {
                trackingId: p.trackingId,
                packageId: p.id,
                time: time.getTime() / 1000,
                location: shipmentLocation,
                state: internalState,
                trackingIntegrationId:
                    this.fedexTrackingApp.trackingIntegrationId,
                message: statusMessage,
            };

            const queue = await BullMQProducer.new<
                EventSchemaRegistry.PackageUpdate["message"]
            >({
                topic: Topic.PACKAGE_UPDATE,
                tenantId: this.fedexTrackingApp.tenantId,
            });

            const message = new Message({
                header: {
                    traceId: id.id("trace"),
                },
                content: packageEvent,
            });

            const { messageId } = await queue.produce(
                Topic.PACKAGE_UPDATE,
                message,
            );
            this.logger.info(`Created BullMQ message with ID ${messageId}`);

            await sleep(5000);
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }
}
