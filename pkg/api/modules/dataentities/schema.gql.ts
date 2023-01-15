/* eslint-disable max-len */
import { gql } from "graphql-modules";

export default gql`
  enum OrderDirection {
    asc
    desc
  }
  input OrdersOrderBy {
    date: OrderDirection
    updatedAt: OrderDirection
  }
  input PackageEventsOrderBy {
    time: OrderDirection
  }
  input OrdersInput {
    first: Int!
    cursor: ID
    orderBy: OrdersOrderBy
  }
  extend type Query {
    orders(input: OrdersInput!): OrdersResponse
    order(id: ID, orderNumber: String): Order
  }

  type OrdersResponse {
    edges: [Order!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    endCursor: ID
    hasNextPage: Boolean!
  }

  enum Language {
    DE
    EN
  }

  type Address {
    """
    eci internal id
    """
    id: String!
    """
    Created and updated at the ECI DB
    """
    createdAt: DateTime
    updatedAt: DateTime

    street: String
    additionalAddressLine: String
    plz: String
    city: String
    countryCode: CountryCode
    countryArea: String
    company: String
    phone: String
    fullname: String

    houseNumber: String
    streetWithoutHouseNumber: String

    """
    A unique string identifying this address for easy lookup
    """
    normalizedName: String
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
    mainContact: Contact
    mainContactId: String

    shippingAddress: Address
    billingAddress: Address

    orderLineItems: [OrderLineItem]

    saleorOrders: [SaleorOrder]
    zohoSalesOrders: [ZohoSalesOrder]
    xentralProxyAuftraege: [XentralProxyAuftrag]
  }

  type OrderLineItem {
    # eci internal id
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!

    order: Order!
    orderId: String!

    quantity: Float
    sku: String
    # tax      Tax    @relation(fields: [taxId], references: [id], onDelete: Cascade)
    # taxId    String

    # The total net price (price excluding taxes) of all line item. Optional, as we might have just one of the two values on hand
    totalPriceNet: Float
    # The total gross price (price including taxes) of all line item. Optional, as we might have just one of the two values on hand
    totalPriceGross: Float

    """
    The unit net price (price excluding taxes) of one line item. Optional, as we might have just one of the two values on hand
    """
    undiscountedUnitPriceNet: Float
    """
    The unit gross price (price including taxes) of one line item. Optional, as we might have just one of the two values on hand
    """
    undiscountedUnitPriceGross: Float

    #/ The disount amount, that is applied to the net price (discount excluding taxes).
    discountValueNet: Float
    #/ The disount amount, that is applied to the gross price (discount including taxes).
    #discountValueGross Float @default(0)

    # productVariant   ProductVariant @relation(fields: [productVariantId, sku], references: [id, sku])
    # productVariantId String

    # zohoPackageLineItems ZohoPackageLineItem[]
    # saleorOrderLineItems SaleorOrderLineItem[]
    # zohoOrderLineItems   ZohoOrderLineItem[]
  }
  type Contact {
    # eci internal id
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    email: String!

    firstName: String
    lastName: String

    totalOrders: Int

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
    carrierTrackingUrl: String
    order: Order!
    events(orderBy: PackageEventsOrderBy): [PackageEvent!]!
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

  enum CountryCode {
    AD
    AE
    AF
    AG
    AI
    AL
    AM
    AO
    AQ
    AR
    AS
    AT
    AU
    AW
    AX
    AZ
    BA
    BB
    BD
    BE
    BF
    BG
    BH
    BI
    BJ
    BL
    BM
    BN
    BO
    BQ
    BR
    BS
    BT
    BV
    BW
    BY
    BZ
    CA
    CC
    CD
    CF
    CG
    CH
    CI
    CK
    CL
    CM
    CN
    CO
    CR
    CU
    CV
    CW
    CX
    CY
    CZ
    DE
    DJ
    DK
    DM
    DO
    DZ
    EC
    EE
    EG
    EH
    ER
    ES
    ET
    EU
    FI
    FJ
    FK
    FM
    FO
    FR
    GA
    GB
    GD
    GE
    GF
    GG
    GH
    GI
    GL
    GM
    GN
    GP
    GQ
    GR
    GS
    GT
    GU
    GW
    GY
    HK
    HM
    HN
    HR
    HT
    HU
    ID
    IE
    IL
    IM
    IN
    IO
    IQ
    IR
    IS
    IT
    JE
    JM
    JO
    JP
    KE
    KG
    KH
    KI
    KM
    KN
    KP
    KR
    KW
    KY
    KZ
    LA
    LB
    LC
    LI
    LK
    LR
    LS
    LT
    LU
    LV
    LY
    MA
    MC
    MD
    ME
    MF
    MG
    MH
    MK
    ML
    MM
    MN
    MO
    MP
    MQ
    MR
    MS
    MT
    MU
    MV
    MW
    MX
    MY
    MZ
    NA
    NC
    NE
    NF
    NG
    NI
    NL
    NO
    NP
    NR
    NU
    NZ
    OM
    PA
    PE
    PF
    PG
    PH
    PK
    PL
    PM
    PN
    PR
    PS
    PT
    PW
    PY
    QA
    RE
    RO
    RS
    RU
    RW
    SA
    SB
    SC
    SD
    SE
    SG
    SH
    SI
    SJ
    SK
    SL
    SM
    SN
    SO
    SR
    SS
    ST
    SV
    SX
    SY
    SZ
    TC
    TD
    TF
    TG
    TH
    TJ
    TK
    TL
    TM
    TN
    TO
    TR
    TT
    TV
    TW
    TZ
    UA
    UG
    UM
    US
    UY
    UZ
    VA
    VC
    VE
    VG
    VI
    VN
    VU
    WF
    WS
    YE
    YT
    ZA
    ZM
    ZW
  }
`;
