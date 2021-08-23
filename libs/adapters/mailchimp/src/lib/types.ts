export type ECommerceCustomer = {
  id: string;
  email_address?: string;
  first_name?: string;
  last_name?: string;
  opt_in_status?: boolean;
  company?: string;
};

export type MailchimpMemberStatus =
  | "subscribed"
  | "unsubscribed"
  | "cleaned"
  | "pending"
  | "transactional";
export type Orderline = {
  id: string;
  product_id: string;
  product_variant_id: string;
  quantity: number;
  price: number;
  discount?: number;
  title?: string;
};
export type Promos = { code: string; amount_discounted: number; type: "fixed" };

export type MailchimpOrder = {
  id: string;
  customer: unknown;
  currency_code: string;
  order_total: number | string;
  shipping_total: number | string;
  tax_total: number | string;
  processed_at_foreign: string;
  lines: Orderline[];
  shipping_address: {
    name: string;
    address1: string;
    address2: string;
    city: string;
    postal_code: string;
    country?: string;
    country_code?: string;
    company: string;
  };
  billing_address: {
    name: string;
    address1: string;
    address2: string;
    city: string;
    postal_code: string;
    country?: string;
    country_code?: string;
    company: string;
  };
  discount_total: number;
  promos: Promos[];
  landing_site: string;
  financial_status: "pending";
  fulfillment_status: "pending";
  order_url: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  url: "";
  sku: "pf-leb-5-gemischt";
  price: number;
  inventory_quantity: 0;
  image_url: "https://s3.triebwork.com/static/products/3-lebkuchen-in-bio-folie.jpg";
  backorders: "";
  visibility: "";
  created_at: "2021-02-13T11:37:28+00:00";
  updated_at: "2021-02-13T11:37:29+00:00";
};
