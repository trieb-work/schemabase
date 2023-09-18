// SaleorChannelsSync service is just a very basic sync service that pulls channels only
// Saleor Channels need to be mapped manually to our internal sales channels, so we are just
// pulling all channels and comparing them with the SaleorChannel database table

import { ILogger } from "@eci/pkg/logger";
import { InstalledSaleorApp, PrismaClient } from "@eci/pkg/prisma";
import { GetChannelsQuery, GetChannelsQueryVariables } from "@eci/pkg/saleor";

interface SaleorChannelSyncServiceConfig {
    installedSaleorApp: InstalledSaleorApp;
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
    saleorClient: {
        getChannels: (
            variables: GetChannelsQueryVariables,
        ) => Promise<GetChannelsQuery>;
    };
}

export class SaleorChannelSyncService {
    private db: PrismaClient;

    private readonly installedSaleorApp: InstalledSaleorApp;

    private readonly logger: ILogger;

    private saleorClient: {
        getChannels: (
            variables: GetChannelsQueryVariables,
        ) => Promise<GetChannelsQuery>;
    };

    constructor(config: SaleorChannelSyncServiceConfig) {
        this.saleorClient = config.saleorClient;
        this.db = config.db;
        this.installedSaleorApp = config.installedSaleorApp;
        this.logger = config.logger;
    }

    async syncToEci(): Promise<void> {
        const saleorChannels = await this.saleorClient.getChannels({});
        if (!saleorChannels.channels) {
            this.logger.info("No channels found in Saleor");
            return;
        }
        for (const channel of saleorChannels.channels) {
            if (!channel.name) {
                this.logger.info(
                    `Channel with id ${channel.id} has no name, skipping`,
                );
                continue;
            }
            await this.db.saleorChannel.upsert({
                where: {
                    id_installedSaleorAppId: {
                        id: channel.id,
                        installedSaleorAppId: this.installedSaleorApp.id,
                    },
                },
                update: {},
                create: {
                    id: channel.id,
                    installedSaleorApp: {
                        connect: {
                            id: this.installedSaleorApp.id,
                        },
                    },
                    name: channel.name,
                },
            });
        }
    }
}
