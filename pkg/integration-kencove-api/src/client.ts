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

type KencoveApiAddress = {
  street: string | null;
  additionalAddressLine: string | null;
  zip: string | null;
  city: string | null;
  countryCode: string | null;
  countryArea: string | null;
  company: string | null;
  phone: string | null;
  fullname: string | null;
  state: string | null;
  createdAt: string;
  updatedAt: string;
};

export class KencoveApiClient {
  private static instance: KencoveApiClient;
  private axiosInstance: AxiosInstance;
  private app: KencoveApiApp;

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

  public async getAccessToken(): Promise<string> {
    // get the access token from the api using the client credentials flow.
    // Follow AWS Cognito OAuth2 documentation.
    // Handle errors
    // and return the access token.

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
      console.debug(response.data);
      return response.data.access_token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // The response from the api looks like this:
  //   {
  //     "addresses": [
  //         {
  //             "street": "586 ARMBRUST TEST RD",
  //             "additionalAddressLine": null,
  //             "zip": "15639-1038",
  //             "city": "HUNKER",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": null,
  //             "phone": "(724) 734683",
  //             "fullname": "KEVIN TEST",
  //             "state": "PA",
  //             "createdAt": "2023-06-24T13:32:34.426648",
  //             "updatedAt": "2023-07-10T11:52:17.181158"
  //         }
  //     ],
  //     "result_count": 19,
  //     "next_page": null
  // }
  public async getAddresses(fromDate: Date): Promise<KencoveApiAddress[]> {
    const accessToken = await this.getAccessToken();
    const addresses: KencoveApiAddress[] = [];
    let nextPage: string | null = null;
    let offset: number = 0;
    do {
      const response = await this.getAddressesPage(
        fromDate,
        offset,
        accessToken,
      );
      console.debug(response);
      addresses.push(...response.addresses);
      nextPage = response.next_page;
      offset += 200;
    } while (nextPage);
    console.debug(`Found ${addresses.length} addresses`);
    return addresses;
  }

  private async getAddressesPage(
    fromDate: Date,
    offset: number,
    accessToken: string,
  ): Promise<any> {
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
}
