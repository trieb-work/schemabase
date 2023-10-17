import {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    AdminGetUserCommand,
    AdminUpdateUserAttributesCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {
    beforeEach,
    describe,
    jest,
    test,
    beforeAll,
    it,
    expect,
} from "@jest/globals";

const region = "us-east-1";
const userPoolId = "us-east-1_zpSqjJW1v";
const accessKeyId = "AKIA3N5X2FDCWXGWA64U";
const secretAccessKey = "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";

describe("CognitoUserSyncService", () => {
    it("should be able to get a list of users", async () => {
        // Authenticate with AWS cognito and pull a list of all users
        const client = new CognitoIdentityProviderClient({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });

        const getListOfUsersCommand = new ListUsersCommand({
            UserPoolId: userPoolId,
            Filter: 'email = "zinkljannik@gmail.com"',
            Limit: 60,
        });
        const updateUserCommand = new AdminUpdateUserAttributesCommand({
            UserPoolId: userPoolId,
            Username: "Google_106730792473939373406",
            UserAttributes: [
                {
                    Name: "custom:channel",
                    Value: "KEN-R",
                },
            ],
        });
        const response = await client.send(updateUserCommand);
        expect(response).toBeDefined();
    });
});
