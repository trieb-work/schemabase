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
    saleorEntitySyncProducts: async (variables: {
      first: number;
      channel: string;
    }) =>
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
                channel: variables.channel,
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6Mzc=",
                    name: "Fruchtig + Schokoladig",
                    sku: "friends-coldbrew-gemischt-2",
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
                id: "UHJvZHVjdDo1",
                name: "5 Lebkuchen in Bio-Folie",
                updatedAt: "2022-01-19T09:53:43.015867+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MTA=",
                    name: "Mixed",
                    sku: "pf-leb-5-gemischt",
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
                updatedAt: "2022-03-15T15:10:43.436361+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NTY=",
                    name: "",
                    sku: "winzer-punsch",
                    variantAttributes: [],
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
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDo4",
                name: "Dose - Alec Doherty",
                updatedAt: "2022-02-07T08:27:49.381436+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MjQ=",
                    name: "Mixed",
                    sku: "pf-dose-5-ad-gemischt",
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
                updatedAt: "2022-02-28T11:11:04.741473+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MTc=",
                    name: "Mixed",
                    sku: "pf-dose-5-cj-gemischt",
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
                updatedAt: "2022-02-28T11:11:15.738513+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NTQ=",
                    name: "Mixed",
                    sku: "pf-dose-5-bio-ms-gemischt",
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
                id: "UHJvZHVjdDozMQ==",
                name: 'Bio Granola "Apfel Stroodle"',
                updatedAt: "2022-03-14T17:31:19.029232+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NjU=",
                    name: "",
                    sku: "granola-2010-apfelstroodle",
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
                    variantAttributes: [],
                  },
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDox",
                name: "Dose - Charlotte Dumortier",
                updatedAt: "2022-02-07T08:06:53.097551+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NA==",
                    name: "Dunkle Schokolade",
                    sku: "pf-dose-5-cd-dunkle",
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
                    id: "UHJvZHVjdFZhcmlhbnQ6MQ==",
                    name: "Mixed",
                    sku: "pf-dose-5-cd-gemischt",
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
                    id: "UHJvZHVjdFZhcmlhbnQ6Mg==",
                    name: "Natur",
                    sku: "pf-dose-5-cd-natur",
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
                    id: "UHJvZHVjdFZhcmlhbnQ6MjI=",
                    name: "Weiße Schokolade",
                    sku: "pf-dose-5-cd-weis",
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
                    id: "UHJvZHVjdFZhcmlhbnQ6Mw==",
                    name: "Icing",
                    sku: "pf-dose-5-cd-zucker",
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
                ],
              },
            },
            {
              node: {
                id: "UHJvZHVjdDoyMg==",
                name: "Dose - Maya Stepien",
                updatedAt: "2022-03-02T14:01:13.836652+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NDk=",
                    name: "Mixed",
                    sku: "pf-dose-5-ms-gemischt",
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
                    id: "UHJvZHVjdFZhcmlhbnQ6NTA=",
                    name: "Dark Chocolate",
                    sku: "pf-dose-5-ms-dunkle",
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
                    id: "UHJvZHVjdFZhcmlhbnQ6NTE=",
                    name: "White Chocolate",
                    sku: "pf-dose-5-ms-weis",
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
                    id: "UHJvZHVjdFZhcmlhbnQ6NTI=",
                    name: "Icing",
                    sku: "pf-dose-5-ms-zucker",
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
                    id: "UHJvZHVjdFZhcmlhbnQ6NTM=",
                    name: "Natural",
                    sku: "pf-dose-5-ms-natur",
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
                id: "UHJvZHVjdDo3",
                name: "Nudeln machen glücklich",
                updatedAt: "2022-03-14T17:25:17.026089+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6MjM=",
                    name: "",
                    sku: "buch-nudeln",
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
                updatedAt: "2022-04-19T09:50:04.529134+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NzA=",
                    name: "4 Osterhasen",
                    sku: "nu-company-bunny-4er",
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
                id: "UHJvZHVjdDoyOA==",
                name: "Winzer-Glühwein Rot",
                updatedAt: "2021-12-24T07:14:26.687290+00:00",
                variants: [
                  {
                    id: "UHJvZHVjdFZhcmlhbnQ6NTc=",
                    name: "",
                    sku: "gewuerzwein-rot",
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
      installedSaleorApp,
      tenant,
    });
    await xx.syncToECI();
  });
});
