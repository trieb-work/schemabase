export type KencoveApiAttribute = {
  attribute_id: string;
  attribute_name: string;
  model: string;
  display_type: string;
  slug: string;
  attribute_type: string;
  updatedAt: string;
  createdAt: string;
  values:
    | {
        attribute_value: string;
        attribute_value_id: string;
        attribute_id: string;
      }[]
    | null;
};

export type KencoveApiAddress = {
  id: string;
  customerId: string;
  street: string;
  additionalAddressLine: string | null;
  zip: string | null;
  city: string;
  countryCode: string | null;
  countryArea: string | null;
  company: string | null;
  phone: string | null;
  fullname: string;
  state: string | null;
  createdAt: string;
  updatedAt: string;
};

export type KencoveApiProductStock = {
  productId: number;
  product_tmpl_id: number;
  qty_avail: number;
  able_to_make: number;
  total_avail: number;
  warehouse_stock: {
    qty_avail: number;
    warehouse_id: number;
    warehouse_code: string;
  }[];
};

// {
//   "salesOrderNo": "7322948",
//   "packageName": "PACK0090241",
//   "packageId": "90227",
//   "height": 5.0,
//   "width": 5.0,
//   "length": 11.0,
//   "shippingWeight": 1.0,
//   "packageItemline": [
//       {
//           "itemCode": "TCTXS",
//           "quantity": 1.0
//       }
//   ],
//   "pickingId": "278285",
//   "carrierId": null,
//   "carrierName": "USPS Priority Mail",
//   "quoteRef": "29a22d8e-c56c-4243-8a49-92884793f80c",
//   "trackingUrl": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=9405511206238116836795",
//   "trackingNumber": "9405511206238116836795",
//   "createdAt": "2023-08-07T13:53:14.356435",
//   "updatedAt": "2023-08-07T13:53:35.684303"
// },
export type KencoveApiPackage = {
  salesOrderNo: string;
  packageName: string;
  packageId: string;
  height: number;
  width: number;
  length: number;
  shippingWeight: number;
  packageItemline: {
    itemCode: string;
    quantity: number;
  }[];
  pickingId: string;
  carrierId: string | null;
  carrierName: string | null;
  quoteRef: string;
  trackingUrl: string;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
};

export type KencoveApiProductVariant = {
  id: string;
  sku: string;
  weight: number;
  attributeValues: {
    name: string;
    value: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export type KencoveApiProduct = {
  id: string;
  name: string;
  countryOfOrigin: "CN" | "US";
  categoryId: number;
  variants: KencoveApiProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export type KencoveApiCategory = {
  cateorgyId: number;
  categorySlug: string;
  categoryName: string;
  parentCategoryId: string;
  childrenCategoryIds: string[] | null;
  // for example: "kencove.com > Clearance > Connectors-Clearance"
  menuPath: string;
  productIds: string[] | null;
  /**
   * The description of the category as HTML from Odoo
   */
  websiteDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type KencoveApiOrder = {
  id: string;
  orderNumber: string;
  client_order_ref: string | null;
  state: string;
  access_token: string;
  billingAddress: {
    billingAddressId: string;
    name: string;
    email: string;
    street: string;
    street2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    ref: string;
    property_tax_exempt: string | null;
    customerCode: string;
  };
  shippingAddress: {
    shippingAddressId: string;
    name: string;
    email: string;
    street: string;
    street2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  warehouse: {
    name: string;
    code: string;
  };
  carrier: {
    name: string | null;
    delivery_type: string | null;
    carrier_type: string | null;
    ref: string | null;
    code: string | null;
  };
  total_weight: number;
  shipping_cost_total: number;
  has_shipped: string | null;
  date_order: string;
  payment: {
    payment_acquirer: string;
    payment_term: string;
    payment_method: string;
    payment_token: string;
  };
  orderLines: {
    /**
     * Item SKU
     */
    itemCode: string;
    weight: number;
    quantity: number;
    discount: number;
    product_uom: string;
    price_unit: number;
    description: string;
    price_subtotal: number;
    productId: number;
  }[];
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  createdAt: string;
  updatedAt: string;
};
