import * as Types from "../../../generated/schema-types";
import * as gm from "graphql-modules";
export namespace TrackingModule {
  interface DefinedFields {
    Order: "id" | "externalOrderId" | "email" | "language" | "packages";
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
      | "location"
      | "sentEmail";
    TransactionalEmail: "id" | "time" | "email" | "packageEvent";
    Query: "orderById" | "packageByTrackingId";
  }

  interface DefinedEnumValues {
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
    Carrier: "DPD";
    Language: "DE" | "EN";
  }

  export type PackageState = DefinedEnumValues["PackageState"];
  export type Carrier = DefinedEnumValues["Carrier"];
  export type Language = DefinedEnumValues["Language"];
  export type Order = Pick<Types.Order, DefinedFields["Order"]>;
  export type Package = Pick<Types.Package, DefinedFields["Package"]>;
  export type PackageEvent = Pick<
    Types.PackageEvent,
    DefinedFields["PackageEvent"]
  >;
  export type TransactionalEmail = Pick<
    Types.TransactionalEmail,
    DefinedFields["TransactionalEmail"]
  >;
  export type Query = Pick<Types.Query, DefinedFields["Query"]>;

  export type OrderResolvers = Pick<
    Types.OrderResolvers,
    DefinedFields["Order"] | "__isTypeOf"
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
  export type QueryResolvers = Pick<
    Types.QueryResolvers,
    DefinedFields["Query"]
  >;

  export interface Resolvers {
    Order?: OrderResolvers;
    Package?: PackageResolvers;
    PackageEvent?: PackageEventResolvers;
    TransactionalEmail?: TransactionalEmailResolvers;
    Query?: QueryResolvers;
  }

  export interface MiddlewareMap {
    "*"?: {
      "*"?: gm.Middleware[];
    };
    Order?: {
      "*"?: gm.Middleware[];
      id?: gm.Middleware[];
      externalOrderId?: gm.Middleware[];
      email?: gm.Middleware[];
      language?: gm.Middleware[];
      packages?: gm.Middleware[];
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
      location?: gm.Middleware[];
      sentEmail?: gm.Middleware[];
    };
    TransactionalEmail?: {
      "*"?: gm.Middleware[];
      id?: gm.Middleware[];
      time?: gm.Middleware[];
      email?: gm.Middleware[];
      packageEvent?: gm.Middleware[];
    };
    Query?: {
      "*"?: gm.Middleware[];
      orderById?: gm.Middleware[];
      packageByTrackingId?: gm.Middleware[];
    };
  }
}
