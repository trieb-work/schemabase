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
import { UspsTrackingApp, PackageState, PrismaClient } from "@eci/pkg/prisma";
import { subMonths } from "date-fns";
import axios, { AxiosInstance } from "axios";

interface USPSTrackingSyncServiceConfig {
    uspsTrackingApp: UspsTrackingApp;
    db: PrismaClient;
    logger: ILogger;
    testMode?: boolean;
}

interface USPSPackageResponse {
    destinationCity: string;
    destinationState: string;
    destinationZIP: string;
    emailEnabled: string;
    kahalaIndicator: string;
    mailClass: string;
    mailType: string;
    originCity: string;
    originState: string;
    originZIP: string;
    proofOfDeliveryEnabled: string;
    restoreEnabled: string;
    RRAMEnabled: string;
    RREEnabled: string;
    services: string[];
    serviceTypeCode: string;
    status: string;
    statusCategory: string;
    statusSummary: string;
    trackingEvents: USPSPackageEvent[];
    trackingNumber: string;
}

interface USPSPackageEvent {
    eventType: string;
    eventTimestamp: string;
    GMTTimestamp: string;
    GMTOffset: string;
    eventCountry: string | null;
    eventCity: string;
    eventState: string | null;
    eventZIP: string | null;
    firm: string | null;
    name: string | null;
    authorizedAgent: string;
    eventCode: string;
    additionalProp: string | null;
}

export class USPSTrackingSyncService {
    private readonly logger: ILogger;

    public readonly uspsTrackingApp: UspsTrackingApp;

    private readonly db: PrismaClient;

    private readonly cronState: CronStateHandler;

    public constructor(config: USPSTrackingSyncServiceConfig) {
        this.logger = config.logger;
        this.uspsTrackingApp = config.uspsTrackingApp;
        this.db = config.db;
        this.cronState = new CronStateHandler({
            tenantId: this.uspsTrackingApp.tenantId,
            appId: this.uspsTrackingApp.id,
            db: this.db,
            syncEntity: "packageState",
        });
    }

    /**
     * parse the USPS event codes to our internal package state.
     * USPS event codes: https://www.usps.com/business/web-tools-apis/track-and-confirm.htm
     * or: https://docs.shippingapi.pitneybowes.com/reference/tracking-codes.html
     * example: A1 -> Arrived at USPS Facility, T1 -> Departed Post Office, 01 -> Delivered
     * @param state
     */
    private parseState(eventCode: string): PackageState {
        switch (eventCode) {
            case "01":
                return PackageState.DELIVERED;
            case "02":
                return PackageState.FAILED_ATTEMPT;
            case "A1":
            case "A2":
            case "A3":
            case "AA":
            case "AB":
            case "AC":
            case "AD":
            case "AF":
            case "AG":
            case "AH":
            case "AM":
            case "AN":
            case "AR":
            case "AS":
            case "B1":
            case "B2":
            case "B3":
            case "DE":
            case "DF":
            case "DL":
            case "DM":
            case "DS":
            case "EA":
            case "EB":
            case "EC":
            case "ED":
            case "EF":
            case "EG":
            case "EH":
            case "EM":
            case "EN":
            case "ER":
            case "ES":
            case "EV":
            case "EW":
            case "EX":
            case "FX":
            case "IE":
            case "OF":
            case "OX":
            case "R1":
            case "R2":
            case "R3":
            case "R4":
            case "RB":
            case "RR":
            case "RS":
            case "SB":
            case "SM":
            case "SS":
            case "ST":
            case "TB":
            case "T1":
            case "T2":
            case "T3":
            case "UF":
            case "VA":
            case "VH":
            case "VL":
            case "VS":
            case "W1":
            case "W2":
            case "W3":
            case "WD":
            case "WM":
            case "WS":
            case "ZZ":
                return PackageState.IN_TRANSIT;
            case "D1":
            case "D2":
            case "D3":
                return PackageState.AVAILABLE_FOR_PICKUP;
            case "DO":
            case "DP":
                return PackageState.OUT_FOR_DELIVERY;
            case "PC":
            case "PM":
            case "PZ":
                return PackageState.INFORMATION_RECEIVED;
            case "XX":
                return PackageState.EXCEPTION;
            case "05":
                return PackageState.EXPIRED;
            case "06":
                return PackageState.PENDING;
            default:
                return PackageState.PENDING;
        }
    }

    private async getUspsPackage(trackingId: string, client: AxiosInstance) {
        try {
            const packageState = await client.get<USPSPackageResponse>(
                `/tracking/v3/tracking/${trackingId}?expand=DETAIL`,
            );

            return packageState.data;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e.response?.data;
                if (error.error.code === 400) {
                    this.logger.info(
                        "A status update is not yet available on your Priority Mail",
                    );
                    return null;
                }
                this.logger.error(
                    `Could not fetch package data from USPS for ${trackingId}: ${JSON.stringify(
                        error,
                    )}`,
                );
            } else {
                this.logger.error(
                    `Could not fetch package data from USPS for ${trackingId}: ${JSON.stringify(
                        e,
                    )}`,
                );
            }
            return null;
        }
    }

    private async createAPIClient(clientId: string, clientSecret: string) {
        // Oauth2 client credentials flow for USPS. Token URL: https://api.usps.com/oauth2/v3/token
        // return a axios instance with the Bearer Token from the oauth2 flow set.
        // Send client credentials in body
        const token = await axios({
            method: "post",
            url: "https://api.usps.com/oauth2/v3/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        });

        const instance = axios.create({
            baseURL: "https://api.usps.com",
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
        const uspsClient = await this.createAPIClient(
            this.uspsTrackingApp.clientId,
            this.uspsTrackingApp.clientSecret,
        );

        /// get all USPS packages, that are not delivered
        // with last status update older than 2 hours, to prevent too many API calls
        const uspsPackages = testTrackingId
            ? await this.db.package.findMany({
                  where: {
                      trackingId: testTrackingId,
                  },
              })
            : await this.db.package.findMany({
                  where: {
                      tenantId: this.uspsTrackingApp.tenantId,
                      carrier: "USPS",
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
            `Receiving ${uspsPackages.length} USPS packages, that we pull status updates from`,
        );

        for (const p of uspsPackages) {
            if (!p.trackingId) continue;
            this.logger.info(
                `Pulling package data from USPS for ${p.trackingId}`,
            );

            const fullPackage = await this.getUspsPackage(
                p.trackingId,
                uspsClient,
            );

            if (!fullPackage) {
                this.logger.error(
                    `Could not fetch package data from USPS for ${p.trackingId}`,
                );
                continue;
            }
            const lastState = fullPackage.trackingEvents[0];

            const internalState = this.parseState(lastState.eventCode);
            if (!internalState) {
                this.logger.error(
                    `Could not parse package state ${JSON.stringify(
                        lastState,
                    )}` + `to our internal package state for ${p.trackingId}`,
                );
                continue;
            }

            /**
             * The status message coming from USPS - like: "Your item was delivered in or at the mailbox at 8:58 am on May 16, 2024 in POST, TX 79356."
             */
            const statusMessage =
                fullPackage.statusSummary || lastState.eventType;

            // eslint-disable-next-line max-len
            const shipmentLocation = `${lastState.eventCity}, ${lastState.eventZIP}, ${lastState.eventCountry}`;

            if (!this.uspsTrackingApp.trackingIntegrationId) {
                this.logger.info(
                    `There is no tracking integration configured for USPS App ${this.uspsTrackingApp.id}.` +
                        "Not updating package state",
                );
                continue;
            }

            /**
             * Parse date & time
             */
            const time = new Date(lastState.eventTimestamp);
            const packageEvent: EventSchemaRegistry.PackageUpdate["message"] = {
                trackingId: p.trackingId,
                packageId: p.id,
                time: time.getTime() / 1000,
                location: shipmentLocation,
                state: internalState,
                trackingIntegrationId:
                    this.uspsTrackingApp.trackingIntegrationId,
                message: statusMessage,
            };

            const queue = await BullMQProducer.new<
                EventSchemaRegistry.PackageUpdate["message"]
            >({
                topic: Topic.PACKAGE_UPDATE,
                tenantId: this.uspsTrackingApp.tenantId,
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
