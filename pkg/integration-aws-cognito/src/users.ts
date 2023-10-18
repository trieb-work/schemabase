/* eslint-disable import/no-extraneous-dependencies */
import { ILogger } from "@eci/pkg/logger";
import { AWSCognitoApp, PrismaClient } from "@eci/pkg/prisma";
import {
    AdminUpdateUserAttributesCommand,
    CognitoIdentityProvider,
    ListUsersCommand,
    ListUsersCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subYears } from "date-fns";

export interface CognitoUserSyncServiceConfig {
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
    AWSCognitoApp: AWSCognitoApp;
}

export class CognitoUserSyncService {
    private readonly tenantId: string;

    private readonly db: PrismaClient;

    private readonly logger: ILogger;

    private readonly AWSCognitoApp: AWSCognitoApp;

    private readonly cognitoClient: CognitoIdentityProvider;

    private readonly cronState: CronStateHandler;

    constructor(config: CognitoUserSyncServiceConfig) {
        this.tenantId = config.tenantId;
        this.db = config.db;
        this.logger = config.logger;
        this.AWSCognitoApp = config.AWSCognitoApp;
        this.cognitoClient = new CognitoIdentityProvider({
            region: this.AWSCognitoApp.region,
            credentials: {
                accessKeyId: this.AWSCognitoApp.accessKeyId,
                secretAccessKey: this.AWSCognitoApp.secretAccessKey,
            },
        });
        this.cronState = new CronStateHandler({
            tenantId: this.tenantId,
            appId: this.AWSCognitoApp.id,
            db: this.db,
            syncEntity: "contacts",
        });
    }

    /**
     * Update user attributes of a user in AWS cognito.
     * Custom attributes need to be created in cognito before they can be set for a user.
     * @param username
     * @param attributes
     */
    private async updateUserAttributesInCognito(
        username: string,
        attributes: { Name: string; Value: string }[],
    ): Promise<void> {
        const updateUserCommand = new AdminUpdateUserAttributesCommand({
            UserPoolId: this.AWSCognitoApp.userPoolId,
            Username: username,
            UserAttributes: attributes,
        });
        await this.cognitoClient.send(updateUserCommand);
    }

    /**
     * We search for a user in AWS cognito using the email address as search parameter.
     * We use the ListUsersCommand to search for the email attribute. Can return multiple identities
     * @param email
     */
    private async getCognitoUserByEmail(
        email: string,
    ): Promise<ListUsersCommandOutput["Users"] | undefined> {
        const getListOfUsersCommand = new ListUsersCommand({
            UserPoolId: this.AWSCognitoApp.userPoolId,
            Filter: `email = "${email}"`,
            Limit: 60,
        });

        const response = await this.cognitoClient.send(getListOfUsersCommand);

        if (response?.Users?.length === 0 || !response.Users) {
            return undefined;
        }

        return response.Users;
    }

    public async syncFromEci(): Promise<void> {
        const cronState = await this.cronState.get();

        const now = new Date();
        let gteDate: Date;

        if (cronState.lastRun === null) {
            gteDate = subYears(now, 2);
            this.logger.info(
                `This seems to be our first sync run. Setting GTE date to ${gteDate}`,
            );
        } else {
            gteDate = subHours(cronState.lastRun, 1);
            this.logger.info(`Setting GTE date to ${gteDate}`);
        }

        // pull from our DB contacts that have changed since the last run.
        const contacts = await this.db.contact.findMany({
            where: {
                tenantId: this.tenantId,
                updatedAt: {
                    gte: gteDate,
                },
            },
            include: {
                channels: true,
            },
        });

        if (contacts.length === 0) {
            this.logger.info("No contacts to sync with AWS cognito");
            return;
        }

        this.logger.info(
            `Syncing ${contacts.length} contacts with AWS cognito`,
        );

        // for each contact, check if they exist in AWS cognito, using the email address as search parameter.
        // if they do, update the user. there could be multiple user identities with the same email address
        // if they don't, create the user
        for (const contact of contacts) {
            const cognitoUser = await this.getCognitoUserByEmail(contact.email);
            if (cognitoUser === undefined) {
                this.logger.info(`Creating user ${contact.email} in Cognito`);
            } else {
                this.logger.info(`Updating user ${contact.email} in Cognito`);
                for (const u of cognitoUser) {
                    const channelName = contact.channels?.[0]?.name;
                    if (channelName === undefined) {
                        this.logger.warn(
                            `Contact ${contact.email} has no related sales channel`,
                        );
                        continue;
                    }
                    await this.updateUserAttributesInCognito(u.Username!, [
                        {
                            Name: "custom:channel",
                            Value: channelName,
                        },
                    ]);
                }
            }
        }

        // Authenticate with AWS cognito and pull a list of all users
        const getListOfUsersCommand = new ListUsersCommand({
            UserPoolId: this.AWSCognitoApp.userPoolId,
        });
        const response = await this.cognitoClient.send(getListOfUsersCommand);
        console.log(JSON.stringify(response.Users, null, 2));
    }
}
