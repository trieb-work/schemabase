import { createAppRegisterHandler } from "@saleor/app-sdk/handlers/next";

import { saleorApp } from "../../../../saleor-app";
import { AuthData } from "@saleor/app-sdk/APL";
import { SaleorAppType } from "@eci/pkg/prisma";

/**
 * This additional function is needed to add tenantId and AppType to our internal database.
 * The function is called after the Saleor SDK validated the request. We need this, because
 * for the Saleor SDK one App is one function is one database - but we have one database
 * for multiple different Saleor Apps and Tenants
 * @param request
 * @param context
 */
const additionalSchemabaseHandler = async (
  request: any,
  context: {
    authData?: AuthData;
    respondWithError: any;
  },
) => {
  console.log("being called", request.params, context?.authData?.appId);
  if (context?.authData?.appId && request?.params?.appType) {
    let saleorAppType: SaleorAppType | undefined;
    const tenantId = request?.params?.tenantId ?? undefined;
    switch (request?.params?.appType) {
      case "entitysync":
        saleorAppType = SaleorAppType.entitysync;

        break;

      case "prepayment":
        saleorAppType = SaleorAppType.prepayment;
        break;
      default:
        break;
    }
    const authDataExtended = { ...context.authData, tenantId, saleorAppType };

    await saleorApp.apl.set(authDataExtended);
  }
};

const handler = createAppRegisterHandler({
  apl: saleorApp.apl,
  onAuthAplSaved: additionalSchemabaseHandler,
});

export default handler;
