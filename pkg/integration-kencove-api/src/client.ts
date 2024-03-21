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
    KencoveApiContact,
    KencoveApiOrder,
    KencoveApiPackage,
    KencoveApiPayment,
    KencoveApiPricelist,
    KencoveApiProduct,
    KencoveApiProductStock,
} from "./types";
import { addDays, formatDistance, isAfter, isBefore } from "date-fns";
import jwt from "jsonwebtoken";
import { ILogger } from "@eci/pkg/logger";

export class KencoveApiClient {
    private static instance: KencoveApiClient;

    private axiosInstance: AxiosInstance;

    private app: KencoveApiApp;

    private readonly logger: ILogger;

    private jwt: string = "";

    constructor(app: KencoveApiApp, logger: ILogger) {
        this.app = app;
        this.logger = logger;
        this.axiosInstance = axios.create({
            baseURL: app.apiEndpoint,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static getInstance(
        app: KencoveApiApp,
        logger: ILogger,
    ): KencoveApiClient {
        if (!KencoveApiClient.instance) {
            KencoveApiClient.instance = new KencoveApiClient(app, logger);
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
                 * The token is normally valid 1h, but we want to refresh
                 * 30 minutes before expiration.
                 */
                isAfter(
                    new Date(decoded.exp * 1000 - 30 * 60 * 1000),
                    new Date(),
                )
                // isAfter(new Date(decoded.exp * 1000), new Date())
            ) {
                this.logger.debug(
                    `Using cached access token. Expires in ${formatDistance(
                        new Date(),
                        new Date(decoded.exp * 1000),
                    )}`,
                );
                return this.jwt;
            }
        }

        try {
            this.logger.debug("Requesting new access token");
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
     * A generic method to stream API data, automatically managing paging and window size.
     * Correctly accesses nested data within the API response.
     *
     * @param endpoint - The specific API endpoint after the baseURL.
     * @param fromDate - The start date for the data fetching window.
     * @param windowSize - Number of days to fetch data for in each iteration.
     * @param limit - Number of records to fetch per page.
     * @param extraParams - Additional URL parameters.
     */
    public async *streamApiData<T>(
        endpoint: string,
        fromDate: Date,
        windowSize: number = 3,
        limit: number = 200,
        extraParams: string = "",
    ): AsyncIterableIterator<T[]> {
        let toDate = addDays(new Date(), windowSize);
        let offset = 0;
        while (isBefore(fromDate, new Date())) {
            do {
                const accessToken = await this.getAccessToken();
                const response = await this.axiosInstance.get(
                    `${endpoint}?limit=${limit}&offset=${offset}&from_date=${fromDate.toISOString()}&to_date=${toDate.toISOString()}${extraParams}`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    },
                );

                const responseData = response.data.data; // Correctly accessing the nested data
                if (!responseData || responseData.length === 0) break; // If no data, exit loop

                yield responseData;
                offset += limit;
            } while (true); // Implement actual next page logic based on API response

            fromDate = addDays(toDate, 1); // Move to the next window
            toDate = addDays(fromDate, windowSize);
            offset = 0; // Reset offset for the next window
        }
    }

    /**
     * Stream addresses, 200 at a time. Use it with a for await loop.
     * We have to combine from and to to create an efficient sliding window
     * to efficiently pull orders from the api.
     * @param fromDate
     */
    public async *getAddressesStream(
        fromDate: Date,
    ): AsyncIterableIterator<KencoveApiAddress[]> {
        const WINDOW_SIZE = 3;
        const LIMIT = 200;

        while (isBefore(fromDate, new Date())) {
            let toDate = addDays(fromDate, WINDOW_SIZE);
            let offset = 0;
            let nextPage: string | null = null;

            do {
                const accessToken = await this.getAccessToken();
                this.logger.debug(
                    `Requesting addresses from ${fromDate} to ${toDate}`,
                );
                const response = await this.getAddressesPage(
                    fromDate,
                    toDate,
                    offset,
                    accessToken,
                );

                if (response.data.length === 0) break; // If no data, move to the next window

                yield response.data;
                nextPage = response.next_page;
                offset += LIMIT;
            } while (nextPage);

            fromDate = toDate;
        }
    }

    private async getAddressesPage(
        fromDate: Date,
        toDate: Date,
        offset: number,
        accessToken: string,
    ): Promise<{
        data: KencoveApiAddress[];
        result_count: number;
        next_page: string;
    }> {
        const response = await this.axiosInstance.get(
            `/ecom/address/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}&to_date=${toDate.toISOString()}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return response.data;
    }

    public async *getPaymentsStream(
        fromDate: Date,
    ): AsyncIterableIterator<KencoveApiPayment[]> {
        let nextPage: string | null = null;
        let offset: number = 0;
        do {
            const accessToken = await this.getAccessToken();
            const response = await this.getPaymentsPage(
                fromDate,
                offset,
                accessToken,
            );
            yield response.data;
            nextPage = response.next_page;
            offset += 200;
        } while (nextPage);
    }

    private async getPaymentsPage(
        fromDate: Date,
        offset: number,
        accessToken: string,
    ): Promise<{
        data: KencoveApiPayment[];
        result_count: number;
        next_page: string;
    }> {
        const response = await this.axiosInstance.get(
            `/ecom/payment/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return response.data;
    }

    public async *getProductsStream(
        fromDate: Date,
    ): AsyncIterableIterator<KencoveApiProduct[]> {
        let nextPage: string | null = null;
        let offset: number = 0;
        do {
            const accessToken = await this.getAccessToken();
            const response = await this.getProductsPage(
                fromDate,
                offset,
                accessToken,
            );
            yield response.data;
            nextPage = response.next_page;
            /**
             * we just go in steps of 50
             */
            offset += 50;
        } while (nextPage);
    }

    /**
     *
     * @param fromDate
     * @param productTemplateId optionally request just one specific product template id for testing
     * @returns
     */
    public async getProducts(
        fromDate: Date,
        productTemplateId?: string,
    ): Promise<KencoveApiProduct[]> {
        const accessToken = await this.getAccessToken();
        const products: KencoveApiProduct[] = [];
        let nextPage: string | null = null;
        let offset: number = 0;
        do {
            this.logger.debug(
                `Requesting 200 products from ${fromDate}, offset: ${offset}`,
            );
            const response = await this.getProductsPage(
                fromDate,
                offset,
                accessToken,
                productTemplateId,
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
        productTemplateId?: string,
    ): Promise<{
        data: KencoveApiProduct[];
        result_count: number;
        next_page: string;
    }> {
        const response = await this.axiosInstance.get(
            `/ecom/product/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}&to_date=${new Date().toISOString()}${
                productTemplateId ? `&product_tmpl_id=${productTemplateId}` : ""
            }`,
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

    public async *getCategoriesStream(
        fromDate: Date,
    ): AsyncIterableIterator<KencoveApiCategory[]> {
        // Define endpoint for categories data, adjust if necessary
        const endpoint = "/ecom/categories/kencove";

        // Specify any extra parameters if needed, for categories this might be empty or specific filters
        const extraParams = ""; // Adjust as needed

        // Use the generic streamApiData method to fetch categories
        for await (const batch of this.streamApiData<KencoveApiCategory>(
            endpoint,
            fromDate,
            3,
            200,
            extraParams,
        )) {
            console.log(`Received ${JSON.stringify(batch)} categories`);
            yield batch;
        }
    }

    /**
     * Stream packages, 200 at a time. Use it with a for await loop.
     * We have to combine from and to to create an efficient sliding window
     * @param getPackages
     */
    public async *getPackagesStream(
        fromDate: Date,
    ): AsyncIterableIterator<KencoveApiPackage[]> {
        const WINDOW_SIZE = 3;
        const LIMIT = 200;

        while (isBefore(fromDate, new Date())) {
            let toDate = addDays(fromDate, WINDOW_SIZE);
            let offset = 0;
            let nextPage: string | null = null;

            const accessToken = await this.getAccessToken();

            do {
                const response = await this.getPackagesPage(
                    fromDate,
                    toDate,
                    offset,
                    accessToken,
                );

                if (response.data.length === 0) break; // If no data, move to the next window

                yield response.data;
                nextPage = response.next_page;
                offset += LIMIT;
            } while (nextPage);

            fromDate = toDate;
        }
    }

    private async getPackagesPage(
        fromDate: Date,
        toDate: Date,
        offset: number,
        accessToken: string,
    ): Promise<{
        data: KencoveApiPackage[];
        result_count: number;
        next_page: string;
    }> {
        const response = await this.axiosInstance.get(
            `/ecom/packages/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}&to_date=${toDate.toISOString()}`,
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

    public async *getContactsStream(
        fromDate: Date,
    ): AsyncIterableIterator<KencoveApiContact[]> {
        const WINDOW_SIZE = 3;
        const LIMIT = 200;
        while (isBefore(fromDate, new Date())) {
            let toDate = addDays(fromDate, WINDOW_SIZE);
            let offset = 0;
            let nextPage: string | null = null;
            const accessToken = await this.getAccessToken();
            do {
                const response = await this.getContactsPage(
                    fromDate,
                    toDate,
                    offset,
                    accessToken,
                );
                yield response.data;
                nextPage = response.next_page;
                offset += LIMIT;
            } while (nextPage);
            fromDate = toDate;
        }
    }

    private async getContactsPage(
        fromDate: Date,
        toDate: Date,
        offset: number,
        accessToken: string,
    ): Promise<{
        data: KencoveApiContact[];
        result_count: number;
        next_page: string;
    }> {
        this.logger.debug(
            `requesting contacts from ${fromDate}, offset ${offset}`,
        );
        const response = await this.axiosInstance.get(
            `/ecom/contact/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}&to_date=${toDate.toISOString()}`,
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
     * We have to combine from and to to create an efficient sliding window
     * to efficiently pull orders from the api.
     * @param fromDate
     */
    public async *getOrdersStream(
        fromDate: Date,
    ): AsyncIterableIterator<KencoveApiOrder[]> {
        const WINDOW_SIZE = 3;
        const LIMIT = 200;

        while (isBefore(fromDate, new Date())) {
            let toDate = addDays(fromDate, WINDOW_SIZE);
            let offset = 0;
            let nextPage: string | null = null;

            const accessToken = await this.getAccessToken();

            do {
                const response = await this.getOrdersPage(
                    fromDate,
                    toDate,
                    offset,
                    accessToken,
                );

                if (response.data.length === 0) break; // If no data, move to the next window

                yield response.data;
                nextPage = response.next_page;
                offset += LIMIT;
            } while (nextPage);

            fromDate = toDate;
        }
    }

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
        try {
            this.logger.debug(
                `requesting orders from ${fromDate} to ${toDate}`,
            );
            const response = await this.axiosInstance.get(
                `/ecom/orders/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}&to_date=${toDate.toISOString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.error(
                `Error fetching orders from ${fromDate} to ${toDate}:`,
                error,
            );
            throw error; // Re-throw the error if you want the caller to handle it.
        }
    }

    public async *getPricelistStream(
        fromDate: Date,
    ): AsyncIterableIterator<KencoveApiPricelist[]> {
        const WINDOW_SIZE = 3;
        const LIMIT = 200;
        while (isBefore(fromDate, new Date())) {
            let toDate = addDays(fromDate, WINDOW_SIZE);
            let offset = 0;
            let nextPage: string | null = null;
            const accessToken = await this.getAccessToken();
            do {
                const response = await this.getPricelistPage(
                    fromDate,
                    toDate,
                    offset,
                    accessToken,
                );
                if (response.data.length === 0) break; // If no data, move to the next window

                yield response.data;
                nextPage = response.next_page;
                offset += LIMIT;
            } while (nextPage);

            fromDate = toDate;
        }
    }

    private async getPricelistPage(
        fromDate: Date,
        toDate: Date,
        offset: number,
        accessToken: string,
    ): Promise<{
        data: KencoveApiPricelist[];
        result_count: number;
        next_page: string;
    }> {
        this.logger.debug(
            `requesting pricelist from ${fromDate} to ${toDate}, offset ${offset}`,
        );
        const response = await this.axiosInstance.get(
            `/ecom/pricelist/kencove?limit=200&offset=${offset}&from_date=${fromDate.toISOString()}&to_date=${toDate.toISOString()}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return response.data;
    }
}
