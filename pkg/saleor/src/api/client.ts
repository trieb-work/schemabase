import { getSdk, PageInfoMetaFragment, Sdk } from "./generated/graphql";
import { DocumentNode } from "graphql";
import { GraphQLClient } from "graphql-request";
import { ECI_TRACE_HEADER } from "@eci/pkg/constants";
import { InstalledSaleorApp, PrismaClient, SaleorApp } from "@eci/pkg/prisma";
import { sleep } from "@eci/pkg/miscHelper/time";

export interface SaleorServiceConfig {
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
}

export type SaleorClient = Sdk;

export function createSaleorClient({
  traceId,
  graphqlEndpoint,
  token,
}: SaleorServiceConfig): SaleorClient {
  async function requester<R, V>(doc: DocumentNode, vars?: V): Promise<R> {
    if (!graphqlEndpoint.startsWith("http"))
      throw new Error(
        // eslint-disable-next-line max-len
        `The GraphQL endpoint needs to be a full URL starting with http or https. Received: ${graphqlEndpoint}`,
      );
    const graphqlClient = new GraphQLClient(graphqlEndpoint);
    graphqlClient.setHeader(ECI_TRACE_HEADER, traceId);
    graphqlClient.setHeader(
      "user-agent",
      "eci-service/1.0 (+https://trieb.work)",
    );
    if (token) {
      graphqlClient.setHeader("Authorization", `Bearer ${token}`);
    }
    const res = await graphqlClient.request(doc, vars);
    // If we throw an error here, we can't handle that later
    // if (res.errors) {
    //   throw new Error(res.errors.map((e: { message: string }) => e.message));
    // }

    return res;
  }

  return getSdk(requester);
}

interface SaleorAppMandatoryTenantId extends SaleorApp {
  tenantId: string;
}

/**
 * Get all needed authentication data from the db and create a valid saleor client from it
 * @param installedSaleorAppId
 * @param prisma
 * @returns
 */
export async function getSaleorClientAndEntry(
  installedSaleorAppId: string,
  prisma: PrismaClient,
) {
  const installedSaleorApp = await prisma.installedSaleorApp.findUnique({
    where: {
      id: installedSaleorAppId,
    },
    include: { saleorApp: true },
  });
  if (!installedSaleorApp)
    throw new Error(
      `Could not find installed saleor app with provided id ${installedSaleorAppId}`,
    );
  if (!installedSaleorApp.saleorApp.tenantId)
    throw new Error(
      `Saleor App ${installedSaleorApp.saleorApp.id} has no tenant connected`,
    );
  const client = createSaleorClient({
    graphqlEndpoint: installedSaleorApp.saleorApp.apiUrl,
    token: installedSaleorApp.token,
    traceId: `tr_${(Math.random() + 1).toString(36).substring(2)}`,
  });
  return {
    client,
    installedSaleorApp: installedSaleorApp as InstalledSaleorApp & {
      saleorApp: SaleorAppMandatoryTenantId;
    },
  };
}

type PagedSaleorResult<ResultNode, EntryName extends string> = Record<
  EntryName,
  {
    pageInfo: PageInfoMetaFragment;
    edges: Array<{
      node: ResultNode;
    }>;
  }
>;
type PagedSaleorQuery<ResultNode, EntryName extends string> =
  | PagedSaleorResult<ResultNode, EntryName>
  | {
      __typename?: "Query";
    };

/**
 * Recursively query saleor
 * @param cursor
 * @param results
 * @returns
 */
export async function queryWithPagination<
  EntryName extends string,
  SpecificPagedSaleorQuery extends PagedSaleorQuery<ResultNode, EntryName>,
  ResultNode = any,
>(
  client: (cursor: {
    first: number;
    after: string;
  }) => Promise<SpecificPagedSaleorQuery>,
  first: number = 100,
): Promise<SpecificPagedSaleorQuery> {
  const recQueryWithPagination = async (
    firstInner: number,
    after: string,
    resultAkkumulator?: PagedSaleorResult<ResultNode, EntryName>,
  ): Promise<PagedSaleorResult<ResultNode, EntryName>> => {
    const res = await client({ first: firstInner, after });
    const resultEntries = Object.entries(res).filter(
      ([key]) => key !== "__typename",
    ) as Array<
      [EntryName, PagedSaleorResult<ResultNode, EntryName>[EntryName]]
    >;
    if (resultEntries.length > 1)
      throw new Error(
        `Only one result entrie is allowed. Used following entries: ${Object.keys(
          res,
        )}`,
      );
    if (resultEntries.length === 0)
      throw new Error(
        `No result entrie provided. Used following entries: ${Object.keys(
          res,
        )}`,
      );
    const [singleEntryKey, singleEntryValue] = resultEntries[0];
    let newResultAkkumulator:
      | PagedSaleorResult<ResultNode, EntryName>
      | undefined = resultAkkumulator;
    if (typeof newResultAkkumulator === "undefined") {
      newResultAkkumulator = {
        [singleEntryKey]: singleEntryValue,
      } as PagedSaleorResult<ResultNode, EntryName>;
    } else {
      newResultAkkumulator[singleEntryKey].edges = newResultAkkumulator[
        singleEntryKey
      ].edges.concat(singleEntryValue.edges);
    }
    if (singleEntryValue.pageInfo.hasNextPage) {
      if (!singleEntryValue.pageInfo.endCursor)
        throw new Error(`No endCursor provided by query result. res: ${res}`);
      /**
       * A little sleep to not run into throttling issues
       */
      await sleep(800);
      return recQueryWithPagination(
        firstInner,
        singleEntryValue.pageInfo.endCursor,
        newResultAkkumulator,
      );
    }
    return newResultAkkumulator;
  };
  return recQueryWithPagination(first, "") as Promise<SpecificPagedSaleorQuery>;
}
