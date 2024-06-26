/* eslint-disable import/no-extraneous-dependencies */
import { ILogger } from "@eci/pkg/logger";
import { AWSCognitoApp, Prisma, PrismaClient } from "@eci/pkg/prisma";
import {
    AdminUpdateUserAttributesCommand,
    CognitoIdentityProvider,
    ListUsersCommand,
    ListUsersCommandOutput,
    ListUsersResponse,
    // AdminCreateUserCommand,
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

    // private async createUserInCognito(
    //     email: string,
    //     attributes: { Name: string; Value: string }[],
    // ): Promise<void> {
    //     const createUserCommand = new AdminCreateUserCommand({
    //         UserPoolId: this.AWSCognitoApp.userPoolId,
    //         Username: email,
    //         UserAttributes: attributes,
    //         MessageAction: "SUPPRESS",
    //     });
    //     await this.cognitoClient.send(createUserCommand);
    // }

    /**
     * exhaustive list of all users in AWS cognito. Is scrolling over
     * all users using the pagination token
     */
    private async getAllCognitoUsers(): Promise<ListUsersResponse["Users"]> {
        let paginationToken: string | undefined = undefined;
        let users: ListUsersResponse["Users"] = [];

        do {
            const command: ListUsersCommand = new ListUsersCommand({
                UserPoolId: this.AWSCognitoApp.userPoolId,
                PaginationToken: paginationToken,
            });

            const response = await this.cognitoClient.send(command);

            if (response.Users) {
                users = users.concat(response.Users);
            }

            paginationToken = response.PaginationToken;
        } while (paginationToken);

        return users;
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

    public async syncToEci(): Promise<void> {
        /**
         * pull all cognito users and store them in our internal DB
         */

        const allCognitoUsers = await this.getAllCognitoUsers();

        if (!allCognitoUsers) {
            this.logger.info("No users found in cognito");
            return;
        }

        this.logger.info(`Found ${allCognitoUsers.length} users in cognito`);

        const existingCognitoUsers = await this.db.aWSCognitoUser.findMany({
            where: {
                awsCognitoAppId: this.AWSCognitoApp.id,
                id: {
                    in: allCognitoUsers.map((user) => user.Username!),
                },
            },
        });
        const existingCognitoUserIds = existingCognitoUsers.map(
            (user) => user.id,
        );
        const newCognitoUsers = allCognitoUsers.filter(
            (user) => !existingCognitoUserIds.includes(user.Username!),
        );

        this.logger.info(
            `Found ${newCognitoUsers.length} new users in cognito`,
        );

        /**
         * create the new users in our DB
         */
        for (const user of newCognitoUsers) {
            const email = user.Attributes?.find(
                (attribute) => attribute.Name === "email",
            )?.Value?.toLowerCase();
            if (!email) {
                this.logger.error(
                    `User ${user.Username} has no email attribute`,
                );
                continue;
            }
            try {
                await this.db.aWSCognitoUser.create({
                    data: {
                        id: user.Username!,
                        awsCognitoApp: {
                            connect: {
                                id: this.AWSCognitoApp.id,
                            },
                        },
                        contact: {
                            connect: {
                                email_tenantId: {
                                    email,
                                    tenantId: this.tenantId,
                                },
                            },
                        },
                    },
                });
            } catch (error) {
                /**
                 * When a user email does not exist in our
                 * DB yet, this call will fail. We can safely
                 * ignore this error, as we don't create users based
                 * on cognito internally
                 */
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2003") {
                        this.logger.info(
                            `User ${user.Username} has no contact`,
                        );
                        continue;
                    }
                } else {
                    this.logger.error(
                        `Error creating user ${user.Username} in our DB`,
                    );
                    this.logger.error(JSON.stringify(error));
                    continue;
                }
            }
        }
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
                awsCognitoUsers: {
                    some: {
                        awsCognitoAppId: this.AWSCognitoApp.id,
                    },
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
            this.logger.info(`Syncing contact ${contact.email}`);
            const cognitoUser = await this.getCognitoUserByEmail(contact.email);
            if (cognitoUser === undefined) {
                const channelName = contact.channels?.[0]?.name;
                if (channelName === undefined) {
                    this.logger.warn(
                        `Contact ${contact.email} has no related sales channel`,
                    );
                    continue;
                }
                this.logger.info(
                    `User ${contact.email} does not exist in Cognito. Continue`,
                );
                continue;
                /**
                 * We are currently not creating a user in cognito, as
                 * we can't migrate existing passwords from our DB to cognito.
                 * There might be other use-cases where we need to enable the
                 * account creation, and maybe trigger a PW reset email.
                 */
            } else {
                this.logger.info(`Updating user ${contact.email} in Cognito`);
                for (const u of cognitoUser) {
                    const channelName = contact.channels?.[0]?.name;
                    const userAttributes = [];
                    if (channelName === undefined) {
                        this.logger.warn(
                            `Contact ${contact.email} has no related sales channel`,
                        );
                    } else {
                        userAttributes.push({
                            Name: "custom:channel",
                            Value: channelName,
                        });
                    }
                    if (contact.externalIdentifier2) {
                        userAttributes.push({
                            Name: "custom:externalIdentifier2",
                            Value: contact.externalIdentifier2,
                        });
                    }
                    /**
                     * when the cognito user has no first and lastname, but we have internally,
                     * update these attributes
                     */
                    if (
                        !u.Attributes?.find(
                            (attr) => attr.Name === "given_name",
                        ) &&
                        contact.firstName
                    ) {
                        userAttributes.push({
                            Name: "given_name",
                            Value: contact.firstName,
                        });
                    }

                    if (
                        !u.Attributes?.find(
                            (attr) => attr.Name === "family_name",
                        ) &&
                        contact.lastName
                    ) {
                        userAttributes.push({
                            Name: "family_name",
                            Value: contact.lastName,
                        });
                    }

                    await this.updateUserAttributesInCognito(
                        u.Username!,
                        userAttributes,
                    );
                }
            }
        }

        await this.cronState.set({
            lastRun: now,
            lastRunStatus: "success",
        });
    }
}

// Authenticate with AWS cognito and pull a list of all users
// const getListOfUsersCommand = new ListUsersCommand({
//     UserPoolId: this.AWSCognitoApp.userPoolId,
// });
// const response = await this.cognitoClient.send(getListOfUsersCommand);
// console.log(JSON.stringify(response.Users, null, 2));
