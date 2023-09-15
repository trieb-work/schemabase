import { CronStateHandler } from "@eci/pkg/cronstate";
import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { setHours, subDays, subYears } from "date-fns";

interface DatevContactServiceConfig {
    db: PrismaClient;
    logger: ILogger;
    tenantId: string;
    datevAppId: string;
}

export class DatevContactServiceService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    private readonly cronState: CronStateHandler;

    private readonly datevAppId: string;

    private readonly datevBeginVendorNumberRange: number;

    private readonly datevBeginCustomerNumberRange: number;

    private tenantId: string;

    public constructor(config: DatevContactServiceConfig) {
        this.datevBeginCustomerNumberRange = 10000;
        this.datevBeginVendorNumberRange = 70000;
        this.logger = config.logger;
        this.db = config.db;
        this.tenantId = config.tenantId;
        this.datevAppId = config.datevAppId;
        this.cronState = new CronStateHandler({
            tenantId: this.tenantId,
            appId: this.datevAppId,
            db: this.db,
            syncEntity: "datev",
        });
    }

    public async eciContactsFlow() {
        const cronState = await this.cronState.get();

        const now = new Date();
        const yesterdayMidnight = setHours(subDays(now, 1), 0);
        let createdGte = yesterdayMidnight;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 1);
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from now - 1 Years to: ${createdGte}`,
            );
        } else {
            this.logger.info(`Setting GTE date to ${createdGte}`);
        }
        const contactsWithoutDatevContact = await this.db.contact.findMany({
            where: {
                datevContacts: {
                    none: {
                        datevAppId: this.datevAppId,
                    },
                },
            },
        });

        if (contactsWithoutDatevContact.length === 0) {
            this.logger.info(
                "No internal contacts without a DATEV creditor / debitor ID in place. Nothing to do",
            );
            await this.cronState.set({
                lastRun: new Date(),
                lastRunStatus: "success",
            });
            return;
        }

        for (const contact of contactsWithoutDatevContact) {
            this.logger.info(`Working on contact ${contact.id}.`);

            if (contact.vendor) {
                const currentHighest = await this.db.datevContact.aggregate({
                    where: {
                        datevAppId: this.datevAppId,
                        type: "KREDITOR",
                    },
                    _max: {
                        datevNummer: true,
                    },
                });

                const created = await this.db.datevContact.create({
                    data: {
                        id: id.id("datevContact"),
                        datevApp: {
                            connect: {
                                id: this.datevAppId,
                            },
                        },
                        type: "KREDITOR",
                        contact: {
                            connect: {
                                id: contact.id,
                            },
                        },
                        datevNummer: currentHighest?._max?.datevNummer
                            ? currentHighest._max.datevNummer + 1
                            : this.datevBeginVendorNumberRange,
                    },
                });

                this.logger.info(
                    `Generated datev KREDITOR with number ${created.datevNummer}`,
                );
            }

            if (contact.customer) {
                const currentHighest = await this.db.datevContact.aggregate({
                    where: {
                        datevAppId: this.datevAppId,
                        type: "DEBITOR",
                    },
                    _max: {
                        datevNummer: true,
                    },
                });

                const created = await this.db.datevContact.create({
                    data: {
                        id: id.id("datevContact"),
                        datevApp: {
                            connect: {
                                id: this.datevAppId,
                            },
                        },
                        type: "DEBITOR",
                        contact: {
                            connect: {
                                id: contact.id,
                            },
                        },
                        datevNummer: currentHighest?._max?.datevNummer
                            ? currentHighest._max.datevNummer + 1
                            : this.datevBeginCustomerNumberRange,
                    },
                });

                this.logger.info(
                    `Generated datev DEBITOR with number ${created.datevNummer}`,
                );
            }
        }

        this.logger.info("Finished datev contact workflow");
    }
}
