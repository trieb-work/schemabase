import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import {
  OrderModel,
  PackageModel,
  PackageEventModel,
  TransactionalEmailModel,
} from "@eci/pkg/prisma";
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  token?: Maybe<Scalars["String"]>;
  user?: Maybe<User>;
};

export type Carrier =
  | "BULK"
  | "DHL"
  | "DPD"
  | "HERMES"
  | "PICKUP"
  | "UNKNOWN"
  | "UPS";

export type Contact = {
  __typename?: "Contact";
  createdAt?: Maybe<Scalars["DateTime"]>;
  email: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  marketingEmailsConstent?: Maybe<Scalars["Boolean"]>;
  orders?: Maybe<Array<Maybe<Order>>>;
  payments?: Maybe<Array<Maybe<Payment>>>;
  trackingEmailsConsent?: Maybe<Scalars["Boolean"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

export type Language = "DE" | "EN";

export type Membership = {
  __typename?: "Membership";
  createdAt: Scalars["DateTime"];
  role: User_Tenant_Role;
  updatedAt: Scalars["DateTime"];
};

export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["Boolean"]>;
  login?: Maybe<AuthPayload>;
  signup?: Maybe<AuthPayload>;
};

export type MutationLoginArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationSignupArgs = {
  email: Scalars["String"];
  name: Scalars["String"];
  password: Scalars["String"];
};

export type Order = {
  __typename?: "Order";
  createdAt?: Maybe<Scalars["DateTime"]>;
  date?: Maybe<Scalars["DateTime"]>;
  discountCode?: Maybe<Scalars["String"]>;
  discountValueNet?: Maybe<Scalars["Float"]>;
  firstName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  language: Language;
  lastName?: Maybe<Scalars["String"]>;
  mainContact?: Maybe<Contact>;
  mainContactId?: Maybe<Scalars["String"]>;
  orderLineItems?: Maybe<Array<Maybe<OrderLineItem>>>;
  orderNumber: Scalars["String"];
  packages: Array<Package>;
  saleorOrders?: Maybe<Array<Maybe<SaleorOrder>>>;
  totalPriceGross?: Maybe<Scalars["Float"]>;
  totalPriceNet?: Maybe<Scalars["Float"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
  xentralProxyAuftraege?: Maybe<Array<Maybe<XentralProxyAuftrag>>>;
  zohoSalesOrders?: Maybe<Array<Maybe<ZohoSalesOrder>>>;
};

export type OrderBy = {
  date?: InputMaybe<OrderDirection>;
  updatedAt?: InputMaybe<OrderDirection>;
};

export type OrderDirection = "asc" | "desc";

export type OrderLineItem = {
  __typename?: "OrderLineItem";
  createdAt: Scalars["DateTime"];
  discountValueNet?: Maybe<Scalars["Float"]>;
  id: Scalars["String"];
  order: Order;
  orderId: Scalars["String"];
  quantity?: Maybe<Scalars["Float"]>;
  sku?: Maybe<Scalars["String"]>;
  totalPriceGross?: Maybe<Scalars["Float"]>;
  totalPriceNet?: Maybe<Scalars["Float"]>;
  undiscountedUnitPriceGross?: Maybe<Scalars["Float"]>;
  undiscountedUnitPriceNet?: Maybe<Scalars["Float"]>;
  updatedAt: Scalars["DateTime"];
};

export type Package = {
  __typename?: "Package";
  carrier: Carrier;
  carrierTrackingUrl: Scalars["String"];
  events: Array<PackageEvent>;
  id: Scalars["ID"];
  order: Order;
  state: PackageState;
  trackingId: Scalars["ID"];
};

export type PackageEvent = {
  __typename?: "PackageEvent";
  id?: Maybe<Scalars["String"]>;
  location?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  package: Package;
  packageId?: Maybe<Scalars["String"]>;
  sentEmail?: Maybe<TransactionalEmail>;
  state?: Maybe<PackageState>;
  time?: Maybe<Scalars["DateTime"]>;
};

export type PackageState =
  | "AVAILABLE_FOR_PICKUP"
  | "DELIVERED"
  | "EXCEPTION"
  | "EXPIRED"
  | "FAILED_ATTEMPT"
  | "INFORMATION_RECEIVED"
  | "INIT"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "PENDING";

export type Payment = {
  __typename?: "Payment";
  amount?: Maybe<Scalars["Float"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  id?: Maybe<Scalars["String"]>;
  mainContact?: Maybe<Contact>;
  mainContactId?: Maybe<Scalars["String"]>;
  order?: Maybe<Order>;
  orderId?: Maybe<Scalars["String"]>;
  referenceNumber?: Maybe<Scalars["String"]>;
  transactionFee?: Maybe<Scalars["Float"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

export type Query = {
  __typename?: "Query";
  healthCheck: Scalars["Boolean"];
  order?: Maybe<Order>;
  orders?: Maybe<Array<Maybe<Order>>>;
  packageByTrackingId?: Maybe<Package>;
};

export type QueryOrderArgs = {
  id?: InputMaybe<Scalars["ID"]>;
  orderNumber?: InputMaybe<Scalars["String"]>;
};

export type QueryOrdersArgs = {
  limit?: Scalars["Int"];
  orderBy?: InputMaybe<OrderBy>;
};

export type QueryPackageByTrackingIdArgs = {
  trackingId: Scalars["ID"];
};

export type SaleorOrder = {
  __typename?: "SaleorOrder";
  createdAt?: Maybe<Scalars["DateTime"]>;
  id?: Maybe<Scalars["String"]>;
  order: Order;
  orderId?: Maybe<Scalars["String"]>;
};

export type Tenant = {
  __typename?: "Tenant";
  id: Scalars["ID"];
  role: User_Tenant_Role;
};

export type TransactionalEmail = {
  __typename?: "TransactionalEmail";
  email?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  packageEvent?: Maybe<PackageEvent>;
  packageEventId?: Maybe<Scalars["String"]>;
  sentEmailId?: Maybe<Scalars["String"]>;
  time?: Maybe<Scalars["DateTime"]>;
};

export type User = {
  __typename?: "User";
  email: Scalars["String"];
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  tenants?: Maybe<Array<Tenant>>;
};

export type User_Tenant_Role = "MEMBER" | "OWNER";

export type XentralProxyAuftrag = {
  __typename?: "XentralProxyAuftrag";
  id: Scalars["Int"];
  order: Order;
  orderId?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  xentralBelegNr: Scalars["String"];
};

export type ZohoSalesOrder = {
  __typename?: "ZohoSalesOrder";
  createdAt?: Maybe<Scalars["DateTime"]>;
  id?: Maybe<Scalars["String"]>;
  order: Order;
  orderId?: Maybe<Scalars["String"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Carrier: Carrier;
  Contact: ResolverTypeWrapper<
    Omit<Contact, "orders" | "payments"> & {
      orders?: Maybe<Array<Maybe<ResolversTypes["Order"]>>>;
      payments?: Maybe<Array<Maybe<ResolversTypes["Payment"]>>>;
    }
  >;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Language: Language;
  Membership: ResolverTypeWrapper<Membership>;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<OrderModel>;
  OrderBy: OrderBy;
  OrderDirection: OrderDirection;
  OrderLineItem: ResolverTypeWrapper<
    Omit<OrderLineItem, "order"> & { order: ResolversTypes["Order"] }
  >;
  Package: ResolverTypeWrapper<PackageModel>;
  PackageEvent: ResolverTypeWrapper<PackageEventModel>;
  PackageState: PackageState;
  Payment: ResolverTypeWrapper<
    Omit<Payment, "mainContact" | "order"> & {
      mainContact?: Maybe<ResolversTypes["Contact"]>;
      order?: Maybe<ResolversTypes["Order"]>;
    }
  >;
  Query: ResolverTypeWrapper<{}>;
  SaleorOrder: ResolverTypeWrapper<
    Omit<SaleorOrder, "order"> & { order: ResolversTypes["Order"] }
  >;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Tenant: ResolverTypeWrapper<Tenant>;
  TransactionalEmail: ResolverTypeWrapper<TransactionalEmailModel>;
  User: ResolverTypeWrapper<User>;
  User_Tenant_Role: User_Tenant_Role;
  XentralProxyAuftrag: ResolverTypeWrapper<
    Omit<XentralProxyAuftrag, "order"> & { order: ResolversTypes["Order"] }
  >;
  ZohoSalesOrder: ResolverTypeWrapper<
    Omit<ZohoSalesOrder, "order"> & { order: ResolversTypes["Order"] }
  >;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthPayload: AuthPayload;
  Boolean: Scalars["Boolean"];
  Contact: Omit<Contact, "orders" | "payments"> & {
    orders?: Maybe<Array<Maybe<ResolversParentTypes["Order"]>>>;
    payments?: Maybe<Array<Maybe<ResolversParentTypes["Payment"]>>>;
  };
  DateTime: Scalars["DateTime"];
  Float: Scalars["Float"];
  ID: Scalars["ID"];
  Int: Scalars["Int"];
  Membership: Membership;
  Mutation: {};
  Order: OrderModel;
  OrderBy: OrderBy;
  OrderLineItem: Omit<OrderLineItem, "order"> & {
    order: ResolversParentTypes["Order"];
  };
  Package: PackageModel;
  PackageEvent: PackageEventModel;
  Payment: Omit<Payment, "mainContact" | "order"> & {
    mainContact?: Maybe<ResolversParentTypes["Contact"]>;
    order?: Maybe<ResolversParentTypes["Order"]>;
  };
  Query: {};
  SaleorOrder: Omit<SaleorOrder, "order"> & {
    order: ResolversParentTypes["Order"];
  };
  String: Scalars["String"];
  Tenant: Tenant;
  TransactionalEmail: TransactionalEmailModel;
  User: User;
  XentralProxyAuftrag: Omit<XentralProxyAuftrag, "order"> & {
    order: ResolversParentTypes["Order"];
  };
  ZohoSalesOrder: Omit<ZohoSalesOrder, "order"> & {
    order: ResolversParentTypes["Order"];
  };
}>;

export type AuthPayloadResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["AuthPayload"] = ResolversParentTypes["AuthPayload"],
> = ResolversObject<{
  token?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContactResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Contact"] = ResolversParentTypes["Contact"],
> = ResolversObject<{
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  firstName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  marketingEmailsConstent?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  orders?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Order"]>>>,
    ParentType,
    ContextType
  >;
  payments?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Payment"]>>>,
    ParentType,
    ContextType
  >;
  trackingEmailsConsent?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export type MembershipResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Membership"] = ResolversParentTypes["Membership"],
> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  role?: Resolver<ResolversTypes["User_Tenant_Role"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  login?: Resolver<
    Maybe<ResolversTypes["AuthPayload"]>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "email" | "password">
  >;
  signup?: Resolver<
    Maybe<ResolversTypes["AuthPayload"]>,
    ParentType,
    ContextType,
    RequireFields<MutationSignupArgs, "email" | "name" | "password">
  >;
}>;

export type OrderResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Order"] = ResolversParentTypes["Order"],
> = ResolversObject<{
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  date?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  discountCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  discountValueNet?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  firstName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  language?: Resolver<ResolversTypes["Language"], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  mainContact?: Resolver<
    Maybe<ResolversTypes["Contact"]>,
    ParentType,
    ContextType
  >;
  mainContactId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  orderLineItems?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["OrderLineItem"]>>>,
    ParentType,
    ContextType
  >;
  orderNumber?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  packages?: Resolver<
    Array<ResolversTypes["Package"]>,
    ParentType,
    ContextType
  >;
  saleorOrders?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["SaleorOrder"]>>>,
    ParentType,
    ContextType
  >;
  totalPriceGross?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  totalPriceNet?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  xentralProxyAuftraege?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["XentralProxyAuftrag"]>>>,
    ParentType,
    ContextType
  >;
  zohoSalesOrders?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ZohoSalesOrder"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrderLineItemResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["OrderLineItem"] = ResolversParentTypes["OrderLineItem"],
> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  discountValueNet?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  order?: Resolver<ResolversTypes["Order"], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  sku?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  totalPriceGross?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  totalPriceNet?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  undiscountedUnitPriceGross?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  undiscountedUnitPriceNet?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PackageResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Package"] = ResolversParentTypes["Package"],
> = ResolversObject<{
  carrier?: Resolver<ResolversTypes["Carrier"], ParentType, ContextType>;
  carrierTrackingUrl?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  events?: Resolver<
    Array<ResolversTypes["PackageEvent"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  order?: Resolver<ResolversTypes["Order"], ParentType, ContextType>;
  state?: Resolver<ResolversTypes["PackageState"], ParentType, ContextType>;
  trackingId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PackageEventResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["PackageEvent"] = ResolversParentTypes["PackageEvent"],
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  package?: Resolver<ResolversTypes["Package"], ParentType, ContextType>;
  packageId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  sentEmail?: Resolver<
    Maybe<ResolversTypes["TransactionalEmail"]>,
    ParentType,
    ContextType
  >;
  state?: Resolver<
    Maybe<ResolversTypes["PackageState"]>,
    ParentType,
    ContextType
  >;
  time?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaymentResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Payment"] = ResolversParentTypes["Payment"],
> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  mainContact?: Resolver<
    Maybe<ResolversTypes["Contact"]>,
    ParentType,
    ContextType
  >;
  mainContactId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  order?: Resolver<Maybe<ResolversTypes["Order"]>, ParentType, ContextType>;
  orderId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  referenceNumber?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  transactionFee?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  healthCheck?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  order?: Resolver<
    Maybe<ResolversTypes["Order"]>,
    ParentType,
    ContextType,
    Partial<QueryOrderArgs>
  >;
  orders?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Order"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryOrdersArgs, "limit">
  >;
  packageByTrackingId?: Resolver<
    Maybe<ResolversTypes["Package"]>,
    ParentType,
    ContextType,
    RequireFields<QueryPackageByTrackingIdArgs, "trackingId">
  >;
}>;

export type SaleorOrderResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["SaleorOrder"] = ResolversParentTypes["SaleorOrder"],
> = ResolversObject<{
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes["Order"], ParentType, ContextType>;
  orderId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TenantResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Tenant"] = ResolversParentTypes["Tenant"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  role?: Resolver<ResolversTypes["User_Tenant_Role"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransactionalEmailResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["TransactionalEmail"] = ResolversParentTypes["TransactionalEmail"],
> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  packageEvent?: Resolver<
    Maybe<ResolversTypes["PackageEvent"]>,
    ParentType,
    ContextType
  >;
  packageEventId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  sentEmailId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  time?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = ResolversObject<{
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  tenants?: Resolver<
    Maybe<Array<ResolversTypes["Tenant"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type XentralProxyAuftragResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["XentralProxyAuftrag"] = ResolversParentTypes["XentralProxyAuftrag"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  order?: Resolver<ResolversTypes["Order"], ParentType, ContextType>;
  orderId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  xentralBelegNr?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ZohoSalesOrderResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["ZohoSalesOrder"] = ResolversParentTypes["ZohoSalesOrder"],
> = ResolversObject<{
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes["Order"], ParentType, ContextType>;
  orderId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLModules.Context> = ResolversObject<{
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Membership?: MembershipResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderLineItem?: OrderLineItemResolvers<ContextType>;
  Package?: PackageResolvers<ContextType>;
  PackageEvent?: PackageEventResolvers<ContextType>;
  Payment?: PaymentResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SaleorOrder?: SaleorOrderResolvers<ContextType>;
  Tenant?: TenantResolvers<ContextType>;
  TransactionalEmail?: TransactionalEmailResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  XentralProxyAuftrag?: XentralProxyAuftragResolvers<ContextType>;
  ZohoSalesOrder?: ZohoSalesOrderResolvers<ContextType>;
}>;

export type DateTime = Scalars["DateTime"];
