import { ExtendContextFn } from "../context"
import {
  ContextMissingFieldError,
  MissingHTTPBodyError,
  MissingHTTPHeaderError,
} from "@eci/util/errors"
import { NextApiRequest } from "next"
import { GraphqlClient, createGraphqlClient } from "@eci/graphql-client"

export type Saleor = {
  // clientId: string
  // clientSecret: string
  graphqlClient: GraphqlClient
}

/**
 * Fetch the client's configuration and expose it to the context
 */
export const setupSaleor =
  (req: {
    domain: string
    authToken: string
    event: string
    signature: string
    appToken: string
  }): ExtendContextFn<"saleor"> =>
  async (ctx) => {
    if (!ctx.prisma) {
      throw new ContextMissingFieldError("prisma")
    }
    if (!ctx.elasticSearch) {
      throw new ContextMissingFieldError("elasticSearch")
    }
    if (!ctx.logger) {
      throw new ContextMissingFieldError("logger")
    }

    const unauthenticatedSaleorGraphqlClient = createGraphqlClient(`https://${req.domain}/graphql/`)

    return { ...ctx, saleor: { graphqlClient: unauthenticatedSaleorGraphqlClient } }
  }
