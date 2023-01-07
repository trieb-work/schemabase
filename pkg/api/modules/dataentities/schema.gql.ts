import { gql } from "graphql-modules";

export default gql`
  extend type Query {
    orders: [Order]
    order(id: ID, orderNumber: String): Order
  }

  enum Language {
    DE
    EN
  }

  type Order {
    id: ID!
    language: Language!
    createdAt: DateTime
    updatedAt: DateTime
    packages: [Package!]!
    date: DateTime
    orderNumber: String!
    discountCode: String
    discountValueNet: Float
    totalPriceNet: Float
    totalPriceGross: Float
    firstName: String
    lastName: String

    saleorOrders: [SaleorOrder]
    zohoSalesOrders: [ZohoSalesOrder]
    xentralProxyAuftraege: [XentralProxyAuftrag]
  }

  type Contact {
    # eci internal id
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    email: String!

    firstName: String
    lastName: String

    orders: [Order]
    # invoices: [Invoice]
    payments: [Payment]

    # A Contact can be related to one company
    # company:   Company
    # companyId: String

    # zohoContactPersons: [ZohoContactPerson]
    # addresses: [Address]

    # If we have the users permission to send tracking emails
    trackingEmailsConsent: Boolean
    # If we have the users consent to send marketing emails
    marketingEmailsConstent: Boolean
  }

  type Payment {
    # eci internal id
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    # Unique identifier for a customer payment. We use the payment gateway id as reference.
    referenceNumber: String

    amount: Float

    # Costs for this transaction, for example bank charges, gateway charges, paypal charges
    transactionFee: Float

    order: Order
    orderId: String

    # The person who has created this Payment (In other systems this can also be a Useraccount)
    mainContact: Contact
    mainContactId: String

    # paymentMethod: PaymentMethod!
    # paymentMethodId: String

    # invoices: [Invoice]

    # zohoPayment: [ZohoPayment]
    # saleorPayment: [SaleorPayment]
    # braintreeTransactions: [BraintreeTransaction]
  }

  type ZohoSalesOrder {
    # Zoho Internal Id
    id: String

    createdAt: DateTime
    updatedAt: DateTime

    order: Order!
    orderId: String
  }

  type XentralProxyAuftrag {
    # Xentral internal ID
    id: Int!
    xentralBelegNr: String!

    order: Order!
    orderId: String

    # The status in Xentral
    status: String
  }

  type SaleorOrder {
    id: String

    createdAt: DateTime

    order: Order!
    orderId: String

    # saleorPayment SaleorPayment[]
  }
  enum PackageState {
    INIT
    INFORMATION_RECEIVED
    IN_TRANSIT
    OUT_FOR_DELIVERY
    FAILED_ATTEMPT
    DELIVERED
    AVAILABLE_FOR_PICKUP
    EXCEPTION
    EXPIRED
    PENDING
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
    id: String
    time: DateTime
    state: PackageState
    message: String
    package: Package!
    packageId: String
    location: String
    sentEmail: TransactionalEmail
  }
  type TransactionalEmail {
    id: String
    time: DateTime
    email: String
    sentEmailId: String
    packageEvent: PackageEvent
    packageEventId: String
  }
  enum Carrier {
    DPD
    DHL
    UPS
    HERMES
    PICKUP
    UNKNOWN
    BULK
  }
`;
