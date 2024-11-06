/* eslint-disable import/no-extraneous-dependencies */
import { ILogger } from "@eci/pkg/logger";
import { AWSCognitoApp, Prisma, PrismaClient } from "@eci/pkg/prisma";
import {
    AdminGetUserCommand,
    AdminGetUserCommandOutput,
    AdminUpdateUserAttributesCommand,
    CognitoIdentityProvider,
    CognitoIdentityProviderServiceException,
    ListUsersCommand,
    ListUsersCommandOutput,
    ListUsersResponse,
    // AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";

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

    private async getCognitoUser(
        username: string,
    ): Promise<AdminGetUserCommandOutput | undefined> {
        const getUserCommand = new AdminGetUserCommand({
            UserPoolId: this.AWSCognitoApp.userPoolId,
            Username: username,
        });

        try {
            const response = await this.cognitoClient.send(getUserCommand);
            return response;
        } catch (error) {
            if (error instanceof CognitoIdentityProviderServiceException) {
                if (error.name === "UserNotFoundException") {
                    this.logger.error(`User ${username} not found in Cognito`);
                    return undefined;
                }
            }

            this.logger.error(`Error getting user ${username} in Cognito`);
            this.logger.error(JSON.stringify(error));
            return undefined;
        }
    }

    /**
     * We search for a user in AWS cognito using the email address as search parameter.
     * We use the ListUsersCommand to search for the email attribute. Can return multiple identities
     * @param email
     */
    public async getCognitoUserByEmail(
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
         * pull all cognito users
         */
        const allCognitoUsers = await this.getAllCognitoUsers();

        if (!allCognitoUsers) {
            this.logger.info("No users found in cognito");
            return;
        }

        const existingCognitoUsers = await this.db.aWSCognitoUser.findMany({
            where: {
                awsCognitoAppId: this.AWSCognitoApp.id,
                id: {
                    in: allCognitoUsers.map((user) => user.Username!),
                },
            },
        });

        this.logger.info(
            `Found ${allCognitoUsers.length} users in cognito, ${existingCognitoUsers.length} already in our DB`,
        );

        const existingCognitoUserIds = existingCognitoUsers.map(
            (user) => user.id,
        );
        const newCognitoUsers = allCognitoUsers.filter(
            (user) => !existingCognitoUserIds.includes(user.Username!),
        );

        this.logger.info(
            `Found ${newCognitoUsers.length} new users in cognito`,
            {
                newCognitoUsers: newCognitoUsers.map((user) => user.Username),
            },
        );

        /**
         * create the new users in our DB
         */
        for (const user of newCognitoUsers) {
            const email = user.Attributes?.find(
                (attribute) => attribute.Name === "email",
            )?.Value?.toLowerCase();
            const firstName = user.Attributes?.find(
                (attribute) => attribute.Name === "given_name",
            )?.Value;
            const lastName = user.Attributes?.find(
                (attribute) => attribute.Name === "family_name",
            )?.Value;
            if (!email) {
                this.logger.error(
                    `User ${user.Username} has no email attribute`,
                );
                continue;
            }
            try {
                this.logger.debug(`Creating user ${user.Username} in our DB`, {
                    email,
                    firstName,
                    lastName,
                });
                await this.db.aWSCognitoUser.create({
                    data: {
                        id: user.Username!,
                        awsCognitoApp: {
                            connect: {
                                id: this.AWSCognitoApp.id,
                            },
                        },
                        contact: {
                            connectOrCreate: {
                                where: {
                                    email_tenantId: {
                                        email,
                                        tenantId: this.tenantId,
                                    },
                                },
                                create: {
                                    id: id.id("contact"),
                                    email,
                                    firstName,
                                    lastName,
                                    tenant: {
                                        connect: {
                                            id: this.tenantId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2025") {
                        this.logger.info(
                            `User ${user.Username} has no contact`,
                        );
                        continue;
                    } else {
                        this.logger.error(
                            `Error creating user ${user.Username} in our DB`,
                        );
                        this.logger.error(JSON.stringify(error));
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
        const contacts = await this.db.aWSCognitoUser.findMany({
            where: {
                awsCognitoAppId: this.AWSCognitoApp.id,
                contact: {
                    tenantId: this.tenantId,
                    updatedAt: {
                        gte: gteDate,
                    },
                },
            },
            include: {
                contact: {
                    include: {
                        channels: true,
                    },
                },
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
            this.logger.info(`Syncing contact ${contact.contact.email}`);
            const cognitoUser = await this.getCognitoUser(contact.id);
            if (cognitoUser === undefined) {
                this.logger.info(
                    `User ${contact.contact.email} does not exist in Cognito. Deleting user from our DB`,
                );
                await this.db.aWSCognitoUser.delete({
                    where: {
                        id_awsCognitoAppId: {
                            id: contact.id,
                            awsCognitoAppId: this.AWSCognitoApp.id,
                        },
                    },
                });
                continue;
                /**
                 * We are currently not creating a user in cognito, as
                 * we can't migrate existing passwords from our DB to cognito.
                 * There might be other use-cases where we need to enable the
                 * account creation, and maybe trigger a PW reset email.
                 */
            } else {
                // Build the desired attributes
                const userAttributes = [];
                const channelName = contact.contact.channels?.[0]?.name;

                if (channelName !== undefined) {
                    const currentChannel = cognitoUser.UserAttributes?.find(
                        (attr) => attr.Name === "custom:channel",
                    )?.Value;
                    if (currentChannel !== channelName) {
                        userAttributes.push({
                            Name: "custom:channel",
                            Value: channelName,
                        });
                    }
                } else {
                    this.logger.warn(
                        `Contact ${contact.contact.email} has no related sales channel`,
                    );
                }

                if (contact.contact.externalIdentifier2) {
                    const currentIdentifier = cognitoUser.UserAttributes?.find(
                        (attr) => attr.Name === "custom:externalIdentifier2",
                    )?.Value;
                    if (
                        currentIdentifier !==
                        contact.contact.externalIdentifier2
                    ) {
                        userAttributes.push({
                            Name: "custom:externalIdentifier2",
                            Value: contact.contact.externalIdentifier2,
                        });
                    }
                }

                /**
                 * update the first name only if there is no first name in cognito
                 */
                if (
                    contact.contact.firstName &&
                    !cognitoUser.UserAttributes?.find(
                        (attr) =>
                            attr.Name === "given_name" &&
                            attr.Value === contact.contact.firstName,
                    )
                ) {
                    userAttributes.push({
                        Name: "given_name",
                        Value: contact.contact.firstName,
                    });
                }

                if (
                    contact.contact.lastName &&
                    !cognitoUser.UserAttributes?.find(
                        (attr) =>
                            attr.Name === "family_name" &&
                            attr.Value === contact.contact.lastName,
                    )
                ) {
                    userAttributes.push({
                        Name: "family_name",
                        Value: contact.contact.lastName,
                    });
                }

                // Only update if there are changes
                if (userAttributes.length > 0) {
                    this.logger.info(
                        `Updating user ${contact.contact.email} in Cognito with changed attributes`,
                    );
                    await this.updateUserAttributesInCognito(
                        cognitoUser.Username!,
                        userAttributes,
                    );
                } else {
                    this.logger.info(
                        `No changes detected for user ${contact.contact.email}, skipping update`,
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
