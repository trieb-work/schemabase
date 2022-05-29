import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { SaleorClient } from "@eci/pkg/saleor";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { SaleorPaymentSyncService } from "./payments";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Saleor Entity Sync payments Test", () => {
  const prismaClient = new PrismaClient();
  const mockedSaleorClient = {
    saleorCronPayments: async () =>
      await Promise.resolve({
        orders: {
          totalCount: 1293,
          pageInfo: {
            hasNextPage: false,
            startCursor: "WyIzMDM2Il0=",
            endCursor: "WyIyOTM3Il0=",
          },
          edges: [
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDk1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAzNg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 46.65,
                    },
                    created: "2022-01-01T18:00:00.581933+00:00",
                    modified: "2022-01-01T18:00:03.721740+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDk0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAzNQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 36.81,
                    },
                    created: "2022-01-01T17:50:02.216563+00:00",
                    modified: "2022-01-01T17:50:06.711716+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDkz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAzNA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 38.4,
                    },
                    created: "2022-01-01T10:59:44.565167+00:00",
                    modified: "2022-01-01T10:59:48.517520+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDky",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAzMw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 39.31,
                    },
                    created: "2022-01-01T08:50:32.022624+00:00",
                    modified: "2022-01-01T08:50:35.591970+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDkx",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAzMg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 17.35,
                    },
                    created: "2022-01-01T08:38:32.226657+00:00",
                    modified: "2022-01-01T08:38:36.040919+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDkw",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAzMQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 24.05,
                    },
                    created: "2021-12-31T23:33:55.429254+00:00",
                    modified: "2021-12-31T23:33:59.309978+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDg5",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAzMA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 89.65,
                    },
                    created: "2021-12-31T15:24:18.685435+00:00",
                    modified: "2021-12-31T15:24:23.263279+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDg4",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyOQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 52.67,
                    },
                    created: "2021-12-31T15:24:05.817087+00:00",
                    modified: "2021-12-31T15:24:09.862668+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDg3",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyOA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 28.81,
                    },
                    created: "2021-12-31T14:36:13.411304+00:00",
                    modified: "2021-12-31T14:36:17.599480+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDg2",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyNw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 52.67,
                    },
                    created: "2021-12-31T12:41:16.319783+00:00",
                    modified: "2021-12-31T12:41:20.422263+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDgy",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyNg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 31.16,
                    },
                    created: "2021-12-30T15:06:44.816938+00:00",
                    modified: "2021-12-30T15:06:44.816985+00:00",
                    paymentMethodType: "",
                  },
                  {
                    id: "UGF5bWVudDozMDgz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyNg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 31.16,
                    },
                    created: "2021-12-30T15:07:11.868958+00:00",
                    modified: "2021-12-30T15:07:11.869009+00:00",
                    paymentMethodType: "",
                  },
                  {
                    id: "UGF5bWVudDozMDg0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyNg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 31.16,
                    },
                    created: "2021-12-30T15:07:21.638432+00:00",
                    modified: "2021-12-30T15:07:21.638521+00:00",
                    paymentMethodType: "",
                  },
                  {
                    id: "UGF5bWVudDozMDg1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyNg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 31.16,
                    },
                    created: "2021-12-30T15:07:46.035377+00:00",
                    modified: "2021-12-30T15:07:48.843868+00:00",
                    paymentMethodType: "",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDgx",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyNQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 37.81,
                    },
                    created: "2021-12-30T08:32:24.860947+00:00",
                    modified: "2021-12-30T08:32:28.501574+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDgw",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyNA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 19.3,
                    },
                    created: "2021-12-29T14:58:50.119593+00:00",
                    modified: "2021-12-29T14:58:53.752534+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDc5",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyMw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 21.38,
                    },
                    created: "2021-12-29T11:51:05.346969+00:00",
                    modified: "2021-12-29T11:51:09.337290+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDc4",
                    gateway: "triebwork.payments.rechnung",
                    order: {
                      id: "T3JkZXI6MzAyMg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 16.88,
                    },
                    created: "2021-12-29T11:34:50.499406+00:00",
                    modified: "2021-12-29T11:34:50.499451+00:00",
                    paymentMethodType: "",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDc3",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyMQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 37.81,
                    },
                    created: "2021-12-29T04:33:05.953203+00:00",
                    modified: "2021-12-29T04:33:10.183390+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDc2",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAyMA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 21.38,
                    },
                    created: "2021-12-28T22:57:44.850405+00:00",
                    modified: "2021-12-28T22:57:49.565047+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDc1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAxOQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 19.3,
                    },
                    created: "2021-12-28T19:40:54.251178+00:00",
                    modified: "2021-12-28T19:40:58.267716+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDc0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAxOA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 52.74,
                    },
                    created: "2021-12-28T17:35:43.808437+00:00",
                    modified: "2021-12-28T17:35:47.879970+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDcz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAxNw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 14.5,
                    },
                    created: "2021-12-28T15:33:13.515118+00:00",
                    modified: "2021-12-28T15:33:17.662670+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDcy",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAxNg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 28.81,
                    },
                    created: "2021-12-28T13:29:55.823254+00:00",
                    modified: "2021-12-28T13:29:58.915125+00:00",
                    paymentMethodType: "",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDcx",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAxNQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 18.1,
                    },
                    created: "2021-12-28T09:11:22.056473+00:00",
                    modified: "2021-12-28T09:11:25.777981+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDcw",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAxNA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 21.38,
                    },
                    created: "2021-12-27T20:06:19.242862+00:00",
                    modified: "2021-12-27T20:06:23.472067+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDY5",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAxMw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 34.81,
                    },
                    created: "2021-12-27T18:35:25.952344+00:00",
                    modified: "2021-12-27T18:35:29.923040+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDY4",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAxMg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 37.81,
                    },
                    created: "2021-12-27T15:44:07.260261+00:00",
                    modified: "2021-12-27T15:44:10.657935+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDY3",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAxMQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 40.81,
                    },
                    created: "2021-12-27T14:41:48.896430+00:00",
                    modified: "2021-12-27T14:41:53.096889+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDY2",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAxMA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 22.88,
                    },
                    created: "2021-12-26T21:47:18.536766+00:00",
                    modified: "2021-12-26T21:47:22.682720+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDY1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAwOQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 32.45,
                    },
                    created: "2021-12-26T20:32:01.055108+00:00",
                    modified: "2021-12-26T20:32:04.904063+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDY0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAwOA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 28.88,
                    },
                    created: "2021-12-26T19:56:03.568364+00:00",
                    modified: "2021-12-26T19:56:07.485171+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDYz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAwNw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 58.74,
                    },
                    created: "2021-12-26T19:22:03.413272+00:00",
                    modified: "2021-12-26T19:22:08.364324+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDYy",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAwNg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 50.35,
                    },
                    created: "2021-12-26T16:12:09.583884+00:00",
                    modified: "2021-12-26T16:12:13.529104+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDYx",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAwNQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 58.74,
                    },
                    created: "2021-12-25T17:15:11.151019+00:00",
                    modified: "2021-12-25T17:15:14.841666+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDYw",
                    gateway: "triebwork.payments.rechnung",
                    order: {
                      id: "T3JkZXI6MzAwNA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 39.95,
                    },
                    created: "2021-12-23T14:21:24.220982+00:00",
                    modified: "2021-12-27T12:02:40.377098+00:00",
                    paymentMethodType: "",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDU5",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAwMw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 38.48,
                    },
                    created: "2021-12-23T12:09:16.291972+00:00",
                    modified: "2021-12-23T12:09:20.171145+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDU4",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAwMg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 22.88,
                    },
                    created: "2021-12-23T11:23:38.499723+00:00",
                    modified: "2021-12-23T11:23:41.876375+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDU3",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAwMQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 28.81,
                    },
                    created: "2021-12-23T11:03:04.968075+00:00",
                    modified: "2021-12-23T11:03:09.335424+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDU2",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MzAwMA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 22.34,
                    },
                    created: "2021-12-23T10:46:02.045232+00:00",
                    modified: "2021-12-23T10:46:05.148392+00:00",
                    paymentMethodType: "",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDU1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk5OQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 13.71,
                    },
                    created: "2021-12-22T21:34:31.896429+00:00",
                    modified: "2021-12-22T21:34:36.380045+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDU0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk5OA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 26.85,
                    },
                    created: "2021-12-22T21:00:05.943894+00:00",
                    modified: "2021-12-22T21:00:09.836720+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDUy",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk5Nw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 48.75,
                    },
                    created: "2021-12-22T20:47:00.605586+00:00",
                    modified: "2021-12-22T20:47:00.605621+00:00",
                    paymentMethodType: "card",
                  },
                  {
                    id: "UGF5bWVudDozMDUz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk5Nw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 48.75,
                    },
                    created: "2021-12-22T20:49:20.153593+00:00",
                    modified: "2021-12-22T20:49:23.836551+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDUx",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk5Ng==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 15.9,
                    },
                    created: "2021-12-22T19:54:46.756902+00:00",
                    modified: "2021-12-22T19:54:50.419208+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDUw",
                    gateway: "triebwork.payments.rechnung",
                    order: {
                      id: "T3JkZXI6Mjk5NQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 76.65,
                    },
                    created: "2021-12-22T19:52:53.572606+00:00",
                    modified: "2022-01-12T16:02:51.729059+00:00",
                    paymentMethodType: "",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDQ5",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk5NA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 37.8,
                    },
                    created: "2021-12-22T19:44:03.142664+00:00",
                    modified: "2021-12-22T19:44:06.711550+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDQ4",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk5Mw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 26.85,
                    },
                    created: "2021-12-22T19:07:09.103934+00:00",
                    modified: "2021-12-22T19:07:13.261157+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDQ3",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk5Mg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 37.8,
                    },
                    created: "2021-12-22T14:21:47.491216+00:00",
                    modified: "2021-12-22T14:21:51.194957+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDQ2",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk5MQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 50.26,
                    },
                    created: "2021-12-22T14:10:44.167060+00:00",
                    modified: "2021-12-22T14:10:48.846162+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDQ1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk5MA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 15.9,
                    },
                    created: "2021-12-22T12:27:24.774433+00:00",
                    modified: "2021-12-22T12:27:28.159777+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDQ0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk4OQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 25.9,
                    },
                    created: "2021-12-22T11:13:54.246060+00:00",
                    modified: "2021-12-22T11:13:57.418973+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDQz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk4OA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 25.9,
                    },
                    created: "2021-12-22T11:08:40.187249+00:00",
                    modified: "2021-12-22T11:08:45.573392+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDQy",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk4Nw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 25.95,
                    },
                    created: "2021-12-22T10:53:27.977531+00:00",
                    modified: "2021-12-22T10:53:32.196407+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDQx",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk4Ng==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 8.7,
                    },
                    created: "2021-12-22T09:43:00.522819+00:00",
                    modified: "2021-12-22T09:43:04.519368+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDQw",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk4NQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 40.73,
                    },
                    created: "2021-12-22T08:00:53.767175+00:00",
                    modified: "2021-12-22T08:00:57.553671+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDM5",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk4NA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 15.9,
                    },
                    created: "2021-12-22T08:00:15.091175+00:00",
                    modified: "2021-12-22T08:00:19.013134+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDM4",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk4Mw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 47.97,
                    },
                    created: "2021-12-22T06:49:59.198597+00:00",
                    modified: "2021-12-22T06:50:04.474703+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDM3",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk4Mg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 48.75,
                    },
                    created: "2021-12-21T22:23:13.726098+00:00",
                    modified: "2021-12-21T22:23:16.633081+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDM2",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk4MQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 28.85,
                    },
                    created: "2021-12-21T21:42:40.140992+00:00",
                    modified: "2021-12-21T21:42:43.760391+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDM1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk4MA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 24.07,
                    },
                    created: "2021-12-21T19:56:48.636544+00:00",
                    modified: "2021-12-21T19:56:52.518752+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDM0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk3OQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 20.07,
                    },
                    created: "2021-12-21T19:27:17.021084+00:00",
                    modified: "2021-12-21T19:27:21.315822+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDMz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk3OA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 50.75,
                    },
                    created: "2021-12-21T17:02:06.601826+00:00",
                    modified: "2021-12-21T17:02:11.013249+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDMy",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk3Nw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 39.95,
                    },
                    created: "2021-12-21T16:50:24.219384+00:00",
                    modified: "2021-12-21T16:50:28.118668+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDMx",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk3Ng==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 20.87,
                    },
                    created: "2021-12-21T16:08:16.221987+00:00",
                    modified: "2021-12-21T16:08:20.123787+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDMw",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk3NQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 59.7,
                    },
                    created: "2021-12-21T15:32:38.078409+00:00",
                    modified: "2021-12-21T15:32:41.612105+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDI5",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk3NA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 26.85,
                    },
                    created: "2021-12-21T13:59:13.331775+00:00",
                    modified: "2021-12-21T13:59:17.204593+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDI4",
                    gateway: "triebwork.payments.rechnung",
                    order: {
                      id: "T3JkZXI6Mjk3Mw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 28.81,
                    },
                    created: "2021-12-21T13:18:20.378864+00:00",
                    modified: "2021-12-21T15:55:56.736581+00:00",
                    paymentMethodType: "",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDI3",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk3Mg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 21.38,
                    },
                    created: "2021-12-21T12:14:33.361101+00:00",
                    modified: "2021-12-21T12:14:36.855612+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDI2",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk3MQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 21.38,
                    },
                    created: "2021-12-21T12:06:24.272328+00:00",
                    modified: "2021-12-21T12:06:28.777136+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDI1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk3MA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 45.88,
                    },
                    created: "2021-12-21T11:51:27.260136+00:00",
                    modified: "2021-12-21T11:51:31.165882+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDI0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk2OQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 37.81,
                    },
                    created: "2021-12-21T08:29:18.305963+00:00",
                    modified: "2021-12-21T08:29:22.306670+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDIz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk2OA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 31.75,
                    },
                    created: "2021-12-21T07:39:23.372186+00:00",
                    modified: "2021-12-21T07:39:28.440017+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDIy",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk2Nw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 16.88,
                    },
                    created: "2021-12-20T22:13:08.943212+00:00",
                    modified: "2021-12-20T22:13:12.776009+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDIx",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk2Ng==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 21.38,
                    },
                    created: "2021-12-20T22:08:38.358370+00:00",
                    modified: "2021-12-20T22:08:43.752749+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDIw",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk2NQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 40.81,
                    },
                    created: "2021-12-20T22:06:43.647383+00:00",
                    modified: "2021-12-20T22:06:47.415890+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDE5",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk2NA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 39.95,
                    },
                    created: "2021-12-20T20:22:25.363331+00:00",
                    modified: "2021-12-20T20:22:27.936336+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDE4",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk2Mw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 19.3,
                    },
                    created: "2021-12-20T19:38:43.247626+00:00",
                    modified: "2021-12-20T19:38:47.362235+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDE3",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk2Mg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 52.67,
                    },
                    created: "2021-12-20T19:06:31.103171+00:00",
                    modified: "2021-12-20T19:06:35.553329+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDE2",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk2MQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 37.81,
                    },
                    created: "2021-12-20T16:41:03.755429+00:00",
                    modified: "2021-12-20T16:41:08.277921+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDE1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk2MA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 37.81,
                    },
                    created: "2021-12-20T16:34:23.388385+00:00",
                    modified: "2021-12-20T16:34:26.662967+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDE0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk1OQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 46.75,
                    },
                    created: "2021-12-20T16:12:26.464058+00:00",
                    modified: "2021-12-20T16:12:30.572647+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDEz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk1OA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 28.81,
                    },
                    created: "2021-12-20T16:10:03.863050+00:00",
                    modified: "2021-12-20T16:10:09.682614+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDEy",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk1Nw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 21.38,
                    },
                    created: "2021-12-20T15:01:30.393125+00:00",
                    modified: "2021-12-20T15:01:34.147189+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDEx",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk1Ng==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 66.17,
                    },
                    created: "2021-12-20T12:27:40.642033+00:00",
                    modified: "2021-12-20T12:27:46.204015+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDEw",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk1NQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 43.65,
                    },
                    created: "2021-12-20T10:45:15.229495+00:00",
                    modified: "2021-12-20T10:45:19.687139+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDA5",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk1NA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 78.19,
                    },
                    created: "2021-12-20T10:20:27.185132+00:00",
                    modified: "2021-12-20T10:20:32.275446+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDA4",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk1Mw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 22.88,
                    },
                    created: "2021-12-20T09:22:45.949491+00:00",
                    modified: "2021-12-20T09:22:49.388007+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDA3",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk1Mg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 52.23,
                    },
                    created: "2021-12-20T09:04:41.087810+00:00",
                    modified: "2021-12-20T09:04:47.840882+00:00",
                    paymentMethodType: "card",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDA2",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk1MQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 64.67,
                    },
                    created: "2021-12-20T06:44:36.327633+00:00",
                    modified: "2021-12-20T06:44:41.697277+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDA1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk1MA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 42.57,
                    },
                    created: "2021-12-20T06:21:22.863500+00:00",
                    modified: "2021-12-20T06:21:26.561118+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDA0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk0OQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 31.13,
                    },
                    created: "2021-12-20T06:14:57.210975+00:00",
                    modified: "2021-12-20T06:15:01.559825+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDAz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk0OA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 76.67,
                    },
                    created: "2021-12-20T06:11:50.551788+00:00",
                    modified: "2021-12-20T06:11:54.245373+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDAy",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk0Nw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 35.78,
                    },
                    created: "2021-12-20T05:50:05.805153+00:00",
                    modified: "2021-12-20T05:50:09.898643+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDAx",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk0Ng==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 30.48,
                    },
                    created: "2021-12-20T02:57:42.685103+00:00",
                    modified: "2021-12-20T02:57:47.388848+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDozMDAw",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk0NQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 50.35,
                    },
                    created: "2021-12-19T22:17:35.884516+00:00",
                    modified: "2021-12-19T22:17:40.972198+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDoyOTk5",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk0NA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 39.95,
                    },
                    created: "2021-12-19T20:09:05.470426+00:00",
                    modified: "2021-12-19T20:09:09.725438+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDoyOTk4",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk0Mw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 33.31,
                    },
                    created: "2021-12-19T19:57:47.219250+00:00",
                    modified: "2021-12-19T19:57:51.209542+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDoyOTk3",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk0Mg==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 33.65,
                    },
                    created: "2021-12-19T17:09:27.219788+00:00",
                    modified: "2021-12-19T17:09:31.681185+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDoyOTk2",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk0MQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 21.38,
                    },
                    created: "2021-12-19T15:51:46.670852+00:00",
                    modified: "2021-12-19T15:51:50.744111+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDoyOTk1",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6Mjk0MA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 60.21,
                    },
                    created: "2021-12-19T15:04:45.624181+00:00",
                    modified: "2021-12-19T15:04:49.809554+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDoyOTk0",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MjkzOQ==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 37.81,
                    },
                    created: "2021-12-19T14:52:57.513299+00:00",
                    modified: "2021-12-19T14:53:01.495606+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDoyOTkz",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MjkzOA==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 40.81,
                    },
                    created: "2021-12-19T14:40:05.130165+00:00",
                    modified: "2021-12-19T14:40:09.979876+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
            {
              node: {
                payments: [
                  {
                    id: "UGF5bWVudDoyOTky",
                    gateway: "mirumee.payments.braintree",
                    order: {
                      id: "T3JkZXI6MjkzNw==",
                    },
                    total: {
                      currency: "EUR",
                      amount: 16.88,
                    },
                    created: "2021-12-19T14:37:41.205335+00:00",
                    modified: "2021-12-19T14:37:44.823984+00:00",
                    paymentMethodType: "paypal",
                  },
                ],
              },
            },
          ],
        },
      }),
  } as unknown as SaleorClient;

  test("It should work to sync mocked payments to internal ECI db", async () => {
    const installedSaleorApp = await prismaClient.installedSaleorApp.findUnique(
      {
        where: {
          id: "test",
        },
      },
    );
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "test",
      },
    });
    if (!installedSaleorApp || !tenant)
      throw new Error("Testing Tenant or saleor app not found in DB");
    const xx = new SaleorPaymentSyncService({
      saleorClient: mockedSaleorClient,
      channelSlug: "storefront",
      logger: new NoopLogger(),
      db: prismaClient,
      installedSaleorApp,
      tenant,
    });
    await xx.syncToECI();
  });
});
