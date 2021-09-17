import {
  Sdk,
  getSdk,
  PermissionEnum,
  Product,
  ProductsQueryVariables,
} from "../generated/graphql";
import { DocumentNode } from "graphql";
import { GraphQLClient } from "graphql-request";
import { env } from "@chronark/env";
import { ECI_TRACE_HEADER } from "@eci/constants";
export type SaleorClient = {
  installApp: (tenantId: string) => Promise<{ id: string }>;
  getProducts: (variables: ProductsQueryVariables) => Promise<Product[]>;
};

export type SaleorSericeConfig = {
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

export class SaleorService implements SaleorClient {
  private client: Sdk;

  constructor(config: SaleorSericeConfig) {
    this.client = this.createGraphqlClient(
      config.graphqlEndpoint,
      config.traceId,
      config.token,
    );
  }

  private createGraphqlClient(
    url: string,
    traceId: string,
    token?: string,
  ): Sdk {
    async function requester<R, V>(doc: DocumentNode, vars?: V): Promise<R> {
      const graphqlClient = new GraphQLClient(url);
      graphqlClient.setHeader(ECI_TRACE_HEADER, traceId);
      if (token) {
        graphqlClient.setHeader("Authorization", `Bearer ${token}`);
      }
      const res = await graphqlClient.request(doc, vars);
      console.log(res);
      if (res.errors) {
        throw new Error(res.errors.map((e: { message: string }) => e.message));
      }

      return res;
    }

    return getSdk(requester);
  }

  /**
   * Installs the integrations app on saleor.
   * After the app is installed saleor will call the manifestUrl and provide us
   * with the necessary tokens etc.
   */
  public async installApp(tenantId: string): Promise<{ id: string }> {
    const baseUrl = env.require("ECI_BASE_URL");
    const res = await this.client.appInstall({
      input: {
        appName: "triebwork_eci_v2",
        manifestUrl: `${baseUrl}/api/saleor/manifest?tenantId=${tenantId}`,
        activateAfterInstallation: true,
        permissions: [
          PermissionEnum.ManageShipping,
          PermissionEnum.ManageProducts,
          PermissionEnum.ManageOrders,
          PermissionEnum.ManageGiftCard,
          PermissionEnum.ManageDiscounts,
          PermissionEnum.ManageCheckouts,
          PermissionEnum.ManageProductTypesAndAttributes,
        ],
      },
    });

    if (!res.appInstall) {
      throw new Error("Something went wrong");
    }

    if (res.appInstall.errors.length > 0) {
      throw new Error(JSON.stringify(res.appInstall.errors));
    }

    if (!res.appInstall.appInstallation?.id) {
      throw new Error(`Unable to create app, no id returned: ${res}`);
    }
    return { id: res.appInstall.appInstallation.id };
  }

  public async getProducts(
    variables: ProductsQueryVariables,
  ): Promise<Product[]> {
    const res = await this.client.products(variables);
    if (!res.products) {
      throw new Error(`No products found`);
    }
    return res.products.edges.map((edge) => edge.node) as Product[];
  }

  public async getToken(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const res = await this.client.tokenCreate({ email, password });
    if (!res.tokenCreate?.token) {
      throw new Error("Oh no");
    }
    return {
      token: res.tokenCreate.token,
    };
  }
}
