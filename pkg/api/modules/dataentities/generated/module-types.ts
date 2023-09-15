import * as Types from "../../../generated/schema-types";
import * as gm from "graphql-modules";
export namespace DataentitiesModule {
    interface DefinedFields {
        Query: "orders" | "order";
        OrdersResponse: "edges" | "pageInfo";
        PageInfo: "endCursor" | "hasNextPage";
        Address:
            | "id"
            | "createdAt"
            | "updatedAt"
            | "street"
            | "additionalAddressLine"
            | "plz"
            | "city"
            | "countryCode"
            | "countryArea"
            | "company"
            | "phone"
            | "fullname"
            | "houseNumber"
            | "streetWithoutHouseNumber"
            | "normalizedName";
        Order:
            | "id"
            | "language"
            | "createdAt"
            | "updatedAt"
            | "packages"
            | "date"
            | "orderNumber"
            | "discountCode"
            | "discountValueNet"
            | "totalPriceNet"
            | "totalPriceGross"
            | "firstName"
            | "lastName"
            | "mainContact"
            | "mainContactId"
            | "shippingAddress"
            | "billingAddress"
            | "orderLineItems"
            | "saleorOrders"
            | "zohoSalesOrders"
            | "xentralProxyAuftraege";
        OrderLineItem:
            | "id"
            | "createdAt"
            | "updatedAt"
            | "order"
            | "orderId"
            | "quantity"
            | "sku"
            | "totalPriceNet"
            | "totalPriceGross"
            | "undiscountedUnitPriceNet"
            | "undiscountedUnitPriceGross"
            | "discountValueNet";
        Contact:
            | "id"
            | "createdAt"
            | "updatedAt"
            | "email"
            | "firstName"
            | "lastName"
            | "totalOrders"
            | "orders"
            | "payments"
            | "trackingEmailsConsent"
            | "marketingEmailsConstent";
        Payment:
            | "id"
            | "createdAt"
            | "updatedAt"
            | "referenceNumber"
            | "amount"
            | "transactionFee"
            | "order"
            | "orderId"
            | "mainContact"
            | "mainContactId";
        ZohoSalesOrder: "id" | "createdAt" | "updatedAt" | "order" | "orderId";
        XentralProxyAuftrag:
            | "id"
            | "xentralBelegNr"
            | "order"
            | "orderId"
            | "status";
        SaleorOrder: "id" | "createdAt" | "order" | "orderId";
        Package:
            | "id"
            | "carrier"
            | "state"
            | "trackingId"
            | "carrierTrackingUrl"
            | "order"
            | "events";
        PackageEvent:
            | "id"
            | "time"
            | "state"
            | "message"
            | "package"
            | "packageId"
            | "location"
            | "sentEmail";
        TransactionalEmail:
            | "id"
            | "time"
            | "email"
            | "sentEmailId"
            | "packageEvent"
            | "packageEventId";
    }

    interface DefinedEnumValues {
        OrderDirection: "asc" | "desc";
        Language: "DE" | "EN";
        PackageState:
            | "INIT"
            | "INFORMATION_RECEIVED"
            | "IN_TRANSIT"
            | "OUT_FOR_DELIVERY"
            | "FAILED_ATTEMPT"
            | "DELIVERED"
            | "AVAILABLE_FOR_PICKUP"
            | "EXCEPTION"
            | "EXPIRED"
            | "PENDING";
        Carrier:
            | "DPD"
            | "DHL"
            | "UPS"
            | "HERMES"
            | "PICKUP"
            | "UNKNOWN"
            | "BULK";
        CountryCode:
            | "AD"
            | "AE"
            | "AF"
            | "AG"
            | "AI"
            | "AL"
            | "AM"
            | "AO"
            | "AQ"
            | "AR"
            | "AS"
            | "AT"
            | "AU"
            | "AW"
            | "AX"
            | "AZ"
            | "BA"
            | "BB"
            | "BD"
            | "BE"
            | "BF"
            | "BG"
            | "BH"
            | "BI"
            | "BJ"
            | "BL"
            | "BM"
            | "BN"
            | "BO"
            | "BQ"
            | "BR"
            | "BS"
            | "BT"
            | "BV"
            | "BW"
            | "BY"
            | "BZ"
            | "CA"
            | "CC"
            | "CD"
            | "CF"
            | "CG"
            | "CH"
            | "CI"
            | "CK"
            | "CL"
            | "CM"
            | "CN"
            | "CO"
            | "CR"
            | "CU"
            | "CV"
            | "CW"
            | "CX"
            | "CY"
            | "CZ"
            | "DE"
            | "DJ"
            | "DK"
            | "DM"
            | "DO"
            | "DZ"
            | "EC"
            | "EE"
            | "EG"
            | "EH"
            | "ER"
            | "ES"
            | "ET"
            | "EU"
            | "FI"
            | "FJ"
            | "FK"
            | "FM"
            | "FO"
            | "FR"
            | "GA"
            | "GB"
            | "GD"
            | "GE"
            | "GF"
            | "GG"
            | "GH"
            | "GI"
            | "GL"
            | "GM"
            | "GN"
            | "GP"
            | "GQ"
            | "GR"
            | "GS"
            | "GT"
            | "GU"
            | "GW"
            | "GY"
            | "HK"
            | "HM"
            | "HN"
            | "HR"
            | "HT"
            | "HU"
            | "ID"
            | "IE"
            | "IL"
            | "IM"
            | "IN"
            | "IO"
            | "IQ"
            | "IR"
            | "IS"
            | "IT"
            | "JE"
            | "JM"
            | "JO"
            | "JP"
            | "KE"
            | "KG"
            | "KH"
            | "KI"
            | "KM"
            | "KN"
            | "KP"
            | "KR"
            | "KW"
            | "KY"
            | "KZ"
            | "LA"
            | "LB"
            | "LC"
            | "LI"
            | "LK"
            | "LR"
            | "LS"
            | "LT"
            | "LU"
            | "LV"
            | "LY"
            | "MA"
            | "MC"
            | "MD"
            | "ME"
            | "MF"
            | "MG"
            | "MH"
            | "MK"
            | "ML"
            | "MM"
            | "MN"
            | "MO"
            | "MP"
            | "MQ"
            | "MR"
            | "MS"
            | "MT"
            | "MU"
            | "MV"
            | "MW"
            | "MX"
            | "MY"
            | "MZ"
            | "NA"
            | "NC"
            | "NE"
            | "NF"
            | "NG"
            | "NI"
            | "NL"
            | "NO"
            | "NP"
            | "NR"
            | "NU"
            | "NZ"
            | "OM"
            | "PA"
            | "PE"
            | "PF"
            | "PG"
            | "PH"
            | "PK"
            | "PL"
            | "PM"
            | "PN"
            | "PR"
            | "PS"
            | "PT"
            | "PW"
            | "PY"
            | "QA"
            | "RE"
            | "RO"
            | "RS"
            | "RU"
            | "RW"
            | "SA"
            | "SB"
            | "SC"
            | "SD"
            | "SE"
            | "SG"
            | "SH"
            | "SI"
            | "SJ"
            | "SK"
            | "SL"
            | "SM"
            | "SN"
            | "SO"
            | "SR"
            | "SS"
            | "ST"
            | "SV"
            | "SX"
            | "SY"
            | "SZ"
            | "TC"
            | "TD"
            | "TF"
            | "TG"
            | "TH"
            | "TJ"
            | "TK"
            | "TL"
            | "TM"
            | "TN"
            | "TO"
            | "TR"
            | "TT"
            | "TV"
            | "TW"
            | "TZ"
            | "UA"
            | "UG"
            | "UM"
            | "US"
            | "UY"
            | "UZ"
            | "VA"
            | "VC"
            | "VE"
            | "VG"
            | "VI"
            | "VN"
            | "VU"
            | "WF"
            | "WS"
            | "YE"
            | "YT"
            | "ZA"
            | "ZM"
            | "ZW";
    }

    interface DefinedInputFields {
        OrdersOrderBy: "date" | "updatedAt";
        PackageEventsOrderBy: "time";
        OrdersInput: "first" | "cursor" | "orderBy";
    }

    export type OrderDirection = DefinedEnumValues["OrderDirection"];
    export type OrdersOrderBy = Pick<
        Types.OrdersOrderBy,
        DefinedInputFields["OrdersOrderBy"]
    >;
    export type PackageEventsOrderBy = Pick<
        Types.PackageEventsOrderBy,
        DefinedInputFields["PackageEventsOrderBy"]
    >;
    export type OrdersInput = Pick<
        Types.OrdersInput,
        DefinedInputFields["OrdersInput"]
    >;
    export type Query = Pick<Types.Query, DefinedFields["Query"]>;
    export type OrdersResponse = Pick<
        Types.OrdersResponse,
        DefinedFields["OrdersResponse"]
    >;
    export type Order = Pick<Types.Order, DefinedFields["Order"]>;
    export type PageInfo = Pick<Types.PageInfo, DefinedFields["PageInfo"]>;
    export type Language = DefinedEnumValues["Language"];
    export type Address = Pick<Types.Address, DefinedFields["Address"]>;
    export type DateTime = Types.DateTime;
    export type CountryCode = DefinedEnumValues["CountryCode"];
    export type Package = Pick<Types.Package, DefinedFields["Package"]>;
    export type Contact = Pick<Types.Contact, DefinedFields["Contact"]>;
    export type OrderLineItem = Pick<
        Types.OrderLineItem,
        DefinedFields["OrderLineItem"]
    >;
    export type SaleorOrder = Pick<
        Types.SaleorOrder,
        DefinedFields["SaleorOrder"]
    >;
    export type ZohoSalesOrder = Pick<
        Types.ZohoSalesOrder,
        DefinedFields["ZohoSalesOrder"]
    >;
    export type XentralProxyAuftrag = Pick<
        Types.XentralProxyAuftrag,
        DefinedFields["XentralProxyAuftrag"]
    >;
    export type Payment = Pick<Types.Payment, DefinedFields["Payment"]>;
    export type PackageState = DefinedEnumValues["PackageState"];
    export type Carrier = DefinedEnumValues["Carrier"];
    export type PackageEvent = Pick<
        Types.PackageEvent,
        DefinedFields["PackageEvent"]
    >;
    export type TransactionalEmail = Pick<
        Types.TransactionalEmail,
        DefinedFields["TransactionalEmail"]
    >;

    export type QueryResolvers = Pick<
        Types.QueryResolvers,
        DefinedFields["Query"]
    >;
    export type OrdersResponseResolvers = Pick<
        Types.OrdersResponseResolvers,
        DefinedFields["OrdersResponse"] | "__isTypeOf"
    >;
    export type PageInfoResolvers = Pick<
        Types.PageInfoResolvers,
        DefinedFields["PageInfo"] | "__isTypeOf"
    >;
    export type AddressResolvers = Pick<
        Types.AddressResolvers,
        DefinedFields["Address"] | "__isTypeOf"
    >;
    export type OrderResolvers = Pick<
        Types.OrderResolvers,
        DefinedFields["Order"] | "__isTypeOf"
    >;
    export type OrderLineItemResolvers = Pick<
        Types.OrderLineItemResolvers,
        DefinedFields["OrderLineItem"] | "__isTypeOf"
    >;
    export type ContactResolvers = Pick<
        Types.ContactResolvers,
        DefinedFields["Contact"] | "__isTypeOf"
    >;
    export type PaymentResolvers = Pick<
        Types.PaymentResolvers,
        DefinedFields["Payment"] | "__isTypeOf"
    >;
    export type ZohoSalesOrderResolvers = Pick<
        Types.ZohoSalesOrderResolvers,
        DefinedFields["ZohoSalesOrder"] | "__isTypeOf"
    >;
    export type XentralProxyAuftragResolvers = Pick<
        Types.XentralProxyAuftragResolvers,
        DefinedFields["XentralProxyAuftrag"] | "__isTypeOf"
    >;
    export type SaleorOrderResolvers = Pick<
        Types.SaleorOrderResolvers,
        DefinedFields["SaleorOrder"] | "__isTypeOf"
    >;
    export type PackageResolvers = Pick<
        Types.PackageResolvers,
        DefinedFields["Package"] | "__isTypeOf"
    >;
    export type PackageEventResolvers = Pick<
        Types.PackageEventResolvers,
        DefinedFields["PackageEvent"] | "__isTypeOf"
    >;
    export type TransactionalEmailResolvers = Pick<
        Types.TransactionalEmailResolvers,
        DefinedFields["TransactionalEmail"] | "__isTypeOf"
    >;

    export interface Resolvers {
        Query?: QueryResolvers;
        OrdersResponse?: OrdersResponseResolvers;
        PageInfo?: PageInfoResolvers;
        Address?: AddressResolvers;
        Order?: OrderResolvers;
        OrderLineItem?: OrderLineItemResolvers;
        Contact?: ContactResolvers;
        Payment?: PaymentResolvers;
        ZohoSalesOrder?: ZohoSalesOrderResolvers;
        XentralProxyAuftrag?: XentralProxyAuftragResolvers;
        SaleorOrder?: SaleorOrderResolvers;
        Package?: PackageResolvers;
        PackageEvent?: PackageEventResolvers;
        TransactionalEmail?: TransactionalEmailResolvers;
    }

    export interface MiddlewareMap {
        "*"?: {
            "*"?: gm.Middleware[];
        };
        Query?: {
            "*"?: gm.Middleware[];
            orders?: gm.Middleware[];
            order?: gm.Middleware[];
        };
        OrdersResponse?: {
            "*"?: gm.Middleware[];
            edges?: gm.Middleware[];
            pageInfo?: gm.Middleware[];
        };
        PageInfo?: {
            "*"?: gm.Middleware[];
            endCursor?: gm.Middleware[];
            hasNextPage?: gm.Middleware[];
        };
        Address?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            createdAt?: gm.Middleware[];
            updatedAt?: gm.Middleware[];
            street?: gm.Middleware[];
            additionalAddressLine?: gm.Middleware[];
            plz?: gm.Middleware[];
            city?: gm.Middleware[];
            countryCode?: gm.Middleware[];
            countryArea?: gm.Middleware[];
            company?: gm.Middleware[];
            phone?: gm.Middleware[];
            fullname?: gm.Middleware[];
            houseNumber?: gm.Middleware[];
            streetWithoutHouseNumber?: gm.Middleware[];
            normalizedName?: gm.Middleware[];
        };
        Order?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            language?: gm.Middleware[];
            createdAt?: gm.Middleware[];
            updatedAt?: gm.Middleware[];
            packages?: gm.Middleware[];
            date?: gm.Middleware[];
            orderNumber?: gm.Middleware[];
            discountCode?: gm.Middleware[];
            discountValueNet?: gm.Middleware[];
            totalPriceNet?: gm.Middleware[];
            totalPriceGross?: gm.Middleware[];
            firstName?: gm.Middleware[];
            lastName?: gm.Middleware[];
            mainContact?: gm.Middleware[];
            mainContactId?: gm.Middleware[];
            shippingAddress?: gm.Middleware[];
            billingAddress?: gm.Middleware[];
            orderLineItems?: gm.Middleware[];
            saleorOrders?: gm.Middleware[];
            zohoSalesOrders?: gm.Middleware[];
            xentralProxyAuftraege?: gm.Middleware[];
        };
        OrderLineItem?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            createdAt?: gm.Middleware[];
            updatedAt?: gm.Middleware[];
            order?: gm.Middleware[];
            orderId?: gm.Middleware[];
            quantity?: gm.Middleware[];
            sku?: gm.Middleware[];
            totalPriceNet?: gm.Middleware[];
            totalPriceGross?: gm.Middleware[];
            undiscountedUnitPriceNet?: gm.Middleware[];
            undiscountedUnitPriceGross?: gm.Middleware[];
            discountValueNet?: gm.Middleware[];
        };
        Contact?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            createdAt?: gm.Middleware[];
            updatedAt?: gm.Middleware[];
            email?: gm.Middleware[];
            firstName?: gm.Middleware[];
            lastName?: gm.Middleware[];
            totalOrders?: gm.Middleware[];
            orders?: gm.Middleware[];
            payments?: gm.Middleware[];
            trackingEmailsConsent?: gm.Middleware[];
            marketingEmailsConstent?: gm.Middleware[];
        };
        Payment?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            createdAt?: gm.Middleware[];
            updatedAt?: gm.Middleware[];
            referenceNumber?: gm.Middleware[];
            amount?: gm.Middleware[];
            transactionFee?: gm.Middleware[];
            order?: gm.Middleware[];
            orderId?: gm.Middleware[];
            mainContact?: gm.Middleware[];
            mainContactId?: gm.Middleware[];
        };
        ZohoSalesOrder?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            createdAt?: gm.Middleware[];
            updatedAt?: gm.Middleware[];
            order?: gm.Middleware[];
            orderId?: gm.Middleware[];
        };
        XentralProxyAuftrag?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            xentralBelegNr?: gm.Middleware[];
            order?: gm.Middleware[];
            orderId?: gm.Middleware[];
            status?: gm.Middleware[];
        };
        SaleorOrder?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            createdAt?: gm.Middleware[];
            order?: gm.Middleware[];
            orderId?: gm.Middleware[];
        };
        Package?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            carrier?: gm.Middleware[];
            state?: gm.Middleware[];
            trackingId?: gm.Middleware[];
            carrierTrackingUrl?: gm.Middleware[];
            order?: gm.Middleware[];
            events?: gm.Middleware[];
        };
        PackageEvent?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            time?: gm.Middleware[];
            state?: gm.Middleware[];
            message?: gm.Middleware[];
            package?: gm.Middleware[];
            packageId?: gm.Middleware[];
            location?: gm.Middleware[];
            sentEmail?: gm.Middleware[];
        };
        TransactionalEmail?: {
            "*"?: gm.Middleware[];
            id?: gm.Middleware[];
            time?: gm.Middleware[];
            email?: gm.Middleware[];
            sentEmailId?: gm.Middleware[];
            packageEvent?: gm.Middleware[];
            packageEventId?: gm.Middleware[];
        };
    }
}
