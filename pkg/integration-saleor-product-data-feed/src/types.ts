/* eslint-disable camelcase */
/**
 * Specs according to https://support.google.com/merchants/answer/7052112?hl=en
 *
 * And for facebook: https://developers.facebook.com/docs/commerce-platform/catalog/fields/
 */
export interface Product {
  /**
   * Your product’s unique identifier
   *
   * @example
   * A2B4
   *
   * Syntax
   * Max 50 characters
   */
  id: string;

  /**
   * Your product’s name
   *
   * @example
   * Mens Pique Polo Shirt
   *
   * Syntax
   * Max 150 characters
   */
  title: string;

  /**
   * Your product’s description
   *
   * @example
   * Made from 100% organic cotton, this classic red men’s polo has a slim fit and
   * signature logo embroidered on the left chest. Machine wash cold; imported.
   *
   * Syntax
   * Max 5000 characters
   */
  description: string;

  /**
   * Rich text description is identical to `description` but allows HTML markup
   *
   * Only supported for facebook. Google does not list it in their specs.
   */
  rich_text_description?: string;

  /**
   * The URL of your product’s main image
   *
   * @example
   * http:// www.example.com/image1.jpg
   */
  image_link?: string;

  /**
   * The URL of an additional image for your product
   *
   * @example
   * http://www.example.com/image1.jpg
   *
   * Syntax
   * Max 2000 characters
   */
  additional_image_link?: string;

  /**
   * Your product’s mobile-optimized landing page when you have a different URL
   * for mobile and desktop traffic
   *
   * @example
   * http://www.m.example.com/asp/sp.asp?cat=12&id=1030
   *
   * Syntax
   * Max 2000 alphanumeric characters
   */
  mobile_link?: string;

  /**
   * Your product’s landing page
   *
   * @example
   * http://www.m.example.com/asp/sp.asp?cat=12&id=1030
   */
  link: string;

  /**
   * Your product’s price
   *
   * @example
   * 15.00 USD
   *
   * Syntax
   *
   * Numeric
   * ISO 4217
   */
  price: string;

  /**
   * Your product's sale price
   *
   * @example
   * 15.00 USD
   *
   * Syntax
   *
   * Numeric
   * ISO 4217
   */
  sale_price?: string;

  /**
   * The condition of your product at time of sale
   *
   * @example
   * new
   *
   * Supported values
   *
   * New [new]
   * Brand new, original, unopened packaging
   * Refurbished [refurbished]
   * Professionally restored to working order, comes with a warranty, may or may not have the
   * original packaging
   *
   * Used [used]
   * Previously used, original packaging opened or missing
   */
  condition: "new" | "refurbished" | "used";

  /**
   * Your product’s Global Trade Item Number (GTIN)
   *
   * @example
   * 3234567890126
   *
   * Syntax
   * Max 50 numeric characters (max 14 per value - added spaces and dashes are ignored)
   *
   * Supported values
   *
   * UPC (in North America / GTIN-12)
   * 12-digit number like 323456789012
   * 8-digit UPC-E codes should be converted to 12-digit codes
   * EAN (in Europe / GTIN-13)
   * 13-digit number like 3001234567892
   * JAN (in Japan / GTIN-13)
   * 8 or 13-digit number like 49123456 or 4901234567894
   * ISBN (for books)
   * 10 or 13-digit number like 1455582344 or 978-1455582341. If you have both, only include the
   * 13-digit number. ISBN-10 are deprecated and should be converted to ISBN-13
   * ITF-14 (for multipacks / GTIN-14)
   * 14-digit number like 10856435001702
   */
  gtin?: string;

  /**
   * Your product’s brand name
   *
   * @example
   * Google
   *
   * Syntax
   * Max 70 characters
   */
  brand: string;

  /**
   * The measure and dimension of your product as it is sold
   *
   * @example
   * 1.5kg
   *
   * Syntax
   * Numerical value + unit
   *
   * Supported units
   *
   * Weight: oz, lb, mg, g, kg
   * Volume US imperial: floz, pt, qt, gal
   * Volume metric: ml, cl, l, cbm
   * Length: in, ft, yd, cm, m
   * Area: sqft, sqm
   * Per unit: ct
   */
  unit_pricing_measure?: string;

  /**
   * The product’s base measure for pricing (for example, 100ml means the price
   * is calculated based on a 100ml units)
   *
   * @example
   * 100g
   *
   * Syntax
   * Integer + unit
   *
   * Supported integers
   * 1, 10, 100, 2, 4, 8
   *
   * Supported units
   *
   * Weight: oz, lb, mg, g, kg
   * Volume US imperial: floz, pt, qt, gal
   * Volume metric: ml, cl, l, cbm
   * Length: in, ft, yd, cm, m
   * Area: sqft, sqm
   * Per unit: ct
   * Additional supported metric integer + unit combinations
   * 75cl, 750ml, 50kg, 1000kg
   */
  unit_pricing_base_measure?: string;

  /**
   * Your product's availability
   *
   * @example
   * in_stock
   *
   * Supported values
   *
   * In stock [in_stock]
   * Out of stock [out_of_stock]
   * Preorder [preorder]
   * Backorder [backorder]
   */
  availability: "out of stock" | "in stock" | "preorder" | "backorder";

  /**
   * Google-defined product category for your product
   *
   * @example
   * Apparel & Accessories > Clothing > Outerwear > Coats & Jackets
   *
   * or
   *
   * 371
   *
   * Syntax
   * Value from the Google product taxonomy
   *
   * The numerical category ID, or
   * The full path of the category
   */
  google_product_category?: string;
}

export type FeedVariant = "googlemerchant" | "facebookcommerce";
