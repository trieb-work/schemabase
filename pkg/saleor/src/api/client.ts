import { getSdk, Sdk } from "./generated/graphql";
import { DocumentNode } from "graphql";
import { GraphQLClient } from "graphql-request";
import { ECI_TRACE_HEADER } from "@eci/pkg/constants";

export type SaleorServiceConfig = {
  /**
   * Unique id to trace requests across systems
   */
  traceId: string;
  /**
   * The full url of your saleor graphql instance
   * @example http://localhost:3000/graphql
   */
  graphqlEndpoint: string;

  /**
   * Optionally set a bearer token which will be sent via the Authorization header
   */
  token?: string;
};

export type SaleorClient = Sdk;

export function createSaleorClient({
  traceId,
  graphqlEndpoint,
  token,
}: SaleorServiceConfig): SaleorClient {
  async function requester<R, V>(doc: DocumentNode, vars?: V): Promise<R> {
    const graphqlClient = new GraphQLClient(graphqlEndpoint);
    graphqlClient.setHeader(ECI_TRACE_HEADER, traceId);
    if (token) {
      graphqlClient.setHeader("Authorization", `Bearer ${token}`);
    }
    const res = await graphqlClient.request(doc, vars);
    if (res.errors) {
      throw new Error(res.errors.map((e: { message: string }) => e.message));
    }

    return res;
  }

  return getSdk(requester);
}
