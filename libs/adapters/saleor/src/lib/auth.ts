import { GraphqlClient } from "@eci/graphql-client"
import {
  GetShopDomainQuery,
  ShopInfoQuery,
  VerifyAppTokenMutation,
  VerifyAppTokenMutationVariables,
  VerifyTokenMutation,
  VerifyTokenMutationVariables,
} from "gqlTypes/globalTypes"
import { getShopDomain, verifyAppTokenMutation, verifyTokenQuery } from "lib/gql/saleor.gql"
import { NextApiRequest } from "next"
import { AuthChecker } from "type-graphql"

/**
 * Run the verifyTokenQuery against Saleor
 * @param token
 */
export const verifyUserToken = async (client: GraphqlClient, token: string) => {
  const verifyResult = await client.mutate<VerifyTokenMutation, VerifyTokenMutationVariables>({
    mutation: verifyTokenQuery,
    variables: {
      token,
    },
  })
  return verifyResult.data?.tokenVerify?.isValid || false
}

/**
 * Run the verifyAppTokenQuery against Saleor
 * @param token
 */
export const verifyAppToken = async (client: GraphqlClient, token: string) => {
  const verifyResult = await client.mutate<VerifyAppTokenMutation, VerifyAppTokenMutationVariables>(
    {
      mutation: verifyAppTokenMutation,
      variables: {
        token,
      },
    },
  )
  return verifyResult.data?.appTokenVerify?.valid || false
}

export const getLoginSession = async (client: GraphqlClient, token: string) => {
  const validity = await verifyUserToken(client, token)
  if (!validity) {
    return null
  }
  const userSessionResult = await client.query<GetShopDomainQuery>({
    query: getShopDomain,
  })
  return userSessionResult.data?.shop?.domain
}
