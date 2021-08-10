import { GraphqlClient } from "@eci/graphql-client";
import {
  GetShopDomainQuery,
  VerifyAppTokenMutation,
  VerifyAppTokenMutationVariables,
  VerifyTokenMutation,
  VerifyTokenMutationVariables,
} from "@eci/types/graphql/global";
import {
  getShopDomain,
  verifyAppTokenMutation,
  verifyTokenQuery,
} from "./saleor.gql";

/**
 * Run the verifyTokenQuery against Saleor
 * @param token
 */
export const verifyUserToken = async (client: GraphqlClient, token: string) => {
  const verifyResult = await client.mutate<
    VerifyTokenMutation,
    VerifyTokenMutationVariables
  >({
    mutation: verifyTokenQuery,
    variables: {
      token,
    },
  });
  return verifyResult.data?.tokenVerify?.isValid || false;
};

/**
 * Run the verifyAppTokenQuery against Saleor
 * @param token
 */
export const verifyAppToken = async (client: GraphqlClient, token: string) => {
  const verifyResult = await client.mutate<
    VerifyAppTokenMutation,
    VerifyAppTokenMutationVariables
  >({
    mutation: verifyAppTokenMutation,
    variables: {
      token,
    },
  });
  return verifyResult.data?.appTokenVerify?.valid || false;
};

export const getLoginSession = async (client: GraphqlClient, token: string) => {
  const validity = await verifyUserToken(client, token);
  if (!validity) {
    return null;
  }
  const userSessionResult = await client.query<GetShopDomainQuery>({
    query: getShopDomain,
  });
  return userSessionResult.data?.shop?.domain;
};
