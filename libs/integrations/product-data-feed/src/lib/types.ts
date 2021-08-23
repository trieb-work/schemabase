export type Product = {
  id: string;
  title: string;
  description: string;
  rich_text_description: string;
  image_link?: string;
  additional_image_link?: string;
  link: string;
  price: string;
  sale_price: string;
  condition: string;
  gtin?: string;
  brand?: string;
  unit_pricing_measure?: string;
  availability: "out of stock" | "in stock";
  google_product_category?: string;
};

export type FeedVariant = "googlemerchant" | "facebookcommerce";
