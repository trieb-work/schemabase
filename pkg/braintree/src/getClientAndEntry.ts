import { krypto } from "@eci/pkg/krypto";
import { PrismaClient } from "@eci/pkg/prisma";
import { BraintreeClient } from "./braintree";

const getBraintreeClientAndEntry = async (
    braintreeAppId: string,
    db: PrismaClient,
) => {
    const braintreeApp = await db.braintreeApp.findUnique({
        where: {
            id: braintreeAppId,
        },
    });
    if (!braintreeApp)
        throw new Error(
            `No braintree app found in DB for Id ${braintreeAppId}`,
        );

    const merchantId = await krypto.decrypt(braintreeApp.merchantId);
    const publicKey = await krypto.decrypt(braintreeApp.publicKey);
    const privateKey = await krypto.decrypt(braintreeApp.privateKey);
    const sandbox = braintreeApp.sandbox;

    const braintreeClient = new BraintreeClient({
        merchantId,
        publicKey,
        privateKey,
        sandbox,
    });

    return { braintreeClient, braintreeApp };
};
export { getBraintreeClientAndEntry };
