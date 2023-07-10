// API client using axios and authenticating with oauth2 using client credentials.
// This is a singleton class, so it can be imported and used anywhere in the app.
// It is initialized here and is taking care of the authentication process.
// It takes the KencoveApiApp model as a parameter.
// It should use the url from "tokenEndpoint" to authenticate and then use the url from "apiEndpoint" to make the actual request.
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
    // get the access token from the api using the client credentials flow. Follow AWS Cognito OAuth2 documentation.
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

  // the request looks like this: {{apiEndpoint}}/ecom/address/kencove?from_date=2023-07-09T10:30:00Z&limit=200&offset=0
  // scrolling over all data can be done with the query parameters from_date, limit and offset. apiEndpoint is the url from the app model.
  // The response from the api looks like this:
  //   {
  //     "addresses": [
  //         {
  //             "street": "4122 FALLSTON RD",
  //             "additionalAddressLine": "",
  //             "zip": "28150-9269",
  //             "city": "SHELBY",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": null,
  //             "phone": "(980) 989-0679",
  //             "fullname": "Rhonda Lawter",
  //             "state": "NC",
  //             "createdAt": "2023-07-09T13:56:31.591909",
  //             "updatedAt": "2023-07-10T11:16:23.999798"
  //         },
  //         {
  //             "street": "BALLY COURCEY GLEN BRIEN",
  //             "additionalAddressLine": null,
  //             "zip": "Y21 C1F8",
  //             "city": "ENNSICORTHY",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": "DOYLE AGRI SERVICES LTD",
  //             "phone": "00353874704275",
  //             "fullname": "DOYLE AGRI SERVICES LTD",
  //             "state": "WX",
  //             "createdAt": "2023-07-06T15:09:28.111579",
  //             "updatedAt": "2023-07-10T11:26:31.927412"
  //         },
  //         {
  //             "street": "177 PINE TAVERN RD",
  //             "additionalAddressLine": null,
  //             "zip": "08343",
  //             "city": "MONROEVILLE",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": null,
  //             "phone": "8564664118",
  //             "fullname": "GREGORY PECK",
  //             "state": "NJ",
  //             "createdAt": "2023-07-10T11:59:36.332093",
  //             "updatedAt": "2023-07-10T11:59:36.332093"
  //         },
  //         {
  //             "street": "666 W GERMANTOWN PIKE, APT 1502",
  //             "additionalAddressLine": null,
  //             "zip": "19462",
  //             "city": "PLYMOUTH MEETING",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": null,
  //             "phone": "6107613346",
  //             "fullname": "JOAN SPIEGEL",
  //             "state": "PA",
  //             "createdAt": "2023-07-10T11:23:38.511496",
  //             "updatedAt": "2023-07-10T11:23:38.511496"
  //         },
  //         {
  //             "street": "554 FARMCREST RD",
  //             "additionalAddressLine": "",
  //             "zip": "24538-2163",
  //             "city": "CONCORD",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": "PEACELAND FARM",
  //             "phone": "(434) 332-2008",
  //             "fullname": "PEACELAND FARM",
  //             "state": "VA",
  //             "createdAt": "2019-12-28T01:02:51.333293",
  //             "updatedAt": "2023-07-10T12:00:43.974464"
  //         },
  //         {
  //             "street": "61 CROSSTOWN HWY",
  //             "additionalAddressLine": "",
  //             "zip": "18470-4515",
  //             "city": "UNION DALE",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": null,
  //             "phone": "(570) 280-7881",
  //             "fullname": "BRENDAN MURPHY",
  //             "state": "PA",
  //             "createdAt": "2017-09-14T00:00:00",
  //             "updatedAt": "2023-07-10T11:28:33.031184"
  //         },
  //         {
  //             "street": "2168 EASTEDGE DR",
  //             "additionalAddressLine": "",
  //             "zip": "43614-2059",
  //             "city": "TOLEDO",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": null,
  //             "phone": "(419) 389-9089",
  //             "fullname": "RIC LAVOY",
  //             "state": "OH",
  //             "createdAt": "2019-12-28T21:57:12.750577",
  //             "updatedAt": "2023-07-10T11:17:22.710253"
  //         },
  //         {
  //             "street": "PO BOX 634558",
  //             "additionalAddressLine": null,
  //             "zip": "45263-4558",
  //             "city": "Cincinnati",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": "TOTAL QUALITY LOGISTICS",
  //             "phone": "(800) 580-3101",
  //             "fullname": "TOTAL QUALITY LOGISTICS",
  //             "state": "OH",
  //             "createdAt": "2020-01-02T20:00:40.977236",
  //             "updatedAt": "2023-07-10T11:45:45.068566"
  //         },
  //         {
  //             "street": "155 NORTH 10TH ST",
  //             "additionalAddressLine": null,
  //             "zip": "15701-1725",
  //             "city": "INDIANA",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": "ICW VOCATIONAL SERVICES INC.",
  //             "phone": "(724) 349-1211",
  //             "fullname": "ICW VOCATIONAL SERVICES INC.",
  //             "state": "PA",
  //             "createdAt": "2020-01-02T20:00:22.870327",
  //             "updatedAt": "2023-07-10T11:58:26.055453"
  //         },
  //         {
  //             "street": "PO BOX 2240",
  //             "additionalAddressLine": "",
  //             "zip": "76902-2051",
  //             "city": "SAN ANGELO",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": "TWIN MOUNTAIN FENCE CO",
  //             "phone": "(325) 944-8661",
  //             "fullname": "TWIN MOUNTAIN FENCE CO",
  //             "state": "TX",
  //             "createdAt": "2017-02-17T00:00:00",
  //             "updatedAt": "2023-07-10T11:22:16.861023"
  //         },
  //         {
  //             "street": "DONALD HEBBARD",
  //             "additionalAddressLine": "PO BOX 55",
  //             "zip": "13775-0055",
  //             "city": "Franklin",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": "HEBBARD FENCE",
  //             "phone": "(607) 829-8664",
  //             "fullname": "HEBBARD FENCE",
  //             "state": "NY",
  //             "createdAt": "2020-11-15T13:21:07.539400",
  //             "updatedAt": "2023-07-10T11:44:31.154262"
  //         },
  //         {
  //             "street": "724 LOUISE AVE",
  //             "additionalAddressLine": null,
  //             "zip": "26505-5714",
  //             "city": "MORGANTOWN",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": null,
  //             "phone": "(304) 282-5774",
  //             "fullname": "Sarah Beamer",
  //             "state": "WV",
  //             "createdAt": "2021-04-02T15:35:56.244209",
  //             "updatedAt": "2023-07-10T10:54:21.549575"
  //         },
  //         {
  //             "street": "586 ARMBRUST HECLA RD",
  //             "additionalAddressLine": null,
  //             "zip": "15639-1038",
  //             "city": "HUNKER",
  //             "countryCode": "US",
  //             "countryArea": null,
  //             "company": null,
  //             "phone": "(724) 289-0349",
  //             "fullname": "KEVIN MCFEATERS",
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
