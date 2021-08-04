import { gql } from "@apollo/client";

export const channelsFragment = gql`
fragment ChannelsFragment on Channel {
  id
  name
  slug
  isActive
}
`

export const fragmentDomain = gql`
  fragment DomainFragment on Shop {
    domain {
      url
      host
    }
  }
`

export const fragmentAddress = gql`
  fragment AddressFragment on Address {
    city
    cityArea
    companyName
    country {
      __typename
      code
      country
    }
    countryArea
    firstName
    id
    lastName
    phone
    postalCode
    streetAddress1
    streetAddress2
  }
`

export const fragmentOrderDetails = gql`
  ${fragmentAddress}
  fragment OrderDetailsFragment on Order {
    id
    billingAddress {
      ...AddressFragment
    }
    canFinalize
    created
    customerNote
    number
    paymentStatus
    shippingMethod {
      id
    }
    shippingMethodName
    shippingPrice {
      gross {
        amount
        currency
      }
    }
    status
    subtotal {
      gross {
        amount
        currency
      }
    }
    total {
      gross {
        amount
        currency
      }
      tax {
        amount
        currency
      }
    }
    actions
    totalAuthorized {
      amount
      currency
    }
    totalCaptured {
      amount
      currency
    }
    user {
      id
      email
    }
    userEmail
    availableShippingMethods {
      id
      name
      price {
        amount
        currency
      }
    }
    discount {
      amount
      currency
    }
    isPaid
  }
`
export const orderErrorFragment = gql`
  fragment OrderErrorFragment on OrderError {
    code
    field
  }
`
