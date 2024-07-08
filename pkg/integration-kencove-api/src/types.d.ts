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
    id: number;
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
        qty_avail: number | null;
        warehouse_id: number | null;
        warehouse_code: string | null;
        warehouse_able_to_make: number | null;
    }[];
};

export type KencoveApiPackage = {
    salesOrderNo: string;
    packageName: string;
    packageId: number;
    height: number;
    width: number;
    length: number;
    /**
     * The package weight in lbs
     */
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
    /**
     * When attribute value is a hex value, like "#000000"
     * then this is the text value of the color, like "Black"
     */
    attribute_text?: string | null | undefined;
};

export type KencoveApiContact = {
    id: number;
    firstname: string | null;
    lastname: string | null;
    companyname: string | null;
    customer_code: string;
    email: string | null;
    phone: string | null;
    phone_extension: string | null;
    mobile: string | null;
    type: string;
    pricelist: {
        id: number;
        name: string;
    };
    createdat: string;
    updatedat: string;
    commercial_partner_id: number;
    /**
     * Use this as external identifier on the customer
     * to match it for example with avalara. E.g."CC-185982:0"
     */
    commerical_customer_code: string;
    active: boolean;
};

export type KencoveApiProductVariant = {
    id: number;
    sku: string;
    weight: number;
    /**
     * The variant selection attribute values
     */
    selectorValues: KencoveApiAttributeInProduct[];
    attributeValues: KencoveApiAttributeInProduct[] | null;
    /**
     * UPC is unique identifier EAN / GTIN
     */
    upc: string | null;
    name: string | null;
    createdAt: string;
    updatedAt: string;
    active: boolean;
    variant_images:
        | {
              url: string;
              slug: string;
              alt_name: string | null;
              mimetype: string | null;
          }[]
        | null;
};
export type KencoveApiImage = {
    url: string;
    slug: string;
    alt_name: string;
};
export type KencoveApiVideo = {
    name: string;
    slug: string;
    video_thumbnail: string;
    url: string;
};
export type KencoveApiOtherMedia = {
    name: string;
    type: string;
    url: string;
};
export type KencoveApiProduct = {
    id: number;
    name: string;
    countryOfOrigin: "CN" | "US" | "PT" | "NZ" | "AU" | "CA" | "GB" | "IE";
    categoryId: number;
    variants: KencoveApiProductVariant[];
    productType?: {
        id: number | number | null;
        name: string | null;
    } | null;
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
    images: KencoveApiImage[] | null;
    videos: KencoveApiVideo[] | null;
    other_media: KencoveApiOtherMedia[] | null;
    /**
     * The avatax tax code for this product
     */
    product_tax_code: string | null;
    /**
     * additional handling - part of shipping details
     */
    additional_handing: 0 | 1;
    /**
     * Truck only handling: We can't give a quotation for these items.
     */
    truck_only: "N" | "Y" | null;
    /**
     * all variants are allowed to be backordered by default.
     * This setting can disable the backorder
     */
    do_not_backorder: boolean;
};
type KencoveApiAAItem = {
    /**
     * Variant Id
     */
    product_template_id: number;
    itemCode: string;
};

export type KencoveApiCategoryImage = {
    url: string;
    slug: string;
    alt_name: string;
    sequence: number;
    tag: "icon" | "banner";
};
export type KencoveApiCategory = {
    cateorgyId: number;
    categorySlug: string | null;
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
    images: KencoveApiCategoryImage[] | null;
};

export type KencoveApiOrderLine = {
    /**
     * Item SKU
     */
    itemCode: string;
    weight: number;
    quantity: 1.0;
    discount: 0.0;
    product_uom: "Units";
    price_unit: number;
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
    warehouseCode: string | null;
    /**
     * e.g.: "6.25%"
     */
    orderLine_taxRate: string;

    /**
     * The total amount of tax for this orderline
     */
    orderLine_tax: number;

    /**
     * Carrier is per orderline
     */
    line_carrier: {
        /**
         * e.g.: "USPS Priority Mail"
         */
        name: string | null;
        delivery_type: "stamps";
        carrier_type: "parcel";
        ref: string;
        code: string;
    };
};

export type KencoveApiPricelistItem = {
    /**
     * for example KEN-R or KEN-D
     */
    pricelist_name: string;
    min_quantity: number;
    freeship_qualified: boolean;
    price: number;
    createdAt: string;
    updatedAt: string;
    date_start: string | null;
    date_end: string | null;
    product_id: null;
    variantItemCode: null | string;
};
export type KencoveApiPricelist = {
    product_template_id: number;
    /**
     * For "real" products with variants in Odoo,
     * this itemCode is empty, but the variantItemCode is set.
     */
    itemCode: string | null;
    priceListItems: KencoveApiPricelistItem[];
    createdAt: string;
    updatedAt: string;
};

export type KencoveApiPayment = {
    partner_id: number;
    customer_code: string;
    payment_id: number;
    invoice_id: number;
    invoice_number: string;
    sale_order_id: number;
    sale_order_number: string;
    move_type: string;
    acquirer_reference: string;
    payment_method: string;
    payment_amount: number;
    payment_state: "done" | "refunded";
    website_name: string;
    createdAt: string;
    updatedAt: string;
};

export type KencoveApiOrder = {
    id: number;
    orderNumber: string;
    client_order_ref: string | null;
    /**
     * Sale: confirmed sale. Sent: quote emailed to the customer. Is "draft".
     */
    state: "cancel" | "sale" | "sent" | "draft" | "done";
    access_token: string;
    billingAddress: {
        billingAddressId: number;
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
        shippingAddressId: number;
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
    shipping_cost_net: number;
    shipping_cost_total: number;
    shipping_tax: number;
    shipping_tax_rate: string;
    has_shipped: string | null;
    date_order: string;
    payment: {
        payment_acquirer: string;
        payment_term: string;
        payment_method: string;
        payment_token: string;
    };
    orderLines?: KencoveApiOrderLine[];
    amount_untaxed: number;
    amount_tax: number;
    amount_total: number;
    createdAt: string;
    updatedAt: string;
};
