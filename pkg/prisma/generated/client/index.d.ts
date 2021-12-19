/**
 * Client
 **/

import * as runtime from "./runtime/index";
declare const prisma: unique symbol;
export type PrismaPromise<A> = Promise<A> & { [prisma]: true };
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P;
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}`
    ? Tuple[K] extends PrismaPromise<infer X>
      ? X
      : UnwrapPromise<Tuple[K]>
    : UnwrapPromise<Tuple[K]>;
};

/**
 * Model ProductDataFeedApp
 *
 */
export type ProductDataFeedApp = {
  id: string;
  productDetailStorefrontURL: string;
  saleorAppId: string;
  tenantId: string;
};

/**
 * Model LogisticsApp
 *
 */
export type LogisticsApp = {
  id: string;
  currentOrdersCustomViewId: string;
  nextFiveDaysOrdersCustomViewId: string;
  currentBulkOrdersCustomViewId: string;
  nextFiveDaysBulkOrdersCustomViewId: string;
  tenantId: string;
};

/**
 * Model ZohoApp
 *
 */
export type ZohoApp = {
  id: string;
  orgId: string;
  clientId: string;
  clientSecret: string;
  tenantId: string;
};

/**
 * Model SaleorApp
 *
 */
export type SaleorApp = {
  id: string;
  domain: string;
  name: string;
  channelSlug: string | null;
  tenantId: string;
};

/**
 * Model InstalledSaleorApp
 *
 */
export type InstalledSaleorApp = {
  id: string;
  token: string;
  saleorAppId: string;
};

/**
 * Model Tenant
 *
 */
export type Tenant = {
  id: string;
  name: string;
};

/**
 * Model Subscription
 *
 */
export type Subscription = {
  id: string;
  tenantId: string;
  payedUntil: Date | null;
};

/**
 * Model ProductDataFeedIntegration
 *
 */
export type ProductDataFeedIntegration = {
  id: string;
  enabled: boolean;
  subscriptionId: string | null;
  tenantId: string;
  productDataFeedAppId: string;
  saleorAppId: string;
};

/**
 * Model LogisticsIntegration
 *
 */
export type LogisticsIntegration = {
  id: string;
  enabled: boolean;
  subscriptionId: string | null;
  tenantId: string;
  zohoAppId: string;
  logisticsAppId: string;
};

/**
 * Model StrapiToZohoIntegration
 *
 */
export type StrapiToZohoIntegration = {
  id: string;
  payedUntil: Date | null;
  enabled: boolean;
  strapiContentType: string;
  subscriptionId: string | null;
  tenantId: string;
  strapiAppId: string;
  zohoAppId: string;
};

/**
 * Model StrapiApp
 *
 */
export type StrapiApp = {
  id: string;
  name: string;
  tenantId: string;
};

/**
 * Model IncomingSaleorWebhook
 *
 */
export type IncomingSaleorWebhook = {
  id: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  secretId: string;
  installedSaleorAppId: string;
};

/**
 * Model IncomingStrapiWebhook
 *
 */
export type IncomingStrapiWebhook = {
  id: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  secretId: string;
  strapiAppId: string;
};

/**
 * Model IncomingProductDataFeedWebhook
 *
 */
export type IncomingProductDataFeedWebhook = {
  id: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  productDataFeedAppId: string;
};

/**
 * Model IncomingLogisticsWebhook
 *
 */
export type IncomingLogisticsWebhook = {
  id: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  logisticsAppId: string;
};

/**
 * Model SecretKey
 *
 */
export type SecretKey = {
  id: string;
  name: string | null;
  secret: string;
  createdAt: Date;
};

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ProductDataFeedApps
 * const productDataFeedApps = await prisma.productDataFeedApp.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = "log" extends keyof T
    ? T["log"] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<T["log"]>
      : never
    : never,
  GlobalReject = "rejectOnNotFound" extends keyof T
    ? T["rejectOnNotFound"]
    : false,
> {
  /**
   * @private
   */
  private fetcher;
  /**
   * @private
   */
  private readonly dmmf;
  /**
   * @private
   */
  private connectionPromise?;
  /**
   * @private
   */
  private disconnectionPromise?;
  /**
   * @private
   */
  private readonly engineConfig;
  /**
   * @private
   */
  private readonly measurePerformance;

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ProductDataFeedApps
   * const productDataFeedApps = await prisma.productDataFeedApp.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U | "beforeExit">(
    eventType: V,
    callback: (
      event: V extends "query"
        ? Prisma.QueryEvent
        : V extends "beforeExit"
        ? () => Promise<void>
        : Prisma.LogEvent,
    ) => void,
  ): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(
    arg: [...P],
  ): Promise<UnwrapTuple<P>>;

  /**
   * `prisma.productDataFeedApp`: Exposes CRUD operations for the **ProductDataFeedApp** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProductDataFeedApps
   * const productDataFeedApps = await prisma.productDataFeedApp.findMany()
   * ```
   */
  get productDataFeedApp(): Prisma.ProductDataFeedAppDelegate<GlobalReject>;

  /**
   * `prisma.logisticsApp`: Exposes CRUD operations for the **LogisticsApp** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more LogisticsApps
   * const logisticsApps = await prisma.logisticsApp.findMany()
   * ```
   */
  get logisticsApp(): Prisma.LogisticsAppDelegate<GlobalReject>;

  /**
   * `prisma.zohoApp`: Exposes CRUD operations for the **ZohoApp** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ZohoApps
   * const zohoApps = await prisma.zohoApp.findMany()
   * ```
   */
  get zohoApp(): Prisma.ZohoAppDelegate<GlobalReject>;

  /**
   * `prisma.saleorApp`: Exposes CRUD operations for the **SaleorApp** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more SaleorApps
   * const saleorApps = await prisma.saleorApp.findMany()
   * ```
   */
  get saleorApp(): Prisma.SaleorAppDelegate<GlobalReject>;

  /**
   * `prisma.installedSaleorApp`: Exposes CRUD operations for the **InstalledSaleorApp** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more InstalledSaleorApps
   * const installedSaleorApps = await prisma.installedSaleorApp.findMany()
   * ```
   */
  get installedSaleorApp(): Prisma.InstalledSaleorAppDelegate<GlobalReject>;

  /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   */
  get tenant(): Prisma.TenantDelegate<GlobalReject>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Subscriptions
   * const subscriptions = await prisma.subscription.findMany()
   * ```
   */
  get subscription(): Prisma.SubscriptionDelegate<GlobalReject>;

  /**
   * `prisma.productDataFeedIntegration`: Exposes CRUD operations for the **ProductDataFeedIntegration** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProductDataFeedIntegrations
   * const productDataFeedIntegrations = await prisma.productDataFeedIntegration.findMany()
   * ```
   */
  get productDataFeedIntegration(): Prisma.ProductDataFeedIntegrationDelegate<GlobalReject>;

  /**
   * `prisma.logisticsIntegration`: Exposes CRUD operations for the **LogisticsIntegration** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more LogisticsIntegrations
   * const logisticsIntegrations = await prisma.logisticsIntegration.findMany()
   * ```
   */
  get logisticsIntegration(): Prisma.LogisticsIntegrationDelegate<GlobalReject>;

  /**
   * `prisma.strapiToZohoIntegration`: Exposes CRUD operations for the **StrapiToZohoIntegration** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more StrapiToZohoIntegrations
   * const strapiToZohoIntegrations = await prisma.strapiToZohoIntegration.findMany()
   * ```
   */
  get strapiToZohoIntegration(): Prisma.StrapiToZohoIntegrationDelegate<GlobalReject>;

  /**
   * `prisma.strapiApp`: Exposes CRUD operations for the **StrapiApp** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more StrapiApps
   * const strapiApps = await prisma.strapiApp.findMany()
   * ```
   */
  get strapiApp(): Prisma.StrapiAppDelegate<GlobalReject>;

  /**
   * `prisma.incomingSaleorWebhook`: Exposes CRUD operations for the **IncomingSaleorWebhook** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more IncomingSaleorWebhooks
   * const incomingSaleorWebhooks = await prisma.incomingSaleorWebhook.findMany()
   * ```
   */
  get incomingSaleorWebhook(): Prisma.IncomingSaleorWebhookDelegate<GlobalReject>;

  /**
   * `prisma.incomingStrapiWebhook`: Exposes CRUD operations for the **IncomingStrapiWebhook** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more IncomingStrapiWebhooks
   * const incomingStrapiWebhooks = await prisma.incomingStrapiWebhook.findMany()
   * ```
   */
  get incomingStrapiWebhook(): Prisma.IncomingStrapiWebhookDelegate<GlobalReject>;

  /**
   * `prisma.incomingProductDataFeedWebhook`: Exposes CRUD operations for the **IncomingProductDataFeedWebhook** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more IncomingProductDataFeedWebhooks
   * const incomingProductDataFeedWebhooks = await prisma.incomingProductDataFeedWebhook.findMany()
   * ```
   */
  get incomingProductDataFeedWebhook(): Prisma.IncomingProductDataFeedWebhookDelegate<GlobalReject>;

  /**
   * `prisma.incomingLogisticsWebhook`: Exposes CRUD operations for the **IncomingLogisticsWebhook** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more IncomingLogisticsWebhooks
   * const incomingLogisticsWebhooks = await prisma.incomingLogisticsWebhook.findMany()
   * ```
   */
  get incomingLogisticsWebhook(): Prisma.IncomingLogisticsWebhookDelegate<GlobalReject>;

  /**
   * `prisma.secretKey`: Exposes CRUD operations for the **SecretKey** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more SecretKeys
   * const secretKeys = await prisma.secretKey.findMany()
   * ```
   */
  get secretKey(): Prisma.SecretKeyDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  /**
   * Prisma Client JS version: 3.6.0
   * Query Engine version: dc520b92b1ebb2d28dc3161f9f82e875bd35d727
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from.
   */
  export type JsonObject = { [Key in string]?: JsonValue };

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue =
    | string
    | number
    | boolean
    | JsonObject
    | JsonArray
    | null;

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {
    readonly [Key in string]?: InputJsonValue | null;
  };

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray
    extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue =
    | string
    | number
    | boolean
    | InputJsonObject
    | InputJsonArray;

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: "DbNull";

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: "JsonNull";

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: "AnyNull";

  type SelectAndInclude = {
    select: any;
    include: any;
  };
  type HasSelect = {
    select: any;
  };
  type HasInclude = {
    include: any;
  };
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? "Please either choose `select` or `include`"
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S;

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<
    infer U
  >
    ? U
    : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> =
    PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key;
  }[keyof T];

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? "Please either choose `select` or `include`."
    : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T | U extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
    ? False
    : T extends Date
    ? False
    : T extends Buffer
    ? False
    : T extends BigInt
    ? False
    : T extends object
    ? True
    : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Exact<A, W = unknown> = W extends unknown
    ? A extends Narrowable
      ? Cast<A, W>
      : Cast<
          { [K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never },
          { [K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K] }
        >
    : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, "_avg" | "_sum" | "_count" | "_min" | "_max">,
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<"OR", K>, Extends<"AND", K>>,
      Extends<"NOT", K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<
    T,
    TupleToUnion<K>
  >;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(
      prisma: PrismaClient<any, any>,
      debug?: boolean,
      hooks?: Hooks | undefined,
    );
    request<T>(
      document: any,
      dataPath?: string[],
      rootField?: string,
      typeName?: string,
      isList?: boolean,
      callsite?: string,
    ): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(
      document: any,
      data: any,
      path: string[],
      rootField?: string,
      isList?: boolean,
    ): any;
  }

  export const ModelName: {
    ProductDataFeedApp: "ProductDataFeedApp";
    LogisticsApp: "LogisticsApp";
    ZohoApp: "ZohoApp";
    SaleorApp: "SaleorApp";
    InstalledSaleorApp: "InstalledSaleorApp";
    Tenant: "Tenant";
    Subscription: "Subscription";
    ProductDataFeedIntegration: "ProductDataFeedIntegration";
    LogisticsIntegration: "LogisticsIntegration";
    StrapiToZohoIntegration: "StrapiToZohoIntegration";
    StrapiApp: "StrapiApp";
    IncomingSaleorWebhook: "IncomingSaleorWebhook";
    IncomingStrapiWebhook: "IncomingStrapiWebhook";
    IncomingProductDataFeedWebhook: "IncomingProductDataFeedWebhook";
    IncomingLogisticsWebhook: "IncomingLogisticsWebhook";
    SecretKey: "SecretKey";
  };

  export type ModelName = typeof ModelName[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  export type RejectOnNotFound = boolean | ((error: Error) => Error);
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound };
  export type RejectPerOperation = {
    [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound;
  };
  type IsReject<T> = T extends true
    ? True
    : T extends (err: Error) => Error
    ? True
    : False;
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions["rejectOnNotFound"],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName,
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends boolean
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>;
  export type ErrorFormat = "pretty" | "colorless" | "minimal";

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null.
     *  * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation;
    /**
     * Overwrites the datasource url from your prisma.schema file
     */
    datasources?: Datasources;

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>;
  }

  export type Hooks = {
    beforeRequest?: (options: {
      query: string;
      path: string[];
      rootField?: string;
      typeName?: string;
      document: any;
    }) => any;
  };

  /* Types for Logging */
  export type LogLevel = "info" | "query" | "warn" | "error";
  export type LogDefinition = {
    level: LogLevel;
    emit: "stdout" | "event";
  };

  export type GetLogType<T extends LogLevel | LogDefinition> =
    T extends LogDefinition
      ? T["emit"] extends "event"
        ? T["level"]
        : never
      : never;
  export type GetEvents<T extends any> = T extends Array<
    LogLevel | LogDefinition
  >
    ? GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | "findUnique"
    | "findMany"
    | "findFirst"
    | "create"
    | "createMany"
    | "update"
    | "updateMany"
    | "upsert"
    | "delete"
    | "deleteMany"
    | "executeRaw"
    | "queryRaw"
    | "aggregate"
    | "count";

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>,
  ): LogLevel | undefined;
  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type ProductDataFeedAppCountOutputType
   */

  export type ProductDataFeedAppCountOutputType = {
    webhooks: number;
  };

  export type ProductDataFeedAppCountOutputTypeSelect = {
    webhooks?: boolean;
  };

  export type ProductDataFeedAppCountOutputTypeGetPayload<
    S extends
      | boolean
      | null
      | undefined
      | ProductDataFeedAppCountOutputTypeArgs,
    U = keyof S,
  > = S extends true
    ? ProductDataFeedAppCountOutputType
    : S extends undefined
    ? never
    : S extends ProductDataFeedAppCountOutputTypeArgs
    ? "include" extends U
      ? ProductDataFeedAppCountOutputType
      : "select" extends U
      ? {
          [P in TrueKeys<
            S["select"]
          >]: P extends keyof ProductDataFeedAppCountOutputType
            ? ProductDataFeedAppCountOutputType[P]
            : never;
        }
      : ProductDataFeedAppCountOutputType
    : ProductDataFeedAppCountOutputType;

  // Custom InputTypes

  /**
   * ProductDataFeedAppCountOutputType without action
   */
  export type ProductDataFeedAppCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedAppCountOutputType
     *
     **/
    select?: ProductDataFeedAppCountOutputTypeSelect | null;
  };

  /**
   * Count Type LogisticsAppCountOutputType
   */

  export type LogisticsAppCountOutputType = {
    webhooks: number;
  };

  export type LogisticsAppCountOutputTypeSelect = {
    webhooks?: boolean;
  };

  export type LogisticsAppCountOutputTypeGetPayload<
    S extends boolean | null | undefined | LogisticsAppCountOutputTypeArgs,
    U = keyof S,
  > = S extends true
    ? LogisticsAppCountOutputType
    : S extends undefined
    ? never
    : S extends LogisticsAppCountOutputTypeArgs
    ? "include" extends U
      ? LogisticsAppCountOutputType
      : "select" extends U
      ? {
          [P in TrueKeys<
            S["select"]
          >]: P extends keyof LogisticsAppCountOutputType
            ? LogisticsAppCountOutputType[P]
            : never;
        }
      : LogisticsAppCountOutputType
    : LogisticsAppCountOutputType;

  // Custom InputTypes

  /**
   * LogisticsAppCountOutputType without action
   */
  export type LogisticsAppCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the LogisticsAppCountOutputType
     *
     **/
    select?: LogisticsAppCountOutputTypeSelect | null;
  };

  /**
   * Count Type ZohoAppCountOutputType
   */

  export type ZohoAppCountOutputType = {
    strapiToZohoIntegration: number;
    logisticsIntegration: number;
  };

  export type ZohoAppCountOutputTypeSelect = {
    strapiToZohoIntegration?: boolean;
    logisticsIntegration?: boolean;
  };

  export type ZohoAppCountOutputTypeGetPayload<
    S extends boolean | null | undefined | ZohoAppCountOutputTypeArgs,
    U = keyof S,
  > = S extends true
    ? ZohoAppCountOutputType
    : S extends undefined
    ? never
    : S extends ZohoAppCountOutputTypeArgs
    ? "include" extends U
      ? ZohoAppCountOutputType
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof ZohoAppCountOutputType
            ? ZohoAppCountOutputType[P]
            : never;
        }
      : ZohoAppCountOutputType
    : ZohoAppCountOutputType;

  // Custom InputTypes

  /**
   * ZohoAppCountOutputType without action
   */
  export type ZohoAppCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ZohoAppCountOutputType
     *
     **/
    select?: ZohoAppCountOutputTypeSelect | null;
  };

  /**
   * Count Type SaleorAppCountOutputType
   */

  export type SaleorAppCountOutputType = {
    productDataFeedIntegration: number;
    ProductDataFeedApp: number;
  };

  export type SaleorAppCountOutputTypeSelect = {
    productDataFeedIntegration?: boolean;
    ProductDataFeedApp?: boolean;
  };

  export type SaleorAppCountOutputTypeGetPayload<
    S extends boolean | null | undefined | SaleorAppCountOutputTypeArgs,
    U = keyof S,
  > = S extends true
    ? SaleorAppCountOutputType
    : S extends undefined
    ? never
    : S extends SaleorAppCountOutputTypeArgs
    ? "include" extends U
      ? SaleorAppCountOutputType
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof SaleorAppCountOutputType
            ? SaleorAppCountOutputType[P]
            : never;
        }
      : SaleorAppCountOutputType
    : SaleorAppCountOutputType;

  // Custom InputTypes

  /**
   * SaleorAppCountOutputType without action
   */
  export type SaleorAppCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the SaleorAppCountOutputType
     *
     **/
    select?: SaleorAppCountOutputTypeSelect | null;
  };

  /**
   * Count Type InstalledSaleorAppCountOutputType
   */

  export type InstalledSaleorAppCountOutputType = {
    webhooks: number;
  };

  export type InstalledSaleorAppCountOutputTypeSelect = {
    webhooks?: boolean;
  };

  export type InstalledSaleorAppCountOutputTypeGetPayload<
    S extends
      | boolean
      | null
      | undefined
      | InstalledSaleorAppCountOutputTypeArgs,
    U = keyof S,
  > = S extends true
    ? InstalledSaleorAppCountOutputType
    : S extends undefined
    ? never
    : S extends InstalledSaleorAppCountOutputTypeArgs
    ? "include" extends U
      ? InstalledSaleorAppCountOutputType
      : "select" extends U
      ? {
          [P in TrueKeys<
            S["select"]
          >]: P extends keyof InstalledSaleorAppCountOutputType
            ? InstalledSaleorAppCountOutputType[P]
            : never;
        }
      : InstalledSaleorAppCountOutputType
    : InstalledSaleorAppCountOutputType;

  // Custom InputTypes

  /**
   * InstalledSaleorAppCountOutputType without action
   */
  export type InstalledSaleorAppCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the InstalledSaleorAppCountOutputType
     *
     **/
    select?: InstalledSaleorAppCountOutputTypeSelect | null;
  };

  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    Subscriptions: number;
    saleorApps: number;
    zohoApps: number;
    productdatafeedApps: number;
    strapiApps: number;
    productDataFeedIntegration: number;
    strapiToZohoIntegration: number;
    logisticsIntegration: number;
    logisticsApp: number;
  };

  export type TenantCountOutputTypeSelect = {
    Subscriptions?: boolean;
    saleorApps?: boolean;
    zohoApps?: boolean;
    productdatafeedApps?: boolean;
    strapiApps?: boolean;
    productDataFeedIntegration?: boolean;
    strapiToZohoIntegration?: boolean;
    logisticsIntegration?: boolean;
    logisticsApp?: boolean;
  };

  export type TenantCountOutputTypeGetPayload<
    S extends boolean | null | undefined | TenantCountOutputTypeArgs,
    U = keyof S,
  > = S extends true
    ? TenantCountOutputType
    : S extends undefined
    ? never
    : S extends TenantCountOutputTypeArgs
    ? "include" extends U
      ? TenantCountOutputType
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof TenantCountOutputType
            ? TenantCountOutputType[P]
            : never;
        }
      : TenantCountOutputType
    : TenantCountOutputType;

  // Custom InputTypes

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     *
     **/
    select?: TenantCountOutputTypeSelect | null;
  };

  /**
   * Count Type StrapiAppCountOutputType
   */

  export type StrapiAppCountOutputType = {
    webhooks: number;
  };

  export type StrapiAppCountOutputTypeSelect = {
    webhooks?: boolean;
  };

  export type StrapiAppCountOutputTypeGetPayload<
    S extends boolean | null | undefined | StrapiAppCountOutputTypeArgs,
    U = keyof S,
  > = S extends true
    ? StrapiAppCountOutputType
    : S extends undefined
    ? never
    : S extends StrapiAppCountOutputTypeArgs
    ? "include" extends U
      ? StrapiAppCountOutputType
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof StrapiAppCountOutputType
            ? StrapiAppCountOutputType[P]
            : never;
        }
      : StrapiAppCountOutputType
    : StrapiAppCountOutputType;

  // Custom InputTypes

  /**
   * StrapiAppCountOutputType without action
   */
  export type StrapiAppCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the StrapiAppCountOutputType
     *
     **/
    select?: StrapiAppCountOutputTypeSelect | null;
  };

  /**
   * Models
   */

  /**
   * Model ProductDataFeedApp
   */

  export type AggregateProductDataFeedApp = {
    _count: ProductDataFeedAppCountAggregateOutputType | null;
    _min: ProductDataFeedAppMinAggregateOutputType | null;
    _max: ProductDataFeedAppMaxAggregateOutputType | null;
  };

  export type ProductDataFeedAppMinAggregateOutputType = {
    id: string | null;
    productDetailStorefrontURL: string | null;
    saleorAppId: string | null;
    tenantId: string | null;
  };

  export type ProductDataFeedAppMaxAggregateOutputType = {
    id: string | null;
    productDetailStorefrontURL: string | null;
    saleorAppId: string | null;
    tenantId: string | null;
  };

  export type ProductDataFeedAppCountAggregateOutputType = {
    id: number;
    productDetailStorefrontURL: number;
    saleorAppId: number;
    tenantId: number;
    _all: number;
  };

  export type ProductDataFeedAppMinAggregateInputType = {
    id?: true;
    productDetailStorefrontURL?: true;
    saleorAppId?: true;
    tenantId?: true;
  };

  export type ProductDataFeedAppMaxAggregateInputType = {
    id?: true;
    productDetailStorefrontURL?: true;
    saleorAppId?: true;
    tenantId?: true;
  };

  export type ProductDataFeedAppCountAggregateInputType = {
    id?: true;
    productDetailStorefrontURL?: true;
    saleorAppId?: true;
    tenantId?: true;
    _all?: true;
  };

  export type ProductDataFeedAppAggregateArgs = {
    /**
     * Filter which ProductDataFeedApp to aggregate.
     *
     **/
    where?: ProductDataFeedAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductDataFeedApps to fetch.
     *
     **/
    orderBy?: Enumerable<ProductDataFeedAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: ProductDataFeedAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductDataFeedApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductDataFeedApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProductDataFeedApps
     **/
    _count?: true | ProductDataFeedAppCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProductDataFeedAppMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProductDataFeedAppMaxAggregateInputType;
  };

  export type GetProductDataFeedAppAggregateType<
    T extends ProductDataFeedAppAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateProductDataFeedApp]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductDataFeedApp[P]>
      : GetScalarType<T[P], AggregateProductDataFeedApp[P]>;
  };

  export type ProductDataFeedAppGroupByArgs = {
    where?: ProductDataFeedAppWhereInput;
    orderBy?: Enumerable<ProductDataFeedAppOrderByWithAggregationInput>;
    by: Array<ProductDataFeedAppScalarFieldEnum>;
    having?: ProductDataFeedAppScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductDataFeedAppCountAggregateInputType | true;
    _min?: ProductDataFeedAppMinAggregateInputType;
    _max?: ProductDataFeedAppMaxAggregateInputType;
  };

  export type ProductDataFeedAppGroupByOutputType = {
    id: string;
    productDetailStorefrontURL: string;
    saleorAppId: string;
    tenantId: string;
    _count: ProductDataFeedAppCountAggregateOutputType | null;
    _min: ProductDataFeedAppMinAggregateOutputType | null;
    _max: ProductDataFeedAppMaxAggregateOutputType | null;
  };

  type GetProductDataFeedAppGroupByPayload<
    T extends ProductDataFeedAppGroupByArgs,
  > = Promise<
    Array<
      PickArray<ProductDataFeedAppGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof ProductDataFeedAppGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProductDataFeedAppGroupByOutputType[P]>
          : GetScalarType<T[P], ProductDataFeedAppGroupByOutputType[P]>;
      }
    >
  >;

  export type ProductDataFeedAppSelect = {
    id?: boolean;
    productDetailStorefrontURL?: boolean;
    saleorApp?: boolean | SaleorAppArgs;
    saleorAppId?: boolean;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    webhooks?: boolean | IncomingProductDataFeedWebhookFindManyArgs;
    integration?: boolean | ProductDataFeedIntegrationArgs;
    _count?: boolean | ProductDataFeedAppCountOutputTypeArgs;
  };

  export type ProductDataFeedAppInclude = {
    saleorApp?: boolean | SaleorAppArgs;
    tenant?: boolean | TenantArgs;
    webhooks?: boolean | IncomingProductDataFeedWebhookFindManyArgs;
    integration?: boolean | ProductDataFeedIntegrationArgs;
    _count?: boolean | ProductDataFeedAppCountOutputTypeArgs;
  };

  export type ProductDataFeedAppGetPayload<
    S extends boolean | null | undefined | ProductDataFeedAppArgs,
    U = keyof S,
  > = S extends true
    ? ProductDataFeedApp
    : S extends undefined
    ? never
    : S extends ProductDataFeedAppArgs | ProductDataFeedAppFindManyArgs
    ? "include" extends U
      ? ProductDataFeedApp & {
          [P in TrueKeys<S["include"]>]: P extends "saleorApp"
            ? SaleorAppGetPayload<S["include"][P]>
            : P extends "tenant"
            ? TenantGetPayload<S["include"][P]>
            : P extends "webhooks"
            ? Array<IncomingProductDataFeedWebhookGetPayload<S["include"][P]>>
            : P extends "integration"
            ? ProductDataFeedIntegrationGetPayload<S["include"][P]> | null
            : P extends "_count"
            ? ProductDataFeedAppCountOutputTypeGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof ProductDataFeedApp
            ? ProductDataFeedApp[P]
            : P extends "saleorApp"
            ? SaleorAppGetPayload<S["select"][P]>
            : P extends "tenant"
            ? TenantGetPayload<S["select"][P]>
            : P extends "webhooks"
            ? Array<IncomingProductDataFeedWebhookGetPayload<S["select"][P]>>
            : P extends "integration"
            ? ProductDataFeedIntegrationGetPayload<S["select"][P]> | null
            : P extends "_count"
            ? ProductDataFeedAppCountOutputTypeGetPayload<S["select"][P]>
            : never;
        }
      : ProductDataFeedApp
    : ProductDataFeedApp;

  type ProductDataFeedAppCountArgs = Merge<
    Omit<ProductDataFeedAppFindManyArgs, "select" | "include"> & {
      select?: ProductDataFeedAppCountAggregateInputType | true;
    }
  >;

  export interface ProductDataFeedAppDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one ProductDataFeedApp that matches the filter.
     * @param {ProductDataFeedAppFindUniqueArgs} args - Arguments to find a ProductDataFeedApp
     * @example
     * // Get one ProductDataFeedApp
     * const productDataFeedApp = await prisma.productDataFeedApp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends ProductDataFeedAppFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, ProductDataFeedAppFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "ProductDataFeedApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__ProductDataFeedAppClient<ProductDataFeedApp>,
          Prisma__ProductDataFeedAppClient<ProductDataFeedAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__ProductDataFeedAppClient<ProductDataFeedApp | null>,
          Prisma__ProductDataFeedAppClient<ProductDataFeedAppGetPayload<T> | null>
        >;

    /**
     * Find the first ProductDataFeedApp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedAppFindFirstArgs} args - Arguments to find a ProductDataFeedApp
     * @example
     * // Get one ProductDataFeedApp
     * const productDataFeedApp = await prisma.productDataFeedApp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends ProductDataFeedAppFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, ProductDataFeedAppFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "ProductDataFeedApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__ProductDataFeedAppClient<ProductDataFeedApp>,
          Prisma__ProductDataFeedAppClient<ProductDataFeedAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__ProductDataFeedAppClient<ProductDataFeedApp | null>,
          Prisma__ProductDataFeedAppClient<ProductDataFeedAppGetPayload<T> | null>
        >;

    /**
     * Find zero or more ProductDataFeedApps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedAppFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductDataFeedApps
     * const productDataFeedApps = await prisma.productDataFeedApp.findMany()
     *
     * // Get first 10 ProductDataFeedApps
     * const productDataFeedApps = await prisma.productDataFeedApp.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const productDataFeedAppWithIdOnly = await prisma.productDataFeedApp.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends ProductDataFeedAppFindManyArgs>(
      args?: SelectSubset<T, ProductDataFeedAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<ProductDataFeedApp>>,
      PrismaPromise<Array<ProductDataFeedAppGetPayload<T>>>
    >;

    /**
     * Create a ProductDataFeedApp.
     * @param {ProductDataFeedAppCreateArgs} args - Arguments to create a ProductDataFeedApp.
     * @example
     * // Create one ProductDataFeedApp
     * const ProductDataFeedApp = await prisma.productDataFeedApp.create({
     *   data: {
     *     // ... data to create a ProductDataFeedApp
     *   }
     * })
     *
     **/
    create<T extends ProductDataFeedAppCreateArgs>(
      args: SelectSubset<T, ProductDataFeedAppCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedAppClient<ProductDataFeedApp>,
      Prisma__ProductDataFeedAppClient<ProductDataFeedAppGetPayload<T>>
    >;

    /**
     * Create many ProductDataFeedApps.
     *     @param {ProductDataFeedAppCreateManyArgs} args - Arguments to create many ProductDataFeedApps.
     *     @example
     *     // Create many ProductDataFeedApps
     *     const productDataFeedApp = await prisma.productDataFeedApp.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends ProductDataFeedAppCreateManyArgs>(
      args?: SelectSubset<T, ProductDataFeedAppCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a ProductDataFeedApp.
     * @param {ProductDataFeedAppDeleteArgs} args - Arguments to delete one ProductDataFeedApp.
     * @example
     * // Delete one ProductDataFeedApp
     * const ProductDataFeedApp = await prisma.productDataFeedApp.delete({
     *   where: {
     *     // ... filter to delete one ProductDataFeedApp
     *   }
     * })
     *
     **/
    delete<T extends ProductDataFeedAppDeleteArgs>(
      args: SelectSubset<T, ProductDataFeedAppDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedAppClient<ProductDataFeedApp>,
      Prisma__ProductDataFeedAppClient<ProductDataFeedAppGetPayload<T>>
    >;

    /**
     * Update one ProductDataFeedApp.
     * @param {ProductDataFeedAppUpdateArgs} args - Arguments to update one ProductDataFeedApp.
     * @example
     * // Update one ProductDataFeedApp
     * const productDataFeedApp = await prisma.productDataFeedApp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends ProductDataFeedAppUpdateArgs>(
      args: SelectSubset<T, ProductDataFeedAppUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedAppClient<ProductDataFeedApp>,
      Prisma__ProductDataFeedAppClient<ProductDataFeedAppGetPayload<T>>
    >;

    /**
     * Delete zero or more ProductDataFeedApps.
     * @param {ProductDataFeedAppDeleteManyArgs} args - Arguments to filter ProductDataFeedApps to delete.
     * @example
     * // Delete a few ProductDataFeedApps
     * const { count } = await prisma.productDataFeedApp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends ProductDataFeedAppDeleteManyArgs>(
      args?: SelectSubset<T, ProductDataFeedAppDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ProductDataFeedApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedAppUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductDataFeedApps
     * const productDataFeedApp = await prisma.productDataFeedApp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends ProductDataFeedAppUpdateManyArgs>(
      args: SelectSubset<T, ProductDataFeedAppUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one ProductDataFeedApp.
     * @param {ProductDataFeedAppUpsertArgs} args - Arguments to update or create a ProductDataFeedApp.
     * @example
     * // Update or create a ProductDataFeedApp
     * const productDataFeedApp = await prisma.productDataFeedApp.upsert({
     *   create: {
     *     // ... data to create a ProductDataFeedApp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductDataFeedApp we want to update
     *   }
     * })
     **/
    upsert<T extends ProductDataFeedAppUpsertArgs>(
      args: SelectSubset<T, ProductDataFeedAppUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedAppClient<ProductDataFeedApp>,
      Prisma__ProductDataFeedAppClient<ProductDataFeedAppGetPayload<T>>
    >;

    /**
     * Count the number of ProductDataFeedApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedAppCountArgs} args - Arguments to filter ProductDataFeedApps to count.
     * @example
     * // Count the number of ProductDataFeedApps
     * const count = await prisma.productDataFeedApp.count({
     *   where: {
     *     // ... the filter for the ProductDataFeedApps we want to count
     *   }
     * })
     **/
    count<T extends ProductDataFeedAppCountArgs>(
      args?: Subset<T, ProductDataFeedAppCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              ProductDataFeedAppCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ProductDataFeedApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedAppAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProductDataFeedAppAggregateArgs>(
      args: Subset<T, ProductDataFeedAppAggregateArgs>,
    ): PrismaPromise<GetProductDataFeedAppAggregateType<T>>;

    /**
     * Group by ProductDataFeedApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedAppGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProductDataFeedAppGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductDataFeedAppGroupByArgs["orderBy"] }
        : { orderBy?: ProductDataFeedAppGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, ProductDataFeedAppGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetProductDataFeedAppGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductDataFeedApp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ProductDataFeedAppClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    saleorApp<T extends SaleorAppArgs = {}>(
      args?: Subset<T, SaleorAppArgs>,
    ): CheckSelect<
      T,
      Prisma__SaleorAppClient<SaleorApp | null>,
      Prisma__SaleorAppClient<SaleorAppGetPayload<T> | null>
    >;

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    webhooks<T extends IncomingProductDataFeedWebhookFindManyArgs = {}>(
      args?: Subset<T, IncomingProductDataFeedWebhookFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<IncomingProductDataFeedWebhook>>,
      PrismaPromise<Array<IncomingProductDataFeedWebhookGetPayload<T>>>
    >;

    integration<T extends ProductDataFeedIntegrationArgs = {}>(
      args?: Subset<T, ProductDataFeedIntegrationArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegration | null>,
      Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegrationGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * ProductDataFeedApp findUnique
   */
  export type ProductDataFeedAppFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedApp
     *
     **/
    select?: ProductDataFeedAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedAppInclude | null;
    /**
     * Throw an Error if a ProductDataFeedApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which ProductDataFeedApp to fetch.
     *
     **/
    where: ProductDataFeedAppWhereUniqueInput;
  };

  /**
   * ProductDataFeedApp findFirst
   */
  export type ProductDataFeedAppFindFirstArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedApp
     *
     **/
    select?: ProductDataFeedAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedAppInclude | null;
    /**
     * Throw an Error if a ProductDataFeedApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which ProductDataFeedApp to fetch.
     *
     **/
    where?: ProductDataFeedAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductDataFeedApps to fetch.
     *
     **/
    orderBy?: Enumerable<ProductDataFeedAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProductDataFeedApps.
     *
     **/
    cursor?: ProductDataFeedAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductDataFeedApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductDataFeedApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProductDataFeedApps.
     *
     **/
    distinct?: Enumerable<ProductDataFeedAppScalarFieldEnum>;
  };

  /**
   * ProductDataFeedApp findMany
   */
  export type ProductDataFeedAppFindManyArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedApp
     *
     **/
    select?: ProductDataFeedAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedAppInclude | null;
    /**
     * Filter, which ProductDataFeedApps to fetch.
     *
     **/
    where?: ProductDataFeedAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductDataFeedApps to fetch.
     *
     **/
    orderBy?: Enumerable<ProductDataFeedAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProductDataFeedApps.
     *
     **/
    cursor?: ProductDataFeedAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductDataFeedApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductDataFeedApps.
     *
     **/
    skip?: number;
    distinct?: Enumerable<ProductDataFeedAppScalarFieldEnum>;
  };

  /**
   * ProductDataFeedApp create
   */
  export type ProductDataFeedAppCreateArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedApp
     *
     **/
    select?: ProductDataFeedAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedAppInclude | null;
    /**
     * The data needed to create a ProductDataFeedApp.
     *
     **/
    data: XOR<
      ProductDataFeedAppCreateInput,
      ProductDataFeedAppUncheckedCreateInput
    >;
  };

  /**
   * ProductDataFeedApp createMany
   */
  export type ProductDataFeedAppCreateManyArgs = {
    data: Enumerable<ProductDataFeedAppCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * ProductDataFeedApp update
   */
  export type ProductDataFeedAppUpdateArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedApp
     *
     **/
    select?: ProductDataFeedAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedAppInclude | null;
    /**
     * The data needed to update a ProductDataFeedApp.
     *
     **/
    data: XOR<
      ProductDataFeedAppUpdateInput,
      ProductDataFeedAppUncheckedUpdateInput
    >;
    /**
     * Choose, which ProductDataFeedApp to update.
     *
     **/
    where: ProductDataFeedAppWhereUniqueInput;
  };

  /**
   * ProductDataFeedApp updateMany
   */
  export type ProductDataFeedAppUpdateManyArgs = {
    data: XOR<
      ProductDataFeedAppUpdateManyMutationInput,
      ProductDataFeedAppUncheckedUpdateManyInput
    >;
    where?: ProductDataFeedAppWhereInput;
  };

  /**
   * ProductDataFeedApp upsert
   */
  export type ProductDataFeedAppUpsertArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedApp
     *
     **/
    select?: ProductDataFeedAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedAppInclude | null;
    /**
     * The filter to search for the ProductDataFeedApp to update in case it exists.
     *
     **/
    where: ProductDataFeedAppWhereUniqueInput;
    /**
     * In case the ProductDataFeedApp found by the `where` argument doesn't exist, create a new ProductDataFeedApp with this data.
     *
     **/
    create: XOR<
      ProductDataFeedAppCreateInput,
      ProductDataFeedAppUncheckedCreateInput
    >;
    /**
     * In case the ProductDataFeedApp was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      ProductDataFeedAppUpdateInput,
      ProductDataFeedAppUncheckedUpdateInput
    >;
  };

  /**
   * ProductDataFeedApp delete
   */
  export type ProductDataFeedAppDeleteArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedApp
     *
     **/
    select?: ProductDataFeedAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedAppInclude | null;
    /**
     * Filter which ProductDataFeedApp to delete.
     *
     **/
    where: ProductDataFeedAppWhereUniqueInput;
  };

  /**
   * ProductDataFeedApp deleteMany
   */
  export type ProductDataFeedAppDeleteManyArgs = {
    where?: ProductDataFeedAppWhereInput;
  };

  /**
   * ProductDataFeedApp without action
   */
  export type ProductDataFeedAppArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedApp
     *
     **/
    select?: ProductDataFeedAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedAppInclude | null;
  };

  /**
   * Model LogisticsApp
   */

  export type AggregateLogisticsApp = {
    _count: LogisticsAppCountAggregateOutputType | null;
    _min: LogisticsAppMinAggregateOutputType | null;
    _max: LogisticsAppMaxAggregateOutputType | null;
  };

  export type LogisticsAppMinAggregateOutputType = {
    id: string | null;
    currentOrdersCustomViewId: string | null;
    nextFiveDaysOrdersCustomViewId: string | null;
    currentBulkOrdersCustomViewId: string | null;
    nextFiveDaysBulkOrdersCustomViewId: string | null;
    tenantId: string | null;
  };

  export type LogisticsAppMaxAggregateOutputType = {
    id: string | null;
    currentOrdersCustomViewId: string | null;
    nextFiveDaysOrdersCustomViewId: string | null;
    currentBulkOrdersCustomViewId: string | null;
    nextFiveDaysBulkOrdersCustomViewId: string | null;
    tenantId: string | null;
  };

  export type LogisticsAppCountAggregateOutputType = {
    id: number;
    currentOrdersCustomViewId: number;
    nextFiveDaysOrdersCustomViewId: number;
    currentBulkOrdersCustomViewId: number;
    nextFiveDaysBulkOrdersCustomViewId: number;
    tenantId: number;
    _all: number;
  };

  export type LogisticsAppMinAggregateInputType = {
    id?: true;
    currentOrdersCustomViewId?: true;
    nextFiveDaysOrdersCustomViewId?: true;
    currentBulkOrdersCustomViewId?: true;
    nextFiveDaysBulkOrdersCustomViewId?: true;
    tenantId?: true;
  };

  export type LogisticsAppMaxAggregateInputType = {
    id?: true;
    currentOrdersCustomViewId?: true;
    nextFiveDaysOrdersCustomViewId?: true;
    currentBulkOrdersCustomViewId?: true;
    nextFiveDaysBulkOrdersCustomViewId?: true;
    tenantId?: true;
  };

  export type LogisticsAppCountAggregateInputType = {
    id?: true;
    currentOrdersCustomViewId?: true;
    nextFiveDaysOrdersCustomViewId?: true;
    currentBulkOrdersCustomViewId?: true;
    nextFiveDaysBulkOrdersCustomViewId?: true;
    tenantId?: true;
    _all?: true;
  };

  export type LogisticsAppAggregateArgs = {
    /**
     * Filter which LogisticsApp to aggregate.
     *
     **/
    where?: LogisticsAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LogisticsApps to fetch.
     *
     **/
    orderBy?: Enumerable<LogisticsAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: LogisticsAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LogisticsApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LogisticsApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned LogisticsApps
     **/
    _count?: true | LogisticsAppCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: LogisticsAppMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: LogisticsAppMaxAggregateInputType;
  };

  export type GetLogisticsAppAggregateType<
    T extends LogisticsAppAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateLogisticsApp]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLogisticsApp[P]>
      : GetScalarType<T[P], AggregateLogisticsApp[P]>;
  };

  export type LogisticsAppGroupByArgs = {
    where?: LogisticsAppWhereInput;
    orderBy?: Enumerable<LogisticsAppOrderByWithAggregationInput>;
    by: Array<LogisticsAppScalarFieldEnum>;
    having?: LogisticsAppScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LogisticsAppCountAggregateInputType | true;
    _min?: LogisticsAppMinAggregateInputType;
    _max?: LogisticsAppMaxAggregateInputType;
  };

  export type LogisticsAppGroupByOutputType = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
    tenantId: string;
    _count: LogisticsAppCountAggregateOutputType | null;
    _min: LogisticsAppMinAggregateOutputType | null;
    _max: LogisticsAppMaxAggregateOutputType | null;
  };

  type GetLogisticsAppGroupByPayload<T extends LogisticsAppGroupByArgs> =
    Promise<
      Array<
        PickArray<LogisticsAppGroupByOutputType, T["by"]> & {
          [P in keyof T &
            keyof LogisticsAppGroupByOutputType]: P extends "_count"
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LogisticsAppGroupByOutputType[P]>
            : GetScalarType<T[P], LogisticsAppGroupByOutputType[P]>;
        }
      >
    >;

  export type LogisticsAppSelect = {
    id?: boolean;
    currentOrdersCustomViewId?: boolean;
    nextFiveDaysOrdersCustomViewId?: boolean;
    currentBulkOrdersCustomViewId?: boolean;
    nextFiveDaysBulkOrdersCustomViewId?: boolean;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    webhooks?: boolean | IncomingLogisticsWebhookFindManyArgs;
    integration?: boolean | LogisticsIntegrationArgs;
    _count?: boolean | LogisticsAppCountOutputTypeArgs;
  };

  export type LogisticsAppInclude = {
    tenant?: boolean | TenantArgs;
    webhooks?: boolean | IncomingLogisticsWebhookFindManyArgs;
    integration?: boolean | LogisticsIntegrationArgs;
    _count?: boolean | LogisticsAppCountOutputTypeArgs;
  };

  export type LogisticsAppGetPayload<
    S extends boolean | null | undefined | LogisticsAppArgs,
    U = keyof S,
  > = S extends true
    ? LogisticsApp
    : S extends undefined
    ? never
    : S extends LogisticsAppArgs | LogisticsAppFindManyArgs
    ? "include" extends U
      ? LogisticsApp & {
          [P in TrueKeys<S["include"]>]: P extends "tenant"
            ? TenantGetPayload<S["include"][P]>
            : P extends "webhooks"
            ? Array<IncomingLogisticsWebhookGetPayload<S["include"][P]>>
            : P extends "integration"
            ? LogisticsIntegrationGetPayload<S["include"][P]> | null
            : P extends "_count"
            ? LogisticsAppCountOutputTypeGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof LogisticsApp
            ? LogisticsApp[P]
            : P extends "tenant"
            ? TenantGetPayload<S["select"][P]>
            : P extends "webhooks"
            ? Array<IncomingLogisticsWebhookGetPayload<S["select"][P]>>
            : P extends "integration"
            ? LogisticsIntegrationGetPayload<S["select"][P]> | null
            : P extends "_count"
            ? LogisticsAppCountOutputTypeGetPayload<S["select"][P]>
            : never;
        }
      : LogisticsApp
    : LogisticsApp;

  type LogisticsAppCountArgs = Merge<
    Omit<LogisticsAppFindManyArgs, "select" | "include"> & {
      select?: LogisticsAppCountAggregateInputType | true;
    }
  >;

  export interface LogisticsAppDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one LogisticsApp that matches the filter.
     * @param {LogisticsAppFindUniqueArgs} args - Arguments to find a LogisticsApp
     * @example
     * // Get one LogisticsApp
     * const logisticsApp = await prisma.logisticsApp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends LogisticsAppFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, LogisticsAppFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "LogisticsApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__LogisticsAppClient<LogisticsApp>,
          Prisma__LogisticsAppClient<LogisticsAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__LogisticsAppClient<LogisticsApp | null>,
          Prisma__LogisticsAppClient<LogisticsAppGetPayload<T> | null>
        >;

    /**
     * Find the first LogisticsApp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsAppFindFirstArgs} args - Arguments to find a LogisticsApp
     * @example
     * // Get one LogisticsApp
     * const logisticsApp = await prisma.logisticsApp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends LogisticsAppFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, LogisticsAppFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "LogisticsApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__LogisticsAppClient<LogisticsApp>,
          Prisma__LogisticsAppClient<LogisticsAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__LogisticsAppClient<LogisticsApp | null>,
          Prisma__LogisticsAppClient<LogisticsAppGetPayload<T> | null>
        >;

    /**
     * Find zero or more LogisticsApps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsAppFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LogisticsApps
     * const logisticsApps = await prisma.logisticsApp.findMany()
     *
     * // Get first 10 LogisticsApps
     * const logisticsApps = await prisma.logisticsApp.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const logisticsAppWithIdOnly = await prisma.logisticsApp.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends LogisticsAppFindManyArgs>(
      args?: SelectSubset<T, LogisticsAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<LogisticsApp>>,
      PrismaPromise<Array<LogisticsAppGetPayload<T>>>
    >;

    /**
     * Create a LogisticsApp.
     * @param {LogisticsAppCreateArgs} args - Arguments to create a LogisticsApp.
     * @example
     * // Create one LogisticsApp
     * const LogisticsApp = await prisma.logisticsApp.create({
     *   data: {
     *     // ... data to create a LogisticsApp
     *   }
     * })
     *
     **/
    create<T extends LogisticsAppCreateArgs>(
      args: SelectSubset<T, LogisticsAppCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsAppClient<LogisticsApp>,
      Prisma__LogisticsAppClient<LogisticsAppGetPayload<T>>
    >;

    /**
     * Create many LogisticsApps.
     *     @param {LogisticsAppCreateManyArgs} args - Arguments to create many LogisticsApps.
     *     @example
     *     // Create many LogisticsApps
     *     const logisticsApp = await prisma.logisticsApp.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends LogisticsAppCreateManyArgs>(
      args?: SelectSubset<T, LogisticsAppCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a LogisticsApp.
     * @param {LogisticsAppDeleteArgs} args - Arguments to delete one LogisticsApp.
     * @example
     * // Delete one LogisticsApp
     * const LogisticsApp = await prisma.logisticsApp.delete({
     *   where: {
     *     // ... filter to delete one LogisticsApp
     *   }
     * })
     *
     **/
    delete<T extends LogisticsAppDeleteArgs>(
      args: SelectSubset<T, LogisticsAppDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsAppClient<LogisticsApp>,
      Prisma__LogisticsAppClient<LogisticsAppGetPayload<T>>
    >;

    /**
     * Update one LogisticsApp.
     * @param {LogisticsAppUpdateArgs} args - Arguments to update one LogisticsApp.
     * @example
     * // Update one LogisticsApp
     * const logisticsApp = await prisma.logisticsApp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends LogisticsAppUpdateArgs>(
      args: SelectSubset<T, LogisticsAppUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsAppClient<LogisticsApp>,
      Prisma__LogisticsAppClient<LogisticsAppGetPayload<T>>
    >;

    /**
     * Delete zero or more LogisticsApps.
     * @param {LogisticsAppDeleteManyArgs} args - Arguments to filter LogisticsApps to delete.
     * @example
     * // Delete a few LogisticsApps
     * const { count } = await prisma.logisticsApp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends LogisticsAppDeleteManyArgs>(
      args?: SelectSubset<T, LogisticsAppDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more LogisticsApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsAppUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LogisticsApps
     * const logisticsApp = await prisma.logisticsApp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends LogisticsAppUpdateManyArgs>(
      args: SelectSubset<T, LogisticsAppUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one LogisticsApp.
     * @param {LogisticsAppUpsertArgs} args - Arguments to update or create a LogisticsApp.
     * @example
     * // Update or create a LogisticsApp
     * const logisticsApp = await prisma.logisticsApp.upsert({
     *   create: {
     *     // ... data to create a LogisticsApp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LogisticsApp we want to update
     *   }
     * })
     **/
    upsert<T extends LogisticsAppUpsertArgs>(
      args: SelectSubset<T, LogisticsAppUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsAppClient<LogisticsApp>,
      Prisma__LogisticsAppClient<LogisticsAppGetPayload<T>>
    >;

    /**
     * Count the number of LogisticsApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsAppCountArgs} args - Arguments to filter LogisticsApps to count.
     * @example
     * // Count the number of LogisticsApps
     * const count = await prisma.logisticsApp.count({
     *   where: {
     *     // ... the filter for the LogisticsApps we want to count
     *   }
     * })
     **/
    count<T extends LogisticsAppCountArgs>(
      args?: Subset<T, LogisticsAppCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], LogisticsAppCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a LogisticsApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsAppAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends LogisticsAppAggregateArgs>(
      args: Subset<T, LogisticsAppAggregateArgs>,
    ): PrismaPromise<GetLogisticsAppAggregateType<T>>;

    /**
     * Group by LogisticsApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsAppGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends LogisticsAppGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LogisticsAppGroupByArgs["orderBy"] }
        : { orderBy?: LogisticsAppGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, LogisticsAppGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetLogisticsAppGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LogisticsApp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__LogisticsAppClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    webhooks<T extends IncomingLogisticsWebhookFindManyArgs = {}>(
      args?: Subset<T, IncomingLogisticsWebhookFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<IncomingLogisticsWebhook>>,
      PrismaPromise<Array<IncomingLogisticsWebhookGetPayload<T>>>
    >;

    integration<T extends LogisticsIntegrationArgs = {}>(
      args?: Subset<T, LogisticsIntegrationArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsIntegrationClient<LogisticsIntegration | null>,
      Prisma__LogisticsIntegrationClient<LogisticsIntegrationGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * LogisticsApp findUnique
   */
  export type LogisticsAppFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the LogisticsApp
     *
     **/
    select?: LogisticsAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsAppInclude | null;
    /**
     * Throw an Error if a LogisticsApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which LogisticsApp to fetch.
     *
     **/
    where: LogisticsAppWhereUniqueInput;
  };

  /**
   * LogisticsApp findFirst
   */
  export type LogisticsAppFindFirstArgs = {
    /**
     * Select specific fields to fetch from the LogisticsApp
     *
     **/
    select?: LogisticsAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsAppInclude | null;
    /**
     * Throw an Error if a LogisticsApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which LogisticsApp to fetch.
     *
     **/
    where?: LogisticsAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LogisticsApps to fetch.
     *
     **/
    orderBy?: Enumerable<LogisticsAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for LogisticsApps.
     *
     **/
    cursor?: LogisticsAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LogisticsApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LogisticsApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LogisticsApps.
     *
     **/
    distinct?: Enumerable<LogisticsAppScalarFieldEnum>;
  };

  /**
   * LogisticsApp findMany
   */
  export type LogisticsAppFindManyArgs = {
    /**
     * Select specific fields to fetch from the LogisticsApp
     *
     **/
    select?: LogisticsAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsAppInclude | null;
    /**
     * Filter, which LogisticsApps to fetch.
     *
     **/
    where?: LogisticsAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LogisticsApps to fetch.
     *
     **/
    orderBy?: Enumerable<LogisticsAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing LogisticsApps.
     *
     **/
    cursor?: LogisticsAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LogisticsApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LogisticsApps.
     *
     **/
    skip?: number;
    distinct?: Enumerable<LogisticsAppScalarFieldEnum>;
  };

  /**
   * LogisticsApp create
   */
  export type LogisticsAppCreateArgs = {
    /**
     * Select specific fields to fetch from the LogisticsApp
     *
     **/
    select?: LogisticsAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsAppInclude | null;
    /**
     * The data needed to create a LogisticsApp.
     *
     **/
    data: XOR<LogisticsAppCreateInput, LogisticsAppUncheckedCreateInput>;
  };

  /**
   * LogisticsApp createMany
   */
  export type LogisticsAppCreateManyArgs = {
    data: Enumerable<LogisticsAppCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * LogisticsApp update
   */
  export type LogisticsAppUpdateArgs = {
    /**
     * Select specific fields to fetch from the LogisticsApp
     *
     **/
    select?: LogisticsAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsAppInclude | null;
    /**
     * The data needed to update a LogisticsApp.
     *
     **/
    data: XOR<LogisticsAppUpdateInput, LogisticsAppUncheckedUpdateInput>;
    /**
     * Choose, which LogisticsApp to update.
     *
     **/
    where: LogisticsAppWhereUniqueInput;
  };

  /**
   * LogisticsApp updateMany
   */
  export type LogisticsAppUpdateManyArgs = {
    data: XOR<
      LogisticsAppUpdateManyMutationInput,
      LogisticsAppUncheckedUpdateManyInput
    >;
    where?: LogisticsAppWhereInput;
  };

  /**
   * LogisticsApp upsert
   */
  export type LogisticsAppUpsertArgs = {
    /**
     * Select specific fields to fetch from the LogisticsApp
     *
     **/
    select?: LogisticsAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsAppInclude | null;
    /**
     * The filter to search for the LogisticsApp to update in case it exists.
     *
     **/
    where: LogisticsAppWhereUniqueInput;
    /**
     * In case the LogisticsApp found by the `where` argument doesn't exist, create a new LogisticsApp with this data.
     *
     **/
    create: XOR<LogisticsAppCreateInput, LogisticsAppUncheckedCreateInput>;
    /**
     * In case the LogisticsApp was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<LogisticsAppUpdateInput, LogisticsAppUncheckedUpdateInput>;
  };

  /**
   * LogisticsApp delete
   */
  export type LogisticsAppDeleteArgs = {
    /**
     * Select specific fields to fetch from the LogisticsApp
     *
     **/
    select?: LogisticsAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsAppInclude | null;
    /**
     * Filter which LogisticsApp to delete.
     *
     **/
    where: LogisticsAppWhereUniqueInput;
  };

  /**
   * LogisticsApp deleteMany
   */
  export type LogisticsAppDeleteManyArgs = {
    where?: LogisticsAppWhereInput;
  };

  /**
   * LogisticsApp without action
   */
  export type LogisticsAppArgs = {
    /**
     * Select specific fields to fetch from the LogisticsApp
     *
     **/
    select?: LogisticsAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsAppInclude | null;
  };

  /**
   * Model ZohoApp
   */

  export type AggregateZohoApp = {
    _count: ZohoAppCountAggregateOutputType | null;
    _min: ZohoAppMinAggregateOutputType | null;
    _max: ZohoAppMaxAggregateOutputType | null;
  };

  export type ZohoAppMinAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    clientId: string | null;
    clientSecret: string | null;
    tenantId: string | null;
  };

  export type ZohoAppMaxAggregateOutputType = {
    id: string | null;
    orgId: string | null;
    clientId: string | null;
    clientSecret: string | null;
    tenantId: string | null;
  };

  export type ZohoAppCountAggregateOutputType = {
    id: number;
    orgId: number;
    clientId: number;
    clientSecret: number;
    tenantId: number;
    _all: number;
  };

  export type ZohoAppMinAggregateInputType = {
    id?: true;
    orgId?: true;
    clientId?: true;
    clientSecret?: true;
    tenantId?: true;
  };

  export type ZohoAppMaxAggregateInputType = {
    id?: true;
    orgId?: true;
    clientId?: true;
    clientSecret?: true;
    tenantId?: true;
  };

  export type ZohoAppCountAggregateInputType = {
    id?: true;
    orgId?: true;
    clientId?: true;
    clientSecret?: true;
    tenantId?: true;
    _all?: true;
  };

  export type ZohoAppAggregateArgs = {
    /**
     * Filter which ZohoApp to aggregate.
     *
     **/
    where?: ZohoAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ZohoApps to fetch.
     *
     **/
    orderBy?: Enumerable<ZohoAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: ZohoAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ZohoApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ZohoApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ZohoApps
     **/
    _count?: true | ZohoAppCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ZohoAppMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ZohoAppMaxAggregateInputType;
  };

  export type GetZohoAppAggregateType<T extends ZohoAppAggregateArgs> = {
    [P in keyof T & keyof AggregateZohoApp]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateZohoApp[P]>
      : GetScalarType<T[P], AggregateZohoApp[P]>;
  };

  export type ZohoAppGroupByArgs = {
    where?: ZohoAppWhereInput;
    orderBy?: Enumerable<ZohoAppOrderByWithAggregationInput>;
    by: Array<ZohoAppScalarFieldEnum>;
    having?: ZohoAppScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ZohoAppCountAggregateInputType | true;
    _min?: ZohoAppMinAggregateInputType;
    _max?: ZohoAppMaxAggregateInputType;
  };

  export type ZohoAppGroupByOutputType = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    tenantId: string;
    _count: ZohoAppCountAggregateOutputType | null;
    _min: ZohoAppMinAggregateOutputType | null;
    _max: ZohoAppMaxAggregateOutputType | null;
  };

  type GetZohoAppGroupByPayload<T extends ZohoAppGroupByArgs> = Promise<
    Array<
      PickArray<ZohoAppGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof ZohoAppGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ZohoAppGroupByOutputType[P]>
          : GetScalarType<T[P], ZohoAppGroupByOutputType[P]>;
      }
    >
  >;

  export type ZohoAppSelect = {
    id?: boolean;
    orgId?: boolean;
    clientId?: boolean;
    clientSecret?: boolean;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    strapiToZohoIntegration?: boolean | StrapiToZohoIntegrationFindManyArgs;
    logisticsIntegration?: boolean | LogisticsIntegrationFindManyArgs;
    _count?: boolean | ZohoAppCountOutputTypeArgs;
  };

  export type ZohoAppInclude = {
    tenant?: boolean | TenantArgs;
    strapiToZohoIntegration?: boolean | StrapiToZohoIntegrationFindManyArgs;
    logisticsIntegration?: boolean | LogisticsIntegrationFindManyArgs;
    _count?: boolean | ZohoAppCountOutputTypeArgs;
  };

  export type ZohoAppGetPayload<
    S extends boolean | null | undefined | ZohoAppArgs,
    U = keyof S,
  > = S extends true
    ? ZohoApp
    : S extends undefined
    ? never
    : S extends ZohoAppArgs | ZohoAppFindManyArgs
    ? "include" extends U
      ? ZohoApp & {
          [P in TrueKeys<S["include"]>]: P extends "tenant"
            ? TenantGetPayload<S["include"][P]>
            : P extends "strapiToZohoIntegration"
            ? Array<StrapiToZohoIntegrationGetPayload<S["include"][P]>>
            : P extends "logisticsIntegration"
            ? Array<LogisticsIntegrationGetPayload<S["include"][P]>>
            : P extends "_count"
            ? ZohoAppCountOutputTypeGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof ZohoApp
            ? ZohoApp[P]
            : P extends "tenant"
            ? TenantGetPayload<S["select"][P]>
            : P extends "strapiToZohoIntegration"
            ? Array<StrapiToZohoIntegrationGetPayload<S["select"][P]>>
            : P extends "logisticsIntegration"
            ? Array<LogisticsIntegrationGetPayload<S["select"][P]>>
            : P extends "_count"
            ? ZohoAppCountOutputTypeGetPayload<S["select"][P]>
            : never;
        }
      : ZohoApp
    : ZohoApp;

  type ZohoAppCountArgs = Merge<
    Omit<ZohoAppFindManyArgs, "select" | "include"> & {
      select?: ZohoAppCountAggregateInputType | true;
    }
  >;

  export interface ZohoAppDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one ZohoApp that matches the filter.
     * @param {ZohoAppFindUniqueArgs} args - Arguments to find a ZohoApp
     * @example
     * // Get one ZohoApp
     * const zohoApp = await prisma.zohoApp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends ZohoAppFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, ZohoAppFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "ZohoApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__ZohoAppClient<ZohoApp>,
          Prisma__ZohoAppClient<ZohoAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__ZohoAppClient<ZohoApp | null>,
          Prisma__ZohoAppClient<ZohoAppGetPayload<T> | null>
        >;

    /**
     * Find the first ZohoApp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZohoAppFindFirstArgs} args - Arguments to find a ZohoApp
     * @example
     * // Get one ZohoApp
     * const zohoApp = await prisma.zohoApp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends ZohoAppFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, ZohoAppFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "ZohoApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__ZohoAppClient<ZohoApp>,
          Prisma__ZohoAppClient<ZohoAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__ZohoAppClient<ZohoApp | null>,
          Prisma__ZohoAppClient<ZohoAppGetPayload<T> | null>
        >;

    /**
     * Find zero or more ZohoApps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZohoAppFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ZohoApps
     * const zohoApps = await prisma.zohoApp.findMany()
     *
     * // Get first 10 ZohoApps
     * const zohoApps = await prisma.zohoApp.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const zohoAppWithIdOnly = await prisma.zohoApp.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends ZohoAppFindManyArgs>(
      args?: SelectSubset<T, ZohoAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<ZohoApp>>,
      PrismaPromise<Array<ZohoAppGetPayload<T>>>
    >;

    /**
     * Create a ZohoApp.
     * @param {ZohoAppCreateArgs} args - Arguments to create a ZohoApp.
     * @example
     * // Create one ZohoApp
     * const ZohoApp = await prisma.zohoApp.create({
     *   data: {
     *     // ... data to create a ZohoApp
     *   }
     * })
     *
     **/
    create<T extends ZohoAppCreateArgs>(
      args: SelectSubset<T, ZohoAppCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__ZohoAppClient<ZohoApp>,
      Prisma__ZohoAppClient<ZohoAppGetPayload<T>>
    >;

    /**
     * Create many ZohoApps.
     *     @param {ZohoAppCreateManyArgs} args - Arguments to create many ZohoApps.
     *     @example
     *     // Create many ZohoApps
     *     const zohoApp = await prisma.zohoApp.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends ZohoAppCreateManyArgs>(
      args?: SelectSubset<T, ZohoAppCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a ZohoApp.
     * @param {ZohoAppDeleteArgs} args - Arguments to delete one ZohoApp.
     * @example
     * // Delete one ZohoApp
     * const ZohoApp = await prisma.zohoApp.delete({
     *   where: {
     *     // ... filter to delete one ZohoApp
     *   }
     * })
     *
     **/
    delete<T extends ZohoAppDeleteArgs>(
      args: SelectSubset<T, ZohoAppDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__ZohoAppClient<ZohoApp>,
      Prisma__ZohoAppClient<ZohoAppGetPayload<T>>
    >;

    /**
     * Update one ZohoApp.
     * @param {ZohoAppUpdateArgs} args - Arguments to update one ZohoApp.
     * @example
     * // Update one ZohoApp
     * const zohoApp = await prisma.zohoApp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends ZohoAppUpdateArgs>(
      args: SelectSubset<T, ZohoAppUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__ZohoAppClient<ZohoApp>,
      Prisma__ZohoAppClient<ZohoAppGetPayload<T>>
    >;

    /**
     * Delete zero or more ZohoApps.
     * @param {ZohoAppDeleteManyArgs} args - Arguments to filter ZohoApps to delete.
     * @example
     * // Delete a few ZohoApps
     * const { count } = await prisma.zohoApp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends ZohoAppDeleteManyArgs>(
      args?: SelectSubset<T, ZohoAppDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ZohoApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZohoAppUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ZohoApps
     * const zohoApp = await prisma.zohoApp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends ZohoAppUpdateManyArgs>(
      args: SelectSubset<T, ZohoAppUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one ZohoApp.
     * @param {ZohoAppUpsertArgs} args - Arguments to update or create a ZohoApp.
     * @example
     * // Update or create a ZohoApp
     * const zohoApp = await prisma.zohoApp.upsert({
     *   create: {
     *     // ... data to create a ZohoApp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ZohoApp we want to update
     *   }
     * })
     **/
    upsert<T extends ZohoAppUpsertArgs>(
      args: SelectSubset<T, ZohoAppUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__ZohoAppClient<ZohoApp>,
      Prisma__ZohoAppClient<ZohoAppGetPayload<T>>
    >;

    /**
     * Count the number of ZohoApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZohoAppCountArgs} args - Arguments to filter ZohoApps to count.
     * @example
     * // Count the number of ZohoApps
     * const count = await prisma.zohoApp.count({
     *   where: {
     *     // ... the filter for the ZohoApps we want to count
     *   }
     * })
     **/
    count<T extends ZohoAppCountArgs>(
      args?: Subset<T, ZohoAppCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], ZohoAppCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ZohoApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZohoAppAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ZohoAppAggregateArgs>(
      args: Subset<T, ZohoAppAggregateArgs>,
    ): PrismaPromise<GetZohoAppAggregateType<T>>;

    /**
     * Group by ZohoApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZohoAppGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ZohoAppGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ZohoAppGroupByArgs["orderBy"] }
        : { orderBy?: ZohoAppGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, ZohoAppGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetZohoAppGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ZohoApp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ZohoAppClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    strapiToZohoIntegration<T extends StrapiToZohoIntegrationFindManyArgs = {}>(
      args?: Subset<T, StrapiToZohoIntegrationFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<StrapiToZohoIntegration>>,
      PrismaPromise<Array<StrapiToZohoIntegrationGetPayload<T>>>
    >;

    logisticsIntegration<T extends LogisticsIntegrationFindManyArgs = {}>(
      args?: Subset<T, LogisticsIntegrationFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<LogisticsIntegration>>,
      PrismaPromise<Array<LogisticsIntegrationGetPayload<T>>>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * ZohoApp findUnique
   */
  export type ZohoAppFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the ZohoApp
     *
     **/
    select?: ZohoAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ZohoAppInclude | null;
    /**
     * Throw an Error if a ZohoApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which ZohoApp to fetch.
     *
     **/
    where: ZohoAppWhereUniqueInput;
  };

  /**
   * ZohoApp findFirst
   */
  export type ZohoAppFindFirstArgs = {
    /**
     * Select specific fields to fetch from the ZohoApp
     *
     **/
    select?: ZohoAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ZohoAppInclude | null;
    /**
     * Throw an Error if a ZohoApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which ZohoApp to fetch.
     *
     **/
    where?: ZohoAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ZohoApps to fetch.
     *
     **/
    orderBy?: Enumerable<ZohoAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ZohoApps.
     *
     **/
    cursor?: ZohoAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ZohoApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ZohoApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ZohoApps.
     *
     **/
    distinct?: Enumerable<ZohoAppScalarFieldEnum>;
  };

  /**
   * ZohoApp findMany
   */
  export type ZohoAppFindManyArgs = {
    /**
     * Select specific fields to fetch from the ZohoApp
     *
     **/
    select?: ZohoAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ZohoAppInclude | null;
    /**
     * Filter, which ZohoApps to fetch.
     *
     **/
    where?: ZohoAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ZohoApps to fetch.
     *
     **/
    orderBy?: Enumerable<ZohoAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ZohoApps.
     *
     **/
    cursor?: ZohoAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ZohoApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ZohoApps.
     *
     **/
    skip?: number;
    distinct?: Enumerable<ZohoAppScalarFieldEnum>;
  };

  /**
   * ZohoApp create
   */
  export type ZohoAppCreateArgs = {
    /**
     * Select specific fields to fetch from the ZohoApp
     *
     **/
    select?: ZohoAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ZohoAppInclude | null;
    /**
     * The data needed to create a ZohoApp.
     *
     **/
    data: XOR<ZohoAppCreateInput, ZohoAppUncheckedCreateInput>;
  };

  /**
   * ZohoApp createMany
   */
  export type ZohoAppCreateManyArgs = {
    data: Enumerable<ZohoAppCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * ZohoApp update
   */
  export type ZohoAppUpdateArgs = {
    /**
     * Select specific fields to fetch from the ZohoApp
     *
     **/
    select?: ZohoAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ZohoAppInclude | null;
    /**
     * The data needed to update a ZohoApp.
     *
     **/
    data: XOR<ZohoAppUpdateInput, ZohoAppUncheckedUpdateInput>;
    /**
     * Choose, which ZohoApp to update.
     *
     **/
    where: ZohoAppWhereUniqueInput;
  };

  /**
   * ZohoApp updateMany
   */
  export type ZohoAppUpdateManyArgs = {
    data: XOR<ZohoAppUpdateManyMutationInput, ZohoAppUncheckedUpdateManyInput>;
    where?: ZohoAppWhereInput;
  };

  /**
   * ZohoApp upsert
   */
  export type ZohoAppUpsertArgs = {
    /**
     * Select specific fields to fetch from the ZohoApp
     *
     **/
    select?: ZohoAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ZohoAppInclude | null;
    /**
     * The filter to search for the ZohoApp to update in case it exists.
     *
     **/
    where: ZohoAppWhereUniqueInput;
    /**
     * In case the ZohoApp found by the `where` argument doesn't exist, create a new ZohoApp with this data.
     *
     **/
    create: XOR<ZohoAppCreateInput, ZohoAppUncheckedCreateInput>;
    /**
     * In case the ZohoApp was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<ZohoAppUpdateInput, ZohoAppUncheckedUpdateInput>;
  };

  /**
   * ZohoApp delete
   */
  export type ZohoAppDeleteArgs = {
    /**
     * Select specific fields to fetch from the ZohoApp
     *
     **/
    select?: ZohoAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ZohoAppInclude | null;
    /**
     * Filter which ZohoApp to delete.
     *
     **/
    where: ZohoAppWhereUniqueInput;
  };

  /**
   * ZohoApp deleteMany
   */
  export type ZohoAppDeleteManyArgs = {
    where?: ZohoAppWhereInput;
  };

  /**
   * ZohoApp without action
   */
  export type ZohoAppArgs = {
    /**
     * Select specific fields to fetch from the ZohoApp
     *
     **/
    select?: ZohoAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ZohoAppInclude | null;
  };

  /**
   * Model SaleorApp
   */

  export type AggregateSaleorApp = {
    _count: SaleorAppCountAggregateOutputType | null;
    _min: SaleorAppMinAggregateOutputType | null;
    _max: SaleorAppMaxAggregateOutputType | null;
  };

  export type SaleorAppMinAggregateOutputType = {
    id: string | null;
    domain: string | null;
    name: string | null;
    channelSlug: string | null;
    tenantId: string | null;
  };

  export type SaleorAppMaxAggregateOutputType = {
    id: string | null;
    domain: string | null;
    name: string | null;
    channelSlug: string | null;
    tenantId: string | null;
  };

  export type SaleorAppCountAggregateOutputType = {
    id: number;
    domain: number;
    name: number;
    channelSlug: number;
    tenantId: number;
    _all: number;
  };

  export type SaleorAppMinAggregateInputType = {
    id?: true;
    domain?: true;
    name?: true;
    channelSlug?: true;
    tenantId?: true;
  };

  export type SaleorAppMaxAggregateInputType = {
    id?: true;
    domain?: true;
    name?: true;
    channelSlug?: true;
    tenantId?: true;
  };

  export type SaleorAppCountAggregateInputType = {
    id?: true;
    domain?: true;
    name?: true;
    channelSlug?: true;
    tenantId?: true;
    _all?: true;
  };

  export type SaleorAppAggregateArgs = {
    /**
     * Filter which SaleorApp to aggregate.
     *
     **/
    where?: SaleorAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SaleorApps to fetch.
     *
     **/
    orderBy?: Enumerable<SaleorAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: SaleorAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SaleorApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SaleorApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SaleorApps
     **/
    _count?: true | SaleorAppCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SaleorAppMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SaleorAppMaxAggregateInputType;
  };

  export type GetSaleorAppAggregateType<T extends SaleorAppAggregateArgs> = {
    [P in keyof T & keyof AggregateSaleorApp]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSaleorApp[P]>
      : GetScalarType<T[P], AggregateSaleorApp[P]>;
  };

  export type SaleorAppGroupByArgs = {
    where?: SaleorAppWhereInput;
    orderBy?: Enumerable<SaleorAppOrderByWithAggregationInput>;
    by: Array<SaleorAppScalarFieldEnum>;
    having?: SaleorAppScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SaleorAppCountAggregateInputType | true;
    _min?: SaleorAppMinAggregateInputType;
    _max?: SaleorAppMaxAggregateInputType;
  };

  export type SaleorAppGroupByOutputType = {
    id: string;
    domain: string;
    name: string;
    channelSlug: string | null;
    tenantId: string;
    _count: SaleorAppCountAggregateOutputType | null;
    _min: SaleorAppMinAggregateOutputType | null;
    _max: SaleorAppMaxAggregateOutputType | null;
  };

  type GetSaleorAppGroupByPayload<T extends SaleorAppGroupByArgs> = Promise<
    Array<
      PickArray<SaleorAppGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof SaleorAppGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SaleorAppGroupByOutputType[P]>
          : GetScalarType<T[P], SaleorAppGroupByOutputType[P]>;
      }
    >
  >;

  export type SaleorAppSelect = {
    id?: boolean;
    domain?: boolean;
    name?: boolean;
    channelSlug?: boolean;
    installedSaleorApp?: boolean | InstalledSaleorAppArgs;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    productDataFeedIntegration?:
      | boolean
      | ProductDataFeedIntegrationFindManyArgs;
    ProductDataFeedApp?: boolean | ProductDataFeedAppFindManyArgs;
    _count?: boolean | SaleorAppCountOutputTypeArgs;
  };

  export type SaleorAppInclude = {
    installedSaleorApp?: boolean | InstalledSaleorAppArgs;
    tenant?: boolean | TenantArgs;
    productDataFeedIntegration?:
      | boolean
      | ProductDataFeedIntegrationFindManyArgs;
    ProductDataFeedApp?: boolean | ProductDataFeedAppFindManyArgs;
    _count?: boolean | SaleorAppCountOutputTypeArgs;
  };

  export type SaleorAppGetPayload<
    S extends boolean | null | undefined | SaleorAppArgs,
    U = keyof S,
  > = S extends true
    ? SaleorApp
    : S extends undefined
    ? never
    : S extends SaleorAppArgs | SaleorAppFindManyArgs
    ? "include" extends U
      ? SaleorApp & {
          [P in TrueKeys<S["include"]>]: P extends "installedSaleorApp"
            ? InstalledSaleorAppGetPayload<S["include"][P]> | null
            : P extends "tenant"
            ? TenantGetPayload<S["include"][P]>
            : P extends "productDataFeedIntegration"
            ? Array<ProductDataFeedIntegrationGetPayload<S["include"][P]>>
            : P extends "ProductDataFeedApp"
            ? Array<ProductDataFeedAppGetPayload<S["include"][P]>>
            : P extends "_count"
            ? SaleorAppCountOutputTypeGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof SaleorApp
            ? SaleorApp[P]
            : P extends "installedSaleorApp"
            ? InstalledSaleorAppGetPayload<S["select"][P]> | null
            : P extends "tenant"
            ? TenantGetPayload<S["select"][P]>
            : P extends "productDataFeedIntegration"
            ? Array<ProductDataFeedIntegrationGetPayload<S["select"][P]>>
            : P extends "ProductDataFeedApp"
            ? Array<ProductDataFeedAppGetPayload<S["select"][P]>>
            : P extends "_count"
            ? SaleorAppCountOutputTypeGetPayload<S["select"][P]>
            : never;
        }
      : SaleorApp
    : SaleorApp;

  type SaleorAppCountArgs = Merge<
    Omit<SaleorAppFindManyArgs, "select" | "include"> & {
      select?: SaleorAppCountAggregateInputType | true;
    }
  >;

  export interface SaleorAppDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one SaleorApp that matches the filter.
     * @param {SaleorAppFindUniqueArgs} args - Arguments to find a SaleorApp
     * @example
     * // Get one SaleorApp
     * const saleorApp = await prisma.saleorApp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends SaleorAppFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, SaleorAppFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "SaleorApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__SaleorAppClient<SaleorApp>,
          Prisma__SaleorAppClient<SaleorAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__SaleorAppClient<SaleorApp | null>,
          Prisma__SaleorAppClient<SaleorAppGetPayload<T> | null>
        >;

    /**
     * Find the first SaleorApp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleorAppFindFirstArgs} args - Arguments to find a SaleorApp
     * @example
     * // Get one SaleorApp
     * const saleorApp = await prisma.saleorApp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends SaleorAppFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, SaleorAppFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "SaleorApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__SaleorAppClient<SaleorApp>,
          Prisma__SaleorAppClient<SaleorAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__SaleorAppClient<SaleorApp | null>,
          Prisma__SaleorAppClient<SaleorAppGetPayload<T> | null>
        >;

    /**
     * Find zero or more SaleorApps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleorAppFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SaleorApps
     * const saleorApps = await prisma.saleorApp.findMany()
     *
     * // Get first 10 SaleorApps
     * const saleorApps = await prisma.saleorApp.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const saleorAppWithIdOnly = await prisma.saleorApp.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends SaleorAppFindManyArgs>(
      args?: SelectSubset<T, SaleorAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<SaleorApp>>,
      PrismaPromise<Array<SaleorAppGetPayload<T>>>
    >;

    /**
     * Create a SaleorApp.
     * @param {SaleorAppCreateArgs} args - Arguments to create a SaleorApp.
     * @example
     * // Create one SaleorApp
     * const SaleorApp = await prisma.saleorApp.create({
     *   data: {
     *     // ... data to create a SaleorApp
     *   }
     * })
     *
     **/
    create<T extends SaleorAppCreateArgs>(
      args: SelectSubset<T, SaleorAppCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__SaleorAppClient<SaleorApp>,
      Prisma__SaleorAppClient<SaleorAppGetPayload<T>>
    >;

    /**
     * Create many SaleorApps.
     *     @param {SaleorAppCreateManyArgs} args - Arguments to create many SaleorApps.
     *     @example
     *     // Create many SaleorApps
     *     const saleorApp = await prisma.saleorApp.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends SaleorAppCreateManyArgs>(
      args?: SelectSubset<T, SaleorAppCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a SaleorApp.
     * @param {SaleorAppDeleteArgs} args - Arguments to delete one SaleorApp.
     * @example
     * // Delete one SaleorApp
     * const SaleorApp = await prisma.saleorApp.delete({
     *   where: {
     *     // ... filter to delete one SaleorApp
     *   }
     * })
     *
     **/
    delete<T extends SaleorAppDeleteArgs>(
      args: SelectSubset<T, SaleorAppDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__SaleorAppClient<SaleorApp>,
      Prisma__SaleorAppClient<SaleorAppGetPayload<T>>
    >;

    /**
     * Update one SaleorApp.
     * @param {SaleorAppUpdateArgs} args - Arguments to update one SaleorApp.
     * @example
     * // Update one SaleorApp
     * const saleorApp = await prisma.saleorApp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends SaleorAppUpdateArgs>(
      args: SelectSubset<T, SaleorAppUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__SaleorAppClient<SaleorApp>,
      Prisma__SaleorAppClient<SaleorAppGetPayload<T>>
    >;

    /**
     * Delete zero or more SaleorApps.
     * @param {SaleorAppDeleteManyArgs} args - Arguments to filter SaleorApps to delete.
     * @example
     * // Delete a few SaleorApps
     * const { count } = await prisma.saleorApp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends SaleorAppDeleteManyArgs>(
      args?: SelectSubset<T, SaleorAppDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more SaleorApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleorAppUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SaleorApps
     * const saleorApp = await prisma.saleorApp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends SaleorAppUpdateManyArgs>(
      args: SelectSubset<T, SaleorAppUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one SaleorApp.
     * @param {SaleorAppUpsertArgs} args - Arguments to update or create a SaleorApp.
     * @example
     * // Update or create a SaleorApp
     * const saleorApp = await prisma.saleorApp.upsert({
     *   create: {
     *     // ... data to create a SaleorApp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SaleorApp we want to update
     *   }
     * })
     **/
    upsert<T extends SaleorAppUpsertArgs>(
      args: SelectSubset<T, SaleorAppUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__SaleorAppClient<SaleorApp>,
      Prisma__SaleorAppClient<SaleorAppGetPayload<T>>
    >;

    /**
     * Count the number of SaleorApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleorAppCountArgs} args - Arguments to filter SaleorApps to count.
     * @example
     * // Count the number of SaleorApps
     * const count = await prisma.saleorApp.count({
     *   where: {
     *     // ... the filter for the SaleorApps we want to count
     *   }
     * })
     **/
    count<T extends SaleorAppCountArgs>(
      args?: Subset<T, SaleorAppCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], SaleorAppCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a SaleorApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleorAppAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SaleorAppAggregateArgs>(
      args: Subset<T, SaleorAppAggregateArgs>,
    ): PrismaPromise<GetSaleorAppAggregateType<T>>;

    /**
     * Group by SaleorApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleorAppGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SaleorAppGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SaleorAppGroupByArgs["orderBy"] }
        : { orderBy?: SaleorAppGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, SaleorAppGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetSaleorAppGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SaleorApp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SaleorAppClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    installedSaleorApp<T extends InstalledSaleorAppArgs = {}>(
      args?: Subset<T, InstalledSaleorAppArgs>,
    ): CheckSelect<
      T,
      Prisma__InstalledSaleorAppClient<InstalledSaleorApp | null>,
      Prisma__InstalledSaleorAppClient<InstalledSaleorAppGetPayload<T> | null>
    >;

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    productDataFeedIntegration<
      T extends ProductDataFeedIntegrationFindManyArgs = {},
    >(
      args?: Subset<T, ProductDataFeedIntegrationFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<ProductDataFeedIntegration>>,
      PrismaPromise<Array<ProductDataFeedIntegrationGetPayload<T>>>
    >;

    ProductDataFeedApp<T extends ProductDataFeedAppFindManyArgs = {}>(
      args?: Subset<T, ProductDataFeedAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<ProductDataFeedApp>>,
      PrismaPromise<Array<ProductDataFeedAppGetPayload<T>>>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * SaleorApp findUnique
   */
  export type SaleorAppFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the SaleorApp
     *
     **/
    select?: SaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SaleorAppInclude | null;
    /**
     * Throw an Error if a SaleorApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which SaleorApp to fetch.
     *
     **/
    where: SaleorAppWhereUniqueInput;
  };

  /**
   * SaleorApp findFirst
   */
  export type SaleorAppFindFirstArgs = {
    /**
     * Select specific fields to fetch from the SaleorApp
     *
     **/
    select?: SaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SaleorAppInclude | null;
    /**
     * Throw an Error if a SaleorApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which SaleorApp to fetch.
     *
     **/
    where?: SaleorAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SaleorApps to fetch.
     *
     **/
    orderBy?: Enumerable<SaleorAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SaleorApps.
     *
     **/
    cursor?: SaleorAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SaleorApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SaleorApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SaleorApps.
     *
     **/
    distinct?: Enumerable<SaleorAppScalarFieldEnum>;
  };

  /**
   * SaleorApp findMany
   */
  export type SaleorAppFindManyArgs = {
    /**
     * Select specific fields to fetch from the SaleorApp
     *
     **/
    select?: SaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SaleorAppInclude | null;
    /**
     * Filter, which SaleorApps to fetch.
     *
     **/
    where?: SaleorAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SaleorApps to fetch.
     *
     **/
    orderBy?: Enumerable<SaleorAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SaleorApps.
     *
     **/
    cursor?: SaleorAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SaleorApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SaleorApps.
     *
     **/
    skip?: number;
    distinct?: Enumerable<SaleorAppScalarFieldEnum>;
  };

  /**
   * SaleorApp create
   */
  export type SaleorAppCreateArgs = {
    /**
     * Select specific fields to fetch from the SaleorApp
     *
     **/
    select?: SaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SaleorAppInclude | null;
    /**
     * The data needed to create a SaleorApp.
     *
     **/
    data: XOR<SaleorAppCreateInput, SaleorAppUncheckedCreateInput>;
  };

  /**
   * SaleorApp createMany
   */
  export type SaleorAppCreateManyArgs = {
    data: Enumerable<SaleorAppCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * SaleorApp update
   */
  export type SaleorAppUpdateArgs = {
    /**
     * Select specific fields to fetch from the SaleorApp
     *
     **/
    select?: SaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SaleorAppInclude | null;
    /**
     * The data needed to update a SaleorApp.
     *
     **/
    data: XOR<SaleorAppUpdateInput, SaleorAppUncheckedUpdateInput>;
    /**
     * Choose, which SaleorApp to update.
     *
     **/
    where: SaleorAppWhereUniqueInput;
  };

  /**
   * SaleorApp updateMany
   */
  export type SaleorAppUpdateManyArgs = {
    data: XOR<
      SaleorAppUpdateManyMutationInput,
      SaleorAppUncheckedUpdateManyInput
    >;
    where?: SaleorAppWhereInput;
  };

  /**
   * SaleorApp upsert
   */
  export type SaleorAppUpsertArgs = {
    /**
     * Select specific fields to fetch from the SaleorApp
     *
     **/
    select?: SaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SaleorAppInclude | null;
    /**
     * The filter to search for the SaleorApp to update in case it exists.
     *
     **/
    where: SaleorAppWhereUniqueInput;
    /**
     * In case the SaleorApp found by the `where` argument doesn't exist, create a new SaleorApp with this data.
     *
     **/
    create: XOR<SaleorAppCreateInput, SaleorAppUncheckedCreateInput>;
    /**
     * In case the SaleorApp was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<SaleorAppUpdateInput, SaleorAppUncheckedUpdateInput>;
  };

  /**
   * SaleorApp delete
   */
  export type SaleorAppDeleteArgs = {
    /**
     * Select specific fields to fetch from the SaleorApp
     *
     **/
    select?: SaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SaleorAppInclude | null;
    /**
     * Filter which SaleorApp to delete.
     *
     **/
    where: SaleorAppWhereUniqueInput;
  };

  /**
   * SaleorApp deleteMany
   */
  export type SaleorAppDeleteManyArgs = {
    where?: SaleorAppWhereInput;
  };

  /**
   * SaleorApp without action
   */
  export type SaleorAppArgs = {
    /**
     * Select specific fields to fetch from the SaleorApp
     *
     **/
    select?: SaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SaleorAppInclude | null;
  };

  /**
   * Model InstalledSaleorApp
   */

  export type AggregateInstalledSaleorApp = {
    _count: InstalledSaleorAppCountAggregateOutputType | null;
    _min: InstalledSaleorAppMinAggregateOutputType | null;
    _max: InstalledSaleorAppMaxAggregateOutputType | null;
  };

  export type InstalledSaleorAppMinAggregateOutputType = {
    id: string | null;
    token: string | null;
    saleorAppId: string | null;
  };

  export type InstalledSaleorAppMaxAggregateOutputType = {
    id: string | null;
    token: string | null;
    saleorAppId: string | null;
  };

  export type InstalledSaleorAppCountAggregateOutputType = {
    id: number;
    token: number;
    saleorAppId: number;
    _all: number;
  };

  export type InstalledSaleorAppMinAggregateInputType = {
    id?: true;
    token?: true;
    saleorAppId?: true;
  };

  export type InstalledSaleorAppMaxAggregateInputType = {
    id?: true;
    token?: true;
    saleorAppId?: true;
  };

  export type InstalledSaleorAppCountAggregateInputType = {
    id?: true;
    token?: true;
    saleorAppId?: true;
    _all?: true;
  };

  export type InstalledSaleorAppAggregateArgs = {
    /**
     * Filter which InstalledSaleorApp to aggregate.
     *
     **/
    where?: InstalledSaleorAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InstalledSaleorApps to fetch.
     *
     **/
    orderBy?: Enumerable<InstalledSaleorAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: InstalledSaleorAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InstalledSaleorApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InstalledSaleorApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned InstalledSaleorApps
     **/
    _count?: true | InstalledSaleorAppCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: InstalledSaleorAppMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: InstalledSaleorAppMaxAggregateInputType;
  };

  export type GetInstalledSaleorAppAggregateType<
    T extends InstalledSaleorAppAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateInstalledSaleorApp]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInstalledSaleorApp[P]>
      : GetScalarType<T[P], AggregateInstalledSaleorApp[P]>;
  };

  export type InstalledSaleorAppGroupByArgs = {
    where?: InstalledSaleorAppWhereInput;
    orderBy?: Enumerable<InstalledSaleorAppOrderByWithAggregationInput>;
    by: Array<InstalledSaleorAppScalarFieldEnum>;
    having?: InstalledSaleorAppScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InstalledSaleorAppCountAggregateInputType | true;
    _min?: InstalledSaleorAppMinAggregateInputType;
    _max?: InstalledSaleorAppMaxAggregateInputType;
  };

  export type InstalledSaleorAppGroupByOutputType = {
    id: string;
    token: string;
    saleorAppId: string;
    _count: InstalledSaleorAppCountAggregateOutputType | null;
    _min: InstalledSaleorAppMinAggregateOutputType | null;
    _max: InstalledSaleorAppMaxAggregateOutputType | null;
  };

  type GetInstalledSaleorAppGroupByPayload<
    T extends InstalledSaleorAppGroupByArgs,
  > = Promise<
    Array<
      PickArray<InstalledSaleorAppGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof InstalledSaleorAppGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], InstalledSaleorAppGroupByOutputType[P]>
          : GetScalarType<T[P], InstalledSaleorAppGroupByOutputType[P]>;
      }
    >
  >;

  export type InstalledSaleorAppSelect = {
    id?: boolean;
    webhooks?: boolean | IncomingSaleorWebhookFindManyArgs;
    token?: boolean;
    saleorApp?: boolean | SaleorAppArgs;
    saleorAppId?: boolean;
    _count?: boolean | InstalledSaleorAppCountOutputTypeArgs;
  };

  export type InstalledSaleorAppInclude = {
    webhooks?: boolean | IncomingSaleorWebhookFindManyArgs;
    saleorApp?: boolean | SaleorAppArgs;
    _count?: boolean | InstalledSaleorAppCountOutputTypeArgs;
  };

  export type InstalledSaleorAppGetPayload<
    S extends boolean | null | undefined | InstalledSaleorAppArgs,
    U = keyof S,
  > = S extends true
    ? InstalledSaleorApp
    : S extends undefined
    ? never
    : S extends InstalledSaleorAppArgs | InstalledSaleorAppFindManyArgs
    ? "include" extends U
      ? InstalledSaleorApp & {
          [P in TrueKeys<S["include"]>]: P extends "webhooks"
            ? Array<IncomingSaleorWebhookGetPayload<S["include"][P]>>
            : P extends "saleorApp"
            ? SaleorAppGetPayload<S["include"][P]>
            : P extends "_count"
            ? InstalledSaleorAppCountOutputTypeGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof InstalledSaleorApp
            ? InstalledSaleorApp[P]
            : P extends "webhooks"
            ? Array<IncomingSaleorWebhookGetPayload<S["select"][P]>>
            : P extends "saleorApp"
            ? SaleorAppGetPayload<S["select"][P]>
            : P extends "_count"
            ? InstalledSaleorAppCountOutputTypeGetPayload<S["select"][P]>
            : never;
        }
      : InstalledSaleorApp
    : InstalledSaleorApp;

  type InstalledSaleorAppCountArgs = Merge<
    Omit<InstalledSaleorAppFindManyArgs, "select" | "include"> & {
      select?: InstalledSaleorAppCountAggregateInputType | true;
    }
  >;

  export interface InstalledSaleorAppDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one InstalledSaleorApp that matches the filter.
     * @param {InstalledSaleorAppFindUniqueArgs} args - Arguments to find a InstalledSaleorApp
     * @example
     * // Get one InstalledSaleorApp
     * const installedSaleorApp = await prisma.installedSaleorApp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends InstalledSaleorAppFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, InstalledSaleorAppFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "InstalledSaleorApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__InstalledSaleorAppClient<InstalledSaleorApp>,
          Prisma__InstalledSaleorAppClient<InstalledSaleorAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__InstalledSaleorAppClient<InstalledSaleorApp | null>,
          Prisma__InstalledSaleorAppClient<InstalledSaleorAppGetPayload<T> | null>
        >;

    /**
     * Find the first InstalledSaleorApp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstalledSaleorAppFindFirstArgs} args - Arguments to find a InstalledSaleorApp
     * @example
     * // Get one InstalledSaleorApp
     * const installedSaleorApp = await prisma.installedSaleorApp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends InstalledSaleorAppFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, InstalledSaleorAppFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "InstalledSaleorApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__InstalledSaleorAppClient<InstalledSaleorApp>,
          Prisma__InstalledSaleorAppClient<InstalledSaleorAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__InstalledSaleorAppClient<InstalledSaleorApp | null>,
          Prisma__InstalledSaleorAppClient<InstalledSaleorAppGetPayload<T> | null>
        >;

    /**
     * Find zero or more InstalledSaleorApps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstalledSaleorAppFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InstalledSaleorApps
     * const installedSaleorApps = await prisma.installedSaleorApp.findMany()
     *
     * // Get first 10 InstalledSaleorApps
     * const installedSaleorApps = await prisma.installedSaleorApp.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const installedSaleorAppWithIdOnly = await prisma.installedSaleorApp.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends InstalledSaleorAppFindManyArgs>(
      args?: SelectSubset<T, InstalledSaleorAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<InstalledSaleorApp>>,
      PrismaPromise<Array<InstalledSaleorAppGetPayload<T>>>
    >;

    /**
     * Create a InstalledSaleorApp.
     * @param {InstalledSaleorAppCreateArgs} args - Arguments to create a InstalledSaleorApp.
     * @example
     * // Create one InstalledSaleorApp
     * const InstalledSaleorApp = await prisma.installedSaleorApp.create({
     *   data: {
     *     // ... data to create a InstalledSaleorApp
     *   }
     * })
     *
     **/
    create<T extends InstalledSaleorAppCreateArgs>(
      args: SelectSubset<T, InstalledSaleorAppCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__InstalledSaleorAppClient<InstalledSaleorApp>,
      Prisma__InstalledSaleorAppClient<InstalledSaleorAppGetPayload<T>>
    >;

    /**
     * Create many InstalledSaleorApps.
     *     @param {InstalledSaleorAppCreateManyArgs} args - Arguments to create many InstalledSaleorApps.
     *     @example
     *     // Create many InstalledSaleorApps
     *     const installedSaleorApp = await prisma.installedSaleorApp.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends InstalledSaleorAppCreateManyArgs>(
      args?: SelectSubset<T, InstalledSaleorAppCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a InstalledSaleorApp.
     * @param {InstalledSaleorAppDeleteArgs} args - Arguments to delete one InstalledSaleorApp.
     * @example
     * // Delete one InstalledSaleorApp
     * const InstalledSaleorApp = await prisma.installedSaleorApp.delete({
     *   where: {
     *     // ... filter to delete one InstalledSaleorApp
     *   }
     * })
     *
     **/
    delete<T extends InstalledSaleorAppDeleteArgs>(
      args: SelectSubset<T, InstalledSaleorAppDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__InstalledSaleorAppClient<InstalledSaleorApp>,
      Prisma__InstalledSaleorAppClient<InstalledSaleorAppGetPayload<T>>
    >;

    /**
     * Update one InstalledSaleorApp.
     * @param {InstalledSaleorAppUpdateArgs} args - Arguments to update one InstalledSaleorApp.
     * @example
     * // Update one InstalledSaleorApp
     * const installedSaleorApp = await prisma.installedSaleorApp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends InstalledSaleorAppUpdateArgs>(
      args: SelectSubset<T, InstalledSaleorAppUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__InstalledSaleorAppClient<InstalledSaleorApp>,
      Prisma__InstalledSaleorAppClient<InstalledSaleorAppGetPayload<T>>
    >;

    /**
     * Delete zero or more InstalledSaleorApps.
     * @param {InstalledSaleorAppDeleteManyArgs} args - Arguments to filter InstalledSaleorApps to delete.
     * @example
     * // Delete a few InstalledSaleorApps
     * const { count } = await prisma.installedSaleorApp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends InstalledSaleorAppDeleteManyArgs>(
      args?: SelectSubset<T, InstalledSaleorAppDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more InstalledSaleorApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstalledSaleorAppUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InstalledSaleorApps
     * const installedSaleorApp = await prisma.installedSaleorApp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends InstalledSaleorAppUpdateManyArgs>(
      args: SelectSubset<T, InstalledSaleorAppUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one InstalledSaleorApp.
     * @param {InstalledSaleorAppUpsertArgs} args - Arguments to update or create a InstalledSaleorApp.
     * @example
     * // Update or create a InstalledSaleorApp
     * const installedSaleorApp = await prisma.installedSaleorApp.upsert({
     *   create: {
     *     // ... data to create a InstalledSaleorApp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InstalledSaleorApp we want to update
     *   }
     * })
     **/
    upsert<T extends InstalledSaleorAppUpsertArgs>(
      args: SelectSubset<T, InstalledSaleorAppUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__InstalledSaleorAppClient<InstalledSaleorApp>,
      Prisma__InstalledSaleorAppClient<InstalledSaleorAppGetPayload<T>>
    >;

    /**
     * Count the number of InstalledSaleorApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstalledSaleorAppCountArgs} args - Arguments to filter InstalledSaleorApps to count.
     * @example
     * // Count the number of InstalledSaleorApps
     * const count = await prisma.installedSaleorApp.count({
     *   where: {
     *     // ... the filter for the InstalledSaleorApps we want to count
     *   }
     * })
     **/
    count<T extends InstalledSaleorAppCountArgs>(
      args?: Subset<T, InstalledSaleorAppCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              InstalledSaleorAppCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a InstalledSaleorApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstalledSaleorAppAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends InstalledSaleorAppAggregateArgs>(
      args: Subset<T, InstalledSaleorAppAggregateArgs>,
    ): PrismaPromise<GetInstalledSaleorAppAggregateType<T>>;

    /**
     * Group by InstalledSaleorApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstalledSaleorAppGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends InstalledSaleorAppGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InstalledSaleorAppGroupByArgs["orderBy"] }
        : { orderBy?: InstalledSaleorAppGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, InstalledSaleorAppGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetInstalledSaleorAppGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InstalledSaleorApp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__InstalledSaleorAppClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    webhooks<T extends IncomingSaleorWebhookFindManyArgs = {}>(
      args?: Subset<T, IncomingSaleorWebhookFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<IncomingSaleorWebhook>>,
      PrismaPromise<Array<IncomingSaleorWebhookGetPayload<T>>>
    >;

    saleorApp<T extends SaleorAppArgs = {}>(
      args?: Subset<T, SaleorAppArgs>,
    ): CheckSelect<
      T,
      Prisma__SaleorAppClient<SaleorApp | null>,
      Prisma__SaleorAppClient<SaleorAppGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * InstalledSaleorApp findUnique
   */
  export type InstalledSaleorAppFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the InstalledSaleorApp
     *
     **/
    select?: InstalledSaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: InstalledSaleorAppInclude | null;
    /**
     * Throw an Error if a InstalledSaleorApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which InstalledSaleorApp to fetch.
     *
     **/
    where: InstalledSaleorAppWhereUniqueInput;
  };

  /**
   * InstalledSaleorApp findFirst
   */
  export type InstalledSaleorAppFindFirstArgs = {
    /**
     * Select specific fields to fetch from the InstalledSaleorApp
     *
     **/
    select?: InstalledSaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: InstalledSaleorAppInclude | null;
    /**
     * Throw an Error if a InstalledSaleorApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which InstalledSaleorApp to fetch.
     *
     **/
    where?: InstalledSaleorAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InstalledSaleorApps to fetch.
     *
     **/
    orderBy?: Enumerable<InstalledSaleorAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InstalledSaleorApps.
     *
     **/
    cursor?: InstalledSaleorAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InstalledSaleorApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InstalledSaleorApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InstalledSaleorApps.
     *
     **/
    distinct?: Enumerable<InstalledSaleorAppScalarFieldEnum>;
  };

  /**
   * InstalledSaleorApp findMany
   */
  export type InstalledSaleorAppFindManyArgs = {
    /**
     * Select specific fields to fetch from the InstalledSaleorApp
     *
     **/
    select?: InstalledSaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: InstalledSaleorAppInclude | null;
    /**
     * Filter, which InstalledSaleorApps to fetch.
     *
     **/
    where?: InstalledSaleorAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InstalledSaleorApps to fetch.
     *
     **/
    orderBy?: Enumerable<InstalledSaleorAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing InstalledSaleorApps.
     *
     **/
    cursor?: InstalledSaleorAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InstalledSaleorApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InstalledSaleorApps.
     *
     **/
    skip?: number;
    distinct?: Enumerable<InstalledSaleorAppScalarFieldEnum>;
  };

  /**
   * InstalledSaleorApp create
   */
  export type InstalledSaleorAppCreateArgs = {
    /**
     * Select specific fields to fetch from the InstalledSaleorApp
     *
     **/
    select?: InstalledSaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: InstalledSaleorAppInclude | null;
    /**
     * The data needed to create a InstalledSaleorApp.
     *
     **/
    data: XOR<
      InstalledSaleorAppCreateInput,
      InstalledSaleorAppUncheckedCreateInput
    >;
  };

  /**
   * InstalledSaleorApp createMany
   */
  export type InstalledSaleorAppCreateManyArgs = {
    data: Enumerable<InstalledSaleorAppCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * InstalledSaleorApp update
   */
  export type InstalledSaleorAppUpdateArgs = {
    /**
     * Select specific fields to fetch from the InstalledSaleorApp
     *
     **/
    select?: InstalledSaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: InstalledSaleorAppInclude | null;
    /**
     * The data needed to update a InstalledSaleorApp.
     *
     **/
    data: XOR<
      InstalledSaleorAppUpdateInput,
      InstalledSaleorAppUncheckedUpdateInput
    >;
    /**
     * Choose, which InstalledSaleorApp to update.
     *
     **/
    where: InstalledSaleorAppWhereUniqueInput;
  };

  /**
   * InstalledSaleorApp updateMany
   */
  export type InstalledSaleorAppUpdateManyArgs = {
    data: XOR<
      InstalledSaleorAppUpdateManyMutationInput,
      InstalledSaleorAppUncheckedUpdateManyInput
    >;
    where?: InstalledSaleorAppWhereInput;
  };

  /**
   * InstalledSaleorApp upsert
   */
  export type InstalledSaleorAppUpsertArgs = {
    /**
     * Select specific fields to fetch from the InstalledSaleorApp
     *
     **/
    select?: InstalledSaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: InstalledSaleorAppInclude | null;
    /**
     * The filter to search for the InstalledSaleorApp to update in case it exists.
     *
     **/
    where: InstalledSaleorAppWhereUniqueInput;
    /**
     * In case the InstalledSaleorApp found by the `where` argument doesn't exist, create a new InstalledSaleorApp with this data.
     *
     **/
    create: XOR<
      InstalledSaleorAppCreateInput,
      InstalledSaleorAppUncheckedCreateInput
    >;
    /**
     * In case the InstalledSaleorApp was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      InstalledSaleorAppUpdateInput,
      InstalledSaleorAppUncheckedUpdateInput
    >;
  };

  /**
   * InstalledSaleorApp delete
   */
  export type InstalledSaleorAppDeleteArgs = {
    /**
     * Select specific fields to fetch from the InstalledSaleorApp
     *
     **/
    select?: InstalledSaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: InstalledSaleorAppInclude | null;
    /**
     * Filter which InstalledSaleorApp to delete.
     *
     **/
    where: InstalledSaleorAppWhereUniqueInput;
  };

  /**
   * InstalledSaleorApp deleteMany
   */
  export type InstalledSaleorAppDeleteManyArgs = {
    where?: InstalledSaleorAppWhereInput;
  };

  /**
   * InstalledSaleorApp without action
   */
  export type InstalledSaleorAppArgs = {
    /**
     * Select specific fields to fetch from the InstalledSaleorApp
     *
     **/
    select?: InstalledSaleorAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: InstalledSaleorAppInclude | null;
  };

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
  };

  export type TenantMinAggregateOutputType = {
    id: string | null;
    name: string | null;
  };

  export type TenantMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
  };

  export type TenantCountAggregateOutputType = {
    id: number;
    name: number;
    _all: number;
  };

  export type TenantMinAggregateInputType = {
    id?: true;
    name?: true;
  };

  export type TenantMaxAggregateInputType = {
    id?: true;
    name?: true;
  };

  export type TenantCountAggregateInputType = {
    id?: true;
    name?: true;
    _all?: true;
  };

  export type TenantAggregateArgs = {
    /**
     * Filter which Tenant to aggregate.
     *
     **/
    where?: TenantWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tenants to fetch.
     *
     **/
    orderBy?: Enumerable<TenantOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: TenantWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tenants from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tenants.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Tenants
     **/
    _count?: true | TenantCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TenantMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TenantMaxAggregateInputType;
  };

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
    [P in keyof T & keyof AggregateTenant]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>;
  };

  export type TenantGroupByArgs = {
    where?: TenantWhereInput;
    orderBy?: Enumerable<TenantOrderByWithAggregationInput>;
    by: Array<TenantScalarFieldEnum>;
    having?: TenantScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TenantCountAggregateInputType | true;
    _min?: TenantMinAggregateInputType;
    _max?: TenantMaxAggregateInputType;
  };

  export type TenantGroupByOutputType = {
    id: string;
    name: string;
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
  };

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Promise<
    Array<
      PickArray<TenantGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof TenantGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
          : GetScalarType<T[P], TenantGroupByOutputType[P]>;
      }
    >
  >;

  export type TenantSelect = {
    id?: boolean;
    name?: boolean;
    Subscriptions?: boolean | SubscriptionFindManyArgs;
    saleorApps?: boolean | SaleorAppFindManyArgs;
    zohoApps?: boolean | ZohoAppFindManyArgs;
    productdatafeedApps?: boolean | ProductDataFeedAppFindManyArgs;
    strapiApps?: boolean | StrapiAppFindManyArgs;
    productDataFeedIntegration?:
      | boolean
      | ProductDataFeedIntegrationFindManyArgs;
    strapiToZohoIntegration?: boolean | StrapiToZohoIntegrationFindManyArgs;
    logisticsIntegration?: boolean | LogisticsIntegrationFindManyArgs;
    logisticsApp?: boolean | LogisticsAppFindManyArgs;
    _count?: boolean | TenantCountOutputTypeArgs;
  };

  export type TenantInclude = {
    Subscriptions?: boolean | SubscriptionFindManyArgs;
    saleorApps?: boolean | SaleorAppFindManyArgs;
    zohoApps?: boolean | ZohoAppFindManyArgs;
    productdatafeedApps?: boolean | ProductDataFeedAppFindManyArgs;
    strapiApps?: boolean | StrapiAppFindManyArgs;
    productDataFeedIntegration?:
      | boolean
      | ProductDataFeedIntegrationFindManyArgs;
    strapiToZohoIntegration?: boolean | StrapiToZohoIntegrationFindManyArgs;
    logisticsIntegration?: boolean | LogisticsIntegrationFindManyArgs;
    logisticsApp?: boolean | LogisticsAppFindManyArgs;
    _count?: boolean | TenantCountOutputTypeArgs;
  };

  export type TenantGetPayload<
    S extends boolean | null | undefined | TenantArgs,
    U = keyof S,
  > = S extends true
    ? Tenant
    : S extends undefined
    ? never
    : S extends TenantArgs | TenantFindManyArgs
    ? "include" extends U
      ? Tenant & {
          [P in TrueKeys<S["include"]>]: P extends "Subscriptions"
            ? Array<SubscriptionGetPayload<S["include"][P]>>
            : P extends "saleorApps"
            ? Array<SaleorAppGetPayload<S["include"][P]>>
            : P extends "zohoApps"
            ? Array<ZohoAppGetPayload<S["include"][P]>>
            : P extends "productdatafeedApps"
            ? Array<ProductDataFeedAppGetPayload<S["include"][P]>>
            : P extends "strapiApps"
            ? Array<StrapiAppGetPayload<S["include"][P]>>
            : P extends "productDataFeedIntegration"
            ? Array<ProductDataFeedIntegrationGetPayload<S["include"][P]>>
            : P extends "strapiToZohoIntegration"
            ? Array<StrapiToZohoIntegrationGetPayload<S["include"][P]>>
            : P extends "logisticsIntegration"
            ? Array<LogisticsIntegrationGetPayload<S["include"][P]>>
            : P extends "logisticsApp"
            ? Array<LogisticsAppGetPayload<S["include"][P]>>
            : P extends "_count"
            ? TenantCountOutputTypeGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof Tenant
            ? Tenant[P]
            : P extends "Subscriptions"
            ? Array<SubscriptionGetPayload<S["select"][P]>>
            : P extends "saleorApps"
            ? Array<SaleorAppGetPayload<S["select"][P]>>
            : P extends "zohoApps"
            ? Array<ZohoAppGetPayload<S["select"][P]>>
            : P extends "productdatafeedApps"
            ? Array<ProductDataFeedAppGetPayload<S["select"][P]>>
            : P extends "strapiApps"
            ? Array<StrapiAppGetPayload<S["select"][P]>>
            : P extends "productDataFeedIntegration"
            ? Array<ProductDataFeedIntegrationGetPayload<S["select"][P]>>
            : P extends "strapiToZohoIntegration"
            ? Array<StrapiToZohoIntegrationGetPayload<S["select"][P]>>
            : P extends "logisticsIntegration"
            ? Array<LogisticsIntegrationGetPayload<S["select"][P]>>
            : P extends "logisticsApp"
            ? Array<LogisticsAppGetPayload<S["select"][P]>>
            : P extends "_count"
            ? TenantCountOutputTypeGetPayload<S["select"][P]>
            : never;
        }
      : Tenant
    : Tenant;

  type TenantCountArgs = Merge<
    Omit<TenantFindManyArgs, "select" | "include"> & {
      select?: TenantCountAggregateInputType | true;
    }
  >;

  export interface TenantDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends TenantFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, TenantFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "Tenant"
    > extends True
      ? CheckSelect<
          T,
          Prisma__TenantClient<Tenant>,
          Prisma__TenantClient<TenantGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__TenantClient<Tenant | null>,
          Prisma__TenantClient<TenantGetPayload<T> | null>
        >;

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends TenantFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, TenantFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "Tenant"
    > extends True
      ? CheckSelect<
          T,
          Prisma__TenantClient<Tenant>,
          Prisma__TenantClient<TenantGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__TenantClient<Tenant | null>,
          Prisma__TenantClient<TenantGetPayload<T> | null>
        >;

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     *
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends TenantFindManyArgs>(
      args?: SelectSubset<T, TenantFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<Tenant>>,
      PrismaPromise<Array<TenantGetPayload<T>>>
    >;

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     *
     **/
    create<T extends TenantCreateArgs>(
      args: SelectSubset<T, TenantCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant>,
      Prisma__TenantClient<TenantGetPayload<T>>
    >;

    /**
     * Create many Tenants.
     *     @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     *     @example
     *     // Create many Tenants
     *     const tenant = await prisma.tenant.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends TenantCreateManyArgs>(
      args?: SelectSubset<T, TenantCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     *
     **/
    delete<T extends TenantDeleteArgs>(
      args: SelectSubset<T, TenantDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant>,
      Prisma__TenantClient<TenantGetPayload<T>>
    >;

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends TenantUpdateArgs>(
      args: SelectSubset<T, TenantUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant>,
      Prisma__TenantClient<TenantGetPayload<T>>
    >;

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends TenantDeleteManyArgs>(
      args?: SelectSubset<T, TenantDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends TenantUpdateManyArgs>(
      args: SelectSubset<T, TenantUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     **/
    upsert<T extends TenantUpsertArgs>(
      args: SelectSubset<T, TenantUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant>,
      Prisma__TenantClient<TenantGetPayload<T>>
    >;

    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
     **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], TenantCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TenantAggregateArgs>(
      args: Subset<T, TenantAggregateArgs>,
    ): PrismaPromise<GetTenantAggregateType<T>>;

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs["orderBy"] }
        : { orderBy?: TenantGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetTenantGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TenantClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    Subscriptions<T extends SubscriptionFindManyArgs = {}>(
      args?: Subset<T, SubscriptionFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<Subscription>>,
      PrismaPromise<Array<SubscriptionGetPayload<T>>>
    >;

    saleorApps<T extends SaleorAppFindManyArgs = {}>(
      args?: Subset<T, SaleorAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<SaleorApp>>,
      PrismaPromise<Array<SaleorAppGetPayload<T>>>
    >;

    zohoApps<T extends ZohoAppFindManyArgs = {}>(
      args?: Subset<T, ZohoAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<ZohoApp>>,
      PrismaPromise<Array<ZohoAppGetPayload<T>>>
    >;

    productdatafeedApps<T extends ProductDataFeedAppFindManyArgs = {}>(
      args?: Subset<T, ProductDataFeedAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<ProductDataFeedApp>>,
      PrismaPromise<Array<ProductDataFeedAppGetPayload<T>>>
    >;

    strapiApps<T extends StrapiAppFindManyArgs = {}>(
      args?: Subset<T, StrapiAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<StrapiApp>>,
      PrismaPromise<Array<StrapiAppGetPayload<T>>>
    >;

    productDataFeedIntegration<
      T extends ProductDataFeedIntegrationFindManyArgs = {},
    >(
      args?: Subset<T, ProductDataFeedIntegrationFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<ProductDataFeedIntegration>>,
      PrismaPromise<Array<ProductDataFeedIntegrationGetPayload<T>>>
    >;

    strapiToZohoIntegration<T extends StrapiToZohoIntegrationFindManyArgs = {}>(
      args?: Subset<T, StrapiToZohoIntegrationFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<StrapiToZohoIntegration>>,
      PrismaPromise<Array<StrapiToZohoIntegrationGetPayload<T>>>
    >;

    logisticsIntegration<T extends LogisticsIntegrationFindManyArgs = {}>(
      args?: Subset<T, LogisticsIntegrationFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<LogisticsIntegration>>,
      PrismaPromise<Array<LogisticsIntegrationGetPayload<T>>>
    >;

    logisticsApp<T extends LogisticsAppFindManyArgs = {}>(
      args?: Subset<T, LogisticsAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<LogisticsApp>>,
      PrismaPromise<Array<LogisticsAppGetPayload<T>>>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * Throw an Error if a Tenant can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which Tenant to fetch.
     *
     **/
    where: TenantWhereUniqueInput;
  };

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * Throw an Error if a Tenant can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which Tenant to fetch.
     *
     **/
    where?: TenantWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tenants to fetch.
     *
     **/
    orderBy?: Enumerable<TenantOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Tenants.
     *
     **/
    cursor?: TenantWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tenants from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tenants.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Tenants.
     *
     **/
    distinct?: Enumerable<TenantScalarFieldEnum>;
  };

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * Filter, which Tenants to fetch.
     *
     **/
    where?: TenantWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tenants to fetch.
     *
     **/
    orderBy?: Enumerable<TenantOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Tenants.
     *
     **/
    cursor?: TenantWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tenants from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tenants.
     *
     **/
    skip?: number;
    distinct?: Enumerable<TenantScalarFieldEnum>;
  };

  /**
   * Tenant create
   */
  export type TenantCreateArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * The data needed to create a Tenant.
     *
     **/
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>;
  };

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs = {
    data: Enumerable<TenantCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * Tenant update
   */
  export type TenantUpdateArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * The data needed to update a Tenant.
     *
     **/
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>;
    /**
     * Choose, which Tenant to update.
     *
     **/
    where: TenantWhereUniqueInput;
  };

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs = {
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>;
    where?: TenantWhereInput;
  };

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * The filter to search for the Tenant to update in case it exists.
     *
     **/
    where: TenantWhereUniqueInput;
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     *
     **/
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>;
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>;
  };

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
    /**
     * Filter which Tenant to delete.
     *
     **/
    where: TenantWhereUniqueInput;
  };

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs = {
    where?: TenantWhereInput;
  };

  /**
   * Tenant without action
   */
  export type TenantArgs = {
    /**
     * Select specific fields to fetch from the Tenant
     *
     **/
    select?: TenantSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: TenantInclude | null;
  };

  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null;
    _min: SubscriptionMinAggregateOutputType | null;
    _max: SubscriptionMaxAggregateOutputType | null;
  };

  export type SubscriptionMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    payedUntil: Date | null;
  };

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    payedUntil: Date | null;
  };

  export type SubscriptionCountAggregateOutputType = {
    id: number;
    tenantId: number;
    payedUntil: number;
    _all: number;
  };

  export type SubscriptionMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    payedUntil?: true;
  };

  export type SubscriptionMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    payedUntil?: true;
  };

  export type SubscriptionCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    payedUntil?: true;
    _all?: true;
  };

  export type SubscriptionAggregateArgs = {
    /**
     * Filter which Subscription to aggregate.
     *
     **/
    where?: SubscriptionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Subscriptions to fetch.
     *
     **/
    orderBy?: Enumerable<SubscriptionOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: SubscriptionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Subscriptions from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Subscriptions.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Subscriptions
     **/
    _count?: true | SubscriptionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SubscriptionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SubscriptionMaxAggregateInputType;
  };

  export type GetSubscriptionAggregateType<
    T extends SubscriptionAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateSubscription]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>;
  };

  export type SubscriptionGroupByArgs = {
    where?: SubscriptionWhereInput;
    orderBy?: Enumerable<SubscriptionOrderByWithAggregationInput>;
    by: Array<SubscriptionScalarFieldEnum>;
    having?: SubscriptionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubscriptionCountAggregateInputType | true;
    _min?: SubscriptionMinAggregateInputType;
    _max?: SubscriptionMaxAggregateInputType;
  };

  export type SubscriptionGroupByOutputType = {
    id: string;
    tenantId: string;
    payedUntil: Date | null;
    _count: SubscriptionCountAggregateOutputType | null;
    _min: SubscriptionMinAggregateOutputType | null;
    _max: SubscriptionMaxAggregateOutputType | null;
  };

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> =
    Promise<
      Array<
        PickArray<SubscriptionGroupByOutputType, T["by"]> & {
          [P in keyof T &
            keyof SubscriptionGroupByOutputType]: P extends "_count"
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>;
        }
      >
    >;

  export type SubscriptionSelect = {
    id?: boolean;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    payedUntil?: boolean;
    productDataFeedIntegration?: boolean | ProductDataFeedIntegrationArgs;
    strapiToZohoIntegration?: boolean | StrapiToZohoIntegrationArgs;
    logisticsIntegration?: boolean | LogisticsIntegrationArgs;
  };

  export type SubscriptionInclude = {
    tenant?: boolean | TenantArgs;
    productDataFeedIntegration?: boolean | ProductDataFeedIntegrationArgs;
    strapiToZohoIntegration?: boolean | StrapiToZohoIntegrationArgs;
    logisticsIntegration?: boolean | LogisticsIntegrationArgs;
  };

  export type SubscriptionGetPayload<
    S extends boolean | null | undefined | SubscriptionArgs,
    U = keyof S,
  > = S extends true
    ? Subscription
    : S extends undefined
    ? never
    : S extends SubscriptionArgs | SubscriptionFindManyArgs
    ? "include" extends U
      ? Subscription & {
          [P in TrueKeys<S["include"]>]: P extends "tenant"
            ? TenantGetPayload<S["include"][P]>
            : P extends "productDataFeedIntegration"
            ? ProductDataFeedIntegrationGetPayload<S["include"][P]> | null
            : P extends "strapiToZohoIntegration"
            ? StrapiToZohoIntegrationGetPayload<S["include"][P]> | null
            : P extends "logisticsIntegration"
            ? LogisticsIntegrationGetPayload<S["include"][P]> | null
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof Subscription
            ? Subscription[P]
            : P extends "tenant"
            ? TenantGetPayload<S["select"][P]>
            : P extends "productDataFeedIntegration"
            ? ProductDataFeedIntegrationGetPayload<S["select"][P]> | null
            : P extends "strapiToZohoIntegration"
            ? StrapiToZohoIntegrationGetPayload<S["select"][P]> | null
            : P extends "logisticsIntegration"
            ? LogisticsIntegrationGetPayload<S["select"][P]> | null
            : never;
        }
      : Subscription
    : Subscription;

  type SubscriptionCountArgs = Merge<
    Omit<SubscriptionFindManyArgs, "select" | "include"> & {
      select?: SubscriptionCountAggregateInputType | true;
    }
  >;

  export interface SubscriptionDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends SubscriptionFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, SubscriptionFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "Subscription"
    > extends True
      ? CheckSelect<
          T,
          Prisma__SubscriptionClient<Subscription>,
          Prisma__SubscriptionClient<SubscriptionGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__SubscriptionClient<Subscription | null>,
          Prisma__SubscriptionClient<SubscriptionGetPayload<T> | null>
        >;

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends SubscriptionFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, SubscriptionFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "Subscription"
    > extends True
      ? CheckSelect<
          T,
          Prisma__SubscriptionClient<Subscription>,
          Prisma__SubscriptionClient<SubscriptionGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__SubscriptionClient<Subscription | null>,
          Prisma__SubscriptionClient<SubscriptionGetPayload<T> | null>
        >;

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     *
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends SubscriptionFindManyArgs>(
      args?: SelectSubset<T, SubscriptionFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<Subscription>>,
      PrismaPromise<Array<SubscriptionGetPayload<T>>>
    >;

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     *
     **/
    create<T extends SubscriptionCreateArgs>(
      args: SelectSubset<T, SubscriptionCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__SubscriptionClient<Subscription>,
      Prisma__SubscriptionClient<SubscriptionGetPayload<T>>
    >;

    /**
     * Create many Subscriptions.
     *     @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     *     @example
     *     // Create many Subscriptions
     *     const subscription = await prisma.subscription.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends SubscriptionCreateManyArgs>(
      args?: SelectSubset<T, SubscriptionCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     *
     **/
    delete<T extends SubscriptionDeleteArgs>(
      args: SelectSubset<T, SubscriptionDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__SubscriptionClient<Subscription>,
      Prisma__SubscriptionClient<SubscriptionGetPayload<T>>
    >;

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends SubscriptionUpdateArgs>(
      args: SelectSubset<T, SubscriptionUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__SubscriptionClient<Subscription>,
      Prisma__SubscriptionClient<SubscriptionGetPayload<T>>
    >;

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends SubscriptionDeleteManyArgs>(
      args?: SelectSubset<T, SubscriptionDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends SubscriptionUpdateManyArgs>(
      args: SelectSubset<T, SubscriptionUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     **/
    upsert<T extends SubscriptionUpsertArgs>(
      args: SelectSubset<T, SubscriptionUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__SubscriptionClient<Subscription>,
      Prisma__SubscriptionClient<SubscriptionGetPayload<T>>
    >;

    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
     **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], SubscriptionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SubscriptionAggregateArgs>(
      args: Subset<T, SubscriptionAggregateArgs>,
    ): PrismaPromise<GetSubscriptionAggregateType<T>>;

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs["orderBy"] }
        : { orderBy?: SubscriptionGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetSubscriptionGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SubscriptionClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    productDataFeedIntegration<T extends ProductDataFeedIntegrationArgs = {}>(
      args?: Subset<T, ProductDataFeedIntegrationArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegration | null>,
      Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegrationGetPayload<T> | null>
    >;

    strapiToZohoIntegration<T extends StrapiToZohoIntegrationArgs = {}>(
      args?: Subset<T, StrapiToZohoIntegrationArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegration | null>,
      Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegrationGetPayload<T> | null>
    >;

    logisticsIntegration<T extends LogisticsIntegrationArgs = {}>(
      args?: Subset<T, LogisticsIntegrationArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsIntegrationClient<LogisticsIntegration | null>,
      Prisma__LogisticsIntegrationClient<LogisticsIntegrationGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the Subscription
     *
     **/
    select?: SubscriptionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SubscriptionInclude | null;
    /**
     * Throw an Error if a Subscription can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which Subscription to fetch.
     *
     **/
    where: SubscriptionWhereUniqueInput;
  };

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs = {
    /**
     * Select specific fields to fetch from the Subscription
     *
     **/
    select?: SubscriptionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SubscriptionInclude | null;
    /**
     * Throw an Error if a Subscription can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which Subscription to fetch.
     *
     **/
    where?: SubscriptionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Subscriptions to fetch.
     *
     **/
    orderBy?: Enumerable<SubscriptionOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Subscriptions.
     *
     **/
    cursor?: SubscriptionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Subscriptions from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Subscriptions.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Subscriptions.
     *
     **/
    distinct?: Enumerable<SubscriptionScalarFieldEnum>;
  };

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs = {
    /**
     * Select specific fields to fetch from the Subscription
     *
     **/
    select?: SubscriptionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SubscriptionInclude | null;
    /**
     * Filter, which Subscriptions to fetch.
     *
     **/
    where?: SubscriptionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Subscriptions to fetch.
     *
     **/
    orderBy?: Enumerable<SubscriptionOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Subscriptions.
     *
     **/
    cursor?: SubscriptionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Subscriptions from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Subscriptions.
     *
     **/
    skip?: number;
    distinct?: Enumerable<SubscriptionScalarFieldEnum>;
  };

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs = {
    /**
     * Select specific fields to fetch from the Subscription
     *
     **/
    select?: SubscriptionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SubscriptionInclude | null;
    /**
     * The data needed to create a Subscription.
     *
     **/
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>;
  };

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs = {
    data: Enumerable<SubscriptionCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs = {
    /**
     * Select specific fields to fetch from the Subscription
     *
     **/
    select?: SubscriptionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SubscriptionInclude | null;
    /**
     * The data needed to update a Subscription.
     *
     **/
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>;
    /**
     * Choose, which Subscription to update.
     *
     **/
    where: SubscriptionWhereUniqueInput;
  };

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs = {
    data: XOR<
      SubscriptionUpdateManyMutationInput,
      SubscriptionUncheckedUpdateManyInput
    >;
    where?: SubscriptionWhereInput;
  };

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs = {
    /**
     * Select specific fields to fetch from the Subscription
     *
     **/
    select?: SubscriptionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SubscriptionInclude | null;
    /**
     * The filter to search for the Subscription to update in case it exists.
     *
     **/
    where: SubscriptionWhereUniqueInput;
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     *
     **/
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>;
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>;
  };

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs = {
    /**
     * Select specific fields to fetch from the Subscription
     *
     **/
    select?: SubscriptionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SubscriptionInclude | null;
    /**
     * Filter which Subscription to delete.
     *
     **/
    where: SubscriptionWhereUniqueInput;
  };

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs = {
    where?: SubscriptionWhereInput;
  };

  /**
   * Subscription without action
   */
  export type SubscriptionArgs = {
    /**
     * Select specific fields to fetch from the Subscription
     *
     **/
    select?: SubscriptionSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SubscriptionInclude | null;
  };

  /**
   * Model ProductDataFeedIntegration
   */

  export type AggregateProductDataFeedIntegration = {
    _count: ProductDataFeedIntegrationCountAggregateOutputType | null;
    _min: ProductDataFeedIntegrationMinAggregateOutputType | null;
    _max: ProductDataFeedIntegrationMaxAggregateOutputType | null;
  };

  export type ProductDataFeedIntegrationMinAggregateOutputType = {
    id: string | null;
    enabled: boolean | null;
    subscriptionId: string | null;
    tenantId: string | null;
    productDataFeedAppId: string | null;
    saleorAppId: string | null;
  };

  export type ProductDataFeedIntegrationMaxAggregateOutputType = {
    id: string | null;
    enabled: boolean | null;
    subscriptionId: string | null;
    tenantId: string | null;
    productDataFeedAppId: string | null;
    saleorAppId: string | null;
  };

  export type ProductDataFeedIntegrationCountAggregateOutputType = {
    id: number;
    enabled: number;
    subscriptionId: number;
    tenantId: number;
    productDataFeedAppId: number;
    saleorAppId: number;
    _all: number;
  };

  export type ProductDataFeedIntegrationMinAggregateInputType = {
    id?: true;
    enabled?: true;
    subscriptionId?: true;
    tenantId?: true;
    productDataFeedAppId?: true;
    saleorAppId?: true;
  };

  export type ProductDataFeedIntegrationMaxAggregateInputType = {
    id?: true;
    enabled?: true;
    subscriptionId?: true;
    tenantId?: true;
    productDataFeedAppId?: true;
    saleorAppId?: true;
  };

  export type ProductDataFeedIntegrationCountAggregateInputType = {
    id?: true;
    enabled?: true;
    subscriptionId?: true;
    tenantId?: true;
    productDataFeedAppId?: true;
    saleorAppId?: true;
    _all?: true;
  };

  export type ProductDataFeedIntegrationAggregateArgs = {
    /**
     * Filter which ProductDataFeedIntegration to aggregate.
     *
     **/
    where?: ProductDataFeedIntegrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductDataFeedIntegrations to fetch.
     *
     **/
    orderBy?: Enumerable<ProductDataFeedIntegrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: ProductDataFeedIntegrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductDataFeedIntegrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductDataFeedIntegrations.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProductDataFeedIntegrations
     **/
    _count?: true | ProductDataFeedIntegrationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProductDataFeedIntegrationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProductDataFeedIntegrationMaxAggregateInputType;
  };

  export type GetProductDataFeedIntegrationAggregateType<
    T extends ProductDataFeedIntegrationAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateProductDataFeedIntegration]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductDataFeedIntegration[P]>
      : GetScalarType<T[P], AggregateProductDataFeedIntegration[P]>;
  };

  export type ProductDataFeedIntegrationGroupByArgs = {
    where?: ProductDataFeedIntegrationWhereInput;
    orderBy?: Enumerable<ProductDataFeedIntegrationOrderByWithAggregationInput>;
    by: Array<ProductDataFeedIntegrationScalarFieldEnum>;
    having?: ProductDataFeedIntegrationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductDataFeedIntegrationCountAggregateInputType | true;
    _min?: ProductDataFeedIntegrationMinAggregateInputType;
    _max?: ProductDataFeedIntegrationMaxAggregateInputType;
  };

  export type ProductDataFeedIntegrationGroupByOutputType = {
    id: string;
    enabled: boolean;
    subscriptionId: string | null;
    tenantId: string;
    productDataFeedAppId: string;
    saleorAppId: string;
    _count: ProductDataFeedIntegrationCountAggregateOutputType | null;
    _min: ProductDataFeedIntegrationMinAggregateOutputType | null;
    _max: ProductDataFeedIntegrationMaxAggregateOutputType | null;
  };

  type GetProductDataFeedIntegrationGroupByPayload<
    T extends ProductDataFeedIntegrationGroupByArgs,
  > = Promise<
    Array<
      PickArray<ProductDataFeedIntegrationGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof ProductDataFeedIntegrationGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<
                T[P],
                ProductDataFeedIntegrationGroupByOutputType[P]
              >
          : GetScalarType<T[P], ProductDataFeedIntegrationGroupByOutputType[P]>;
      }
    >
  >;

  export type ProductDataFeedIntegrationSelect = {
    id?: boolean;
    enabled?: boolean;
    subscription?: boolean | SubscriptionArgs;
    subscriptionId?: boolean;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    productDataFeedApp?: boolean | ProductDataFeedAppArgs;
    productDataFeedAppId?: boolean;
    saleorApp?: boolean | SaleorAppArgs;
    saleorAppId?: boolean;
  };

  export type ProductDataFeedIntegrationInclude = {
    subscription?: boolean | SubscriptionArgs;
    tenant?: boolean | TenantArgs;
    productDataFeedApp?: boolean | ProductDataFeedAppArgs;
    saleorApp?: boolean | SaleorAppArgs;
  };

  export type ProductDataFeedIntegrationGetPayload<
    S extends boolean | null | undefined | ProductDataFeedIntegrationArgs,
    U = keyof S,
  > = S extends true
    ? ProductDataFeedIntegration
    : S extends undefined
    ? never
    : S extends
        | ProductDataFeedIntegrationArgs
        | ProductDataFeedIntegrationFindManyArgs
    ? "include" extends U
      ? ProductDataFeedIntegration & {
          [P in TrueKeys<S["include"]>]: P extends "subscription"
            ? SubscriptionGetPayload<S["include"][P]> | null
            : P extends "tenant"
            ? TenantGetPayload<S["include"][P]>
            : P extends "productDataFeedApp"
            ? ProductDataFeedAppGetPayload<S["include"][P]>
            : P extends "saleorApp"
            ? SaleorAppGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<
            S["select"]
          >]: P extends keyof ProductDataFeedIntegration
            ? ProductDataFeedIntegration[P]
            : P extends "subscription"
            ? SubscriptionGetPayload<S["select"][P]> | null
            : P extends "tenant"
            ? TenantGetPayload<S["select"][P]>
            : P extends "productDataFeedApp"
            ? ProductDataFeedAppGetPayload<S["select"][P]>
            : P extends "saleorApp"
            ? SaleorAppGetPayload<S["select"][P]>
            : never;
        }
      : ProductDataFeedIntegration
    : ProductDataFeedIntegration;

  type ProductDataFeedIntegrationCountArgs = Merge<
    Omit<ProductDataFeedIntegrationFindManyArgs, "select" | "include"> & {
      select?: ProductDataFeedIntegrationCountAggregateInputType | true;
    }
  >;

  export interface ProductDataFeedIntegrationDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one ProductDataFeedIntegration that matches the filter.
     * @param {ProductDataFeedIntegrationFindUniqueArgs} args - Arguments to find a ProductDataFeedIntegration
     * @example
     * // Get one ProductDataFeedIntegration
     * const productDataFeedIntegration = await prisma.productDataFeedIntegration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends ProductDataFeedIntegrationFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, ProductDataFeedIntegrationFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "ProductDataFeedIntegration"
    > extends True
      ? CheckSelect<
          T,
          Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegration>,
          Prisma__ProductDataFeedIntegrationClient<
            ProductDataFeedIntegrationGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegration | null>,
          Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegrationGetPayload<T> | null>
        >;

    /**
     * Find the first ProductDataFeedIntegration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedIntegrationFindFirstArgs} args - Arguments to find a ProductDataFeedIntegration
     * @example
     * // Get one ProductDataFeedIntegration
     * const productDataFeedIntegration = await prisma.productDataFeedIntegration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends ProductDataFeedIntegrationFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, ProductDataFeedIntegrationFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "ProductDataFeedIntegration"
    > extends True
      ? CheckSelect<
          T,
          Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegration>,
          Prisma__ProductDataFeedIntegrationClient<
            ProductDataFeedIntegrationGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegration | null>,
          Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegrationGetPayload<T> | null>
        >;

    /**
     * Find zero or more ProductDataFeedIntegrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedIntegrationFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductDataFeedIntegrations
     * const productDataFeedIntegrations = await prisma.productDataFeedIntegration.findMany()
     *
     * // Get first 10 ProductDataFeedIntegrations
     * const productDataFeedIntegrations = await prisma.productDataFeedIntegration.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const productDataFeedIntegrationWithIdOnly = await prisma.productDataFeedIntegration.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends ProductDataFeedIntegrationFindManyArgs>(
      args?: SelectSubset<T, ProductDataFeedIntegrationFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<ProductDataFeedIntegration>>,
      PrismaPromise<Array<ProductDataFeedIntegrationGetPayload<T>>>
    >;

    /**
     * Create a ProductDataFeedIntegration.
     * @param {ProductDataFeedIntegrationCreateArgs} args - Arguments to create a ProductDataFeedIntegration.
     * @example
     * // Create one ProductDataFeedIntegration
     * const ProductDataFeedIntegration = await prisma.productDataFeedIntegration.create({
     *   data: {
     *     // ... data to create a ProductDataFeedIntegration
     *   }
     * })
     *
     **/
    create<T extends ProductDataFeedIntegrationCreateArgs>(
      args: SelectSubset<T, ProductDataFeedIntegrationCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegration>,
      Prisma__ProductDataFeedIntegrationClient<
        ProductDataFeedIntegrationGetPayload<T>
      >
    >;

    /**
     * Create many ProductDataFeedIntegrations.
     *     @param {ProductDataFeedIntegrationCreateManyArgs} args - Arguments to create many ProductDataFeedIntegrations.
     *     @example
     *     // Create many ProductDataFeedIntegrations
     *     const productDataFeedIntegration = await prisma.productDataFeedIntegration.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends ProductDataFeedIntegrationCreateManyArgs>(
      args?: SelectSubset<T, ProductDataFeedIntegrationCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a ProductDataFeedIntegration.
     * @param {ProductDataFeedIntegrationDeleteArgs} args - Arguments to delete one ProductDataFeedIntegration.
     * @example
     * // Delete one ProductDataFeedIntegration
     * const ProductDataFeedIntegration = await prisma.productDataFeedIntegration.delete({
     *   where: {
     *     // ... filter to delete one ProductDataFeedIntegration
     *   }
     * })
     *
     **/
    delete<T extends ProductDataFeedIntegrationDeleteArgs>(
      args: SelectSubset<T, ProductDataFeedIntegrationDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegration>,
      Prisma__ProductDataFeedIntegrationClient<
        ProductDataFeedIntegrationGetPayload<T>
      >
    >;

    /**
     * Update one ProductDataFeedIntegration.
     * @param {ProductDataFeedIntegrationUpdateArgs} args - Arguments to update one ProductDataFeedIntegration.
     * @example
     * // Update one ProductDataFeedIntegration
     * const productDataFeedIntegration = await prisma.productDataFeedIntegration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends ProductDataFeedIntegrationUpdateArgs>(
      args: SelectSubset<T, ProductDataFeedIntegrationUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegration>,
      Prisma__ProductDataFeedIntegrationClient<
        ProductDataFeedIntegrationGetPayload<T>
      >
    >;

    /**
     * Delete zero or more ProductDataFeedIntegrations.
     * @param {ProductDataFeedIntegrationDeleteManyArgs} args - Arguments to filter ProductDataFeedIntegrations to delete.
     * @example
     * // Delete a few ProductDataFeedIntegrations
     * const { count } = await prisma.productDataFeedIntegration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends ProductDataFeedIntegrationDeleteManyArgs>(
      args?: SelectSubset<T, ProductDataFeedIntegrationDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ProductDataFeedIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedIntegrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductDataFeedIntegrations
     * const productDataFeedIntegration = await prisma.productDataFeedIntegration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends ProductDataFeedIntegrationUpdateManyArgs>(
      args: SelectSubset<T, ProductDataFeedIntegrationUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one ProductDataFeedIntegration.
     * @param {ProductDataFeedIntegrationUpsertArgs} args - Arguments to update or create a ProductDataFeedIntegration.
     * @example
     * // Update or create a ProductDataFeedIntegration
     * const productDataFeedIntegration = await prisma.productDataFeedIntegration.upsert({
     *   create: {
     *     // ... data to create a ProductDataFeedIntegration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductDataFeedIntegration we want to update
     *   }
     * })
     **/
    upsert<T extends ProductDataFeedIntegrationUpsertArgs>(
      args: SelectSubset<T, ProductDataFeedIntegrationUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedIntegrationClient<ProductDataFeedIntegration>,
      Prisma__ProductDataFeedIntegrationClient<
        ProductDataFeedIntegrationGetPayload<T>
      >
    >;

    /**
     * Count the number of ProductDataFeedIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedIntegrationCountArgs} args - Arguments to filter ProductDataFeedIntegrations to count.
     * @example
     * // Count the number of ProductDataFeedIntegrations
     * const count = await prisma.productDataFeedIntegration.count({
     *   where: {
     *     // ... the filter for the ProductDataFeedIntegrations we want to count
     *   }
     * })
     **/
    count<T extends ProductDataFeedIntegrationCountArgs>(
      args?: Subset<T, ProductDataFeedIntegrationCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              ProductDataFeedIntegrationCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ProductDataFeedIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedIntegrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProductDataFeedIntegrationAggregateArgs>(
      args: Subset<T, ProductDataFeedIntegrationAggregateArgs>,
    ): PrismaPromise<GetProductDataFeedIntegrationAggregateType<T>>;

    /**
     * Group by ProductDataFeedIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductDataFeedIntegrationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProductDataFeedIntegrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductDataFeedIntegrationGroupByArgs["orderBy"] }
        : { orderBy?: ProductDataFeedIntegrationGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<
        T,
        ProductDataFeedIntegrationGroupByArgs,
        OrderByArg
      > &
        InputErrors,
    ): {} extends InputErrors
      ? GetProductDataFeedIntegrationGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductDataFeedIntegration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ProductDataFeedIntegrationClient<T>
    implements PrismaPromise<T>
  {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    subscription<T extends SubscriptionArgs = {}>(
      args?: Subset<T, SubscriptionArgs>,
    ): CheckSelect<
      T,
      Prisma__SubscriptionClient<Subscription | null>,
      Prisma__SubscriptionClient<SubscriptionGetPayload<T> | null>
    >;

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    productDataFeedApp<T extends ProductDataFeedAppArgs = {}>(
      args?: Subset<T, ProductDataFeedAppArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedAppClient<ProductDataFeedApp | null>,
      Prisma__ProductDataFeedAppClient<ProductDataFeedAppGetPayload<T> | null>
    >;

    saleorApp<T extends SaleorAppArgs = {}>(
      args?: Subset<T, SaleorAppArgs>,
    ): CheckSelect<
      T,
      Prisma__SaleorAppClient<SaleorApp | null>,
      Prisma__SaleorAppClient<SaleorAppGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * ProductDataFeedIntegration findUnique
   */
  export type ProductDataFeedIntegrationFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedIntegration
     *
     **/
    select?: ProductDataFeedIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedIntegrationInclude | null;
    /**
     * Throw an Error if a ProductDataFeedIntegration can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which ProductDataFeedIntegration to fetch.
     *
     **/
    where: ProductDataFeedIntegrationWhereUniqueInput;
  };

  /**
   * ProductDataFeedIntegration findFirst
   */
  export type ProductDataFeedIntegrationFindFirstArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedIntegration
     *
     **/
    select?: ProductDataFeedIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedIntegrationInclude | null;
    /**
     * Throw an Error if a ProductDataFeedIntegration can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which ProductDataFeedIntegration to fetch.
     *
     **/
    where?: ProductDataFeedIntegrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductDataFeedIntegrations to fetch.
     *
     **/
    orderBy?: Enumerable<ProductDataFeedIntegrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProductDataFeedIntegrations.
     *
     **/
    cursor?: ProductDataFeedIntegrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductDataFeedIntegrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductDataFeedIntegrations.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProductDataFeedIntegrations.
     *
     **/
    distinct?: Enumerable<ProductDataFeedIntegrationScalarFieldEnum>;
  };

  /**
   * ProductDataFeedIntegration findMany
   */
  export type ProductDataFeedIntegrationFindManyArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedIntegration
     *
     **/
    select?: ProductDataFeedIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedIntegrationInclude | null;
    /**
     * Filter, which ProductDataFeedIntegrations to fetch.
     *
     **/
    where?: ProductDataFeedIntegrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductDataFeedIntegrations to fetch.
     *
     **/
    orderBy?: Enumerable<ProductDataFeedIntegrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProductDataFeedIntegrations.
     *
     **/
    cursor?: ProductDataFeedIntegrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductDataFeedIntegrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductDataFeedIntegrations.
     *
     **/
    skip?: number;
    distinct?: Enumerable<ProductDataFeedIntegrationScalarFieldEnum>;
  };

  /**
   * ProductDataFeedIntegration create
   */
  export type ProductDataFeedIntegrationCreateArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedIntegration
     *
     **/
    select?: ProductDataFeedIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedIntegrationInclude | null;
    /**
     * The data needed to create a ProductDataFeedIntegration.
     *
     **/
    data: XOR<
      ProductDataFeedIntegrationCreateInput,
      ProductDataFeedIntegrationUncheckedCreateInput
    >;
  };

  /**
   * ProductDataFeedIntegration createMany
   */
  export type ProductDataFeedIntegrationCreateManyArgs = {
    data: Enumerable<ProductDataFeedIntegrationCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * ProductDataFeedIntegration update
   */
  export type ProductDataFeedIntegrationUpdateArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedIntegration
     *
     **/
    select?: ProductDataFeedIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedIntegrationInclude | null;
    /**
     * The data needed to update a ProductDataFeedIntegration.
     *
     **/
    data: XOR<
      ProductDataFeedIntegrationUpdateInput,
      ProductDataFeedIntegrationUncheckedUpdateInput
    >;
    /**
     * Choose, which ProductDataFeedIntegration to update.
     *
     **/
    where: ProductDataFeedIntegrationWhereUniqueInput;
  };

  /**
   * ProductDataFeedIntegration updateMany
   */
  export type ProductDataFeedIntegrationUpdateManyArgs = {
    data: XOR<
      ProductDataFeedIntegrationUpdateManyMutationInput,
      ProductDataFeedIntegrationUncheckedUpdateManyInput
    >;
    where?: ProductDataFeedIntegrationWhereInput;
  };

  /**
   * ProductDataFeedIntegration upsert
   */
  export type ProductDataFeedIntegrationUpsertArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedIntegration
     *
     **/
    select?: ProductDataFeedIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedIntegrationInclude | null;
    /**
     * The filter to search for the ProductDataFeedIntegration to update in case it exists.
     *
     **/
    where: ProductDataFeedIntegrationWhereUniqueInput;
    /**
     * In case the ProductDataFeedIntegration found by the `where` argument doesn't exist, create a new ProductDataFeedIntegration with this data.
     *
     **/
    create: XOR<
      ProductDataFeedIntegrationCreateInput,
      ProductDataFeedIntegrationUncheckedCreateInput
    >;
    /**
     * In case the ProductDataFeedIntegration was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      ProductDataFeedIntegrationUpdateInput,
      ProductDataFeedIntegrationUncheckedUpdateInput
    >;
  };

  /**
   * ProductDataFeedIntegration delete
   */
  export type ProductDataFeedIntegrationDeleteArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedIntegration
     *
     **/
    select?: ProductDataFeedIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedIntegrationInclude | null;
    /**
     * Filter which ProductDataFeedIntegration to delete.
     *
     **/
    where: ProductDataFeedIntegrationWhereUniqueInput;
  };

  /**
   * ProductDataFeedIntegration deleteMany
   */
  export type ProductDataFeedIntegrationDeleteManyArgs = {
    where?: ProductDataFeedIntegrationWhereInput;
  };

  /**
   * ProductDataFeedIntegration without action
   */
  export type ProductDataFeedIntegrationArgs = {
    /**
     * Select specific fields to fetch from the ProductDataFeedIntegration
     *
     **/
    select?: ProductDataFeedIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: ProductDataFeedIntegrationInclude | null;
  };

  /**
   * Model LogisticsIntegration
   */

  export type AggregateLogisticsIntegration = {
    _count: LogisticsIntegrationCountAggregateOutputType | null;
    _min: LogisticsIntegrationMinAggregateOutputType | null;
    _max: LogisticsIntegrationMaxAggregateOutputType | null;
  };

  export type LogisticsIntegrationMinAggregateOutputType = {
    id: string | null;
    enabled: boolean | null;
    subscriptionId: string | null;
    tenantId: string | null;
    zohoAppId: string | null;
    logisticsAppId: string | null;
  };

  export type LogisticsIntegrationMaxAggregateOutputType = {
    id: string | null;
    enabled: boolean | null;
    subscriptionId: string | null;
    tenantId: string | null;
    zohoAppId: string | null;
    logisticsAppId: string | null;
  };

  export type LogisticsIntegrationCountAggregateOutputType = {
    id: number;
    enabled: number;
    subscriptionId: number;
    tenantId: number;
    zohoAppId: number;
    logisticsAppId: number;
    _all: number;
  };

  export type LogisticsIntegrationMinAggregateInputType = {
    id?: true;
    enabled?: true;
    subscriptionId?: true;
    tenantId?: true;
    zohoAppId?: true;
    logisticsAppId?: true;
  };

  export type LogisticsIntegrationMaxAggregateInputType = {
    id?: true;
    enabled?: true;
    subscriptionId?: true;
    tenantId?: true;
    zohoAppId?: true;
    logisticsAppId?: true;
  };

  export type LogisticsIntegrationCountAggregateInputType = {
    id?: true;
    enabled?: true;
    subscriptionId?: true;
    tenantId?: true;
    zohoAppId?: true;
    logisticsAppId?: true;
    _all?: true;
  };

  export type LogisticsIntegrationAggregateArgs = {
    /**
     * Filter which LogisticsIntegration to aggregate.
     *
     **/
    where?: LogisticsIntegrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LogisticsIntegrations to fetch.
     *
     **/
    orderBy?: Enumerable<LogisticsIntegrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: LogisticsIntegrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LogisticsIntegrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LogisticsIntegrations.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned LogisticsIntegrations
     **/
    _count?: true | LogisticsIntegrationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: LogisticsIntegrationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: LogisticsIntegrationMaxAggregateInputType;
  };

  export type GetLogisticsIntegrationAggregateType<
    T extends LogisticsIntegrationAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateLogisticsIntegration]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLogisticsIntegration[P]>
      : GetScalarType<T[P], AggregateLogisticsIntegration[P]>;
  };

  export type LogisticsIntegrationGroupByArgs = {
    where?: LogisticsIntegrationWhereInput;
    orderBy?: Enumerable<LogisticsIntegrationOrderByWithAggregationInput>;
    by: Array<LogisticsIntegrationScalarFieldEnum>;
    having?: LogisticsIntegrationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LogisticsIntegrationCountAggregateInputType | true;
    _min?: LogisticsIntegrationMinAggregateInputType;
    _max?: LogisticsIntegrationMaxAggregateInputType;
  };

  export type LogisticsIntegrationGroupByOutputType = {
    id: string;
    enabled: boolean;
    subscriptionId: string | null;
    tenantId: string;
    zohoAppId: string;
    logisticsAppId: string;
    _count: LogisticsIntegrationCountAggregateOutputType | null;
    _min: LogisticsIntegrationMinAggregateOutputType | null;
    _max: LogisticsIntegrationMaxAggregateOutputType | null;
  };

  type GetLogisticsIntegrationGroupByPayload<
    T extends LogisticsIntegrationGroupByArgs,
  > = Promise<
    Array<
      PickArray<LogisticsIntegrationGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof LogisticsIntegrationGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], LogisticsIntegrationGroupByOutputType[P]>
          : GetScalarType<T[P], LogisticsIntegrationGroupByOutputType[P]>;
      }
    >
  >;

  export type LogisticsIntegrationSelect = {
    id?: boolean;
    enabled?: boolean;
    subscription?: boolean | SubscriptionArgs;
    subscriptionId?: boolean;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    zohoApp?: boolean | ZohoAppArgs;
    zohoAppId?: boolean;
    logisticsApp?: boolean | LogisticsAppArgs;
    logisticsAppId?: boolean;
  };

  export type LogisticsIntegrationInclude = {
    subscription?: boolean | SubscriptionArgs;
    tenant?: boolean | TenantArgs;
    zohoApp?: boolean | ZohoAppArgs;
    logisticsApp?: boolean | LogisticsAppArgs;
  };

  export type LogisticsIntegrationGetPayload<
    S extends boolean | null | undefined | LogisticsIntegrationArgs,
    U = keyof S,
  > = S extends true
    ? LogisticsIntegration
    : S extends undefined
    ? never
    : S extends LogisticsIntegrationArgs | LogisticsIntegrationFindManyArgs
    ? "include" extends U
      ? LogisticsIntegration & {
          [P in TrueKeys<S["include"]>]: P extends "subscription"
            ? SubscriptionGetPayload<S["include"][P]> | null
            : P extends "tenant"
            ? TenantGetPayload<S["include"][P]>
            : P extends "zohoApp"
            ? ZohoAppGetPayload<S["include"][P]>
            : P extends "logisticsApp"
            ? LogisticsAppGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof LogisticsIntegration
            ? LogisticsIntegration[P]
            : P extends "subscription"
            ? SubscriptionGetPayload<S["select"][P]> | null
            : P extends "tenant"
            ? TenantGetPayload<S["select"][P]>
            : P extends "zohoApp"
            ? ZohoAppGetPayload<S["select"][P]>
            : P extends "logisticsApp"
            ? LogisticsAppGetPayload<S["select"][P]>
            : never;
        }
      : LogisticsIntegration
    : LogisticsIntegration;

  type LogisticsIntegrationCountArgs = Merge<
    Omit<LogisticsIntegrationFindManyArgs, "select" | "include"> & {
      select?: LogisticsIntegrationCountAggregateInputType | true;
    }
  >;

  export interface LogisticsIntegrationDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one LogisticsIntegration that matches the filter.
     * @param {LogisticsIntegrationFindUniqueArgs} args - Arguments to find a LogisticsIntegration
     * @example
     * // Get one LogisticsIntegration
     * const logisticsIntegration = await prisma.logisticsIntegration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends LogisticsIntegrationFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, LogisticsIntegrationFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "LogisticsIntegration"
    > extends True
      ? CheckSelect<
          T,
          Prisma__LogisticsIntegrationClient<LogisticsIntegration>,
          Prisma__LogisticsIntegrationClient<LogisticsIntegrationGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__LogisticsIntegrationClient<LogisticsIntegration | null>,
          Prisma__LogisticsIntegrationClient<LogisticsIntegrationGetPayload<T> | null>
        >;

    /**
     * Find the first LogisticsIntegration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsIntegrationFindFirstArgs} args - Arguments to find a LogisticsIntegration
     * @example
     * // Get one LogisticsIntegration
     * const logisticsIntegration = await prisma.logisticsIntegration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends LogisticsIntegrationFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, LogisticsIntegrationFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "LogisticsIntegration"
    > extends True
      ? CheckSelect<
          T,
          Prisma__LogisticsIntegrationClient<LogisticsIntegration>,
          Prisma__LogisticsIntegrationClient<LogisticsIntegrationGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__LogisticsIntegrationClient<LogisticsIntegration | null>,
          Prisma__LogisticsIntegrationClient<LogisticsIntegrationGetPayload<T> | null>
        >;

    /**
     * Find zero or more LogisticsIntegrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsIntegrationFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LogisticsIntegrations
     * const logisticsIntegrations = await prisma.logisticsIntegration.findMany()
     *
     * // Get first 10 LogisticsIntegrations
     * const logisticsIntegrations = await prisma.logisticsIntegration.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const logisticsIntegrationWithIdOnly = await prisma.logisticsIntegration.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends LogisticsIntegrationFindManyArgs>(
      args?: SelectSubset<T, LogisticsIntegrationFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<LogisticsIntegration>>,
      PrismaPromise<Array<LogisticsIntegrationGetPayload<T>>>
    >;

    /**
     * Create a LogisticsIntegration.
     * @param {LogisticsIntegrationCreateArgs} args - Arguments to create a LogisticsIntegration.
     * @example
     * // Create one LogisticsIntegration
     * const LogisticsIntegration = await prisma.logisticsIntegration.create({
     *   data: {
     *     // ... data to create a LogisticsIntegration
     *   }
     * })
     *
     **/
    create<T extends LogisticsIntegrationCreateArgs>(
      args: SelectSubset<T, LogisticsIntegrationCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsIntegrationClient<LogisticsIntegration>,
      Prisma__LogisticsIntegrationClient<LogisticsIntegrationGetPayload<T>>
    >;

    /**
     * Create many LogisticsIntegrations.
     *     @param {LogisticsIntegrationCreateManyArgs} args - Arguments to create many LogisticsIntegrations.
     *     @example
     *     // Create many LogisticsIntegrations
     *     const logisticsIntegration = await prisma.logisticsIntegration.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends LogisticsIntegrationCreateManyArgs>(
      args?: SelectSubset<T, LogisticsIntegrationCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a LogisticsIntegration.
     * @param {LogisticsIntegrationDeleteArgs} args - Arguments to delete one LogisticsIntegration.
     * @example
     * // Delete one LogisticsIntegration
     * const LogisticsIntegration = await prisma.logisticsIntegration.delete({
     *   where: {
     *     // ... filter to delete one LogisticsIntegration
     *   }
     * })
     *
     **/
    delete<T extends LogisticsIntegrationDeleteArgs>(
      args: SelectSubset<T, LogisticsIntegrationDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsIntegrationClient<LogisticsIntegration>,
      Prisma__LogisticsIntegrationClient<LogisticsIntegrationGetPayload<T>>
    >;

    /**
     * Update one LogisticsIntegration.
     * @param {LogisticsIntegrationUpdateArgs} args - Arguments to update one LogisticsIntegration.
     * @example
     * // Update one LogisticsIntegration
     * const logisticsIntegration = await prisma.logisticsIntegration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends LogisticsIntegrationUpdateArgs>(
      args: SelectSubset<T, LogisticsIntegrationUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsIntegrationClient<LogisticsIntegration>,
      Prisma__LogisticsIntegrationClient<LogisticsIntegrationGetPayload<T>>
    >;

    /**
     * Delete zero or more LogisticsIntegrations.
     * @param {LogisticsIntegrationDeleteManyArgs} args - Arguments to filter LogisticsIntegrations to delete.
     * @example
     * // Delete a few LogisticsIntegrations
     * const { count } = await prisma.logisticsIntegration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends LogisticsIntegrationDeleteManyArgs>(
      args?: SelectSubset<T, LogisticsIntegrationDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more LogisticsIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsIntegrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LogisticsIntegrations
     * const logisticsIntegration = await prisma.logisticsIntegration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends LogisticsIntegrationUpdateManyArgs>(
      args: SelectSubset<T, LogisticsIntegrationUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one LogisticsIntegration.
     * @param {LogisticsIntegrationUpsertArgs} args - Arguments to update or create a LogisticsIntegration.
     * @example
     * // Update or create a LogisticsIntegration
     * const logisticsIntegration = await prisma.logisticsIntegration.upsert({
     *   create: {
     *     // ... data to create a LogisticsIntegration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LogisticsIntegration we want to update
     *   }
     * })
     **/
    upsert<T extends LogisticsIntegrationUpsertArgs>(
      args: SelectSubset<T, LogisticsIntegrationUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsIntegrationClient<LogisticsIntegration>,
      Prisma__LogisticsIntegrationClient<LogisticsIntegrationGetPayload<T>>
    >;

    /**
     * Count the number of LogisticsIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsIntegrationCountArgs} args - Arguments to filter LogisticsIntegrations to count.
     * @example
     * // Count the number of LogisticsIntegrations
     * const count = await prisma.logisticsIntegration.count({
     *   where: {
     *     // ... the filter for the LogisticsIntegrations we want to count
     *   }
     * })
     **/
    count<T extends LogisticsIntegrationCountArgs>(
      args?: Subset<T, LogisticsIntegrationCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              LogisticsIntegrationCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a LogisticsIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsIntegrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends LogisticsIntegrationAggregateArgs>(
      args: Subset<T, LogisticsIntegrationAggregateArgs>,
    ): PrismaPromise<GetLogisticsIntegrationAggregateType<T>>;

    /**
     * Group by LogisticsIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsIntegrationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends LogisticsIntegrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LogisticsIntegrationGroupByArgs["orderBy"] }
        : { orderBy?: LogisticsIntegrationGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, LogisticsIntegrationGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetLogisticsIntegrationGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LogisticsIntegration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__LogisticsIntegrationClient<T>
    implements PrismaPromise<T>
  {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    subscription<T extends SubscriptionArgs = {}>(
      args?: Subset<T, SubscriptionArgs>,
    ): CheckSelect<
      T,
      Prisma__SubscriptionClient<Subscription | null>,
      Prisma__SubscriptionClient<SubscriptionGetPayload<T> | null>
    >;

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    zohoApp<T extends ZohoAppArgs = {}>(
      args?: Subset<T, ZohoAppArgs>,
    ): CheckSelect<
      T,
      Prisma__ZohoAppClient<ZohoApp | null>,
      Prisma__ZohoAppClient<ZohoAppGetPayload<T> | null>
    >;

    logisticsApp<T extends LogisticsAppArgs = {}>(
      args?: Subset<T, LogisticsAppArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsAppClient<LogisticsApp | null>,
      Prisma__LogisticsAppClient<LogisticsAppGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * LogisticsIntegration findUnique
   */
  export type LogisticsIntegrationFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the LogisticsIntegration
     *
     **/
    select?: LogisticsIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsIntegrationInclude | null;
    /**
     * Throw an Error if a LogisticsIntegration can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which LogisticsIntegration to fetch.
     *
     **/
    where: LogisticsIntegrationWhereUniqueInput;
  };

  /**
   * LogisticsIntegration findFirst
   */
  export type LogisticsIntegrationFindFirstArgs = {
    /**
     * Select specific fields to fetch from the LogisticsIntegration
     *
     **/
    select?: LogisticsIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsIntegrationInclude | null;
    /**
     * Throw an Error if a LogisticsIntegration can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which LogisticsIntegration to fetch.
     *
     **/
    where?: LogisticsIntegrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LogisticsIntegrations to fetch.
     *
     **/
    orderBy?: Enumerable<LogisticsIntegrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for LogisticsIntegrations.
     *
     **/
    cursor?: LogisticsIntegrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LogisticsIntegrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LogisticsIntegrations.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LogisticsIntegrations.
     *
     **/
    distinct?: Enumerable<LogisticsIntegrationScalarFieldEnum>;
  };

  /**
   * LogisticsIntegration findMany
   */
  export type LogisticsIntegrationFindManyArgs = {
    /**
     * Select specific fields to fetch from the LogisticsIntegration
     *
     **/
    select?: LogisticsIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsIntegrationInclude | null;
    /**
     * Filter, which LogisticsIntegrations to fetch.
     *
     **/
    where?: LogisticsIntegrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LogisticsIntegrations to fetch.
     *
     **/
    orderBy?: Enumerable<LogisticsIntegrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing LogisticsIntegrations.
     *
     **/
    cursor?: LogisticsIntegrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LogisticsIntegrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LogisticsIntegrations.
     *
     **/
    skip?: number;
    distinct?: Enumerable<LogisticsIntegrationScalarFieldEnum>;
  };

  /**
   * LogisticsIntegration create
   */
  export type LogisticsIntegrationCreateArgs = {
    /**
     * Select specific fields to fetch from the LogisticsIntegration
     *
     **/
    select?: LogisticsIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsIntegrationInclude | null;
    /**
     * The data needed to create a LogisticsIntegration.
     *
     **/
    data: XOR<
      LogisticsIntegrationCreateInput,
      LogisticsIntegrationUncheckedCreateInput
    >;
  };

  /**
   * LogisticsIntegration createMany
   */
  export type LogisticsIntegrationCreateManyArgs = {
    data: Enumerable<LogisticsIntegrationCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * LogisticsIntegration update
   */
  export type LogisticsIntegrationUpdateArgs = {
    /**
     * Select specific fields to fetch from the LogisticsIntegration
     *
     **/
    select?: LogisticsIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsIntegrationInclude | null;
    /**
     * The data needed to update a LogisticsIntegration.
     *
     **/
    data: XOR<
      LogisticsIntegrationUpdateInput,
      LogisticsIntegrationUncheckedUpdateInput
    >;
    /**
     * Choose, which LogisticsIntegration to update.
     *
     **/
    where: LogisticsIntegrationWhereUniqueInput;
  };

  /**
   * LogisticsIntegration updateMany
   */
  export type LogisticsIntegrationUpdateManyArgs = {
    data: XOR<
      LogisticsIntegrationUpdateManyMutationInput,
      LogisticsIntegrationUncheckedUpdateManyInput
    >;
    where?: LogisticsIntegrationWhereInput;
  };

  /**
   * LogisticsIntegration upsert
   */
  export type LogisticsIntegrationUpsertArgs = {
    /**
     * Select specific fields to fetch from the LogisticsIntegration
     *
     **/
    select?: LogisticsIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsIntegrationInclude | null;
    /**
     * The filter to search for the LogisticsIntegration to update in case it exists.
     *
     **/
    where: LogisticsIntegrationWhereUniqueInput;
    /**
     * In case the LogisticsIntegration found by the `where` argument doesn't exist, create a new LogisticsIntegration with this data.
     *
     **/
    create: XOR<
      LogisticsIntegrationCreateInput,
      LogisticsIntegrationUncheckedCreateInput
    >;
    /**
     * In case the LogisticsIntegration was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      LogisticsIntegrationUpdateInput,
      LogisticsIntegrationUncheckedUpdateInput
    >;
  };

  /**
   * LogisticsIntegration delete
   */
  export type LogisticsIntegrationDeleteArgs = {
    /**
     * Select specific fields to fetch from the LogisticsIntegration
     *
     **/
    select?: LogisticsIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsIntegrationInclude | null;
    /**
     * Filter which LogisticsIntegration to delete.
     *
     **/
    where: LogisticsIntegrationWhereUniqueInput;
  };

  /**
   * LogisticsIntegration deleteMany
   */
  export type LogisticsIntegrationDeleteManyArgs = {
    where?: LogisticsIntegrationWhereInput;
  };

  /**
   * LogisticsIntegration without action
   */
  export type LogisticsIntegrationArgs = {
    /**
     * Select specific fields to fetch from the LogisticsIntegration
     *
     **/
    select?: LogisticsIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: LogisticsIntegrationInclude | null;
  };

  /**
   * Model StrapiToZohoIntegration
   */

  export type AggregateStrapiToZohoIntegration = {
    _count: StrapiToZohoIntegrationCountAggregateOutputType | null;
    _min: StrapiToZohoIntegrationMinAggregateOutputType | null;
    _max: StrapiToZohoIntegrationMaxAggregateOutputType | null;
  };

  export type StrapiToZohoIntegrationMinAggregateOutputType = {
    id: string | null;
    payedUntil: Date | null;
    enabled: boolean | null;
    strapiContentType: string | null;
    subscriptionId: string | null;
    tenantId: string | null;
    strapiAppId: string | null;
    zohoAppId: string | null;
  };

  export type StrapiToZohoIntegrationMaxAggregateOutputType = {
    id: string | null;
    payedUntil: Date | null;
    enabled: boolean | null;
    strapiContentType: string | null;
    subscriptionId: string | null;
    tenantId: string | null;
    strapiAppId: string | null;
    zohoAppId: string | null;
  };

  export type StrapiToZohoIntegrationCountAggregateOutputType = {
    id: number;
    payedUntil: number;
    enabled: number;
    strapiContentType: number;
    subscriptionId: number;
    tenantId: number;
    strapiAppId: number;
    zohoAppId: number;
    _all: number;
  };

  export type StrapiToZohoIntegrationMinAggregateInputType = {
    id?: true;
    payedUntil?: true;
    enabled?: true;
    strapiContentType?: true;
    subscriptionId?: true;
    tenantId?: true;
    strapiAppId?: true;
    zohoAppId?: true;
  };

  export type StrapiToZohoIntegrationMaxAggregateInputType = {
    id?: true;
    payedUntil?: true;
    enabled?: true;
    strapiContentType?: true;
    subscriptionId?: true;
    tenantId?: true;
    strapiAppId?: true;
    zohoAppId?: true;
  };

  export type StrapiToZohoIntegrationCountAggregateInputType = {
    id?: true;
    payedUntil?: true;
    enabled?: true;
    strapiContentType?: true;
    subscriptionId?: true;
    tenantId?: true;
    strapiAppId?: true;
    zohoAppId?: true;
    _all?: true;
  };

  export type StrapiToZohoIntegrationAggregateArgs = {
    /**
     * Filter which StrapiToZohoIntegration to aggregate.
     *
     **/
    where?: StrapiToZohoIntegrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StrapiToZohoIntegrations to fetch.
     *
     **/
    orderBy?: Enumerable<StrapiToZohoIntegrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: StrapiToZohoIntegrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StrapiToZohoIntegrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StrapiToZohoIntegrations.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned StrapiToZohoIntegrations
     **/
    _count?: true | StrapiToZohoIntegrationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: StrapiToZohoIntegrationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: StrapiToZohoIntegrationMaxAggregateInputType;
  };

  export type GetStrapiToZohoIntegrationAggregateType<
    T extends StrapiToZohoIntegrationAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateStrapiToZohoIntegration]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStrapiToZohoIntegration[P]>
      : GetScalarType<T[P], AggregateStrapiToZohoIntegration[P]>;
  };

  export type StrapiToZohoIntegrationGroupByArgs = {
    where?: StrapiToZohoIntegrationWhereInput;
    orderBy?: Enumerable<StrapiToZohoIntegrationOrderByWithAggregationInput>;
    by: Array<StrapiToZohoIntegrationScalarFieldEnum>;
    having?: StrapiToZohoIntegrationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StrapiToZohoIntegrationCountAggregateInputType | true;
    _min?: StrapiToZohoIntegrationMinAggregateInputType;
    _max?: StrapiToZohoIntegrationMaxAggregateInputType;
  };

  export type StrapiToZohoIntegrationGroupByOutputType = {
    id: string;
    payedUntil: Date | null;
    enabled: boolean;
    strapiContentType: string;
    subscriptionId: string | null;
    tenantId: string;
    strapiAppId: string;
    zohoAppId: string;
    _count: StrapiToZohoIntegrationCountAggregateOutputType | null;
    _min: StrapiToZohoIntegrationMinAggregateOutputType | null;
    _max: StrapiToZohoIntegrationMaxAggregateOutputType | null;
  };

  type GetStrapiToZohoIntegrationGroupByPayload<
    T extends StrapiToZohoIntegrationGroupByArgs,
  > = Promise<
    Array<
      PickArray<StrapiToZohoIntegrationGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof StrapiToZohoIntegrationGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], StrapiToZohoIntegrationGroupByOutputType[P]>
          : GetScalarType<T[P], StrapiToZohoIntegrationGroupByOutputType[P]>;
      }
    >
  >;

  export type StrapiToZohoIntegrationSelect = {
    id?: boolean;
    payedUntil?: boolean;
    enabled?: boolean;
    strapiContentType?: boolean;
    subscription?: boolean | SubscriptionArgs;
    subscriptionId?: boolean;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    strapiApp?: boolean | StrapiAppArgs;
    strapiAppId?: boolean;
    zohoApp?: boolean | ZohoAppArgs;
    zohoAppId?: boolean;
  };

  export type StrapiToZohoIntegrationInclude = {
    subscription?: boolean | SubscriptionArgs;
    tenant?: boolean | TenantArgs;
    strapiApp?: boolean | StrapiAppArgs;
    zohoApp?: boolean | ZohoAppArgs;
  };

  export type StrapiToZohoIntegrationGetPayload<
    S extends boolean | null | undefined | StrapiToZohoIntegrationArgs,
    U = keyof S,
  > = S extends true
    ? StrapiToZohoIntegration
    : S extends undefined
    ? never
    : S extends
        | StrapiToZohoIntegrationArgs
        | StrapiToZohoIntegrationFindManyArgs
    ? "include" extends U
      ? StrapiToZohoIntegration & {
          [P in TrueKeys<S["include"]>]: P extends "subscription"
            ? SubscriptionGetPayload<S["include"][P]> | null
            : P extends "tenant"
            ? TenantGetPayload<S["include"][P]>
            : P extends "strapiApp"
            ? StrapiAppGetPayload<S["include"][P]>
            : P extends "zohoApp"
            ? ZohoAppGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof StrapiToZohoIntegration
            ? StrapiToZohoIntegration[P]
            : P extends "subscription"
            ? SubscriptionGetPayload<S["select"][P]> | null
            : P extends "tenant"
            ? TenantGetPayload<S["select"][P]>
            : P extends "strapiApp"
            ? StrapiAppGetPayload<S["select"][P]>
            : P extends "zohoApp"
            ? ZohoAppGetPayload<S["select"][P]>
            : never;
        }
      : StrapiToZohoIntegration
    : StrapiToZohoIntegration;

  type StrapiToZohoIntegrationCountArgs = Merge<
    Omit<StrapiToZohoIntegrationFindManyArgs, "select" | "include"> & {
      select?: StrapiToZohoIntegrationCountAggregateInputType | true;
    }
  >;

  export interface StrapiToZohoIntegrationDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one StrapiToZohoIntegration that matches the filter.
     * @param {StrapiToZohoIntegrationFindUniqueArgs} args - Arguments to find a StrapiToZohoIntegration
     * @example
     * // Get one StrapiToZohoIntegration
     * const strapiToZohoIntegration = await prisma.strapiToZohoIntegration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends StrapiToZohoIntegrationFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, StrapiToZohoIntegrationFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "StrapiToZohoIntegration"
    > extends True
      ? CheckSelect<
          T,
          Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegration>,
          Prisma__StrapiToZohoIntegrationClient<
            StrapiToZohoIntegrationGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegration | null>,
          Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegrationGetPayload<T> | null>
        >;

    /**
     * Find the first StrapiToZohoIntegration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiToZohoIntegrationFindFirstArgs} args - Arguments to find a StrapiToZohoIntegration
     * @example
     * // Get one StrapiToZohoIntegration
     * const strapiToZohoIntegration = await prisma.strapiToZohoIntegration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends StrapiToZohoIntegrationFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, StrapiToZohoIntegrationFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "StrapiToZohoIntegration"
    > extends True
      ? CheckSelect<
          T,
          Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegration>,
          Prisma__StrapiToZohoIntegrationClient<
            StrapiToZohoIntegrationGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegration | null>,
          Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegrationGetPayload<T> | null>
        >;

    /**
     * Find zero or more StrapiToZohoIntegrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiToZohoIntegrationFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StrapiToZohoIntegrations
     * const strapiToZohoIntegrations = await prisma.strapiToZohoIntegration.findMany()
     *
     * // Get first 10 StrapiToZohoIntegrations
     * const strapiToZohoIntegrations = await prisma.strapiToZohoIntegration.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const strapiToZohoIntegrationWithIdOnly = await prisma.strapiToZohoIntegration.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends StrapiToZohoIntegrationFindManyArgs>(
      args?: SelectSubset<T, StrapiToZohoIntegrationFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<StrapiToZohoIntegration>>,
      PrismaPromise<Array<StrapiToZohoIntegrationGetPayload<T>>>
    >;

    /**
     * Create a StrapiToZohoIntegration.
     * @param {StrapiToZohoIntegrationCreateArgs} args - Arguments to create a StrapiToZohoIntegration.
     * @example
     * // Create one StrapiToZohoIntegration
     * const StrapiToZohoIntegration = await prisma.strapiToZohoIntegration.create({
     *   data: {
     *     // ... data to create a StrapiToZohoIntegration
     *   }
     * })
     *
     **/
    create<T extends StrapiToZohoIntegrationCreateArgs>(
      args: SelectSubset<T, StrapiToZohoIntegrationCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegration>,
      Prisma__StrapiToZohoIntegrationClient<
        StrapiToZohoIntegrationGetPayload<T>
      >
    >;

    /**
     * Create many StrapiToZohoIntegrations.
     *     @param {StrapiToZohoIntegrationCreateManyArgs} args - Arguments to create many StrapiToZohoIntegrations.
     *     @example
     *     // Create many StrapiToZohoIntegrations
     *     const strapiToZohoIntegration = await prisma.strapiToZohoIntegration.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends StrapiToZohoIntegrationCreateManyArgs>(
      args?: SelectSubset<T, StrapiToZohoIntegrationCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a StrapiToZohoIntegration.
     * @param {StrapiToZohoIntegrationDeleteArgs} args - Arguments to delete one StrapiToZohoIntegration.
     * @example
     * // Delete one StrapiToZohoIntegration
     * const StrapiToZohoIntegration = await prisma.strapiToZohoIntegration.delete({
     *   where: {
     *     // ... filter to delete one StrapiToZohoIntegration
     *   }
     * })
     *
     **/
    delete<T extends StrapiToZohoIntegrationDeleteArgs>(
      args: SelectSubset<T, StrapiToZohoIntegrationDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegration>,
      Prisma__StrapiToZohoIntegrationClient<
        StrapiToZohoIntegrationGetPayload<T>
      >
    >;

    /**
     * Update one StrapiToZohoIntegration.
     * @param {StrapiToZohoIntegrationUpdateArgs} args - Arguments to update one StrapiToZohoIntegration.
     * @example
     * // Update one StrapiToZohoIntegration
     * const strapiToZohoIntegration = await prisma.strapiToZohoIntegration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends StrapiToZohoIntegrationUpdateArgs>(
      args: SelectSubset<T, StrapiToZohoIntegrationUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegration>,
      Prisma__StrapiToZohoIntegrationClient<
        StrapiToZohoIntegrationGetPayload<T>
      >
    >;

    /**
     * Delete zero or more StrapiToZohoIntegrations.
     * @param {StrapiToZohoIntegrationDeleteManyArgs} args - Arguments to filter StrapiToZohoIntegrations to delete.
     * @example
     * // Delete a few StrapiToZohoIntegrations
     * const { count } = await prisma.strapiToZohoIntegration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends StrapiToZohoIntegrationDeleteManyArgs>(
      args?: SelectSubset<T, StrapiToZohoIntegrationDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more StrapiToZohoIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiToZohoIntegrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StrapiToZohoIntegrations
     * const strapiToZohoIntegration = await prisma.strapiToZohoIntegration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends StrapiToZohoIntegrationUpdateManyArgs>(
      args: SelectSubset<T, StrapiToZohoIntegrationUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one StrapiToZohoIntegration.
     * @param {StrapiToZohoIntegrationUpsertArgs} args - Arguments to update or create a StrapiToZohoIntegration.
     * @example
     * // Update or create a StrapiToZohoIntegration
     * const strapiToZohoIntegration = await prisma.strapiToZohoIntegration.upsert({
     *   create: {
     *     // ... data to create a StrapiToZohoIntegration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StrapiToZohoIntegration we want to update
     *   }
     * })
     **/
    upsert<T extends StrapiToZohoIntegrationUpsertArgs>(
      args: SelectSubset<T, StrapiToZohoIntegrationUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegration>,
      Prisma__StrapiToZohoIntegrationClient<
        StrapiToZohoIntegrationGetPayload<T>
      >
    >;

    /**
     * Count the number of StrapiToZohoIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiToZohoIntegrationCountArgs} args - Arguments to filter StrapiToZohoIntegrations to count.
     * @example
     * // Count the number of StrapiToZohoIntegrations
     * const count = await prisma.strapiToZohoIntegration.count({
     *   where: {
     *     // ... the filter for the StrapiToZohoIntegrations we want to count
     *   }
     * })
     **/
    count<T extends StrapiToZohoIntegrationCountArgs>(
      args?: Subset<T, StrapiToZohoIntegrationCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              StrapiToZohoIntegrationCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a StrapiToZohoIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiToZohoIntegrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends StrapiToZohoIntegrationAggregateArgs>(
      args: Subset<T, StrapiToZohoIntegrationAggregateArgs>,
    ): PrismaPromise<GetStrapiToZohoIntegrationAggregateType<T>>;

    /**
     * Group by StrapiToZohoIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiToZohoIntegrationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends StrapiToZohoIntegrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StrapiToZohoIntegrationGroupByArgs["orderBy"] }
        : { orderBy?: StrapiToZohoIntegrationGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<
        T,
        StrapiToZohoIntegrationGroupByArgs,
        OrderByArg
      > &
        InputErrors,
    ): {} extends InputErrors
      ? GetStrapiToZohoIntegrationGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StrapiToZohoIntegration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__StrapiToZohoIntegrationClient<T>
    implements PrismaPromise<T>
  {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    subscription<T extends SubscriptionArgs = {}>(
      args?: Subset<T, SubscriptionArgs>,
    ): CheckSelect<
      T,
      Prisma__SubscriptionClient<Subscription | null>,
      Prisma__SubscriptionClient<SubscriptionGetPayload<T> | null>
    >;

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    strapiApp<T extends StrapiAppArgs = {}>(
      args?: Subset<T, StrapiAppArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiAppClient<StrapiApp | null>,
      Prisma__StrapiAppClient<StrapiAppGetPayload<T> | null>
    >;

    zohoApp<T extends ZohoAppArgs = {}>(
      args?: Subset<T, ZohoAppArgs>,
    ): CheckSelect<
      T,
      Prisma__ZohoAppClient<ZohoApp | null>,
      Prisma__ZohoAppClient<ZohoAppGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * StrapiToZohoIntegration findUnique
   */
  export type StrapiToZohoIntegrationFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the StrapiToZohoIntegration
     *
     **/
    select?: StrapiToZohoIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiToZohoIntegrationInclude | null;
    /**
     * Throw an Error if a StrapiToZohoIntegration can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which StrapiToZohoIntegration to fetch.
     *
     **/
    where: StrapiToZohoIntegrationWhereUniqueInput;
  };

  /**
   * StrapiToZohoIntegration findFirst
   */
  export type StrapiToZohoIntegrationFindFirstArgs = {
    /**
     * Select specific fields to fetch from the StrapiToZohoIntegration
     *
     **/
    select?: StrapiToZohoIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiToZohoIntegrationInclude | null;
    /**
     * Throw an Error if a StrapiToZohoIntegration can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which StrapiToZohoIntegration to fetch.
     *
     **/
    where?: StrapiToZohoIntegrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StrapiToZohoIntegrations to fetch.
     *
     **/
    orderBy?: Enumerable<StrapiToZohoIntegrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for StrapiToZohoIntegrations.
     *
     **/
    cursor?: StrapiToZohoIntegrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StrapiToZohoIntegrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StrapiToZohoIntegrations.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of StrapiToZohoIntegrations.
     *
     **/
    distinct?: Enumerable<StrapiToZohoIntegrationScalarFieldEnum>;
  };

  /**
   * StrapiToZohoIntegration findMany
   */
  export type StrapiToZohoIntegrationFindManyArgs = {
    /**
     * Select specific fields to fetch from the StrapiToZohoIntegration
     *
     **/
    select?: StrapiToZohoIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiToZohoIntegrationInclude | null;
    /**
     * Filter, which StrapiToZohoIntegrations to fetch.
     *
     **/
    where?: StrapiToZohoIntegrationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StrapiToZohoIntegrations to fetch.
     *
     **/
    orderBy?: Enumerable<StrapiToZohoIntegrationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing StrapiToZohoIntegrations.
     *
     **/
    cursor?: StrapiToZohoIntegrationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StrapiToZohoIntegrations from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StrapiToZohoIntegrations.
     *
     **/
    skip?: number;
    distinct?: Enumerable<StrapiToZohoIntegrationScalarFieldEnum>;
  };

  /**
   * StrapiToZohoIntegration create
   */
  export type StrapiToZohoIntegrationCreateArgs = {
    /**
     * Select specific fields to fetch from the StrapiToZohoIntegration
     *
     **/
    select?: StrapiToZohoIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiToZohoIntegrationInclude | null;
    /**
     * The data needed to create a StrapiToZohoIntegration.
     *
     **/
    data: XOR<
      StrapiToZohoIntegrationCreateInput,
      StrapiToZohoIntegrationUncheckedCreateInput
    >;
  };

  /**
   * StrapiToZohoIntegration createMany
   */
  export type StrapiToZohoIntegrationCreateManyArgs = {
    data: Enumerable<StrapiToZohoIntegrationCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * StrapiToZohoIntegration update
   */
  export type StrapiToZohoIntegrationUpdateArgs = {
    /**
     * Select specific fields to fetch from the StrapiToZohoIntegration
     *
     **/
    select?: StrapiToZohoIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiToZohoIntegrationInclude | null;
    /**
     * The data needed to update a StrapiToZohoIntegration.
     *
     **/
    data: XOR<
      StrapiToZohoIntegrationUpdateInput,
      StrapiToZohoIntegrationUncheckedUpdateInput
    >;
    /**
     * Choose, which StrapiToZohoIntegration to update.
     *
     **/
    where: StrapiToZohoIntegrationWhereUniqueInput;
  };

  /**
   * StrapiToZohoIntegration updateMany
   */
  export type StrapiToZohoIntegrationUpdateManyArgs = {
    data: XOR<
      StrapiToZohoIntegrationUpdateManyMutationInput,
      StrapiToZohoIntegrationUncheckedUpdateManyInput
    >;
    where?: StrapiToZohoIntegrationWhereInput;
  };

  /**
   * StrapiToZohoIntegration upsert
   */
  export type StrapiToZohoIntegrationUpsertArgs = {
    /**
     * Select specific fields to fetch from the StrapiToZohoIntegration
     *
     **/
    select?: StrapiToZohoIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiToZohoIntegrationInclude | null;
    /**
     * The filter to search for the StrapiToZohoIntegration to update in case it exists.
     *
     **/
    where: StrapiToZohoIntegrationWhereUniqueInput;
    /**
     * In case the StrapiToZohoIntegration found by the `where` argument doesn't exist, create a new StrapiToZohoIntegration with this data.
     *
     **/
    create: XOR<
      StrapiToZohoIntegrationCreateInput,
      StrapiToZohoIntegrationUncheckedCreateInput
    >;
    /**
     * In case the StrapiToZohoIntegration was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      StrapiToZohoIntegrationUpdateInput,
      StrapiToZohoIntegrationUncheckedUpdateInput
    >;
  };

  /**
   * StrapiToZohoIntegration delete
   */
  export type StrapiToZohoIntegrationDeleteArgs = {
    /**
     * Select specific fields to fetch from the StrapiToZohoIntegration
     *
     **/
    select?: StrapiToZohoIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiToZohoIntegrationInclude | null;
    /**
     * Filter which StrapiToZohoIntegration to delete.
     *
     **/
    where: StrapiToZohoIntegrationWhereUniqueInput;
  };

  /**
   * StrapiToZohoIntegration deleteMany
   */
  export type StrapiToZohoIntegrationDeleteManyArgs = {
    where?: StrapiToZohoIntegrationWhereInput;
  };

  /**
   * StrapiToZohoIntegration without action
   */
  export type StrapiToZohoIntegrationArgs = {
    /**
     * Select specific fields to fetch from the StrapiToZohoIntegration
     *
     **/
    select?: StrapiToZohoIntegrationSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiToZohoIntegrationInclude | null;
  };

  /**
   * Model StrapiApp
   */

  export type AggregateStrapiApp = {
    _count: StrapiAppCountAggregateOutputType | null;
    _min: StrapiAppMinAggregateOutputType | null;
    _max: StrapiAppMaxAggregateOutputType | null;
  };

  export type StrapiAppMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    tenantId: string | null;
  };

  export type StrapiAppMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    tenantId: string | null;
  };

  export type StrapiAppCountAggregateOutputType = {
    id: number;
    name: number;
    tenantId: number;
    _all: number;
  };

  export type StrapiAppMinAggregateInputType = {
    id?: true;
    name?: true;
    tenantId?: true;
  };

  export type StrapiAppMaxAggregateInputType = {
    id?: true;
    name?: true;
    tenantId?: true;
  };

  export type StrapiAppCountAggregateInputType = {
    id?: true;
    name?: true;
    tenantId?: true;
    _all?: true;
  };

  export type StrapiAppAggregateArgs = {
    /**
     * Filter which StrapiApp to aggregate.
     *
     **/
    where?: StrapiAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StrapiApps to fetch.
     *
     **/
    orderBy?: Enumerable<StrapiAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: StrapiAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StrapiApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StrapiApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned StrapiApps
     **/
    _count?: true | StrapiAppCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: StrapiAppMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: StrapiAppMaxAggregateInputType;
  };

  export type GetStrapiAppAggregateType<T extends StrapiAppAggregateArgs> = {
    [P in keyof T & keyof AggregateStrapiApp]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStrapiApp[P]>
      : GetScalarType<T[P], AggregateStrapiApp[P]>;
  };

  export type StrapiAppGroupByArgs = {
    where?: StrapiAppWhereInput;
    orderBy?: Enumerable<StrapiAppOrderByWithAggregationInput>;
    by: Array<StrapiAppScalarFieldEnum>;
    having?: StrapiAppScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StrapiAppCountAggregateInputType | true;
    _min?: StrapiAppMinAggregateInputType;
    _max?: StrapiAppMaxAggregateInputType;
  };

  export type StrapiAppGroupByOutputType = {
    id: string;
    name: string;
    tenantId: string;
    _count: StrapiAppCountAggregateOutputType | null;
    _min: StrapiAppMinAggregateOutputType | null;
    _max: StrapiAppMaxAggregateOutputType | null;
  };

  type GetStrapiAppGroupByPayload<T extends StrapiAppGroupByArgs> = Promise<
    Array<
      PickArray<StrapiAppGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof StrapiAppGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], StrapiAppGroupByOutputType[P]>
          : GetScalarType<T[P], StrapiAppGroupByOutputType[P]>;
      }
    >
  >;

  export type StrapiAppSelect = {
    id?: boolean;
    name?: boolean;
    webhooks?: boolean | IncomingStrapiWebhookFindManyArgs;
    tenant?: boolean | TenantArgs;
    tenantId?: boolean;
    integration?: boolean | StrapiToZohoIntegrationArgs;
    _count?: boolean | StrapiAppCountOutputTypeArgs;
  };

  export type StrapiAppInclude = {
    webhooks?: boolean | IncomingStrapiWebhookFindManyArgs;
    tenant?: boolean | TenantArgs;
    integration?: boolean | StrapiToZohoIntegrationArgs;
    _count?: boolean | StrapiAppCountOutputTypeArgs;
  };

  export type StrapiAppGetPayload<
    S extends boolean | null | undefined | StrapiAppArgs,
    U = keyof S,
  > = S extends true
    ? StrapiApp
    : S extends undefined
    ? never
    : S extends StrapiAppArgs | StrapiAppFindManyArgs
    ? "include" extends U
      ? StrapiApp & {
          [P in TrueKeys<S["include"]>]: P extends "webhooks"
            ? Array<IncomingStrapiWebhookGetPayload<S["include"][P]>>
            : P extends "tenant"
            ? TenantGetPayload<S["include"][P]>
            : P extends "integration"
            ? StrapiToZohoIntegrationGetPayload<S["include"][P]> | null
            : P extends "_count"
            ? StrapiAppCountOutputTypeGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof StrapiApp
            ? StrapiApp[P]
            : P extends "webhooks"
            ? Array<IncomingStrapiWebhookGetPayload<S["select"][P]>>
            : P extends "tenant"
            ? TenantGetPayload<S["select"][P]>
            : P extends "integration"
            ? StrapiToZohoIntegrationGetPayload<S["select"][P]> | null
            : P extends "_count"
            ? StrapiAppCountOutputTypeGetPayload<S["select"][P]>
            : never;
        }
      : StrapiApp
    : StrapiApp;

  type StrapiAppCountArgs = Merge<
    Omit<StrapiAppFindManyArgs, "select" | "include"> & {
      select?: StrapiAppCountAggregateInputType | true;
    }
  >;

  export interface StrapiAppDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one StrapiApp that matches the filter.
     * @param {StrapiAppFindUniqueArgs} args - Arguments to find a StrapiApp
     * @example
     * // Get one StrapiApp
     * const strapiApp = await prisma.strapiApp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends StrapiAppFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, StrapiAppFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "StrapiApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__StrapiAppClient<StrapiApp>,
          Prisma__StrapiAppClient<StrapiAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__StrapiAppClient<StrapiApp | null>,
          Prisma__StrapiAppClient<StrapiAppGetPayload<T> | null>
        >;

    /**
     * Find the first StrapiApp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiAppFindFirstArgs} args - Arguments to find a StrapiApp
     * @example
     * // Get one StrapiApp
     * const strapiApp = await prisma.strapiApp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends StrapiAppFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, StrapiAppFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "StrapiApp"
    > extends True
      ? CheckSelect<
          T,
          Prisma__StrapiAppClient<StrapiApp>,
          Prisma__StrapiAppClient<StrapiAppGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__StrapiAppClient<StrapiApp | null>,
          Prisma__StrapiAppClient<StrapiAppGetPayload<T> | null>
        >;

    /**
     * Find zero or more StrapiApps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiAppFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StrapiApps
     * const strapiApps = await prisma.strapiApp.findMany()
     *
     * // Get first 10 StrapiApps
     * const strapiApps = await prisma.strapiApp.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const strapiAppWithIdOnly = await prisma.strapiApp.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends StrapiAppFindManyArgs>(
      args?: SelectSubset<T, StrapiAppFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<StrapiApp>>,
      PrismaPromise<Array<StrapiAppGetPayload<T>>>
    >;

    /**
     * Create a StrapiApp.
     * @param {StrapiAppCreateArgs} args - Arguments to create a StrapiApp.
     * @example
     * // Create one StrapiApp
     * const StrapiApp = await prisma.strapiApp.create({
     *   data: {
     *     // ... data to create a StrapiApp
     *   }
     * })
     *
     **/
    create<T extends StrapiAppCreateArgs>(
      args: SelectSubset<T, StrapiAppCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiAppClient<StrapiApp>,
      Prisma__StrapiAppClient<StrapiAppGetPayload<T>>
    >;

    /**
     * Create many StrapiApps.
     *     @param {StrapiAppCreateManyArgs} args - Arguments to create many StrapiApps.
     *     @example
     *     // Create many StrapiApps
     *     const strapiApp = await prisma.strapiApp.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends StrapiAppCreateManyArgs>(
      args?: SelectSubset<T, StrapiAppCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a StrapiApp.
     * @param {StrapiAppDeleteArgs} args - Arguments to delete one StrapiApp.
     * @example
     * // Delete one StrapiApp
     * const StrapiApp = await prisma.strapiApp.delete({
     *   where: {
     *     // ... filter to delete one StrapiApp
     *   }
     * })
     *
     **/
    delete<T extends StrapiAppDeleteArgs>(
      args: SelectSubset<T, StrapiAppDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiAppClient<StrapiApp>,
      Prisma__StrapiAppClient<StrapiAppGetPayload<T>>
    >;

    /**
     * Update one StrapiApp.
     * @param {StrapiAppUpdateArgs} args - Arguments to update one StrapiApp.
     * @example
     * // Update one StrapiApp
     * const strapiApp = await prisma.strapiApp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends StrapiAppUpdateArgs>(
      args: SelectSubset<T, StrapiAppUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiAppClient<StrapiApp>,
      Prisma__StrapiAppClient<StrapiAppGetPayload<T>>
    >;

    /**
     * Delete zero or more StrapiApps.
     * @param {StrapiAppDeleteManyArgs} args - Arguments to filter StrapiApps to delete.
     * @example
     * // Delete a few StrapiApps
     * const { count } = await prisma.strapiApp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends StrapiAppDeleteManyArgs>(
      args?: SelectSubset<T, StrapiAppDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more StrapiApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiAppUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StrapiApps
     * const strapiApp = await prisma.strapiApp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends StrapiAppUpdateManyArgs>(
      args: SelectSubset<T, StrapiAppUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one StrapiApp.
     * @param {StrapiAppUpsertArgs} args - Arguments to update or create a StrapiApp.
     * @example
     * // Update or create a StrapiApp
     * const strapiApp = await prisma.strapiApp.upsert({
     *   create: {
     *     // ... data to create a StrapiApp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StrapiApp we want to update
     *   }
     * })
     **/
    upsert<T extends StrapiAppUpsertArgs>(
      args: SelectSubset<T, StrapiAppUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiAppClient<StrapiApp>,
      Prisma__StrapiAppClient<StrapiAppGetPayload<T>>
    >;

    /**
     * Count the number of StrapiApps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiAppCountArgs} args - Arguments to filter StrapiApps to count.
     * @example
     * // Count the number of StrapiApps
     * const count = await prisma.strapiApp.count({
     *   where: {
     *     // ... the filter for the StrapiApps we want to count
     *   }
     * })
     **/
    count<T extends StrapiAppCountArgs>(
      args?: Subset<T, StrapiAppCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], StrapiAppCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a StrapiApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiAppAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends StrapiAppAggregateArgs>(
      args: Subset<T, StrapiAppAggregateArgs>,
    ): PrismaPromise<GetStrapiAppAggregateType<T>>;

    /**
     * Group by StrapiApp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrapiAppGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends StrapiAppGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StrapiAppGroupByArgs["orderBy"] }
        : { orderBy?: StrapiAppGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, StrapiAppGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetStrapiAppGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StrapiApp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__StrapiAppClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    webhooks<T extends IncomingStrapiWebhookFindManyArgs = {}>(
      args?: Subset<T, IncomingStrapiWebhookFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<IncomingStrapiWebhook>>,
      PrismaPromise<Array<IncomingStrapiWebhookGetPayload<T>>>
    >;

    tenant<T extends TenantArgs = {}>(
      args?: Subset<T, TenantArgs>,
    ): CheckSelect<
      T,
      Prisma__TenantClient<Tenant | null>,
      Prisma__TenantClient<TenantGetPayload<T> | null>
    >;

    integration<T extends StrapiToZohoIntegrationArgs = {}>(
      args?: Subset<T, StrapiToZohoIntegrationArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegration | null>,
      Prisma__StrapiToZohoIntegrationClient<StrapiToZohoIntegrationGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * StrapiApp findUnique
   */
  export type StrapiAppFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the StrapiApp
     *
     **/
    select?: StrapiAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiAppInclude | null;
    /**
     * Throw an Error if a StrapiApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which StrapiApp to fetch.
     *
     **/
    where: StrapiAppWhereUniqueInput;
  };

  /**
   * StrapiApp findFirst
   */
  export type StrapiAppFindFirstArgs = {
    /**
     * Select specific fields to fetch from the StrapiApp
     *
     **/
    select?: StrapiAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiAppInclude | null;
    /**
     * Throw an Error if a StrapiApp can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which StrapiApp to fetch.
     *
     **/
    where?: StrapiAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StrapiApps to fetch.
     *
     **/
    orderBy?: Enumerable<StrapiAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for StrapiApps.
     *
     **/
    cursor?: StrapiAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StrapiApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StrapiApps.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of StrapiApps.
     *
     **/
    distinct?: Enumerable<StrapiAppScalarFieldEnum>;
  };

  /**
   * StrapiApp findMany
   */
  export type StrapiAppFindManyArgs = {
    /**
     * Select specific fields to fetch from the StrapiApp
     *
     **/
    select?: StrapiAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiAppInclude | null;
    /**
     * Filter, which StrapiApps to fetch.
     *
     **/
    where?: StrapiAppWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of StrapiApps to fetch.
     *
     **/
    orderBy?: Enumerable<StrapiAppOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing StrapiApps.
     *
     **/
    cursor?: StrapiAppWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` StrapiApps from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` StrapiApps.
     *
     **/
    skip?: number;
    distinct?: Enumerable<StrapiAppScalarFieldEnum>;
  };

  /**
   * StrapiApp create
   */
  export type StrapiAppCreateArgs = {
    /**
     * Select specific fields to fetch from the StrapiApp
     *
     **/
    select?: StrapiAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiAppInclude | null;
    /**
     * The data needed to create a StrapiApp.
     *
     **/
    data: XOR<StrapiAppCreateInput, StrapiAppUncheckedCreateInput>;
  };

  /**
   * StrapiApp createMany
   */
  export type StrapiAppCreateManyArgs = {
    data: Enumerable<StrapiAppCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * StrapiApp update
   */
  export type StrapiAppUpdateArgs = {
    /**
     * Select specific fields to fetch from the StrapiApp
     *
     **/
    select?: StrapiAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiAppInclude | null;
    /**
     * The data needed to update a StrapiApp.
     *
     **/
    data: XOR<StrapiAppUpdateInput, StrapiAppUncheckedUpdateInput>;
    /**
     * Choose, which StrapiApp to update.
     *
     **/
    where: StrapiAppWhereUniqueInput;
  };

  /**
   * StrapiApp updateMany
   */
  export type StrapiAppUpdateManyArgs = {
    data: XOR<
      StrapiAppUpdateManyMutationInput,
      StrapiAppUncheckedUpdateManyInput
    >;
    where?: StrapiAppWhereInput;
  };

  /**
   * StrapiApp upsert
   */
  export type StrapiAppUpsertArgs = {
    /**
     * Select specific fields to fetch from the StrapiApp
     *
     **/
    select?: StrapiAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiAppInclude | null;
    /**
     * The filter to search for the StrapiApp to update in case it exists.
     *
     **/
    where: StrapiAppWhereUniqueInput;
    /**
     * In case the StrapiApp found by the `where` argument doesn't exist, create a new StrapiApp with this data.
     *
     **/
    create: XOR<StrapiAppCreateInput, StrapiAppUncheckedCreateInput>;
    /**
     * In case the StrapiApp was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<StrapiAppUpdateInput, StrapiAppUncheckedUpdateInput>;
  };

  /**
   * StrapiApp delete
   */
  export type StrapiAppDeleteArgs = {
    /**
     * Select specific fields to fetch from the StrapiApp
     *
     **/
    select?: StrapiAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiAppInclude | null;
    /**
     * Filter which StrapiApp to delete.
     *
     **/
    where: StrapiAppWhereUniqueInput;
  };

  /**
   * StrapiApp deleteMany
   */
  export type StrapiAppDeleteManyArgs = {
    where?: StrapiAppWhereInput;
  };

  /**
   * StrapiApp without action
   */
  export type StrapiAppArgs = {
    /**
     * Select specific fields to fetch from the StrapiApp
     *
     **/
    select?: StrapiAppSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: StrapiAppInclude | null;
  };

  /**
   * Model IncomingSaleorWebhook
   */

  export type AggregateIncomingSaleorWebhook = {
    _count: IncomingSaleorWebhookCountAggregateOutputType | null;
    _min: IncomingSaleorWebhookMinAggregateOutputType | null;
    _max: IncomingSaleorWebhookMaxAggregateOutputType | null;
  };

  export type IncomingSaleorWebhookMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    secretId: string | null;
    installedSaleorAppId: string | null;
  };

  export type IncomingSaleorWebhookMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    secretId: string | null;
    installedSaleorAppId: string | null;
  };

  export type IncomingSaleorWebhookCountAggregateOutputType = {
    id: number;
    name: number;
    createdAt: number;
    updatedAt: number;
    secretId: number;
    installedSaleorAppId: number;
    _all: number;
  };

  export type IncomingSaleorWebhookMinAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    secretId?: true;
    installedSaleorAppId?: true;
  };

  export type IncomingSaleorWebhookMaxAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    secretId?: true;
    installedSaleorAppId?: true;
  };

  export type IncomingSaleorWebhookCountAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    secretId?: true;
    installedSaleorAppId?: true;
    _all?: true;
  };

  export type IncomingSaleorWebhookAggregateArgs = {
    /**
     * Filter which IncomingSaleorWebhook to aggregate.
     *
     **/
    where?: IncomingSaleorWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingSaleorWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingSaleorWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: IncomingSaleorWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingSaleorWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingSaleorWebhooks.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned IncomingSaleorWebhooks
     **/
    _count?: true | IncomingSaleorWebhookCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: IncomingSaleorWebhookMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: IncomingSaleorWebhookMaxAggregateInputType;
  };

  export type GetIncomingSaleorWebhookAggregateType<
    T extends IncomingSaleorWebhookAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateIncomingSaleorWebhook]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIncomingSaleorWebhook[P]>
      : GetScalarType<T[P], AggregateIncomingSaleorWebhook[P]>;
  };

  export type IncomingSaleorWebhookGroupByArgs = {
    where?: IncomingSaleorWebhookWhereInput;
    orderBy?: Enumerable<IncomingSaleorWebhookOrderByWithAggregationInput>;
    by: Array<IncomingSaleorWebhookScalarFieldEnum>;
    having?: IncomingSaleorWebhookScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IncomingSaleorWebhookCountAggregateInputType | true;
    _min?: IncomingSaleorWebhookMinAggregateInputType;
    _max?: IncomingSaleorWebhookMaxAggregateInputType;
  };

  export type IncomingSaleorWebhookGroupByOutputType = {
    id: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    secretId: string;
    installedSaleorAppId: string;
    _count: IncomingSaleorWebhookCountAggregateOutputType | null;
    _min: IncomingSaleorWebhookMinAggregateOutputType | null;
    _max: IncomingSaleorWebhookMaxAggregateOutputType | null;
  };

  type GetIncomingSaleorWebhookGroupByPayload<
    T extends IncomingSaleorWebhookGroupByArgs,
  > = Promise<
    Array<
      PickArray<IncomingSaleorWebhookGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof IncomingSaleorWebhookGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], IncomingSaleorWebhookGroupByOutputType[P]>
          : GetScalarType<T[P], IncomingSaleorWebhookGroupByOutputType[P]>;
      }
    >
  >;

  export type IncomingSaleorWebhookSelect = {
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    secret?: boolean | SecretKeyArgs;
    secretId?: boolean;
    installedSaleorApp?: boolean | InstalledSaleorAppArgs;
    installedSaleorAppId?: boolean;
  };

  export type IncomingSaleorWebhookInclude = {
    secret?: boolean | SecretKeyArgs;
    installedSaleorApp?: boolean | InstalledSaleorAppArgs;
  };

  export type IncomingSaleorWebhookGetPayload<
    S extends boolean | null | undefined | IncomingSaleorWebhookArgs,
    U = keyof S,
  > = S extends true
    ? IncomingSaleorWebhook
    : S extends undefined
    ? never
    : S extends IncomingSaleorWebhookArgs | IncomingSaleorWebhookFindManyArgs
    ? "include" extends U
      ? IncomingSaleorWebhook & {
          [P in TrueKeys<S["include"]>]: P extends "secret"
            ? SecretKeyGetPayload<S["include"][P]>
            : P extends "installedSaleorApp"
            ? InstalledSaleorAppGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof IncomingSaleorWebhook
            ? IncomingSaleorWebhook[P]
            : P extends "secret"
            ? SecretKeyGetPayload<S["select"][P]>
            : P extends "installedSaleorApp"
            ? InstalledSaleorAppGetPayload<S["select"][P]>
            : never;
        }
      : IncomingSaleorWebhook
    : IncomingSaleorWebhook;

  type IncomingSaleorWebhookCountArgs = Merge<
    Omit<IncomingSaleorWebhookFindManyArgs, "select" | "include"> & {
      select?: IncomingSaleorWebhookCountAggregateInputType | true;
    }
  >;

  export interface IncomingSaleorWebhookDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one IncomingSaleorWebhook that matches the filter.
     * @param {IncomingSaleorWebhookFindUniqueArgs} args - Arguments to find a IncomingSaleorWebhook
     * @example
     * // Get one IncomingSaleorWebhook
     * const incomingSaleorWebhook = await prisma.incomingSaleorWebhook.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends IncomingSaleorWebhookFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, IncomingSaleorWebhookFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "IncomingSaleorWebhook"
    > extends True
      ? CheckSelect<
          T,
          Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhook>,
          Prisma__IncomingSaleorWebhookClient<
            IncomingSaleorWebhookGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhook | null>,
          Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhookGetPayload<T> | null>
        >;

    /**
     * Find the first IncomingSaleorWebhook that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingSaleorWebhookFindFirstArgs} args - Arguments to find a IncomingSaleorWebhook
     * @example
     * // Get one IncomingSaleorWebhook
     * const incomingSaleorWebhook = await prisma.incomingSaleorWebhook.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends IncomingSaleorWebhookFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, IncomingSaleorWebhookFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "IncomingSaleorWebhook"
    > extends True
      ? CheckSelect<
          T,
          Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhook>,
          Prisma__IncomingSaleorWebhookClient<
            IncomingSaleorWebhookGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhook | null>,
          Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhookGetPayload<T> | null>
        >;

    /**
     * Find zero or more IncomingSaleorWebhooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingSaleorWebhookFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IncomingSaleorWebhooks
     * const incomingSaleorWebhooks = await prisma.incomingSaleorWebhook.findMany()
     *
     * // Get first 10 IncomingSaleorWebhooks
     * const incomingSaleorWebhooks = await prisma.incomingSaleorWebhook.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const incomingSaleorWebhookWithIdOnly = await prisma.incomingSaleorWebhook.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends IncomingSaleorWebhookFindManyArgs>(
      args?: SelectSubset<T, IncomingSaleorWebhookFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<IncomingSaleorWebhook>>,
      PrismaPromise<Array<IncomingSaleorWebhookGetPayload<T>>>
    >;

    /**
     * Create a IncomingSaleorWebhook.
     * @param {IncomingSaleorWebhookCreateArgs} args - Arguments to create a IncomingSaleorWebhook.
     * @example
     * // Create one IncomingSaleorWebhook
     * const IncomingSaleorWebhook = await prisma.incomingSaleorWebhook.create({
     *   data: {
     *     // ... data to create a IncomingSaleorWebhook
     *   }
     * })
     *
     **/
    create<T extends IncomingSaleorWebhookCreateArgs>(
      args: SelectSubset<T, IncomingSaleorWebhookCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhook>,
      Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhookGetPayload<T>>
    >;

    /**
     * Create many IncomingSaleorWebhooks.
     *     @param {IncomingSaleorWebhookCreateManyArgs} args - Arguments to create many IncomingSaleorWebhooks.
     *     @example
     *     // Create many IncomingSaleorWebhooks
     *     const incomingSaleorWebhook = await prisma.incomingSaleorWebhook.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends IncomingSaleorWebhookCreateManyArgs>(
      args?: SelectSubset<T, IncomingSaleorWebhookCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a IncomingSaleorWebhook.
     * @param {IncomingSaleorWebhookDeleteArgs} args - Arguments to delete one IncomingSaleorWebhook.
     * @example
     * // Delete one IncomingSaleorWebhook
     * const IncomingSaleorWebhook = await prisma.incomingSaleorWebhook.delete({
     *   where: {
     *     // ... filter to delete one IncomingSaleorWebhook
     *   }
     * })
     *
     **/
    delete<T extends IncomingSaleorWebhookDeleteArgs>(
      args: SelectSubset<T, IncomingSaleorWebhookDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhook>,
      Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhookGetPayload<T>>
    >;

    /**
     * Update one IncomingSaleorWebhook.
     * @param {IncomingSaleorWebhookUpdateArgs} args - Arguments to update one IncomingSaleorWebhook.
     * @example
     * // Update one IncomingSaleorWebhook
     * const incomingSaleorWebhook = await prisma.incomingSaleorWebhook.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends IncomingSaleorWebhookUpdateArgs>(
      args: SelectSubset<T, IncomingSaleorWebhookUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhook>,
      Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhookGetPayload<T>>
    >;

    /**
     * Delete zero or more IncomingSaleorWebhooks.
     * @param {IncomingSaleorWebhookDeleteManyArgs} args - Arguments to filter IncomingSaleorWebhooks to delete.
     * @example
     * // Delete a few IncomingSaleorWebhooks
     * const { count } = await prisma.incomingSaleorWebhook.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends IncomingSaleorWebhookDeleteManyArgs>(
      args?: SelectSubset<T, IncomingSaleorWebhookDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more IncomingSaleorWebhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingSaleorWebhookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IncomingSaleorWebhooks
     * const incomingSaleorWebhook = await prisma.incomingSaleorWebhook.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends IncomingSaleorWebhookUpdateManyArgs>(
      args: SelectSubset<T, IncomingSaleorWebhookUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one IncomingSaleorWebhook.
     * @param {IncomingSaleorWebhookUpsertArgs} args - Arguments to update or create a IncomingSaleorWebhook.
     * @example
     * // Update or create a IncomingSaleorWebhook
     * const incomingSaleorWebhook = await prisma.incomingSaleorWebhook.upsert({
     *   create: {
     *     // ... data to create a IncomingSaleorWebhook
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IncomingSaleorWebhook we want to update
     *   }
     * })
     **/
    upsert<T extends IncomingSaleorWebhookUpsertArgs>(
      args: SelectSubset<T, IncomingSaleorWebhookUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhook>,
      Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhookGetPayload<T>>
    >;

    /**
     * Count the number of IncomingSaleorWebhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingSaleorWebhookCountArgs} args - Arguments to filter IncomingSaleorWebhooks to count.
     * @example
     * // Count the number of IncomingSaleorWebhooks
     * const count = await prisma.incomingSaleorWebhook.count({
     *   where: {
     *     // ... the filter for the IncomingSaleorWebhooks we want to count
     *   }
     * })
     **/
    count<T extends IncomingSaleorWebhookCountArgs>(
      args?: Subset<T, IncomingSaleorWebhookCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              IncomingSaleorWebhookCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a IncomingSaleorWebhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingSaleorWebhookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends IncomingSaleorWebhookAggregateArgs>(
      args: Subset<T, IncomingSaleorWebhookAggregateArgs>,
    ): PrismaPromise<GetIncomingSaleorWebhookAggregateType<T>>;

    /**
     * Group by IncomingSaleorWebhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingSaleorWebhookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends IncomingSaleorWebhookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IncomingSaleorWebhookGroupByArgs["orderBy"] }
        : { orderBy?: IncomingSaleorWebhookGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<
        T,
        IncomingSaleorWebhookGroupByArgs,
        OrderByArg
      > &
        InputErrors,
    ): {} extends InputErrors
      ? GetIncomingSaleorWebhookGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IncomingSaleorWebhook.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__IncomingSaleorWebhookClient<T>
    implements PrismaPromise<T>
  {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    secret<T extends SecretKeyArgs = {}>(
      args?: Subset<T, SecretKeyArgs>,
    ): CheckSelect<
      T,
      Prisma__SecretKeyClient<SecretKey | null>,
      Prisma__SecretKeyClient<SecretKeyGetPayload<T> | null>
    >;

    installedSaleorApp<T extends InstalledSaleorAppArgs = {}>(
      args?: Subset<T, InstalledSaleorAppArgs>,
    ): CheckSelect<
      T,
      Prisma__InstalledSaleorAppClient<InstalledSaleorApp | null>,
      Prisma__InstalledSaleorAppClient<InstalledSaleorAppGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * IncomingSaleorWebhook findUnique
   */
  export type IncomingSaleorWebhookFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the IncomingSaleorWebhook
     *
     **/
    select?: IncomingSaleorWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingSaleorWebhookInclude | null;
    /**
     * Throw an Error if a IncomingSaleorWebhook can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which IncomingSaleorWebhook to fetch.
     *
     **/
    where: IncomingSaleorWebhookWhereUniqueInput;
  };

  /**
   * IncomingSaleorWebhook findFirst
   */
  export type IncomingSaleorWebhookFindFirstArgs = {
    /**
     * Select specific fields to fetch from the IncomingSaleorWebhook
     *
     **/
    select?: IncomingSaleorWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingSaleorWebhookInclude | null;
    /**
     * Throw an Error if a IncomingSaleorWebhook can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which IncomingSaleorWebhook to fetch.
     *
     **/
    where?: IncomingSaleorWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingSaleorWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingSaleorWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for IncomingSaleorWebhooks.
     *
     **/
    cursor?: IncomingSaleorWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingSaleorWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingSaleorWebhooks.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IncomingSaleorWebhooks.
     *
     **/
    distinct?: Enumerable<IncomingSaleorWebhookScalarFieldEnum>;
  };

  /**
   * IncomingSaleorWebhook findMany
   */
  export type IncomingSaleorWebhookFindManyArgs = {
    /**
     * Select specific fields to fetch from the IncomingSaleorWebhook
     *
     **/
    select?: IncomingSaleorWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingSaleorWebhookInclude | null;
    /**
     * Filter, which IncomingSaleorWebhooks to fetch.
     *
     **/
    where?: IncomingSaleorWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingSaleorWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingSaleorWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing IncomingSaleorWebhooks.
     *
     **/
    cursor?: IncomingSaleorWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingSaleorWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingSaleorWebhooks.
     *
     **/
    skip?: number;
    distinct?: Enumerable<IncomingSaleorWebhookScalarFieldEnum>;
  };

  /**
   * IncomingSaleorWebhook create
   */
  export type IncomingSaleorWebhookCreateArgs = {
    /**
     * Select specific fields to fetch from the IncomingSaleorWebhook
     *
     **/
    select?: IncomingSaleorWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingSaleorWebhookInclude | null;
    /**
     * The data needed to create a IncomingSaleorWebhook.
     *
     **/
    data: XOR<
      IncomingSaleorWebhookCreateInput,
      IncomingSaleorWebhookUncheckedCreateInput
    >;
  };

  /**
   * IncomingSaleorWebhook createMany
   */
  export type IncomingSaleorWebhookCreateManyArgs = {
    data: Enumerable<IncomingSaleorWebhookCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * IncomingSaleorWebhook update
   */
  export type IncomingSaleorWebhookUpdateArgs = {
    /**
     * Select specific fields to fetch from the IncomingSaleorWebhook
     *
     **/
    select?: IncomingSaleorWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingSaleorWebhookInclude | null;
    /**
     * The data needed to update a IncomingSaleorWebhook.
     *
     **/
    data: XOR<
      IncomingSaleorWebhookUpdateInput,
      IncomingSaleorWebhookUncheckedUpdateInput
    >;
    /**
     * Choose, which IncomingSaleorWebhook to update.
     *
     **/
    where: IncomingSaleorWebhookWhereUniqueInput;
  };

  /**
   * IncomingSaleorWebhook updateMany
   */
  export type IncomingSaleorWebhookUpdateManyArgs = {
    data: XOR<
      IncomingSaleorWebhookUpdateManyMutationInput,
      IncomingSaleorWebhookUncheckedUpdateManyInput
    >;
    where?: IncomingSaleorWebhookWhereInput;
  };

  /**
   * IncomingSaleorWebhook upsert
   */
  export type IncomingSaleorWebhookUpsertArgs = {
    /**
     * Select specific fields to fetch from the IncomingSaleorWebhook
     *
     **/
    select?: IncomingSaleorWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingSaleorWebhookInclude | null;
    /**
     * The filter to search for the IncomingSaleorWebhook to update in case it exists.
     *
     **/
    where: IncomingSaleorWebhookWhereUniqueInput;
    /**
     * In case the IncomingSaleorWebhook found by the `where` argument doesn't exist, create a new IncomingSaleorWebhook with this data.
     *
     **/
    create: XOR<
      IncomingSaleorWebhookCreateInput,
      IncomingSaleorWebhookUncheckedCreateInput
    >;
    /**
     * In case the IncomingSaleorWebhook was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      IncomingSaleorWebhookUpdateInput,
      IncomingSaleorWebhookUncheckedUpdateInput
    >;
  };

  /**
   * IncomingSaleorWebhook delete
   */
  export type IncomingSaleorWebhookDeleteArgs = {
    /**
     * Select specific fields to fetch from the IncomingSaleorWebhook
     *
     **/
    select?: IncomingSaleorWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingSaleorWebhookInclude | null;
    /**
     * Filter which IncomingSaleorWebhook to delete.
     *
     **/
    where: IncomingSaleorWebhookWhereUniqueInput;
  };

  /**
   * IncomingSaleorWebhook deleteMany
   */
  export type IncomingSaleorWebhookDeleteManyArgs = {
    where?: IncomingSaleorWebhookWhereInput;
  };

  /**
   * IncomingSaleorWebhook without action
   */
  export type IncomingSaleorWebhookArgs = {
    /**
     * Select specific fields to fetch from the IncomingSaleorWebhook
     *
     **/
    select?: IncomingSaleorWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingSaleorWebhookInclude | null;
  };

  /**
   * Model IncomingStrapiWebhook
   */

  export type AggregateIncomingStrapiWebhook = {
    _count: IncomingStrapiWebhookCountAggregateOutputType | null;
    _min: IncomingStrapiWebhookMinAggregateOutputType | null;
    _max: IncomingStrapiWebhookMaxAggregateOutputType | null;
  };

  export type IncomingStrapiWebhookMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    secretId: string | null;
    strapiAppId: string | null;
  };

  export type IncomingStrapiWebhookMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    secretId: string | null;
    strapiAppId: string | null;
  };

  export type IncomingStrapiWebhookCountAggregateOutputType = {
    id: number;
    name: number;
    createdAt: number;
    updatedAt: number;
    secretId: number;
    strapiAppId: number;
    _all: number;
  };

  export type IncomingStrapiWebhookMinAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    secretId?: true;
    strapiAppId?: true;
  };

  export type IncomingStrapiWebhookMaxAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    secretId?: true;
    strapiAppId?: true;
  };

  export type IncomingStrapiWebhookCountAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    secretId?: true;
    strapiAppId?: true;
    _all?: true;
  };

  export type IncomingStrapiWebhookAggregateArgs = {
    /**
     * Filter which IncomingStrapiWebhook to aggregate.
     *
     **/
    where?: IncomingStrapiWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingStrapiWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingStrapiWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: IncomingStrapiWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingStrapiWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingStrapiWebhooks.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned IncomingStrapiWebhooks
     **/
    _count?: true | IncomingStrapiWebhookCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: IncomingStrapiWebhookMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: IncomingStrapiWebhookMaxAggregateInputType;
  };

  export type GetIncomingStrapiWebhookAggregateType<
    T extends IncomingStrapiWebhookAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateIncomingStrapiWebhook]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIncomingStrapiWebhook[P]>
      : GetScalarType<T[P], AggregateIncomingStrapiWebhook[P]>;
  };

  export type IncomingStrapiWebhookGroupByArgs = {
    where?: IncomingStrapiWebhookWhereInput;
    orderBy?: Enumerable<IncomingStrapiWebhookOrderByWithAggregationInput>;
    by: Array<IncomingStrapiWebhookScalarFieldEnum>;
    having?: IncomingStrapiWebhookScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IncomingStrapiWebhookCountAggregateInputType | true;
    _min?: IncomingStrapiWebhookMinAggregateInputType;
    _max?: IncomingStrapiWebhookMaxAggregateInputType;
  };

  export type IncomingStrapiWebhookGroupByOutputType = {
    id: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    secretId: string;
    strapiAppId: string;
    _count: IncomingStrapiWebhookCountAggregateOutputType | null;
    _min: IncomingStrapiWebhookMinAggregateOutputType | null;
    _max: IncomingStrapiWebhookMaxAggregateOutputType | null;
  };

  type GetIncomingStrapiWebhookGroupByPayload<
    T extends IncomingStrapiWebhookGroupByArgs,
  > = Promise<
    Array<
      PickArray<IncomingStrapiWebhookGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof IncomingStrapiWebhookGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], IncomingStrapiWebhookGroupByOutputType[P]>
          : GetScalarType<T[P], IncomingStrapiWebhookGroupByOutputType[P]>;
      }
    >
  >;

  export type IncomingStrapiWebhookSelect = {
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    secret?: boolean | SecretKeyArgs;
    secretId?: boolean;
    strapiApp?: boolean | StrapiAppArgs;
    strapiAppId?: boolean;
  };

  export type IncomingStrapiWebhookInclude = {
    secret?: boolean | SecretKeyArgs;
    strapiApp?: boolean | StrapiAppArgs;
  };

  export type IncomingStrapiWebhookGetPayload<
    S extends boolean | null | undefined | IncomingStrapiWebhookArgs,
    U = keyof S,
  > = S extends true
    ? IncomingStrapiWebhook
    : S extends undefined
    ? never
    : S extends IncomingStrapiWebhookArgs | IncomingStrapiWebhookFindManyArgs
    ? "include" extends U
      ? IncomingStrapiWebhook & {
          [P in TrueKeys<S["include"]>]: P extends "secret"
            ? SecretKeyGetPayload<S["include"][P]>
            : P extends "strapiApp"
            ? StrapiAppGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof IncomingStrapiWebhook
            ? IncomingStrapiWebhook[P]
            : P extends "secret"
            ? SecretKeyGetPayload<S["select"][P]>
            : P extends "strapiApp"
            ? StrapiAppGetPayload<S["select"][P]>
            : never;
        }
      : IncomingStrapiWebhook
    : IncomingStrapiWebhook;

  type IncomingStrapiWebhookCountArgs = Merge<
    Omit<IncomingStrapiWebhookFindManyArgs, "select" | "include"> & {
      select?: IncomingStrapiWebhookCountAggregateInputType | true;
    }
  >;

  export interface IncomingStrapiWebhookDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one IncomingStrapiWebhook that matches the filter.
     * @param {IncomingStrapiWebhookFindUniqueArgs} args - Arguments to find a IncomingStrapiWebhook
     * @example
     * // Get one IncomingStrapiWebhook
     * const incomingStrapiWebhook = await prisma.incomingStrapiWebhook.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends IncomingStrapiWebhookFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, IncomingStrapiWebhookFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "IncomingStrapiWebhook"
    > extends True
      ? CheckSelect<
          T,
          Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhook>,
          Prisma__IncomingStrapiWebhookClient<
            IncomingStrapiWebhookGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhook | null>,
          Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhookGetPayload<T> | null>
        >;

    /**
     * Find the first IncomingStrapiWebhook that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingStrapiWebhookFindFirstArgs} args - Arguments to find a IncomingStrapiWebhook
     * @example
     * // Get one IncomingStrapiWebhook
     * const incomingStrapiWebhook = await prisma.incomingStrapiWebhook.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends IncomingStrapiWebhookFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, IncomingStrapiWebhookFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "IncomingStrapiWebhook"
    > extends True
      ? CheckSelect<
          T,
          Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhook>,
          Prisma__IncomingStrapiWebhookClient<
            IncomingStrapiWebhookGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhook | null>,
          Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhookGetPayload<T> | null>
        >;

    /**
     * Find zero or more IncomingStrapiWebhooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingStrapiWebhookFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IncomingStrapiWebhooks
     * const incomingStrapiWebhooks = await prisma.incomingStrapiWebhook.findMany()
     *
     * // Get first 10 IncomingStrapiWebhooks
     * const incomingStrapiWebhooks = await prisma.incomingStrapiWebhook.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const incomingStrapiWebhookWithIdOnly = await prisma.incomingStrapiWebhook.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends IncomingStrapiWebhookFindManyArgs>(
      args?: SelectSubset<T, IncomingStrapiWebhookFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<IncomingStrapiWebhook>>,
      PrismaPromise<Array<IncomingStrapiWebhookGetPayload<T>>>
    >;

    /**
     * Create a IncomingStrapiWebhook.
     * @param {IncomingStrapiWebhookCreateArgs} args - Arguments to create a IncomingStrapiWebhook.
     * @example
     * // Create one IncomingStrapiWebhook
     * const IncomingStrapiWebhook = await prisma.incomingStrapiWebhook.create({
     *   data: {
     *     // ... data to create a IncomingStrapiWebhook
     *   }
     * })
     *
     **/
    create<T extends IncomingStrapiWebhookCreateArgs>(
      args: SelectSubset<T, IncomingStrapiWebhookCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhook>,
      Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhookGetPayload<T>>
    >;

    /**
     * Create many IncomingStrapiWebhooks.
     *     @param {IncomingStrapiWebhookCreateManyArgs} args - Arguments to create many IncomingStrapiWebhooks.
     *     @example
     *     // Create many IncomingStrapiWebhooks
     *     const incomingStrapiWebhook = await prisma.incomingStrapiWebhook.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends IncomingStrapiWebhookCreateManyArgs>(
      args?: SelectSubset<T, IncomingStrapiWebhookCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a IncomingStrapiWebhook.
     * @param {IncomingStrapiWebhookDeleteArgs} args - Arguments to delete one IncomingStrapiWebhook.
     * @example
     * // Delete one IncomingStrapiWebhook
     * const IncomingStrapiWebhook = await prisma.incomingStrapiWebhook.delete({
     *   where: {
     *     // ... filter to delete one IncomingStrapiWebhook
     *   }
     * })
     *
     **/
    delete<T extends IncomingStrapiWebhookDeleteArgs>(
      args: SelectSubset<T, IncomingStrapiWebhookDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhook>,
      Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhookGetPayload<T>>
    >;

    /**
     * Update one IncomingStrapiWebhook.
     * @param {IncomingStrapiWebhookUpdateArgs} args - Arguments to update one IncomingStrapiWebhook.
     * @example
     * // Update one IncomingStrapiWebhook
     * const incomingStrapiWebhook = await prisma.incomingStrapiWebhook.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends IncomingStrapiWebhookUpdateArgs>(
      args: SelectSubset<T, IncomingStrapiWebhookUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhook>,
      Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhookGetPayload<T>>
    >;

    /**
     * Delete zero or more IncomingStrapiWebhooks.
     * @param {IncomingStrapiWebhookDeleteManyArgs} args - Arguments to filter IncomingStrapiWebhooks to delete.
     * @example
     * // Delete a few IncomingStrapiWebhooks
     * const { count } = await prisma.incomingStrapiWebhook.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends IncomingStrapiWebhookDeleteManyArgs>(
      args?: SelectSubset<T, IncomingStrapiWebhookDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more IncomingStrapiWebhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingStrapiWebhookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IncomingStrapiWebhooks
     * const incomingStrapiWebhook = await prisma.incomingStrapiWebhook.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends IncomingStrapiWebhookUpdateManyArgs>(
      args: SelectSubset<T, IncomingStrapiWebhookUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one IncomingStrapiWebhook.
     * @param {IncomingStrapiWebhookUpsertArgs} args - Arguments to update or create a IncomingStrapiWebhook.
     * @example
     * // Update or create a IncomingStrapiWebhook
     * const incomingStrapiWebhook = await prisma.incomingStrapiWebhook.upsert({
     *   create: {
     *     // ... data to create a IncomingStrapiWebhook
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IncomingStrapiWebhook we want to update
     *   }
     * })
     **/
    upsert<T extends IncomingStrapiWebhookUpsertArgs>(
      args: SelectSubset<T, IncomingStrapiWebhookUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhook>,
      Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhookGetPayload<T>>
    >;

    /**
     * Count the number of IncomingStrapiWebhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingStrapiWebhookCountArgs} args - Arguments to filter IncomingStrapiWebhooks to count.
     * @example
     * // Count the number of IncomingStrapiWebhooks
     * const count = await prisma.incomingStrapiWebhook.count({
     *   where: {
     *     // ... the filter for the IncomingStrapiWebhooks we want to count
     *   }
     * })
     **/
    count<T extends IncomingStrapiWebhookCountArgs>(
      args?: Subset<T, IncomingStrapiWebhookCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              IncomingStrapiWebhookCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a IncomingStrapiWebhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingStrapiWebhookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends IncomingStrapiWebhookAggregateArgs>(
      args: Subset<T, IncomingStrapiWebhookAggregateArgs>,
    ): PrismaPromise<GetIncomingStrapiWebhookAggregateType<T>>;

    /**
     * Group by IncomingStrapiWebhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingStrapiWebhookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends IncomingStrapiWebhookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IncomingStrapiWebhookGroupByArgs["orderBy"] }
        : { orderBy?: IncomingStrapiWebhookGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<
        T,
        IncomingStrapiWebhookGroupByArgs,
        OrderByArg
      > &
        InputErrors,
    ): {} extends InputErrors
      ? GetIncomingStrapiWebhookGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IncomingStrapiWebhook.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__IncomingStrapiWebhookClient<T>
    implements PrismaPromise<T>
  {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    secret<T extends SecretKeyArgs = {}>(
      args?: Subset<T, SecretKeyArgs>,
    ): CheckSelect<
      T,
      Prisma__SecretKeyClient<SecretKey | null>,
      Prisma__SecretKeyClient<SecretKeyGetPayload<T> | null>
    >;

    strapiApp<T extends StrapiAppArgs = {}>(
      args?: Subset<T, StrapiAppArgs>,
    ): CheckSelect<
      T,
      Prisma__StrapiAppClient<StrapiApp | null>,
      Prisma__StrapiAppClient<StrapiAppGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * IncomingStrapiWebhook findUnique
   */
  export type IncomingStrapiWebhookFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the IncomingStrapiWebhook
     *
     **/
    select?: IncomingStrapiWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingStrapiWebhookInclude | null;
    /**
     * Throw an Error if a IncomingStrapiWebhook can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which IncomingStrapiWebhook to fetch.
     *
     **/
    where: IncomingStrapiWebhookWhereUniqueInput;
  };

  /**
   * IncomingStrapiWebhook findFirst
   */
  export type IncomingStrapiWebhookFindFirstArgs = {
    /**
     * Select specific fields to fetch from the IncomingStrapiWebhook
     *
     **/
    select?: IncomingStrapiWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingStrapiWebhookInclude | null;
    /**
     * Throw an Error if a IncomingStrapiWebhook can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which IncomingStrapiWebhook to fetch.
     *
     **/
    where?: IncomingStrapiWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingStrapiWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingStrapiWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for IncomingStrapiWebhooks.
     *
     **/
    cursor?: IncomingStrapiWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingStrapiWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingStrapiWebhooks.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IncomingStrapiWebhooks.
     *
     **/
    distinct?: Enumerable<IncomingStrapiWebhookScalarFieldEnum>;
  };

  /**
   * IncomingStrapiWebhook findMany
   */
  export type IncomingStrapiWebhookFindManyArgs = {
    /**
     * Select specific fields to fetch from the IncomingStrapiWebhook
     *
     **/
    select?: IncomingStrapiWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingStrapiWebhookInclude | null;
    /**
     * Filter, which IncomingStrapiWebhooks to fetch.
     *
     **/
    where?: IncomingStrapiWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingStrapiWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingStrapiWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing IncomingStrapiWebhooks.
     *
     **/
    cursor?: IncomingStrapiWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingStrapiWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingStrapiWebhooks.
     *
     **/
    skip?: number;
    distinct?: Enumerable<IncomingStrapiWebhookScalarFieldEnum>;
  };

  /**
   * IncomingStrapiWebhook create
   */
  export type IncomingStrapiWebhookCreateArgs = {
    /**
     * Select specific fields to fetch from the IncomingStrapiWebhook
     *
     **/
    select?: IncomingStrapiWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingStrapiWebhookInclude | null;
    /**
     * The data needed to create a IncomingStrapiWebhook.
     *
     **/
    data: XOR<
      IncomingStrapiWebhookCreateInput,
      IncomingStrapiWebhookUncheckedCreateInput
    >;
  };

  /**
   * IncomingStrapiWebhook createMany
   */
  export type IncomingStrapiWebhookCreateManyArgs = {
    data: Enumerable<IncomingStrapiWebhookCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * IncomingStrapiWebhook update
   */
  export type IncomingStrapiWebhookUpdateArgs = {
    /**
     * Select specific fields to fetch from the IncomingStrapiWebhook
     *
     **/
    select?: IncomingStrapiWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingStrapiWebhookInclude | null;
    /**
     * The data needed to update a IncomingStrapiWebhook.
     *
     **/
    data: XOR<
      IncomingStrapiWebhookUpdateInput,
      IncomingStrapiWebhookUncheckedUpdateInput
    >;
    /**
     * Choose, which IncomingStrapiWebhook to update.
     *
     **/
    where: IncomingStrapiWebhookWhereUniqueInput;
  };

  /**
   * IncomingStrapiWebhook updateMany
   */
  export type IncomingStrapiWebhookUpdateManyArgs = {
    data: XOR<
      IncomingStrapiWebhookUpdateManyMutationInput,
      IncomingStrapiWebhookUncheckedUpdateManyInput
    >;
    where?: IncomingStrapiWebhookWhereInput;
  };

  /**
   * IncomingStrapiWebhook upsert
   */
  export type IncomingStrapiWebhookUpsertArgs = {
    /**
     * Select specific fields to fetch from the IncomingStrapiWebhook
     *
     **/
    select?: IncomingStrapiWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingStrapiWebhookInclude | null;
    /**
     * The filter to search for the IncomingStrapiWebhook to update in case it exists.
     *
     **/
    where: IncomingStrapiWebhookWhereUniqueInput;
    /**
     * In case the IncomingStrapiWebhook found by the `where` argument doesn't exist, create a new IncomingStrapiWebhook with this data.
     *
     **/
    create: XOR<
      IncomingStrapiWebhookCreateInput,
      IncomingStrapiWebhookUncheckedCreateInput
    >;
    /**
     * In case the IncomingStrapiWebhook was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      IncomingStrapiWebhookUpdateInput,
      IncomingStrapiWebhookUncheckedUpdateInput
    >;
  };

  /**
   * IncomingStrapiWebhook delete
   */
  export type IncomingStrapiWebhookDeleteArgs = {
    /**
     * Select specific fields to fetch from the IncomingStrapiWebhook
     *
     **/
    select?: IncomingStrapiWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingStrapiWebhookInclude | null;
    /**
     * Filter which IncomingStrapiWebhook to delete.
     *
     **/
    where: IncomingStrapiWebhookWhereUniqueInput;
  };

  /**
   * IncomingStrapiWebhook deleteMany
   */
  export type IncomingStrapiWebhookDeleteManyArgs = {
    where?: IncomingStrapiWebhookWhereInput;
  };

  /**
   * IncomingStrapiWebhook without action
   */
  export type IncomingStrapiWebhookArgs = {
    /**
     * Select specific fields to fetch from the IncomingStrapiWebhook
     *
     **/
    select?: IncomingStrapiWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingStrapiWebhookInclude | null;
  };

  /**
   * Model IncomingProductDataFeedWebhook
   */

  export type AggregateIncomingProductDataFeedWebhook = {
    _count: IncomingProductDataFeedWebhookCountAggregateOutputType | null;
    _min: IncomingProductDataFeedWebhookMinAggregateOutputType | null;
    _max: IncomingProductDataFeedWebhookMaxAggregateOutputType | null;
  };

  export type IncomingProductDataFeedWebhookMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    productDataFeedAppId: string | null;
  };

  export type IncomingProductDataFeedWebhookMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    productDataFeedAppId: string | null;
  };

  export type IncomingProductDataFeedWebhookCountAggregateOutputType = {
    id: number;
    name: number;
    createdAt: number;
    updatedAt: number;
    productDataFeedAppId: number;
    _all: number;
  };

  export type IncomingProductDataFeedWebhookMinAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    productDataFeedAppId?: true;
  };

  export type IncomingProductDataFeedWebhookMaxAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    productDataFeedAppId?: true;
  };

  export type IncomingProductDataFeedWebhookCountAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    productDataFeedAppId?: true;
    _all?: true;
  };

  export type IncomingProductDataFeedWebhookAggregateArgs = {
    /**
     * Filter which IncomingProductDataFeedWebhook to aggregate.
     *
     **/
    where?: IncomingProductDataFeedWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingProductDataFeedWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingProductDataFeedWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: IncomingProductDataFeedWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingProductDataFeedWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingProductDataFeedWebhooks.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned IncomingProductDataFeedWebhooks
     **/
    _count?: true | IncomingProductDataFeedWebhookCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: IncomingProductDataFeedWebhookMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: IncomingProductDataFeedWebhookMaxAggregateInputType;
  };

  export type GetIncomingProductDataFeedWebhookAggregateType<
    T extends IncomingProductDataFeedWebhookAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateIncomingProductDataFeedWebhook]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIncomingProductDataFeedWebhook[P]>
      : GetScalarType<T[P], AggregateIncomingProductDataFeedWebhook[P]>;
  };

  export type IncomingProductDataFeedWebhookGroupByArgs = {
    where?: IncomingProductDataFeedWebhookWhereInput;
    orderBy?: Enumerable<IncomingProductDataFeedWebhookOrderByWithAggregationInput>;
    by: Array<IncomingProductDataFeedWebhookScalarFieldEnum>;
    having?: IncomingProductDataFeedWebhookScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IncomingProductDataFeedWebhookCountAggregateInputType | true;
    _min?: IncomingProductDataFeedWebhookMinAggregateInputType;
    _max?: IncomingProductDataFeedWebhookMaxAggregateInputType;
  };

  export type IncomingProductDataFeedWebhookGroupByOutputType = {
    id: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    productDataFeedAppId: string;
    _count: IncomingProductDataFeedWebhookCountAggregateOutputType | null;
    _min: IncomingProductDataFeedWebhookMinAggregateOutputType | null;
    _max: IncomingProductDataFeedWebhookMaxAggregateOutputType | null;
  };

  type GetIncomingProductDataFeedWebhookGroupByPayload<
    T extends IncomingProductDataFeedWebhookGroupByArgs,
  > = Promise<
    Array<
      PickArray<IncomingProductDataFeedWebhookGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof IncomingProductDataFeedWebhookGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<
                T[P],
                IncomingProductDataFeedWebhookGroupByOutputType[P]
              >
          : GetScalarType<
              T[P],
              IncomingProductDataFeedWebhookGroupByOutputType[P]
            >;
      }
    >
  >;

  export type IncomingProductDataFeedWebhookSelect = {
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    productDataFeedApp?: boolean | ProductDataFeedAppArgs;
    productDataFeedAppId?: boolean;
  };

  export type IncomingProductDataFeedWebhookInclude = {
    productDataFeedApp?: boolean | ProductDataFeedAppArgs;
  };

  export type IncomingProductDataFeedWebhookGetPayload<
    S extends boolean | null | undefined | IncomingProductDataFeedWebhookArgs,
    U = keyof S,
  > = S extends true
    ? IncomingProductDataFeedWebhook
    : S extends undefined
    ? never
    : S extends
        | IncomingProductDataFeedWebhookArgs
        | IncomingProductDataFeedWebhookFindManyArgs
    ? "include" extends U
      ? IncomingProductDataFeedWebhook & {
          [P in TrueKeys<S["include"]>]: P extends "productDataFeedApp"
            ? ProductDataFeedAppGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<
            S["select"]
          >]: P extends keyof IncomingProductDataFeedWebhook
            ? IncomingProductDataFeedWebhook[P]
            : P extends "productDataFeedApp"
            ? ProductDataFeedAppGetPayload<S["select"][P]>
            : never;
        }
      : IncomingProductDataFeedWebhook
    : IncomingProductDataFeedWebhook;

  type IncomingProductDataFeedWebhookCountArgs = Merge<
    Omit<IncomingProductDataFeedWebhookFindManyArgs, "select" | "include"> & {
      select?: IncomingProductDataFeedWebhookCountAggregateInputType | true;
    }
  >;

  export interface IncomingProductDataFeedWebhookDelegate<
    GlobalRejectSettings,
  > {
    /**
     * Find zero or one IncomingProductDataFeedWebhook that matches the filter.
     * @param {IncomingProductDataFeedWebhookFindUniqueArgs} args - Arguments to find a IncomingProductDataFeedWebhook
     * @example
     * // Get one IncomingProductDataFeedWebhook
     * const incomingProductDataFeedWebhook = await prisma.incomingProductDataFeedWebhook.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends IncomingProductDataFeedWebhookFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, IncomingProductDataFeedWebhookFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "IncomingProductDataFeedWebhook"
    > extends True
      ? CheckSelect<
          T,
          Prisma__IncomingProductDataFeedWebhookClient<IncomingProductDataFeedWebhook>,
          Prisma__IncomingProductDataFeedWebhookClient<
            IncomingProductDataFeedWebhookGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__IncomingProductDataFeedWebhookClient<IncomingProductDataFeedWebhook | null>,
          Prisma__IncomingProductDataFeedWebhookClient<IncomingProductDataFeedWebhookGetPayload<T> | null>
        >;

    /**
     * Find the first IncomingProductDataFeedWebhook that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingProductDataFeedWebhookFindFirstArgs} args - Arguments to find a IncomingProductDataFeedWebhook
     * @example
     * // Get one IncomingProductDataFeedWebhook
     * const incomingProductDataFeedWebhook = await prisma.incomingProductDataFeedWebhook.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends IncomingProductDataFeedWebhookFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, IncomingProductDataFeedWebhookFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "IncomingProductDataFeedWebhook"
    > extends True
      ? CheckSelect<
          T,
          Prisma__IncomingProductDataFeedWebhookClient<IncomingProductDataFeedWebhook>,
          Prisma__IncomingProductDataFeedWebhookClient<
            IncomingProductDataFeedWebhookGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__IncomingProductDataFeedWebhookClient<IncomingProductDataFeedWebhook | null>,
          Prisma__IncomingProductDataFeedWebhookClient<IncomingProductDataFeedWebhookGetPayload<T> | null>
        >;

    /**
     * Find zero or more IncomingProductDataFeedWebhooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingProductDataFeedWebhookFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IncomingProductDataFeedWebhooks
     * const incomingProductDataFeedWebhooks = await prisma.incomingProductDataFeedWebhook.findMany()
     *
     * // Get first 10 IncomingProductDataFeedWebhooks
     * const incomingProductDataFeedWebhooks = await prisma.incomingProductDataFeedWebhook.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const incomingProductDataFeedWebhookWithIdOnly = await prisma.incomingProductDataFeedWebhook.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends IncomingProductDataFeedWebhookFindManyArgs>(
      args?: SelectSubset<T, IncomingProductDataFeedWebhookFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<IncomingProductDataFeedWebhook>>,
      PrismaPromise<Array<IncomingProductDataFeedWebhookGetPayload<T>>>
    >;

    /**
     * Create a IncomingProductDataFeedWebhook.
     * @param {IncomingProductDataFeedWebhookCreateArgs} args - Arguments to create a IncomingProductDataFeedWebhook.
     * @example
     * // Create one IncomingProductDataFeedWebhook
     * const IncomingProductDataFeedWebhook = await prisma.incomingProductDataFeedWebhook.create({
     *   data: {
     *     // ... data to create a IncomingProductDataFeedWebhook
     *   }
     * })
     *
     **/
    create<T extends IncomingProductDataFeedWebhookCreateArgs>(
      args: SelectSubset<T, IncomingProductDataFeedWebhookCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingProductDataFeedWebhookClient<IncomingProductDataFeedWebhook>,
      Prisma__IncomingProductDataFeedWebhookClient<
        IncomingProductDataFeedWebhookGetPayload<T>
      >
    >;

    /**
     * Create many IncomingProductDataFeedWebhooks.
     *     @param {IncomingProductDataFeedWebhookCreateManyArgs} args - Arguments to create many IncomingProductDataFeedWebhooks.
     *     @example
     *     // Create many IncomingProductDataFeedWebhooks
     *     const incomingProductDataFeedWebhook = await prisma.incomingProductDataFeedWebhook.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends IncomingProductDataFeedWebhookCreateManyArgs>(
      args?: SelectSubset<T, IncomingProductDataFeedWebhookCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a IncomingProductDataFeedWebhook.
     * @param {IncomingProductDataFeedWebhookDeleteArgs} args - Arguments to delete one IncomingProductDataFeedWebhook.
     * @example
     * // Delete one IncomingProductDataFeedWebhook
     * const IncomingProductDataFeedWebhook = await prisma.incomingProductDataFeedWebhook.delete({
     *   where: {
     *     // ... filter to delete one IncomingProductDataFeedWebhook
     *   }
     * })
     *
     **/
    delete<T extends IncomingProductDataFeedWebhookDeleteArgs>(
      args: SelectSubset<T, IncomingProductDataFeedWebhookDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingProductDataFeedWebhookClient<IncomingProductDataFeedWebhook>,
      Prisma__IncomingProductDataFeedWebhookClient<
        IncomingProductDataFeedWebhookGetPayload<T>
      >
    >;

    /**
     * Update one IncomingProductDataFeedWebhook.
     * @param {IncomingProductDataFeedWebhookUpdateArgs} args - Arguments to update one IncomingProductDataFeedWebhook.
     * @example
     * // Update one IncomingProductDataFeedWebhook
     * const incomingProductDataFeedWebhook = await prisma.incomingProductDataFeedWebhook.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends IncomingProductDataFeedWebhookUpdateArgs>(
      args: SelectSubset<T, IncomingProductDataFeedWebhookUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingProductDataFeedWebhookClient<IncomingProductDataFeedWebhook>,
      Prisma__IncomingProductDataFeedWebhookClient<
        IncomingProductDataFeedWebhookGetPayload<T>
      >
    >;

    /**
     * Delete zero or more IncomingProductDataFeedWebhooks.
     * @param {IncomingProductDataFeedWebhookDeleteManyArgs} args - Arguments to filter IncomingProductDataFeedWebhooks to delete.
     * @example
     * // Delete a few IncomingProductDataFeedWebhooks
     * const { count } = await prisma.incomingProductDataFeedWebhook.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends IncomingProductDataFeedWebhookDeleteManyArgs>(
      args?: SelectSubset<T, IncomingProductDataFeedWebhookDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more IncomingProductDataFeedWebhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingProductDataFeedWebhookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IncomingProductDataFeedWebhooks
     * const incomingProductDataFeedWebhook = await prisma.incomingProductDataFeedWebhook.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends IncomingProductDataFeedWebhookUpdateManyArgs>(
      args: SelectSubset<T, IncomingProductDataFeedWebhookUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one IncomingProductDataFeedWebhook.
     * @param {IncomingProductDataFeedWebhookUpsertArgs} args - Arguments to update or create a IncomingProductDataFeedWebhook.
     * @example
     * // Update or create a IncomingProductDataFeedWebhook
     * const incomingProductDataFeedWebhook = await prisma.incomingProductDataFeedWebhook.upsert({
     *   create: {
     *     // ... data to create a IncomingProductDataFeedWebhook
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IncomingProductDataFeedWebhook we want to update
     *   }
     * })
     **/
    upsert<T extends IncomingProductDataFeedWebhookUpsertArgs>(
      args: SelectSubset<T, IncomingProductDataFeedWebhookUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingProductDataFeedWebhookClient<IncomingProductDataFeedWebhook>,
      Prisma__IncomingProductDataFeedWebhookClient<
        IncomingProductDataFeedWebhookGetPayload<T>
      >
    >;

    /**
     * Count the number of IncomingProductDataFeedWebhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingProductDataFeedWebhookCountArgs} args - Arguments to filter IncomingProductDataFeedWebhooks to count.
     * @example
     * // Count the number of IncomingProductDataFeedWebhooks
     * const count = await prisma.incomingProductDataFeedWebhook.count({
     *   where: {
     *     // ... the filter for the IncomingProductDataFeedWebhooks we want to count
     *   }
     * })
     **/
    count<T extends IncomingProductDataFeedWebhookCountArgs>(
      args?: Subset<T, IncomingProductDataFeedWebhookCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              IncomingProductDataFeedWebhookCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a IncomingProductDataFeedWebhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingProductDataFeedWebhookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends IncomingProductDataFeedWebhookAggregateArgs>(
      args: Subset<T, IncomingProductDataFeedWebhookAggregateArgs>,
    ): PrismaPromise<GetIncomingProductDataFeedWebhookAggregateType<T>>;

    /**
     * Group by IncomingProductDataFeedWebhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingProductDataFeedWebhookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends IncomingProductDataFeedWebhookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IncomingProductDataFeedWebhookGroupByArgs["orderBy"] }
        : { orderBy?: IncomingProductDataFeedWebhookGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<
        T,
        IncomingProductDataFeedWebhookGroupByArgs,
        OrderByArg
      > &
        InputErrors,
    ): {} extends InputErrors
      ? GetIncomingProductDataFeedWebhookGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IncomingProductDataFeedWebhook.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__IncomingProductDataFeedWebhookClient<T>
    implements PrismaPromise<T>
  {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    productDataFeedApp<T extends ProductDataFeedAppArgs = {}>(
      args?: Subset<T, ProductDataFeedAppArgs>,
    ): CheckSelect<
      T,
      Prisma__ProductDataFeedAppClient<ProductDataFeedApp | null>,
      Prisma__ProductDataFeedAppClient<ProductDataFeedAppGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * IncomingProductDataFeedWebhook findUnique
   */
  export type IncomingProductDataFeedWebhookFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the IncomingProductDataFeedWebhook
     *
     **/
    select?: IncomingProductDataFeedWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingProductDataFeedWebhookInclude | null;
    /**
     * Throw an Error if a IncomingProductDataFeedWebhook can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which IncomingProductDataFeedWebhook to fetch.
     *
     **/
    where: IncomingProductDataFeedWebhookWhereUniqueInput;
  };

  /**
   * IncomingProductDataFeedWebhook findFirst
   */
  export type IncomingProductDataFeedWebhookFindFirstArgs = {
    /**
     * Select specific fields to fetch from the IncomingProductDataFeedWebhook
     *
     **/
    select?: IncomingProductDataFeedWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingProductDataFeedWebhookInclude | null;
    /**
     * Throw an Error if a IncomingProductDataFeedWebhook can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which IncomingProductDataFeedWebhook to fetch.
     *
     **/
    where?: IncomingProductDataFeedWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingProductDataFeedWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingProductDataFeedWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for IncomingProductDataFeedWebhooks.
     *
     **/
    cursor?: IncomingProductDataFeedWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingProductDataFeedWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingProductDataFeedWebhooks.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IncomingProductDataFeedWebhooks.
     *
     **/
    distinct?: Enumerable<IncomingProductDataFeedWebhookScalarFieldEnum>;
  };

  /**
   * IncomingProductDataFeedWebhook findMany
   */
  export type IncomingProductDataFeedWebhookFindManyArgs = {
    /**
     * Select specific fields to fetch from the IncomingProductDataFeedWebhook
     *
     **/
    select?: IncomingProductDataFeedWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingProductDataFeedWebhookInclude | null;
    /**
     * Filter, which IncomingProductDataFeedWebhooks to fetch.
     *
     **/
    where?: IncomingProductDataFeedWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingProductDataFeedWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingProductDataFeedWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing IncomingProductDataFeedWebhooks.
     *
     **/
    cursor?: IncomingProductDataFeedWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingProductDataFeedWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingProductDataFeedWebhooks.
     *
     **/
    skip?: number;
    distinct?: Enumerable<IncomingProductDataFeedWebhookScalarFieldEnum>;
  };

  /**
   * IncomingProductDataFeedWebhook create
   */
  export type IncomingProductDataFeedWebhookCreateArgs = {
    /**
     * Select specific fields to fetch from the IncomingProductDataFeedWebhook
     *
     **/
    select?: IncomingProductDataFeedWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingProductDataFeedWebhookInclude | null;
    /**
     * The data needed to create a IncomingProductDataFeedWebhook.
     *
     **/
    data: XOR<
      IncomingProductDataFeedWebhookCreateInput,
      IncomingProductDataFeedWebhookUncheckedCreateInput
    >;
  };

  /**
   * IncomingProductDataFeedWebhook createMany
   */
  export type IncomingProductDataFeedWebhookCreateManyArgs = {
    data: Enumerable<IncomingProductDataFeedWebhookCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * IncomingProductDataFeedWebhook update
   */
  export type IncomingProductDataFeedWebhookUpdateArgs = {
    /**
     * Select specific fields to fetch from the IncomingProductDataFeedWebhook
     *
     **/
    select?: IncomingProductDataFeedWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingProductDataFeedWebhookInclude | null;
    /**
     * The data needed to update a IncomingProductDataFeedWebhook.
     *
     **/
    data: XOR<
      IncomingProductDataFeedWebhookUpdateInput,
      IncomingProductDataFeedWebhookUncheckedUpdateInput
    >;
    /**
     * Choose, which IncomingProductDataFeedWebhook to update.
     *
     **/
    where: IncomingProductDataFeedWebhookWhereUniqueInput;
  };

  /**
   * IncomingProductDataFeedWebhook updateMany
   */
  export type IncomingProductDataFeedWebhookUpdateManyArgs = {
    data: XOR<
      IncomingProductDataFeedWebhookUpdateManyMutationInput,
      IncomingProductDataFeedWebhookUncheckedUpdateManyInput
    >;
    where?: IncomingProductDataFeedWebhookWhereInput;
  };

  /**
   * IncomingProductDataFeedWebhook upsert
   */
  export type IncomingProductDataFeedWebhookUpsertArgs = {
    /**
     * Select specific fields to fetch from the IncomingProductDataFeedWebhook
     *
     **/
    select?: IncomingProductDataFeedWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingProductDataFeedWebhookInclude | null;
    /**
     * The filter to search for the IncomingProductDataFeedWebhook to update in case it exists.
     *
     **/
    where: IncomingProductDataFeedWebhookWhereUniqueInput;
    /**
     * In case the IncomingProductDataFeedWebhook found by the `where` argument doesn't exist, create a new IncomingProductDataFeedWebhook with this data.
     *
     **/
    create: XOR<
      IncomingProductDataFeedWebhookCreateInput,
      IncomingProductDataFeedWebhookUncheckedCreateInput
    >;
    /**
     * In case the IncomingProductDataFeedWebhook was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      IncomingProductDataFeedWebhookUpdateInput,
      IncomingProductDataFeedWebhookUncheckedUpdateInput
    >;
  };

  /**
   * IncomingProductDataFeedWebhook delete
   */
  export type IncomingProductDataFeedWebhookDeleteArgs = {
    /**
     * Select specific fields to fetch from the IncomingProductDataFeedWebhook
     *
     **/
    select?: IncomingProductDataFeedWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingProductDataFeedWebhookInclude | null;
    /**
     * Filter which IncomingProductDataFeedWebhook to delete.
     *
     **/
    where: IncomingProductDataFeedWebhookWhereUniqueInput;
  };

  /**
   * IncomingProductDataFeedWebhook deleteMany
   */
  export type IncomingProductDataFeedWebhookDeleteManyArgs = {
    where?: IncomingProductDataFeedWebhookWhereInput;
  };

  /**
   * IncomingProductDataFeedWebhook without action
   */
  export type IncomingProductDataFeedWebhookArgs = {
    /**
     * Select specific fields to fetch from the IncomingProductDataFeedWebhook
     *
     **/
    select?: IncomingProductDataFeedWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingProductDataFeedWebhookInclude | null;
  };

  /**
   * Model IncomingLogisticsWebhook
   */

  export type AggregateIncomingLogisticsWebhook = {
    _count: IncomingLogisticsWebhookCountAggregateOutputType | null;
    _min: IncomingLogisticsWebhookMinAggregateOutputType | null;
    _max: IncomingLogisticsWebhookMaxAggregateOutputType | null;
  };

  export type IncomingLogisticsWebhookMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    logisticsAppId: string | null;
  };

  export type IncomingLogisticsWebhookMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    logisticsAppId: string | null;
  };

  export type IncomingLogisticsWebhookCountAggregateOutputType = {
    id: number;
    name: number;
    createdAt: number;
    updatedAt: number;
    logisticsAppId: number;
    _all: number;
  };

  export type IncomingLogisticsWebhookMinAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    logisticsAppId?: true;
  };

  export type IncomingLogisticsWebhookMaxAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    logisticsAppId?: true;
  };

  export type IncomingLogisticsWebhookCountAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    logisticsAppId?: true;
    _all?: true;
  };

  export type IncomingLogisticsWebhookAggregateArgs = {
    /**
     * Filter which IncomingLogisticsWebhook to aggregate.
     *
     **/
    where?: IncomingLogisticsWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingLogisticsWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingLogisticsWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: IncomingLogisticsWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingLogisticsWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingLogisticsWebhooks.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned IncomingLogisticsWebhooks
     **/
    _count?: true | IncomingLogisticsWebhookCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: IncomingLogisticsWebhookMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: IncomingLogisticsWebhookMaxAggregateInputType;
  };

  export type GetIncomingLogisticsWebhookAggregateType<
    T extends IncomingLogisticsWebhookAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateIncomingLogisticsWebhook]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIncomingLogisticsWebhook[P]>
      : GetScalarType<T[P], AggregateIncomingLogisticsWebhook[P]>;
  };

  export type IncomingLogisticsWebhookGroupByArgs = {
    where?: IncomingLogisticsWebhookWhereInput;
    orderBy?: Enumerable<IncomingLogisticsWebhookOrderByWithAggregationInput>;
    by: Array<IncomingLogisticsWebhookScalarFieldEnum>;
    having?: IncomingLogisticsWebhookScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IncomingLogisticsWebhookCountAggregateInputType | true;
    _min?: IncomingLogisticsWebhookMinAggregateInputType;
    _max?: IncomingLogisticsWebhookMaxAggregateInputType;
  };

  export type IncomingLogisticsWebhookGroupByOutputType = {
    id: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    logisticsAppId: string;
    _count: IncomingLogisticsWebhookCountAggregateOutputType | null;
    _min: IncomingLogisticsWebhookMinAggregateOutputType | null;
    _max: IncomingLogisticsWebhookMaxAggregateOutputType | null;
  };

  type GetIncomingLogisticsWebhookGroupByPayload<
    T extends IncomingLogisticsWebhookGroupByArgs,
  > = Promise<
    Array<
      PickArray<IncomingLogisticsWebhookGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof IncomingLogisticsWebhookGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], IncomingLogisticsWebhookGroupByOutputType[P]>
          : GetScalarType<T[P], IncomingLogisticsWebhookGroupByOutputType[P]>;
      }
    >
  >;

  export type IncomingLogisticsWebhookSelect = {
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    logisticsApp?: boolean | LogisticsAppArgs;
    logisticsAppId?: boolean;
  };

  export type IncomingLogisticsWebhookInclude = {
    logisticsApp?: boolean | LogisticsAppArgs;
  };

  export type IncomingLogisticsWebhookGetPayload<
    S extends boolean | null | undefined | IncomingLogisticsWebhookArgs,
    U = keyof S,
  > = S extends true
    ? IncomingLogisticsWebhook
    : S extends undefined
    ? never
    : S extends
        | IncomingLogisticsWebhookArgs
        | IncomingLogisticsWebhookFindManyArgs
    ? "include" extends U
      ? IncomingLogisticsWebhook & {
          [P in TrueKeys<S["include"]>]: P extends "logisticsApp"
            ? LogisticsAppGetPayload<S["include"][P]>
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof IncomingLogisticsWebhook
            ? IncomingLogisticsWebhook[P]
            : P extends "logisticsApp"
            ? LogisticsAppGetPayload<S["select"][P]>
            : never;
        }
      : IncomingLogisticsWebhook
    : IncomingLogisticsWebhook;

  type IncomingLogisticsWebhookCountArgs = Merge<
    Omit<IncomingLogisticsWebhookFindManyArgs, "select" | "include"> & {
      select?: IncomingLogisticsWebhookCountAggregateInputType | true;
    }
  >;

  export interface IncomingLogisticsWebhookDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one IncomingLogisticsWebhook that matches the filter.
     * @param {IncomingLogisticsWebhookFindUniqueArgs} args - Arguments to find a IncomingLogisticsWebhook
     * @example
     * // Get one IncomingLogisticsWebhook
     * const incomingLogisticsWebhook = await prisma.incomingLogisticsWebhook.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends IncomingLogisticsWebhookFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, IncomingLogisticsWebhookFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "IncomingLogisticsWebhook"
    > extends True
      ? CheckSelect<
          T,
          Prisma__IncomingLogisticsWebhookClient<IncomingLogisticsWebhook>,
          Prisma__IncomingLogisticsWebhookClient<
            IncomingLogisticsWebhookGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__IncomingLogisticsWebhookClient<IncomingLogisticsWebhook | null>,
          Prisma__IncomingLogisticsWebhookClient<IncomingLogisticsWebhookGetPayload<T> | null>
        >;

    /**
     * Find the first IncomingLogisticsWebhook that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingLogisticsWebhookFindFirstArgs} args - Arguments to find a IncomingLogisticsWebhook
     * @example
     * // Get one IncomingLogisticsWebhook
     * const incomingLogisticsWebhook = await prisma.incomingLogisticsWebhook.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends IncomingLogisticsWebhookFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, IncomingLogisticsWebhookFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "IncomingLogisticsWebhook"
    > extends True
      ? CheckSelect<
          T,
          Prisma__IncomingLogisticsWebhookClient<IncomingLogisticsWebhook>,
          Prisma__IncomingLogisticsWebhookClient<
            IncomingLogisticsWebhookGetPayload<T>
          >
        >
      : CheckSelect<
          T,
          Prisma__IncomingLogisticsWebhookClient<IncomingLogisticsWebhook | null>,
          Prisma__IncomingLogisticsWebhookClient<IncomingLogisticsWebhookGetPayload<T> | null>
        >;

    /**
     * Find zero or more IncomingLogisticsWebhooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingLogisticsWebhookFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IncomingLogisticsWebhooks
     * const incomingLogisticsWebhooks = await prisma.incomingLogisticsWebhook.findMany()
     *
     * // Get first 10 IncomingLogisticsWebhooks
     * const incomingLogisticsWebhooks = await prisma.incomingLogisticsWebhook.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const incomingLogisticsWebhookWithIdOnly = await prisma.incomingLogisticsWebhook.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends IncomingLogisticsWebhookFindManyArgs>(
      args?: SelectSubset<T, IncomingLogisticsWebhookFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<IncomingLogisticsWebhook>>,
      PrismaPromise<Array<IncomingLogisticsWebhookGetPayload<T>>>
    >;

    /**
     * Create a IncomingLogisticsWebhook.
     * @param {IncomingLogisticsWebhookCreateArgs} args - Arguments to create a IncomingLogisticsWebhook.
     * @example
     * // Create one IncomingLogisticsWebhook
     * const IncomingLogisticsWebhook = await prisma.incomingLogisticsWebhook.create({
     *   data: {
     *     // ... data to create a IncomingLogisticsWebhook
     *   }
     * })
     *
     **/
    create<T extends IncomingLogisticsWebhookCreateArgs>(
      args: SelectSubset<T, IncomingLogisticsWebhookCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingLogisticsWebhookClient<IncomingLogisticsWebhook>,
      Prisma__IncomingLogisticsWebhookClient<
        IncomingLogisticsWebhookGetPayload<T>
      >
    >;

    /**
     * Create many IncomingLogisticsWebhooks.
     *     @param {IncomingLogisticsWebhookCreateManyArgs} args - Arguments to create many IncomingLogisticsWebhooks.
     *     @example
     *     // Create many IncomingLogisticsWebhooks
     *     const incomingLogisticsWebhook = await prisma.incomingLogisticsWebhook.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends IncomingLogisticsWebhookCreateManyArgs>(
      args?: SelectSubset<T, IncomingLogisticsWebhookCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a IncomingLogisticsWebhook.
     * @param {IncomingLogisticsWebhookDeleteArgs} args - Arguments to delete one IncomingLogisticsWebhook.
     * @example
     * // Delete one IncomingLogisticsWebhook
     * const IncomingLogisticsWebhook = await prisma.incomingLogisticsWebhook.delete({
     *   where: {
     *     // ... filter to delete one IncomingLogisticsWebhook
     *   }
     * })
     *
     **/
    delete<T extends IncomingLogisticsWebhookDeleteArgs>(
      args: SelectSubset<T, IncomingLogisticsWebhookDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingLogisticsWebhookClient<IncomingLogisticsWebhook>,
      Prisma__IncomingLogisticsWebhookClient<
        IncomingLogisticsWebhookGetPayload<T>
      >
    >;

    /**
     * Update one IncomingLogisticsWebhook.
     * @param {IncomingLogisticsWebhookUpdateArgs} args - Arguments to update one IncomingLogisticsWebhook.
     * @example
     * // Update one IncomingLogisticsWebhook
     * const incomingLogisticsWebhook = await prisma.incomingLogisticsWebhook.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends IncomingLogisticsWebhookUpdateArgs>(
      args: SelectSubset<T, IncomingLogisticsWebhookUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingLogisticsWebhookClient<IncomingLogisticsWebhook>,
      Prisma__IncomingLogisticsWebhookClient<
        IncomingLogisticsWebhookGetPayload<T>
      >
    >;

    /**
     * Delete zero or more IncomingLogisticsWebhooks.
     * @param {IncomingLogisticsWebhookDeleteManyArgs} args - Arguments to filter IncomingLogisticsWebhooks to delete.
     * @example
     * // Delete a few IncomingLogisticsWebhooks
     * const { count } = await prisma.incomingLogisticsWebhook.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends IncomingLogisticsWebhookDeleteManyArgs>(
      args?: SelectSubset<T, IncomingLogisticsWebhookDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more IncomingLogisticsWebhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingLogisticsWebhookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IncomingLogisticsWebhooks
     * const incomingLogisticsWebhook = await prisma.incomingLogisticsWebhook.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends IncomingLogisticsWebhookUpdateManyArgs>(
      args: SelectSubset<T, IncomingLogisticsWebhookUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one IncomingLogisticsWebhook.
     * @param {IncomingLogisticsWebhookUpsertArgs} args - Arguments to update or create a IncomingLogisticsWebhook.
     * @example
     * // Update or create a IncomingLogisticsWebhook
     * const incomingLogisticsWebhook = await prisma.incomingLogisticsWebhook.upsert({
     *   create: {
     *     // ... data to create a IncomingLogisticsWebhook
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IncomingLogisticsWebhook we want to update
     *   }
     * })
     **/
    upsert<T extends IncomingLogisticsWebhookUpsertArgs>(
      args: SelectSubset<T, IncomingLogisticsWebhookUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingLogisticsWebhookClient<IncomingLogisticsWebhook>,
      Prisma__IncomingLogisticsWebhookClient<
        IncomingLogisticsWebhookGetPayload<T>
      >
    >;

    /**
     * Count the number of IncomingLogisticsWebhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingLogisticsWebhookCountArgs} args - Arguments to filter IncomingLogisticsWebhooks to count.
     * @example
     * // Count the number of IncomingLogisticsWebhooks
     * const count = await prisma.incomingLogisticsWebhook.count({
     *   where: {
     *     // ... the filter for the IncomingLogisticsWebhooks we want to count
     *   }
     * })
     **/
    count<T extends IncomingLogisticsWebhookCountArgs>(
      args?: Subset<T, IncomingLogisticsWebhookCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              IncomingLogisticsWebhookCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a IncomingLogisticsWebhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingLogisticsWebhookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends IncomingLogisticsWebhookAggregateArgs>(
      args: Subset<T, IncomingLogisticsWebhookAggregateArgs>,
    ): PrismaPromise<GetIncomingLogisticsWebhookAggregateType<T>>;

    /**
     * Group by IncomingLogisticsWebhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncomingLogisticsWebhookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends IncomingLogisticsWebhookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IncomingLogisticsWebhookGroupByArgs["orderBy"] }
        : { orderBy?: IncomingLogisticsWebhookGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<
        T,
        IncomingLogisticsWebhookGroupByArgs,
        OrderByArg
      > &
        InputErrors,
    ): {} extends InputErrors
      ? GetIncomingLogisticsWebhookGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IncomingLogisticsWebhook.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__IncomingLogisticsWebhookClient<T>
    implements PrismaPromise<T>
  {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    logisticsApp<T extends LogisticsAppArgs = {}>(
      args?: Subset<T, LogisticsAppArgs>,
    ): CheckSelect<
      T,
      Prisma__LogisticsAppClient<LogisticsApp | null>,
      Prisma__LogisticsAppClient<LogisticsAppGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * IncomingLogisticsWebhook findUnique
   */
  export type IncomingLogisticsWebhookFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the IncomingLogisticsWebhook
     *
     **/
    select?: IncomingLogisticsWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingLogisticsWebhookInclude | null;
    /**
     * Throw an Error if a IncomingLogisticsWebhook can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which IncomingLogisticsWebhook to fetch.
     *
     **/
    where: IncomingLogisticsWebhookWhereUniqueInput;
  };

  /**
   * IncomingLogisticsWebhook findFirst
   */
  export type IncomingLogisticsWebhookFindFirstArgs = {
    /**
     * Select specific fields to fetch from the IncomingLogisticsWebhook
     *
     **/
    select?: IncomingLogisticsWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingLogisticsWebhookInclude | null;
    /**
     * Throw an Error if a IncomingLogisticsWebhook can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which IncomingLogisticsWebhook to fetch.
     *
     **/
    where?: IncomingLogisticsWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingLogisticsWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingLogisticsWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for IncomingLogisticsWebhooks.
     *
     **/
    cursor?: IncomingLogisticsWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingLogisticsWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingLogisticsWebhooks.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IncomingLogisticsWebhooks.
     *
     **/
    distinct?: Enumerable<IncomingLogisticsWebhookScalarFieldEnum>;
  };

  /**
   * IncomingLogisticsWebhook findMany
   */
  export type IncomingLogisticsWebhookFindManyArgs = {
    /**
     * Select specific fields to fetch from the IncomingLogisticsWebhook
     *
     **/
    select?: IncomingLogisticsWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingLogisticsWebhookInclude | null;
    /**
     * Filter, which IncomingLogisticsWebhooks to fetch.
     *
     **/
    where?: IncomingLogisticsWebhookWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IncomingLogisticsWebhooks to fetch.
     *
     **/
    orderBy?: Enumerable<IncomingLogisticsWebhookOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing IncomingLogisticsWebhooks.
     *
     **/
    cursor?: IncomingLogisticsWebhookWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IncomingLogisticsWebhooks from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IncomingLogisticsWebhooks.
     *
     **/
    skip?: number;
    distinct?: Enumerable<IncomingLogisticsWebhookScalarFieldEnum>;
  };

  /**
   * IncomingLogisticsWebhook create
   */
  export type IncomingLogisticsWebhookCreateArgs = {
    /**
     * Select specific fields to fetch from the IncomingLogisticsWebhook
     *
     **/
    select?: IncomingLogisticsWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingLogisticsWebhookInclude | null;
    /**
     * The data needed to create a IncomingLogisticsWebhook.
     *
     **/
    data: XOR<
      IncomingLogisticsWebhookCreateInput,
      IncomingLogisticsWebhookUncheckedCreateInput
    >;
  };

  /**
   * IncomingLogisticsWebhook createMany
   */
  export type IncomingLogisticsWebhookCreateManyArgs = {
    data: Enumerable<IncomingLogisticsWebhookCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * IncomingLogisticsWebhook update
   */
  export type IncomingLogisticsWebhookUpdateArgs = {
    /**
     * Select specific fields to fetch from the IncomingLogisticsWebhook
     *
     **/
    select?: IncomingLogisticsWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingLogisticsWebhookInclude | null;
    /**
     * The data needed to update a IncomingLogisticsWebhook.
     *
     **/
    data: XOR<
      IncomingLogisticsWebhookUpdateInput,
      IncomingLogisticsWebhookUncheckedUpdateInput
    >;
    /**
     * Choose, which IncomingLogisticsWebhook to update.
     *
     **/
    where: IncomingLogisticsWebhookWhereUniqueInput;
  };

  /**
   * IncomingLogisticsWebhook updateMany
   */
  export type IncomingLogisticsWebhookUpdateManyArgs = {
    data: XOR<
      IncomingLogisticsWebhookUpdateManyMutationInput,
      IncomingLogisticsWebhookUncheckedUpdateManyInput
    >;
    where?: IncomingLogisticsWebhookWhereInput;
  };

  /**
   * IncomingLogisticsWebhook upsert
   */
  export type IncomingLogisticsWebhookUpsertArgs = {
    /**
     * Select specific fields to fetch from the IncomingLogisticsWebhook
     *
     **/
    select?: IncomingLogisticsWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingLogisticsWebhookInclude | null;
    /**
     * The filter to search for the IncomingLogisticsWebhook to update in case it exists.
     *
     **/
    where: IncomingLogisticsWebhookWhereUniqueInput;
    /**
     * In case the IncomingLogisticsWebhook found by the `where` argument doesn't exist, create a new IncomingLogisticsWebhook with this data.
     *
     **/
    create: XOR<
      IncomingLogisticsWebhookCreateInput,
      IncomingLogisticsWebhookUncheckedCreateInput
    >;
    /**
     * In case the IncomingLogisticsWebhook was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<
      IncomingLogisticsWebhookUpdateInput,
      IncomingLogisticsWebhookUncheckedUpdateInput
    >;
  };

  /**
   * IncomingLogisticsWebhook delete
   */
  export type IncomingLogisticsWebhookDeleteArgs = {
    /**
     * Select specific fields to fetch from the IncomingLogisticsWebhook
     *
     **/
    select?: IncomingLogisticsWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingLogisticsWebhookInclude | null;
    /**
     * Filter which IncomingLogisticsWebhook to delete.
     *
     **/
    where: IncomingLogisticsWebhookWhereUniqueInput;
  };

  /**
   * IncomingLogisticsWebhook deleteMany
   */
  export type IncomingLogisticsWebhookDeleteManyArgs = {
    where?: IncomingLogisticsWebhookWhereInput;
  };

  /**
   * IncomingLogisticsWebhook without action
   */
  export type IncomingLogisticsWebhookArgs = {
    /**
     * Select specific fields to fetch from the IncomingLogisticsWebhook
     *
     **/
    select?: IncomingLogisticsWebhookSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: IncomingLogisticsWebhookInclude | null;
  };

  /**
   * Model SecretKey
   */

  export type AggregateSecretKey = {
    _count: SecretKeyCountAggregateOutputType | null;
    _min: SecretKeyMinAggregateOutputType | null;
    _max: SecretKeyMaxAggregateOutputType | null;
  };

  export type SecretKeyMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    secret: string | null;
    createdAt: Date | null;
  };

  export type SecretKeyMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    secret: string | null;
    createdAt: Date | null;
  };

  export type SecretKeyCountAggregateOutputType = {
    id: number;
    name: number;
    secret: number;
    createdAt: number;
    _all: number;
  };

  export type SecretKeyMinAggregateInputType = {
    id?: true;
    name?: true;
    secret?: true;
    createdAt?: true;
  };

  export type SecretKeyMaxAggregateInputType = {
    id?: true;
    name?: true;
    secret?: true;
    createdAt?: true;
  };

  export type SecretKeyCountAggregateInputType = {
    id?: true;
    name?: true;
    secret?: true;
    createdAt?: true;
    _all?: true;
  };

  export type SecretKeyAggregateArgs = {
    /**
     * Filter which SecretKey to aggregate.
     *
     **/
    where?: SecretKeyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SecretKeys to fetch.
     *
     **/
    orderBy?: Enumerable<SecretKeyOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     *
     **/
    cursor?: SecretKeyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SecretKeys from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SecretKeys.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SecretKeys
     **/
    _count?: true | SecretKeyCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SecretKeyMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SecretKeyMaxAggregateInputType;
  };

  export type GetSecretKeyAggregateType<T extends SecretKeyAggregateArgs> = {
    [P in keyof T & keyof AggregateSecretKey]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSecretKey[P]>
      : GetScalarType<T[P], AggregateSecretKey[P]>;
  };

  export type SecretKeyGroupByArgs = {
    where?: SecretKeyWhereInput;
    orderBy?: Enumerable<SecretKeyOrderByWithAggregationInput>;
    by: Array<SecretKeyScalarFieldEnum>;
    having?: SecretKeyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SecretKeyCountAggregateInputType | true;
    _min?: SecretKeyMinAggregateInputType;
    _max?: SecretKeyMaxAggregateInputType;
  };

  export type SecretKeyGroupByOutputType = {
    id: string;
    name: string | null;
    secret: string;
    createdAt: Date;
    _count: SecretKeyCountAggregateOutputType | null;
    _min: SecretKeyMinAggregateOutputType | null;
    _max: SecretKeyMaxAggregateOutputType | null;
  };

  type GetSecretKeyGroupByPayload<T extends SecretKeyGroupByArgs> = Promise<
    Array<
      PickArray<SecretKeyGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof SecretKeyGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SecretKeyGroupByOutputType[P]>
          : GetScalarType<T[P], SecretKeyGroupByOutputType[P]>;
      }
    >
  >;

  export type SecretKeySelect = {
    id?: boolean;
    name?: boolean;
    secret?: boolean;
    createdAt?: boolean;
    incomingSaleorWebhook?: boolean | IncomingSaleorWebhookArgs;
    IncomingStrapiWebhook?: boolean | IncomingStrapiWebhookArgs;
  };

  export type SecretKeyInclude = {
    incomingSaleorWebhook?: boolean | IncomingSaleorWebhookArgs;
    IncomingStrapiWebhook?: boolean | IncomingStrapiWebhookArgs;
  };

  export type SecretKeyGetPayload<
    S extends boolean | null | undefined | SecretKeyArgs,
    U = keyof S,
  > = S extends true
    ? SecretKey
    : S extends undefined
    ? never
    : S extends SecretKeyArgs | SecretKeyFindManyArgs
    ? "include" extends U
      ? SecretKey & {
          [P in TrueKeys<S["include"]>]: P extends "incomingSaleorWebhook"
            ? IncomingSaleorWebhookGetPayload<S["include"][P]> | null
            : P extends "IncomingStrapiWebhook"
            ? IncomingStrapiWebhookGetPayload<S["include"][P]> | null
            : never;
        }
      : "select" extends U
      ? {
          [P in TrueKeys<S["select"]>]: P extends keyof SecretKey
            ? SecretKey[P]
            : P extends "incomingSaleorWebhook"
            ? IncomingSaleorWebhookGetPayload<S["select"][P]> | null
            : P extends "IncomingStrapiWebhook"
            ? IncomingStrapiWebhookGetPayload<S["select"][P]> | null
            : never;
        }
      : SecretKey
    : SecretKey;

  type SecretKeyCountArgs = Merge<
    Omit<SecretKeyFindManyArgs, "select" | "include"> & {
      select?: SecretKeyCountAggregateInputType | true;
    }
  >;

  export interface SecretKeyDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one SecretKey that matches the filter.
     * @param {SecretKeyFindUniqueArgs} args - Arguments to find a SecretKey
     * @example
     * // Get one SecretKey
     * const secretKey = await prisma.secretKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<
      T extends SecretKeyFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, SecretKeyFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "SecretKey"
    > extends True
      ? CheckSelect<
          T,
          Prisma__SecretKeyClient<SecretKey>,
          Prisma__SecretKeyClient<SecretKeyGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__SecretKeyClient<SecretKey | null>,
          Prisma__SecretKeyClient<SecretKeyGetPayload<T> | null>
        >;

    /**
     * Find the first SecretKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretKeyFindFirstArgs} args - Arguments to find a SecretKey
     * @example
     * // Get one SecretKey
     * const secretKey = await prisma.secretKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<
      T extends SecretKeyFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, SecretKeyFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "SecretKey"
    > extends True
      ? CheckSelect<
          T,
          Prisma__SecretKeyClient<SecretKey>,
          Prisma__SecretKeyClient<SecretKeyGetPayload<T>>
        >
      : CheckSelect<
          T,
          Prisma__SecretKeyClient<SecretKey | null>,
          Prisma__SecretKeyClient<SecretKeyGetPayload<T> | null>
        >;

    /**
     * Find zero or more SecretKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretKeyFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SecretKeys
     * const secretKeys = await prisma.secretKey.findMany()
     *
     * // Get first 10 SecretKeys
     * const secretKeys = await prisma.secretKey.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const secretKeyWithIdOnly = await prisma.secretKey.findMany({ select: { id: true } })
     *
     **/
    findMany<T extends SecretKeyFindManyArgs>(
      args?: SelectSubset<T, SecretKeyFindManyArgs>,
    ): CheckSelect<
      T,
      PrismaPromise<Array<SecretKey>>,
      PrismaPromise<Array<SecretKeyGetPayload<T>>>
    >;

    /**
     * Create a SecretKey.
     * @param {SecretKeyCreateArgs} args - Arguments to create a SecretKey.
     * @example
     * // Create one SecretKey
     * const SecretKey = await prisma.secretKey.create({
     *   data: {
     *     // ... data to create a SecretKey
     *   }
     * })
     *
     **/
    create<T extends SecretKeyCreateArgs>(
      args: SelectSubset<T, SecretKeyCreateArgs>,
    ): CheckSelect<
      T,
      Prisma__SecretKeyClient<SecretKey>,
      Prisma__SecretKeyClient<SecretKeyGetPayload<T>>
    >;

    /**
     * Create many SecretKeys.
     *     @param {SecretKeyCreateManyArgs} args - Arguments to create many SecretKeys.
     *     @example
     *     // Create many SecretKeys
     *     const secretKey = await prisma.secretKey.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends SecretKeyCreateManyArgs>(
      args?: SelectSubset<T, SecretKeyCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a SecretKey.
     * @param {SecretKeyDeleteArgs} args - Arguments to delete one SecretKey.
     * @example
     * // Delete one SecretKey
     * const SecretKey = await prisma.secretKey.delete({
     *   where: {
     *     // ... filter to delete one SecretKey
     *   }
     * })
     *
     **/
    delete<T extends SecretKeyDeleteArgs>(
      args: SelectSubset<T, SecretKeyDeleteArgs>,
    ): CheckSelect<
      T,
      Prisma__SecretKeyClient<SecretKey>,
      Prisma__SecretKeyClient<SecretKeyGetPayload<T>>
    >;

    /**
     * Update one SecretKey.
     * @param {SecretKeyUpdateArgs} args - Arguments to update one SecretKey.
     * @example
     * // Update one SecretKey
     * const secretKey = await prisma.secretKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends SecretKeyUpdateArgs>(
      args: SelectSubset<T, SecretKeyUpdateArgs>,
    ): CheckSelect<
      T,
      Prisma__SecretKeyClient<SecretKey>,
      Prisma__SecretKeyClient<SecretKeyGetPayload<T>>
    >;

    /**
     * Delete zero or more SecretKeys.
     * @param {SecretKeyDeleteManyArgs} args - Arguments to filter SecretKeys to delete.
     * @example
     * // Delete a few SecretKeys
     * const { count } = await prisma.secretKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends SecretKeyDeleteManyArgs>(
      args?: SelectSubset<T, SecretKeyDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more SecretKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SecretKeys
     * const secretKey = await prisma.secretKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends SecretKeyUpdateManyArgs>(
      args: SelectSubset<T, SecretKeyUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one SecretKey.
     * @param {SecretKeyUpsertArgs} args - Arguments to update or create a SecretKey.
     * @example
     * // Update or create a SecretKey
     * const secretKey = await prisma.secretKey.upsert({
     *   create: {
     *     // ... data to create a SecretKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SecretKey we want to update
     *   }
     * })
     **/
    upsert<T extends SecretKeyUpsertArgs>(
      args: SelectSubset<T, SecretKeyUpsertArgs>,
    ): CheckSelect<
      T,
      Prisma__SecretKeyClient<SecretKey>,
      Prisma__SecretKeyClient<SecretKeyGetPayload<T>>
    >;

    /**
     * Count the number of SecretKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretKeyCountArgs} args - Arguments to filter SecretKeys to count.
     * @example
     * // Count the number of SecretKeys
     * const count = await prisma.secretKey.count({
     *   where: {
     *     // ... the filter for the SecretKeys we want to count
     *   }
     * })
     **/
    count<T extends SecretKeyCountArgs>(
      args?: Subset<T, SecretKeyCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], SecretKeyCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a SecretKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SecretKeyAggregateArgs>(
      args: Subset<T, SecretKeyAggregateArgs>,
    ): PrismaPromise<GetSecretKeyAggregateType<T>>;

    /**
     * Group by SecretKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretKeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SecretKeyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SecretKeyGroupByArgs["orderBy"] }
        : { orderBy?: SecretKeyGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                  Error,
                  "Field ",
                  P,
                  ` in "having" needs to be provided in "by"`,
                ];
          }[HavingFields]
        : "take" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
        ? "orderBy" extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, SecretKeyGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetSecretKeyGroupByPayload<T>
      : Promise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SecretKey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SecretKeyClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    incomingSaleorWebhook<T extends IncomingSaleorWebhookArgs = {}>(
      args?: Subset<T, IncomingSaleorWebhookArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhook | null>,
      Prisma__IncomingSaleorWebhookClient<IncomingSaleorWebhookGetPayload<T> | null>
    >;

    IncomingStrapiWebhook<T extends IncomingStrapiWebhookArgs = {}>(
      args?: Subset<T, IncomingStrapiWebhookArgs>,
    ): CheckSelect<
      T,
      Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhook | null>,
      Prisma__IncomingStrapiWebhookClient<IncomingStrapiWebhookGetPayload<T> | null>
    >;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * SecretKey findUnique
   */
  export type SecretKeyFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the SecretKey
     *
     **/
    select?: SecretKeySelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SecretKeyInclude | null;
    /**
     * Throw an Error if a SecretKey can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which SecretKey to fetch.
     *
     **/
    where: SecretKeyWhereUniqueInput;
  };

  /**
   * SecretKey findFirst
   */
  export type SecretKeyFindFirstArgs = {
    /**
     * Select specific fields to fetch from the SecretKey
     *
     **/
    select?: SecretKeySelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SecretKeyInclude | null;
    /**
     * Throw an Error if a SecretKey can't be found
     *
     **/
    rejectOnNotFound?: RejectOnNotFound;
    /**
     * Filter, which SecretKey to fetch.
     *
     **/
    where?: SecretKeyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SecretKeys to fetch.
     *
     **/
    orderBy?: Enumerable<SecretKeyOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SecretKeys.
     *
     **/
    cursor?: SecretKeyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SecretKeys from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SecretKeys.
     *
     **/
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SecretKeys.
     *
     **/
    distinct?: Enumerable<SecretKeyScalarFieldEnum>;
  };

  /**
   * SecretKey findMany
   */
  export type SecretKeyFindManyArgs = {
    /**
     * Select specific fields to fetch from the SecretKey
     *
     **/
    select?: SecretKeySelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SecretKeyInclude | null;
    /**
     * Filter, which SecretKeys to fetch.
     *
     **/
    where?: SecretKeyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SecretKeys to fetch.
     *
     **/
    orderBy?: Enumerable<SecretKeyOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SecretKeys.
     *
     **/
    cursor?: SecretKeyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SecretKeys from the position of the cursor.
     *
     **/
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SecretKeys.
     *
     **/
    skip?: number;
    distinct?: Enumerable<SecretKeyScalarFieldEnum>;
  };

  /**
   * SecretKey create
   */
  export type SecretKeyCreateArgs = {
    /**
     * Select specific fields to fetch from the SecretKey
     *
     **/
    select?: SecretKeySelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SecretKeyInclude | null;
    /**
     * The data needed to create a SecretKey.
     *
     **/
    data: XOR<SecretKeyCreateInput, SecretKeyUncheckedCreateInput>;
  };

  /**
   * SecretKey createMany
   */
  export type SecretKeyCreateManyArgs = {
    data: Enumerable<SecretKeyCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * SecretKey update
   */
  export type SecretKeyUpdateArgs = {
    /**
     * Select specific fields to fetch from the SecretKey
     *
     **/
    select?: SecretKeySelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SecretKeyInclude | null;
    /**
     * The data needed to update a SecretKey.
     *
     **/
    data: XOR<SecretKeyUpdateInput, SecretKeyUncheckedUpdateInput>;
    /**
     * Choose, which SecretKey to update.
     *
     **/
    where: SecretKeyWhereUniqueInput;
  };

  /**
   * SecretKey updateMany
   */
  export type SecretKeyUpdateManyArgs = {
    data: XOR<
      SecretKeyUpdateManyMutationInput,
      SecretKeyUncheckedUpdateManyInput
    >;
    where?: SecretKeyWhereInput;
  };

  /**
   * SecretKey upsert
   */
  export type SecretKeyUpsertArgs = {
    /**
     * Select specific fields to fetch from the SecretKey
     *
     **/
    select?: SecretKeySelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SecretKeyInclude | null;
    /**
     * The filter to search for the SecretKey to update in case it exists.
     *
     **/
    where: SecretKeyWhereUniqueInput;
    /**
     * In case the SecretKey found by the `where` argument doesn't exist, create a new SecretKey with this data.
     *
     **/
    create: XOR<SecretKeyCreateInput, SecretKeyUncheckedCreateInput>;
    /**
     * In case the SecretKey was found with the provided `where` argument, update it with this data.
     *
     **/
    update: XOR<SecretKeyUpdateInput, SecretKeyUncheckedUpdateInput>;
  };

  /**
   * SecretKey delete
   */
  export type SecretKeyDeleteArgs = {
    /**
     * Select specific fields to fetch from the SecretKey
     *
     **/
    select?: SecretKeySelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SecretKeyInclude | null;
    /**
     * Filter which SecretKey to delete.
     *
     **/
    where: SecretKeyWhereUniqueInput;
  };

  /**
   * SecretKey deleteMany
   */
  export type SecretKeyDeleteManyArgs = {
    where?: SecretKeyWhereInput;
  };

  /**
   * SecretKey without action
   */
  export type SecretKeyArgs = {
    /**
     * Select specific fields to fetch from the SecretKey
     *
     **/
    select?: SecretKeySelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     *
     **/
    include?: SecretKeyInclude | null;
  };

  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const ProductDataFeedAppScalarFieldEnum: {
    id: "id";
    productDetailStorefrontURL: "productDetailStorefrontURL";
    saleorAppId: "saleorAppId";
    tenantId: "tenantId";
  };

  export type ProductDataFeedAppScalarFieldEnum =
    typeof ProductDataFeedAppScalarFieldEnum[keyof typeof ProductDataFeedAppScalarFieldEnum];

  export const LogisticsAppScalarFieldEnum: {
    id: "id";
    currentOrdersCustomViewId: "currentOrdersCustomViewId";
    nextFiveDaysOrdersCustomViewId: "nextFiveDaysOrdersCustomViewId";
    currentBulkOrdersCustomViewId: "currentBulkOrdersCustomViewId";
    nextFiveDaysBulkOrdersCustomViewId: "nextFiveDaysBulkOrdersCustomViewId";
    tenantId: "tenantId";
  };

  export type LogisticsAppScalarFieldEnum =
    typeof LogisticsAppScalarFieldEnum[keyof typeof LogisticsAppScalarFieldEnum];

  export const ZohoAppScalarFieldEnum: {
    id: "id";
    orgId: "orgId";
    clientId: "clientId";
    clientSecret: "clientSecret";
    tenantId: "tenantId";
  };

  export type ZohoAppScalarFieldEnum =
    typeof ZohoAppScalarFieldEnum[keyof typeof ZohoAppScalarFieldEnum];

  export const SaleorAppScalarFieldEnum: {
    id: "id";
    domain: "domain";
    name: "name";
    channelSlug: "channelSlug";
    tenantId: "tenantId";
  };

  export type SaleorAppScalarFieldEnum =
    typeof SaleorAppScalarFieldEnum[keyof typeof SaleorAppScalarFieldEnum];

  export const InstalledSaleorAppScalarFieldEnum: {
    id: "id";
    token: "token";
    saleorAppId: "saleorAppId";
  };

  export type InstalledSaleorAppScalarFieldEnum =
    typeof InstalledSaleorAppScalarFieldEnum[keyof typeof InstalledSaleorAppScalarFieldEnum];

  export const TenantScalarFieldEnum: {
    id: "id";
    name: "name";
  };

  export type TenantScalarFieldEnum =
    typeof TenantScalarFieldEnum[keyof typeof TenantScalarFieldEnum];

  export const SubscriptionScalarFieldEnum: {
    id: "id";
    tenantId: "tenantId";
    payedUntil: "payedUntil";
  };

  export type SubscriptionScalarFieldEnum =
    typeof SubscriptionScalarFieldEnum[keyof typeof SubscriptionScalarFieldEnum];

  export const ProductDataFeedIntegrationScalarFieldEnum: {
    id: "id";
    enabled: "enabled";
    subscriptionId: "subscriptionId";
    tenantId: "tenantId";
    productDataFeedAppId: "productDataFeedAppId";
    saleorAppId: "saleorAppId";
  };

  export type ProductDataFeedIntegrationScalarFieldEnum =
    typeof ProductDataFeedIntegrationScalarFieldEnum[keyof typeof ProductDataFeedIntegrationScalarFieldEnum];

  export const LogisticsIntegrationScalarFieldEnum: {
    id: "id";
    enabled: "enabled";
    subscriptionId: "subscriptionId";
    tenantId: "tenantId";
    zohoAppId: "zohoAppId";
    logisticsAppId: "logisticsAppId";
  };

  export type LogisticsIntegrationScalarFieldEnum =
    typeof LogisticsIntegrationScalarFieldEnum[keyof typeof LogisticsIntegrationScalarFieldEnum];

  export const StrapiToZohoIntegrationScalarFieldEnum: {
    id: "id";
    payedUntil: "payedUntil";
    enabled: "enabled";
    strapiContentType: "strapiContentType";
    subscriptionId: "subscriptionId";
    tenantId: "tenantId";
    strapiAppId: "strapiAppId";
    zohoAppId: "zohoAppId";
  };

  export type StrapiToZohoIntegrationScalarFieldEnum =
    typeof StrapiToZohoIntegrationScalarFieldEnum[keyof typeof StrapiToZohoIntegrationScalarFieldEnum];

  export const StrapiAppScalarFieldEnum: {
    id: "id";
    name: "name";
    tenantId: "tenantId";
  };

  export type StrapiAppScalarFieldEnum =
    typeof StrapiAppScalarFieldEnum[keyof typeof StrapiAppScalarFieldEnum];

  export const IncomingSaleorWebhookScalarFieldEnum: {
    id: "id";
    name: "name";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
    secretId: "secretId";
    installedSaleorAppId: "installedSaleorAppId";
  };

  export type IncomingSaleorWebhookScalarFieldEnum =
    typeof IncomingSaleorWebhookScalarFieldEnum[keyof typeof IncomingSaleorWebhookScalarFieldEnum];

  export const IncomingStrapiWebhookScalarFieldEnum: {
    id: "id";
    name: "name";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
    secretId: "secretId";
    strapiAppId: "strapiAppId";
  };

  export type IncomingStrapiWebhookScalarFieldEnum =
    typeof IncomingStrapiWebhookScalarFieldEnum[keyof typeof IncomingStrapiWebhookScalarFieldEnum];

  export const IncomingProductDataFeedWebhookScalarFieldEnum: {
    id: "id";
    name: "name";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
    productDataFeedAppId: "productDataFeedAppId";
  };

  export type IncomingProductDataFeedWebhookScalarFieldEnum =
    typeof IncomingProductDataFeedWebhookScalarFieldEnum[keyof typeof IncomingProductDataFeedWebhookScalarFieldEnum];

  export const IncomingLogisticsWebhookScalarFieldEnum: {
    id: "id";
    name: "name";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
    logisticsAppId: "logisticsAppId";
  };

  export type IncomingLogisticsWebhookScalarFieldEnum =
    typeof IncomingLogisticsWebhookScalarFieldEnum[keyof typeof IncomingLogisticsWebhookScalarFieldEnum];

  export const SecretKeyScalarFieldEnum: {
    id: "id";
    name: "name";
    secret: "secret";
    createdAt: "createdAt";
  };

  export type SecretKeyScalarFieldEnum =
    typeof SecretKeyScalarFieldEnum[keyof typeof SecretKeyScalarFieldEnum];

  export const SortOrder: {
    asc: "asc";
    desc: "desc";
  };

  export type SortOrder = typeof SortOrder[keyof typeof SortOrder];

  export const QueryMode: {
    default: "default";
    insensitive: "insensitive";
  };

  export type QueryMode = typeof QueryMode[keyof typeof QueryMode];

  /**
   * Deep Input Types
   */

  export type ProductDataFeedAppWhereInput = {
    AND?: Enumerable<ProductDataFeedAppWhereInput>;
    OR?: Enumerable<ProductDataFeedAppWhereInput>;
    NOT?: Enumerable<ProductDataFeedAppWhereInput>;
    id?: StringFilter | string;
    productDetailStorefrontURL?: StringFilter | string;
    saleorApp?: XOR<SaleorAppRelationFilter, SaleorAppWhereInput>;
    saleorAppId?: StringFilter | string;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    webhooks?: IncomingProductDataFeedWebhookListRelationFilter;
    integration?: XOR<
      ProductDataFeedIntegrationRelationFilter,
      ProductDataFeedIntegrationWhereInput
    > | null;
  };

  export type ProductDataFeedAppOrderByWithRelationInput = {
    id?: SortOrder;
    productDetailStorefrontURL?: SortOrder;
    saleorApp?: SaleorAppOrderByWithRelationInput;
    saleorAppId?: SortOrder;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    webhooks?: IncomingProductDataFeedWebhookOrderByRelationAggregateInput;
    integration?: ProductDataFeedIntegrationOrderByWithRelationInput;
  };

  export type ProductDataFeedAppWhereUniqueInput = {
    id?: string;
    tenantId?: string;
  };

  export type ProductDataFeedAppOrderByWithAggregationInput = {
    id?: SortOrder;
    productDetailStorefrontURL?: SortOrder;
    saleorAppId?: SortOrder;
    tenantId?: SortOrder;
    _count?: ProductDataFeedAppCountOrderByAggregateInput;
    _max?: ProductDataFeedAppMaxOrderByAggregateInput;
    _min?: ProductDataFeedAppMinOrderByAggregateInput;
  };

  export type ProductDataFeedAppScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ProductDataFeedAppScalarWhereWithAggregatesInput>;
    OR?: Enumerable<ProductDataFeedAppScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<ProductDataFeedAppScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    productDetailStorefrontURL?: StringWithAggregatesFilter | string;
    saleorAppId?: StringWithAggregatesFilter | string;
    tenantId?: StringWithAggregatesFilter | string;
  };

  export type LogisticsAppWhereInput = {
    AND?: Enumerable<LogisticsAppWhereInput>;
    OR?: Enumerable<LogisticsAppWhereInput>;
    NOT?: Enumerable<LogisticsAppWhereInput>;
    id?: StringFilter | string;
    currentOrdersCustomViewId?: StringFilter | string;
    nextFiveDaysOrdersCustomViewId?: StringFilter | string;
    currentBulkOrdersCustomViewId?: StringFilter | string;
    nextFiveDaysBulkOrdersCustomViewId?: StringFilter | string;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    webhooks?: IncomingLogisticsWebhookListRelationFilter;
    integration?: XOR<
      LogisticsIntegrationRelationFilter,
      LogisticsIntegrationWhereInput
    > | null;
  };

  export type LogisticsAppOrderByWithRelationInput = {
    id?: SortOrder;
    currentOrdersCustomViewId?: SortOrder;
    nextFiveDaysOrdersCustomViewId?: SortOrder;
    currentBulkOrdersCustomViewId?: SortOrder;
    nextFiveDaysBulkOrdersCustomViewId?: SortOrder;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    webhooks?: IncomingLogisticsWebhookOrderByRelationAggregateInput;
    integration?: LogisticsIntegrationOrderByWithRelationInput;
  };

  export type LogisticsAppWhereUniqueInput = {
    id?: string;
    tenantId?: string;
  };

  export type LogisticsAppOrderByWithAggregationInput = {
    id?: SortOrder;
    currentOrdersCustomViewId?: SortOrder;
    nextFiveDaysOrdersCustomViewId?: SortOrder;
    currentBulkOrdersCustomViewId?: SortOrder;
    nextFiveDaysBulkOrdersCustomViewId?: SortOrder;
    tenantId?: SortOrder;
    _count?: LogisticsAppCountOrderByAggregateInput;
    _max?: LogisticsAppMaxOrderByAggregateInput;
    _min?: LogisticsAppMinOrderByAggregateInput;
  };

  export type LogisticsAppScalarWhereWithAggregatesInput = {
    AND?: Enumerable<LogisticsAppScalarWhereWithAggregatesInput>;
    OR?: Enumerable<LogisticsAppScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<LogisticsAppScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    currentOrdersCustomViewId?: StringWithAggregatesFilter | string;
    nextFiveDaysOrdersCustomViewId?: StringWithAggregatesFilter | string;
    currentBulkOrdersCustomViewId?: StringWithAggregatesFilter | string;
    nextFiveDaysBulkOrdersCustomViewId?: StringWithAggregatesFilter | string;
    tenantId?: StringWithAggregatesFilter | string;
  };

  export type ZohoAppWhereInput = {
    AND?: Enumerable<ZohoAppWhereInput>;
    OR?: Enumerable<ZohoAppWhereInput>;
    NOT?: Enumerable<ZohoAppWhereInput>;
    id?: StringFilter | string;
    orgId?: StringFilter | string;
    clientId?: StringFilter | string;
    clientSecret?: StringFilter | string;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    strapiToZohoIntegration?: StrapiToZohoIntegrationListRelationFilter;
    logisticsIntegration?: LogisticsIntegrationListRelationFilter;
  };

  export type ZohoAppOrderByWithRelationInput = {
    id?: SortOrder;
    orgId?: SortOrder;
    clientId?: SortOrder;
    clientSecret?: SortOrder;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    strapiToZohoIntegration?: StrapiToZohoIntegrationOrderByRelationAggregateInput;
    logisticsIntegration?: LogisticsIntegrationOrderByRelationAggregateInput;
  };

  export type ZohoAppWhereUniqueInput = {
    id?: string;
    tenantId?: string;
  };

  export type ZohoAppOrderByWithAggregationInput = {
    id?: SortOrder;
    orgId?: SortOrder;
    clientId?: SortOrder;
    clientSecret?: SortOrder;
    tenantId?: SortOrder;
    _count?: ZohoAppCountOrderByAggregateInput;
    _max?: ZohoAppMaxOrderByAggregateInput;
    _min?: ZohoAppMinOrderByAggregateInput;
  };

  export type ZohoAppScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ZohoAppScalarWhereWithAggregatesInput>;
    OR?: Enumerable<ZohoAppScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<ZohoAppScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    orgId?: StringWithAggregatesFilter | string;
    clientId?: StringWithAggregatesFilter | string;
    clientSecret?: StringWithAggregatesFilter | string;
    tenantId?: StringWithAggregatesFilter | string;
  };

  export type SaleorAppWhereInput = {
    AND?: Enumerable<SaleorAppWhereInput>;
    OR?: Enumerable<SaleorAppWhereInput>;
    NOT?: Enumerable<SaleorAppWhereInput>;
    id?: StringFilter | string;
    domain?: StringFilter | string;
    name?: StringFilter | string;
    channelSlug?: StringNullableFilter | string | null;
    installedSaleorApp?: XOR<
      InstalledSaleorAppRelationFilter,
      InstalledSaleorAppWhereInput
    > | null;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    productDataFeedIntegration?: ProductDataFeedIntegrationListRelationFilter;
    ProductDataFeedApp?: ProductDataFeedAppListRelationFilter;
  };

  export type SaleorAppOrderByWithRelationInput = {
    id?: SortOrder;
    domain?: SortOrder;
    name?: SortOrder;
    channelSlug?: SortOrder;
    installedSaleorApp?: InstalledSaleorAppOrderByWithRelationInput;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    productDataFeedIntegration?: ProductDataFeedIntegrationOrderByRelationAggregateInput;
    ProductDataFeedApp?: ProductDataFeedAppOrderByRelationAggregateInput;
  };

  export type SaleorAppWhereUniqueInput = {
    id?: string;
    domain_channelSlug?: SaleorAppDomainChannelSlugCompoundUniqueInput;
  };

  export type SaleorAppOrderByWithAggregationInput = {
    id?: SortOrder;
    domain?: SortOrder;
    name?: SortOrder;
    channelSlug?: SortOrder;
    tenantId?: SortOrder;
    _count?: SaleorAppCountOrderByAggregateInput;
    _max?: SaleorAppMaxOrderByAggregateInput;
    _min?: SaleorAppMinOrderByAggregateInput;
  };

  export type SaleorAppScalarWhereWithAggregatesInput = {
    AND?: Enumerable<SaleorAppScalarWhereWithAggregatesInput>;
    OR?: Enumerable<SaleorAppScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<SaleorAppScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    domain?: StringWithAggregatesFilter | string;
    name?: StringWithAggregatesFilter | string;
    channelSlug?: StringNullableWithAggregatesFilter | string | null;
    tenantId?: StringWithAggregatesFilter | string;
  };

  export type InstalledSaleorAppWhereInput = {
    AND?: Enumerable<InstalledSaleorAppWhereInput>;
    OR?: Enumerable<InstalledSaleorAppWhereInput>;
    NOT?: Enumerable<InstalledSaleorAppWhereInput>;
    id?: StringFilter | string;
    webhooks?: IncomingSaleorWebhookListRelationFilter;
    token?: StringFilter | string;
    saleorApp?: XOR<SaleorAppRelationFilter, SaleorAppWhereInput>;
    saleorAppId?: StringFilter | string;
  };

  export type InstalledSaleorAppOrderByWithRelationInput = {
    id?: SortOrder;
    webhooks?: IncomingSaleorWebhookOrderByRelationAggregateInput;
    token?: SortOrder;
    saleorApp?: SaleorAppOrderByWithRelationInput;
    saleorAppId?: SortOrder;
  };

  export type InstalledSaleorAppWhereUniqueInput = {
    id?: string;
    saleorAppId?: string;
  };

  export type InstalledSaleorAppOrderByWithAggregationInput = {
    id?: SortOrder;
    token?: SortOrder;
    saleorAppId?: SortOrder;
    _count?: InstalledSaleorAppCountOrderByAggregateInput;
    _max?: InstalledSaleorAppMaxOrderByAggregateInput;
    _min?: InstalledSaleorAppMinOrderByAggregateInput;
  };

  export type InstalledSaleorAppScalarWhereWithAggregatesInput = {
    AND?: Enumerable<InstalledSaleorAppScalarWhereWithAggregatesInput>;
    OR?: Enumerable<InstalledSaleorAppScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<InstalledSaleorAppScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    token?: StringWithAggregatesFilter | string;
    saleorAppId?: StringWithAggregatesFilter | string;
  };

  export type TenantWhereInput = {
    AND?: Enumerable<TenantWhereInput>;
    OR?: Enumerable<TenantWhereInput>;
    NOT?: Enumerable<TenantWhereInput>;
    id?: StringFilter | string;
    name?: StringFilter | string;
    Subscriptions?: SubscriptionListRelationFilter;
    saleorApps?: SaleorAppListRelationFilter;
    zohoApps?: ZohoAppListRelationFilter;
    productdatafeedApps?: ProductDataFeedAppListRelationFilter;
    strapiApps?: StrapiAppListRelationFilter;
    productDataFeedIntegration?: ProductDataFeedIntegrationListRelationFilter;
    strapiToZohoIntegration?: StrapiToZohoIntegrationListRelationFilter;
    logisticsIntegration?: LogisticsIntegrationListRelationFilter;
    logisticsApp?: LogisticsAppListRelationFilter;
  };

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    Subscriptions?: SubscriptionOrderByRelationAggregateInput;
    saleorApps?: SaleorAppOrderByRelationAggregateInput;
    zohoApps?: ZohoAppOrderByRelationAggregateInput;
    productdatafeedApps?: ProductDataFeedAppOrderByRelationAggregateInput;
    strapiApps?: StrapiAppOrderByRelationAggregateInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationOrderByRelationAggregateInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationOrderByRelationAggregateInput;
    logisticsIntegration?: LogisticsIntegrationOrderByRelationAggregateInput;
    logisticsApp?: LogisticsAppOrderByRelationAggregateInput;
  };

  export type TenantWhereUniqueInput = {
    id?: string;
  };

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    _count?: TenantCountOrderByAggregateInput;
    _max?: TenantMaxOrderByAggregateInput;
    _min?: TenantMinOrderByAggregateInput;
  };

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TenantScalarWhereWithAggregatesInput>;
    OR?: Enumerable<TenantScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<TenantScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    name?: StringWithAggregatesFilter | string;
  };

  export type SubscriptionWhereInput = {
    AND?: Enumerable<SubscriptionWhereInput>;
    OR?: Enumerable<SubscriptionWhereInput>;
    NOT?: Enumerable<SubscriptionWhereInput>;
    id?: StringFilter | string;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    payedUntil?: DateTimeNullableFilter | Date | string | null;
    productDataFeedIntegration?: XOR<
      ProductDataFeedIntegrationRelationFilter,
      ProductDataFeedIntegrationWhereInput
    > | null;
    strapiToZohoIntegration?: XOR<
      StrapiToZohoIntegrationRelationFilter,
      StrapiToZohoIntegrationWhereInput
    > | null;
    logisticsIntegration?: XOR<
      LogisticsIntegrationRelationFilter,
      LogisticsIntegrationWhereInput
    > | null;
  };

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    payedUntil?: SortOrder;
    productDataFeedIntegration?: ProductDataFeedIntegrationOrderByWithRelationInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationOrderByWithRelationInput;
    logisticsIntegration?: LogisticsIntegrationOrderByWithRelationInput;
  };

  export type SubscriptionWhereUniqueInput = {
    id?: string;
  };

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder;
    tenantId?: SortOrder;
    payedUntil?: SortOrder;
    _count?: SubscriptionCountOrderByAggregateInput;
    _max?: SubscriptionMaxOrderByAggregateInput;
    _min?: SubscriptionMinOrderByAggregateInput;
  };

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<SubscriptionScalarWhereWithAggregatesInput>;
    OR?: Enumerable<SubscriptionScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<SubscriptionScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    tenantId?: StringWithAggregatesFilter | string;
    payedUntil?: DateTimeNullableWithAggregatesFilter | Date | string | null;
  };

  export type ProductDataFeedIntegrationWhereInput = {
    AND?: Enumerable<ProductDataFeedIntegrationWhereInput>;
    OR?: Enumerable<ProductDataFeedIntegrationWhereInput>;
    NOT?: Enumerable<ProductDataFeedIntegrationWhereInput>;
    id?: StringFilter | string;
    enabled?: BoolFilter | boolean;
    subscription?: XOR<
      SubscriptionRelationFilter,
      SubscriptionWhereInput
    > | null;
    subscriptionId?: StringNullableFilter | string | null;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    productDataFeedApp?: XOR<
      ProductDataFeedAppRelationFilter,
      ProductDataFeedAppWhereInput
    >;
    productDataFeedAppId?: StringFilter | string;
    saleorApp?: XOR<SaleorAppRelationFilter, SaleorAppWhereInput>;
    saleorAppId?: StringFilter | string;
  };

  export type ProductDataFeedIntegrationOrderByWithRelationInput = {
    id?: SortOrder;
    enabled?: SortOrder;
    subscription?: SubscriptionOrderByWithRelationInput;
    subscriptionId?: SortOrder;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    productDataFeedApp?: ProductDataFeedAppOrderByWithRelationInput;
    productDataFeedAppId?: SortOrder;
    saleorApp?: SaleorAppOrderByWithRelationInput;
    saleorAppId?: SortOrder;
  };

  export type ProductDataFeedIntegrationWhereUniqueInput = {
    id?: string;
    subscriptionId?: string;
    productDataFeedAppId?: string;
  };

  export type ProductDataFeedIntegrationOrderByWithAggregationInput = {
    id?: SortOrder;
    enabled?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    productDataFeedAppId?: SortOrder;
    saleorAppId?: SortOrder;
    _count?: ProductDataFeedIntegrationCountOrderByAggregateInput;
    _max?: ProductDataFeedIntegrationMaxOrderByAggregateInput;
    _min?: ProductDataFeedIntegrationMinOrderByAggregateInput;
  };

  export type ProductDataFeedIntegrationScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ProductDataFeedIntegrationScalarWhereWithAggregatesInput>;
    OR?: Enumerable<ProductDataFeedIntegrationScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<ProductDataFeedIntegrationScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    enabled?: BoolWithAggregatesFilter | boolean;
    subscriptionId?: StringNullableWithAggregatesFilter | string | null;
    tenantId?: StringWithAggregatesFilter | string;
    productDataFeedAppId?: StringWithAggregatesFilter | string;
    saleorAppId?: StringWithAggregatesFilter | string;
  };

  export type LogisticsIntegrationWhereInput = {
    AND?: Enumerable<LogisticsIntegrationWhereInput>;
    OR?: Enumerable<LogisticsIntegrationWhereInput>;
    NOT?: Enumerable<LogisticsIntegrationWhereInput>;
    id?: StringFilter | string;
    enabled?: BoolFilter | boolean;
    subscription?: XOR<
      SubscriptionRelationFilter,
      SubscriptionWhereInput
    > | null;
    subscriptionId?: StringNullableFilter | string | null;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    zohoApp?: XOR<ZohoAppRelationFilter, ZohoAppWhereInput>;
    zohoAppId?: StringFilter | string;
    logisticsApp?: XOR<LogisticsAppRelationFilter, LogisticsAppWhereInput>;
    logisticsAppId?: StringFilter | string;
  };

  export type LogisticsIntegrationOrderByWithRelationInput = {
    id?: SortOrder;
    enabled?: SortOrder;
    subscription?: SubscriptionOrderByWithRelationInput;
    subscriptionId?: SortOrder;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    zohoApp?: ZohoAppOrderByWithRelationInput;
    zohoAppId?: SortOrder;
    logisticsApp?: LogisticsAppOrderByWithRelationInput;
    logisticsAppId?: SortOrder;
  };

  export type LogisticsIntegrationWhereUniqueInput = {
    id?: string;
    subscriptionId?: string;
    logisticsAppId?: string;
  };

  export type LogisticsIntegrationOrderByWithAggregationInput = {
    id?: SortOrder;
    enabled?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    zohoAppId?: SortOrder;
    logisticsAppId?: SortOrder;
    _count?: LogisticsIntegrationCountOrderByAggregateInput;
    _max?: LogisticsIntegrationMaxOrderByAggregateInput;
    _min?: LogisticsIntegrationMinOrderByAggregateInput;
  };

  export type LogisticsIntegrationScalarWhereWithAggregatesInput = {
    AND?: Enumerable<LogisticsIntegrationScalarWhereWithAggregatesInput>;
    OR?: Enumerable<LogisticsIntegrationScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<LogisticsIntegrationScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    enabled?: BoolWithAggregatesFilter | boolean;
    subscriptionId?: StringNullableWithAggregatesFilter | string | null;
    tenantId?: StringWithAggregatesFilter | string;
    zohoAppId?: StringWithAggregatesFilter | string;
    logisticsAppId?: StringWithAggregatesFilter | string;
  };

  export type StrapiToZohoIntegrationWhereInput = {
    AND?: Enumerable<StrapiToZohoIntegrationWhereInput>;
    OR?: Enumerable<StrapiToZohoIntegrationWhereInput>;
    NOT?: Enumerable<StrapiToZohoIntegrationWhereInput>;
    id?: StringFilter | string;
    payedUntil?: DateTimeNullableFilter | Date | string | null;
    enabled?: BoolFilter | boolean;
    strapiContentType?: StringFilter | string;
    subscription?: XOR<
      SubscriptionRelationFilter,
      SubscriptionWhereInput
    > | null;
    subscriptionId?: StringNullableFilter | string | null;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    strapiApp?: XOR<StrapiAppRelationFilter, StrapiAppWhereInput>;
    strapiAppId?: StringFilter | string;
    zohoApp?: XOR<ZohoAppRelationFilter, ZohoAppWhereInput>;
    zohoAppId?: StringFilter | string;
  };

  export type StrapiToZohoIntegrationOrderByWithRelationInput = {
    id?: SortOrder;
    payedUntil?: SortOrder;
    enabled?: SortOrder;
    strapiContentType?: SortOrder;
    subscription?: SubscriptionOrderByWithRelationInput;
    subscriptionId?: SortOrder;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    strapiApp?: StrapiAppOrderByWithRelationInput;
    strapiAppId?: SortOrder;
    zohoApp?: ZohoAppOrderByWithRelationInput;
    zohoAppId?: SortOrder;
  };

  export type StrapiToZohoIntegrationWhereUniqueInput = {
    id?: string;
    subscriptionId?: string;
    strapiAppId?: string;
  };

  export type StrapiToZohoIntegrationOrderByWithAggregationInput = {
    id?: SortOrder;
    payedUntil?: SortOrder;
    enabled?: SortOrder;
    strapiContentType?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    strapiAppId?: SortOrder;
    zohoAppId?: SortOrder;
    _count?: StrapiToZohoIntegrationCountOrderByAggregateInput;
    _max?: StrapiToZohoIntegrationMaxOrderByAggregateInput;
    _min?: StrapiToZohoIntegrationMinOrderByAggregateInput;
  };

  export type StrapiToZohoIntegrationScalarWhereWithAggregatesInput = {
    AND?: Enumerable<StrapiToZohoIntegrationScalarWhereWithAggregatesInput>;
    OR?: Enumerable<StrapiToZohoIntegrationScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<StrapiToZohoIntegrationScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    payedUntil?: DateTimeNullableWithAggregatesFilter | Date | string | null;
    enabled?: BoolWithAggregatesFilter | boolean;
    strapiContentType?: StringWithAggregatesFilter | string;
    subscriptionId?: StringNullableWithAggregatesFilter | string | null;
    tenantId?: StringWithAggregatesFilter | string;
    strapiAppId?: StringWithAggregatesFilter | string;
    zohoAppId?: StringWithAggregatesFilter | string;
  };

  export type StrapiAppWhereInput = {
    AND?: Enumerable<StrapiAppWhereInput>;
    OR?: Enumerable<StrapiAppWhereInput>;
    NOT?: Enumerable<StrapiAppWhereInput>;
    id?: StringFilter | string;
    name?: StringFilter | string;
    webhooks?: IncomingStrapiWebhookListRelationFilter;
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>;
    tenantId?: StringFilter | string;
    integration?: XOR<
      StrapiToZohoIntegrationRelationFilter,
      StrapiToZohoIntegrationWhereInput
    > | null;
  };

  export type StrapiAppOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    webhooks?: IncomingStrapiWebhookOrderByRelationAggregateInput;
    tenant?: TenantOrderByWithRelationInput;
    tenantId?: SortOrder;
    integration?: StrapiToZohoIntegrationOrderByWithRelationInput;
  };

  export type StrapiAppWhereUniqueInput = {
    id?: string;
  };

  export type StrapiAppOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    tenantId?: SortOrder;
    _count?: StrapiAppCountOrderByAggregateInput;
    _max?: StrapiAppMaxOrderByAggregateInput;
    _min?: StrapiAppMinOrderByAggregateInput;
  };

  export type StrapiAppScalarWhereWithAggregatesInput = {
    AND?: Enumerable<StrapiAppScalarWhereWithAggregatesInput>;
    OR?: Enumerable<StrapiAppScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<StrapiAppScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    name?: StringWithAggregatesFilter | string;
    tenantId?: StringWithAggregatesFilter | string;
  };

  export type IncomingSaleorWebhookWhereInput = {
    AND?: Enumerable<IncomingSaleorWebhookWhereInput>;
    OR?: Enumerable<IncomingSaleorWebhookWhereInput>;
    NOT?: Enumerable<IncomingSaleorWebhookWhereInput>;
    id?: StringFilter | string;
    name?: StringNullableFilter | string | null;
    createdAt?: DateTimeFilter | Date | string;
    updatedAt?: DateTimeFilter | Date | string;
    secret?: XOR<SecretKeyRelationFilter, SecretKeyWhereInput>;
    secretId?: StringFilter | string;
    installedSaleorApp?: XOR<
      InstalledSaleorAppRelationFilter,
      InstalledSaleorAppWhereInput
    >;
    installedSaleorAppId?: StringFilter | string;
  };

  export type IncomingSaleorWebhookOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    secret?: SecretKeyOrderByWithRelationInput;
    secretId?: SortOrder;
    installedSaleorApp?: InstalledSaleorAppOrderByWithRelationInput;
    installedSaleorAppId?: SortOrder;
  };

  export type IncomingSaleorWebhookWhereUniqueInput = {
    id?: string;
    secretId?: string;
  };

  export type IncomingSaleorWebhookOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    secretId?: SortOrder;
    installedSaleorAppId?: SortOrder;
    _count?: IncomingSaleorWebhookCountOrderByAggregateInput;
    _max?: IncomingSaleorWebhookMaxOrderByAggregateInput;
    _min?: IncomingSaleorWebhookMinOrderByAggregateInput;
  };

  export type IncomingSaleorWebhookScalarWhereWithAggregatesInput = {
    AND?: Enumerable<IncomingSaleorWebhookScalarWhereWithAggregatesInput>;
    OR?: Enumerable<IncomingSaleorWebhookScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<IncomingSaleorWebhookScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    name?: StringNullableWithAggregatesFilter | string | null;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter | Date | string;
    secretId?: StringWithAggregatesFilter | string;
    installedSaleorAppId?: StringWithAggregatesFilter | string;
  };

  export type IncomingStrapiWebhookWhereInput = {
    AND?: Enumerable<IncomingStrapiWebhookWhereInput>;
    OR?: Enumerable<IncomingStrapiWebhookWhereInput>;
    NOT?: Enumerable<IncomingStrapiWebhookWhereInput>;
    id?: StringFilter | string;
    name?: StringNullableFilter | string | null;
    createdAt?: DateTimeFilter | Date | string;
    updatedAt?: DateTimeFilter | Date | string;
    secret?: XOR<SecretKeyRelationFilter, SecretKeyWhereInput>;
    secretId?: StringFilter | string;
    strapiApp?: XOR<StrapiAppRelationFilter, StrapiAppWhereInput>;
    strapiAppId?: StringFilter | string;
  };

  export type IncomingStrapiWebhookOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    secret?: SecretKeyOrderByWithRelationInput;
    secretId?: SortOrder;
    strapiApp?: StrapiAppOrderByWithRelationInput;
    strapiAppId?: SortOrder;
  };

  export type IncomingStrapiWebhookWhereUniqueInput = {
    id?: string;
    secretId?: string;
  };

  export type IncomingStrapiWebhookOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    secretId?: SortOrder;
    strapiAppId?: SortOrder;
    _count?: IncomingStrapiWebhookCountOrderByAggregateInput;
    _max?: IncomingStrapiWebhookMaxOrderByAggregateInput;
    _min?: IncomingStrapiWebhookMinOrderByAggregateInput;
  };

  export type IncomingStrapiWebhookScalarWhereWithAggregatesInput = {
    AND?: Enumerable<IncomingStrapiWebhookScalarWhereWithAggregatesInput>;
    OR?: Enumerable<IncomingStrapiWebhookScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<IncomingStrapiWebhookScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    name?: StringNullableWithAggregatesFilter | string | null;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter | Date | string;
    secretId?: StringWithAggregatesFilter | string;
    strapiAppId?: StringWithAggregatesFilter | string;
  };

  export type IncomingProductDataFeedWebhookWhereInput = {
    AND?: Enumerable<IncomingProductDataFeedWebhookWhereInput>;
    OR?: Enumerable<IncomingProductDataFeedWebhookWhereInput>;
    NOT?: Enumerable<IncomingProductDataFeedWebhookWhereInput>;
    id?: StringFilter | string;
    name?: StringNullableFilter | string | null;
    createdAt?: DateTimeFilter | Date | string;
    updatedAt?: DateTimeFilter | Date | string;
    productDataFeedApp?: XOR<
      ProductDataFeedAppRelationFilter,
      ProductDataFeedAppWhereInput
    >;
    productDataFeedAppId?: StringFilter | string;
  };

  export type IncomingProductDataFeedWebhookOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    productDataFeedApp?: ProductDataFeedAppOrderByWithRelationInput;
    productDataFeedAppId?: SortOrder;
  };

  export type IncomingProductDataFeedWebhookWhereUniqueInput = {
    id?: string;
  };

  export type IncomingProductDataFeedWebhookOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    productDataFeedAppId?: SortOrder;
    _count?: IncomingProductDataFeedWebhookCountOrderByAggregateInput;
    _max?: IncomingProductDataFeedWebhookMaxOrderByAggregateInput;
    _min?: IncomingProductDataFeedWebhookMinOrderByAggregateInput;
  };

  export type IncomingProductDataFeedWebhookScalarWhereWithAggregatesInput = {
    AND?: Enumerable<IncomingProductDataFeedWebhookScalarWhereWithAggregatesInput>;
    OR?: Enumerable<IncomingProductDataFeedWebhookScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<IncomingProductDataFeedWebhookScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    name?: StringNullableWithAggregatesFilter | string | null;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter | Date | string;
    productDataFeedAppId?: StringWithAggregatesFilter | string;
  };

  export type IncomingLogisticsWebhookWhereInput = {
    AND?: Enumerable<IncomingLogisticsWebhookWhereInput>;
    OR?: Enumerable<IncomingLogisticsWebhookWhereInput>;
    NOT?: Enumerable<IncomingLogisticsWebhookWhereInput>;
    id?: StringFilter | string;
    name?: StringNullableFilter | string | null;
    createdAt?: DateTimeFilter | Date | string;
    updatedAt?: DateTimeFilter | Date | string;
    logisticsApp?: XOR<LogisticsAppRelationFilter, LogisticsAppWhereInput>;
    logisticsAppId?: StringFilter | string;
  };

  export type IncomingLogisticsWebhookOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    logisticsApp?: LogisticsAppOrderByWithRelationInput;
    logisticsAppId?: SortOrder;
  };

  export type IncomingLogisticsWebhookWhereUniqueInput = {
    id?: string;
  };

  export type IncomingLogisticsWebhookOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    logisticsAppId?: SortOrder;
    _count?: IncomingLogisticsWebhookCountOrderByAggregateInput;
    _max?: IncomingLogisticsWebhookMaxOrderByAggregateInput;
    _min?: IncomingLogisticsWebhookMinOrderByAggregateInput;
  };

  export type IncomingLogisticsWebhookScalarWhereWithAggregatesInput = {
    AND?: Enumerable<IncomingLogisticsWebhookScalarWhereWithAggregatesInput>;
    OR?: Enumerable<IncomingLogisticsWebhookScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<IncomingLogisticsWebhookScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    name?: StringNullableWithAggregatesFilter | string | null;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter | Date | string;
    logisticsAppId?: StringWithAggregatesFilter | string;
  };

  export type SecretKeyWhereInput = {
    AND?: Enumerable<SecretKeyWhereInput>;
    OR?: Enumerable<SecretKeyWhereInput>;
    NOT?: Enumerable<SecretKeyWhereInput>;
    id?: StringFilter | string;
    name?: StringNullableFilter | string | null;
    secret?: StringFilter | string;
    createdAt?: DateTimeFilter | Date | string;
    incomingSaleorWebhook?: XOR<
      IncomingSaleorWebhookRelationFilter,
      IncomingSaleorWebhookWhereInput
    > | null;
    IncomingStrapiWebhook?: XOR<
      IncomingStrapiWebhookRelationFilter,
      IncomingStrapiWebhookWhereInput
    > | null;
  };

  export type SecretKeyOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    secret?: SortOrder;
    createdAt?: SortOrder;
    incomingSaleorWebhook?: IncomingSaleorWebhookOrderByWithRelationInput;
    IncomingStrapiWebhook?: IncomingStrapiWebhookOrderByWithRelationInput;
  };

  export type SecretKeyWhereUniqueInput = {
    id?: string;
  };

  export type SecretKeyOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    secret?: SortOrder;
    createdAt?: SortOrder;
    _count?: SecretKeyCountOrderByAggregateInput;
    _max?: SecretKeyMaxOrderByAggregateInput;
    _min?: SecretKeyMinOrderByAggregateInput;
  };

  export type SecretKeyScalarWhereWithAggregatesInput = {
    AND?: Enumerable<SecretKeyScalarWhereWithAggregatesInput>;
    OR?: Enumerable<SecretKeyScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<SecretKeyScalarWhereWithAggregatesInput>;
    id?: StringWithAggregatesFilter | string;
    name?: StringNullableWithAggregatesFilter | string | null;
    secret?: StringWithAggregatesFilter | string;
    createdAt?: DateTimeWithAggregatesFilter | Date | string;
  };

  export type ProductDataFeedAppCreateInput = {
    id: string;
    productDetailStorefrontURL: string;
    saleorApp: SaleorAppCreateNestedOneWithoutProductDataFeedAppInput;
    tenant: TenantCreateNestedOneWithoutProductdatafeedAppsInput;
    webhooks?: IncomingProductDataFeedWebhookCreateNestedManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationCreateNestedOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedCreateInput = {
    id: string;
    productDetailStorefrontURL: string;
    saleorAppId: string;
    tenantId: string;
    webhooks?: IncomingProductDataFeedWebhookUncheckedCreateNestedManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationUncheckedCreateNestedOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    saleorApp?: SaleorAppUpdateOneRequiredWithoutProductDataFeedAppInput;
    tenant?: TenantUpdateOneRequiredWithoutProductdatafeedAppsInput;
    webhooks?: IncomingProductDataFeedWebhookUpdateManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationUpdateOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingProductDataFeedWebhookUncheckedUpdateManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationUncheckedUpdateOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppCreateManyInput = {
    id: string;
    productDetailStorefrontURL: string;
    saleorAppId: string;
    tenantId: string;
  };

  export type ProductDataFeedAppUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
  };

  export type ProductDataFeedAppUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
  };

  export type LogisticsAppCreateInput = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
    tenant: TenantCreateNestedOneWithoutLogisticsAppInput;
    webhooks?: IncomingLogisticsWebhookCreateNestedManyWithoutLogisticsAppInput;
    integration?: LogisticsIntegrationCreateNestedOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppUncheckedCreateInput = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
    tenantId: string;
    webhooks?: IncomingLogisticsWebhookUncheckedCreateNestedManyWithoutLogisticsAppInput;
    integration?: LogisticsIntegrationUncheckedCreateNestedOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
    tenant?: TenantUpdateOneRequiredWithoutLogisticsAppInput;
    webhooks?: IncomingLogisticsWebhookUpdateManyWithoutLogisticsAppInput;
    integration?: LogisticsIntegrationUpdateOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingLogisticsWebhookUncheckedUpdateManyWithoutLogisticsAppInput;
    integration?: LogisticsIntegrationUncheckedUpdateOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppCreateManyInput = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
    tenantId: string;
  };

  export type LogisticsAppUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
  };

  export type LogisticsAppUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
  };

  export type ZohoAppCreateInput = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    tenant: TenantCreateNestedOneWithoutZohoAppsInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutZohoAppInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutZohoAppInput;
  };

  export type ZohoAppUncheckedCreateInput = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    tenantId: string;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutZohoAppInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutZohoAppInput;
  };

  export type ZohoAppUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
    tenant?: TenantUpdateOneRequiredWithoutZohoAppsInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutZohoAppInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutZohoAppInput;
  };

  export type ZohoAppUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutZohoAppInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutZohoAppInput;
  };

  export type ZohoAppCreateManyInput = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    tenantId: string;
  };

  export type ZohoAppUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
  };

  export type ZohoAppUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
  };

  export type SaleorAppCreateInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    installedSaleorApp?: InstalledSaleorAppCreateNestedOneWithoutSaleorAppInput;
    tenant: TenantCreateNestedOneWithoutSaleorAppsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppCreateNestedManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedCreateInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    tenantId: string;
    installedSaleorApp?: InstalledSaleorAppUncheckedCreateNestedOneWithoutSaleorAppInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUncheckedCreateNestedManyWithoutSaleorAppInput;
  };

  export type SaleorAppUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    installedSaleorApp?: InstalledSaleorAppUpdateOneWithoutSaleorAppInput;
    tenant?: TenantUpdateOneRequiredWithoutSaleorAppsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUpdateManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    installedSaleorApp?: InstalledSaleorAppUncheckedUpdateOneWithoutSaleorAppInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUncheckedUpdateManyWithoutSaleorAppInput;
  };

  export type SaleorAppCreateManyInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    tenantId: string;
  };

  export type SaleorAppUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type SaleorAppUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
  };

  export type InstalledSaleorAppCreateInput = {
    id: string;
    token: string;
    webhooks?: IncomingSaleorWebhookCreateNestedManyWithoutInstalledSaleorAppInput;
    saleorApp: SaleorAppCreateNestedOneWithoutInstalledSaleorAppInput;
  };

  export type InstalledSaleorAppUncheckedCreateInput = {
    id: string;
    token: string;
    saleorAppId: string;
    webhooks?: IncomingSaleorWebhookUncheckedCreateNestedManyWithoutInstalledSaleorAppInput;
  };

  export type InstalledSaleorAppUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingSaleorWebhookUpdateManyWithoutInstalledSaleorAppInput;
    saleorApp?: SaleorAppUpdateOneRequiredWithoutInstalledSaleorAppInput;
  };

  export type InstalledSaleorAppUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingSaleorWebhookUncheckedUpdateManyWithoutInstalledSaleorAppInput;
  };

  export type InstalledSaleorAppCreateManyInput = {
    id: string;
    token: string;
    saleorAppId: string;
  };

  export type InstalledSaleorAppUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
  };

  export type InstalledSaleorAppUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type TenantCreateInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedUpdateManyWithoutTenantInput;
  };

  export type TenantCreateManyInput = {
    id: string;
    name: string;
  };

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
  };

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
  };

  export type SubscriptionCreateInput = {
    id: string;
    payedUntil?: Date | string | null;
    tenant: TenantCreateNestedOneWithoutSubscriptionsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedCreateInput = {
    id: string;
    tenantId: string;
    payedUntil?: Date | string | null;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
  };

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationUpdateOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
  };

  export type SubscriptionCreateManyInput = {
    id: string;
    tenantId: string;
    payedUntil?: Date | string | null;
  };

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type ProductDataFeedIntegrationCreateInput = {
    id: string;
    enabled?: boolean;
    subscription?: SubscriptionCreateNestedOneWithoutProductDataFeedIntegrationInput;
    tenant: TenantCreateNestedOneWithoutProductDataFeedIntegrationInput;
    productDataFeedApp: ProductDataFeedAppCreateNestedOneWithoutIntegrationInput;
    saleorApp: SaleorAppCreateNestedOneWithoutProductDataFeedIntegrationInput;
  };

  export type ProductDataFeedIntegrationUncheckedCreateInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    tenantId: string;
    productDataFeedAppId: string;
    saleorAppId: string;
  };

  export type ProductDataFeedIntegrationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscription?: SubscriptionUpdateOneWithoutProductDataFeedIntegrationInput;
    tenant?: TenantUpdateOneRequiredWithoutProductDataFeedIntegrationInput;
    productDataFeedApp?: ProductDataFeedAppUpdateOneRequiredWithoutIntegrationInput;
    saleorApp?: SaleorAppUpdateOneRequiredWithoutProductDataFeedIntegrationInput;
  };

  export type ProductDataFeedIntegrationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    productDataFeedAppId?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type ProductDataFeedIntegrationCreateManyInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    tenantId: string;
    productDataFeedAppId: string;
    saleorAppId: string;
  };

  export type ProductDataFeedIntegrationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type ProductDataFeedIntegrationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    productDataFeedAppId?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type LogisticsIntegrationCreateInput = {
    id: string;
    enabled?: boolean;
    subscription?: SubscriptionCreateNestedOneWithoutLogisticsIntegrationInput;
    tenant: TenantCreateNestedOneWithoutLogisticsIntegrationInput;
    zohoApp: ZohoAppCreateNestedOneWithoutLogisticsIntegrationInput;
    logisticsApp: LogisticsAppCreateNestedOneWithoutIntegrationInput;
  };

  export type LogisticsIntegrationUncheckedCreateInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    tenantId: string;
    zohoAppId: string;
    logisticsAppId: string;
  };

  export type LogisticsIntegrationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscription?: SubscriptionUpdateOneWithoutLogisticsIntegrationInput;
    tenant?: TenantUpdateOneRequiredWithoutLogisticsIntegrationInput;
    zohoApp?: ZohoAppUpdateOneRequiredWithoutLogisticsIntegrationInput;
    logisticsApp?: LogisticsAppUpdateOneRequiredWithoutIntegrationInput;
  };

  export type LogisticsIntegrationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    zohoAppId?: StringFieldUpdateOperationsInput | string;
    logisticsAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type LogisticsIntegrationCreateManyInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    tenantId: string;
    zohoAppId: string;
    logisticsAppId: string;
  };

  export type LogisticsIntegrationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type LogisticsIntegrationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    zohoAppId?: StringFieldUpdateOperationsInput | string;
    logisticsAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type StrapiToZohoIntegrationCreateInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscription?: SubscriptionCreateNestedOneWithoutStrapiToZohoIntegrationInput;
    tenant: TenantCreateNestedOneWithoutStrapiToZohoIntegrationInput;
    strapiApp: StrapiAppCreateNestedOneWithoutIntegrationInput;
    zohoApp: ZohoAppCreateNestedOneWithoutStrapiToZohoIntegrationInput;
  };

  export type StrapiToZohoIntegrationUncheckedCreateInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscriptionId?: string | null;
    tenantId: string;
    strapiAppId: string;
    zohoAppId: string;
  };

  export type StrapiToZohoIntegrationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    subscription?: SubscriptionUpdateOneWithoutStrapiToZohoIntegrationInput;
    tenant?: TenantUpdateOneRequiredWithoutStrapiToZohoIntegrationInput;
    strapiApp?: StrapiAppUpdateOneRequiredWithoutIntegrationInput;
    zohoApp?: ZohoAppUpdateOneRequiredWithoutStrapiToZohoIntegrationInput;
  };

  export type StrapiToZohoIntegrationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    strapiAppId?: StringFieldUpdateOperationsInput | string;
    zohoAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type StrapiToZohoIntegrationCreateManyInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscriptionId?: string | null;
    tenantId: string;
    strapiAppId: string;
    zohoAppId: string;
  };

  export type StrapiToZohoIntegrationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
  };

  export type StrapiToZohoIntegrationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    strapiAppId?: StringFieldUpdateOperationsInput | string;
    zohoAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type StrapiAppCreateInput = {
    id: string;
    name: string;
    webhooks?: IncomingStrapiWebhookCreateNestedManyWithoutStrapiAppInput;
    tenant: TenantCreateNestedOneWithoutStrapiAppsInput;
    integration?: StrapiToZohoIntegrationCreateNestedOneWithoutStrapiAppInput;
  };

  export type StrapiAppUncheckedCreateInput = {
    id: string;
    name: string;
    tenantId: string;
    webhooks?: IncomingStrapiWebhookUncheckedCreateNestedManyWithoutStrapiAppInput;
    integration?: StrapiToZohoIntegrationUncheckedCreateNestedOneWithoutStrapiAppInput;
  };

  export type StrapiAppUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingStrapiWebhookUpdateManyWithoutStrapiAppInput;
    tenant?: TenantUpdateOneRequiredWithoutStrapiAppsInput;
    integration?: StrapiToZohoIntegrationUpdateOneWithoutStrapiAppInput;
  };

  export type StrapiAppUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingStrapiWebhookUncheckedUpdateManyWithoutStrapiAppInput;
    integration?: StrapiToZohoIntegrationUncheckedUpdateOneWithoutStrapiAppInput;
  };

  export type StrapiAppCreateManyInput = {
    id: string;
    name: string;
    tenantId: string;
  };

  export type StrapiAppUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
  };

  export type StrapiAppUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingSaleorWebhookCreateInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secret: SecretKeyCreateNestedOneWithoutIncomingSaleorWebhookInput;
    installedSaleorApp: InstalledSaleorAppCreateNestedOneWithoutWebhooksInput;
  };

  export type IncomingSaleorWebhookUncheckedCreateInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secretId: string;
    installedSaleorAppId: string;
  };

  export type IncomingSaleorWebhookUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secret?: SecretKeyUpdateOneRequiredWithoutIncomingSaleorWebhookInput;
    installedSaleorApp?: InstalledSaleorAppUpdateOneRequiredWithoutWebhooksInput;
  };

  export type IncomingSaleorWebhookUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secretId?: StringFieldUpdateOperationsInput | string;
    installedSaleorAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingSaleorWebhookCreateManyInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secretId: string;
    installedSaleorAppId: string;
  };

  export type IncomingSaleorWebhookUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncomingSaleorWebhookUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secretId?: StringFieldUpdateOperationsInput | string;
    installedSaleorAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingStrapiWebhookCreateInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secret: SecretKeyCreateNestedOneWithoutIncomingStrapiWebhookInput;
    strapiApp: StrapiAppCreateNestedOneWithoutWebhooksInput;
  };

  export type IncomingStrapiWebhookUncheckedCreateInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secretId: string;
    strapiAppId: string;
  };

  export type IncomingStrapiWebhookUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secret?: SecretKeyUpdateOneRequiredWithoutIncomingStrapiWebhookInput;
    strapiApp?: StrapiAppUpdateOneRequiredWithoutWebhooksInput;
  };

  export type IncomingStrapiWebhookUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secretId?: StringFieldUpdateOperationsInput | string;
    strapiAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingStrapiWebhookCreateManyInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secretId: string;
    strapiAppId: string;
  };

  export type IncomingStrapiWebhookUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncomingStrapiWebhookUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secretId?: StringFieldUpdateOperationsInput | string;
    strapiAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingProductDataFeedWebhookCreateInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    productDataFeedApp: ProductDataFeedAppCreateNestedOneWithoutWebhooksInput;
  };

  export type IncomingProductDataFeedWebhookUncheckedCreateInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    productDataFeedAppId: string;
  };

  export type IncomingProductDataFeedWebhookUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    productDataFeedApp?: ProductDataFeedAppUpdateOneRequiredWithoutWebhooksInput;
  };

  export type IncomingProductDataFeedWebhookUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    productDataFeedAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingProductDataFeedWebhookCreateManyInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    productDataFeedAppId: string;
  };

  export type IncomingProductDataFeedWebhookUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncomingProductDataFeedWebhookUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    productDataFeedAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingLogisticsWebhookCreateInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    logisticsApp: LogisticsAppCreateNestedOneWithoutWebhooksInput;
  };

  export type IncomingLogisticsWebhookUncheckedCreateInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    logisticsAppId: string;
  };

  export type IncomingLogisticsWebhookUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    logisticsApp?: LogisticsAppUpdateOneRequiredWithoutWebhooksInput;
  };

  export type IncomingLogisticsWebhookUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    logisticsAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingLogisticsWebhookCreateManyInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    logisticsAppId: string;
  };

  export type IncomingLogisticsWebhookUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncomingLogisticsWebhookUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    logisticsAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type SecretKeyCreateInput = {
    id?: string;
    name?: string | null;
    secret: string;
    createdAt?: Date | string;
    incomingSaleorWebhook?: IncomingSaleorWebhookCreateNestedOneWithoutSecretInput;
    IncomingStrapiWebhook?: IncomingStrapiWebhookCreateNestedOneWithoutSecretInput;
  };

  export type SecretKeyUncheckedCreateInput = {
    id?: string;
    name?: string | null;
    secret: string;
    createdAt?: Date | string;
    incomingSaleorWebhook?: IncomingSaleorWebhookUncheckedCreateNestedOneWithoutSecretInput;
    IncomingStrapiWebhook?: IncomingStrapiWebhookUncheckedCreateNestedOneWithoutSecretInput;
  };

  export type SecretKeyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    secret?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    incomingSaleorWebhook?: IncomingSaleorWebhookUpdateOneWithoutSecretInput;
    IncomingStrapiWebhook?: IncomingStrapiWebhookUpdateOneWithoutSecretInput;
  };

  export type SecretKeyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    secret?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    incomingSaleorWebhook?: IncomingSaleorWebhookUncheckedUpdateOneWithoutSecretInput;
    IncomingStrapiWebhook?: IncomingStrapiWebhookUncheckedUpdateOneWithoutSecretInput;
  };

  export type SecretKeyCreateManyInput = {
    id?: string;
    name?: string | null;
    secret: string;
    createdAt?: Date | string;
  };

  export type SecretKeyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    secret?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SecretKeyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    secret?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: QueryMode;
    not?: NestedStringFilter | string;
  };

  export type SaleorAppRelationFilter = {
    is?: SaleorAppWhereInput;
    isNot?: SaleorAppWhereInput;
  };

  export type TenantRelationFilter = {
    is?: TenantWhereInput;
    isNot?: TenantWhereInput;
  };

  export type IncomingProductDataFeedWebhookListRelationFilter = {
    every?: IncomingProductDataFeedWebhookWhereInput;
    some?: IncomingProductDataFeedWebhookWhereInput;
    none?: IncomingProductDataFeedWebhookWhereInput;
  };

  export type ProductDataFeedIntegrationRelationFilter = {
    is?: ProductDataFeedIntegrationWhereInput | null;
    isNot?: ProductDataFeedIntegrationWhereInput | null;
  };

  export type IncomingProductDataFeedWebhookOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ProductDataFeedAppCountOrderByAggregateInput = {
    id?: SortOrder;
    productDetailStorefrontURL?: SortOrder;
    saleorAppId?: SortOrder;
    tenantId?: SortOrder;
  };

  export type ProductDataFeedAppMaxOrderByAggregateInput = {
    id?: SortOrder;
    productDetailStorefrontURL?: SortOrder;
    saleorAppId?: SortOrder;
    tenantId?: SortOrder;
  };

  export type ProductDataFeedAppMinOrderByAggregateInput = {
    id?: SortOrder;
    productDetailStorefrontURL?: SortOrder;
    saleorAppId?: SortOrder;
    tenantId?: SortOrder;
  };

  export type StringWithAggregatesFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter | string;
    _count?: NestedIntFilter;
    _min?: NestedStringFilter;
    _max?: NestedStringFilter;
  };

  export type IncomingLogisticsWebhookListRelationFilter = {
    every?: IncomingLogisticsWebhookWhereInput;
    some?: IncomingLogisticsWebhookWhereInput;
    none?: IncomingLogisticsWebhookWhereInput;
  };

  export type LogisticsIntegrationRelationFilter = {
    is?: LogisticsIntegrationWhereInput | null;
    isNot?: LogisticsIntegrationWhereInput | null;
  };

  export type IncomingLogisticsWebhookOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type LogisticsAppCountOrderByAggregateInput = {
    id?: SortOrder;
    currentOrdersCustomViewId?: SortOrder;
    nextFiveDaysOrdersCustomViewId?: SortOrder;
    currentBulkOrdersCustomViewId?: SortOrder;
    nextFiveDaysBulkOrdersCustomViewId?: SortOrder;
    tenantId?: SortOrder;
  };

  export type LogisticsAppMaxOrderByAggregateInput = {
    id?: SortOrder;
    currentOrdersCustomViewId?: SortOrder;
    nextFiveDaysOrdersCustomViewId?: SortOrder;
    currentBulkOrdersCustomViewId?: SortOrder;
    nextFiveDaysBulkOrdersCustomViewId?: SortOrder;
    tenantId?: SortOrder;
  };

  export type LogisticsAppMinOrderByAggregateInput = {
    id?: SortOrder;
    currentOrdersCustomViewId?: SortOrder;
    nextFiveDaysOrdersCustomViewId?: SortOrder;
    currentBulkOrdersCustomViewId?: SortOrder;
    nextFiveDaysBulkOrdersCustomViewId?: SortOrder;
    tenantId?: SortOrder;
  };

  export type StrapiToZohoIntegrationListRelationFilter = {
    every?: StrapiToZohoIntegrationWhereInput;
    some?: StrapiToZohoIntegrationWhereInput;
    none?: StrapiToZohoIntegrationWhereInput;
  };

  export type LogisticsIntegrationListRelationFilter = {
    every?: LogisticsIntegrationWhereInput;
    some?: LogisticsIntegrationWhereInput;
    none?: LogisticsIntegrationWhereInput;
  };

  export type StrapiToZohoIntegrationOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type LogisticsIntegrationOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ZohoAppCountOrderByAggregateInput = {
    id?: SortOrder;
    orgId?: SortOrder;
    clientId?: SortOrder;
    clientSecret?: SortOrder;
    tenantId?: SortOrder;
  };

  export type ZohoAppMaxOrderByAggregateInput = {
    id?: SortOrder;
    orgId?: SortOrder;
    clientId?: SortOrder;
    clientSecret?: SortOrder;
    tenantId?: SortOrder;
  };

  export type ZohoAppMinOrderByAggregateInput = {
    id?: SortOrder;
    orgId?: SortOrder;
    clientId?: SortOrder;
    clientSecret?: SortOrder;
    tenantId?: SortOrder;
  };

  export type StringNullableFilter = {
    equals?: string | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: QueryMode;
    not?: NestedStringNullableFilter | string | null;
  };

  export type InstalledSaleorAppRelationFilter = {
    is?: InstalledSaleorAppWhereInput;
    isNot?: InstalledSaleorAppWhereInput;
  };

  export type ProductDataFeedIntegrationListRelationFilter = {
    every?: ProductDataFeedIntegrationWhereInput;
    some?: ProductDataFeedIntegrationWhereInput;
    none?: ProductDataFeedIntegrationWhereInput;
  };

  export type ProductDataFeedAppListRelationFilter = {
    every?: ProductDataFeedAppWhereInput;
    some?: ProductDataFeedAppWhereInput;
    none?: ProductDataFeedAppWhereInput;
  };

  export type ProductDataFeedIntegrationOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ProductDataFeedAppOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type SaleorAppDomainChannelSlugCompoundUniqueInput = {
    domain: string;
    channelSlug: string;
  };

  export type SaleorAppCountOrderByAggregateInput = {
    id?: SortOrder;
    domain?: SortOrder;
    name?: SortOrder;
    channelSlug?: SortOrder;
    tenantId?: SortOrder;
  };

  export type SaleorAppMaxOrderByAggregateInput = {
    id?: SortOrder;
    domain?: SortOrder;
    name?: SortOrder;
    channelSlug?: SortOrder;
    tenantId?: SortOrder;
  };

  export type SaleorAppMinOrderByAggregateInput = {
    id?: SortOrder;
    domain?: SortOrder;
    name?: SortOrder;
    channelSlug?: SortOrder;
    tenantId?: SortOrder;
  };

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: QueryMode;
    not?: NestedStringNullableWithAggregatesFilter | string | null;
    _count?: NestedIntNullableFilter;
    _min?: NestedStringNullableFilter;
    _max?: NestedStringNullableFilter;
  };

  export type IncomingSaleorWebhookListRelationFilter = {
    every?: IncomingSaleorWebhookWhereInput;
    some?: IncomingSaleorWebhookWhereInput;
    none?: IncomingSaleorWebhookWhereInput;
  };

  export type IncomingSaleorWebhookOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type InstalledSaleorAppCountOrderByAggregateInput = {
    id?: SortOrder;
    token?: SortOrder;
    saleorAppId?: SortOrder;
  };

  export type InstalledSaleorAppMaxOrderByAggregateInput = {
    id?: SortOrder;
    token?: SortOrder;
    saleorAppId?: SortOrder;
  };

  export type InstalledSaleorAppMinOrderByAggregateInput = {
    id?: SortOrder;
    token?: SortOrder;
    saleorAppId?: SortOrder;
  };

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput;
    some?: SubscriptionWhereInput;
    none?: SubscriptionWhereInput;
  };

  export type SaleorAppListRelationFilter = {
    every?: SaleorAppWhereInput;
    some?: SaleorAppWhereInput;
    none?: SaleorAppWhereInput;
  };

  export type ZohoAppListRelationFilter = {
    every?: ZohoAppWhereInput;
    some?: ZohoAppWhereInput;
    none?: ZohoAppWhereInput;
  };

  export type StrapiAppListRelationFilter = {
    every?: StrapiAppWhereInput;
    some?: StrapiAppWhereInput;
    none?: StrapiAppWhereInput;
  };

  export type LogisticsAppListRelationFilter = {
    every?: LogisticsAppWhereInput;
    some?: LogisticsAppWhereInput;
    none?: LogisticsAppWhereInput;
  };

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type SaleorAppOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ZohoAppOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type StrapiAppOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type LogisticsAppOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
  };

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
  };

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
  };

  export type DateTimeNullableFilter = {
    equals?: Date | string | null;
    in?: Enumerable<Date> | Enumerable<string> | null;
    notIn?: Enumerable<Date> | Enumerable<string> | null;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeNullableFilter | Date | string | null;
  };

  export type StrapiToZohoIntegrationRelationFilter = {
    is?: StrapiToZohoIntegrationWhereInput | null;
    isNot?: StrapiToZohoIntegrationWhereInput | null;
  };

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder;
    tenantId?: SortOrder;
    payedUntil?: SortOrder;
  };

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder;
    tenantId?: SortOrder;
    payedUntil?: SortOrder;
  };

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder;
    tenantId?: SortOrder;
    payedUntil?: SortOrder;
  };

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null;
    in?: Enumerable<Date> | Enumerable<string> | null;
    notIn?: Enumerable<Date> | Enumerable<string> | null;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null;
    _count?: NestedIntNullableFilter;
    _min?: NestedDateTimeNullableFilter;
    _max?: NestedDateTimeNullableFilter;
  };

  export type BoolFilter = {
    equals?: boolean;
    not?: NestedBoolFilter | boolean;
  };

  export type SubscriptionRelationFilter = {
    is?: SubscriptionWhereInput | null;
    isNot?: SubscriptionWhereInput | null;
  };

  export type ProductDataFeedAppRelationFilter = {
    is?: ProductDataFeedAppWhereInput;
    isNot?: ProductDataFeedAppWhereInput;
  };

  export type ProductDataFeedIntegrationCountOrderByAggregateInput = {
    id?: SortOrder;
    enabled?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    productDataFeedAppId?: SortOrder;
    saleorAppId?: SortOrder;
  };

  export type ProductDataFeedIntegrationMaxOrderByAggregateInput = {
    id?: SortOrder;
    enabled?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    productDataFeedAppId?: SortOrder;
    saleorAppId?: SortOrder;
  };

  export type ProductDataFeedIntegrationMinOrderByAggregateInput = {
    id?: SortOrder;
    enabled?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    productDataFeedAppId?: SortOrder;
    saleorAppId?: SortOrder;
  };

  export type BoolWithAggregatesFilter = {
    equals?: boolean;
    not?: NestedBoolWithAggregatesFilter | boolean;
    _count?: NestedIntFilter;
    _min?: NestedBoolFilter;
    _max?: NestedBoolFilter;
  };

  export type ZohoAppRelationFilter = {
    is?: ZohoAppWhereInput;
    isNot?: ZohoAppWhereInput;
  };

  export type LogisticsAppRelationFilter = {
    is?: LogisticsAppWhereInput;
    isNot?: LogisticsAppWhereInput;
  };

  export type LogisticsIntegrationCountOrderByAggregateInput = {
    id?: SortOrder;
    enabled?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    zohoAppId?: SortOrder;
    logisticsAppId?: SortOrder;
  };

  export type LogisticsIntegrationMaxOrderByAggregateInput = {
    id?: SortOrder;
    enabled?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    zohoAppId?: SortOrder;
    logisticsAppId?: SortOrder;
  };

  export type LogisticsIntegrationMinOrderByAggregateInput = {
    id?: SortOrder;
    enabled?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    zohoAppId?: SortOrder;
    logisticsAppId?: SortOrder;
  };

  export type StrapiAppRelationFilter = {
    is?: StrapiAppWhereInput;
    isNot?: StrapiAppWhereInput;
  };

  export type StrapiToZohoIntegrationCountOrderByAggregateInput = {
    id?: SortOrder;
    payedUntil?: SortOrder;
    enabled?: SortOrder;
    strapiContentType?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    strapiAppId?: SortOrder;
    zohoAppId?: SortOrder;
  };

  export type StrapiToZohoIntegrationMaxOrderByAggregateInput = {
    id?: SortOrder;
    payedUntil?: SortOrder;
    enabled?: SortOrder;
    strapiContentType?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    strapiAppId?: SortOrder;
    zohoAppId?: SortOrder;
  };

  export type StrapiToZohoIntegrationMinOrderByAggregateInput = {
    id?: SortOrder;
    payedUntil?: SortOrder;
    enabled?: SortOrder;
    strapiContentType?: SortOrder;
    subscriptionId?: SortOrder;
    tenantId?: SortOrder;
    strapiAppId?: SortOrder;
    zohoAppId?: SortOrder;
  };

  export type IncomingStrapiWebhookListRelationFilter = {
    every?: IncomingStrapiWebhookWhereInput;
    some?: IncomingStrapiWebhookWhereInput;
    none?: IncomingStrapiWebhookWhereInput;
  };

  export type IncomingStrapiWebhookOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type StrapiAppCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    tenantId?: SortOrder;
  };

  export type StrapiAppMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    tenantId?: SortOrder;
  };

  export type StrapiAppMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    tenantId?: SortOrder;
  };

  export type DateTimeFilter = {
    equals?: Date | string;
    in?: Enumerable<Date> | Enumerable<string>;
    notIn?: Enumerable<Date> | Enumerable<string>;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeFilter | Date | string;
  };

  export type SecretKeyRelationFilter = {
    is?: SecretKeyWhereInput;
    isNot?: SecretKeyWhereInput;
  };

  export type IncomingSaleorWebhookCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    secretId?: SortOrder;
    installedSaleorAppId?: SortOrder;
  };

  export type IncomingSaleorWebhookMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    secretId?: SortOrder;
    installedSaleorAppId?: SortOrder;
  };

  export type IncomingSaleorWebhookMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    secretId?: SortOrder;
    installedSaleorAppId?: SortOrder;
  };

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string;
    in?: Enumerable<Date> | Enumerable<string>;
    notIn?: Enumerable<Date> | Enumerable<string>;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeWithAggregatesFilter | Date | string;
    _count?: NestedIntFilter;
    _min?: NestedDateTimeFilter;
    _max?: NestedDateTimeFilter;
  };

  export type IncomingStrapiWebhookCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    secretId?: SortOrder;
    strapiAppId?: SortOrder;
  };

  export type IncomingStrapiWebhookMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    secretId?: SortOrder;
    strapiAppId?: SortOrder;
  };

  export type IncomingStrapiWebhookMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    secretId?: SortOrder;
    strapiAppId?: SortOrder;
  };

  export type IncomingProductDataFeedWebhookCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    productDataFeedAppId?: SortOrder;
  };

  export type IncomingProductDataFeedWebhookMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    productDataFeedAppId?: SortOrder;
  };

  export type IncomingProductDataFeedWebhookMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    productDataFeedAppId?: SortOrder;
  };

  export type IncomingLogisticsWebhookCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    logisticsAppId?: SortOrder;
  };

  export type IncomingLogisticsWebhookMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    logisticsAppId?: SortOrder;
  };

  export type IncomingLogisticsWebhookMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    logisticsAppId?: SortOrder;
  };

  export type IncomingSaleorWebhookRelationFilter = {
    is?: IncomingSaleorWebhookWhereInput | null;
    isNot?: IncomingSaleorWebhookWhereInput | null;
  };

  export type IncomingStrapiWebhookRelationFilter = {
    is?: IncomingStrapiWebhookWhereInput | null;
    isNot?: IncomingStrapiWebhookWhereInput | null;
  };

  export type SecretKeyCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    secret?: SortOrder;
    createdAt?: SortOrder;
  };

  export type SecretKeyMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    secret?: SortOrder;
    createdAt?: SortOrder;
  };

  export type SecretKeyMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    secret?: SortOrder;
    createdAt?: SortOrder;
  };

  export type SaleorAppCreateNestedOneWithoutProductDataFeedAppInput = {
    create?: XOR<
      SaleorAppCreateWithoutProductDataFeedAppInput,
      SaleorAppUncheckedCreateWithoutProductDataFeedAppInput
    >;
    connectOrCreate?: SaleorAppCreateOrConnectWithoutProductDataFeedAppInput;
    connect?: SaleorAppWhereUniqueInput;
  };

  export type TenantCreateNestedOneWithoutProductdatafeedAppsInput = {
    create?: XOR<
      TenantCreateWithoutProductdatafeedAppsInput,
      TenantUncheckedCreateWithoutProductdatafeedAppsInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutProductdatafeedAppsInput;
    connect?: TenantWhereUniqueInput;
  };

  export type IncomingProductDataFeedWebhookCreateNestedManyWithoutProductDataFeedAppInput =
    {
      create?: XOR<
        Enumerable<IncomingProductDataFeedWebhookCreateWithoutProductDataFeedAppInput>,
        Enumerable<IncomingProductDataFeedWebhookUncheckedCreateWithoutProductDataFeedAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingProductDataFeedWebhookCreateOrConnectWithoutProductDataFeedAppInput>;
      createMany?: IncomingProductDataFeedWebhookCreateManyProductDataFeedAppInputEnvelope;
      connect?: Enumerable<IncomingProductDataFeedWebhookWhereUniqueInput>;
    };

  export type ProductDataFeedIntegrationCreateNestedOneWithoutProductDataFeedAppInput =
    {
      create?: XOR<
        ProductDataFeedIntegrationCreateWithoutProductDataFeedAppInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutProductDataFeedAppInput
      >;
      connectOrCreate?: ProductDataFeedIntegrationCreateOrConnectWithoutProductDataFeedAppInput;
      connect?: ProductDataFeedIntegrationWhereUniqueInput;
    };

  export type IncomingProductDataFeedWebhookUncheckedCreateNestedManyWithoutProductDataFeedAppInput =
    {
      create?: XOR<
        Enumerable<IncomingProductDataFeedWebhookCreateWithoutProductDataFeedAppInput>,
        Enumerable<IncomingProductDataFeedWebhookUncheckedCreateWithoutProductDataFeedAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingProductDataFeedWebhookCreateOrConnectWithoutProductDataFeedAppInput>;
      createMany?: IncomingProductDataFeedWebhookCreateManyProductDataFeedAppInputEnvelope;
      connect?: Enumerable<IncomingProductDataFeedWebhookWhereUniqueInput>;
    };

  export type ProductDataFeedIntegrationUncheckedCreateNestedOneWithoutProductDataFeedAppInput =
    {
      create?: XOR<
        ProductDataFeedIntegrationCreateWithoutProductDataFeedAppInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutProductDataFeedAppInput
      >;
      connectOrCreate?: ProductDataFeedIntegrationCreateOrConnectWithoutProductDataFeedAppInput;
      connect?: ProductDataFeedIntegrationWhereUniqueInput;
    };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type SaleorAppUpdateOneRequiredWithoutProductDataFeedAppInput = {
    create?: XOR<
      SaleorAppCreateWithoutProductDataFeedAppInput,
      SaleorAppUncheckedCreateWithoutProductDataFeedAppInput
    >;
    connectOrCreate?: SaleorAppCreateOrConnectWithoutProductDataFeedAppInput;
    upsert?: SaleorAppUpsertWithoutProductDataFeedAppInput;
    connect?: SaleorAppWhereUniqueInput;
    update?: XOR<
      SaleorAppUpdateWithoutProductDataFeedAppInput,
      SaleorAppUncheckedUpdateWithoutProductDataFeedAppInput
    >;
  };

  export type TenantUpdateOneRequiredWithoutProductdatafeedAppsInput = {
    create?: XOR<
      TenantCreateWithoutProductdatafeedAppsInput,
      TenantUncheckedCreateWithoutProductdatafeedAppsInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutProductdatafeedAppsInput;
    upsert?: TenantUpsertWithoutProductdatafeedAppsInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutProductdatafeedAppsInput,
      TenantUncheckedUpdateWithoutProductdatafeedAppsInput
    >;
  };

  export type IncomingProductDataFeedWebhookUpdateManyWithoutProductDataFeedAppInput =
    {
      create?: XOR<
        Enumerable<IncomingProductDataFeedWebhookCreateWithoutProductDataFeedAppInput>,
        Enumerable<IncomingProductDataFeedWebhookUncheckedCreateWithoutProductDataFeedAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingProductDataFeedWebhookCreateOrConnectWithoutProductDataFeedAppInput>;
      upsert?: Enumerable<IncomingProductDataFeedWebhookUpsertWithWhereUniqueWithoutProductDataFeedAppInput>;
      createMany?: IncomingProductDataFeedWebhookCreateManyProductDataFeedAppInputEnvelope;
      set?: Enumerable<IncomingProductDataFeedWebhookWhereUniqueInput>;
      disconnect?: Enumerable<IncomingProductDataFeedWebhookWhereUniqueInput>;
      delete?: Enumerable<IncomingProductDataFeedWebhookWhereUniqueInput>;
      connect?: Enumerable<IncomingProductDataFeedWebhookWhereUniqueInput>;
      update?: Enumerable<IncomingProductDataFeedWebhookUpdateWithWhereUniqueWithoutProductDataFeedAppInput>;
      updateMany?: Enumerable<IncomingProductDataFeedWebhookUpdateManyWithWhereWithoutProductDataFeedAppInput>;
      deleteMany?: Enumerable<IncomingProductDataFeedWebhookScalarWhereInput>;
    };

  export type ProductDataFeedIntegrationUpdateOneWithoutProductDataFeedAppInput =
    {
      create?: XOR<
        ProductDataFeedIntegrationCreateWithoutProductDataFeedAppInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutProductDataFeedAppInput
      >;
      connectOrCreate?: ProductDataFeedIntegrationCreateOrConnectWithoutProductDataFeedAppInput;
      upsert?: ProductDataFeedIntegrationUpsertWithoutProductDataFeedAppInput;
      disconnect?: boolean;
      delete?: boolean;
      connect?: ProductDataFeedIntegrationWhereUniqueInput;
      update?: XOR<
        ProductDataFeedIntegrationUpdateWithoutProductDataFeedAppInput,
        ProductDataFeedIntegrationUncheckedUpdateWithoutProductDataFeedAppInput
      >;
    };

  export type IncomingProductDataFeedWebhookUncheckedUpdateManyWithoutProductDataFeedAppInput =
    {
      create?: XOR<
        Enumerable<IncomingProductDataFeedWebhookCreateWithoutProductDataFeedAppInput>,
        Enumerable<IncomingProductDataFeedWebhookUncheckedCreateWithoutProductDataFeedAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingProductDataFeedWebhookCreateOrConnectWithoutProductDataFeedAppInput>;
      upsert?: Enumerable<IncomingProductDataFeedWebhookUpsertWithWhereUniqueWithoutProductDataFeedAppInput>;
      createMany?: IncomingProductDataFeedWebhookCreateManyProductDataFeedAppInputEnvelope;
      set?: Enumerable<IncomingProductDataFeedWebhookWhereUniqueInput>;
      disconnect?: Enumerable<IncomingProductDataFeedWebhookWhereUniqueInput>;
      delete?: Enumerable<IncomingProductDataFeedWebhookWhereUniqueInput>;
      connect?: Enumerable<IncomingProductDataFeedWebhookWhereUniqueInput>;
      update?: Enumerable<IncomingProductDataFeedWebhookUpdateWithWhereUniqueWithoutProductDataFeedAppInput>;
      updateMany?: Enumerable<IncomingProductDataFeedWebhookUpdateManyWithWhereWithoutProductDataFeedAppInput>;
      deleteMany?: Enumerable<IncomingProductDataFeedWebhookScalarWhereInput>;
    };

  export type ProductDataFeedIntegrationUncheckedUpdateOneWithoutProductDataFeedAppInput =
    {
      create?: XOR<
        ProductDataFeedIntegrationCreateWithoutProductDataFeedAppInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutProductDataFeedAppInput
      >;
      connectOrCreate?: ProductDataFeedIntegrationCreateOrConnectWithoutProductDataFeedAppInput;
      upsert?: ProductDataFeedIntegrationUpsertWithoutProductDataFeedAppInput;
      disconnect?: boolean;
      delete?: boolean;
      connect?: ProductDataFeedIntegrationWhereUniqueInput;
      update?: XOR<
        ProductDataFeedIntegrationUpdateWithoutProductDataFeedAppInput,
        ProductDataFeedIntegrationUncheckedUpdateWithoutProductDataFeedAppInput
      >;
    };

  export type TenantCreateNestedOneWithoutLogisticsAppInput = {
    create?: XOR<
      TenantCreateWithoutLogisticsAppInput,
      TenantUncheckedCreateWithoutLogisticsAppInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutLogisticsAppInput;
    connect?: TenantWhereUniqueInput;
  };

  export type IncomingLogisticsWebhookCreateNestedManyWithoutLogisticsAppInput =
    {
      create?: XOR<
        Enumerable<IncomingLogisticsWebhookCreateWithoutLogisticsAppInput>,
        Enumerable<IncomingLogisticsWebhookUncheckedCreateWithoutLogisticsAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingLogisticsWebhookCreateOrConnectWithoutLogisticsAppInput>;
      createMany?: IncomingLogisticsWebhookCreateManyLogisticsAppInputEnvelope;
      connect?: Enumerable<IncomingLogisticsWebhookWhereUniqueInput>;
    };

  export type LogisticsIntegrationCreateNestedOneWithoutLogisticsAppInput = {
    create?: XOR<
      LogisticsIntegrationCreateWithoutLogisticsAppInput,
      LogisticsIntegrationUncheckedCreateWithoutLogisticsAppInput
    >;
    connectOrCreate?: LogisticsIntegrationCreateOrConnectWithoutLogisticsAppInput;
    connect?: LogisticsIntegrationWhereUniqueInput;
  };

  export type IncomingLogisticsWebhookUncheckedCreateNestedManyWithoutLogisticsAppInput =
    {
      create?: XOR<
        Enumerable<IncomingLogisticsWebhookCreateWithoutLogisticsAppInput>,
        Enumerable<IncomingLogisticsWebhookUncheckedCreateWithoutLogisticsAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingLogisticsWebhookCreateOrConnectWithoutLogisticsAppInput>;
      createMany?: IncomingLogisticsWebhookCreateManyLogisticsAppInputEnvelope;
      connect?: Enumerable<IncomingLogisticsWebhookWhereUniqueInput>;
    };

  export type LogisticsIntegrationUncheckedCreateNestedOneWithoutLogisticsAppInput =
    {
      create?: XOR<
        LogisticsIntegrationCreateWithoutLogisticsAppInput,
        LogisticsIntegrationUncheckedCreateWithoutLogisticsAppInput
      >;
      connectOrCreate?: LogisticsIntegrationCreateOrConnectWithoutLogisticsAppInput;
      connect?: LogisticsIntegrationWhereUniqueInput;
    };

  export type TenantUpdateOneRequiredWithoutLogisticsAppInput = {
    create?: XOR<
      TenantCreateWithoutLogisticsAppInput,
      TenantUncheckedCreateWithoutLogisticsAppInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutLogisticsAppInput;
    upsert?: TenantUpsertWithoutLogisticsAppInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutLogisticsAppInput,
      TenantUncheckedUpdateWithoutLogisticsAppInput
    >;
  };

  export type IncomingLogisticsWebhookUpdateManyWithoutLogisticsAppInput = {
    create?: XOR<
      Enumerable<IncomingLogisticsWebhookCreateWithoutLogisticsAppInput>,
      Enumerable<IncomingLogisticsWebhookUncheckedCreateWithoutLogisticsAppInput>
    >;
    connectOrCreate?: Enumerable<IncomingLogisticsWebhookCreateOrConnectWithoutLogisticsAppInput>;
    upsert?: Enumerable<IncomingLogisticsWebhookUpsertWithWhereUniqueWithoutLogisticsAppInput>;
    createMany?: IncomingLogisticsWebhookCreateManyLogisticsAppInputEnvelope;
    set?: Enumerable<IncomingLogisticsWebhookWhereUniqueInput>;
    disconnect?: Enumerable<IncomingLogisticsWebhookWhereUniqueInput>;
    delete?: Enumerable<IncomingLogisticsWebhookWhereUniqueInput>;
    connect?: Enumerable<IncomingLogisticsWebhookWhereUniqueInput>;
    update?: Enumerable<IncomingLogisticsWebhookUpdateWithWhereUniqueWithoutLogisticsAppInput>;
    updateMany?: Enumerable<IncomingLogisticsWebhookUpdateManyWithWhereWithoutLogisticsAppInput>;
    deleteMany?: Enumerable<IncomingLogisticsWebhookScalarWhereInput>;
  };

  export type LogisticsIntegrationUpdateOneWithoutLogisticsAppInput = {
    create?: XOR<
      LogisticsIntegrationCreateWithoutLogisticsAppInput,
      LogisticsIntegrationUncheckedCreateWithoutLogisticsAppInput
    >;
    connectOrCreate?: LogisticsIntegrationCreateOrConnectWithoutLogisticsAppInput;
    upsert?: LogisticsIntegrationUpsertWithoutLogisticsAppInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: LogisticsIntegrationWhereUniqueInput;
    update?: XOR<
      LogisticsIntegrationUpdateWithoutLogisticsAppInput,
      LogisticsIntegrationUncheckedUpdateWithoutLogisticsAppInput
    >;
  };

  export type IncomingLogisticsWebhookUncheckedUpdateManyWithoutLogisticsAppInput =
    {
      create?: XOR<
        Enumerable<IncomingLogisticsWebhookCreateWithoutLogisticsAppInput>,
        Enumerable<IncomingLogisticsWebhookUncheckedCreateWithoutLogisticsAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingLogisticsWebhookCreateOrConnectWithoutLogisticsAppInput>;
      upsert?: Enumerable<IncomingLogisticsWebhookUpsertWithWhereUniqueWithoutLogisticsAppInput>;
      createMany?: IncomingLogisticsWebhookCreateManyLogisticsAppInputEnvelope;
      set?: Enumerable<IncomingLogisticsWebhookWhereUniqueInput>;
      disconnect?: Enumerable<IncomingLogisticsWebhookWhereUniqueInput>;
      delete?: Enumerable<IncomingLogisticsWebhookWhereUniqueInput>;
      connect?: Enumerable<IncomingLogisticsWebhookWhereUniqueInput>;
      update?: Enumerable<IncomingLogisticsWebhookUpdateWithWhereUniqueWithoutLogisticsAppInput>;
      updateMany?: Enumerable<IncomingLogisticsWebhookUpdateManyWithWhereWithoutLogisticsAppInput>;
      deleteMany?: Enumerable<IncomingLogisticsWebhookScalarWhereInput>;
    };

  export type LogisticsIntegrationUncheckedUpdateOneWithoutLogisticsAppInput = {
    create?: XOR<
      LogisticsIntegrationCreateWithoutLogisticsAppInput,
      LogisticsIntegrationUncheckedCreateWithoutLogisticsAppInput
    >;
    connectOrCreate?: LogisticsIntegrationCreateOrConnectWithoutLogisticsAppInput;
    upsert?: LogisticsIntegrationUpsertWithoutLogisticsAppInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: LogisticsIntegrationWhereUniqueInput;
    update?: XOR<
      LogisticsIntegrationUpdateWithoutLogisticsAppInput,
      LogisticsIntegrationUncheckedUpdateWithoutLogisticsAppInput
    >;
  };

  export type TenantCreateNestedOneWithoutZohoAppsInput = {
    create?: XOR<
      TenantCreateWithoutZohoAppsInput,
      TenantUncheckedCreateWithoutZohoAppsInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutZohoAppsInput;
    connect?: TenantWhereUniqueInput;
  };

  export type StrapiToZohoIntegrationCreateNestedManyWithoutZohoAppInput = {
    create?: XOR<
      Enumerable<StrapiToZohoIntegrationCreateWithoutZohoAppInput>,
      Enumerable<StrapiToZohoIntegrationUncheckedCreateWithoutZohoAppInput>
    >;
    connectOrCreate?: Enumerable<StrapiToZohoIntegrationCreateOrConnectWithoutZohoAppInput>;
    createMany?: StrapiToZohoIntegrationCreateManyZohoAppInputEnvelope;
    connect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
  };

  export type LogisticsIntegrationCreateNestedManyWithoutZohoAppInput = {
    create?: XOR<
      Enumerable<LogisticsIntegrationCreateWithoutZohoAppInput>,
      Enumerable<LogisticsIntegrationUncheckedCreateWithoutZohoAppInput>
    >;
    connectOrCreate?: Enumerable<LogisticsIntegrationCreateOrConnectWithoutZohoAppInput>;
    createMany?: LogisticsIntegrationCreateManyZohoAppInputEnvelope;
    connect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
  };

  export type StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutZohoAppInput =
    {
      create?: XOR<
        Enumerable<StrapiToZohoIntegrationCreateWithoutZohoAppInput>,
        Enumerable<StrapiToZohoIntegrationUncheckedCreateWithoutZohoAppInput>
      >;
      connectOrCreate?: Enumerable<StrapiToZohoIntegrationCreateOrConnectWithoutZohoAppInput>;
      createMany?: StrapiToZohoIntegrationCreateManyZohoAppInputEnvelope;
      connect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    };

  export type LogisticsIntegrationUncheckedCreateNestedManyWithoutZohoAppInput =
    {
      create?: XOR<
        Enumerable<LogisticsIntegrationCreateWithoutZohoAppInput>,
        Enumerable<LogisticsIntegrationUncheckedCreateWithoutZohoAppInput>
      >;
      connectOrCreate?: Enumerable<LogisticsIntegrationCreateOrConnectWithoutZohoAppInput>;
      createMany?: LogisticsIntegrationCreateManyZohoAppInputEnvelope;
      connect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    };

  export type TenantUpdateOneRequiredWithoutZohoAppsInput = {
    create?: XOR<
      TenantCreateWithoutZohoAppsInput,
      TenantUncheckedCreateWithoutZohoAppsInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutZohoAppsInput;
    upsert?: TenantUpsertWithoutZohoAppsInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutZohoAppsInput,
      TenantUncheckedUpdateWithoutZohoAppsInput
    >;
  };

  export type StrapiToZohoIntegrationUpdateManyWithoutZohoAppInput = {
    create?: XOR<
      Enumerable<StrapiToZohoIntegrationCreateWithoutZohoAppInput>,
      Enumerable<StrapiToZohoIntegrationUncheckedCreateWithoutZohoAppInput>
    >;
    connectOrCreate?: Enumerable<StrapiToZohoIntegrationCreateOrConnectWithoutZohoAppInput>;
    upsert?: Enumerable<StrapiToZohoIntegrationUpsertWithWhereUniqueWithoutZohoAppInput>;
    createMany?: StrapiToZohoIntegrationCreateManyZohoAppInputEnvelope;
    set?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    disconnect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    delete?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    connect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    update?: Enumerable<StrapiToZohoIntegrationUpdateWithWhereUniqueWithoutZohoAppInput>;
    updateMany?: Enumerable<StrapiToZohoIntegrationUpdateManyWithWhereWithoutZohoAppInput>;
    deleteMany?: Enumerable<StrapiToZohoIntegrationScalarWhereInput>;
  };

  export type LogisticsIntegrationUpdateManyWithoutZohoAppInput = {
    create?: XOR<
      Enumerable<LogisticsIntegrationCreateWithoutZohoAppInput>,
      Enumerable<LogisticsIntegrationUncheckedCreateWithoutZohoAppInput>
    >;
    connectOrCreate?: Enumerable<LogisticsIntegrationCreateOrConnectWithoutZohoAppInput>;
    upsert?: Enumerable<LogisticsIntegrationUpsertWithWhereUniqueWithoutZohoAppInput>;
    createMany?: LogisticsIntegrationCreateManyZohoAppInputEnvelope;
    set?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    disconnect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    delete?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    connect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    update?: Enumerable<LogisticsIntegrationUpdateWithWhereUniqueWithoutZohoAppInput>;
    updateMany?: Enumerable<LogisticsIntegrationUpdateManyWithWhereWithoutZohoAppInput>;
    deleteMany?: Enumerable<LogisticsIntegrationScalarWhereInput>;
  };

  export type StrapiToZohoIntegrationUncheckedUpdateManyWithoutZohoAppInput = {
    create?: XOR<
      Enumerable<StrapiToZohoIntegrationCreateWithoutZohoAppInput>,
      Enumerable<StrapiToZohoIntegrationUncheckedCreateWithoutZohoAppInput>
    >;
    connectOrCreate?: Enumerable<StrapiToZohoIntegrationCreateOrConnectWithoutZohoAppInput>;
    upsert?: Enumerable<StrapiToZohoIntegrationUpsertWithWhereUniqueWithoutZohoAppInput>;
    createMany?: StrapiToZohoIntegrationCreateManyZohoAppInputEnvelope;
    set?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    disconnect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    delete?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    connect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    update?: Enumerable<StrapiToZohoIntegrationUpdateWithWhereUniqueWithoutZohoAppInput>;
    updateMany?: Enumerable<StrapiToZohoIntegrationUpdateManyWithWhereWithoutZohoAppInput>;
    deleteMany?: Enumerable<StrapiToZohoIntegrationScalarWhereInput>;
  };

  export type LogisticsIntegrationUncheckedUpdateManyWithoutZohoAppInput = {
    create?: XOR<
      Enumerable<LogisticsIntegrationCreateWithoutZohoAppInput>,
      Enumerable<LogisticsIntegrationUncheckedCreateWithoutZohoAppInput>
    >;
    connectOrCreate?: Enumerable<LogisticsIntegrationCreateOrConnectWithoutZohoAppInput>;
    upsert?: Enumerable<LogisticsIntegrationUpsertWithWhereUniqueWithoutZohoAppInput>;
    createMany?: LogisticsIntegrationCreateManyZohoAppInputEnvelope;
    set?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    disconnect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    delete?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    connect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    update?: Enumerable<LogisticsIntegrationUpdateWithWhereUniqueWithoutZohoAppInput>;
    updateMany?: Enumerable<LogisticsIntegrationUpdateManyWithWhereWithoutZohoAppInput>;
    deleteMany?: Enumerable<LogisticsIntegrationScalarWhereInput>;
  };

  export type InstalledSaleorAppCreateNestedOneWithoutSaleorAppInput = {
    create?: XOR<
      InstalledSaleorAppCreateWithoutSaleorAppInput,
      InstalledSaleorAppUncheckedCreateWithoutSaleorAppInput
    >;
    connectOrCreate?: InstalledSaleorAppCreateOrConnectWithoutSaleorAppInput;
    connect?: InstalledSaleorAppWhereUniqueInput;
  };

  export type TenantCreateNestedOneWithoutSaleorAppsInput = {
    create?: XOR<
      TenantCreateWithoutSaleorAppsInput,
      TenantUncheckedCreateWithoutSaleorAppsInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutSaleorAppsInput;
    connect?: TenantWhereUniqueInput;
  };

  export type ProductDataFeedIntegrationCreateNestedManyWithoutSaleorAppInput =
    {
      create?: XOR<
        Enumerable<ProductDataFeedIntegrationCreateWithoutSaleorAppInput>,
        Enumerable<ProductDataFeedIntegrationUncheckedCreateWithoutSaleorAppInput>
      >;
      connectOrCreate?: Enumerable<ProductDataFeedIntegrationCreateOrConnectWithoutSaleorAppInput>;
      createMany?: ProductDataFeedIntegrationCreateManySaleorAppInputEnvelope;
      connect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    };

  export type ProductDataFeedAppCreateNestedManyWithoutSaleorAppInput = {
    create?: XOR<
      Enumerable<ProductDataFeedAppCreateWithoutSaleorAppInput>,
      Enumerable<ProductDataFeedAppUncheckedCreateWithoutSaleorAppInput>
    >;
    connectOrCreate?: Enumerable<ProductDataFeedAppCreateOrConnectWithoutSaleorAppInput>;
    createMany?: ProductDataFeedAppCreateManySaleorAppInputEnvelope;
    connect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
  };

  export type InstalledSaleorAppUncheckedCreateNestedOneWithoutSaleorAppInput =
    {
      create?: XOR<
        InstalledSaleorAppCreateWithoutSaleorAppInput,
        InstalledSaleorAppUncheckedCreateWithoutSaleorAppInput
      >;
      connectOrCreate?: InstalledSaleorAppCreateOrConnectWithoutSaleorAppInput;
      connect?: InstalledSaleorAppWhereUniqueInput;
    };

  export type ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutSaleorAppInput =
    {
      create?: XOR<
        Enumerable<ProductDataFeedIntegrationCreateWithoutSaleorAppInput>,
        Enumerable<ProductDataFeedIntegrationUncheckedCreateWithoutSaleorAppInput>
      >;
      connectOrCreate?: Enumerable<ProductDataFeedIntegrationCreateOrConnectWithoutSaleorAppInput>;
      createMany?: ProductDataFeedIntegrationCreateManySaleorAppInputEnvelope;
      connect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    };

  export type ProductDataFeedAppUncheckedCreateNestedManyWithoutSaleorAppInput =
    {
      create?: XOR<
        Enumerable<ProductDataFeedAppCreateWithoutSaleorAppInput>,
        Enumerable<ProductDataFeedAppUncheckedCreateWithoutSaleorAppInput>
      >;
      connectOrCreate?: Enumerable<ProductDataFeedAppCreateOrConnectWithoutSaleorAppInput>;
      createMany?: ProductDataFeedAppCreateManySaleorAppInputEnvelope;
      connect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type InstalledSaleorAppUpdateOneWithoutSaleorAppInput = {
    create?: XOR<
      InstalledSaleorAppCreateWithoutSaleorAppInput,
      InstalledSaleorAppUncheckedCreateWithoutSaleorAppInput
    >;
    connectOrCreate?: InstalledSaleorAppCreateOrConnectWithoutSaleorAppInput;
    upsert?: InstalledSaleorAppUpsertWithoutSaleorAppInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: InstalledSaleorAppWhereUniqueInput;
    update?: XOR<
      InstalledSaleorAppUpdateWithoutSaleorAppInput,
      InstalledSaleorAppUncheckedUpdateWithoutSaleorAppInput
    >;
  };

  export type TenantUpdateOneRequiredWithoutSaleorAppsInput = {
    create?: XOR<
      TenantCreateWithoutSaleorAppsInput,
      TenantUncheckedCreateWithoutSaleorAppsInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutSaleorAppsInput;
    upsert?: TenantUpsertWithoutSaleorAppsInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutSaleorAppsInput,
      TenantUncheckedUpdateWithoutSaleorAppsInput
    >;
  };

  export type ProductDataFeedIntegrationUpdateManyWithoutSaleorAppInput = {
    create?: XOR<
      Enumerable<ProductDataFeedIntegrationCreateWithoutSaleorAppInput>,
      Enumerable<ProductDataFeedIntegrationUncheckedCreateWithoutSaleorAppInput>
    >;
    connectOrCreate?: Enumerable<ProductDataFeedIntegrationCreateOrConnectWithoutSaleorAppInput>;
    upsert?: Enumerable<ProductDataFeedIntegrationUpsertWithWhereUniqueWithoutSaleorAppInput>;
    createMany?: ProductDataFeedIntegrationCreateManySaleorAppInputEnvelope;
    set?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    disconnect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    delete?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    connect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    update?: Enumerable<ProductDataFeedIntegrationUpdateWithWhereUniqueWithoutSaleorAppInput>;
    updateMany?: Enumerable<ProductDataFeedIntegrationUpdateManyWithWhereWithoutSaleorAppInput>;
    deleteMany?: Enumerable<ProductDataFeedIntegrationScalarWhereInput>;
  };

  export type ProductDataFeedAppUpdateManyWithoutSaleorAppInput = {
    create?: XOR<
      Enumerable<ProductDataFeedAppCreateWithoutSaleorAppInput>,
      Enumerable<ProductDataFeedAppUncheckedCreateWithoutSaleorAppInput>
    >;
    connectOrCreate?: Enumerable<ProductDataFeedAppCreateOrConnectWithoutSaleorAppInput>;
    upsert?: Enumerable<ProductDataFeedAppUpsertWithWhereUniqueWithoutSaleorAppInput>;
    createMany?: ProductDataFeedAppCreateManySaleorAppInputEnvelope;
    set?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    disconnect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    delete?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    connect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    update?: Enumerable<ProductDataFeedAppUpdateWithWhereUniqueWithoutSaleorAppInput>;
    updateMany?: Enumerable<ProductDataFeedAppUpdateManyWithWhereWithoutSaleorAppInput>;
    deleteMany?: Enumerable<ProductDataFeedAppScalarWhereInput>;
  };

  export type InstalledSaleorAppUncheckedUpdateOneWithoutSaleorAppInput = {
    create?: XOR<
      InstalledSaleorAppCreateWithoutSaleorAppInput,
      InstalledSaleorAppUncheckedCreateWithoutSaleorAppInput
    >;
    connectOrCreate?: InstalledSaleorAppCreateOrConnectWithoutSaleorAppInput;
    upsert?: InstalledSaleorAppUpsertWithoutSaleorAppInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: InstalledSaleorAppWhereUniqueInput;
    update?: XOR<
      InstalledSaleorAppUpdateWithoutSaleorAppInput,
      InstalledSaleorAppUncheckedUpdateWithoutSaleorAppInput
    >;
  };

  export type ProductDataFeedIntegrationUncheckedUpdateManyWithoutSaleorAppInput =
    {
      create?: XOR<
        Enumerable<ProductDataFeedIntegrationCreateWithoutSaleorAppInput>,
        Enumerable<ProductDataFeedIntegrationUncheckedCreateWithoutSaleorAppInput>
      >;
      connectOrCreate?: Enumerable<ProductDataFeedIntegrationCreateOrConnectWithoutSaleorAppInput>;
      upsert?: Enumerable<ProductDataFeedIntegrationUpsertWithWhereUniqueWithoutSaleorAppInput>;
      createMany?: ProductDataFeedIntegrationCreateManySaleorAppInputEnvelope;
      set?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
      disconnect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
      delete?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
      connect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
      update?: Enumerable<ProductDataFeedIntegrationUpdateWithWhereUniqueWithoutSaleorAppInput>;
      updateMany?: Enumerable<ProductDataFeedIntegrationUpdateManyWithWhereWithoutSaleorAppInput>;
      deleteMany?: Enumerable<ProductDataFeedIntegrationScalarWhereInput>;
    };

  export type ProductDataFeedAppUncheckedUpdateManyWithoutSaleorAppInput = {
    create?: XOR<
      Enumerable<ProductDataFeedAppCreateWithoutSaleorAppInput>,
      Enumerable<ProductDataFeedAppUncheckedCreateWithoutSaleorAppInput>
    >;
    connectOrCreate?: Enumerable<ProductDataFeedAppCreateOrConnectWithoutSaleorAppInput>;
    upsert?: Enumerable<ProductDataFeedAppUpsertWithWhereUniqueWithoutSaleorAppInput>;
    createMany?: ProductDataFeedAppCreateManySaleorAppInputEnvelope;
    set?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    disconnect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    delete?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    connect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    update?: Enumerable<ProductDataFeedAppUpdateWithWhereUniqueWithoutSaleorAppInput>;
    updateMany?: Enumerable<ProductDataFeedAppUpdateManyWithWhereWithoutSaleorAppInput>;
    deleteMany?: Enumerable<ProductDataFeedAppScalarWhereInput>;
  };

  export type IncomingSaleorWebhookCreateNestedManyWithoutInstalledSaleorAppInput =
    {
      create?: XOR<
        Enumerable<IncomingSaleorWebhookCreateWithoutInstalledSaleorAppInput>,
        Enumerable<IncomingSaleorWebhookUncheckedCreateWithoutInstalledSaleorAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingSaleorWebhookCreateOrConnectWithoutInstalledSaleorAppInput>;
      createMany?: IncomingSaleorWebhookCreateManyInstalledSaleorAppInputEnvelope;
      connect?: Enumerable<IncomingSaleorWebhookWhereUniqueInput>;
    };

  export type SaleorAppCreateNestedOneWithoutInstalledSaleorAppInput = {
    create?: XOR<
      SaleorAppCreateWithoutInstalledSaleorAppInput,
      SaleorAppUncheckedCreateWithoutInstalledSaleorAppInput
    >;
    connectOrCreate?: SaleorAppCreateOrConnectWithoutInstalledSaleorAppInput;
    connect?: SaleorAppWhereUniqueInput;
  };

  export type IncomingSaleorWebhookUncheckedCreateNestedManyWithoutInstalledSaleorAppInput =
    {
      create?: XOR<
        Enumerable<IncomingSaleorWebhookCreateWithoutInstalledSaleorAppInput>,
        Enumerable<IncomingSaleorWebhookUncheckedCreateWithoutInstalledSaleorAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingSaleorWebhookCreateOrConnectWithoutInstalledSaleorAppInput>;
      createMany?: IncomingSaleorWebhookCreateManyInstalledSaleorAppInputEnvelope;
      connect?: Enumerable<IncomingSaleorWebhookWhereUniqueInput>;
    };

  export type IncomingSaleorWebhookUpdateManyWithoutInstalledSaleorAppInput = {
    create?: XOR<
      Enumerable<IncomingSaleorWebhookCreateWithoutInstalledSaleorAppInput>,
      Enumerable<IncomingSaleorWebhookUncheckedCreateWithoutInstalledSaleorAppInput>
    >;
    connectOrCreate?: Enumerable<IncomingSaleorWebhookCreateOrConnectWithoutInstalledSaleorAppInput>;
    upsert?: Enumerable<IncomingSaleorWebhookUpsertWithWhereUniqueWithoutInstalledSaleorAppInput>;
    createMany?: IncomingSaleorWebhookCreateManyInstalledSaleorAppInputEnvelope;
    set?: Enumerable<IncomingSaleorWebhookWhereUniqueInput>;
    disconnect?: Enumerable<IncomingSaleorWebhookWhereUniqueInput>;
    delete?: Enumerable<IncomingSaleorWebhookWhereUniqueInput>;
    connect?: Enumerable<IncomingSaleorWebhookWhereUniqueInput>;
    update?: Enumerable<IncomingSaleorWebhookUpdateWithWhereUniqueWithoutInstalledSaleorAppInput>;
    updateMany?: Enumerable<IncomingSaleorWebhookUpdateManyWithWhereWithoutInstalledSaleorAppInput>;
    deleteMany?: Enumerable<IncomingSaleorWebhookScalarWhereInput>;
  };

  export type SaleorAppUpdateOneRequiredWithoutInstalledSaleorAppInput = {
    create?: XOR<
      SaleorAppCreateWithoutInstalledSaleorAppInput,
      SaleorAppUncheckedCreateWithoutInstalledSaleorAppInput
    >;
    connectOrCreate?: SaleorAppCreateOrConnectWithoutInstalledSaleorAppInput;
    upsert?: SaleorAppUpsertWithoutInstalledSaleorAppInput;
    connect?: SaleorAppWhereUniqueInput;
    update?: XOR<
      SaleorAppUpdateWithoutInstalledSaleorAppInput,
      SaleorAppUncheckedUpdateWithoutInstalledSaleorAppInput
    >;
  };

  export type IncomingSaleorWebhookUncheckedUpdateManyWithoutInstalledSaleorAppInput =
    {
      create?: XOR<
        Enumerable<IncomingSaleorWebhookCreateWithoutInstalledSaleorAppInput>,
        Enumerable<IncomingSaleorWebhookUncheckedCreateWithoutInstalledSaleorAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingSaleorWebhookCreateOrConnectWithoutInstalledSaleorAppInput>;
      upsert?: Enumerable<IncomingSaleorWebhookUpsertWithWhereUniqueWithoutInstalledSaleorAppInput>;
      createMany?: IncomingSaleorWebhookCreateManyInstalledSaleorAppInputEnvelope;
      set?: Enumerable<IncomingSaleorWebhookWhereUniqueInput>;
      disconnect?: Enumerable<IncomingSaleorWebhookWhereUniqueInput>;
      delete?: Enumerable<IncomingSaleorWebhookWhereUniqueInput>;
      connect?: Enumerable<IncomingSaleorWebhookWhereUniqueInput>;
      update?: Enumerable<IncomingSaleorWebhookUpdateWithWhereUniqueWithoutInstalledSaleorAppInput>;
      updateMany?: Enumerable<IncomingSaleorWebhookUpdateManyWithWhereWithoutInstalledSaleorAppInput>;
      deleteMany?: Enumerable<IncomingSaleorWebhookScalarWhereInput>;
    };

  export type SubscriptionCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<SubscriptionCreateWithoutTenantInput>,
      Enumerable<SubscriptionUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutTenantInput>;
    createMany?: SubscriptionCreateManyTenantInputEnvelope;
    connect?: Enumerable<SubscriptionWhereUniqueInput>;
  };

  export type SaleorAppCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<SaleorAppCreateWithoutTenantInput>,
      Enumerable<SaleorAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<SaleorAppCreateOrConnectWithoutTenantInput>;
    createMany?: SaleorAppCreateManyTenantInputEnvelope;
    connect?: Enumerable<SaleorAppWhereUniqueInput>;
  };

  export type ZohoAppCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<ZohoAppCreateWithoutTenantInput>,
      Enumerable<ZohoAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<ZohoAppCreateOrConnectWithoutTenantInput>;
    createMany?: ZohoAppCreateManyTenantInputEnvelope;
    connect?: Enumerable<ZohoAppWhereUniqueInput>;
  };

  export type ProductDataFeedAppCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<ProductDataFeedAppCreateWithoutTenantInput>,
      Enumerable<ProductDataFeedAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<ProductDataFeedAppCreateOrConnectWithoutTenantInput>;
    createMany?: ProductDataFeedAppCreateManyTenantInputEnvelope;
    connect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
  };

  export type StrapiAppCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<StrapiAppCreateWithoutTenantInput>,
      Enumerable<StrapiAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<StrapiAppCreateOrConnectWithoutTenantInput>;
    createMany?: StrapiAppCreateManyTenantInputEnvelope;
    connect?: Enumerable<StrapiAppWhereUniqueInput>;
  };

  export type ProductDataFeedIntegrationCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<ProductDataFeedIntegrationCreateWithoutTenantInput>,
      Enumerable<ProductDataFeedIntegrationUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<ProductDataFeedIntegrationCreateOrConnectWithoutTenantInput>;
    createMany?: ProductDataFeedIntegrationCreateManyTenantInputEnvelope;
    connect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
  };

  export type StrapiToZohoIntegrationCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<StrapiToZohoIntegrationCreateWithoutTenantInput>,
      Enumerable<StrapiToZohoIntegrationUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<StrapiToZohoIntegrationCreateOrConnectWithoutTenantInput>;
    createMany?: StrapiToZohoIntegrationCreateManyTenantInputEnvelope;
    connect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
  };

  export type LogisticsIntegrationCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<LogisticsIntegrationCreateWithoutTenantInput>,
      Enumerable<LogisticsIntegrationUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<LogisticsIntegrationCreateOrConnectWithoutTenantInput>;
    createMany?: LogisticsIntegrationCreateManyTenantInputEnvelope;
    connect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
  };

  export type LogisticsAppCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<LogisticsAppCreateWithoutTenantInput>,
      Enumerable<LogisticsAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<LogisticsAppCreateOrConnectWithoutTenantInput>;
    createMany?: LogisticsAppCreateManyTenantInputEnvelope;
    connect?: Enumerable<LogisticsAppWhereUniqueInput>;
  };

  export type SubscriptionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<SubscriptionCreateWithoutTenantInput>,
      Enumerable<SubscriptionUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutTenantInput>;
    createMany?: SubscriptionCreateManyTenantInputEnvelope;
    connect?: Enumerable<SubscriptionWhereUniqueInput>;
  };

  export type SaleorAppUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<SaleorAppCreateWithoutTenantInput>,
      Enumerable<SaleorAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<SaleorAppCreateOrConnectWithoutTenantInput>;
    createMany?: SaleorAppCreateManyTenantInputEnvelope;
    connect?: Enumerable<SaleorAppWhereUniqueInput>;
  };

  export type ZohoAppUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<ZohoAppCreateWithoutTenantInput>,
      Enumerable<ZohoAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<ZohoAppCreateOrConnectWithoutTenantInput>;
    createMany?: ZohoAppCreateManyTenantInputEnvelope;
    connect?: Enumerable<ZohoAppWhereUniqueInput>;
  };

  export type ProductDataFeedAppUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<ProductDataFeedAppCreateWithoutTenantInput>,
      Enumerable<ProductDataFeedAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<ProductDataFeedAppCreateOrConnectWithoutTenantInput>;
    createMany?: ProductDataFeedAppCreateManyTenantInputEnvelope;
    connect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
  };

  export type StrapiAppUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<StrapiAppCreateWithoutTenantInput>,
      Enumerable<StrapiAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<StrapiAppCreateOrConnectWithoutTenantInput>;
    createMany?: StrapiAppCreateManyTenantInputEnvelope;
    connect?: Enumerable<StrapiAppWhereUniqueInput>;
  };

  export type ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutTenantInput =
    {
      create?: XOR<
        Enumerable<ProductDataFeedIntegrationCreateWithoutTenantInput>,
        Enumerable<ProductDataFeedIntegrationUncheckedCreateWithoutTenantInput>
      >;
      connectOrCreate?: Enumerable<ProductDataFeedIntegrationCreateOrConnectWithoutTenantInput>;
      createMany?: ProductDataFeedIntegrationCreateManyTenantInputEnvelope;
      connect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    };

  export type StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutTenantInput =
    {
      create?: XOR<
        Enumerable<StrapiToZohoIntegrationCreateWithoutTenantInput>,
        Enumerable<StrapiToZohoIntegrationUncheckedCreateWithoutTenantInput>
      >;
      connectOrCreate?: Enumerable<StrapiToZohoIntegrationCreateOrConnectWithoutTenantInput>;
      createMany?: StrapiToZohoIntegrationCreateManyTenantInputEnvelope;
      connect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    };

  export type LogisticsIntegrationUncheckedCreateNestedManyWithoutTenantInput =
    {
      create?: XOR<
        Enumerable<LogisticsIntegrationCreateWithoutTenantInput>,
        Enumerable<LogisticsIntegrationUncheckedCreateWithoutTenantInput>
      >;
      connectOrCreate?: Enumerable<LogisticsIntegrationCreateOrConnectWithoutTenantInput>;
      createMany?: LogisticsIntegrationCreateManyTenantInputEnvelope;
      connect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    };

  export type LogisticsAppUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<LogisticsAppCreateWithoutTenantInput>,
      Enumerable<LogisticsAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<LogisticsAppCreateOrConnectWithoutTenantInput>;
    createMany?: LogisticsAppCreateManyTenantInputEnvelope;
    connect?: Enumerable<LogisticsAppWhereUniqueInput>;
  };

  export type SubscriptionUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<SubscriptionCreateWithoutTenantInput>,
      Enumerable<SubscriptionUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<SubscriptionUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: SubscriptionCreateManyTenantInputEnvelope;
    set?: Enumerable<SubscriptionWhereUniqueInput>;
    disconnect?: Enumerable<SubscriptionWhereUniqueInput>;
    delete?: Enumerable<SubscriptionWhereUniqueInput>;
    connect?: Enumerable<SubscriptionWhereUniqueInput>;
    update?: Enumerable<SubscriptionUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<SubscriptionUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<SubscriptionScalarWhereInput>;
  };

  export type SaleorAppUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<SaleorAppCreateWithoutTenantInput>,
      Enumerable<SaleorAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<SaleorAppCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<SaleorAppUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: SaleorAppCreateManyTenantInputEnvelope;
    set?: Enumerable<SaleorAppWhereUniqueInput>;
    disconnect?: Enumerable<SaleorAppWhereUniqueInput>;
    delete?: Enumerable<SaleorAppWhereUniqueInput>;
    connect?: Enumerable<SaleorAppWhereUniqueInput>;
    update?: Enumerable<SaleorAppUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<SaleorAppUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<SaleorAppScalarWhereInput>;
  };

  export type ZohoAppUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<ZohoAppCreateWithoutTenantInput>,
      Enumerable<ZohoAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<ZohoAppCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<ZohoAppUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: ZohoAppCreateManyTenantInputEnvelope;
    set?: Enumerable<ZohoAppWhereUniqueInput>;
    disconnect?: Enumerable<ZohoAppWhereUniqueInput>;
    delete?: Enumerable<ZohoAppWhereUniqueInput>;
    connect?: Enumerable<ZohoAppWhereUniqueInput>;
    update?: Enumerable<ZohoAppUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<ZohoAppUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<ZohoAppScalarWhereInput>;
  };

  export type ProductDataFeedAppUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<ProductDataFeedAppCreateWithoutTenantInput>,
      Enumerable<ProductDataFeedAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<ProductDataFeedAppCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<ProductDataFeedAppUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: ProductDataFeedAppCreateManyTenantInputEnvelope;
    set?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    disconnect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    delete?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    connect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    update?: Enumerable<ProductDataFeedAppUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<ProductDataFeedAppUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<ProductDataFeedAppScalarWhereInput>;
  };

  export type StrapiAppUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<StrapiAppCreateWithoutTenantInput>,
      Enumerable<StrapiAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<StrapiAppCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<StrapiAppUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: StrapiAppCreateManyTenantInputEnvelope;
    set?: Enumerable<StrapiAppWhereUniqueInput>;
    disconnect?: Enumerable<StrapiAppWhereUniqueInput>;
    delete?: Enumerable<StrapiAppWhereUniqueInput>;
    connect?: Enumerable<StrapiAppWhereUniqueInput>;
    update?: Enumerable<StrapiAppUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<StrapiAppUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<StrapiAppScalarWhereInput>;
  };

  export type ProductDataFeedIntegrationUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<ProductDataFeedIntegrationCreateWithoutTenantInput>,
      Enumerable<ProductDataFeedIntegrationUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<ProductDataFeedIntegrationCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<ProductDataFeedIntegrationUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: ProductDataFeedIntegrationCreateManyTenantInputEnvelope;
    set?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    disconnect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    delete?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    connect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
    update?: Enumerable<ProductDataFeedIntegrationUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<ProductDataFeedIntegrationUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<ProductDataFeedIntegrationScalarWhereInput>;
  };

  export type StrapiToZohoIntegrationUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<StrapiToZohoIntegrationCreateWithoutTenantInput>,
      Enumerable<StrapiToZohoIntegrationUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<StrapiToZohoIntegrationCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<StrapiToZohoIntegrationUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: StrapiToZohoIntegrationCreateManyTenantInputEnvelope;
    set?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    disconnect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    delete?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    connect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    update?: Enumerable<StrapiToZohoIntegrationUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<StrapiToZohoIntegrationUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<StrapiToZohoIntegrationScalarWhereInput>;
  };

  export type LogisticsIntegrationUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<LogisticsIntegrationCreateWithoutTenantInput>,
      Enumerable<LogisticsIntegrationUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<LogisticsIntegrationCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<LogisticsIntegrationUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: LogisticsIntegrationCreateManyTenantInputEnvelope;
    set?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    disconnect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    delete?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    connect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    update?: Enumerable<LogisticsIntegrationUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<LogisticsIntegrationUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<LogisticsIntegrationScalarWhereInput>;
  };

  export type LogisticsAppUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<LogisticsAppCreateWithoutTenantInput>,
      Enumerable<LogisticsAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<LogisticsAppCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<LogisticsAppUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: LogisticsAppCreateManyTenantInputEnvelope;
    set?: Enumerable<LogisticsAppWhereUniqueInput>;
    disconnect?: Enumerable<LogisticsAppWhereUniqueInput>;
    delete?: Enumerable<LogisticsAppWhereUniqueInput>;
    connect?: Enumerable<LogisticsAppWhereUniqueInput>;
    update?: Enumerable<LogisticsAppUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<LogisticsAppUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<LogisticsAppScalarWhereInput>;
  };

  export type SubscriptionUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<SubscriptionCreateWithoutTenantInput>,
      Enumerable<SubscriptionUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<SubscriptionUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: SubscriptionCreateManyTenantInputEnvelope;
    set?: Enumerable<SubscriptionWhereUniqueInput>;
    disconnect?: Enumerable<SubscriptionWhereUniqueInput>;
    delete?: Enumerable<SubscriptionWhereUniqueInput>;
    connect?: Enumerable<SubscriptionWhereUniqueInput>;
    update?: Enumerable<SubscriptionUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<SubscriptionUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<SubscriptionScalarWhereInput>;
  };

  export type SaleorAppUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<SaleorAppCreateWithoutTenantInput>,
      Enumerable<SaleorAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<SaleorAppCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<SaleorAppUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: SaleorAppCreateManyTenantInputEnvelope;
    set?: Enumerable<SaleorAppWhereUniqueInput>;
    disconnect?: Enumerable<SaleorAppWhereUniqueInput>;
    delete?: Enumerable<SaleorAppWhereUniqueInput>;
    connect?: Enumerable<SaleorAppWhereUniqueInput>;
    update?: Enumerable<SaleorAppUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<SaleorAppUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<SaleorAppScalarWhereInput>;
  };

  export type ZohoAppUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<ZohoAppCreateWithoutTenantInput>,
      Enumerable<ZohoAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<ZohoAppCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<ZohoAppUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: ZohoAppCreateManyTenantInputEnvelope;
    set?: Enumerable<ZohoAppWhereUniqueInput>;
    disconnect?: Enumerable<ZohoAppWhereUniqueInput>;
    delete?: Enumerable<ZohoAppWhereUniqueInput>;
    connect?: Enumerable<ZohoAppWhereUniqueInput>;
    update?: Enumerable<ZohoAppUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<ZohoAppUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<ZohoAppScalarWhereInput>;
  };

  export type ProductDataFeedAppUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<ProductDataFeedAppCreateWithoutTenantInput>,
      Enumerable<ProductDataFeedAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<ProductDataFeedAppCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<ProductDataFeedAppUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: ProductDataFeedAppCreateManyTenantInputEnvelope;
    set?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    disconnect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    delete?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    connect?: Enumerable<ProductDataFeedAppWhereUniqueInput>;
    update?: Enumerable<ProductDataFeedAppUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<ProductDataFeedAppUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<ProductDataFeedAppScalarWhereInput>;
  };

  export type StrapiAppUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<StrapiAppCreateWithoutTenantInput>,
      Enumerable<StrapiAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<StrapiAppCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<StrapiAppUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: StrapiAppCreateManyTenantInputEnvelope;
    set?: Enumerable<StrapiAppWhereUniqueInput>;
    disconnect?: Enumerable<StrapiAppWhereUniqueInput>;
    delete?: Enumerable<StrapiAppWhereUniqueInput>;
    connect?: Enumerable<StrapiAppWhereUniqueInput>;
    update?: Enumerable<StrapiAppUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<StrapiAppUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<StrapiAppScalarWhereInput>;
  };

  export type ProductDataFeedIntegrationUncheckedUpdateManyWithoutTenantInput =
    {
      create?: XOR<
        Enumerable<ProductDataFeedIntegrationCreateWithoutTenantInput>,
        Enumerable<ProductDataFeedIntegrationUncheckedCreateWithoutTenantInput>
      >;
      connectOrCreate?: Enumerable<ProductDataFeedIntegrationCreateOrConnectWithoutTenantInput>;
      upsert?: Enumerable<ProductDataFeedIntegrationUpsertWithWhereUniqueWithoutTenantInput>;
      createMany?: ProductDataFeedIntegrationCreateManyTenantInputEnvelope;
      set?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
      disconnect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
      delete?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
      connect?: Enumerable<ProductDataFeedIntegrationWhereUniqueInput>;
      update?: Enumerable<ProductDataFeedIntegrationUpdateWithWhereUniqueWithoutTenantInput>;
      updateMany?: Enumerable<ProductDataFeedIntegrationUpdateManyWithWhereWithoutTenantInput>;
      deleteMany?: Enumerable<ProductDataFeedIntegrationScalarWhereInput>;
    };

  export type StrapiToZohoIntegrationUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<StrapiToZohoIntegrationCreateWithoutTenantInput>,
      Enumerable<StrapiToZohoIntegrationUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<StrapiToZohoIntegrationCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<StrapiToZohoIntegrationUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: StrapiToZohoIntegrationCreateManyTenantInputEnvelope;
    set?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    disconnect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    delete?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    connect?: Enumerable<StrapiToZohoIntegrationWhereUniqueInput>;
    update?: Enumerable<StrapiToZohoIntegrationUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<StrapiToZohoIntegrationUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<StrapiToZohoIntegrationScalarWhereInput>;
  };

  export type LogisticsIntegrationUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<LogisticsIntegrationCreateWithoutTenantInput>,
      Enumerable<LogisticsIntegrationUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<LogisticsIntegrationCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<LogisticsIntegrationUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: LogisticsIntegrationCreateManyTenantInputEnvelope;
    set?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    disconnect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    delete?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    connect?: Enumerable<LogisticsIntegrationWhereUniqueInput>;
    update?: Enumerable<LogisticsIntegrationUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<LogisticsIntegrationUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<LogisticsIntegrationScalarWhereInput>;
  };

  export type LogisticsAppUncheckedUpdateManyWithoutTenantInput = {
    create?: XOR<
      Enumerable<LogisticsAppCreateWithoutTenantInput>,
      Enumerable<LogisticsAppUncheckedCreateWithoutTenantInput>
    >;
    connectOrCreate?: Enumerable<LogisticsAppCreateOrConnectWithoutTenantInput>;
    upsert?: Enumerable<LogisticsAppUpsertWithWhereUniqueWithoutTenantInput>;
    createMany?: LogisticsAppCreateManyTenantInputEnvelope;
    set?: Enumerable<LogisticsAppWhereUniqueInput>;
    disconnect?: Enumerable<LogisticsAppWhereUniqueInput>;
    delete?: Enumerable<LogisticsAppWhereUniqueInput>;
    connect?: Enumerable<LogisticsAppWhereUniqueInput>;
    update?: Enumerable<LogisticsAppUpdateWithWhereUniqueWithoutTenantInput>;
    updateMany?: Enumerable<LogisticsAppUpdateManyWithWhereWithoutTenantInput>;
    deleteMany?: Enumerable<LogisticsAppScalarWhereInput>;
  };

  export type TenantCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<
      TenantCreateWithoutSubscriptionsInput,
      TenantUncheckedCreateWithoutSubscriptionsInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionsInput;
    connect?: TenantWhereUniqueInput;
  };

  export type ProductDataFeedIntegrationCreateNestedOneWithoutSubscriptionInput =
    {
      create?: XOR<
        ProductDataFeedIntegrationCreateWithoutSubscriptionInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutSubscriptionInput
      >;
      connectOrCreate?: ProductDataFeedIntegrationCreateOrConnectWithoutSubscriptionInput;
      connect?: ProductDataFeedIntegrationWhereUniqueInput;
    };

  export type StrapiToZohoIntegrationCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<
      StrapiToZohoIntegrationCreateWithoutSubscriptionInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
    connectOrCreate?: StrapiToZohoIntegrationCreateOrConnectWithoutSubscriptionInput;
    connect?: StrapiToZohoIntegrationWhereUniqueInput;
  };

  export type LogisticsIntegrationCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<
      LogisticsIntegrationCreateWithoutSubscriptionInput,
      LogisticsIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
    connectOrCreate?: LogisticsIntegrationCreateOrConnectWithoutSubscriptionInput;
    connect?: LogisticsIntegrationWhereUniqueInput;
  };

  export type ProductDataFeedIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput =
    {
      create?: XOR<
        ProductDataFeedIntegrationCreateWithoutSubscriptionInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutSubscriptionInput
      >;
      connectOrCreate?: ProductDataFeedIntegrationCreateOrConnectWithoutSubscriptionInput;
      connect?: ProductDataFeedIntegrationWhereUniqueInput;
    };

  export type StrapiToZohoIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput =
    {
      create?: XOR<
        StrapiToZohoIntegrationCreateWithoutSubscriptionInput,
        StrapiToZohoIntegrationUncheckedCreateWithoutSubscriptionInput
      >;
      connectOrCreate?: StrapiToZohoIntegrationCreateOrConnectWithoutSubscriptionInput;
      connect?: StrapiToZohoIntegrationWhereUniqueInput;
    };

  export type LogisticsIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput =
    {
      create?: XOR<
        LogisticsIntegrationCreateWithoutSubscriptionInput,
        LogisticsIntegrationUncheckedCreateWithoutSubscriptionInput
      >;
      connectOrCreate?: LogisticsIntegrationCreateOrConnectWithoutSubscriptionInput;
      connect?: LogisticsIntegrationWhereUniqueInput;
    };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type TenantUpdateOneRequiredWithoutSubscriptionsInput = {
    create?: XOR<
      TenantCreateWithoutSubscriptionsInput,
      TenantUncheckedCreateWithoutSubscriptionsInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionsInput;
    upsert?: TenantUpsertWithoutSubscriptionsInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutSubscriptionsInput,
      TenantUncheckedUpdateWithoutSubscriptionsInput
    >;
  };

  export type ProductDataFeedIntegrationUpdateOneWithoutSubscriptionInput = {
    create?: XOR<
      ProductDataFeedIntegrationCreateWithoutSubscriptionInput,
      ProductDataFeedIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
    connectOrCreate?: ProductDataFeedIntegrationCreateOrConnectWithoutSubscriptionInput;
    upsert?: ProductDataFeedIntegrationUpsertWithoutSubscriptionInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: ProductDataFeedIntegrationWhereUniqueInput;
    update?: XOR<
      ProductDataFeedIntegrationUpdateWithoutSubscriptionInput,
      ProductDataFeedIntegrationUncheckedUpdateWithoutSubscriptionInput
    >;
  };

  export type StrapiToZohoIntegrationUpdateOneWithoutSubscriptionInput = {
    create?: XOR<
      StrapiToZohoIntegrationCreateWithoutSubscriptionInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
    connectOrCreate?: StrapiToZohoIntegrationCreateOrConnectWithoutSubscriptionInput;
    upsert?: StrapiToZohoIntegrationUpsertWithoutSubscriptionInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: StrapiToZohoIntegrationWhereUniqueInput;
    update?: XOR<
      StrapiToZohoIntegrationUpdateWithoutSubscriptionInput,
      StrapiToZohoIntegrationUncheckedUpdateWithoutSubscriptionInput
    >;
  };

  export type LogisticsIntegrationUpdateOneWithoutSubscriptionInput = {
    create?: XOR<
      LogisticsIntegrationCreateWithoutSubscriptionInput,
      LogisticsIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
    connectOrCreate?: LogisticsIntegrationCreateOrConnectWithoutSubscriptionInput;
    upsert?: LogisticsIntegrationUpsertWithoutSubscriptionInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: LogisticsIntegrationWhereUniqueInput;
    update?: XOR<
      LogisticsIntegrationUpdateWithoutSubscriptionInput,
      LogisticsIntegrationUncheckedUpdateWithoutSubscriptionInput
    >;
  };

  export type ProductDataFeedIntegrationUncheckedUpdateOneWithoutSubscriptionInput =
    {
      create?: XOR<
        ProductDataFeedIntegrationCreateWithoutSubscriptionInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutSubscriptionInput
      >;
      connectOrCreate?: ProductDataFeedIntegrationCreateOrConnectWithoutSubscriptionInput;
      upsert?: ProductDataFeedIntegrationUpsertWithoutSubscriptionInput;
      disconnect?: boolean;
      delete?: boolean;
      connect?: ProductDataFeedIntegrationWhereUniqueInput;
      update?: XOR<
        ProductDataFeedIntegrationUpdateWithoutSubscriptionInput,
        ProductDataFeedIntegrationUncheckedUpdateWithoutSubscriptionInput
      >;
    };

  export type StrapiToZohoIntegrationUncheckedUpdateOneWithoutSubscriptionInput =
    {
      create?: XOR<
        StrapiToZohoIntegrationCreateWithoutSubscriptionInput,
        StrapiToZohoIntegrationUncheckedCreateWithoutSubscriptionInput
      >;
      connectOrCreate?: StrapiToZohoIntegrationCreateOrConnectWithoutSubscriptionInput;
      upsert?: StrapiToZohoIntegrationUpsertWithoutSubscriptionInput;
      disconnect?: boolean;
      delete?: boolean;
      connect?: StrapiToZohoIntegrationWhereUniqueInput;
      update?: XOR<
        StrapiToZohoIntegrationUpdateWithoutSubscriptionInput,
        StrapiToZohoIntegrationUncheckedUpdateWithoutSubscriptionInput
      >;
    };

  export type LogisticsIntegrationUncheckedUpdateOneWithoutSubscriptionInput = {
    create?: XOR<
      LogisticsIntegrationCreateWithoutSubscriptionInput,
      LogisticsIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
    connectOrCreate?: LogisticsIntegrationCreateOrConnectWithoutSubscriptionInput;
    upsert?: LogisticsIntegrationUpsertWithoutSubscriptionInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: LogisticsIntegrationWhereUniqueInput;
    update?: XOR<
      LogisticsIntegrationUpdateWithoutSubscriptionInput,
      LogisticsIntegrationUncheckedUpdateWithoutSubscriptionInput
    >;
  };

  export type SubscriptionCreateNestedOneWithoutProductDataFeedIntegrationInput =
    {
      create?: XOR<
        SubscriptionCreateWithoutProductDataFeedIntegrationInput,
        SubscriptionUncheckedCreateWithoutProductDataFeedIntegrationInput
      >;
      connectOrCreate?: SubscriptionCreateOrConnectWithoutProductDataFeedIntegrationInput;
      connect?: SubscriptionWhereUniqueInput;
    };

  export type TenantCreateNestedOneWithoutProductDataFeedIntegrationInput = {
    create?: XOR<
      TenantCreateWithoutProductDataFeedIntegrationInput,
      TenantUncheckedCreateWithoutProductDataFeedIntegrationInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutProductDataFeedIntegrationInput;
    connect?: TenantWhereUniqueInput;
  };

  export type ProductDataFeedAppCreateNestedOneWithoutIntegrationInput = {
    create?: XOR<
      ProductDataFeedAppCreateWithoutIntegrationInput,
      ProductDataFeedAppUncheckedCreateWithoutIntegrationInput
    >;
    connectOrCreate?: ProductDataFeedAppCreateOrConnectWithoutIntegrationInput;
    connect?: ProductDataFeedAppWhereUniqueInput;
  };

  export type SaleorAppCreateNestedOneWithoutProductDataFeedIntegrationInput = {
    create?: XOR<
      SaleorAppCreateWithoutProductDataFeedIntegrationInput,
      SaleorAppUncheckedCreateWithoutProductDataFeedIntegrationInput
    >;
    connectOrCreate?: SaleorAppCreateOrConnectWithoutProductDataFeedIntegrationInput;
    connect?: SaleorAppWhereUniqueInput;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type SubscriptionUpdateOneWithoutProductDataFeedIntegrationInput = {
    create?: XOR<
      SubscriptionCreateWithoutProductDataFeedIntegrationInput,
      SubscriptionUncheckedCreateWithoutProductDataFeedIntegrationInput
    >;
    connectOrCreate?: SubscriptionCreateOrConnectWithoutProductDataFeedIntegrationInput;
    upsert?: SubscriptionUpsertWithoutProductDataFeedIntegrationInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: SubscriptionWhereUniqueInput;
    update?: XOR<
      SubscriptionUpdateWithoutProductDataFeedIntegrationInput,
      SubscriptionUncheckedUpdateWithoutProductDataFeedIntegrationInput
    >;
  };

  export type TenantUpdateOneRequiredWithoutProductDataFeedIntegrationInput = {
    create?: XOR<
      TenantCreateWithoutProductDataFeedIntegrationInput,
      TenantUncheckedCreateWithoutProductDataFeedIntegrationInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutProductDataFeedIntegrationInput;
    upsert?: TenantUpsertWithoutProductDataFeedIntegrationInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutProductDataFeedIntegrationInput,
      TenantUncheckedUpdateWithoutProductDataFeedIntegrationInput
    >;
  };

  export type ProductDataFeedAppUpdateOneRequiredWithoutIntegrationInput = {
    create?: XOR<
      ProductDataFeedAppCreateWithoutIntegrationInput,
      ProductDataFeedAppUncheckedCreateWithoutIntegrationInput
    >;
    connectOrCreate?: ProductDataFeedAppCreateOrConnectWithoutIntegrationInput;
    upsert?: ProductDataFeedAppUpsertWithoutIntegrationInput;
    connect?: ProductDataFeedAppWhereUniqueInput;
    update?: XOR<
      ProductDataFeedAppUpdateWithoutIntegrationInput,
      ProductDataFeedAppUncheckedUpdateWithoutIntegrationInput
    >;
  };

  export type SaleorAppUpdateOneRequiredWithoutProductDataFeedIntegrationInput =
    {
      create?: XOR<
        SaleorAppCreateWithoutProductDataFeedIntegrationInput,
        SaleorAppUncheckedCreateWithoutProductDataFeedIntegrationInput
      >;
      connectOrCreate?: SaleorAppCreateOrConnectWithoutProductDataFeedIntegrationInput;
      upsert?: SaleorAppUpsertWithoutProductDataFeedIntegrationInput;
      connect?: SaleorAppWhereUniqueInput;
      update?: XOR<
        SaleorAppUpdateWithoutProductDataFeedIntegrationInput,
        SaleorAppUncheckedUpdateWithoutProductDataFeedIntegrationInput
      >;
    };

  export type SubscriptionCreateNestedOneWithoutLogisticsIntegrationInput = {
    create?: XOR<
      SubscriptionCreateWithoutLogisticsIntegrationInput,
      SubscriptionUncheckedCreateWithoutLogisticsIntegrationInput
    >;
    connectOrCreate?: SubscriptionCreateOrConnectWithoutLogisticsIntegrationInput;
    connect?: SubscriptionWhereUniqueInput;
  };

  export type TenantCreateNestedOneWithoutLogisticsIntegrationInput = {
    create?: XOR<
      TenantCreateWithoutLogisticsIntegrationInput,
      TenantUncheckedCreateWithoutLogisticsIntegrationInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutLogisticsIntegrationInput;
    connect?: TenantWhereUniqueInput;
  };

  export type ZohoAppCreateNestedOneWithoutLogisticsIntegrationInput = {
    create?: XOR<
      ZohoAppCreateWithoutLogisticsIntegrationInput,
      ZohoAppUncheckedCreateWithoutLogisticsIntegrationInput
    >;
    connectOrCreate?: ZohoAppCreateOrConnectWithoutLogisticsIntegrationInput;
    connect?: ZohoAppWhereUniqueInput;
  };

  export type LogisticsAppCreateNestedOneWithoutIntegrationInput = {
    create?: XOR<
      LogisticsAppCreateWithoutIntegrationInput,
      LogisticsAppUncheckedCreateWithoutIntegrationInput
    >;
    connectOrCreate?: LogisticsAppCreateOrConnectWithoutIntegrationInput;
    connect?: LogisticsAppWhereUniqueInput;
  };

  export type SubscriptionUpdateOneWithoutLogisticsIntegrationInput = {
    create?: XOR<
      SubscriptionCreateWithoutLogisticsIntegrationInput,
      SubscriptionUncheckedCreateWithoutLogisticsIntegrationInput
    >;
    connectOrCreate?: SubscriptionCreateOrConnectWithoutLogisticsIntegrationInput;
    upsert?: SubscriptionUpsertWithoutLogisticsIntegrationInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: SubscriptionWhereUniqueInput;
    update?: XOR<
      SubscriptionUpdateWithoutLogisticsIntegrationInput,
      SubscriptionUncheckedUpdateWithoutLogisticsIntegrationInput
    >;
  };

  export type TenantUpdateOneRequiredWithoutLogisticsIntegrationInput = {
    create?: XOR<
      TenantCreateWithoutLogisticsIntegrationInput,
      TenantUncheckedCreateWithoutLogisticsIntegrationInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutLogisticsIntegrationInput;
    upsert?: TenantUpsertWithoutLogisticsIntegrationInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutLogisticsIntegrationInput,
      TenantUncheckedUpdateWithoutLogisticsIntegrationInput
    >;
  };

  export type ZohoAppUpdateOneRequiredWithoutLogisticsIntegrationInput = {
    create?: XOR<
      ZohoAppCreateWithoutLogisticsIntegrationInput,
      ZohoAppUncheckedCreateWithoutLogisticsIntegrationInput
    >;
    connectOrCreate?: ZohoAppCreateOrConnectWithoutLogisticsIntegrationInput;
    upsert?: ZohoAppUpsertWithoutLogisticsIntegrationInput;
    connect?: ZohoAppWhereUniqueInput;
    update?: XOR<
      ZohoAppUpdateWithoutLogisticsIntegrationInput,
      ZohoAppUncheckedUpdateWithoutLogisticsIntegrationInput
    >;
  };

  export type LogisticsAppUpdateOneRequiredWithoutIntegrationInput = {
    create?: XOR<
      LogisticsAppCreateWithoutIntegrationInput,
      LogisticsAppUncheckedCreateWithoutIntegrationInput
    >;
    connectOrCreate?: LogisticsAppCreateOrConnectWithoutIntegrationInput;
    upsert?: LogisticsAppUpsertWithoutIntegrationInput;
    connect?: LogisticsAppWhereUniqueInput;
    update?: XOR<
      LogisticsAppUpdateWithoutIntegrationInput,
      LogisticsAppUncheckedUpdateWithoutIntegrationInput
    >;
  };

  export type SubscriptionCreateNestedOneWithoutStrapiToZohoIntegrationInput = {
    create?: XOR<
      SubscriptionCreateWithoutStrapiToZohoIntegrationInput,
      SubscriptionUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
    connectOrCreate?: SubscriptionCreateOrConnectWithoutStrapiToZohoIntegrationInput;
    connect?: SubscriptionWhereUniqueInput;
  };

  export type TenantCreateNestedOneWithoutStrapiToZohoIntegrationInput = {
    create?: XOR<
      TenantCreateWithoutStrapiToZohoIntegrationInput,
      TenantUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutStrapiToZohoIntegrationInput;
    connect?: TenantWhereUniqueInput;
  };

  export type StrapiAppCreateNestedOneWithoutIntegrationInput = {
    create?: XOR<
      StrapiAppCreateWithoutIntegrationInput,
      StrapiAppUncheckedCreateWithoutIntegrationInput
    >;
    connectOrCreate?: StrapiAppCreateOrConnectWithoutIntegrationInput;
    connect?: StrapiAppWhereUniqueInput;
  };

  export type ZohoAppCreateNestedOneWithoutStrapiToZohoIntegrationInput = {
    create?: XOR<
      ZohoAppCreateWithoutStrapiToZohoIntegrationInput,
      ZohoAppUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
    connectOrCreate?: ZohoAppCreateOrConnectWithoutStrapiToZohoIntegrationInput;
    connect?: ZohoAppWhereUniqueInput;
  };

  export type SubscriptionUpdateOneWithoutStrapiToZohoIntegrationInput = {
    create?: XOR<
      SubscriptionCreateWithoutStrapiToZohoIntegrationInput,
      SubscriptionUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
    connectOrCreate?: SubscriptionCreateOrConnectWithoutStrapiToZohoIntegrationInput;
    upsert?: SubscriptionUpsertWithoutStrapiToZohoIntegrationInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: SubscriptionWhereUniqueInput;
    update?: XOR<
      SubscriptionUpdateWithoutStrapiToZohoIntegrationInput,
      SubscriptionUncheckedUpdateWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type TenantUpdateOneRequiredWithoutStrapiToZohoIntegrationInput = {
    create?: XOR<
      TenantCreateWithoutStrapiToZohoIntegrationInput,
      TenantUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutStrapiToZohoIntegrationInput;
    upsert?: TenantUpsertWithoutStrapiToZohoIntegrationInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutStrapiToZohoIntegrationInput,
      TenantUncheckedUpdateWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type StrapiAppUpdateOneRequiredWithoutIntegrationInput = {
    create?: XOR<
      StrapiAppCreateWithoutIntegrationInput,
      StrapiAppUncheckedCreateWithoutIntegrationInput
    >;
    connectOrCreate?: StrapiAppCreateOrConnectWithoutIntegrationInput;
    upsert?: StrapiAppUpsertWithoutIntegrationInput;
    connect?: StrapiAppWhereUniqueInput;
    update?: XOR<
      StrapiAppUpdateWithoutIntegrationInput,
      StrapiAppUncheckedUpdateWithoutIntegrationInput
    >;
  };

  export type ZohoAppUpdateOneRequiredWithoutStrapiToZohoIntegrationInput = {
    create?: XOR<
      ZohoAppCreateWithoutStrapiToZohoIntegrationInput,
      ZohoAppUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
    connectOrCreate?: ZohoAppCreateOrConnectWithoutStrapiToZohoIntegrationInput;
    upsert?: ZohoAppUpsertWithoutStrapiToZohoIntegrationInput;
    connect?: ZohoAppWhereUniqueInput;
    update?: XOR<
      ZohoAppUpdateWithoutStrapiToZohoIntegrationInput,
      ZohoAppUncheckedUpdateWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type IncomingStrapiWebhookCreateNestedManyWithoutStrapiAppInput = {
    create?: XOR<
      Enumerable<IncomingStrapiWebhookCreateWithoutStrapiAppInput>,
      Enumerable<IncomingStrapiWebhookUncheckedCreateWithoutStrapiAppInput>
    >;
    connectOrCreate?: Enumerable<IncomingStrapiWebhookCreateOrConnectWithoutStrapiAppInput>;
    createMany?: IncomingStrapiWebhookCreateManyStrapiAppInputEnvelope;
    connect?: Enumerable<IncomingStrapiWebhookWhereUniqueInput>;
  };

  export type TenantCreateNestedOneWithoutStrapiAppsInput = {
    create?: XOR<
      TenantCreateWithoutStrapiAppsInput,
      TenantUncheckedCreateWithoutStrapiAppsInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutStrapiAppsInput;
    connect?: TenantWhereUniqueInput;
  };

  export type StrapiToZohoIntegrationCreateNestedOneWithoutStrapiAppInput = {
    create?: XOR<
      StrapiToZohoIntegrationCreateWithoutStrapiAppInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutStrapiAppInput
    >;
    connectOrCreate?: StrapiToZohoIntegrationCreateOrConnectWithoutStrapiAppInput;
    connect?: StrapiToZohoIntegrationWhereUniqueInput;
  };

  export type IncomingStrapiWebhookUncheckedCreateNestedManyWithoutStrapiAppInput =
    {
      create?: XOR<
        Enumerable<IncomingStrapiWebhookCreateWithoutStrapiAppInput>,
        Enumerable<IncomingStrapiWebhookUncheckedCreateWithoutStrapiAppInput>
      >;
      connectOrCreate?: Enumerable<IncomingStrapiWebhookCreateOrConnectWithoutStrapiAppInput>;
      createMany?: IncomingStrapiWebhookCreateManyStrapiAppInputEnvelope;
      connect?: Enumerable<IncomingStrapiWebhookWhereUniqueInput>;
    };

  export type StrapiToZohoIntegrationUncheckedCreateNestedOneWithoutStrapiAppInput =
    {
      create?: XOR<
        StrapiToZohoIntegrationCreateWithoutStrapiAppInput,
        StrapiToZohoIntegrationUncheckedCreateWithoutStrapiAppInput
      >;
      connectOrCreate?: StrapiToZohoIntegrationCreateOrConnectWithoutStrapiAppInput;
      connect?: StrapiToZohoIntegrationWhereUniqueInput;
    };

  export type IncomingStrapiWebhookUpdateManyWithoutStrapiAppInput = {
    create?: XOR<
      Enumerable<IncomingStrapiWebhookCreateWithoutStrapiAppInput>,
      Enumerable<IncomingStrapiWebhookUncheckedCreateWithoutStrapiAppInput>
    >;
    connectOrCreate?: Enumerable<IncomingStrapiWebhookCreateOrConnectWithoutStrapiAppInput>;
    upsert?: Enumerable<IncomingStrapiWebhookUpsertWithWhereUniqueWithoutStrapiAppInput>;
    createMany?: IncomingStrapiWebhookCreateManyStrapiAppInputEnvelope;
    set?: Enumerable<IncomingStrapiWebhookWhereUniqueInput>;
    disconnect?: Enumerable<IncomingStrapiWebhookWhereUniqueInput>;
    delete?: Enumerable<IncomingStrapiWebhookWhereUniqueInput>;
    connect?: Enumerable<IncomingStrapiWebhookWhereUniqueInput>;
    update?: Enumerable<IncomingStrapiWebhookUpdateWithWhereUniqueWithoutStrapiAppInput>;
    updateMany?: Enumerable<IncomingStrapiWebhookUpdateManyWithWhereWithoutStrapiAppInput>;
    deleteMany?: Enumerable<IncomingStrapiWebhookScalarWhereInput>;
  };

  export type TenantUpdateOneRequiredWithoutStrapiAppsInput = {
    create?: XOR<
      TenantCreateWithoutStrapiAppsInput,
      TenantUncheckedCreateWithoutStrapiAppsInput
    >;
    connectOrCreate?: TenantCreateOrConnectWithoutStrapiAppsInput;
    upsert?: TenantUpsertWithoutStrapiAppsInput;
    connect?: TenantWhereUniqueInput;
    update?: XOR<
      TenantUpdateWithoutStrapiAppsInput,
      TenantUncheckedUpdateWithoutStrapiAppsInput
    >;
  };

  export type StrapiToZohoIntegrationUpdateOneWithoutStrapiAppInput = {
    create?: XOR<
      StrapiToZohoIntegrationCreateWithoutStrapiAppInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutStrapiAppInput
    >;
    connectOrCreate?: StrapiToZohoIntegrationCreateOrConnectWithoutStrapiAppInput;
    upsert?: StrapiToZohoIntegrationUpsertWithoutStrapiAppInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: StrapiToZohoIntegrationWhereUniqueInput;
    update?: XOR<
      StrapiToZohoIntegrationUpdateWithoutStrapiAppInput,
      StrapiToZohoIntegrationUncheckedUpdateWithoutStrapiAppInput
    >;
  };

  export type IncomingStrapiWebhookUncheckedUpdateManyWithoutStrapiAppInput = {
    create?: XOR<
      Enumerable<IncomingStrapiWebhookCreateWithoutStrapiAppInput>,
      Enumerable<IncomingStrapiWebhookUncheckedCreateWithoutStrapiAppInput>
    >;
    connectOrCreate?: Enumerable<IncomingStrapiWebhookCreateOrConnectWithoutStrapiAppInput>;
    upsert?: Enumerable<IncomingStrapiWebhookUpsertWithWhereUniqueWithoutStrapiAppInput>;
    createMany?: IncomingStrapiWebhookCreateManyStrapiAppInputEnvelope;
    set?: Enumerable<IncomingStrapiWebhookWhereUniqueInput>;
    disconnect?: Enumerable<IncomingStrapiWebhookWhereUniqueInput>;
    delete?: Enumerable<IncomingStrapiWebhookWhereUniqueInput>;
    connect?: Enumerable<IncomingStrapiWebhookWhereUniqueInput>;
    update?: Enumerable<IncomingStrapiWebhookUpdateWithWhereUniqueWithoutStrapiAppInput>;
    updateMany?: Enumerable<IncomingStrapiWebhookUpdateManyWithWhereWithoutStrapiAppInput>;
    deleteMany?: Enumerable<IncomingStrapiWebhookScalarWhereInput>;
  };

  export type StrapiToZohoIntegrationUncheckedUpdateOneWithoutStrapiAppInput = {
    create?: XOR<
      StrapiToZohoIntegrationCreateWithoutStrapiAppInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutStrapiAppInput
    >;
    connectOrCreate?: StrapiToZohoIntegrationCreateOrConnectWithoutStrapiAppInput;
    upsert?: StrapiToZohoIntegrationUpsertWithoutStrapiAppInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: StrapiToZohoIntegrationWhereUniqueInput;
    update?: XOR<
      StrapiToZohoIntegrationUpdateWithoutStrapiAppInput,
      StrapiToZohoIntegrationUncheckedUpdateWithoutStrapiAppInput
    >;
  };

  export type SecretKeyCreateNestedOneWithoutIncomingSaleorWebhookInput = {
    create?: XOR<
      SecretKeyCreateWithoutIncomingSaleorWebhookInput,
      SecretKeyUncheckedCreateWithoutIncomingSaleorWebhookInput
    >;
    connectOrCreate?: SecretKeyCreateOrConnectWithoutIncomingSaleorWebhookInput;
    connect?: SecretKeyWhereUniqueInput;
  };

  export type InstalledSaleorAppCreateNestedOneWithoutWebhooksInput = {
    create?: XOR<
      InstalledSaleorAppCreateWithoutWebhooksInput,
      InstalledSaleorAppUncheckedCreateWithoutWebhooksInput
    >;
    connectOrCreate?: InstalledSaleorAppCreateOrConnectWithoutWebhooksInput;
    connect?: InstalledSaleorAppWhereUniqueInput;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type SecretKeyUpdateOneRequiredWithoutIncomingSaleorWebhookInput = {
    create?: XOR<
      SecretKeyCreateWithoutIncomingSaleorWebhookInput,
      SecretKeyUncheckedCreateWithoutIncomingSaleorWebhookInput
    >;
    connectOrCreate?: SecretKeyCreateOrConnectWithoutIncomingSaleorWebhookInput;
    upsert?: SecretKeyUpsertWithoutIncomingSaleorWebhookInput;
    connect?: SecretKeyWhereUniqueInput;
    update?: XOR<
      SecretKeyUpdateWithoutIncomingSaleorWebhookInput,
      SecretKeyUncheckedUpdateWithoutIncomingSaleorWebhookInput
    >;
  };

  export type InstalledSaleorAppUpdateOneRequiredWithoutWebhooksInput = {
    create?: XOR<
      InstalledSaleorAppCreateWithoutWebhooksInput,
      InstalledSaleorAppUncheckedCreateWithoutWebhooksInput
    >;
    connectOrCreate?: InstalledSaleorAppCreateOrConnectWithoutWebhooksInput;
    upsert?: InstalledSaleorAppUpsertWithoutWebhooksInput;
    connect?: InstalledSaleorAppWhereUniqueInput;
    update?: XOR<
      InstalledSaleorAppUpdateWithoutWebhooksInput,
      InstalledSaleorAppUncheckedUpdateWithoutWebhooksInput
    >;
  };

  export type SecretKeyCreateNestedOneWithoutIncomingStrapiWebhookInput = {
    create?: XOR<
      SecretKeyCreateWithoutIncomingStrapiWebhookInput,
      SecretKeyUncheckedCreateWithoutIncomingStrapiWebhookInput
    >;
    connectOrCreate?: SecretKeyCreateOrConnectWithoutIncomingStrapiWebhookInput;
    connect?: SecretKeyWhereUniqueInput;
  };

  export type StrapiAppCreateNestedOneWithoutWebhooksInput = {
    create?: XOR<
      StrapiAppCreateWithoutWebhooksInput,
      StrapiAppUncheckedCreateWithoutWebhooksInput
    >;
    connectOrCreate?: StrapiAppCreateOrConnectWithoutWebhooksInput;
    connect?: StrapiAppWhereUniqueInput;
  };

  export type SecretKeyUpdateOneRequiredWithoutIncomingStrapiWebhookInput = {
    create?: XOR<
      SecretKeyCreateWithoutIncomingStrapiWebhookInput,
      SecretKeyUncheckedCreateWithoutIncomingStrapiWebhookInput
    >;
    connectOrCreate?: SecretKeyCreateOrConnectWithoutIncomingStrapiWebhookInput;
    upsert?: SecretKeyUpsertWithoutIncomingStrapiWebhookInput;
    connect?: SecretKeyWhereUniqueInput;
    update?: XOR<
      SecretKeyUpdateWithoutIncomingStrapiWebhookInput,
      SecretKeyUncheckedUpdateWithoutIncomingStrapiWebhookInput
    >;
  };

  export type StrapiAppUpdateOneRequiredWithoutWebhooksInput = {
    create?: XOR<
      StrapiAppCreateWithoutWebhooksInput,
      StrapiAppUncheckedCreateWithoutWebhooksInput
    >;
    connectOrCreate?: StrapiAppCreateOrConnectWithoutWebhooksInput;
    upsert?: StrapiAppUpsertWithoutWebhooksInput;
    connect?: StrapiAppWhereUniqueInput;
    update?: XOR<
      StrapiAppUpdateWithoutWebhooksInput,
      StrapiAppUncheckedUpdateWithoutWebhooksInput
    >;
  };

  export type ProductDataFeedAppCreateNestedOneWithoutWebhooksInput = {
    create?: XOR<
      ProductDataFeedAppCreateWithoutWebhooksInput,
      ProductDataFeedAppUncheckedCreateWithoutWebhooksInput
    >;
    connectOrCreate?: ProductDataFeedAppCreateOrConnectWithoutWebhooksInput;
    connect?: ProductDataFeedAppWhereUniqueInput;
  };

  export type ProductDataFeedAppUpdateOneRequiredWithoutWebhooksInput = {
    create?: XOR<
      ProductDataFeedAppCreateWithoutWebhooksInput,
      ProductDataFeedAppUncheckedCreateWithoutWebhooksInput
    >;
    connectOrCreate?: ProductDataFeedAppCreateOrConnectWithoutWebhooksInput;
    upsert?: ProductDataFeedAppUpsertWithoutWebhooksInput;
    connect?: ProductDataFeedAppWhereUniqueInput;
    update?: XOR<
      ProductDataFeedAppUpdateWithoutWebhooksInput,
      ProductDataFeedAppUncheckedUpdateWithoutWebhooksInput
    >;
  };

  export type LogisticsAppCreateNestedOneWithoutWebhooksInput = {
    create?: XOR<
      LogisticsAppCreateWithoutWebhooksInput,
      LogisticsAppUncheckedCreateWithoutWebhooksInput
    >;
    connectOrCreate?: LogisticsAppCreateOrConnectWithoutWebhooksInput;
    connect?: LogisticsAppWhereUniqueInput;
  };

  export type LogisticsAppUpdateOneRequiredWithoutWebhooksInput = {
    create?: XOR<
      LogisticsAppCreateWithoutWebhooksInput,
      LogisticsAppUncheckedCreateWithoutWebhooksInput
    >;
    connectOrCreate?: LogisticsAppCreateOrConnectWithoutWebhooksInput;
    upsert?: LogisticsAppUpsertWithoutWebhooksInput;
    connect?: LogisticsAppWhereUniqueInput;
    update?: XOR<
      LogisticsAppUpdateWithoutWebhooksInput,
      LogisticsAppUncheckedUpdateWithoutWebhooksInput
    >;
  };

  export type IncomingSaleorWebhookCreateNestedOneWithoutSecretInput = {
    create?: XOR<
      IncomingSaleorWebhookCreateWithoutSecretInput,
      IncomingSaleorWebhookUncheckedCreateWithoutSecretInput
    >;
    connectOrCreate?: IncomingSaleorWebhookCreateOrConnectWithoutSecretInput;
    connect?: IncomingSaleorWebhookWhereUniqueInput;
  };

  export type IncomingStrapiWebhookCreateNestedOneWithoutSecretInput = {
    create?: XOR<
      IncomingStrapiWebhookCreateWithoutSecretInput,
      IncomingStrapiWebhookUncheckedCreateWithoutSecretInput
    >;
    connectOrCreate?: IncomingStrapiWebhookCreateOrConnectWithoutSecretInput;
    connect?: IncomingStrapiWebhookWhereUniqueInput;
  };

  export type IncomingSaleorWebhookUncheckedCreateNestedOneWithoutSecretInput =
    {
      create?: XOR<
        IncomingSaleorWebhookCreateWithoutSecretInput,
        IncomingSaleorWebhookUncheckedCreateWithoutSecretInput
      >;
      connectOrCreate?: IncomingSaleorWebhookCreateOrConnectWithoutSecretInput;
      connect?: IncomingSaleorWebhookWhereUniqueInput;
    };

  export type IncomingStrapiWebhookUncheckedCreateNestedOneWithoutSecretInput =
    {
      create?: XOR<
        IncomingStrapiWebhookCreateWithoutSecretInput,
        IncomingStrapiWebhookUncheckedCreateWithoutSecretInput
      >;
      connectOrCreate?: IncomingStrapiWebhookCreateOrConnectWithoutSecretInput;
      connect?: IncomingStrapiWebhookWhereUniqueInput;
    };

  export type IncomingSaleorWebhookUpdateOneWithoutSecretInput = {
    create?: XOR<
      IncomingSaleorWebhookCreateWithoutSecretInput,
      IncomingSaleorWebhookUncheckedCreateWithoutSecretInput
    >;
    connectOrCreate?: IncomingSaleorWebhookCreateOrConnectWithoutSecretInput;
    upsert?: IncomingSaleorWebhookUpsertWithoutSecretInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: IncomingSaleorWebhookWhereUniqueInput;
    update?: XOR<
      IncomingSaleorWebhookUpdateWithoutSecretInput,
      IncomingSaleorWebhookUncheckedUpdateWithoutSecretInput
    >;
  };

  export type IncomingStrapiWebhookUpdateOneWithoutSecretInput = {
    create?: XOR<
      IncomingStrapiWebhookCreateWithoutSecretInput,
      IncomingStrapiWebhookUncheckedCreateWithoutSecretInput
    >;
    connectOrCreate?: IncomingStrapiWebhookCreateOrConnectWithoutSecretInput;
    upsert?: IncomingStrapiWebhookUpsertWithoutSecretInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: IncomingStrapiWebhookWhereUniqueInput;
    update?: XOR<
      IncomingStrapiWebhookUpdateWithoutSecretInput,
      IncomingStrapiWebhookUncheckedUpdateWithoutSecretInput
    >;
  };

  export type IncomingSaleorWebhookUncheckedUpdateOneWithoutSecretInput = {
    create?: XOR<
      IncomingSaleorWebhookCreateWithoutSecretInput,
      IncomingSaleorWebhookUncheckedCreateWithoutSecretInput
    >;
    connectOrCreate?: IncomingSaleorWebhookCreateOrConnectWithoutSecretInput;
    upsert?: IncomingSaleorWebhookUpsertWithoutSecretInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: IncomingSaleorWebhookWhereUniqueInput;
    update?: XOR<
      IncomingSaleorWebhookUpdateWithoutSecretInput,
      IncomingSaleorWebhookUncheckedUpdateWithoutSecretInput
    >;
  };

  export type IncomingStrapiWebhookUncheckedUpdateOneWithoutSecretInput = {
    create?: XOR<
      IncomingStrapiWebhookCreateWithoutSecretInput,
      IncomingStrapiWebhookUncheckedCreateWithoutSecretInput
    >;
    connectOrCreate?: IncomingStrapiWebhookCreateOrConnectWithoutSecretInput;
    upsert?: IncomingStrapiWebhookUpsertWithoutSecretInput;
    disconnect?: boolean;
    delete?: boolean;
    connect?: IncomingStrapiWebhookWhereUniqueInput;
    update?: XOR<
      IncomingStrapiWebhookUpdateWithoutSecretInput,
      IncomingStrapiWebhookUncheckedUpdateWithoutSecretInput
    >;
  };

  export type NestedStringFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    not?: NestedStringFilter | string;
  };

  export type NestedStringWithAggregatesFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    not?: NestedStringWithAggregatesFilter | string;
    _count?: NestedIntFilter;
    _min?: NestedStringFilter;
    _max?: NestedStringFilter;
  };

  export type NestedIntFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntFilter | number;
  };

  export type NestedStringNullableFilter = {
    equals?: string | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    not?: NestedStringNullableFilter | string | null;
  };

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    not?: NestedStringNullableWithAggregatesFilter | string | null;
    _count?: NestedIntNullableFilter;
    _min?: NestedStringNullableFilter;
    _max?: NestedStringNullableFilter;
  };

  export type NestedIntNullableFilter = {
    equals?: number | null;
    in?: Enumerable<number> | null;
    notIn?: Enumerable<number> | null;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntNullableFilter | number | null;
  };

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null;
    in?: Enumerable<Date> | Enumerable<string> | null;
    notIn?: Enumerable<Date> | Enumerable<string> | null;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeNullableFilter | Date | string | null;
  };

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null;
    in?: Enumerable<Date> | Enumerable<string> | null;
    notIn?: Enumerable<Date> | Enumerable<string> | null;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null;
    _count?: NestedIntNullableFilter;
    _min?: NestedDateTimeNullableFilter;
    _max?: NestedDateTimeNullableFilter;
  };

  export type NestedBoolFilter = {
    equals?: boolean;
    not?: NestedBoolFilter | boolean;
  };

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean;
    not?: NestedBoolWithAggregatesFilter | boolean;
    _count?: NestedIntFilter;
    _min?: NestedBoolFilter;
    _max?: NestedBoolFilter;
  };

  export type NestedDateTimeFilter = {
    equals?: Date | string;
    in?: Enumerable<Date> | Enumerable<string>;
    notIn?: Enumerable<Date> | Enumerable<string>;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeFilter | Date | string;
  };

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string;
    in?: Enumerable<Date> | Enumerable<string>;
    notIn?: Enumerable<Date> | Enumerable<string>;
    lt?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    not?: NestedDateTimeWithAggregatesFilter | Date | string;
    _count?: NestedIntFilter;
    _min?: NestedDateTimeFilter;
    _max?: NestedDateTimeFilter;
  };

  export type SaleorAppCreateWithoutProductDataFeedAppInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    installedSaleorApp?: InstalledSaleorAppCreateNestedOneWithoutSaleorAppInput;
    tenant: TenantCreateNestedOneWithoutSaleorAppsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedCreateWithoutProductDataFeedAppInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    tenantId: string;
    installedSaleorApp?: InstalledSaleorAppUncheckedCreateNestedOneWithoutSaleorAppInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutSaleorAppInput;
  };

  export type SaleorAppCreateOrConnectWithoutProductDataFeedAppInput = {
    where: SaleorAppWhereUniqueInput;
    create: XOR<
      SaleorAppCreateWithoutProductDataFeedAppInput,
      SaleorAppUncheckedCreateWithoutProductDataFeedAppInput
    >;
  };

  export type TenantCreateWithoutProductdatafeedAppsInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutProductdatafeedAppsInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutProductdatafeedAppsInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutProductdatafeedAppsInput,
      TenantUncheckedCreateWithoutProductdatafeedAppsInput
    >;
  };

  export type IncomingProductDataFeedWebhookCreateWithoutProductDataFeedAppInput =
    {
      id: string;
      name?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
    };

  export type IncomingProductDataFeedWebhookUncheckedCreateWithoutProductDataFeedAppInput =
    {
      id: string;
      name?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
    };

  export type IncomingProductDataFeedWebhookCreateOrConnectWithoutProductDataFeedAppInput =
    {
      where: IncomingProductDataFeedWebhookWhereUniqueInput;
      create: XOR<
        IncomingProductDataFeedWebhookCreateWithoutProductDataFeedAppInput,
        IncomingProductDataFeedWebhookUncheckedCreateWithoutProductDataFeedAppInput
      >;
    };

  export type IncomingProductDataFeedWebhookCreateManyProductDataFeedAppInputEnvelope =
    {
      data: Enumerable<IncomingProductDataFeedWebhookCreateManyProductDataFeedAppInput>;
      skipDuplicates?: boolean;
    };

  export type ProductDataFeedIntegrationCreateWithoutProductDataFeedAppInput = {
    id: string;
    enabled?: boolean;
    subscription?: SubscriptionCreateNestedOneWithoutProductDataFeedIntegrationInput;
    tenant: TenantCreateNestedOneWithoutProductDataFeedIntegrationInput;
    saleorApp: SaleorAppCreateNestedOneWithoutProductDataFeedIntegrationInput;
  };

  export type ProductDataFeedIntegrationUncheckedCreateWithoutProductDataFeedAppInput =
    {
      id: string;
      enabled?: boolean;
      subscriptionId?: string | null;
      tenantId: string;
      saleorAppId: string;
    };

  export type ProductDataFeedIntegrationCreateOrConnectWithoutProductDataFeedAppInput =
    {
      where: ProductDataFeedIntegrationWhereUniqueInput;
      create: XOR<
        ProductDataFeedIntegrationCreateWithoutProductDataFeedAppInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutProductDataFeedAppInput
      >;
    };

  export type SaleorAppUpsertWithoutProductDataFeedAppInput = {
    update: XOR<
      SaleorAppUpdateWithoutProductDataFeedAppInput,
      SaleorAppUncheckedUpdateWithoutProductDataFeedAppInput
    >;
    create: XOR<
      SaleorAppCreateWithoutProductDataFeedAppInput,
      SaleorAppUncheckedCreateWithoutProductDataFeedAppInput
    >;
  };

  export type SaleorAppUpdateWithoutProductDataFeedAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    installedSaleorApp?: InstalledSaleorAppUpdateOneWithoutSaleorAppInput;
    tenant?: TenantUpdateOneRequiredWithoutSaleorAppsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedUpdateWithoutProductDataFeedAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    installedSaleorApp?: InstalledSaleorAppUncheckedUpdateOneWithoutSaleorAppInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutSaleorAppInput;
  };

  export type TenantUpsertWithoutProductdatafeedAppsInput = {
    update: XOR<
      TenantUpdateWithoutProductdatafeedAppsInput,
      TenantUncheckedUpdateWithoutProductdatafeedAppsInput
    >;
    create: XOR<
      TenantCreateWithoutProductdatafeedAppsInput,
      TenantUncheckedCreateWithoutProductdatafeedAppsInput
    >;
  };

  export type TenantUpdateWithoutProductdatafeedAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutProductdatafeedAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedUpdateManyWithoutTenantInput;
  };

  export type IncomingProductDataFeedWebhookUpsertWithWhereUniqueWithoutProductDataFeedAppInput =
    {
      where: IncomingProductDataFeedWebhookWhereUniqueInput;
      update: XOR<
        IncomingProductDataFeedWebhookUpdateWithoutProductDataFeedAppInput,
        IncomingProductDataFeedWebhookUncheckedUpdateWithoutProductDataFeedAppInput
      >;
      create: XOR<
        IncomingProductDataFeedWebhookCreateWithoutProductDataFeedAppInput,
        IncomingProductDataFeedWebhookUncheckedCreateWithoutProductDataFeedAppInput
      >;
    };

  export type IncomingProductDataFeedWebhookUpdateWithWhereUniqueWithoutProductDataFeedAppInput =
    {
      where: IncomingProductDataFeedWebhookWhereUniqueInput;
      data: XOR<
        IncomingProductDataFeedWebhookUpdateWithoutProductDataFeedAppInput,
        IncomingProductDataFeedWebhookUncheckedUpdateWithoutProductDataFeedAppInput
      >;
    };

  export type IncomingProductDataFeedWebhookUpdateManyWithWhereWithoutProductDataFeedAppInput =
    {
      where: IncomingProductDataFeedWebhookScalarWhereInput;
      data: XOR<
        IncomingProductDataFeedWebhookUpdateManyMutationInput,
        IncomingProductDataFeedWebhookUncheckedUpdateManyWithoutWebhooksInput
      >;
    };

  export type IncomingProductDataFeedWebhookScalarWhereInput = {
    AND?: Enumerable<IncomingProductDataFeedWebhookScalarWhereInput>;
    OR?: Enumerable<IncomingProductDataFeedWebhookScalarWhereInput>;
    NOT?: Enumerable<IncomingProductDataFeedWebhookScalarWhereInput>;
    id?: StringFilter | string;
    name?: StringNullableFilter | string | null;
    createdAt?: DateTimeFilter | Date | string;
    updatedAt?: DateTimeFilter | Date | string;
    productDataFeedAppId?: StringFilter | string;
  };

  export type ProductDataFeedIntegrationUpsertWithoutProductDataFeedAppInput = {
    update: XOR<
      ProductDataFeedIntegrationUpdateWithoutProductDataFeedAppInput,
      ProductDataFeedIntegrationUncheckedUpdateWithoutProductDataFeedAppInput
    >;
    create: XOR<
      ProductDataFeedIntegrationCreateWithoutProductDataFeedAppInput,
      ProductDataFeedIntegrationUncheckedCreateWithoutProductDataFeedAppInput
    >;
  };

  export type ProductDataFeedIntegrationUpdateWithoutProductDataFeedAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscription?: SubscriptionUpdateOneWithoutProductDataFeedIntegrationInput;
    tenant?: TenantUpdateOneRequiredWithoutProductDataFeedIntegrationInput;
    saleorApp?: SaleorAppUpdateOneRequiredWithoutProductDataFeedIntegrationInput;
  };

  export type ProductDataFeedIntegrationUncheckedUpdateWithoutProductDataFeedAppInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      enabled?: BoolFieldUpdateOperationsInput | boolean;
      subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
      tenantId?: StringFieldUpdateOperationsInput | string;
      saleorAppId?: StringFieldUpdateOperationsInput | string;
    };

  export type TenantCreateWithoutLogisticsAppInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutLogisticsAppInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutLogisticsAppInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutLogisticsAppInput,
      TenantUncheckedCreateWithoutLogisticsAppInput
    >;
  };

  export type IncomingLogisticsWebhookCreateWithoutLogisticsAppInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type IncomingLogisticsWebhookUncheckedCreateWithoutLogisticsAppInput =
    {
      id: string;
      name?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
    };

  export type IncomingLogisticsWebhookCreateOrConnectWithoutLogisticsAppInput =
    {
      where: IncomingLogisticsWebhookWhereUniqueInput;
      create: XOR<
        IncomingLogisticsWebhookCreateWithoutLogisticsAppInput,
        IncomingLogisticsWebhookUncheckedCreateWithoutLogisticsAppInput
      >;
    };

  export type IncomingLogisticsWebhookCreateManyLogisticsAppInputEnvelope = {
    data: Enumerable<IncomingLogisticsWebhookCreateManyLogisticsAppInput>;
    skipDuplicates?: boolean;
  };

  export type LogisticsIntegrationCreateWithoutLogisticsAppInput = {
    id: string;
    enabled?: boolean;
    subscription?: SubscriptionCreateNestedOneWithoutLogisticsIntegrationInput;
    tenant: TenantCreateNestedOneWithoutLogisticsIntegrationInput;
    zohoApp: ZohoAppCreateNestedOneWithoutLogisticsIntegrationInput;
  };

  export type LogisticsIntegrationUncheckedCreateWithoutLogisticsAppInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    tenantId: string;
    zohoAppId: string;
  };

  export type LogisticsIntegrationCreateOrConnectWithoutLogisticsAppInput = {
    where: LogisticsIntegrationWhereUniqueInput;
    create: XOR<
      LogisticsIntegrationCreateWithoutLogisticsAppInput,
      LogisticsIntegrationUncheckedCreateWithoutLogisticsAppInput
    >;
  };

  export type TenantUpsertWithoutLogisticsAppInput = {
    update: XOR<
      TenantUpdateWithoutLogisticsAppInput,
      TenantUncheckedUpdateWithoutLogisticsAppInput
    >;
    create: XOR<
      TenantCreateWithoutLogisticsAppInput,
      TenantUncheckedCreateWithoutLogisticsAppInput
    >;
  };

  export type TenantUpdateWithoutLogisticsAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutLogisticsAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutTenantInput;
  };

  export type IncomingLogisticsWebhookUpsertWithWhereUniqueWithoutLogisticsAppInput =
    {
      where: IncomingLogisticsWebhookWhereUniqueInput;
      update: XOR<
        IncomingLogisticsWebhookUpdateWithoutLogisticsAppInput,
        IncomingLogisticsWebhookUncheckedUpdateWithoutLogisticsAppInput
      >;
      create: XOR<
        IncomingLogisticsWebhookCreateWithoutLogisticsAppInput,
        IncomingLogisticsWebhookUncheckedCreateWithoutLogisticsAppInput
      >;
    };

  export type IncomingLogisticsWebhookUpdateWithWhereUniqueWithoutLogisticsAppInput =
    {
      where: IncomingLogisticsWebhookWhereUniqueInput;
      data: XOR<
        IncomingLogisticsWebhookUpdateWithoutLogisticsAppInput,
        IncomingLogisticsWebhookUncheckedUpdateWithoutLogisticsAppInput
      >;
    };

  export type IncomingLogisticsWebhookUpdateManyWithWhereWithoutLogisticsAppInput =
    {
      where: IncomingLogisticsWebhookScalarWhereInput;
      data: XOR<
        IncomingLogisticsWebhookUpdateManyMutationInput,
        IncomingLogisticsWebhookUncheckedUpdateManyWithoutWebhooksInput
      >;
    };

  export type IncomingLogisticsWebhookScalarWhereInput = {
    AND?: Enumerable<IncomingLogisticsWebhookScalarWhereInput>;
    OR?: Enumerable<IncomingLogisticsWebhookScalarWhereInput>;
    NOT?: Enumerable<IncomingLogisticsWebhookScalarWhereInput>;
    id?: StringFilter | string;
    name?: StringNullableFilter | string | null;
    createdAt?: DateTimeFilter | Date | string;
    updatedAt?: DateTimeFilter | Date | string;
    logisticsAppId?: StringFilter | string;
  };

  export type LogisticsIntegrationUpsertWithoutLogisticsAppInput = {
    update: XOR<
      LogisticsIntegrationUpdateWithoutLogisticsAppInput,
      LogisticsIntegrationUncheckedUpdateWithoutLogisticsAppInput
    >;
    create: XOR<
      LogisticsIntegrationCreateWithoutLogisticsAppInput,
      LogisticsIntegrationUncheckedCreateWithoutLogisticsAppInput
    >;
  };

  export type LogisticsIntegrationUpdateWithoutLogisticsAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscription?: SubscriptionUpdateOneWithoutLogisticsIntegrationInput;
    tenant?: TenantUpdateOneRequiredWithoutLogisticsIntegrationInput;
    zohoApp?: ZohoAppUpdateOneRequiredWithoutLogisticsIntegrationInput;
  };

  export type LogisticsIntegrationUncheckedUpdateWithoutLogisticsAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    zohoAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type TenantCreateWithoutZohoAppsInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutZohoAppsInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutZohoAppsInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutZohoAppsInput,
      TenantUncheckedCreateWithoutZohoAppsInput
    >;
  };

  export type StrapiToZohoIntegrationCreateWithoutZohoAppInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscription?: SubscriptionCreateNestedOneWithoutStrapiToZohoIntegrationInput;
    tenant: TenantCreateNestedOneWithoutStrapiToZohoIntegrationInput;
    strapiApp: StrapiAppCreateNestedOneWithoutIntegrationInput;
  };

  export type StrapiToZohoIntegrationUncheckedCreateWithoutZohoAppInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscriptionId?: string | null;
    tenantId: string;
    strapiAppId: string;
  };

  export type StrapiToZohoIntegrationCreateOrConnectWithoutZohoAppInput = {
    where: StrapiToZohoIntegrationWhereUniqueInput;
    create: XOR<
      StrapiToZohoIntegrationCreateWithoutZohoAppInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutZohoAppInput
    >;
  };

  export type StrapiToZohoIntegrationCreateManyZohoAppInputEnvelope = {
    data: Enumerable<StrapiToZohoIntegrationCreateManyZohoAppInput>;
    skipDuplicates?: boolean;
  };

  export type LogisticsIntegrationCreateWithoutZohoAppInput = {
    id: string;
    enabled?: boolean;
    subscription?: SubscriptionCreateNestedOneWithoutLogisticsIntegrationInput;
    tenant: TenantCreateNestedOneWithoutLogisticsIntegrationInput;
    logisticsApp: LogisticsAppCreateNestedOneWithoutIntegrationInput;
  };

  export type LogisticsIntegrationUncheckedCreateWithoutZohoAppInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    tenantId: string;
    logisticsAppId: string;
  };

  export type LogisticsIntegrationCreateOrConnectWithoutZohoAppInput = {
    where: LogisticsIntegrationWhereUniqueInput;
    create: XOR<
      LogisticsIntegrationCreateWithoutZohoAppInput,
      LogisticsIntegrationUncheckedCreateWithoutZohoAppInput
    >;
  };

  export type LogisticsIntegrationCreateManyZohoAppInputEnvelope = {
    data: Enumerable<LogisticsIntegrationCreateManyZohoAppInput>;
    skipDuplicates?: boolean;
  };

  export type TenantUpsertWithoutZohoAppsInput = {
    update: XOR<
      TenantUpdateWithoutZohoAppsInput,
      TenantUncheckedUpdateWithoutZohoAppsInput
    >;
    create: XOR<
      TenantCreateWithoutZohoAppsInput,
      TenantUncheckedCreateWithoutZohoAppsInput
    >;
  };

  export type TenantUpdateWithoutZohoAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutZohoAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedUpdateManyWithoutTenantInput;
  };

  export type StrapiToZohoIntegrationUpsertWithWhereUniqueWithoutZohoAppInput =
    {
      where: StrapiToZohoIntegrationWhereUniqueInput;
      update: XOR<
        StrapiToZohoIntegrationUpdateWithoutZohoAppInput,
        StrapiToZohoIntegrationUncheckedUpdateWithoutZohoAppInput
      >;
      create: XOR<
        StrapiToZohoIntegrationCreateWithoutZohoAppInput,
        StrapiToZohoIntegrationUncheckedCreateWithoutZohoAppInput
      >;
    };

  export type StrapiToZohoIntegrationUpdateWithWhereUniqueWithoutZohoAppInput =
    {
      where: StrapiToZohoIntegrationWhereUniqueInput;
      data: XOR<
        StrapiToZohoIntegrationUpdateWithoutZohoAppInput,
        StrapiToZohoIntegrationUncheckedUpdateWithoutZohoAppInput
      >;
    };

  export type StrapiToZohoIntegrationUpdateManyWithWhereWithoutZohoAppInput = {
    where: StrapiToZohoIntegrationScalarWhereInput;
    data: XOR<
      StrapiToZohoIntegrationUpdateManyMutationInput,
      StrapiToZohoIntegrationUncheckedUpdateManyWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type StrapiToZohoIntegrationScalarWhereInput = {
    AND?: Enumerable<StrapiToZohoIntegrationScalarWhereInput>;
    OR?: Enumerable<StrapiToZohoIntegrationScalarWhereInput>;
    NOT?: Enumerable<StrapiToZohoIntegrationScalarWhereInput>;
    id?: StringFilter | string;
    payedUntil?: DateTimeNullableFilter | Date | string | null;
    enabled?: BoolFilter | boolean;
    strapiContentType?: StringFilter | string;
    subscriptionId?: StringNullableFilter | string | null;
    tenantId?: StringFilter | string;
    strapiAppId?: StringFilter | string;
    zohoAppId?: StringFilter | string;
  };

  export type LogisticsIntegrationUpsertWithWhereUniqueWithoutZohoAppInput = {
    where: LogisticsIntegrationWhereUniqueInput;
    update: XOR<
      LogisticsIntegrationUpdateWithoutZohoAppInput,
      LogisticsIntegrationUncheckedUpdateWithoutZohoAppInput
    >;
    create: XOR<
      LogisticsIntegrationCreateWithoutZohoAppInput,
      LogisticsIntegrationUncheckedCreateWithoutZohoAppInput
    >;
  };

  export type LogisticsIntegrationUpdateWithWhereUniqueWithoutZohoAppInput = {
    where: LogisticsIntegrationWhereUniqueInput;
    data: XOR<
      LogisticsIntegrationUpdateWithoutZohoAppInput,
      LogisticsIntegrationUncheckedUpdateWithoutZohoAppInput
    >;
  };

  export type LogisticsIntegrationUpdateManyWithWhereWithoutZohoAppInput = {
    where: LogisticsIntegrationScalarWhereInput;
    data: XOR<
      LogisticsIntegrationUpdateManyMutationInput,
      LogisticsIntegrationUncheckedUpdateManyWithoutLogisticsIntegrationInput
    >;
  };

  export type LogisticsIntegrationScalarWhereInput = {
    AND?: Enumerable<LogisticsIntegrationScalarWhereInput>;
    OR?: Enumerable<LogisticsIntegrationScalarWhereInput>;
    NOT?: Enumerable<LogisticsIntegrationScalarWhereInput>;
    id?: StringFilter | string;
    enabled?: BoolFilter | boolean;
    subscriptionId?: StringNullableFilter | string | null;
    tenantId?: StringFilter | string;
    zohoAppId?: StringFilter | string;
    logisticsAppId?: StringFilter | string;
  };

  export type InstalledSaleorAppCreateWithoutSaleorAppInput = {
    id: string;
    token: string;
    webhooks?: IncomingSaleorWebhookCreateNestedManyWithoutInstalledSaleorAppInput;
  };

  export type InstalledSaleorAppUncheckedCreateWithoutSaleorAppInput = {
    id: string;
    token: string;
    webhooks?: IncomingSaleorWebhookUncheckedCreateNestedManyWithoutInstalledSaleorAppInput;
  };

  export type InstalledSaleorAppCreateOrConnectWithoutSaleorAppInput = {
    where: InstalledSaleorAppWhereUniqueInput;
    create: XOR<
      InstalledSaleorAppCreateWithoutSaleorAppInput,
      InstalledSaleorAppUncheckedCreateWithoutSaleorAppInput
    >;
  };

  export type TenantCreateWithoutSaleorAppsInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutSaleorAppsInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutSaleorAppsInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutSaleorAppsInput,
      TenantUncheckedCreateWithoutSaleorAppsInput
    >;
  };

  export type ProductDataFeedIntegrationCreateWithoutSaleorAppInput = {
    id: string;
    enabled?: boolean;
    subscription?: SubscriptionCreateNestedOneWithoutProductDataFeedIntegrationInput;
    tenant: TenantCreateNestedOneWithoutProductDataFeedIntegrationInput;
    productDataFeedApp: ProductDataFeedAppCreateNestedOneWithoutIntegrationInput;
  };

  export type ProductDataFeedIntegrationUncheckedCreateWithoutSaleorAppInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    tenantId: string;
    productDataFeedAppId: string;
  };

  export type ProductDataFeedIntegrationCreateOrConnectWithoutSaleorAppInput = {
    where: ProductDataFeedIntegrationWhereUniqueInput;
    create: XOR<
      ProductDataFeedIntegrationCreateWithoutSaleorAppInput,
      ProductDataFeedIntegrationUncheckedCreateWithoutSaleorAppInput
    >;
  };

  export type ProductDataFeedIntegrationCreateManySaleorAppInputEnvelope = {
    data: Enumerable<ProductDataFeedIntegrationCreateManySaleorAppInput>;
    skipDuplicates?: boolean;
  };

  export type ProductDataFeedAppCreateWithoutSaleorAppInput = {
    id: string;
    productDetailStorefrontURL: string;
    tenant: TenantCreateNestedOneWithoutProductdatafeedAppsInput;
    webhooks?: IncomingProductDataFeedWebhookCreateNestedManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationCreateNestedOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedCreateWithoutSaleorAppInput = {
    id: string;
    productDetailStorefrontURL: string;
    tenantId: string;
    webhooks?: IncomingProductDataFeedWebhookUncheckedCreateNestedManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationUncheckedCreateNestedOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppCreateOrConnectWithoutSaleorAppInput = {
    where: ProductDataFeedAppWhereUniqueInput;
    create: XOR<
      ProductDataFeedAppCreateWithoutSaleorAppInput,
      ProductDataFeedAppUncheckedCreateWithoutSaleorAppInput
    >;
  };

  export type ProductDataFeedAppCreateManySaleorAppInputEnvelope = {
    data: Enumerable<ProductDataFeedAppCreateManySaleorAppInput>;
    skipDuplicates?: boolean;
  };

  export type InstalledSaleorAppUpsertWithoutSaleorAppInput = {
    update: XOR<
      InstalledSaleorAppUpdateWithoutSaleorAppInput,
      InstalledSaleorAppUncheckedUpdateWithoutSaleorAppInput
    >;
    create: XOR<
      InstalledSaleorAppCreateWithoutSaleorAppInput,
      InstalledSaleorAppUncheckedCreateWithoutSaleorAppInput
    >;
  };

  export type InstalledSaleorAppUpdateWithoutSaleorAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingSaleorWebhookUpdateManyWithoutInstalledSaleorAppInput;
  };

  export type InstalledSaleorAppUncheckedUpdateWithoutSaleorAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingSaleorWebhookUncheckedUpdateManyWithoutInstalledSaleorAppInput;
  };

  export type TenantUpsertWithoutSaleorAppsInput = {
    update: XOR<
      TenantUpdateWithoutSaleorAppsInput,
      TenantUncheckedUpdateWithoutSaleorAppsInput
    >;
    create: XOR<
      TenantCreateWithoutSaleorAppsInput,
      TenantUncheckedCreateWithoutSaleorAppsInput
    >;
  };

  export type TenantUpdateWithoutSaleorAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutSaleorAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedUpdateManyWithoutTenantInput;
  };

  export type ProductDataFeedIntegrationUpsertWithWhereUniqueWithoutSaleorAppInput =
    {
      where: ProductDataFeedIntegrationWhereUniqueInput;
      update: XOR<
        ProductDataFeedIntegrationUpdateWithoutSaleorAppInput,
        ProductDataFeedIntegrationUncheckedUpdateWithoutSaleorAppInput
      >;
      create: XOR<
        ProductDataFeedIntegrationCreateWithoutSaleorAppInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutSaleorAppInput
      >;
    };

  export type ProductDataFeedIntegrationUpdateWithWhereUniqueWithoutSaleorAppInput =
    {
      where: ProductDataFeedIntegrationWhereUniqueInput;
      data: XOR<
        ProductDataFeedIntegrationUpdateWithoutSaleorAppInput,
        ProductDataFeedIntegrationUncheckedUpdateWithoutSaleorAppInput
      >;
    };

  export type ProductDataFeedIntegrationUpdateManyWithWhereWithoutSaleorAppInput =
    {
      where: ProductDataFeedIntegrationScalarWhereInput;
      data: XOR<
        ProductDataFeedIntegrationUpdateManyMutationInput,
        ProductDataFeedIntegrationUncheckedUpdateManyWithoutProductDataFeedIntegrationInput
      >;
    };

  export type ProductDataFeedIntegrationScalarWhereInput = {
    AND?: Enumerable<ProductDataFeedIntegrationScalarWhereInput>;
    OR?: Enumerable<ProductDataFeedIntegrationScalarWhereInput>;
    NOT?: Enumerable<ProductDataFeedIntegrationScalarWhereInput>;
    id?: StringFilter | string;
    enabled?: BoolFilter | boolean;
    subscriptionId?: StringNullableFilter | string | null;
    tenantId?: StringFilter | string;
    productDataFeedAppId?: StringFilter | string;
    saleorAppId?: StringFilter | string;
  };

  export type ProductDataFeedAppUpsertWithWhereUniqueWithoutSaleorAppInput = {
    where: ProductDataFeedAppWhereUniqueInput;
    update: XOR<
      ProductDataFeedAppUpdateWithoutSaleorAppInput,
      ProductDataFeedAppUncheckedUpdateWithoutSaleorAppInput
    >;
    create: XOR<
      ProductDataFeedAppCreateWithoutSaleorAppInput,
      ProductDataFeedAppUncheckedCreateWithoutSaleorAppInput
    >;
  };

  export type ProductDataFeedAppUpdateWithWhereUniqueWithoutSaleorAppInput = {
    where: ProductDataFeedAppWhereUniqueInput;
    data: XOR<
      ProductDataFeedAppUpdateWithoutSaleorAppInput,
      ProductDataFeedAppUncheckedUpdateWithoutSaleorAppInput
    >;
  };

  export type ProductDataFeedAppUpdateManyWithWhereWithoutSaleorAppInput = {
    where: ProductDataFeedAppScalarWhereInput;
    data: XOR<
      ProductDataFeedAppUpdateManyMutationInput,
      ProductDataFeedAppUncheckedUpdateManyWithoutProductDataFeedAppInput
    >;
  };

  export type ProductDataFeedAppScalarWhereInput = {
    AND?: Enumerable<ProductDataFeedAppScalarWhereInput>;
    OR?: Enumerable<ProductDataFeedAppScalarWhereInput>;
    NOT?: Enumerable<ProductDataFeedAppScalarWhereInput>;
    id?: StringFilter | string;
    productDetailStorefrontURL?: StringFilter | string;
    saleorAppId?: StringFilter | string;
    tenantId?: StringFilter | string;
  };

  export type IncomingSaleorWebhookCreateWithoutInstalledSaleorAppInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secret: SecretKeyCreateNestedOneWithoutIncomingSaleorWebhookInput;
  };

  export type IncomingSaleorWebhookUncheckedCreateWithoutInstalledSaleorAppInput =
    {
      id: string;
      name?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      secretId: string;
    };

  export type IncomingSaleorWebhookCreateOrConnectWithoutInstalledSaleorAppInput =
    {
      where: IncomingSaleorWebhookWhereUniqueInput;
      create: XOR<
        IncomingSaleorWebhookCreateWithoutInstalledSaleorAppInput,
        IncomingSaleorWebhookUncheckedCreateWithoutInstalledSaleorAppInput
      >;
    };

  export type IncomingSaleorWebhookCreateManyInstalledSaleorAppInputEnvelope = {
    data: Enumerable<IncomingSaleorWebhookCreateManyInstalledSaleorAppInput>;
    skipDuplicates?: boolean;
  };

  export type SaleorAppCreateWithoutInstalledSaleorAppInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    tenant: TenantCreateNestedOneWithoutSaleorAppsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppCreateNestedManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedCreateWithoutInstalledSaleorAppInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    tenantId: string;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUncheckedCreateNestedManyWithoutSaleorAppInput;
  };

  export type SaleorAppCreateOrConnectWithoutInstalledSaleorAppInput = {
    where: SaleorAppWhereUniqueInput;
    create: XOR<
      SaleorAppCreateWithoutInstalledSaleorAppInput,
      SaleorAppUncheckedCreateWithoutInstalledSaleorAppInput
    >;
  };

  export type IncomingSaleorWebhookUpsertWithWhereUniqueWithoutInstalledSaleorAppInput =
    {
      where: IncomingSaleorWebhookWhereUniqueInput;
      update: XOR<
        IncomingSaleorWebhookUpdateWithoutInstalledSaleorAppInput,
        IncomingSaleorWebhookUncheckedUpdateWithoutInstalledSaleorAppInput
      >;
      create: XOR<
        IncomingSaleorWebhookCreateWithoutInstalledSaleorAppInput,
        IncomingSaleorWebhookUncheckedCreateWithoutInstalledSaleorAppInput
      >;
    };

  export type IncomingSaleorWebhookUpdateWithWhereUniqueWithoutInstalledSaleorAppInput =
    {
      where: IncomingSaleorWebhookWhereUniqueInput;
      data: XOR<
        IncomingSaleorWebhookUpdateWithoutInstalledSaleorAppInput,
        IncomingSaleorWebhookUncheckedUpdateWithoutInstalledSaleorAppInput
      >;
    };

  export type IncomingSaleorWebhookUpdateManyWithWhereWithoutInstalledSaleorAppInput =
    {
      where: IncomingSaleorWebhookScalarWhereInput;
      data: XOR<
        IncomingSaleorWebhookUpdateManyMutationInput,
        IncomingSaleorWebhookUncheckedUpdateManyWithoutWebhooksInput
      >;
    };

  export type IncomingSaleorWebhookScalarWhereInput = {
    AND?: Enumerable<IncomingSaleorWebhookScalarWhereInput>;
    OR?: Enumerable<IncomingSaleorWebhookScalarWhereInput>;
    NOT?: Enumerable<IncomingSaleorWebhookScalarWhereInput>;
    id?: StringFilter | string;
    name?: StringNullableFilter | string | null;
    createdAt?: DateTimeFilter | Date | string;
    updatedAt?: DateTimeFilter | Date | string;
    secretId?: StringFilter | string;
    installedSaleorAppId?: StringFilter | string;
  };

  export type SaleorAppUpsertWithoutInstalledSaleorAppInput = {
    update: XOR<
      SaleorAppUpdateWithoutInstalledSaleorAppInput,
      SaleorAppUncheckedUpdateWithoutInstalledSaleorAppInput
    >;
    create: XOR<
      SaleorAppCreateWithoutInstalledSaleorAppInput,
      SaleorAppUncheckedCreateWithoutInstalledSaleorAppInput
    >;
  };

  export type SaleorAppUpdateWithoutInstalledSaleorAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    tenant?: TenantUpdateOneRequiredWithoutSaleorAppsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUpdateManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedUpdateWithoutInstalledSaleorAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUncheckedUpdateManyWithoutSaleorAppInput;
  };

  export type SubscriptionCreateWithoutTenantInput = {
    id: string;
    payedUntil?: Date | string | null;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedCreateWithoutTenantInput = {
    id: string;
    payedUntil?: Date | string | null;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
  };

  export type SubscriptionCreateOrConnectWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput;
    create: XOR<
      SubscriptionCreateWithoutTenantInput,
      SubscriptionUncheckedCreateWithoutTenantInput
    >;
  };

  export type SubscriptionCreateManyTenantInputEnvelope = {
    data: Enumerable<SubscriptionCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type SaleorAppCreateWithoutTenantInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    installedSaleorApp?: InstalledSaleorAppCreateNestedOneWithoutSaleorAppInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppCreateNestedManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedCreateWithoutTenantInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    installedSaleorApp?: InstalledSaleorAppUncheckedCreateNestedOneWithoutSaleorAppInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUncheckedCreateNestedManyWithoutSaleorAppInput;
  };

  export type SaleorAppCreateOrConnectWithoutTenantInput = {
    where: SaleorAppWhereUniqueInput;
    create: XOR<
      SaleorAppCreateWithoutTenantInput,
      SaleorAppUncheckedCreateWithoutTenantInput
    >;
  };

  export type SaleorAppCreateManyTenantInputEnvelope = {
    data: Enumerable<SaleorAppCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type ZohoAppCreateWithoutTenantInput = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutZohoAppInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutZohoAppInput;
  };

  export type ZohoAppUncheckedCreateWithoutTenantInput = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutZohoAppInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutZohoAppInput;
  };

  export type ZohoAppCreateOrConnectWithoutTenantInput = {
    where: ZohoAppWhereUniqueInput;
    create: XOR<
      ZohoAppCreateWithoutTenantInput,
      ZohoAppUncheckedCreateWithoutTenantInput
    >;
  };

  export type ZohoAppCreateManyTenantInputEnvelope = {
    data: Enumerable<ZohoAppCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type ProductDataFeedAppCreateWithoutTenantInput = {
    id: string;
    productDetailStorefrontURL: string;
    saleorApp: SaleorAppCreateNestedOneWithoutProductDataFeedAppInput;
    webhooks?: IncomingProductDataFeedWebhookCreateNestedManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationCreateNestedOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedCreateWithoutTenantInput = {
    id: string;
    productDetailStorefrontURL: string;
    saleorAppId: string;
    webhooks?: IncomingProductDataFeedWebhookUncheckedCreateNestedManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationUncheckedCreateNestedOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppCreateOrConnectWithoutTenantInput = {
    where: ProductDataFeedAppWhereUniqueInput;
    create: XOR<
      ProductDataFeedAppCreateWithoutTenantInput,
      ProductDataFeedAppUncheckedCreateWithoutTenantInput
    >;
  };

  export type ProductDataFeedAppCreateManyTenantInputEnvelope = {
    data: Enumerable<ProductDataFeedAppCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type StrapiAppCreateWithoutTenantInput = {
    id: string;
    name: string;
    webhooks?: IncomingStrapiWebhookCreateNestedManyWithoutStrapiAppInput;
    integration?: StrapiToZohoIntegrationCreateNestedOneWithoutStrapiAppInput;
  };

  export type StrapiAppUncheckedCreateWithoutTenantInput = {
    id: string;
    name: string;
    webhooks?: IncomingStrapiWebhookUncheckedCreateNestedManyWithoutStrapiAppInput;
    integration?: StrapiToZohoIntegrationUncheckedCreateNestedOneWithoutStrapiAppInput;
  };

  export type StrapiAppCreateOrConnectWithoutTenantInput = {
    where: StrapiAppWhereUniqueInput;
    create: XOR<
      StrapiAppCreateWithoutTenantInput,
      StrapiAppUncheckedCreateWithoutTenantInput
    >;
  };

  export type StrapiAppCreateManyTenantInputEnvelope = {
    data: Enumerable<StrapiAppCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type ProductDataFeedIntegrationCreateWithoutTenantInput = {
    id: string;
    enabled?: boolean;
    subscription?: SubscriptionCreateNestedOneWithoutProductDataFeedIntegrationInput;
    productDataFeedApp: ProductDataFeedAppCreateNestedOneWithoutIntegrationInput;
    saleorApp: SaleorAppCreateNestedOneWithoutProductDataFeedIntegrationInput;
  };

  export type ProductDataFeedIntegrationUncheckedCreateWithoutTenantInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    productDataFeedAppId: string;
    saleorAppId: string;
  };

  export type ProductDataFeedIntegrationCreateOrConnectWithoutTenantInput = {
    where: ProductDataFeedIntegrationWhereUniqueInput;
    create: XOR<
      ProductDataFeedIntegrationCreateWithoutTenantInput,
      ProductDataFeedIntegrationUncheckedCreateWithoutTenantInput
    >;
  };

  export type ProductDataFeedIntegrationCreateManyTenantInputEnvelope = {
    data: Enumerable<ProductDataFeedIntegrationCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type StrapiToZohoIntegrationCreateWithoutTenantInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscription?: SubscriptionCreateNestedOneWithoutStrapiToZohoIntegrationInput;
    strapiApp: StrapiAppCreateNestedOneWithoutIntegrationInput;
    zohoApp: ZohoAppCreateNestedOneWithoutStrapiToZohoIntegrationInput;
  };

  export type StrapiToZohoIntegrationUncheckedCreateWithoutTenantInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscriptionId?: string | null;
    strapiAppId: string;
    zohoAppId: string;
  };

  export type StrapiToZohoIntegrationCreateOrConnectWithoutTenantInput = {
    where: StrapiToZohoIntegrationWhereUniqueInput;
    create: XOR<
      StrapiToZohoIntegrationCreateWithoutTenantInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutTenantInput
    >;
  };

  export type StrapiToZohoIntegrationCreateManyTenantInputEnvelope = {
    data: Enumerable<StrapiToZohoIntegrationCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type LogisticsIntegrationCreateWithoutTenantInput = {
    id: string;
    enabled?: boolean;
    subscription?: SubscriptionCreateNestedOneWithoutLogisticsIntegrationInput;
    zohoApp: ZohoAppCreateNestedOneWithoutLogisticsIntegrationInput;
    logisticsApp: LogisticsAppCreateNestedOneWithoutIntegrationInput;
  };

  export type LogisticsIntegrationUncheckedCreateWithoutTenantInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    zohoAppId: string;
    logisticsAppId: string;
  };

  export type LogisticsIntegrationCreateOrConnectWithoutTenantInput = {
    where: LogisticsIntegrationWhereUniqueInput;
    create: XOR<
      LogisticsIntegrationCreateWithoutTenantInput,
      LogisticsIntegrationUncheckedCreateWithoutTenantInput
    >;
  };

  export type LogisticsIntegrationCreateManyTenantInputEnvelope = {
    data: Enumerable<LogisticsIntegrationCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type LogisticsAppCreateWithoutTenantInput = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
    webhooks?: IncomingLogisticsWebhookCreateNestedManyWithoutLogisticsAppInput;
    integration?: LogisticsIntegrationCreateNestedOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppUncheckedCreateWithoutTenantInput = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
    webhooks?: IncomingLogisticsWebhookUncheckedCreateNestedManyWithoutLogisticsAppInput;
    integration?: LogisticsIntegrationUncheckedCreateNestedOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppCreateOrConnectWithoutTenantInput = {
    where: LogisticsAppWhereUniqueInput;
    create: XOR<
      LogisticsAppCreateWithoutTenantInput,
      LogisticsAppUncheckedCreateWithoutTenantInput
    >;
  };

  export type LogisticsAppCreateManyTenantInputEnvelope = {
    data: Enumerable<LogisticsAppCreateManyTenantInput>;
    skipDuplicates?: boolean;
  };

  export type SubscriptionUpsertWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput;
    update: XOR<
      SubscriptionUpdateWithoutTenantInput,
      SubscriptionUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      SubscriptionCreateWithoutTenantInput,
      SubscriptionUncheckedCreateWithoutTenantInput
    >;
  };

  export type SubscriptionUpdateWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput;
    data: XOR<
      SubscriptionUpdateWithoutTenantInput,
      SubscriptionUncheckedUpdateWithoutTenantInput
    >;
  };

  export type SubscriptionUpdateManyWithWhereWithoutTenantInput = {
    where: SubscriptionScalarWhereInput;
    data: XOR<
      SubscriptionUpdateManyMutationInput,
      SubscriptionUncheckedUpdateManyWithoutSubscriptionsInput
    >;
  };

  export type SubscriptionScalarWhereInput = {
    AND?: Enumerable<SubscriptionScalarWhereInput>;
    OR?: Enumerable<SubscriptionScalarWhereInput>;
    NOT?: Enumerable<SubscriptionScalarWhereInput>;
    id?: StringFilter | string;
    tenantId?: StringFilter | string;
    payedUntil?: DateTimeNullableFilter | Date | string | null;
  };

  export type SaleorAppUpsertWithWhereUniqueWithoutTenantInput = {
    where: SaleorAppWhereUniqueInput;
    update: XOR<
      SaleorAppUpdateWithoutTenantInput,
      SaleorAppUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      SaleorAppCreateWithoutTenantInput,
      SaleorAppUncheckedCreateWithoutTenantInput
    >;
  };

  export type SaleorAppUpdateWithWhereUniqueWithoutTenantInput = {
    where: SaleorAppWhereUniqueInput;
    data: XOR<
      SaleorAppUpdateWithoutTenantInput,
      SaleorAppUncheckedUpdateWithoutTenantInput
    >;
  };

  export type SaleorAppUpdateManyWithWhereWithoutTenantInput = {
    where: SaleorAppScalarWhereInput;
    data: XOR<
      SaleorAppUpdateManyMutationInput,
      SaleorAppUncheckedUpdateManyWithoutSaleorAppsInput
    >;
  };

  export type SaleorAppScalarWhereInput = {
    AND?: Enumerable<SaleorAppScalarWhereInput>;
    OR?: Enumerable<SaleorAppScalarWhereInput>;
    NOT?: Enumerable<SaleorAppScalarWhereInput>;
    id?: StringFilter | string;
    domain?: StringFilter | string;
    name?: StringFilter | string;
    channelSlug?: StringNullableFilter | string | null;
    tenantId?: StringFilter | string;
  };

  export type ZohoAppUpsertWithWhereUniqueWithoutTenantInput = {
    where: ZohoAppWhereUniqueInput;
    update: XOR<
      ZohoAppUpdateWithoutTenantInput,
      ZohoAppUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      ZohoAppCreateWithoutTenantInput,
      ZohoAppUncheckedCreateWithoutTenantInput
    >;
  };

  export type ZohoAppUpdateWithWhereUniqueWithoutTenantInput = {
    where: ZohoAppWhereUniqueInput;
    data: XOR<
      ZohoAppUpdateWithoutTenantInput,
      ZohoAppUncheckedUpdateWithoutTenantInput
    >;
  };

  export type ZohoAppUpdateManyWithWhereWithoutTenantInput = {
    where: ZohoAppScalarWhereInput;
    data: XOR<
      ZohoAppUpdateManyMutationInput,
      ZohoAppUncheckedUpdateManyWithoutZohoAppsInput
    >;
  };

  export type ZohoAppScalarWhereInput = {
    AND?: Enumerable<ZohoAppScalarWhereInput>;
    OR?: Enumerable<ZohoAppScalarWhereInput>;
    NOT?: Enumerable<ZohoAppScalarWhereInput>;
    id?: StringFilter | string;
    orgId?: StringFilter | string;
    clientId?: StringFilter | string;
    clientSecret?: StringFilter | string;
    tenantId?: StringFilter | string;
  };

  export type ProductDataFeedAppUpsertWithWhereUniqueWithoutTenantInput = {
    where: ProductDataFeedAppWhereUniqueInput;
    update: XOR<
      ProductDataFeedAppUpdateWithoutTenantInput,
      ProductDataFeedAppUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      ProductDataFeedAppCreateWithoutTenantInput,
      ProductDataFeedAppUncheckedCreateWithoutTenantInput
    >;
  };

  export type ProductDataFeedAppUpdateWithWhereUniqueWithoutTenantInput = {
    where: ProductDataFeedAppWhereUniqueInput;
    data: XOR<
      ProductDataFeedAppUpdateWithoutTenantInput,
      ProductDataFeedAppUncheckedUpdateWithoutTenantInput
    >;
  };

  export type ProductDataFeedAppUpdateManyWithWhereWithoutTenantInput = {
    where: ProductDataFeedAppScalarWhereInput;
    data: XOR<
      ProductDataFeedAppUpdateManyMutationInput,
      ProductDataFeedAppUncheckedUpdateManyWithoutProductdatafeedAppsInput
    >;
  };

  export type StrapiAppUpsertWithWhereUniqueWithoutTenantInput = {
    where: StrapiAppWhereUniqueInput;
    update: XOR<
      StrapiAppUpdateWithoutTenantInput,
      StrapiAppUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      StrapiAppCreateWithoutTenantInput,
      StrapiAppUncheckedCreateWithoutTenantInput
    >;
  };

  export type StrapiAppUpdateWithWhereUniqueWithoutTenantInput = {
    where: StrapiAppWhereUniqueInput;
    data: XOR<
      StrapiAppUpdateWithoutTenantInput,
      StrapiAppUncheckedUpdateWithoutTenantInput
    >;
  };

  export type StrapiAppUpdateManyWithWhereWithoutTenantInput = {
    where: StrapiAppScalarWhereInput;
    data: XOR<
      StrapiAppUpdateManyMutationInput,
      StrapiAppUncheckedUpdateManyWithoutStrapiAppsInput
    >;
  };

  export type StrapiAppScalarWhereInput = {
    AND?: Enumerable<StrapiAppScalarWhereInput>;
    OR?: Enumerable<StrapiAppScalarWhereInput>;
    NOT?: Enumerable<StrapiAppScalarWhereInput>;
    id?: StringFilter | string;
    name?: StringFilter | string;
    tenantId?: StringFilter | string;
  };

  export type ProductDataFeedIntegrationUpsertWithWhereUniqueWithoutTenantInput =
    {
      where: ProductDataFeedIntegrationWhereUniqueInput;
      update: XOR<
        ProductDataFeedIntegrationUpdateWithoutTenantInput,
        ProductDataFeedIntegrationUncheckedUpdateWithoutTenantInput
      >;
      create: XOR<
        ProductDataFeedIntegrationCreateWithoutTenantInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutTenantInput
      >;
    };

  export type ProductDataFeedIntegrationUpdateWithWhereUniqueWithoutTenantInput =
    {
      where: ProductDataFeedIntegrationWhereUniqueInput;
      data: XOR<
        ProductDataFeedIntegrationUpdateWithoutTenantInput,
        ProductDataFeedIntegrationUncheckedUpdateWithoutTenantInput
      >;
    };

  export type ProductDataFeedIntegrationUpdateManyWithWhereWithoutTenantInput =
    {
      where: ProductDataFeedIntegrationScalarWhereInput;
      data: XOR<
        ProductDataFeedIntegrationUpdateManyMutationInput,
        ProductDataFeedIntegrationUncheckedUpdateManyWithoutProductDataFeedIntegrationInput
      >;
    };

  export type StrapiToZohoIntegrationUpsertWithWhereUniqueWithoutTenantInput = {
    where: StrapiToZohoIntegrationWhereUniqueInput;
    update: XOR<
      StrapiToZohoIntegrationUpdateWithoutTenantInput,
      StrapiToZohoIntegrationUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      StrapiToZohoIntegrationCreateWithoutTenantInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutTenantInput
    >;
  };

  export type StrapiToZohoIntegrationUpdateWithWhereUniqueWithoutTenantInput = {
    where: StrapiToZohoIntegrationWhereUniqueInput;
    data: XOR<
      StrapiToZohoIntegrationUpdateWithoutTenantInput,
      StrapiToZohoIntegrationUncheckedUpdateWithoutTenantInput
    >;
  };

  export type StrapiToZohoIntegrationUpdateManyWithWhereWithoutTenantInput = {
    where: StrapiToZohoIntegrationScalarWhereInput;
    data: XOR<
      StrapiToZohoIntegrationUpdateManyMutationInput,
      StrapiToZohoIntegrationUncheckedUpdateManyWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type LogisticsIntegrationUpsertWithWhereUniqueWithoutTenantInput = {
    where: LogisticsIntegrationWhereUniqueInput;
    update: XOR<
      LogisticsIntegrationUpdateWithoutTenantInput,
      LogisticsIntegrationUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      LogisticsIntegrationCreateWithoutTenantInput,
      LogisticsIntegrationUncheckedCreateWithoutTenantInput
    >;
  };

  export type LogisticsIntegrationUpdateWithWhereUniqueWithoutTenantInput = {
    where: LogisticsIntegrationWhereUniqueInput;
    data: XOR<
      LogisticsIntegrationUpdateWithoutTenantInput,
      LogisticsIntegrationUncheckedUpdateWithoutTenantInput
    >;
  };

  export type LogisticsIntegrationUpdateManyWithWhereWithoutTenantInput = {
    where: LogisticsIntegrationScalarWhereInput;
    data: XOR<
      LogisticsIntegrationUpdateManyMutationInput,
      LogisticsIntegrationUncheckedUpdateManyWithoutLogisticsIntegrationInput
    >;
  };

  export type LogisticsAppUpsertWithWhereUniqueWithoutTenantInput = {
    where: LogisticsAppWhereUniqueInput;
    update: XOR<
      LogisticsAppUpdateWithoutTenantInput,
      LogisticsAppUncheckedUpdateWithoutTenantInput
    >;
    create: XOR<
      LogisticsAppCreateWithoutTenantInput,
      LogisticsAppUncheckedCreateWithoutTenantInput
    >;
  };

  export type LogisticsAppUpdateWithWhereUniqueWithoutTenantInput = {
    where: LogisticsAppWhereUniqueInput;
    data: XOR<
      LogisticsAppUpdateWithoutTenantInput,
      LogisticsAppUncheckedUpdateWithoutTenantInput
    >;
  };

  export type LogisticsAppUpdateManyWithWhereWithoutTenantInput = {
    where: LogisticsAppScalarWhereInput;
    data: XOR<
      LogisticsAppUpdateManyMutationInput,
      LogisticsAppUncheckedUpdateManyWithoutLogisticsAppInput
    >;
  };

  export type LogisticsAppScalarWhereInput = {
    AND?: Enumerable<LogisticsAppScalarWhereInput>;
    OR?: Enumerable<LogisticsAppScalarWhereInput>;
    NOT?: Enumerable<LogisticsAppScalarWhereInput>;
    id?: StringFilter | string;
    currentOrdersCustomViewId?: StringFilter | string;
    nextFiveDaysOrdersCustomViewId?: StringFilter | string;
    currentBulkOrdersCustomViewId?: StringFilter | string;
    nextFiveDaysBulkOrdersCustomViewId?: StringFilter | string;
    tenantId?: StringFilter | string;
  };

  export type TenantCreateWithoutSubscriptionsInput = {
    id: string;
    name: string;
    saleorApps?: SaleorAppCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutSubscriptionsInput = {
    id: string;
    name: string;
    saleorApps?: SaleorAppUncheckedCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutSubscriptionsInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutSubscriptionsInput,
      TenantUncheckedCreateWithoutSubscriptionsInput
    >;
  };

  export type ProductDataFeedIntegrationCreateWithoutSubscriptionInput = {
    id: string;
    enabled?: boolean;
    tenant: TenantCreateNestedOneWithoutProductDataFeedIntegrationInput;
    productDataFeedApp: ProductDataFeedAppCreateNestedOneWithoutIntegrationInput;
    saleorApp: SaleorAppCreateNestedOneWithoutProductDataFeedIntegrationInput;
  };

  export type ProductDataFeedIntegrationUncheckedCreateWithoutSubscriptionInput =
    {
      id: string;
      enabled?: boolean;
      tenantId: string;
      productDataFeedAppId: string;
      saleorAppId: string;
    };

  export type ProductDataFeedIntegrationCreateOrConnectWithoutSubscriptionInput =
    {
      where: ProductDataFeedIntegrationWhereUniqueInput;
      create: XOR<
        ProductDataFeedIntegrationCreateWithoutSubscriptionInput,
        ProductDataFeedIntegrationUncheckedCreateWithoutSubscriptionInput
      >;
    };

  export type StrapiToZohoIntegrationCreateWithoutSubscriptionInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    tenant: TenantCreateNestedOneWithoutStrapiToZohoIntegrationInput;
    strapiApp: StrapiAppCreateNestedOneWithoutIntegrationInput;
    zohoApp: ZohoAppCreateNestedOneWithoutStrapiToZohoIntegrationInput;
  };

  export type StrapiToZohoIntegrationUncheckedCreateWithoutSubscriptionInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    tenantId: string;
    strapiAppId: string;
    zohoAppId: string;
  };

  export type StrapiToZohoIntegrationCreateOrConnectWithoutSubscriptionInput = {
    where: StrapiToZohoIntegrationWhereUniqueInput;
    create: XOR<
      StrapiToZohoIntegrationCreateWithoutSubscriptionInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
  };

  export type LogisticsIntegrationCreateWithoutSubscriptionInput = {
    id: string;
    enabled?: boolean;
    tenant: TenantCreateNestedOneWithoutLogisticsIntegrationInput;
    zohoApp: ZohoAppCreateNestedOneWithoutLogisticsIntegrationInput;
    logisticsApp: LogisticsAppCreateNestedOneWithoutIntegrationInput;
  };

  export type LogisticsIntegrationUncheckedCreateWithoutSubscriptionInput = {
    id: string;
    enabled?: boolean;
    tenantId: string;
    zohoAppId: string;
    logisticsAppId: string;
  };

  export type LogisticsIntegrationCreateOrConnectWithoutSubscriptionInput = {
    where: LogisticsIntegrationWhereUniqueInput;
    create: XOR<
      LogisticsIntegrationCreateWithoutSubscriptionInput,
      LogisticsIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
  };

  export type TenantUpsertWithoutSubscriptionsInput = {
    update: XOR<
      TenantUpdateWithoutSubscriptionsInput,
      TenantUncheckedUpdateWithoutSubscriptionsInput
    >;
    create: XOR<
      TenantCreateWithoutSubscriptionsInput,
      TenantUncheckedCreateWithoutSubscriptionsInput
    >;
  };

  export type TenantUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    saleorApps?: SaleorAppUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    saleorApps?: SaleorAppUncheckedUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedUpdateManyWithoutTenantInput;
  };

  export type ProductDataFeedIntegrationUpsertWithoutSubscriptionInput = {
    update: XOR<
      ProductDataFeedIntegrationUpdateWithoutSubscriptionInput,
      ProductDataFeedIntegrationUncheckedUpdateWithoutSubscriptionInput
    >;
    create: XOR<
      ProductDataFeedIntegrationCreateWithoutSubscriptionInput,
      ProductDataFeedIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
  };

  export type ProductDataFeedIntegrationUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    tenant?: TenantUpdateOneRequiredWithoutProductDataFeedIntegrationInput;
    productDataFeedApp?: ProductDataFeedAppUpdateOneRequiredWithoutIntegrationInput;
    saleorApp?: SaleorAppUpdateOneRequiredWithoutProductDataFeedIntegrationInput;
  };

  export type ProductDataFeedIntegrationUncheckedUpdateWithoutSubscriptionInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      enabled?: BoolFieldUpdateOperationsInput | boolean;
      tenantId?: StringFieldUpdateOperationsInput | string;
      productDataFeedAppId?: StringFieldUpdateOperationsInput | string;
      saleorAppId?: StringFieldUpdateOperationsInput | string;
    };

  export type StrapiToZohoIntegrationUpsertWithoutSubscriptionInput = {
    update: XOR<
      StrapiToZohoIntegrationUpdateWithoutSubscriptionInput,
      StrapiToZohoIntegrationUncheckedUpdateWithoutSubscriptionInput
    >;
    create: XOR<
      StrapiToZohoIntegrationCreateWithoutSubscriptionInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
  };

  export type StrapiToZohoIntegrationUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    tenant?: TenantUpdateOneRequiredWithoutStrapiToZohoIntegrationInput;
    strapiApp?: StrapiAppUpdateOneRequiredWithoutIntegrationInput;
    zohoApp?: ZohoAppUpdateOneRequiredWithoutStrapiToZohoIntegrationInput;
  };

  export type StrapiToZohoIntegrationUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    strapiAppId?: StringFieldUpdateOperationsInput | string;
    zohoAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type LogisticsIntegrationUpsertWithoutSubscriptionInput = {
    update: XOR<
      LogisticsIntegrationUpdateWithoutSubscriptionInput,
      LogisticsIntegrationUncheckedUpdateWithoutSubscriptionInput
    >;
    create: XOR<
      LogisticsIntegrationCreateWithoutSubscriptionInput,
      LogisticsIntegrationUncheckedCreateWithoutSubscriptionInput
    >;
  };

  export type LogisticsIntegrationUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    tenant?: TenantUpdateOneRequiredWithoutLogisticsIntegrationInput;
    zohoApp?: ZohoAppUpdateOneRequiredWithoutLogisticsIntegrationInput;
    logisticsApp?: LogisticsAppUpdateOneRequiredWithoutIntegrationInput;
  };

  export type LogisticsIntegrationUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    tenantId?: StringFieldUpdateOperationsInput | string;
    zohoAppId?: StringFieldUpdateOperationsInput | string;
    logisticsAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type SubscriptionCreateWithoutProductDataFeedIntegrationInput = {
    id: string;
    payedUntil?: Date | string | null;
    tenant: TenantCreateNestedOneWithoutSubscriptionsInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedCreateWithoutProductDataFeedIntegrationInput =
    {
      id: string;
      tenantId: string;
      payedUntil?: Date | string | null;
      strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
      logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
    };

  export type SubscriptionCreateOrConnectWithoutProductDataFeedIntegrationInput =
    {
      where: SubscriptionWhereUniqueInput;
      create: XOR<
        SubscriptionCreateWithoutProductDataFeedIntegrationInput,
        SubscriptionUncheckedCreateWithoutProductDataFeedIntegrationInput
      >;
    };

  export type TenantCreateWithoutProductDataFeedIntegrationInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutProductDataFeedIntegrationInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutProductDataFeedIntegrationInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutProductDataFeedIntegrationInput,
      TenantUncheckedCreateWithoutProductDataFeedIntegrationInput
    >;
  };

  export type ProductDataFeedAppCreateWithoutIntegrationInput = {
    id: string;
    productDetailStorefrontURL: string;
    saleorApp: SaleorAppCreateNestedOneWithoutProductDataFeedAppInput;
    tenant: TenantCreateNestedOneWithoutProductdatafeedAppsInput;
    webhooks?: IncomingProductDataFeedWebhookCreateNestedManyWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedCreateWithoutIntegrationInput = {
    id: string;
    productDetailStorefrontURL: string;
    saleorAppId: string;
    tenantId: string;
    webhooks?: IncomingProductDataFeedWebhookUncheckedCreateNestedManyWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppCreateOrConnectWithoutIntegrationInput = {
    where: ProductDataFeedAppWhereUniqueInput;
    create: XOR<
      ProductDataFeedAppCreateWithoutIntegrationInput,
      ProductDataFeedAppUncheckedCreateWithoutIntegrationInput
    >;
  };

  export type SaleorAppCreateWithoutProductDataFeedIntegrationInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    installedSaleorApp?: InstalledSaleorAppCreateNestedOneWithoutSaleorAppInput;
    tenant: TenantCreateNestedOneWithoutSaleorAppsInput;
    ProductDataFeedApp?: ProductDataFeedAppCreateNestedManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedCreateWithoutProductDataFeedIntegrationInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
    tenantId: string;
    installedSaleorApp?: InstalledSaleorAppUncheckedCreateNestedOneWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUncheckedCreateNestedManyWithoutSaleorAppInput;
  };

  export type SaleorAppCreateOrConnectWithoutProductDataFeedIntegrationInput = {
    where: SaleorAppWhereUniqueInput;
    create: XOR<
      SaleorAppCreateWithoutProductDataFeedIntegrationInput,
      SaleorAppUncheckedCreateWithoutProductDataFeedIntegrationInput
    >;
  };

  export type SubscriptionUpsertWithoutProductDataFeedIntegrationInput = {
    update: XOR<
      SubscriptionUpdateWithoutProductDataFeedIntegrationInput,
      SubscriptionUncheckedUpdateWithoutProductDataFeedIntegrationInput
    >;
    create: XOR<
      SubscriptionCreateWithoutProductDataFeedIntegrationInput,
      SubscriptionUncheckedCreateWithoutProductDataFeedIntegrationInput
    >;
  };

  export type SubscriptionUpdateWithoutProductDataFeedIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionsInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationUpdateOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedUpdateWithoutProductDataFeedIntegrationInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      tenantId?: StringFieldUpdateOperationsInput | string;
      payedUntil?:
        | NullableDateTimeFieldUpdateOperationsInput
        | Date
        | string
        | null;
      strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
      logisticsIntegration?: LogisticsIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
    };

  export type TenantUpsertWithoutProductDataFeedIntegrationInput = {
    update: XOR<
      TenantUpdateWithoutProductDataFeedIntegrationInput,
      TenantUncheckedUpdateWithoutProductDataFeedIntegrationInput
    >;
    create: XOR<
      TenantCreateWithoutProductDataFeedIntegrationInput,
      TenantUncheckedCreateWithoutProductDataFeedIntegrationInput
    >;
  };

  export type TenantUpdateWithoutProductDataFeedIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutProductDataFeedIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedUpdateManyWithoutTenantInput;
  };

  export type ProductDataFeedAppUpsertWithoutIntegrationInput = {
    update: XOR<
      ProductDataFeedAppUpdateWithoutIntegrationInput,
      ProductDataFeedAppUncheckedUpdateWithoutIntegrationInput
    >;
    create: XOR<
      ProductDataFeedAppCreateWithoutIntegrationInput,
      ProductDataFeedAppUncheckedCreateWithoutIntegrationInput
    >;
  };

  export type ProductDataFeedAppUpdateWithoutIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    saleorApp?: SaleorAppUpdateOneRequiredWithoutProductDataFeedAppInput;
    tenant?: TenantUpdateOneRequiredWithoutProductdatafeedAppsInput;
    webhooks?: IncomingProductDataFeedWebhookUpdateManyWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedUpdateWithoutIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingProductDataFeedWebhookUncheckedUpdateManyWithoutProductDataFeedAppInput;
  };

  export type SaleorAppUpsertWithoutProductDataFeedIntegrationInput = {
    update: XOR<
      SaleorAppUpdateWithoutProductDataFeedIntegrationInput,
      SaleorAppUncheckedUpdateWithoutProductDataFeedIntegrationInput
    >;
    create: XOR<
      SaleorAppCreateWithoutProductDataFeedIntegrationInput,
      SaleorAppUncheckedCreateWithoutProductDataFeedIntegrationInput
    >;
  };

  export type SaleorAppUpdateWithoutProductDataFeedIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    installedSaleorApp?: InstalledSaleorAppUpdateOneWithoutSaleorAppInput;
    tenant?: TenantUpdateOneRequiredWithoutSaleorAppsInput;
    ProductDataFeedApp?: ProductDataFeedAppUpdateManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedUpdateWithoutProductDataFeedIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    installedSaleorApp?: InstalledSaleorAppUncheckedUpdateOneWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUncheckedUpdateManyWithoutSaleorAppInput;
  };

  export type SubscriptionCreateWithoutLogisticsIntegrationInput = {
    id: string;
    payedUntil?: Date | string | null;
    tenant: TenantCreateNestedOneWithoutSubscriptionsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedCreateWithoutLogisticsIntegrationInput = {
    id: string;
    tenantId: string;
    payedUntil?: Date | string | null;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
  };

  export type SubscriptionCreateOrConnectWithoutLogisticsIntegrationInput = {
    where: SubscriptionWhereUniqueInput;
    create: XOR<
      SubscriptionCreateWithoutLogisticsIntegrationInput,
      SubscriptionUncheckedCreateWithoutLogisticsIntegrationInput
    >;
  };

  export type TenantCreateWithoutLogisticsIntegrationInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutLogisticsIntegrationInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutLogisticsIntegrationInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutLogisticsIntegrationInput,
      TenantUncheckedCreateWithoutLogisticsIntegrationInput
    >;
  };

  export type ZohoAppCreateWithoutLogisticsIntegrationInput = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    tenant: TenantCreateNestedOneWithoutZohoAppsInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutZohoAppInput;
  };

  export type ZohoAppUncheckedCreateWithoutLogisticsIntegrationInput = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    tenantId: string;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutZohoAppInput;
  };

  export type ZohoAppCreateOrConnectWithoutLogisticsIntegrationInput = {
    where: ZohoAppWhereUniqueInput;
    create: XOR<
      ZohoAppCreateWithoutLogisticsIntegrationInput,
      ZohoAppUncheckedCreateWithoutLogisticsIntegrationInput
    >;
  };

  export type LogisticsAppCreateWithoutIntegrationInput = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
    tenant: TenantCreateNestedOneWithoutLogisticsAppInput;
    webhooks?: IncomingLogisticsWebhookCreateNestedManyWithoutLogisticsAppInput;
  };

  export type LogisticsAppUncheckedCreateWithoutIntegrationInput = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
    tenantId: string;
    webhooks?: IncomingLogisticsWebhookUncheckedCreateNestedManyWithoutLogisticsAppInput;
  };

  export type LogisticsAppCreateOrConnectWithoutIntegrationInput = {
    where: LogisticsAppWhereUniqueInput;
    create: XOR<
      LogisticsAppCreateWithoutIntegrationInput,
      LogisticsAppUncheckedCreateWithoutIntegrationInput
    >;
  };

  export type SubscriptionUpsertWithoutLogisticsIntegrationInput = {
    update: XOR<
      SubscriptionUpdateWithoutLogisticsIntegrationInput,
      SubscriptionUncheckedUpdateWithoutLogisticsIntegrationInput
    >;
    create: XOR<
      SubscriptionCreateWithoutLogisticsIntegrationInput,
      SubscriptionUncheckedCreateWithoutLogisticsIntegrationInput
    >;
  };

  export type SubscriptionUpdateWithoutLogisticsIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedUpdateWithoutLogisticsIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
  };

  export type TenantUpsertWithoutLogisticsIntegrationInput = {
    update: XOR<
      TenantUpdateWithoutLogisticsIntegrationInput,
      TenantUncheckedUpdateWithoutLogisticsIntegrationInput
    >;
    create: XOR<
      TenantCreateWithoutLogisticsIntegrationInput,
      TenantUncheckedCreateWithoutLogisticsIntegrationInput
    >;
  };

  export type TenantUpdateWithoutLogisticsIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutLogisticsIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedUpdateManyWithoutTenantInput;
  };

  export type ZohoAppUpsertWithoutLogisticsIntegrationInput = {
    update: XOR<
      ZohoAppUpdateWithoutLogisticsIntegrationInput,
      ZohoAppUncheckedUpdateWithoutLogisticsIntegrationInput
    >;
    create: XOR<
      ZohoAppCreateWithoutLogisticsIntegrationInput,
      ZohoAppUncheckedCreateWithoutLogisticsIntegrationInput
    >;
  };

  export type ZohoAppUpdateWithoutLogisticsIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
    tenant?: TenantUpdateOneRequiredWithoutZohoAppsInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutZohoAppInput;
  };

  export type ZohoAppUncheckedUpdateWithoutLogisticsIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutZohoAppInput;
  };

  export type LogisticsAppUpsertWithoutIntegrationInput = {
    update: XOR<
      LogisticsAppUpdateWithoutIntegrationInput,
      LogisticsAppUncheckedUpdateWithoutIntegrationInput
    >;
    create: XOR<
      LogisticsAppCreateWithoutIntegrationInput,
      LogisticsAppUncheckedCreateWithoutIntegrationInput
    >;
  };

  export type LogisticsAppUpdateWithoutIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
    tenant?: TenantUpdateOneRequiredWithoutLogisticsAppInput;
    webhooks?: IncomingLogisticsWebhookUpdateManyWithoutLogisticsAppInput;
  };

  export type LogisticsAppUncheckedUpdateWithoutIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingLogisticsWebhookUncheckedUpdateManyWithoutLogisticsAppInput;
  };

  export type SubscriptionCreateWithoutStrapiToZohoIntegrationInput = {
    id: string;
    payedUntil?: Date | string | null;
    tenant: TenantCreateNestedOneWithoutSubscriptionsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedCreateWithoutStrapiToZohoIntegrationInput = {
    id: string;
    tenantId: string;
    payedUntil?: Date | string | null;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedOneWithoutSubscriptionInput;
  };

  export type SubscriptionCreateOrConnectWithoutStrapiToZohoIntegrationInput = {
    where: SubscriptionWhereUniqueInput;
    create: XOR<
      SubscriptionCreateWithoutStrapiToZohoIntegrationInput,
      SubscriptionUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type TenantCreateWithoutStrapiToZohoIntegrationInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutStrapiToZohoIntegrationInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedCreateNestedManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutStrapiToZohoIntegrationInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutStrapiToZohoIntegrationInput,
      TenantUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type StrapiAppCreateWithoutIntegrationInput = {
    id: string;
    name: string;
    webhooks?: IncomingStrapiWebhookCreateNestedManyWithoutStrapiAppInput;
    tenant: TenantCreateNestedOneWithoutStrapiAppsInput;
  };

  export type StrapiAppUncheckedCreateWithoutIntegrationInput = {
    id: string;
    name: string;
    tenantId: string;
    webhooks?: IncomingStrapiWebhookUncheckedCreateNestedManyWithoutStrapiAppInput;
  };

  export type StrapiAppCreateOrConnectWithoutIntegrationInput = {
    where: StrapiAppWhereUniqueInput;
    create: XOR<
      StrapiAppCreateWithoutIntegrationInput,
      StrapiAppUncheckedCreateWithoutIntegrationInput
    >;
  };

  export type ZohoAppCreateWithoutStrapiToZohoIntegrationInput = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    tenant: TenantCreateNestedOneWithoutZohoAppsInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutZohoAppInput;
  };

  export type ZohoAppUncheckedCreateWithoutStrapiToZohoIntegrationInput = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    tenantId: string;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutZohoAppInput;
  };

  export type ZohoAppCreateOrConnectWithoutStrapiToZohoIntegrationInput = {
    where: ZohoAppWhereUniqueInput;
    create: XOR<
      ZohoAppCreateWithoutStrapiToZohoIntegrationInput,
      ZohoAppUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type SubscriptionUpsertWithoutStrapiToZohoIntegrationInput = {
    update: XOR<
      SubscriptionUpdateWithoutStrapiToZohoIntegrationInput,
      SubscriptionUncheckedUpdateWithoutStrapiToZohoIntegrationInput
    >;
    create: XOR<
      SubscriptionCreateWithoutStrapiToZohoIntegrationInput,
      SubscriptionUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type SubscriptionUpdateWithoutStrapiToZohoIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionsInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationUpdateOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedUpdateWithoutStrapiToZohoIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
  };

  export type TenantUpsertWithoutStrapiToZohoIntegrationInput = {
    update: XOR<
      TenantUpdateWithoutStrapiToZohoIntegrationInput,
      TenantUncheckedUpdateWithoutStrapiToZohoIntegrationInput
    >;
    create: XOR<
      TenantCreateWithoutStrapiToZohoIntegrationInput,
      TenantUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type TenantUpdateWithoutStrapiToZohoIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutStrapiToZohoIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedUpdateManyWithoutTenantInput;
    strapiApps?: StrapiAppUncheckedUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedUpdateManyWithoutTenantInput;
  };

  export type StrapiAppUpsertWithoutIntegrationInput = {
    update: XOR<
      StrapiAppUpdateWithoutIntegrationInput,
      StrapiAppUncheckedUpdateWithoutIntegrationInput
    >;
    create: XOR<
      StrapiAppCreateWithoutIntegrationInput,
      StrapiAppUncheckedCreateWithoutIntegrationInput
    >;
  };

  export type StrapiAppUpdateWithoutIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingStrapiWebhookUpdateManyWithoutStrapiAppInput;
    tenant?: TenantUpdateOneRequiredWithoutStrapiAppsInput;
  };

  export type StrapiAppUncheckedUpdateWithoutIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingStrapiWebhookUncheckedUpdateManyWithoutStrapiAppInput;
  };

  export type ZohoAppUpsertWithoutStrapiToZohoIntegrationInput = {
    update: XOR<
      ZohoAppUpdateWithoutStrapiToZohoIntegrationInput,
      ZohoAppUncheckedUpdateWithoutStrapiToZohoIntegrationInput
    >;
    create: XOR<
      ZohoAppCreateWithoutStrapiToZohoIntegrationInput,
      ZohoAppUncheckedCreateWithoutStrapiToZohoIntegrationInput
    >;
  };

  export type ZohoAppUpdateWithoutStrapiToZohoIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
    tenant?: TenantUpdateOneRequiredWithoutZohoAppsInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutZohoAppInput;
  };

  export type ZohoAppUncheckedUpdateWithoutStrapiToZohoIntegrationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutZohoAppInput;
  };

  export type IncomingStrapiWebhookCreateWithoutStrapiAppInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secret: SecretKeyCreateNestedOneWithoutIncomingStrapiWebhookInput;
  };

  export type IncomingStrapiWebhookUncheckedCreateWithoutStrapiAppInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secretId: string;
  };

  export type IncomingStrapiWebhookCreateOrConnectWithoutStrapiAppInput = {
    where: IncomingStrapiWebhookWhereUniqueInput;
    create: XOR<
      IncomingStrapiWebhookCreateWithoutStrapiAppInput,
      IncomingStrapiWebhookUncheckedCreateWithoutStrapiAppInput
    >;
  };

  export type IncomingStrapiWebhookCreateManyStrapiAppInputEnvelope = {
    data: Enumerable<IncomingStrapiWebhookCreateManyStrapiAppInput>;
    skipDuplicates?: boolean;
  };

  export type TenantCreateWithoutStrapiAppsInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppCreateNestedManyWithoutTenantInput;
  };

  export type TenantUncheckedCreateWithoutStrapiAppsInput = {
    id: string;
    name: string;
    Subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedCreateNestedManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedCreateNestedManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedCreateNestedManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedCreateNestedManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedCreateNestedManyWithoutTenantInput;
  };

  export type TenantCreateOrConnectWithoutStrapiAppsInput = {
    where: TenantWhereUniqueInput;
    create: XOR<
      TenantCreateWithoutStrapiAppsInput,
      TenantUncheckedCreateWithoutStrapiAppsInput
    >;
  };

  export type StrapiToZohoIntegrationCreateWithoutStrapiAppInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscription?: SubscriptionCreateNestedOneWithoutStrapiToZohoIntegrationInput;
    tenant: TenantCreateNestedOneWithoutStrapiToZohoIntegrationInput;
    zohoApp: ZohoAppCreateNestedOneWithoutStrapiToZohoIntegrationInput;
  };

  export type StrapiToZohoIntegrationUncheckedCreateWithoutStrapiAppInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscriptionId?: string | null;
    tenantId: string;
    zohoAppId: string;
  };

  export type StrapiToZohoIntegrationCreateOrConnectWithoutStrapiAppInput = {
    where: StrapiToZohoIntegrationWhereUniqueInput;
    create: XOR<
      StrapiToZohoIntegrationCreateWithoutStrapiAppInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutStrapiAppInput
    >;
  };

  export type IncomingStrapiWebhookUpsertWithWhereUniqueWithoutStrapiAppInput =
    {
      where: IncomingStrapiWebhookWhereUniqueInput;
      update: XOR<
        IncomingStrapiWebhookUpdateWithoutStrapiAppInput,
        IncomingStrapiWebhookUncheckedUpdateWithoutStrapiAppInput
      >;
      create: XOR<
        IncomingStrapiWebhookCreateWithoutStrapiAppInput,
        IncomingStrapiWebhookUncheckedCreateWithoutStrapiAppInput
      >;
    };

  export type IncomingStrapiWebhookUpdateWithWhereUniqueWithoutStrapiAppInput =
    {
      where: IncomingStrapiWebhookWhereUniqueInput;
      data: XOR<
        IncomingStrapiWebhookUpdateWithoutStrapiAppInput,
        IncomingStrapiWebhookUncheckedUpdateWithoutStrapiAppInput
      >;
    };

  export type IncomingStrapiWebhookUpdateManyWithWhereWithoutStrapiAppInput = {
    where: IncomingStrapiWebhookScalarWhereInput;
    data: XOR<
      IncomingStrapiWebhookUpdateManyMutationInput,
      IncomingStrapiWebhookUncheckedUpdateManyWithoutWebhooksInput
    >;
  };

  export type IncomingStrapiWebhookScalarWhereInput = {
    AND?: Enumerable<IncomingStrapiWebhookScalarWhereInput>;
    OR?: Enumerable<IncomingStrapiWebhookScalarWhereInput>;
    NOT?: Enumerable<IncomingStrapiWebhookScalarWhereInput>;
    id?: StringFilter | string;
    name?: StringNullableFilter | string | null;
    createdAt?: DateTimeFilter | Date | string;
    updatedAt?: DateTimeFilter | Date | string;
    secretId?: StringFilter | string;
    strapiAppId?: StringFilter | string;
  };

  export type TenantUpsertWithoutStrapiAppsInput = {
    update: XOR<
      TenantUpdateWithoutStrapiAppsInput,
      TenantUncheckedUpdateWithoutStrapiAppsInput
    >;
    create: XOR<
      TenantCreateWithoutStrapiAppsInput,
      TenantUncheckedCreateWithoutStrapiAppsInput
    >;
  };

  export type TenantUpdateWithoutStrapiAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUpdateManyWithoutTenantInput;
  };

  export type TenantUncheckedUpdateWithoutStrapiAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    Subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantInput;
    saleorApps?: SaleorAppUncheckedUpdateManyWithoutTenantInput;
    zohoApps?: ZohoAppUncheckedUpdateManyWithoutTenantInput;
    productdatafeedApps?: ProductDataFeedAppUncheckedUpdateManyWithoutTenantInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutTenantInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutTenantInput;
    logisticsApp?: LogisticsAppUncheckedUpdateManyWithoutTenantInput;
  };

  export type StrapiToZohoIntegrationUpsertWithoutStrapiAppInput = {
    update: XOR<
      StrapiToZohoIntegrationUpdateWithoutStrapiAppInput,
      StrapiToZohoIntegrationUncheckedUpdateWithoutStrapiAppInput
    >;
    create: XOR<
      StrapiToZohoIntegrationCreateWithoutStrapiAppInput,
      StrapiToZohoIntegrationUncheckedCreateWithoutStrapiAppInput
    >;
  };

  export type StrapiToZohoIntegrationUpdateWithoutStrapiAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    subscription?: SubscriptionUpdateOneWithoutStrapiToZohoIntegrationInput;
    tenant?: TenantUpdateOneRequiredWithoutStrapiToZohoIntegrationInput;
    zohoApp?: ZohoAppUpdateOneRequiredWithoutStrapiToZohoIntegrationInput;
  };

  export type StrapiToZohoIntegrationUncheckedUpdateWithoutStrapiAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    zohoAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type SecretKeyCreateWithoutIncomingSaleorWebhookInput = {
    id?: string;
    name?: string | null;
    secret: string;
    createdAt?: Date | string;
    IncomingStrapiWebhook?: IncomingStrapiWebhookCreateNestedOneWithoutSecretInput;
  };

  export type SecretKeyUncheckedCreateWithoutIncomingSaleorWebhookInput = {
    id?: string;
    name?: string | null;
    secret: string;
    createdAt?: Date | string;
    IncomingStrapiWebhook?: IncomingStrapiWebhookUncheckedCreateNestedOneWithoutSecretInput;
  };

  export type SecretKeyCreateOrConnectWithoutIncomingSaleorWebhookInput = {
    where: SecretKeyWhereUniqueInput;
    create: XOR<
      SecretKeyCreateWithoutIncomingSaleorWebhookInput,
      SecretKeyUncheckedCreateWithoutIncomingSaleorWebhookInput
    >;
  };

  export type InstalledSaleorAppCreateWithoutWebhooksInput = {
    id: string;
    token: string;
    saleorApp: SaleorAppCreateNestedOneWithoutInstalledSaleorAppInput;
  };

  export type InstalledSaleorAppUncheckedCreateWithoutWebhooksInput = {
    id: string;
    token: string;
    saleorAppId: string;
  };

  export type InstalledSaleorAppCreateOrConnectWithoutWebhooksInput = {
    where: InstalledSaleorAppWhereUniqueInput;
    create: XOR<
      InstalledSaleorAppCreateWithoutWebhooksInput,
      InstalledSaleorAppUncheckedCreateWithoutWebhooksInput
    >;
  };

  export type SecretKeyUpsertWithoutIncomingSaleorWebhookInput = {
    update: XOR<
      SecretKeyUpdateWithoutIncomingSaleorWebhookInput,
      SecretKeyUncheckedUpdateWithoutIncomingSaleorWebhookInput
    >;
    create: XOR<
      SecretKeyCreateWithoutIncomingSaleorWebhookInput,
      SecretKeyUncheckedCreateWithoutIncomingSaleorWebhookInput
    >;
  };

  export type SecretKeyUpdateWithoutIncomingSaleorWebhookInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    secret?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    IncomingStrapiWebhook?: IncomingStrapiWebhookUpdateOneWithoutSecretInput;
  };

  export type SecretKeyUncheckedUpdateWithoutIncomingSaleorWebhookInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    secret?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    IncomingStrapiWebhook?: IncomingStrapiWebhookUncheckedUpdateOneWithoutSecretInput;
  };

  export type InstalledSaleorAppUpsertWithoutWebhooksInput = {
    update: XOR<
      InstalledSaleorAppUpdateWithoutWebhooksInput,
      InstalledSaleorAppUncheckedUpdateWithoutWebhooksInput
    >;
    create: XOR<
      InstalledSaleorAppCreateWithoutWebhooksInput,
      InstalledSaleorAppUncheckedCreateWithoutWebhooksInput
    >;
  };

  export type InstalledSaleorAppUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    saleorApp?: SaleorAppUpdateOneRequiredWithoutInstalledSaleorAppInput;
  };

  export type InstalledSaleorAppUncheckedUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type SecretKeyCreateWithoutIncomingStrapiWebhookInput = {
    id?: string;
    name?: string | null;
    secret: string;
    createdAt?: Date | string;
    incomingSaleorWebhook?: IncomingSaleorWebhookCreateNestedOneWithoutSecretInput;
  };

  export type SecretKeyUncheckedCreateWithoutIncomingStrapiWebhookInput = {
    id?: string;
    name?: string | null;
    secret: string;
    createdAt?: Date | string;
    incomingSaleorWebhook?: IncomingSaleorWebhookUncheckedCreateNestedOneWithoutSecretInput;
  };

  export type SecretKeyCreateOrConnectWithoutIncomingStrapiWebhookInput = {
    where: SecretKeyWhereUniqueInput;
    create: XOR<
      SecretKeyCreateWithoutIncomingStrapiWebhookInput,
      SecretKeyUncheckedCreateWithoutIncomingStrapiWebhookInput
    >;
  };

  export type StrapiAppCreateWithoutWebhooksInput = {
    id: string;
    name: string;
    tenant: TenantCreateNestedOneWithoutStrapiAppsInput;
    integration?: StrapiToZohoIntegrationCreateNestedOneWithoutStrapiAppInput;
  };

  export type StrapiAppUncheckedCreateWithoutWebhooksInput = {
    id: string;
    name: string;
    tenantId: string;
    integration?: StrapiToZohoIntegrationUncheckedCreateNestedOneWithoutStrapiAppInput;
  };

  export type StrapiAppCreateOrConnectWithoutWebhooksInput = {
    where: StrapiAppWhereUniqueInput;
    create: XOR<
      StrapiAppCreateWithoutWebhooksInput,
      StrapiAppUncheckedCreateWithoutWebhooksInput
    >;
  };

  export type SecretKeyUpsertWithoutIncomingStrapiWebhookInput = {
    update: XOR<
      SecretKeyUpdateWithoutIncomingStrapiWebhookInput,
      SecretKeyUncheckedUpdateWithoutIncomingStrapiWebhookInput
    >;
    create: XOR<
      SecretKeyCreateWithoutIncomingStrapiWebhookInput,
      SecretKeyUncheckedCreateWithoutIncomingStrapiWebhookInput
    >;
  };

  export type SecretKeyUpdateWithoutIncomingStrapiWebhookInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    secret?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    incomingSaleorWebhook?: IncomingSaleorWebhookUpdateOneWithoutSecretInput;
  };

  export type SecretKeyUncheckedUpdateWithoutIncomingStrapiWebhookInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    secret?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    incomingSaleorWebhook?: IncomingSaleorWebhookUncheckedUpdateOneWithoutSecretInput;
  };

  export type StrapiAppUpsertWithoutWebhooksInput = {
    update: XOR<
      StrapiAppUpdateWithoutWebhooksInput,
      StrapiAppUncheckedUpdateWithoutWebhooksInput
    >;
    create: XOR<
      StrapiAppCreateWithoutWebhooksInput,
      StrapiAppUncheckedCreateWithoutWebhooksInput
    >;
  };

  export type StrapiAppUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    tenant?: TenantUpdateOneRequiredWithoutStrapiAppsInput;
    integration?: StrapiToZohoIntegrationUpdateOneWithoutStrapiAppInput;
  };

  export type StrapiAppUncheckedUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    integration?: StrapiToZohoIntegrationUncheckedUpdateOneWithoutStrapiAppInput;
  };

  export type ProductDataFeedAppCreateWithoutWebhooksInput = {
    id: string;
    productDetailStorefrontURL: string;
    saleorApp: SaleorAppCreateNestedOneWithoutProductDataFeedAppInput;
    tenant: TenantCreateNestedOneWithoutProductdatafeedAppsInput;
    integration?: ProductDataFeedIntegrationCreateNestedOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedCreateWithoutWebhooksInput = {
    id: string;
    productDetailStorefrontURL: string;
    saleorAppId: string;
    tenantId: string;
    integration?: ProductDataFeedIntegrationUncheckedCreateNestedOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppCreateOrConnectWithoutWebhooksInput = {
    where: ProductDataFeedAppWhereUniqueInput;
    create: XOR<
      ProductDataFeedAppCreateWithoutWebhooksInput,
      ProductDataFeedAppUncheckedCreateWithoutWebhooksInput
    >;
  };

  export type ProductDataFeedAppUpsertWithoutWebhooksInput = {
    update: XOR<
      ProductDataFeedAppUpdateWithoutWebhooksInput,
      ProductDataFeedAppUncheckedUpdateWithoutWebhooksInput
    >;
    create: XOR<
      ProductDataFeedAppCreateWithoutWebhooksInput,
      ProductDataFeedAppUncheckedCreateWithoutWebhooksInput
    >;
  };

  export type ProductDataFeedAppUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    saleorApp?: SaleorAppUpdateOneRequiredWithoutProductDataFeedAppInput;
    tenant?: TenantUpdateOneRequiredWithoutProductdatafeedAppsInput;
    integration?: ProductDataFeedIntegrationUpdateOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    integration?: ProductDataFeedIntegrationUncheckedUpdateOneWithoutProductDataFeedAppInput;
  };

  export type LogisticsAppCreateWithoutWebhooksInput = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
    tenant: TenantCreateNestedOneWithoutLogisticsAppInput;
    integration?: LogisticsIntegrationCreateNestedOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppUncheckedCreateWithoutWebhooksInput = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
    tenantId: string;
    integration?: LogisticsIntegrationUncheckedCreateNestedOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppCreateOrConnectWithoutWebhooksInput = {
    where: LogisticsAppWhereUniqueInput;
    create: XOR<
      LogisticsAppCreateWithoutWebhooksInput,
      LogisticsAppUncheckedCreateWithoutWebhooksInput
    >;
  };

  export type LogisticsAppUpsertWithoutWebhooksInput = {
    update: XOR<
      LogisticsAppUpdateWithoutWebhooksInput,
      LogisticsAppUncheckedUpdateWithoutWebhooksInput
    >;
    create: XOR<
      LogisticsAppCreateWithoutWebhooksInput,
      LogisticsAppUncheckedCreateWithoutWebhooksInput
    >;
  };

  export type LogisticsAppUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
    tenant?: TenantUpdateOneRequiredWithoutLogisticsAppInput;
    integration?: LogisticsIntegrationUpdateOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppUncheckedUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    integration?: LogisticsIntegrationUncheckedUpdateOneWithoutLogisticsAppInput;
  };

  export type IncomingSaleorWebhookCreateWithoutSecretInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    installedSaleorApp: InstalledSaleorAppCreateNestedOneWithoutWebhooksInput;
  };

  export type IncomingSaleorWebhookUncheckedCreateWithoutSecretInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    installedSaleorAppId: string;
  };

  export type IncomingSaleorWebhookCreateOrConnectWithoutSecretInput = {
    where: IncomingSaleorWebhookWhereUniqueInput;
    create: XOR<
      IncomingSaleorWebhookCreateWithoutSecretInput,
      IncomingSaleorWebhookUncheckedCreateWithoutSecretInput
    >;
  };

  export type IncomingStrapiWebhookCreateWithoutSecretInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    strapiApp: StrapiAppCreateNestedOneWithoutWebhooksInput;
  };

  export type IncomingStrapiWebhookUncheckedCreateWithoutSecretInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    strapiAppId: string;
  };

  export type IncomingStrapiWebhookCreateOrConnectWithoutSecretInput = {
    where: IncomingStrapiWebhookWhereUniqueInput;
    create: XOR<
      IncomingStrapiWebhookCreateWithoutSecretInput,
      IncomingStrapiWebhookUncheckedCreateWithoutSecretInput
    >;
  };

  export type IncomingSaleorWebhookUpsertWithoutSecretInput = {
    update: XOR<
      IncomingSaleorWebhookUpdateWithoutSecretInput,
      IncomingSaleorWebhookUncheckedUpdateWithoutSecretInput
    >;
    create: XOR<
      IncomingSaleorWebhookCreateWithoutSecretInput,
      IncomingSaleorWebhookUncheckedCreateWithoutSecretInput
    >;
  };

  export type IncomingSaleorWebhookUpdateWithoutSecretInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    installedSaleorApp?: InstalledSaleorAppUpdateOneRequiredWithoutWebhooksInput;
  };

  export type IncomingSaleorWebhookUncheckedUpdateWithoutSecretInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    installedSaleorAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingStrapiWebhookUpsertWithoutSecretInput = {
    update: XOR<
      IncomingStrapiWebhookUpdateWithoutSecretInput,
      IncomingStrapiWebhookUncheckedUpdateWithoutSecretInput
    >;
    create: XOR<
      IncomingStrapiWebhookCreateWithoutSecretInput,
      IncomingStrapiWebhookUncheckedCreateWithoutSecretInput
    >;
  };

  export type IncomingStrapiWebhookUpdateWithoutSecretInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    strapiApp?: StrapiAppUpdateOneRequiredWithoutWebhooksInput;
  };

  export type IncomingStrapiWebhookUncheckedUpdateWithoutSecretInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    strapiAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingProductDataFeedWebhookCreateManyProductDataFeedAppInput =
    {
      id: string;
      name?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
    };

  export type IncomingProductDataFeedWebhookUpdateWithoutProductDataFeedAppInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

  export type IncomingProductDataFeedWebhookUncheckedUpdateWithoutProductDataFeedAppInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

  export type IncomingProductDataFeedWebhookUncheckedUpdateManyWithoutWebhooksInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

  export type IncomingLogisticsWebhookCreateManyLogisticsAppInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type IncomingLogisticsWebhookUpdateWithoutLogisticsAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IncomingLogisticsWebhookUncheckedUpdateWithoutLogisticsAppInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

  export type IncomingLogisticsWebhookUncheckedUpdateManyWithoutWebhooksInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    };

  export type StrapiToZohoIntegrationCreateManyZohoAppInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscriptionId?: string | null;
    tenantId: string;
    strapiAppId: string;
  };

  export type LogisticsIntegrationCreateManyZohoAppInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    tenantId: string;
    logisticsAppId: string;
  };

  export type StrapiToZohoIntegrationUpdateWithoutZohoAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    subscription?: SubscriptionUpdateOneWithoutStrapiToZohoIntegrationInput;
    tenant?: TenantUpdateOneRequiredWithoutStrapiToZohoIntegrationInput;
    strapiApp?: StrapiAppUpdateOneRequiredWithoutIntegrationInput;
  };

  export type StrapiToZohoIntegrationUncheckedUpdateWithoutZohoAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    strapiAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type StrapiToZohoIntegrationUncheckedUpdateManyWithoutStrapiToZohoIntegrationInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      payedUntil?:
        | NullableDateTimeFieldUpdateOperationsInput
        | Date
        | string
        | null;
      enabled?: BoolFieldUpdateOperationsInput | boolean;
      strapiContentType?: StringFieldUpdateOperationsInput | string;
      subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
      tenantId?: StringFieldUpdateOperationsInput | string;
      strapiAppId?: StringFieldUpdateOperationsInput | string;
    };

  export type LogisticsIntegrationUpdateWithoutZohoAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscription?: SubscriptionUpdateOneWithoutLogisticsIntegrationInput;
    tenant?: TenantUpdateOneRequiredWithoutLogisticsIntegrationInput;
    logisticsApp?: LogisticsAppUpdateOneRequiredWithoutIntegrationInput;
  };

  export type LogisticsIntegrationUncheckedUpdateWithoutZohoAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    logisticsAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type LogisticsIntegrationUncheckedUpdateManyWithoutLogisticsIntegrationInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      enabled?: BoolFieldUpdateOperationsInput | boolean;
      subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
      tenantId?: StringFieldUpdateOperationsInput | string;
      logisticsAppId?: StringFieldUpdateOperationsInput | string;
    };

  export type ProductDataFeedIntegrationCreateManySaleorAppInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    tenantId: string;
    productDataFeedAppId: string;
  };

  export type ProductDataFeedAppCreateManySaleorAppInput = {
    id: string;
    productDetailStorefrontURL: string;
    tenantId: string;
  };

  export type ProductDataFeedIntegrationUpdateWithoutSaleorAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscription?: SubscriptionUpdateOneWithoutProductDataFeedIntegrationInput;
    tenant?: TenantUpdateOneRequiredWithoutProductDataFeedIntegrationInput;
    productDataFeedApp?: ProductDataFeedAppUpdateOneRequiredWithoutIntegrationInput;
  };

  export type ProductDataFeedIntegrationUncheckedUpdateWithoutSaleorAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    tenantId?: StringFieldUpdateOperationsInput | string;
    productDataFeedAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type ProductDataFeedIntegrationUncheckedUpdateManyWithoutProductDataFeedIntegrationInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      enabled?: BoolFieldUpdateOperationsInput | boolean;
      subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
      tenantId?: StringFieldUpdateOperationsInput | string;
      productDataFeedAppId?: StringFieldUpdateOperationsInput | string;
    };

  export type ProductDataFeedAppUpdateWithoutSaleorAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    tenant?: TenantUpdateOneRequiredWithoutProductdatafeedAppsInput;
    webhooks?: IncomingProductDataFeedWebhookUpdateManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationUpdateOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedUpdateWithoutSaleorAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    tenantId?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingProductDataFeedWebhookUncheckedUpdateManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationUncheckedUpdateOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedUpdateManyWithoutProductDataFeedAppInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
      tenantId?: StringFieldUpdateOperationsInput | string;
    };

  export type IncomingSaleorWebhookCreateManyInstalledSaleorAppInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secretId: string;
  };

  export type IncomingSaleorWebhookUpdateWithoutInstalledSaleorAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secret?: SecretKeyUpdateOneRequiredWithoutIncomingSaleorWebhookInput;
  };

  export type IncomingSaleorWebhookUncheckedUpdateWithoutInstalledSaleorAppInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      secretId?: StringFieldUpdateOperationsInput | string;
    };

  export type IncomingSaleorWebhookUncheckedUpdateManyWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secretId?: StringFieldUpdateOperationsInput | string;
  };

  export type SubscriptionCreateManyTenantInput = {
    id: string;
    payedUntil?: Date | string | null;
  };

  export type SaleorAppCreateManyTenantInput = {
    id: string;
    domain: string;
    name: string;
    channelSlug?: string | null;
  };

  export type ZohoAppCreateManyTenantInput = {
    id: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
  };

  export type ProductDataFeedAppCreateManyTenantInput = {
    id: string;
    productDetailStorefrontURL: string;
    saleorAppId: string;
  };

  export type StrapiAppCreateManyTenantInput = {
    id: string;
    name: string;
  };

  export type ProductDataFeedIntegrationCreateManyTenantInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    productDataFeedAppId: string;
    saleorAppId: string;
  };

  export type StrapiToZohoIntegrationCreateManyTenantInput = {
    id: string;
    payedUntil?: Date | string | null;
    enabled?: boolean;
    strapiContentType?: string;
    subscriptionId?: string | null;
    strapiAppId: string;
    zohoAppId: string;
  };

  export type LogisticsIntegrationCreateManyTenantInput = {
    id: string;
    enabled?: boolean;
    subscriptionId?: string | null;
    zohoAppId: string;
    logisticsAppId: string;
  };

  export type LogisticsAppCreateManyTenantInput = {
    id: string;
    currentOrdersCustomViewId: string;
    nextFiveDaysOrdersCustomViewId: string;
    currentBulkOrdersCustomViewId: string;
    nextFiveDaysBulkOrdersCustomViewId: string;
  };

  export type SubscriptionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationUpdateOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateOneWithoutSubscriptionInput;
  };

  export type SubscriptionUncheckedUpdateManyWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type SaleorAppUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    installedSaleorApp?: InstalledSaleorAppUpdateOneWithoutSaleorAppInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUpdateManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUpdateManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
    installedSaleorApp?: InstalledSaleorAppUncheckedUpdateOneWithoutSaleorAppInput;
    productDataFeedIntegration?: ProductDataFeedIntegrationUncheckedUpdateManyWithoutSaleorAppInput;
    ProductDataFeedApp?: ProductDataFeedAppUncheckedUpdateManyWithoutSaleorAppInput;
  };

  export type SaleorAppUncheckedUpdateManyWithoutSaleorAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    domain?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    channelSlug?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type ZohoAppUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUpdateManyWithoutZohoAppInput;
    logisticsIntegration?: LogisticsIntegrationUpdateManyWithoutZohoAppInput;
  };

  export type ZohoAppUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
    strapiToZohoIntegration?: StrapiToZohoIntegrationUncheckedUpdateManyWithoutZohoAppInput;
    logisticsIntegration?: LogisticsIntegrationUncheckedUpdateManyWithoutZohoAppInput;
  };

  export type ZohoAppUncheckedUpdateManyWithoutZohoAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orgId?: StringFieldUpdateOperationsInput | string;
    clientId?: StringFieldUpdateOperationsInput | string;
    clientSecret?: StringFieldUpdateOperationsInput | string;
  };

  export type ProductDataFeedAppUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    saleorApp?: SaleorAppUpdateOneRequiredWithoutProductDataFeedAppInput;
    webhooks?: IncomingProductDataFeedWebhookUpdateManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationUpdateOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingProductDataFeedWebhookUncheckedUpdateManyWithoutProductDataFeedAppInput;
    integration?: ProductDataFeedIntegrationUncheckedUpdateOneWithoutProductDataFeedAppInput;
  };

  export type ProductDataFeedAppUncheckedUpdateManyWithoutProductdatafeedAppsInput =
    {
      id?: StringFieldUpdateOperationsInput | string;
      productDetailStorefrontURL?: StringFieldUpdateOperationsInput | string;
      saleorAppId?: StringFieldUpdateOperationsInput | string;
    };

  export type StrapiAppUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingStrapiWebhookUpdateManyWithoutStrapiAppInput;
    integration?: StrapiToZohoIntegrationUpdateOneWithoutStrapiAppInput;
  };

  export type StrapiAppUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    webhooks?: IncomingStrapiWebhookUncheckedUpdateManyWithoutStrapiAppInput;
    integration?: StrapiToZohoIntegrationUncheckedUpdateOneWithoutStrapiAppInput;
  };

  export type StrapiAppUncheckedUpdateManyWithoutStrapiAppsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
  };

  export type ProductDataFeedIntegrationUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscription?: SubscriptionUpdateOneWithoutProductDataFeedIntegrationInput;
    productDataFeedApp?: ProductDataFeedAppUpdateOneRequiredWithoutIntegrationInput;
    saleorApp?: SaleorAppUpdateOneRequiredWithoutProductDataFeedIntegrationInput;
  };

  export type ProductDataFeedIntegrationUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    productDataFeedAppId?: StringFieldUpdateOperationsInput | string;
    saleorAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type StrapiToZohoIntegrationUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    subscription?: SubscriptionUpdateOneWithoutStrapiToZohoIntegrationInput;
    strapiApp?: StrapiAppUpdateOneRequiredWithoutIntegrationInput;
    zohoApp?: ZohoAppUpdateOneRequiredWithoutStrapiToZohoIntegrationInput;
  };

  export type StrapiToZohoIntegrationUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    payedUntil?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    strapiContentType?: StringFieldUpdateOperationsInput | string;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    strapiAppId?: StringFieldUpdateOperationsInput | string;
    zohoAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type LogisticsIntegrationUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscription?: SubscriptionUpdateOneWithoutLogisticsIntegrationInput;
    zohoApp?: ZohoAppUpdateOneRequiredWithoutLogisticsIntegrationInput;
    logisticsApp?: LogisticsAppUpdateOneRequiredWithoutIntegrationInput;
  };

  export type LogisticsIntegrationUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    enabled?: BoolFieldUpdateOperationsInput | boolean;
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null;
    zohoAppId?: StringFieldUpdateOperationsInput | string;
    logisticsAppId?: StringFieldUpdateOperationsInput | string;
  };

  export type LogisticsAppUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
    webhooks?: IncomingLogisticsWebhookUpdateManyWithoutLogisticsAppInput;
    integration?: LogisticsIntegrationUpdateOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
    webhooks?: IncomingLogisticsWebhookUncheckedUpdateManyWithoutLogisticsAppInput;
    integration?: LogisticsIntegrationUncheckedUpdateOneWithoutLogisticsAppInput;
  };

  export type LogisticsAppUncheckedUpdateManyWithoutLogisticsAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    currentOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    currentBulkOrdersCustomViewId?: StringFieldUpdateOperationsInput | string;
    nextFiveDaysBulkOrdersCustomViewId?:
      | StringFieldUpdateOperationsInput
      | string;
  };

  export type IncomingStrapiWebhookCreateManyStrapiAppInput = {
    id: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    secretId: string;
  };

  export type IncomingStrapiWebhookUpdateWithoutStrapiAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secret?: SecretKeyUpdateOneRequiredWithoutIncomingStrapiWebhookInput;
  };

  export type IncomingStrapiWebhookUncheckedUpdateWithoutStrapiAppInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secretId?: StringFieldUpdateOperationsInput | string;
  };

  export type IncomingStrapiWebhookUncheckedUpdateManyWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    secretId?: StringFieldUpdateOperationsInput | string;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.DMMF.Document;
}
