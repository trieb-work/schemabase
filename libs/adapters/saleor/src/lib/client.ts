import { Sdk, getSdk, PermissionEnum } from "../generated/graphql";
import { DocumentNode } from "graphql";
import { GraphQLClient } from "graphql-request";
import { env } from "@eci/util/env";

export type SaleorClient = {
  installApp: (tenantId: string) => Promise<void>;
};

export type SaleorSericeConfig = {
  graphqlEndpoint: string;
  token?: string;
};

export class SaleorService implements SaleorClient {
  private client: Sdk;

  constructor(config: SaleorSericeConfig) {
    this.client = this.createGraphqlClient(
      config.graphqlEndpoint,
      config.token,
    );
  }

  private createGraphqlClient(url: string, token?: string): Sdk {
    async function requester<R, V>(doc: DocumentNode, vars?: V): Promise<R> {
      const graphqlClient = new GraphQLClient(url);
      if (token) {
        graphqlClient.setHeader("Authorization", `JWT ${token}`);
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
  public async installApp(tenantId: string): Promise<void> {
    const baseUrl = env.require("ECI_BASE_URL");
    await this.client.appInstall({
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
