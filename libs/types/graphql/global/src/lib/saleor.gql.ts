import { gql } from "@apollo/client";
import {
  channelsFragment,
  fragmentDomain,
  orderErrorFragment,
  fragmentOrderDetails,
} from "./fragments.gql";

export const warehouseQuery = gql`
  query getWarehouses($first: Int) {
    warehouses(first: $first) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;

export const verifyTokenQuery = gql`
  mutation VerifyToken($token: String!) {
    tokenVerify(token: $token) {
      user {
        id
      }
      isValid
    }
  }
`;
export const verifyAppTokenMutation = gql`
  mutation VerifyAppToken($token: String!) {
    appTokenVerify(token: $token) {
      valid
    }
  }
`;

export const getOrderQuery = gql`
  query getOrder($id: ID!) {
    order(id: $id) {
      status
      token
      id
      shippingPrice {
        currency
        gross {
          amount
        }
        net {
          amount
        }
      }
      total {
        currency
        gross {
          amount
        }
      }
      fulfillments {
        created
        trackingNumber
        lines {
          id
          quantity
          orderLine {
            productSku
          }
        }
      }
      voucher {
        id
        code
        discountValue
        type
        discountValueType
      }
      paymentStatus
      privateMetadata {
        key
        value
      }
      lines {
        id
        quantity
        productSku
        taxRate
        unitPrice {
          gross {
            currency
            amount
          }
        }
        variant {
          id
          product {
            id
          }
        }
      }
    }
  }
`;
export const fulfillmentMutation = gql`
  mutation createFulfillment($orderId: ID!, $input: OrderFulfillInput!) {
    orderFulfill(order: $orderId, input: $input) {
      fulfillments {
        id
        status
      }
      orderErrors {
        field
        message
        code
      }
    }
  }
`;
export const updateTrackingMutation = gql`
  mutation SetTrackingNumber($id: ID!, $trackingNumber: String!) {
    orderFulfillmentUpdateTracking(
      id: $id
      input: { trackingNumber: $trackingNumber }
    ) {
      fulfillment {
        id
        trackingNumber
      }
      orderErrors {
        field
        message
        code
      }
    }
  }
`;

export const productVariant = gql`
  query getVariant($sku: String, $id: ID) {
    productVariant(sku: $sku, id: $id) {
      id
      name
      images {
        url
        id
      }
      stocks {
        quantityAllocated
        warehouse {
          id
          name
        }
      }
    }
  }
`;
export const getProduct = gql`
  query getProductQuery($id: ID!) {
    product(id: $id) {
      images {
        id
        url
      }
      productType {
        hasVariants
      }
      name
      slug
      updatedAt
      variants {
        id
        name
        sku
        pricing {
          price {
            gross {
              amount
            }
          }
        }
        quantityAvailable
        images {
          id
          url
        }
      }
    }
  }
`;

export const stockLevelMutation = gql`
  mutation updateStockLevel(
    $variantId: ID!
    $warehouseId: ID!
    $quantity: Int!
  ) {
    productVariantStocksUpdate(
      variantId: $variantId
      stocks: { warehouse: $warehouseId, quantity: $quantity }
    ) {
      productVariant {
        id
        name
      }
      bulkStockErrors {
        field
        message
        code
      }
    }
  }
`;

export const getShopDomain = gql`
  ${fragmentDomain}
  query getShopDomain {
    shop {
      ...DomainFragment
    }
  }
`;

export const addPrivateMetaMutation = gql`
  mutation addPrivateMeta($id: ID!, $input: [MetadataInput!]!) {
    updatePrivateMetadata(id: $id, input: $input) {
      item {
        privateMetadata {
          key
          value
        }
      }
      metadataErrors {
        field
        message
        code
      }
    }
  }
`;

export const orderCaptureMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderCapture($id: ID!, $amount: PositiveDecimal!) {
    orderCapture(id: $id, amount: $amount) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const getChannelsQuery = gql`
  ${channelsFragment}
  query Channels {
    channels {
      ...ChannelsFragment
    }
  }
`;

export const ProductDataFeed = gql`
  query ProductDataFeed($first: Int!, $channel: String) {
    products(first: $first, channel: $channel) {
      edges {
        node {
          seoDescription
          name
          seoTitle
          isAvailableForPurchase
          descriptionJson
          slug
          weight {
            unit
            value
          }
          images {
            id
            url
          }
          metadata {
            key
            value
          }
          attributes {
            attribute {
              id
              name
            }
            values {
              id
              name
            }
          }
          productType {
            name
            id
            hasVariants
          }
          variants {
            id
            name
            sku
            quantityAvailable
            weight {
              unit
              value
            }
            metadata {
              key
              value
            }
            pricing {
              priceUndiscounted {
                gross {
                  amount
                  currency
                }
              }
              price {
                gross {
                  amount
                  currency
                }
                net {
                  amount
                }
              }
              onSale
              discount {
                gross {
                  amount
                }
              }
            }
            images {
              url
            }
          }
        }
      }
    }
  }
`;

export const paymentTransactionData = gql`
  query getPayment($id: ID!) {
    payment(id: $id) {
      transactions {
        id
        token
      }
    }
  }
`;
