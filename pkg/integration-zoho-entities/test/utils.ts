// TODO move to new package pkg/prisma-seeding-utils/eci, pkg/prisma-seeding-utils/zoho

import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { id } from "@eci/pkg/ids";
import {
  GatewayType,
  PaymentMethodType,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { normalizeStrings } from "@eci/pkg/normalization";
import { checkCurrency } from "@eci/pkg/normalization/src/currency";

const LOGGING = true;

export async function deleteInvoices(
  prisma: PrismaClient,
  orderNumber: string | Prisma.StringFilter,
) {
  const delRes = await prisma.invoice.deleteMany({
    where: {
      orders: {
        some: {
          AND: {
            orderNumber,
            tenantId: "test",
          },
        },
      },
    },
  });
  if (LOGGING) console.log("deleted Invoice", delRes.count);
}
export async function deleteOrders(
  prisma: PrismaClient,
  orderNumber: string | Prisma.StringFilter,
) {
  const delRes = await prisma.order.deleteMany({
    where: {
      AND: {
        orderNumber,
        tenantId: "test",
      },
    },
  });
  if (LOGGING) console.log("deleted Order", delRes.count);
}

export async function deleteOrder(prisma: PrismaClient, orderNumber: string) {
  const delRes = await prisma.order.deleteMany({
    where: {
      AND: {
        orderNumber,
        tenantId: "test",
      },
    },
  });
  if (LOGGING) console.log("deleted Order", delRes.count);
}

export async function upsertProductVariant(prisma: PrismaClient) {
  await prisma.productVariant.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      sku: "test-1",
      variantName: "mixed NEU1",
      ean: "123456780123",
      product: {
        create: {
          id: "test",
          name: "test",
          normalizedName: "test",
          tenant: {
            connect: {
              id: "test",
            },
          },
        },
      },
      defaultWarehouse: {
        connect: {
          id: "test",
        },
      },
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created one generic productVariant");
}

export async function upsertOrder(
  prisma: PrismaClient,
  orderNumber: string,
  totalPriceGross = 234.68,
  discountValueNet: number | undefined = undefined,
) {
  await prisma.order.upsert({
    where: {
      orderNumber_tenantId: {
        orderNumber,
        tenantId: "test",
      },
    },
    update: {},
    create: {
      id: id.id("order"),
      createdAt: "1970-01-01T00:00:00.000Z",
      date: "2022-01-01T00:00:00.000Z",
      orderNumber,
      totalPriceGross,
      ...(discountValueNet ? { discountValueNet } : {}),
      orderStatus: "confirmed",
      readyToFullfill: true,
      shippingAddress: {
        connect: {
          id: "test",
        },
      },
      billingAddress: {
        connect: {
          id: "test",
        },
      },
      tenant: {
        connect: {
          id: "test",
        },
      },
      mainContact: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created one generic order");
}

export async function upsertZohoWarehouse(prisma: PrismaClient) {
  await prisma.zohoWarehouse.upsert({
    where: {
      id_zohoAppId: {
        id: "116240000000067007",
        zohoAppId: "test",
      },
    },
    update: {
      id: "116240000000067007",
      zohoApp: {
        connect: {
          id: "test",
        },
      },
      warehouse: {
        connect: {
          id: "test",
        },
      },
    },
    create: {
      id: "116240000000067007",
      zohoApp: {
        connect: {
          id: "test",
        },
      },
      warehouse: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created and connected zoho warehozse with warehouse");
}

export async function connectZohoBankToBraintreeCardPm(prisma: PrismaClient) {
  await prisma.zohoBankAccount.update({
    where: {
      id_zohoAppId: {
        id: "116240000000482021",
        zohoAppId: "test",
      },
    },
    data: {
      paymentMethod: {
        connect: {
          gatewayType_methodType_currency_tenantId: {
            gatewayType: "braintree",
            methodType: "card",
            currency: "EUR",
            tenantId: "test",
          }
        }
      }
    }
  });
  if (LOGGING) console.log("connected zoho bank account with braintree/card payment method");
}
export async function connectZohoBankToBraintreePaypalPm(prisma: PrismaClient) {
  await prisma.zohoBankAccount.update({
    where: {
      id_zohoAppId: {
        id: "116240000000482029",
        zohoAppId: "test",
      },
    },
    data: {
      paymentMethod: {
        connect: {
          gatewayType_methodType_currency_tenantId: {
            gatewayType: "braintree",
            methodType: "paypal",
            currency: "EUR",
            tenantId: "test",
          }
        }
      }
    }
  });
  if (LOGGING) console.log("connected zoho bank account with braintree/paypal payment method");
}
export async function connectZohoBankToBanktransferPm(prisma: PrismaClient) {
  await prisma.zohoBankAccount.update({
    where: {
      id_zohoAppId: {
        id: "116240000000482013",
        zohoAppId: "test",
      },
    },
    data: {
      paymentMethod: {
        connect: {
          gatewayType_methodType_currency_tenantId: {
            gatewayType: "banktransfer",
            methodType: "banktransfer",
            currency: "EUR",
            tenantId: "test",
          }
        }
      }
    }
  });
  if (LOGGING) console.log("connected zoho bank account with banktransfer/banktransfer payment method");
}
export async function upsertPaymentMethods(prisma: PrismaClient) {
  await upsertPaymentMethod(prisma, "test-1", {
    gatewayType: "braintree",
    methodType: "card",
    currency: "EUR",
    tenantId: "test",
  });
  await upsertPaymentMethod(prisma, "test-2", {
    gatewayType: "braintree",
    methodType: "paypal",
    currency: "EUR",
    tenantId: "test",
  });
  await upsertPaymentMethod(prisma, "test-3", {
    gatewayType: "banktransfer",
    methodType: "banktransfer",
    currency: "EUR",
    tenantId: "test",
  });
}
export async function upsertPaymentMethod(
  prisma: PrismaClient,
  id: string,
  config: Prisma.PaymentMethodGatewayTypeMethodTypeCurrencyTenantIdCompoundUniqueInput,
) {
  await prisma.paymentMethod.upsert({
    where: {
      gatewayType_methodType_currency_tenantId: config,
    },
    update: {},
    create: {
      ...config,
      id,
    },
  });
  if (LOGGING) console.log("created payment method: " + id);
}
export async function upsertZohoBankAccounts(prisma: PrismaClient) {
  await upsertZohoBankAccount(
    prisma,
    "Braintree Sandbox",
    {
      gatewayType: "braintree",
      methodType: "card",
      currency: "EUR",
      tenantId: "test",
    },
    {
      // braintree card
      id: "116240000000482021",
      zohoAppId: "test",
    },
  );
  await upsertZohoBankAccount(
    prisma,
    "PayPal Sandbox",
    {
      gatewayType: "braintree",
      methodType: "paypal",
      currency: "EUR",
      tenantId: "test",
    },
    {
      // braintree paypal
      id: "116240000000482029",
      zohoAppId: "test",
    },
  );
  await upsertZohoBankAccount(
    prisma,
    "Penta P+F Dev Online",
    {
      gatewayType: "banktransfer",
      methodType: "banktransfer",
      currency: "EUR",
      tenantId: "test",
    },
    {
      // banktransfer banktransfer
      id: "116240000000482013",
      zohoAppId: "test",
    },
  );
}
export async function upsertZohoBankAccount(
  prisma: PrismaClient,
  name: string,
  paymentMethodConfig: Prisma.PaymentMethodGatewayTypeMethodTypeCurrencyTenantIdCompoundUniqueInput,
  config: Prisma.ZohoBankAccountIdZohoAppIdCompoundUniqueInput,
) {
  await prisma.zohoBankAccount.upsert({
    where: {
      id_zohoAppId: config,
    },
    update: {},
    create: {
      ...config,
      currency: "EUR",
      name,
      active: true,
      paymentMethod: {
        connect: {
          gatewayType_methodType_currency_tenantId: paymentMethodConfig,
        },
      },
    },
  });
  if (LOGGING) console.log("created zoho bank account: " + name);
}

export async function deletePayment(prisma: PrismaClient) {
  const delRes = await prisma.payment.deleteMany({
    where: {
      id: "test",
    },
  });
  if (LOGGING) console.log("deleted payment", delRes.count);
}
export async function upsertPayment(
  prisma: PrismaClient,
  orderNumber: string,
  totalPriceGross = 156.45,
  gatewayType: GatewayType = "braintree",
  methodType: PaymentMethodType = "card",
  referenceNumber: string = "11068bv7", // ist eig. ne paypal ref nr
) {
  await prisma.payment.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      amount: totalPriceGross,
      referenceNumber,
      createdAt: "2022-09-15T13:45:45.799Z",
      tenant: {
        connect: {
          id: "test",
        },
      },
      paymentMethod: {
        connect: {
          gatewayType_methodType_currency_tenantId: {
            gatewayType,
            methodType,
            currency: checkCurrency("EUR"),
            tenantId: "test",
          },
        },
      },
      order: {
        connect: {
          orderNumber_tenantId: {
            tenantId: "test",
            orderNumber,
          },
        },
      },
    },
  });
  if (LOGGING) console.log("created one generic payment");
}

export async function upsertLineItem1(
  prisma: PrismaClient,
  orderNumber: string,
  discountValueNet: number | undefined = undefined,
) {
  await prisma.orderLineItem.upsert({
    where: {
      id: `test-l1-${orderNumber}`,
    },
    update: {},
    create: {
      id: `test-l1-${orderNumber}`,
      quantity: 10,
      ...(discountValueNet ? { discountValueNet } : {}),
      uniqueString: uniqueStringOrderLine(
        orderNumber,
        `test-l1-${orderNumber}`,
        10,
      ),
      tax: {
        connect: {
          id: "test",
        },
      },
      productVariant: {
        connect: {
          id: "test",
        },
      },
      order: {
        connect: {
          orderNumber_tenantId: {
            orderNumber,
            tenantId: "test",
          },
        },
      },
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created one generic lineitem for the order");
}

export async function upsertLineItemWithRealProductVariantFromZoho(
  prisma: PrismaClient,
  orderNumber: string,
) {
  await prisma.orderLineItem.upsert({
    where: {
      id: `test-l1-1-${orderNumber}`,
    },
    update: {},
    create: {
      id: `test-l1-1-${orderNumber}`,
      quantity: 10,
      uniqueString: uniqueStringOrderLine(
        orderNumber,
        `test-l1-1-${orderNumber}`,
        10,
      ),
      tax: {
        connect: {
          id: "test",
        },
      },
      productVariant: {
        connect: {
          sku_tenantId: {
            sku: "pf-leb-5-gemischt",
            tenantId: "test",
          },
        },
      },
      order: {
        connect: {
          orderNumber_tenantId: {
            orderNumber,
            tenantId: "test",
          },
        },
      },
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created one generic lineitem for the order");
}

export async function upsertLineItem2(
  prisma: PrismaClient,
  orderNumber: string,
) {
  await prisma.orderLineItem.upsert({
    where: {
      id: `test-l2-${orderNumber}`,
    },
    update: {},
    create: {
      id: `test-l2-${orderNumber}`,
      quantity: 5,
      uniqueString: uniqueStringOrderLine(
        orderNumber,
        `test-l2-${orderNumber}`,
        5,
      ),
      tax: {
        connect: {
          id: "test",
        },
      },
      productVariant: {
        connect: {
          id: "test",
        },
      },
      order: {
        connect: {
          orderNumber_tenantId: {
            orderNumber,
            tenantId: "test",
          },
        },
      },
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created second generic lineitem for the order");
}

export async function recreateContact(prisma: PrismaClient) {
  const delRes = await prisma.contact.deleteMany({
    where: {
      id: "test",
    },
  });
  if (LOGGING) console.log("deleted contact", delRes.count);
  await upsertContact(prisma);
}

export async function upsertContact(prisma: PrismaClient) {
  await prisma.contact.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      email: "tilman@trieb.work",
      firstName: "Tilman",
      lastName: "Marquart",
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created contact");
}
export async function recreateAddress(prisma: PrismaClient) {
  const delRes = await prisma.address.deleteMany({
    where: {
      id: "test",
    },
  });
  if (LOGGING) console.log("deleted address", delRes.count);
  await upsertAddress(prisma);
}
export async function upsertAddress(prisma: PrismaClient) {
  await prisma.address.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      tenant: {
        connect: {
          id: "test",
        },
      },
      normalizedName: "testtestGabelsbergerstr.15",
      city: "Nürnberg",
      countryCode: "DE",
      fullname: "Tilman Marquart",
      plz: "90459",
      street: "Gabelsbergerstr. 15",
      contact: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created one address for the generic order");
}

export async function recreateTax(prisma: PrismaClient) {
  await prisma.tax.deleteMany({
    where: {
      id: "test",
    },
  });
  if (LOGGING) console.log("deleted tax");
  await upsertTax(prisma);
}

export async function upsertTax(prisma: PrismaClient) {
  await prisma.tax.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      name: "Reduziert - Temp",
      normalizedName: normalizeStrings.taxNames("Reduziert - Temp"),
      percentage: 5,
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created tax");
}

/**
 *
 * --------------  combined creation with zoho entities as well  ----------------------------
 */

export async function upsertContactWithZohoContactPersonsAndZohoContact(
  prisma: PrismaClient,
) {
  await prisma.contact.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      email: "tilman+zohoContactTest@trieb.work",
      tenant: {
        connect: {
          id: "test",
        },
      },
      zohoContactPersons: {
        connectOrCreate: {
          where: {
            id_zohoAppId: {
              id: "116240000001668125",
              zohoAppId: "test",
            },
          },
          create: {
            email: "tilman+zohoContactTest@trieb.work",
            id: "116240000001668125",
            zohoApp: {
              connect: {
                id: "test",
              },
            },
            zohoContact: {
              connectOrCreate: {
                where: {
                  id_zohoAppId: {
                    id: "116240000001558532",
                    zohoAppId: "test",
                  },
                },
                create: {
                  id: "116240000001558532",
                  zohoApp: {
                    connect: {
                      id: "test",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (LOGGING) console.log("created contact + zohoContact + zohoContactPerson");
}

export async function upsertAddressWithZohoAddress(prisma: PrismaClient) {
  await prisma.address.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      tenant: {
        connect: {
          id: "test",
        },
      },
      normalizedName: "testtestGabelsbergerstr.15",
      city: "Nürnberg",
      countryCode: "DE",
      fullname: "Tilman Marquart",
      plz: "90459",
      street: "Gabelsbergerstr. 15",
      zohoAddress: {
        connectOrCreate: {
          where: {
            id_zohoAppId: {
              id: "116240000001558534",
              zohoAppId: "test",
            },
          },
          create: {
            id: "116240000001558534",
            zohoApp: {
              connect: {
                id: "test",
              },
            },
          },
        },
      },
      contact: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING)
    console.log("created one address + zohoAddress for the generic order");
}

export async function upsertTaxWithZohoTax(prisma: PrismaClient) {
  await prisma.tax.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      normalizedName: "test",
      name: "test",
      percentage: 19,
      tenant: {
        connect: {
          id: "test",
        },
      },
      zohoTaxes: {
        connectOrCreate: {
          where: {
            id_zohoAppId: {
              id: "116240000000147001",
              zohoAppId: "test",
            },
          },
          create: {
            id: "116240000000147001",
            zohoApp: {
              connect: {
                id: "test",
              },
            },
          },
        },
      },
    },
  });
  if (LOGGING) console.log("created tax + zohoTax");
}

export async function upsertZohoItem(prisma: PrismaClient) {
  await prisma.zohoItem.upsert({
    where: {
      id_zohoAppId: {
        id: "116240000000203041",
        zohoAppId: "test",
      },
    },
    update: {},
    create: {
      id: "116240000000203041",
      createdAt: "1970-01-01T00:00:00.000Z",
      updatedAt: "1970-01-01T00:00:00.000Z",
      zohoApp: {
        connect: {
          id: "test",
        },
      },
      productVariant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created zohoItem");
}

/**
 *
 * this deletes pf-leb-5-gemischt
 */
export async function deleteZohoItem(prisma: PrismaClient) {
  const delRes = await prisma.zohoItem.deleteMany({
    where: {
      id: "116240000000203041", // = pf-leb-5-gemischt
      zohoAppId: "test",
    },
  });
  if (LOGGING) console.log("deleted zohoItem", delRes.count);
}
