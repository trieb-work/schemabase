import {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { describe, it, expect } from "@jest/globals";

const region = "us-east-1";
const userPoolId = "us-east-1_zpSqjJW1v";
const accessKeyId = process.env.AWS_IAM_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_IAM_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS IAM credentials are not set");
}

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
        const response2 = await client.send(getListOfUsersCommand);
        expect(response).toBeDefined();
        expect(response2).toBeDefined();
    });
});
