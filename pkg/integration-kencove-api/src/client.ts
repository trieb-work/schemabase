// API client using axios and authenticating with oauth2 using client credentials.
// This is a singleton class, so it can be imported and used anywhere in the app.
// It is initialized here and is taking care of the authentication process.
// It takes the KencoveApiApp model as a parameter.
// It should use the url from "tokenEndpoint" to authenticate and then use the url
// from "apiEndpoint" to make the actual request.
// The model is defined in the file: pkg/integration-kencove-api/src/client.ts

import axios, { AxiosInstance } from "axios";
import { KencoveApiApp } from "@eci/pkg/prisma";
import url from "url";
import {
  KencoveApiAddress,
  KencoveApiAttribute,
  KencoveApiCategory,
  KencoveApiOrder,
  KencoveApiPackage,
  KencoveApiProduct,
  KencoveApiProductStock,
} from "./types";
import { addDays, isAfter } from "date-fns";
import jwt from "jsonwebtoken";

export class KencoveApiClient {
  private static instance: KencoveApiClient;

  private axiosInstance: AxiosInstance;

  private app: KencoveApiApp;

  private jwt: string = "";

  constructor(app: KencoveApiApp) {
    this.app = app;
    this.axiosInstance = axios.create({
      baseURL: app.apiEndpoint,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static getInstance(app: KencoveApiApp): KencoveApiClient {
    if (!KencoveApiClient.instance) {
      KencoveApiClient.instance = new KencoveApiClient(app);
    }
    return KencoveApiClient.instance;
  }

  /**
   * Returns a valid access token. If the current access token is expired,
   * it will pull a new one from the api. If the current access token is still valid,
   * it will return the current access token.
   * @returns
   */
  public async getAccessToken(): Promise<string> {
    // get the access token from the api using the client credentials flow.
    // Follow AWS Cognito OAuth2 documentation.
    // Handle errors and return the access token. Store the access token in the class
    // so it can be used for subsequent requests. Always only pull a fresh access token
    // if the current one is expired or does not exist.
    if (this.jwt) {
      const decoded = jwt.decode(this.jwt, { json: true });
      if (
        decoded &&
        decoded.exp &&
        /**
         * is the first date after the second date?
         */
        isAfter(new Date(decoded.exp * 1000), new Date())
      ) {
        return this.jwt;
      }
    }

    try {
      const response = await axios.request({
        method: "post",
        url: this.app.tokenEndpoint,
        auth: {
          username: this.app.clientId,
          password: this.app.clientSecret,
        },
        data: new url.URLSearchParams({
          grant_type: "client_credentials",
          scope: this.app.scope,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      this.jwt = response.data.access_token;
      return this.jwt;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get addresses yield, that is returning data
   * the continuasly, instead of returning all the data at once.
   * Consume it with a for await loop.
   */
  public async *getAddressesStream(
    fromDate: Date,
  ): AsyncIterableIterator<KencoveApiAddress[]> {
    let nextPage: string | null = null;
    let offset: number = 0;
    do {
      const accessToken = await this.getAccessToken();
      const response = await this.getAddressesPage(
        fromDate,
        offset,
        accessToken,
      );
      yield response.data;
      nextPage = response.next_page;
      offset += 200;
    } while (nextPage);
  }

  /**
   * pull the addresses - as we might have a lot here, we send
   * two api requests in parallel
   * @param fromDate
   * @returns
   */
  public async getAddresses(fromDate: Date): Promise<KencoveApiAddress[]> {
    const accessToken = await this.getAccessToken();
    const addresses: KencoveApiAddress[] = [];

    let nextPage: string | null = null;
    let offset1: number = 0;
    let offset2: number = 200; // start the second call with an offset of 200

    do {
      const [response1, response2] = await Promise.all([
        this.getAddressesPage(fromDate, offset1, accessToken),
        this.getAddressesPage(fromDate, offset2, accessToken),
      ]);

      addresses.push(...response1.data, ...response2.data);

      nextPage = response1.next_page || response2.next_page;

      offset1 += 400; // increase offset1 by 400 since you're making two requests in parallel
      offset2 += 400; // increase offset2 by 400
    } while (nextPage);

    console.debug(`Found ${addresses.length} addresses`);
    return addresses;
  }

  private async getAddressesPage(
    fromDate: Date,
    offset: number,
    accessToken: string,
  ): Promise<{
    data: KencoveApiAddress[];
    result_count: number;
    next_page: string;
  }> {
    const response = await this.axiosInstance.get(
      `/ecom/address/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  }

  public async getProducts(fromDate: Date): Promise<KencoveApiProduct[]> {
    const accessToken = await this.getAccessToken();
    const products: KencoveApiProduct[] = [];
    let nextPage: string | null = null;
    let offset: number = 0;
    do {
      const response = await this.getProductsPage(
        fromDate,
        offset,
        accessToken,
      );
      products.push(...response.data);
      nextPage = response.next_page;
      offset += 200;
    } while (nextPage);
    console.debug(`Found ${products.length} products`);
    return products;
  }

  private async getProductsPage(
    fromDate: Date,
    offset: number,
    accessToken: string,
  ): Promise<{
    data: KencoveApiProduct[];
    result_count: number;
    next_page: string;
  }> {
    const response = await axios.get(
      `https://api-kencove.gc.staging-kencove.com/ecom/product/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}&to_date=${new Date().toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  }

  public async getAttributes(fromDate: Date): Promise<KencoveApiAttribute[]> {
    const accessToken = await this.getAccessToken();
    const attributes: KencoveApiAttribute[] = [];
    let nextPage: string | null = null;
    let offset: number = 0;
    do {
      const response = await this.getAttributesPage(
        fromDate,
        offset,
        accessToken,
      );
      attributes.push(...response.data);
      nextPage = response.next_page;
      offset += 200;
    } while (nextPage);
    console.debug(`Found ${attributes.length} attributes`);
    return attributes;
  }

  private async getAttributesPage(
    fromDate: Date,
    offset: number,
    accessToken: string,
  ): Promise<{
    data: KencoveApiAttribute[];
    result_count: number;
    next_page: string;
  }> {
    const response = await this.axiosInstance.get(
      `/ecom/attributes/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  }

  public async getCategories(fromDate: Date): Promise<KencoveApiCategory[]> {
    const accessToken = await this.getAccessToken();
    const categories: KencoveApiCategory[] = [];
    let nextPage: string | null = null;
    let offset: number = 0;
    do {
      const response = await this.getCategoriesPage(
        fromDate,
        offset,
        accessToken,
      );
      categories.push(...response.data);
      nextPage = response.next_page;
      offset += 200;
    } while (nextPage);
    console.debug(`Found ${categories.length} categories`);
    return categories;
  }

  private async getCategoriesPage(
    fromDate: Date,
    offset: number,
    accessToken: string,
  ): Promise<{
    data: KencoveApiCategory[];
    result_count: number;
    next_page: string;
  }> {
    const response = await this.axiosInstance.get(
      `/ecom/categories/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  }

  public async getPackages(fromDate: Date): Promise<KencoveApiPackage[]> {
    const accessToken = await this.getAccessToken();
    const packages: KencoveApiPackage[] = [];
    let nextPage: string | null = null;
    let offset: number = 0;
    do {
      const response = await this.getPackagesPage(
        fromDate,
        offset,
        accessToken,
      );
      packages.push(...response.data);
      nextPage = response.next_page;
      offset += 200;
    } while (nextPage);
    console.debug(`Found ${packages.length} packages`);
    return packages;
  }

  private async getPackagesPage(
    fromDate: Date,
    offset: number,
    accessToken: string,
  ): Promise<{
    data: KencoveApiPackage[];
    result_count: number;
    next_page: string;
  }> {
    const response = await this.axiosInstance.get(
      `/ecom/packages/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  }

  public async getProductStocks(
    fromDate: Date,
  ): Promise<KencoveApiProductStock[]> {
    const accessToken = await this.getAccessToken();
    const productStocks: KencoveApiProductStock[] = [];
    let nextPage: string | null = null;
    let offset: number = 0;
    do {
      const response = await this.getProductStocksPage(
        fromDate,
        offset,
        accessToken,
      );
      productStocks.push(...response.data);
      nextPage = response.next_page;
      offset += 200;
    } while (nextPage);
    console.debug(`Found ${productStocks.length} productStocks`);
    return productStocks;
  }

  private async getProductStocksPage(
    fromDate: Date,
    offset: number,
    accessToken: string,
  ): Promise<{
    data: KencoveApiProductStock[];
    result_count: number;
    next_page: string;
  }> {
    const response = await this.axiosInstance.get(
      `/ecom/stock/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  }

  /**
   * Stream orders, 200 at a time. Use it with a for await loop.
   * @param fromDate
   */
  public async *getOrdersStream(
    fromDate: Date,
  ): AsyncIterableIterator<KencoveApiOrder[]> {
    let nextPage: string | null = null;
    let offset: number = 0;
    let toDate = addDays(fromDate, 1);
    do {
      const accessToken = await this.getAccessToken();

      const response = await this.getOrdersPage(
        fromDate,
        toDate,
        offset,
        accessToken,
      );
      yield response.data;
      nextPage = response.next_page;
      offset += 200;
      if (!nextPage) {
        fromDate = toDate;
        toDate = addDays(toDate, 1);
        offset = 0;
        if (isAfter(fromDate, new Date())) {
          break;
        }
        const checkResponse = await this.getOrdersPage(
          fromDate,
          toDate,
          offset,
          accessToken,
        );
        nextPage = checkResponse.next_page;
      }
      console.debug("request", response.result_count);
    } while (nextPage);
  }

  // public async getOrders(fromDate: Date): Promise<KencoveApiOrder[]> {
  //   const accessToken = await this.getAccessToken();
  //   const orders: KencoveApiOrder[] = [];
  //   let nextPage: string | null = null;
  //   let offset: number = 0;
  //   do {
  //     const response = await this.getOrdersPage(fromDate, offset, accessToken);
  //     orders.push(...response.data);
  //     nextPage = response.next_page;
  //     offset += 200;
  //     console.debug(`Found ${orders.length} orders / offset: ${offset}`);
  //   } while (nextPage);
  //   return orders;
  // }

  private async getOrdersPage(
    fromDate: Date,
    toDate: Date,
    offset: number,
    accessToken: string,
  ): Promise<{
    data: KencoveApiOrder[];
    result_count: number;
    next_page: string;
  }> {
    const response = await this.axiosInstance.get(
      // eslint-disable-next-line max-len
      `/ecom/orders/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}&to_date=${toDate.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  }
}
