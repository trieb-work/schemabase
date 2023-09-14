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
  itemCode: string;
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
  warehouseCode: string;
  createdAt: string;
  updatedAt: string;
};

export type KencoveApiAttributeInProduct = {
  name: string;
  /**
   * Attribute value. Can be for example:
   * "[\"13 Gauge\", \"10 Gauge\", \"11 Gauge\", \"12½ Gauge\", \"14 Gauge\"]"
   * or just a string: "Pack 20". We have to clean this up.
   */
  value: string;
  /**
   * the kencoveApiAttribute.id
   */
  attribute_id: number;
  display_type: string;
  attribute_model: string;
};
export type KencoveApiProductVariant = {
  id: string;
  sku: string;
  weight: number;
  /**
   * The variant selection attribute values
   */
  selectorValues: KencoveApiAttributeInProduct[];
  attributeValues: KencoveApiAttributeInProduct[];
  name: string;
  createdAt: string;
  updatedAt: string;
};
export type KencoveApiImage = {
  url: string;
  slug: string;
  alt_name: string;
};
export type KencoveApiProduct = {
  id: string;
  name: string;
  countryOfOrigin: "CN" | "US" | "PT" | "NZ" | "AU" | "CA" | "GB" | "IE";
  categoryId: number;
  variants: KencoveApiProductVariant[];
  productType: {
    id: string;
    name: string;
  };
  website_description: string;
  createdAt: string;
  updatedAt: string;
  /**
   * Alternative products. These are actually variants
   */
  alternatives: KencoveApiAAItem[] | null;
  /**
   * Alternative products. These are actually variants
   */
  accessories: KencoveApiAAItem[] | null;
  images: KencoveApiImage[];
};
type KencoveApiAAItem = {
  /**
   * Variant Id
   */
  product_template_id: number;
  itemCode: string;
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

export type KencoveApiOrderLine = {
  /**
   * Item SKU
   */
  itemCode: string;
  weight: 0.5;
  quantity: 1.0;
  discount: 0.0;
  product_uom: "Units";
  price_unit: 7.25;
  /**
   * Text description like: "[MCCHD] Cut Out Switch -Heavy Duty"
   */
  description: string;
  price_subtotal: 7.25;
  /**
   * The variant Id from Kencove
   */
  productId: number;
  /**
   * For example "PA"
   */
  warehouseCode: string;
  /**
   * e.g.: "6.25%"
   */
  orderLine_taxRate: string;
};

export type KencoApiPricelistItem = {
  /**
   * for example KEN-R or KEN-D
   */
  pricelist_name: string;
  min_quantity: number;
  freeship_qualified: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
  date_start: string;
  date_end: string | null;
  product_id: null;
  variantItemCode: null;
};
export type KencoveApiPricelist = {
  product_template_id: number;
  itemCode: string;
  priceListItems: KencoApiPricelistItem[];
  createdAt: string;
  updatedAt: string;
};

export type KencoveApiOrder = {
  id: string;
  orderNumber: string;
  client_order_ref: string | null;
  /**
   * Sale: confirmed sale. Sent: quote emailed to the customer. Is "draft".
   */
  state: "cancel" | "sale" | "sent" | "draft";
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
  orderLines: KencoveApiOrderLine[];
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  createdAt: string;
  updatedAt: string;
};
