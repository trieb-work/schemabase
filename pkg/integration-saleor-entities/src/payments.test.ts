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
          totalCount: 100,
          pageInfo: {
            hasNextPage: false,
            endCursor: "WyIyOTM3Il0=",
            startCursor: "WyIzMDM2Il0=",
          },
          "edges": [
            {
              "node": {
                "id": "T3JkZXI6MzE1NA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjI3",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-09-15T08:03:10.106598+00:00",
                    "modified": "2022-09-15T08:03:20.467815+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE1NA==",
                      "created": "2022-09-15T08:03:20.499589+00:00",
                      "number": "3154"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc3OQ==",
                        "token": "11068bv7",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 128.8
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE1Mw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjI2",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-09-14T07:04:28.951816+00:00",
                    "modified": "2022-09-14T07:04:33.174572+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE1Mw==",
                      "created": "2022-09-14T07:04:33.184910+00:00",
                      "number": "3153"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc3OA==",
                        "token": "qn0v8gh7",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 314.5
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE1Mg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjI1",
                    "isActive": true,
                    "gateway": "app:17:triebwork.payments.rechnung",
                    "created": "2022-09-13T19:52:44.764526+00:00",
                    "modified": "2022-09-13T19:52:44.764597+00:00",
                    "chargeStatus": "NOT_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE1Mg==",
                      "created": "2022-09-13T19:52:46.487693+00:00",
                      "number": "3152"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc3Nw==",
                        "token": "p_StPLEffCwmUXhw3PqGSJ8t",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE1MQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjI0",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-09-13T14:16:56.553649+00:00",
                    "modified": "2022-09-13T14:17:00.761407+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE1MQ==",
                      "created": "2022-09-13T14:17:00.779975+00:00",
                      "number": "3151"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc3Ng==",
                        "token": "qn0qxzde",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 42.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE1MA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjIz",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-09-12T14:18:12.314100+00:00",
                    "modified": "2022-09-12T14:18:16.696457+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE1MA==",
                      "created": "2022-09-12T14:18:16.711438+00:00",
                      "number": "3150"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc3NQ==",
                        "token": "2a49fmje",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 79.2
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE0OQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjIy",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-09-11T17:15:40.751078+00:00",
                    "modified": "2022-09-11T17:15:45.039317+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE0OQ==",
                      "created": "2022-09-11T17:15:45.058559+00:00",
                      "number": "3149"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc3NA==",
                        "token": "f0s13qj7",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE0OA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjIw",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-08-27T23:04:55.032062+00:00",
                    "modified": "2022-08-27T23:05:00.125781+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE0OA==",
                      "created": "2022-08-27T23:05:00.153926+00:00",
                      "number": "3148"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc2Ng==",
                        "token": "mnnk2htr",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE0Nw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjE5",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-08-22T14:31:44.326577+00:00",
                    "modified": "2022-08-22T14:31:48.168542+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "8874"
                    },
                    "order": {
                      "id": "T3JkZXI6MzE0Nw==",
                      "created": "2022-08-22T14:31:48.189089+00:00",
                      "number": "3147"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc2NQ==",
                        "token": "jkchdvyj",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 42.7
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE0Ng==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjE4",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-08-02T19:08:26.343088+00:00",
                    "modified": "2022-08-02T19:08:30.700106+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE0Ng==",
                      "created": "2022-08-02T19:08:30.717247+00:00",
                      "number": "3146"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc2NA==",
                        "token": "9q359gk4",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE0NQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjE3",
                    "isActive": false,
                    "gateway": "app:17:triebwork.payments.rechnung",
                    "created": "2022-07-27T08:47:32.375440+00:00",
                    "modified": "2022-09-01T12:16:35.347019+00:00",
                    "chargeStatus": "NOT_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE0NQ==",
                      "created": "2022-07-27T08:47:33.772017+00:00",
                      "number": "3145"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc2MQ==",
                        "token": "p_W2B3rodRtYZuXy9JfyoC4B",
                        "isSuccess": true
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc2Mg==",
                        "token": "p_W2B3rodRtYZuXy9JfyoC4B",
                        "isSuccess": false
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc2Mw==",
                        "token": "p_W2B3rodRtYZuXy9JfyoC4B",
                        "isSuccess": false
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc2OA==",
                        "token": "p_W2B3rodRtYZuXy9JfyoC4B",
                        "isSuccess": false
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc2OQ==",
                        "token": "p_W2B3rodRtYZuXy9JfyoC4B",
                        "isSuccess": false
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc3MA==",
                        "token": "p_W2B3rodRtYZuXy9JfyoC4B",
                        "isSuccess": false
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc3MQ==",
                        "token": "p_W2B3rodRtYZuXy9JfyoC4B",
                        "isSuccess": false
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc3Mg==",
                        "token": "p_W2B3rodRtYZuXy9JfyoC4B",
                        "isSuccess": false
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc3Mw==",
                        "token": "",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 34.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE0NA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjEz",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-07-04T16:23:33.989104+00:00",
                    "modified": "2022-07-04T16:23:38.279250+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE0NA==",
                      "created": "2022-07-04T16:23:38.307902+00:00",
                      "number": "3144"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc1Nw==",
                        "token": "bvk6tha7",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 13.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE0Mw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjEy",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-06-19T13:15:20.571811+00:00",
                    "modified": "2022-06-19T13:15:25.015811+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzE0Mw==",
                      "created": "2022-06-19T13:15:25.034716+00:00",
                      "number": "3143"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc1Ng==",
                        "token": "ddf43vnq",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 37.5
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE0Mg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjEx",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-06-19T10:52:05.225826+00:00",
                    "modified": "2022-06-19T10:52:08.200944+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "1549"
                    },
                    "order": {
                      "id": "T3JkZXI6MzE0Mg==",
                      "created": "2022-06-19T10:52:08.230039+00:00",
                      "number": "3142"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc1NQ==",
                        "token": "7cgjdd72",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzE0MA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjA4",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-06-08T14:31:15.847079+00:00",
                    "modified": "2022-06-08T14:31:19.013656+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "0390"
                    },
                    "order": {
                      "id": "T3JkZXI6MzE0MA==",
                      "created": "2022-06-08T14:31:19.053905+00:00",
                      "number": "3140"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc1Mg==",
                        "token": "1e120xwd",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 54.8
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEzOQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjAx",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-05-12T20:37:57.616074+00:00",
                    "modified": "2022-05-12T20:38:00.727441+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "8874"
                    },
                    "order": {
                      "id": "T3JkZXI6MzEzOQ==",
                      "created": "2022-05-12T20:38:00.754176+00:00",
                      "number": "3139"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc0NQ==",
                        "token": "7sd1zfv4",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 19.34
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEzOA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMjAw",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-05-11T08:25:32.674846+00:00",
                    "modified": "2022-05-11T08:25:35.454959+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "8874"
                    },
                    "order": {
                      "id": "T3JkZXI6MzEzOA==",
                      "created": "2022-05-11T08:25:35.513642+00:00",
                      "number": "3138"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc0NA==",
                        "token": "rpq20mx3",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 19.34
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEzNw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTk5",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-05-07T14:10:19.820488+00:00",
                    "modified": "2022-05-07T14:10:24.154232+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEzNw==",
                      "created": "2022-05-07T14:10:24.188381+00:00",
                      "number": "3137"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc0Mw==",
                        "token": "cwqd1vg3",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 52.8
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEzNg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTk4",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-05-07T11:40:56.533835+00:00",
                    "modified": "2022-05-07T11:41:00.972513+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEzNg==",
                      "created": "2022-05-07T11:41:01.027561+00:00",
                      "number": "3136"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246Mjc0Mg==",
                        "token": "nhk5kmzj",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEzNQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTk3",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-04-28T16:22:12.850885+00:00",
                    "modified": "2022-04-28T16:22:15.527781+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEzNQ==",
                      "created": "2022-04-28T16:22:15.547163+00:00",
                      "number": "3135"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjczNw==",
                        "token": "q04h7t4b",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 7.8
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEzNA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTk1",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-04-27T09:13:42.618905+00:00",
                    "modified": "2022-04-27T09:13:45.443656+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "5366"
                    },
                    "order": {
                      "id": "T3JkZXI6MzEzNA==",
                      "created": "2022-04-27T09:13:45.477475+00:00",
                      "number": "3134"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjczNQ==",
                        "token": "nm9bhbkb",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEzMw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTk0",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-04-12T21:30:17.422547+00:00",
                    "modified": "2022-04-12T21:30:21.267293+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEzMw==",
                      "created": "2022-04-12T21:30:21.302134+00:00",
                      "number": "3133"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjczNA==",
                        "token": "re6q07c6",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 35.8
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEzMg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTkz",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-04-12T08:39:31.280488+00:00",
                    "modified": "2022-04-12T08:39:34.927374+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEzMg==",
                      "created": "2022-04-12T08:39:34.958325+00:00",
                      "number": "3132"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjczMg==",
                        "token": "ktm4kyz5",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 23.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEzMQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTky",
                    "isActive": true,
                    "gateway": "triebwork.payments.rechnung",
                    "created": "2022-04-11T16:23:35.737308+00:00",
                    "modified": "2022-04-12T09:42:47.494001+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEzMQ==",
                      "created": "2022-04-11T16:23:36.598634+00:00",
                      "number": "3131"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjczMQ==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246MjczMw==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 23.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEzMA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTkx",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-04-08T19:14:06.336951+00:00",
                    "modified": "2022-04-08T19:14:10.264987+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEzMA==",
                      "created": "2022-04-08T19:14:10.289462+00:00",
                      "number": "3130"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjczMA==",
                        "token": "7e3byw0t",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 17.8
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEyOQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTkw",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-04-06T19:33:04.543454+00:00",
                    "modified": "2022-04-06T19:33:08.674424+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEyOQ==",
                      "created": "2022-04-06T19:33:08.697415+00:00",
                      "number": "3129"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcyOQ==",
                        "token": "40c175yx",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 50.4
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEyOA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTg5",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-04-05T19:27:32.590506+00:00",
                    "modified": "2022-04-05T19:27:36.373924+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEyOA==",
                      "created": "2022-04-05T19:27:36.397689+00:00",
                      "number": "3128"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcyOA==",
                        "token": "k6s1qa17",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 62.8
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEyNw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTg4",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-04-04T20:35:20.095073+00:00",
                    "modified": "2022-04-04T20:35:23.931603+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEyNw==",
                      "created": "2022-04-04T20:35:23.959564+00:00",
                      "number": "3127"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcyNw==",
                        "token": "frgx851s",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEyNg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTg3",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-04-04T08:39:40.977422+00:00",
                    "modified": "2022-04-04T08:39:45.203431+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEyNg==",
                      "created": "2022-04-04T08:39:45.242224+00:00",
                      "number": "3126"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcyNg==",
                        "token": "8z27qcdq",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 82.7
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEyNQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTg2",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-03-27T09:39:14.389973+00:00",
                    "modified": "2022-03-27T09:39:17.857245+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEyNQ==",
                      "created": "2022-03-27T09:39:17.904678+00:00",
                      "number": "3125"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcyNQ==",
                        "token": "dtnhw30b",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEyNA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTg1",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-03-25T17:21:23.656985+00:00",
                    "modified": "2022-03-25T17:21:26.843019+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "2886"
                    },
                    "order": {
                      "id": "T3JkZXI6MzEyNA==",
                      "created": "2022-03-25T17:21:26.886743+00:00",
                      "number": "3124"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcyNA==",
                        "token": "9kb312e2",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 50.7
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEyMw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTg0",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-03-21T20:59:26.110361+00:00",
                    "modified": "2022-03-21T20:59:29.882871+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "american express",
                      "lastDigits": "1008"
                    },
                    "order": {
                      "id": "T3JkZXI6MzEyMw==",
                      "created": "2022-03-21T20:59:29.916459+00:00",
                      "number": "3123"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcyMw==",
                        "token": "gfe1detm",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 799
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEyMg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTgz",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-03-20T20:21:49.483508+00:00",
                    "modified": "2022-03-20T20:21:53.316567+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEyMg==",
                      "created": "2022-03-20T20:21:53.354186+00:00",
                      "number": "3122"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcyMg==",
                        "token": "j31as4p5",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEyMQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTgy",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-03-18T12:11:16.032527+00:00",
                    "modified": "2022-03-18T12:11:18.769024+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEyMQ==",
                      "created": "2022-03-18T12:11:18.789571+00:00",
                      "number": "3121"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcyMQ==",
                        "token": "ng5yrghn",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 21.2
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEyMA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTgx",
                    "isActive": true,
                    "gateway": "triebwork.payments.rechnung",
                    "created": "2022-03-16T07:46:55.618618+00:00",
                    "modified": "2022-03-17T10:28:38.021186+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEyMA==",
                      "created": "2022-03-16T07:46:56.607106+00:00",
                      "number": "3120"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcxNw==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246MjcxOA==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 28.8
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzExOQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTgw",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-03-16T06:28:25.481309+00:00",
                    "modified": "2022-03-16T06:28:29.212003+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzExOQ==",
                      "created": "2022-03-16T06:28:29.250965+00:00",
                      "number": "3119"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcxNg==",
                        "token": "6acdmw8p",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 44.4
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzExOA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTc5",
                    "isActive": true,
                    "gateway": "triebwork.payments.rechnung",
                    "created": "2022-03-15T10:54:45.202543+00:00",
                    "modified": "2022-03-17T10:29:32.620450+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzExOA==",
                      "created": "2022-03-15T10:54:46.342721+00:00",
                      "number": "3118"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcxNQ==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246MjcxOQ==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 36.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzExNw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTc4",
                    "isActive": true,
                    "gateway": "triebwork.payments.rechnung",
                    "created": "2022-03-15T09:41:38.626212+00:00",
                    "modified": "2022-03-17T10:37:03.607483+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzExNw==",
                      "created": "2022-03-15T09:41:39.667184+00:00",
                      "number": "3117"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcxNA==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246MjcyMA==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 38.3
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzExNg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTc3",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-03-05T21:00:16.291208+00:00",
                    "modified": "2022-03-05T21:00:19.603973+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "8251"
                    },
                    "order": {
                      "id": "T3JkZXI6MzExNg==",
                      "created": "2022-03-05T21:00:19.643303+00:00",
                      "number": "3116"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcxMw==",
                        "token": "d2yghrab",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 47.85
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzExNQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTc2",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-03-04T08:28:17.521691+00:00",
                    "modified": "2022-03-04T08:28:20.430561+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "3844"
                    },
                    "order": {
                      "id": "T3JkZXI6MzExNQ==",
                      "created": "2022-03-04T08:28:20.468413+00:00",
                      "number": "3115"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcxMg==",
                        "token": "9c4n0ntt",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzExNA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTc1",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-03-02T11:56:42.567209+00:00",
                    "modified": "2022-03-02T11:56:45.946531+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "3645"
                    },
                    "order": {
                      "id": "T3JkZXI6MzExNA==",
                      "created": "2022-03-02T11:56:45.986227+00:00",
                      "number": "3114"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcxMQ==",
                        "token": "hhrc4gfe",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzExMw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTc0",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-28T11:06:02.597925+00:00",
                    "modified": "2022-02-28T11:06:05.990872+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "8874"
                    },
                    "order": {
                      "id": "T3JkZXI6MzExMw==",
                      "created": "2022-02-28T11:06:06.023562+00:00",
                      "number": "3113"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcxMA==",
                        "token": "frh5zgdx",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 16.89
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzExMg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTcz",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-20T17:19:12.398312+00:00",
                    "modified": "2022-02-20T17:19:16.500667+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzExMg==",
                      "created": "2022-02-20T17:19:16.564447+00:00",
                      "number": "3112"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcwOQ==",
                        "token": "nn3xnd0b",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 37.56
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzExMQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTcy",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-16T10:31:57.933909+00:00",
                    "modified": "2022-02-16T10:32:01.667624+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzExMQ==",
                      "created": "2022-02-16T10:32:01.725518+00:00",
                      "number": "3111"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcwOA==",
                        "token": "hwtf2f6e",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 12.83
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzExMA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTcx",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-14T08:03:21.035438+00:00",
                    "modified": "2022-02-14T08:03:26.272718+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzExMA==",
                      "created": "2022-02-14T08:03:26.305634+00:00",
                      "number": "3110"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcwNw==",
                        "token": "0ggbwgw8",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEwOQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTcw",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-09T16:18:01.833951+00:00",
                    "modified": "2022-02-09T16:18:05.534735+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEwOQ==",
                      "created": "2022-02-09T16:18:05.580665+00:00",
                      "number": "3109"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcwNg==",
                        "token": "ptqqywef",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 51.05
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEwOA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTY5",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-09T08:24:26.419088+00:00",
                    "modified": "2022-02-09T08:24:29.781771+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "8874"
                    },
                    "order": {
                      "id": "T3JkZXI6MzEwOA==",
                      "created": "2022-02-09T08:24:29.825623+00:00",
                      "number": "3108"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcwNQ==",
                        "token": "ew0wj72p",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 17.71
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEwNw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTY4",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-08T19:04:34.008295+00:00",
                    "modified": "2022-02-08T19:04:38.461666+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEwNw==",
                      "created": "2022-02-08T19:04:38.489767+00:00",
                      "number": "3107"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcwNA==",
                        "token": "re8dbfar",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEwNg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTY3",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-08T15:10:45.024049+00:00",
                    "modified": "2022-02-08T15:10:48.718867+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEwNg==",
                      "created": "2022-02-08T15:10:48.754327+00:00",
                      "number": "3106"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcwMw==",
                        "token": "fq01p52m",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 55.74
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEwNQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTY2",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-08T13:46:57.650260+00:00",
                    "modified": "2022-02-08T13:47:01.275821+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEwNQ==",
                      "created": "2022-02-08T13:47:01.328673+00:00",
                      "number": "3105"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcwMg==",
                        "token": "6jq56yq8",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.81
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEwNA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTY1",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-07T21:15:41.997622+00:00",
                    "modified": "2022-02-07T21:15:45.284388+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEwNA==",
                      "created": "2022-02-07T21:15:45.334360+00:00",
                      "number": "3104"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcwMQ==",
                        "token": "jdapvzr5",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 26.57
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEwMw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTYz",
                    "isActive": false,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-07T15:52:37.685832+00:00",
                    "modified": "2022-02-07T15:52:37.685878+00:00",
                    "chargeStatus": "NOT_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "6035"
                    },
                    "order": {
                      "id": "T3JkZXI6MzEwMw==",
                      "created": "2022-02-07T15:53:16.871727+00:00",
                      "number": "3103"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY5OQ==",
                        "token": "8vgykrt4",
                        "isSuccess": false
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 37.81
                    }
                  },
                  {
                    "id": "UGF5bWVudDozMTY0",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-07T15:53:12.523294+00:00",
                    "modified": "2022-02-07T15:53:16.841814+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "6035"
                    },
                    "order": {
                      "id": "T3JkZXI6MzEwMw==",
                      "created": "2022-02-07T15:53:16.871727+00:00",
                      "number": "3103"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjcwMA==",
                        "token": "0ckdzs2n",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 37.81
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEwMg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTYy",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-05T21:31:38.412393+00:00",
                    "modified": "2022-02-05T21:31:42.451845+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEwMg==",
                      "created": "2022-02-05T21:31:42.517675+00:00",
                      "number": "3102"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY5OA==",
                        "token": "7sh5tkb9",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 22.88
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEwMQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTYx",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-05T15:36:42.428561+00:00",
                    "modified": "2022-02-05T15:36:46.650681+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEwMQ==",
                      "created": "2022-02-05T15:36:46.688216+00:00",
                      "number": "3101"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY5Nw==",
                        "token": "qd7rcevy",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzEwMA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTYw",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-05T05:43:46.323106+00:00",
                    "modified": "2022-02-05T05:43:51.325803+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzEwMA==",
                      "created": "2022-02-05T05:43:51.373150+00:00",
                      "number": "3100"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY5Ng==",
                        "token": "0fkgte8n",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 41.04
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA5OQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTU5",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-04T17:17:28.776509+00:00",
                    "modified": "2022-02-04T17:17:32.509069+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA5OQ==",
                      "created": "2022-02-04T17:17:32.556011+00:00",
                      "number": "3099"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY5NQ==",
                        "token": "c7scjqsw",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 25.61
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA5OA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTU4",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-04T11:30:09.003172+00:00",
                    "modified": "2022-02-04T11:30:13.096166+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA5OA==",
                      "created": "2022-02-04T11:30:13.152032+00:00",
                      "number": "3098"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY5NA==",
                        "token": "g7y5bqed",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.31
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA5Nw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTU3",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-03T10:54:42.715990+00:00",
                    "modified": "2022-02-03T10:54:46.555421+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "6786"
                    },
                    "order": {
                      "id": "T3JkZXI6MzA5Nw==",
                      "created": "2022-02-03T10:54:46.616660+00:00",
                      "number": "3097"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY5Mw==",
                        "token": "f08acaz6",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 89.65
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA5Ng==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTU2",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-02T10:52:10.998927+00:00",
                    "modified": "2022-02-02T10:52:17.691727+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA5Ng==",
                      "created": "2022-02-02T10:52:17.755706+00:00",
                      "number": "3096"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY5Mg==",
                        "token": "38vgfhpb",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.81
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA5NQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTU1",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-02-02T07:32:47.145808+00:00",
                    "modified": "2022-02-02T07:32:52.012901+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA5NQ==",
                      "created": "2022-02-02T07:32:52.060694+00:00",
                      "number": "3095"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY5MQ==",
                        "token": "488x26pd",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 37.81
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA5NA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTU0",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-30T21:47:52.079817+00:00",
                    "modified": "2022-01-30T21:47:56.437813+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA5NA==",
                      "created": "2022-01-30T21:47:56.486659+00:00",
                      "number": "3094"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY5MA==",
                        "token": "4hmk2vma",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 25.9
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA5Mw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTUz",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-30T19:05:19.660699+00:00",
                    "modified": "2022-01-30T19:05:23.833454+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA5Mw==",
                      "created": "2022-01-30T19:05:23.889163+00:00",
                      "number": "3093"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY4OQ==",
                        "token": "e73czwcg",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 17.35
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA5Mg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTUy",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-30T11:34:17.829476+00:00",
                    "modified": "2022-01-30T11:34:21.499230+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA5Mg==",
                      "created": "2022-01-30T11:34:21.531563+00:00",
                      "number": "3092"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY4OA==",
                        "token": "mv3p989s",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 19.3
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA5MQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTUw",
                    "isActive": false,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-30T08:21:34.015605+00:00",
                    "modified": "2022-01-30T08:21:34.015639+00:00",
                    "chargeStatus": "NOT_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "5019"
                    },
                    "order": {
                      "id": "T3JkZXI6MzA5MQ==",
                      "created": "2022-01-30T08:22:03.747705+00:00",
                      "number": "3091"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY4Ng==",
                        "token": "24z8wk8k",
                        "isSuccess": false
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  },
                  {
                    "id": "UGF5bWVudDozMTUx",
                    "isActive": true,
                    "gateway": "triebwork.payments.rechnung",
                    "created": "2022-01-30T08:22:02.383812+00:00",
                    "modified": "2022-01-30T08:22:02.383902+00:00",
                    "chargeStatus": "NOT_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA5MQ==",
                      "created": "2022-01-30T08:22:03.747705+00:00",
                      "number": "3091"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY4Nw==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA5MA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTQ5",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-30T08:00:35.302737+00:00",
                    "modified": "2022-01-30T08:00:38.234047+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "4012"
                    },
                    "order": {
                      "id": "T3JkZXI6MzA5MA==",
                      "created": "2022-01-30T08:00:38.275062+00:00",
                      "number": "3090"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY4NQ==",
                        "token": "3wb371qc",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 11.45
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA4OQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTQ4",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-29T15:55:08.261172+00:00",
                    "modified": "2022-01-29T15:55:11.657744+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "7723"
                    },
                    "order": {
                      "id": "T3JkZXI6MzA4OQ==",
                      "created": "2022-01-29T15:55:11.730032+00:00",
                      "number": "3089"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY4NA==",
                        "token": "25m3r4v3",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 19.3
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA4OA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTQ3",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-28T16:02:02.164599+00:00",
                    "modified": "2022-01-28T16:02:05.815898+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA4OA==",
                      "created": "2022-01-28T16:02:05.863799+00:00",
                      "number": "3088"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY4Mw==",
                        "token": "ngk7eem8",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 36.45
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA4Nw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTQ2",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-26T16:13:40.787294+00:00",
                    "modified": "2022-01-26T16:13:44.440913+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA4Nw==",
                      "created": "2022-01-26T16:13:44.509840+00:00",
                      "number": "3087"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY4Mg==",
                        "token": "9hq6tj8g",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 19.3
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA4Ng==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTQ1",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-26T14:18:47.533511+00:00",
                    "modified": "2022-01-26T14:18:51.997945+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA4Ng==",
                      "created": "2022-01-26T14:18:52.059423+00:00",
                      "number": "3086"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY4MQ==",
                        "token": "hkg1m9y7",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA4NQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTQ0",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-25T21:07:44.767567+00:00",
                    "modified": "2022-01-25T21:07:48.629402+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA4NQ==",
                      "created": "2022-01-25T21:07:48.651700+00:00",
                      "number": "3085"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY4MA==",
                        "token": "dsk3vrfr",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA4NA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTQz",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-25T13:26:16.091558+00:00",
                    "modified": "2022-01-25T13:26:19.984035+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA4NA==",
                      "created": "2022-01-25T13:26:20.016161+00:00",
                      "number": "3084"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY3OQ==",
                        "token": "32j7qt54",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 37.81
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA4Mw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTQy",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-22T23:00:33.009449+00:00",
                    "modified": "2022-01-22T23:00:37.173428+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA4Mw==",
                      "created": "2022-01-22T23:00:37.226576+00:00",
                      "number": "3083"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY3OA==",
                        "token": "kk6wtzrw",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA4Mg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTQx",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-22T19:05:29.154918+00:00",
                    "modified": "2022-01-22T19:05:32.336812+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "1678"
                    },
                    "order": {
                      "id": "T3JkZXI6MzA4Mg==",
                      "created": "2022-01-22T19:05:32.365108+00:00",
                      "number": "3082"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY3Nw==",
                        "token": "p60e0mhd",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 24.13
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA4MQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTQw",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-20T21:43:37.652005+00:00",
                    "modified": "2022-01-20T21:43:41.402334+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA4MQ==",
                      "created": "2022-01-20T21:43:41.433562+00:00",
                      "number": "3081"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY3Ng==",
                        "token": "b7gcptn4",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 21.38
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA4MA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTM5",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-19T22:06:30.164944+00:00",
                    "modified": "2022-01-19T22:06:32.989797+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "2757"
                    },
                    "order": {
                      "id": "T3JkZXI6MzA4MA==",
                      "created": "2022-01-19T22:06:33.024596+00:00",
                      "number": "3080"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY3NA==",
                        "token": "r67we1ph",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 17.35
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA3OQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTM4",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-19T17:00:41.119129+00:00",
                    "modified": "2022-01-19T17:00:46.310768+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA3OQ==",
                      "created": "2022-01-19T17:00:46.364449+00:00",
                      "number": "3079"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY3Mw==",
                        "token": "mjja6e33",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 19.3
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA3OA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTM3",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-19T09:32:42.770301+00:00",
                    "modified": "2022-01-19T09:32:46.758906+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA3OA==",
                      "created": "2022-01-19T09:32:46.811166+00:00",
                      "number": "3078"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY3Mg==",
                        "token": "rsafjnsg",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 40.74
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA3Nw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTM2",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-18T14:05:40.005946+00:00",
                    "modified": "2022-01-18T14:05:43.703452+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA3Nw==",
                      "created": "2022-01-18T14:05:43.752465+00:00",
                      "number": "3077"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY3MQ==",
                        "token": "pqcj3b7q",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 66.85
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA3Ng==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTM1",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-17T17:35:10.852722+00:00",
                    "modified": "2022-01-17T17:35:14.805095+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA3Ng==",
                      "created": "2022-01-17T17:35:14.867676+00:00",
                      "number": "3076"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY3MA==",
                        "token": "a73q0rtt",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 51.81
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA3NQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTM0",
                    "isActive": true,
                    "gateway": "triebwork.payments.rechnung",
                    "created": "2022-01-17T15:28:58.869016+00:00",
                    "modified": "2022-01-20T16:23:59.311724+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA3NQ==",
                      "created": "2022-01-17T15:29:00.141727+00:00",
                      "number": "3075"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY2OQ==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246MjY3NQ==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA3NA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTMz",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-17T13:56:20.454335+00:00",
                    "modified": "2022-01-17T13:56:24.424542+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA3NA==",
                      "created": "2022-01-17T13:56:24.471397+00:00",
                      "number": "3074"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY2OA==",
                        "token": "n48zgw92",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 22.88
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA3Mw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTMy",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-17T11:06:00.138530+00:00",
                    "modified": "2022-01-17T11:06:03.646975+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA3Mw==",
                      "created": "2022-01-17T11:06:03.683829+00:00",
                      "number": "3073"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY2Nw==",
                        "token": "d00thkhv",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 33.65
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA3Mg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTMx",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-15T18:49:43.317421+00:00",
                    "modified": "2022-01-15T18:49:47.766010+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "2021"
                    },
                    "order": {
                      "id": "T3JkZXI6MzA3Mg==",
                      "created": "2022-01-15T18:49:47.832749+00:00",
                      "number": "3072"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY2Ng==",
                        "token": "47x43tfz",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 25.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA3MQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTMw",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-15T08:33:32.919132+00:00",
                    "modified": "2022-01-15T08:33:37.486043+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA3MQ==",
                      "created": "2022-01-15T08:33:37.517816+00:00",
                      "number": "3071"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY2NQ==",
                        "token": "ny80ddsd",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 48
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA3MA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTI5",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-14T06:41:42.757590+00:00",
                    "modified": "2022-01-14T06:41:46.837030+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA3MA==",
                      "created": "2022-01-14T06:41:46.865537+00:00",
                      "number": "3070"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY2NA==",
                        "token": "fbktsvkc",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA2OQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTI4",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-13T18:24:32.902220+00:00",
                    "modified": "2022-01-13T18:24:36.982364+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA2OQ==",
                      "created": "2022-01-13T18:24:37.028530+00:00",
                      "number": "3069"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY2Mw==",
                        "token": "fvx8mz5f",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 28.59
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA2OA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTI3",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-12T21:00:55.406640+00:00",
                    "modified": "2022-01-12T21:00:58.368534+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "visa",
                      "lastDigits": "0929"
                    },
                    "order": {
                      "id": "T3JkZXI6MzA2OA==",
                      "created": "2022-01-12T21:00:58.419866+00:00",
                      "number": "3068"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY2Mg==",
                        "token": "9pcx65ta",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 18.1
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA2Nw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTI2",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-12T06:28:29.611077+00:00",
                    "modified": "2022-01-12T06:28:33.161023+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA2Nw==",
                      "created": "2022-01-12T06:28:33.198027+00:00",
                      "number": "3067"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY1Ng==",
                        "token": "hhkep1gd",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA2Ng==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTI1",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-11T19:41:32.180703+00:00",
                    "modified": "2022-01-11T19:41:36.298864+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA2Ng==",
                      "created": "2022-01-11T19:41:36.329937+00:00",
                      "number": "3066"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY1NQ==",
                        "token": "kpevwj8e",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 33.7
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA2NQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTI0",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-10T19:22:39.757096+00:00",
                    "modified": "2022-01-10T19:22:43.714220+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA2NQ==",
                      "created": "2022-01-10T19:22:43.741470+00:00",
                      "number": "3065"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY1NA==",
                        "token": "cc15q2jk",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA2NA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTIz",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-10T18:30:53.320110+00:00",
                    "modified": "2022-01-10T18:30:57.172154+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA2NA==",
                      "created": "2022-01-10T18:30:57.212211+00:00",
                      "number": "3064"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY1Mw==",
                        "token": "7jc64xdy",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 54.24
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA2Mw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTIy",
                    "isActive": true,
                    "gateway": "triebwork.payments.rechnung",
                    "created": "2022-01-10T08:28:53.865727+00:00",
                    "modified": "2022-01-12T15:50:12.188750+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA2Mw==",
                      "created": "2022-01-10T08:28:55.126471+00:00",
                      "number": "3063"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY1Mg==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246MjY1Nw==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 21.38
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA2Mg==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTIx",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-09T19:32:17.327580+00:00",
                    "modified": "2022-01-09T19:32:21.192893+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": {
                      "brand": "mastercard",
                      "lastDigits": "7665"
                    },
                    "order": {
                      "id": "T3JkZXI6MzA2Mg==",
                      "created": "2022-01-09T19:32:21.222493+00:00",
                      "number": "3062"
                    },
                    "paymentMethodType": "card",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY1MQ==",
                        "token": "by7qenjt",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 80.52
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA2MQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTIw",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-08T21:26:06.157205+00:00",
                    "modified": "2022-01-08T21:26:10.431941+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA2MQ==",
                      "created": "2022-01-08T21:26:10.478757+00:00",
                      "number": "3061"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY1MA==",
                        "token": "2pg6hbfy",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 18.1
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA2MA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTE5",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-08T19:58:43.158734+00:00",
                    "modified": "2022-01-08T19:58:47.182425+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA2MA==",
                      "created": "2022-01-08T19:58:47.241485+00:00",
                      "number": "3060"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY0OQ==",
                        "token": "bx3028en",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 28.81
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA1OQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTE4",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-08T09:48:09.051931+00:00",
                    "modified": "2022-01-08T09:48:13.381358+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA1OQ==",
                      "created": "2022-01-08T09:48:13.416181+00:00",
                      "number": "3059"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY0OA==",
                        "token": "71131efk",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 24.76
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA1OA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTE3",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-07T21:31:43.440576+00:00",
                    "modified": "2022-01-07T21:31:48.057733+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA1OA==",
                      "created": "2022-01-07T21:31:48.096030+00:00",
                      "number": "3058"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY0Nw==",
                        "token": "72c8q67v",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 33.65
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA1Nw==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTE2",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-07T19:00:11.372639+00:00",
                    "modified": "2022-01-07T19:00:15.303930+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA1Nw==",
                      "created": "2022-01-07T19:00:15.354094+00:00",
                      "number": "3057"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY0Ng==",
                        "token": "d2tbnw4e",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 32.45
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA1Ng==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTE1",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-07T17:40:19.012893+00:00",
                    "modified": "2022-01-07T17:40:22.715814+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA1Ng==",
                      "created": "2022-01-07T17:40:22.759123+00:00",
                      "number": "3056"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY0NQ==",
                        "token": "ekjbbgma",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 28.85
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA1NQ==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTE0",
                    "isActive": true,
                    "gateway": "triebwork.payments.rechnung",
                    "created": "2022-01-07T17:19:11.721388+00:00",
                    "modified": "2022-01-12T15:51:44.619711+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA1NQ==",
                      "created": "2022-01-07T17:19:13.586420+00:00",
                      "number": "3055"
                    },
                    "paymentMethodType": "",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY0NA==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      },
                      {
                        "id": "VHJhbnNhY3Rpb246MjY1OA==",
                        "token": "NONE_VORKASSE_TOKEN",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 39.95
                    }
                  }
                ]
              }
            },
            {
              "node": {
                "id": "T3JkZXI6MzA1NA==",
                "channel": {
                  "id": "Q2hhbm5lbDox",
                  "name": "Storefront"
                },
                "payments": [
                  {
                    "id": "UGF5bWVudDozMTEz",
                    "isActive": true,
                    "gateway": "mirumee.payments.braintree",
                    "created": "2022-01-07T12:44:41.945679+00:00",
                    "modified": "2022-01-07T12:44:45.954681+00:00",
                    "chargeStatus": "FULLY_CHARGED",
                    "creditCard": null,
                    "order": {
                      "id": "T3JkZXI6MzA1NA==",
                      "created": "2022-01-07T12:44:46.015635+00:00",
                      "number": "3054"
                    },
                    "paymentMethodType": "paypal",
                    "transactions": [
                      {
                        "id": "VHJhbnNhY3Rpb246MjY0Mw==",
                        "token": "j1wzmf6z",
                        "isSuccess": true
                      }
                    ],
                    "total": {
                      "currency": "EUR",
                      "amount": 16.88
                    }
                  }
                ]
              }
            }
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
      logger: new NoopLogger(),
      db: prismaClient,
      installedSaleorAppId: installedSaleorApp.id,
      tenantId: tenant.id,
      orderPrefix: "STORE",
    });
    await xx.syncToECI();
  }, 80000);
});
