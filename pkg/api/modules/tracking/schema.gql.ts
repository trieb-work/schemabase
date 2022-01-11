import { gql } from "graphql-modules";

export default gql`
  enum PackageState {
    # Initial state when the package is created
    INIT
    # The carrier has received the shipment info and is about to pick up the package.
    INFORMATION_RECEIVED
    # The shipment has been accepted and is in transit now.
    IN_TRANSIT
    # The carrier is on its way to deliver the shipment.
    OUT_FOR_DELIVERY
    # The carrier attemptet to deliver the shipment but failed. It ususlly leavesa notice and will try to deliver again.
    FAILED_ATTEMPT
    # The shipment has been delivered successfully.
    DELIVERED
    # The package has arrived at the nearest pickup point and is available for pickup.
    AVAILABLE_FOR_PICKUP
    # Held at customs, undelivered, returned to sender, or any other shipping exceptions.
    EXCEPTION
    # The shipment has expired as the carrier didn't return the tracking info for the lat 30 days.
    EXPIRED
    # The shipment is pending as the carrier didn't return the tracking info.
    PENDING
  }

  enum Carrier {
    DPD
  }

  enum Language {
    DE
    EN
  }

  type Order {
    id: ID!
    externalOrderId: ID!
    email: String!
    language: Language!
    packages: [Package!]!
  }
  type Package {
    id: ID!
    carrier: Carrier!
    state: PackageState!
    trackingId: ID!
    carrierTrackingUrl: String!
    order: Order!
    events: [PackageEvent!]!
  }
  type PackageEvent {
    id: ID!
    # Unix timestamp in seconds
    time: Int!
    state: PackageState!
    message: String!
    package: Package!
    location: String!
    sentEmail: TransactionalEmail!
  }
  type TransactionalEmail {
    id: ID!
    #Unix timestamp in seconds
    time: Int!
    email: String!
    packageEvent: PackageEvent!
  }
  extend type Query {
    orderById(orderId: ID!): Order
    packageByTrackingId(trackingId: ID!): Package
  }
`;
