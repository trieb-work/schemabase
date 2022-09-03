import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { SaleorClient } from "@eci/pkg/saleor";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { SaleorProductSyncService } from "./products";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Saleor Entity Sync Products Test", () => {
  const prismaClient = new PrismaClient();
  const mockedSaleorClient = {
    saleorEntitySyncProducts: async () =>
      await Promise.resolve({
        products: {
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "WyIyLWdvb2Qtc3Bpcml0cy1iaW8tY29sZC1icmV3LWNvZmZlZSJd",
            endCursor: "WyJ3aW56ZXItZ2x1ZWh3ZWluLXJvdCJd",
          },
          edges: [
            {
              node: {
                id: "UHJvZHVjdDoxNQ==",
                name: "2 Bio Cold Brew Kaffee fruchtig & schokoladig",
                updatedAt: "2022-03-14T17:28:53.626684+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6Mzc=",
                    name: "Fruchtig + Schokoladig",
                    sku: "friends-coldbrew-gemischt-2-test32",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6Njc=",
                            name: "Fruchtig + Schokoladig",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDo0",
                name: "3 Lebkuchen in Bio-Folie",
                updatedAt: "2022-08-29T10:55:43.636251+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6OQ==",
                    name: "Mixed",
                    sku: "pf-leb-3-gemischt",
                    metadata: [
                      {
                        key: "EAN",
                        value: "0080542773569",
                      },
                    ],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MQ==",
                            name: "Gemischt",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDo1",
                name: "5 Lebkuchen in Bio-Folie",
                updatedAt: "2022-09-01T09:34:39.401302+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MTA=",
                    name: "Mixed",
                    sku: "pf-leb-5-gemischt",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MQ==",
                            name: "Gemischt",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MTE=",
                    name: "Dark Chocolate",
                    sku: "pf-leb-5-dunkle",
                    metadata: [
                      {
                        key: "EAN",
                        value: "0080542773495",
                      },
                    ],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6Mg==",
                            name: "Dunkle Schokolade",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MTI=",
                    name: "White Chocolate",
                    sku: "pf-leb-5-weis",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6Mw==",
                            name: "Weiße Schokolade",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MTM=",
                    name: "Icing",
                    sku: "pf-leb-5-zucker",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NA==",
                            name: "Zuckerguss",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MTQ=",
                    name: "Natural",
                    sku: "pf-leb-5-natur",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NQ==",
                            name: "Natur",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoxNg==",
                name: "6 Bio Cold Brew Kaffee",
                updatedAt: "2022-05-23T13:19:22.296685+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NDA=",
                    name: "Schokoladig",
                    sku: "friends-coldbrew-colombia-6",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NjM=",
                            name: "Schokoladig",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NDE=",
                    name: "Fruchtig",
                    sku: "friends-coldbrew-ethiopia-6",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NjI=",
                            name: "Fruchtig",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDozNw==",
                name: 'Alkoholfreier Sekt - "Weißduftig"',
                updatedAt: "2022-04-26T16:40:21.898992+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NzI=",
                    name: "2x 0,2l Sekt",
                    sku: "jg-secco-weiss-2er",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MTIz",
                            name: "2x 0,2l Sekt",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NzM=",
                    name: "6x 0,2l Sekt",
                    sku: "jg-secco-weiss-6er",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MTI0",
                            name: "6x 0,2l Sekt",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoyNg==",
                name: "Apfel-Quitten-Punsch",
                updatedAt: "2022-08-04T07:38:38.119738+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NTY=",
                    name: "",
                    sku: "winzer-punsch",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDozOA==",
                name: "Apfel-Quitten-Saftschorle (Bio)",
                updatedAt: "2022-06-07T13:34:52.192982+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NzQ=",
                    name: "6x 0,33l",
                    sku: "friends-limo-apfel-quitte-330ml-6",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MTQw",
                            name: "6x 0,33l",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDo5",
                name: "Bienenwachstuch Large",
                updatedAt: "2021-12-24T07:09:01.995398+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6Mjk=",
                    name: "",
                    sku: "friends-tuch-large-gelb",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoxMA==",
                name: "Bienenwachstuch Medium",
                updatedAt: "2022-02-10T10:19:56.183882+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MzA=",
                    name: "",
                    sku: "friends-tuch-medium-blau",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDo4",
                name: "Dose - Alec Doherty",
                updatedAt: "2022-08-31T12:50:23.465957+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NzY=",
                    name: "Bio vegan gemischt",
                    sku: "pf-dose-5-bio-ad-gemischt",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6ODE=",
                            name: "Bio vegan gemischt",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MjQ=",
                    name: "Mixed",
                    sku: "pf-dose-5-ad-gemischt",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MQ==",
                            name: "Gemischt",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDo2",
                name: "Dose - Cachetejack",
                updatedAt: "2022-08-31T13:18:39.346639+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MTc=",
                    name: "Mixed",
                    sku: "pf-dose-5-cj-gemischt",
                    metadata: [
                      {
                        key: "EAN",
                        value: "0080542773501",
                      },
                    ],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MQ==",
                            name: "Gemischt",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MTg=",
                    name: "Dark Chocolate",
                    sku: "pf-dose-5-cj-dunkle",
                    metadata: [
                      {
                        key: "EAN",
                        value: "0080542773518",
                      },
                    ],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6Mg==",
                            name: "Dunkle Schokolade",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MTk=",
                    name: "White Chocolate",
                    sku: "pf-dose-5-cj-weis",
                    metadata: [
                      {
                        key: "EAN",
                        value: "0080542773532",
                      },
                    ],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6Mw==",
                            name: "Weiße Schokolade",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MjA=",
                    name: "Icing",
                    sku: "pf-dose-5-cj-zucker",
                    metadata: [
                      {
                        key: "EAN",
                        value: "0080542773549",
                      },
                    ],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NA==",
                            name: "Zuckerguss",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MjE=",
                    name: "Natural",
                    sku: "pf-dose-5-cj-natur",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NQ==",
                            name: "Natur",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoyNA==",
                name: "Dose – Vegane Bio-Lebkuchen – Maya Stepien",
                updatedAt: "2022-09-01T10:01:29.384560+00:00",
                variants: [],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDozMQ==",
                name: 'Bio Granola "Apfel Stroodle"',
                updatedAt: "2022-03-14T17:31:19.029232+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NjU=",
                    name: "",
                    sku: "granola-2010-apfelstroodle",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoxNw==",
                name: "Granola Erdnuss + Cold Brew Kaffee fruchtig",
                updatedAt: "2021-07-23T11:32:07.560977+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NDM=",
                    name: "",
                    sku: "granola-erdnuss-cold-ethiopia",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoxOA==",
                name: "Granola Erdnuss + Cold Brew Kaffee schokoladig",
                updatedAt: "2021-08-24T16:35:03.280932+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NDQ=",
                    name: "",
                    sku: "granola-erdnuss-cold-colombia",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoxMw==",
                name: 'Bio Granola "Frühsportfreunde"',
                updatedAt: "2022-03-14T17:30:27.426956+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MzM=",
                    name: "",
                    sku: "granola-1701-fruehsportfreunde",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoxOQ==",
                name: "Granola Himbeere + Cold Brew Kaffee fruchtig",
                updatedAt: "2022-08-29T10:19:21.877191+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NDU=",
                    name: "",
                    sku: "granola-himb-cold-ethiopia",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoyMQ==",
                name: "Granola Himbeere + Cold Brew Kaffee schokoladig",
                updatedAt: "2021-08-14T10:18:01.611041+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NDc=",
                    name: "",
                    sku: "granola-himb-cold-colombia",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoxNA==",
                name: 'Bio Granola "Peanut Power"',
                updatedAt: "2022-03-01T13:01:59.816363+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MzQ=",
                    name: "",
                    sku: "granola-2010-peanutpower",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDozOQ==",
                name: "Grußkarte DIN-Lang",
                updatedAt: "2022-07-11T14:14:50.324973+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NzU=",
                    name: "",
                    sku: "cp-greetingcard-din-lang",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoyMw==",
                name: 'Grußkarten-Set "Swing"',
                updatedAt: "2022-05-02T08:45:46.721287+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NTg=",
                    name: "1 Karte + Kuvert",
                    sku: "kartenset-1-swing",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NzA=",
                            name: "1 Karte + Kuvert",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NTk=",
                    name: "5 Karten + Kuverts",
                    sku: "kartenset-5-swing",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NzE=",
                            name: "5 Karten + Kuverts",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoxMg==",
                name: 'Grußkarten-Set "Tanzpaar"',
                updatedAt: "2021-12-24T07:12:16.864199+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NDI=",
                    name: "1 Karte + Kuvert",
                    sku: "kartenset-1-Tanzpaar",
                    metadata: [
                      {
                        key: "EAN",
                        value: "0080542773648",
                      },
                    ],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NzA=",
                            name: "1 Karte + Kuvert",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MzI=",
                    name: "5 Karten + Kuverts",
                    sku: "kartenset-5-Tanzpaar",
                    metadata: [
                      {
                        key: "EAN",
                        value: "0080542773655",
                      },
                    ],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NzE=",
                            name: "5 Karten + Kuverts",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoz",
                name: 'Grußkarten-Set "Piano"',
                updatedAt: "2021-12-24T07:11:29.912443+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NjQ=",
                    name: "1 Karte + Kuvert",
                    sku: "kartenset-1-piano",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NzA=",
                            name: "1 Karte + Kuvert",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6OA==",
                    name: "5 Karten + Kuverts",
                    sku: "kartenset-5-piano",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NzE=",
                            name: "5 Karten + Kuverts",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoy",
                name: 'Grußkarten-Set "Pyjama"',
                updatedAt: "2022-03-14T17:21:02.350079+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NjM=",
                    name: "1 Karte + Kuvert",
                    sku: "kartenset-1-pyjama",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NzA=",
                            name: "1 Karte + Kuvert",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6Nw==",
                    name: "5 Karten + Kuverts",
                    sku: "kartenset-5-pyjama",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NzE=",
                            name: "5 Karten + Kuverts",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoxMQ==",
                name: "Kochbuch + Bienenwachstuch Bundle",
                updatedAt: "2022-05-16T18:18:42.164490+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MzE=",
                    name: "",
                    sku: "nudeln-bienenwachstuch-bundle",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDox",
                name: "Dose - Charlotte Dumortier",
                updatedAt: "2022-08-31T13:37:22.995134+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MQ==",
                    name: "Mixed",
                    sku: "pf-dose-5-cd-gemischt",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MQ==",
                            name: "Gemischt",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6Nzc=",
                    name: "Bio vegan gemischt",
                    sku: "pf-dose-5-bio-cd-gemischt",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6ODE=",
                            name: "Bio vegan gemischt",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6Mg==",
                    name: "Natural",
                    sku: "pf-dose-5-cd-natur",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NQ==",
                            name: "Natur",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6Mw==",
                    name: "Icing",
                    sku: "pf-dose-5-cd-zucker",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NA==",
                            name: "Zuckerguss",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NA==",
                    name: "Dark Chocolate",
                    sku: "pf-dose-5-cd-dunkle",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6Mg==",
                            name: "Dunkle Schokolade",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MjI=",
                    name: "White Chocolate",
                    sku: "pf-dose-5-cd-weis",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6Mw==",
                            name: "Weiße Schokolade",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoyMg==",
                name: "Dose - Maya Stepien",
                updatedAt: "2022-08-31T13:23:03.772514+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NDk=",
                    name: "Mixed",
                    sku: "pf-dose-5-ms-gemischt",
                    metadata: [
                      {
                        key: "EAN",
                        value: "0080542773600",
                      },
                    ],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MQ==",
                            name: "Gemischt",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6Nzg=",
                    name: "Bio vegan gemischt",
                    sku: "pf-dose-5-bio-ms-gemischt",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6ODE=",
                            name: "Bio vegan gemischt",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDo3",
                name: "Nudeln machen glücklich",
                updatedAt: "2022-03-14T17:25:17.026089+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MjM=",
                    name: "",
                    sku: "buch-nudeln",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoyMA==",
                name: "Perma Kalender",
                updatedAt: "2022-05-02T08:46:24.796587+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NDY=",
                    name: "",
                    sku: "pf-permakalender",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDozNg==",
                name: "Osternest 3er-Bundle",
                updatedAt: "2022-04-21T20:26:27.099570+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NzE=",
                    name: "",
                    sku: "bunny-secco-bundle-3er",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoyNQ==",
                name: "Veganer Bio-Lebkuchenbrief",
                updatedAt: "2021-12-24T07:13:39.961626+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NTU=",
                    name: "Natural",
                    sku: "pf-brief-natur",
                    metadata: [
                      {
                        key: "EAN",
                        value: "0036089937791",
                      },
                    ],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NQ==",
                            name: "Natur",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDozNQ==",
                name: "Bio Schoko Osterhase nucao ",
                updatedAt: "2022-08-29T08:59:04.925625+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NzA=",
                    name: "4 Osterhasen",
                    sku: "nu-company-bunny-4er",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MTIx",
                            name: "4 Osterhasen",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6Njk=",
                    name: "8 Osterhasen",
                    sku: "nu-company-bunny-8er",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "set",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MTIy",
                            name: "8 Osterhasen",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDozMA==",
                name: "Winter Rendezvous Bundle",
                updatedAt: "2022-08-29T10:58:26.971957+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NjI=",
                    name: "ganze Bohne",
                    sku: "pf-bundle-winterrendezvous-trad",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Mahlgrad",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6MTA3",
                            name: "ganze Bohne",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDozMg==",
                name: "Winter Rendezvous Filterkaffee",
                updatedAt: "2022-08-29T10:59:13.513348+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NjY=",
                    name: "Fruchtig",
                    sku: "pf-kaffee-filter-winter",
                    metadata: [],
                    variantAttributes: [
                      {
                        attribute: {
                          name: "Sorte",
                        },
                        values: [
                          {
                            id: "QXR0cmlidXRlVmFsdWU6NjI=",
                            name: "Fruchtig",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoyOA==",
                name: "Winzer-Glühwein Rot",
                updatedAt: "2021-12-24T07:14:26.687290+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NTc=",
                    name: "",
                    sku: "gewuerzwein-rot",
                    metadata: [],
                    variantAttributes: [],
                  },
                ],
              },
            },
          ],
        },
      }),
  } as unknown as SaleorClient;

  test("It should work to sync mocked products to internal ECI db", async () => {
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
    const xx = new SaleorProductSyncService({
      saleorClient: mockedSaleorClient,
      channelSlug: "storefront",
      logger: new NoopLogger(),
      db: prismaClient,
      installedSaleorAppId: installedSaleorApp.id,
      tenantId: tenant.id,
    });
    await xx.syncToECI();
  });
});
