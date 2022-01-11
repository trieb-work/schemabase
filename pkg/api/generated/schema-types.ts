import { GraphQLResolveInfo } from "graphql";
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
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Carrier = "DPD";

export type Language = "DE" | "EN";

export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["Boolean"]>;
};

export type Order = {
  __typename?: "Order";
  email: Scalars["String"];
  externalOrderId: Scalars["ID"];
  id: Scalars["ID"];
  language: Language;
  packages: Array<Package>;
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
  id: Scalars["ID"];
  location: Scalars["String"];
  message: Scalars["String"];
  package: Package;
  sentEmail: TransactionalEmail;
  state: PackageState;
  time: Scalars["Int"];
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

export type Query = {
  __typename?: "Query";
  healthCheck: Scalars["Boolean"];
  orderById?: Maybe<Order>;
  packageByTrackingId?: Maybe<Package>;
};

export type QueryOrderByIdArgs = {
  orderId: Scalars["ID"];
};

export type QueryPackageByTrackingIdArgs = {
  trackingId: Scalars["ID"];
};

export type TransactionalEmail = {
  __typename?: "TransactionalEmail";
  email: Scalars["String"];
  id: Scalars["ID"];
  packageEvent: PackageEvent;
  time: Scalars["Int"];
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
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Carrier: Carrier;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Language: Language;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<OrderModel>;
  Package: ResolverTypeWrapper<PackageModel>;
  PackageEvent: ResolverTypeWrapper<PackageEventModel>;
  PackageState: PackageState;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  TransactionalEmail: ResolverTypeWrapper<TransactionalEmailModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars["Boolean"];
  ID: Scalars["ID"];
  Int: Scalars["Int"];
  Mutation: {};
  Order: OrderModel;
  Package: PackageModel;
  PackageEvent: PackageEventModel;
  Query: {};
  String: Scalars["String"];
  TransactionalEmail: TransactionalEmailModel;
}>;

export type MutationResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
}>;

export type OrderResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Order"] = ResolversParentTypes["Order"],
> = ResolversObject<{
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  externalOrderId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  language?: Resolver<ResolversTypes["Language"], ParentType, ContextType>;
  packages?: Resolver<
    Array<ResolversTypes["Package"]>,
    ParentType,
    ContextType
  >;
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
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  location?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  package?: Resolver<ResolversTypes["Package"], ParentType, ContextType>;
  sentEmail?: Resolver<
    ResolversTypes["TransactionalEmail"],
    ParentType,
    ContextType
  >;
  state?: Resolver<ResolversTypes["PackageState"], ParentType, ContextType>;
  time?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  healthCheck?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  orderById?: Resolver<
    Maybe<ResolversTypes["Order"]>,
    ParentType,
    ContextType,
    RequireFields<QueryOrderByIdArgs, "orderId">
  >;
  packageByTrackingId?: Resolver<
    Maybe<ResolversTypes["Package"]>,
    ParentType,
    ContextType,
    RequireFields<QueryPackageByTrackingIdArgs, "trackingId">
  >;
}>;

export type TransactionalEmailResolvers<
  ContextType = GraphQLModules.Context,
  ParentType extends ResolversParentTypes["TransactionalEmail"] = ResolversParentTypes["TransactionalEmail"],
> = ResolversObject<{
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  packageEvent?: Resolver<
    ResolversTypes["PackageEvent"],
    ParentType,
    ContextType
  >;
  time?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLModules.Context> = ResolversObject<{
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  Package?: PackageResolvers<ContextType>;
  PackageEvent?: PackageEventResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  TransactionalEmail?: TransactionalEmailResolvers<ContextType>;
}>;
