import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { createSaleorClient, SaleorClient } from "@eci/pkg/saleor";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { SaleorOrderSyncService } from ".";

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Saleor Entity Sync payments Test", () => {
    const TESTSALEOR: SaleorClient = createSaleorClient({
        graphqlEndpoint: "https://shop-api.pfefferundfrost.de/graphql/",
        traceId: "test",
        token:
            // eslint-disable-next-line max-len
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJpYXQiOjE2NTM5MTMxODcsIm93bmVyIjoic2FsZW9yIiwiZXhwIjoxNjU0MTcyMzg3LCJ0b2tlbiI6IlJwQWFYc1RXakxndSIsImVtYWlsIjoiamFubmlrQHBmZWZmZXJ1bmRmcm9zdC5kZSIsInR5cGUiOiJhY2Nlc3MiLCJ1c2VyX2lkIjoiVlhObGNqbzNOZz09IiwiaXNfc3RhZmYiOnRydWV9.eyx7zMxP_mkFSugdFtkYbdKhaY-GNCG6eRU1wXTwzmVXQ2hIPf86amupleiMW-zSUfIu9yZSWORP29Pbk7767HHhd__DMsUIeKvhowBnS8fXGtO3XWCeUJkQ9eW9JRu0mkZ0ZZsDjHGKd4iazzDHuwA61WQn0aWQ-MGKqUr17Jg",
    });
    const prismaClient = new PrismaClient();
    // const mockedSaleorClient = {
    //   saleorCronPayments: async () =>
    //     await Promise.resolve({
    //       orders: {
    //         pageInfo: {
    //           hasNextPage: false,
    //           startCursor: "WyIzMTM5Il0=",
    //           endCursor: "WyIzMTIwIl0=",
    //         },
    //         edges: [
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEzOQ==",
    //               created: "2022-05-12T20:38:00.754176+00:00",
    //               number: "3139",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: {
    //                 id: "Vm91Y2hlcjozMjY3",
    //                 code: "GOERKE",
    //               },
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0OTk=",
    //                   variant: {
    //                     sku: "granola-1701-fruehsportfreunde",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 1.18,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 6.72,
    //                     },
    //                     net: {
    //                       amount: 5.65,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ1MDA=",
    //                   variant: {
    //                     sku: "granola-2010-peanutpower",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 1.18,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 6.72,
    //                     },
    //                     net: {
    //                       amount: 5.65,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 19.34,
    //                 },
    //                 net: {
    //                   amount: 15.88,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEzOA==",
    //               created: "2022-05-11T08:25:35.513642+00:00",
    //               number: "3138",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: {
    //                 id: "Vm91Y2hlcjozMjY3",
    //                 code: "GOERKE",
    //               },
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0OTc=",
    //                   variant: {
    //                     sku: "granola-1701-fruehsportfreunde",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 1.18,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 6.72,
    //                     },
    //                     net: {
    //                       amount: 5.65,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0OTg=",
    //                   variant: {
    //                     sku: "granola-2010-peanutpower",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 1.18,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 6.72,
    //                     },
    //                     net: {
    //                       amount: 5.65,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 19.34,
    //                 },
    //                 net: {
    //                   amount: 15.88,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEzNw==",
    //               created: "2022-05-07T14:10:24.188381+00:00",
    //               number: "3137",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0OTU=",
    //                   variant: {
    //                     sku: "pf-permakalender",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0OTY=",
    //                   variant: {
    //                     sku: "jg-secco-weiss-2er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 11.9,
    //                     },
    //                     net: {
    //                       amount: 10,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 11.9,
    //                     },
    //                     net: {
    //                       amount: 10,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 52.8,
    //                 },
    //                 net: {
    //                   amount: 44.37,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEzNg==",
    //               created: "2022-05-07T11:41:01.027561+00:00",
    //               number: "3136",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0OTQ=",
    //                   variant: {
    //                     sku: "pf-permakalender",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 40.9,
    //                 },
    //                 net: {
    //                   amount: 34.37,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEzNQ==",
    //               created: "2022-04-28T16:22:15.547163+00:00",
    //               number: "3135",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 3.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0OTM=",
    //                   variant: {
    //                     sku: "kartenset-1-swing",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 3.9,
    //                     },
    //                     net: {
    //                       amount: 3.28,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 3.9,
    //                     },
    //                     net: {
    //                       amount: 3.28,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 7.8,
    //                 },
    //                 net: {
    //                   amount: 6.56,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEzNA==",
    //               created: "2022-04-27T09:13:45.477475+00:00",
    //               number: "3134",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0OTI=",
    //                   variant: {
    //                     sku: "pf-permakalender",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 40.9,
    //                 },
    //                 net: {
    //                   amount: 34.37,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEzMw==",
    //               created: "2022-04-12T21:30:21.302134+00:00",
    //               number: "3133",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0OTA=",
    //                   variant: {
    //                     sku: "nu-company-bunny-4er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0OTE=",
    //                   variant: {
    //                     sku: "jg-secco-weiss-2er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 11.9,
    //                     },
    //                     net: {
    //                       amount: 10,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 11.9,
    //                     },
    //                     net: {
    //                       amount: 10,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 35.8,
    //                 },
    //                 net: {
    //                   amount: 30.09,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEzMg==",
    //               created: "2022-04-12T08:39:34.958325+00:00",
    //               number: "3132",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0ODk=",
    //                   variant: {
    //                     sku: "nu-company-bunny-4er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 23.9,
    //                 },
    //                 net: {
    //                   amount: 20.09,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEzMQ==",
    //               created: "2022-04-11T16:23:36.598634+00:00",
    //               number: "3131",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0ODg=",
    //                   variant: {
    //                     sku: "nu-company-bunny-4er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 23.9,
    //                 },
    //                 net: {
    //                   amount: 20.09,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEzMA==",
    //               created: "2022-04-08T19:14:10.289462+00:00",
    //               number: "3130",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 3.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0ODc=",
    //                   variant: {
    //                     sku: "buch-nudeln",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 13.9,
    //                     },
    //                     net: {
    //                       amount: 11.68,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 13.9,
    //                     },
    //                     net: {
    //                       amount: 11.68,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 17.8,
    //                 },
    //                 net: {
    //                   amount: 14.96,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEyOQ==",
    //               created: "2022-04-06T19:33:08.697415+00:00",
    //               number: "3129",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0ODU=",
    //                   variant: {
    //                     sku: "friends-coldbrew-colombia-6",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 19,
    //                     },
    //                     net: {
    //                       amount: 15.97,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 19,
    //                     },
    //                     net: {
    //                       amount: 15.97,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0ODY=",
    //                   variant: {
    //                     sku: "bunny-secco-bundle-3er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 25.5,
    //                     },
    //                     net: {
    //                       amount: 21.43,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 25.5,
    //                     },
    //                     net: {
    //                       amount: 21.43,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 50.4,
    //                 },
    //                 net: {
    //                   amount: 42.36,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEyOA==",
    //               created: "2022-04-05T19:27:36.397689+00:00",
    //               number: "3128",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0ODI=",
    //                   variant: {
    //                     sku: "buch-nudeln",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 13.9,
    //                     },
    //                     net: {
    //                       amount: 11.68,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 13.9,
    //                     },
    //                     net: {
    //                       amount: 11.68,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0ODM=",
    //                   variant: {
    //                     sku: "friends-coldbrew-gemischt-2",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 8,
    //                     },
    //                     net: {
    //                       amount: 6.72,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 8,
    //                     },
    //                     net: {
    //                       amount: 6.72,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0ODQ=",
    //                   variant: {
    //                     sku: "pf-permakalender",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 62.8,
    //                 },
    //                 net: {
    //                   amount: 52.77,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEyNw==",
    //               created: "2022-04-04T20:35:23.959564+00:00",
    //               number: "3127",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0ODE=",
    //                   variant: {
    //                     sku: "nu-company-bunny-8er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 40.9,
    //                 },
    //                 net: {
    //                   amount: 34.37,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEyNg==",
    //               created: "2022-04-04T08:39:45.242224+00:00",
    //               number: "3126",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 0,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0NzY=",
    //                   variant: {
    //                     sku: "buch-nudeln",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 13.9,
    //                     },
    //                     net: {
    //                       amount: 11.68,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 13.9,
    //                     },
    //                     net: {
    //                       amount: 11.68,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0Nzc=",
    //                   variant: {
    //                     sku: "granola-1701-fruehsportfreunde",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0Nzg=",
    //                   variant: {
    //                     sku: "granola-2010-peanutpower",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0Nzk=",
    //                   variant: {
    //                     sku: "pf-permakalender",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0ODA=",
    //                   variant: {
    //                     sku: "nu-company-bunny-4er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 82.7,
    //                 },
    //                 net: {
    //                   amount: 69.5,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEyNQ==",
    //               created: "2022-03-27T09:39:17.904678+00:00",
    //               number: "3125",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0NzU=",
    //                   variant: {
    //                     sku: "pf-permakalender",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 40.9,
    //                 },
    //                 net: {
    //                   amount: 34.37,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEyNA==",
    //               created: "2022-03-25T17:21:26.886743+00:00",
    //               number: "3124",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: {
    //                 id: "Vm91Y2hlcjozMjg5",
    //                 code: "OSTERN5",
    //               },
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0NzE=",
    //                   variant: {
    //                     sku: "friends-tuch-medium-blau",
    //                   },
    //                   quantity: 2,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 8,
    //                     },
    //                     net: {
    //                       amount: 8,
    //                     },
    //                   },
    //                   taxRate: 0,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 16,
    //                     },
    //                     net: {
    //                       amount: 16,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0NzI=",
    //                   variant: {
    //                     sku: "granola-1701-fruehsportfreunde",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0NzM=",
    //                   variant: {
    //                     sku: "granola-2010-peanutpower",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 7.9,
    //                     },
    //                     net: {
    //                       amount: 6.64,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0NzQ=",
    //                   variant: {
    //                     sku: "nu-company-bunny-4er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 50.7,
    //                 },
    //                 net: {
    //                   amount: 44.37,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEyMw==",
    //               created: "2022-03-21T20:59:29.916459+00:00",
    //               number: "3123",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 0,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0Njc=",
    //                   variant: {
    //                     sku: "friends-coldbrew-gemischt-2",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 8,
    //                     },
    //                     net: {
    //                       amount: 6.72,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 8,
    //                     },
    //                     net: {
    //                       amount: 6.72,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0Njg=",
    //                   variant: {
    //                     sku: "friends-coldbrew-colombia-6",
    //                   },
    //                   quantity: 9,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 19,
    //                     },
    //                     net: {
    //                       amount: 15.97,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 171,
    //                     },
    //                     net: {
    //                       amount: 143.73,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0Njk=",
    //                   variant: {
    //                     sku: "friends-coldbrew-ethiopia-6",
    //                   },
    //                   quantity: 8,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 19,
    //                     },
    //                     net: {
    //                       amount: 15.97,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 152,
    //                     },
    //                     net: {
    //                       amount: 127.76,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0NzA=",
    //                   variant: {
    //                     sku: "nu-company-bunny-4er",
    //                   },
    //                   quantity: 26,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 18,
    //                     },
    //                     net: {
    //                       amount: 15.13,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 468,
    //                     },
    //                     net: {
    //                       amount: 393.38,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 799,
    //                 },
    //                 net: {
    //                   amount: 671.59,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEyMg==",
    //               created: "2022-03-20T20:21:53.354186+00:00",
    //               number: "3122",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0NjY=",
    //                   variant: {
    //                     sku: "pf-permakalender",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 35,
    //                     },
    //                     net: {
    //                       amount: 29.41,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 40.9,
    //                 },
    //                 net: {
    //                   amount: 34.37,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEyMQ==",
    //               created: "2022-03-18T12:11:18.789571+00:00",
    //               number: "3121",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: {
    //                 id: "Vm91Y2hlcjoxNQ==",
    //                 code: "EMP&ROCK40",
    //               },
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0NjU=",
    //                   variant: {
    //                     sku: "bunny-secco-bundle-3er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 25.5,
    //                     },
    //                     net: {
    //                       amount: 21.43,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 25.5,
    //                     },
    //                     net: {
    //                       amount: 21.43,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 21.2,
    //                 },
    //                 net: {
    //                   amount: 16.19,
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             node: {
    //               id: "T3JkZXI6MzEyMA==",
    //               created: "2022-03-16T07:46:56.607106+00:00",
    //               number: "3120",
    //               channel: {
    //                 id: "Q2hhbm5lbDox",
    //                 name: "Storefront",
    //               },
    //               voucher: null,
    //               shippingPrice: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 5.9,
    //                 },
    //               },
    //               lines: [
    //                 {
    //                   id: "T3JkZXJMaW5lOjQ0NjQ=",
    //                   variant: {
    //                     sku: "jg-secco-weiss-6er",
    //                   },
    //                   quantity: 1,
    //                   unitDiscountType: "FIXED",
    //                   unitDiscountValue: 0,
    //                   undiscountedUnitPrice: {
    //                     currency: "EUR",
    //                     gross: {
    //                       amount: 22.9,
    //                     },
    //                     net: {
    //                       amount: 19.24,
    //                     },
    //                   },
    //                   taxRate: 0.19,
    //                   totalPrice: {
    //                     gross: {
    //                       amount: 22.9,
    //                     },
    //                     net: {
    //                       amount: 19.24,
    //                     },
    //                     currency: "EUR",
    //                   },
    //                 },
    //               ],
    //               total: {
    //                 currency: "EUR",
    //                 gross: {
    //                   amount: 28.8,
    //                 },
    //                 net: {
    //                   amount: 24.2,
    //                 },
    //               },
    //             },
    //           },
    //         ],
    //       },
    //     }),
    // } as unknown as SaleorClient;

    test("It should work to sync mocked payments to internal ECI db", async () => {
        const installedSaleorApp =
            await prismaClient.installedSaleorApp.findUnique({
                where: {
                    id: "test",
                },
            });
        const tenant = await prismaClient.tenant.findUnique({
            where: {
                id: "test",
            },
        });
        const saleorZohoIntegration =
            await prismaClient.installedSaleorApp.findUnique({
                where: {
                    id: "test",
                },
            });
        if (!installedSaleorApp || !tenant || !saleorZohoIntegration)
            throw new Error("Testing Tenant or saleor app not found in DB");
        const xx = new SaleorOrderSyncService({
            saleorClient: TESTSALEOR,
            channelSlug: "storefront",
            logger: new NoopLogger(),
            db: prismaClient,
            installedSaleorApp: installedSaleorApp,
            tenantId: tenant.id,
            orderPrefix: saleorZohoIntegration.orderPrefix,
        });
        await xx.syncToECI();
    }, 1000000);
});
