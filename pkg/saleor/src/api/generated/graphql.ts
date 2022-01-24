import { DocumentNode } from "graphql";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  GenericScalar: any;
  JSONString: any;
  PositiveDecimal: any;
  UUID: any;
  Upload: any;
  WeightScalar: any;
  _Any: any;
}

export interface AccountAddressCreate {
  __typename?: "AccountAddressCreate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  address?: Maybe<Address>;
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface AccountAddressDelete {
  __typename?: "AccountAddressDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  address?: Maybe<Address>;
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface AccountAddressUpdate {
  __typename?: "AccountAddressUpdate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  address?: Maybe<Address>;
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface AccountDelete {
  __typename?: "AccountDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface AccountError {
  __typename?: "AccountError";
  addressType?: Maybe<AddressTypeEnum>;
  code: AccountErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum AccountErrorCode {
  AccountNotConfirmed = "ACCOUNT_NOT_CONFIRMED",
  ActivateOwnAccount = "ACTIVATE_OWN_ACCOUNT",
  ActivateSuperuserAccount = "ACTIVATE_SUPERUSER_ACCOUNT",
  ChannelInactive = "CHANNEL_INACTIVE",
  DeactivateOwnAccount = "DEACTIVATE_OWN_ACCOUNT",
  DeactivateSuperuserAccount = "DEACTIVATE_SUPERUSER_ACCOUNT",
  DeleteNonStaffUser = "DELETE_NON_STAFF_USER",
  DeleteOwnAccount = "DELETE_OWN_ACCOUNT",
  DeleteStaffAccount = "DELETE_STAFF_ACCOUNT",
  DeleteSuperuserAccount = "DELETE_SUPERUSER_ACCOUNT",
  DuplicatedInputItem = "DUPLICATED_INPUT_ITEM",
  GraphqlError = "GRAPHQL_ERROR",
  Inactive = "INACTIVE",
  Invalid = "INVALID",
  InvalidCredentials = "INVALID_CREDENTIALS",
  InvalidPassword = "INVALID_PASSWORD",
  JwtDecodeError = "JWT_DECODE_ERROR",
  JwtInvalidCsrfToken = "JWT_INVALID_CSRF_TOKEN",
  JwtInvalidToken = "JWT_INVALID_TOKEN",
  JwtMissingToken = "JWT_MISSING_TOKEN",
  JwtSignatureExpired = "JWT_SIGNATURE_EXPIRED",
  LeftNotManageablePermission = "LEFT_NOT_MANAGEABLE_PERMISSION",
  MissingChannelSlug = "MISSING_CHANNEL_SLUG",
  NotFound = "NOT_FOUND",
  OutOfScopeGroup = "OUT_OF_SCOPE_GROUP",
  OutOfScopePermission = "OUT_OF_SCOPE_PERMISSION",
  OutOfScopeUser = "OUT_OF_SCOPE_USER",
  PasswordEntirelyNumeric = "PASSWORD_ENTIRELY_NUMERIC",
  PasswordTooCommon = "PASSWORD_TOO_COMMON",
  PasswordTooShort = "PASSWORD_TOO_SHORT",
  PasswordTooSimilar = "PASSWORD_TOO_SIMILAR",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface AccountInput {
  defaultBillingAddress?: Maybe<AddressInput>;
  defaultShippingAddress?: Maybe<AddressInput>;
  firstName?: Maybe<Scalars["String"]>;
  languageCode?: Maybe<LanguageCodeEnum>;
  lastName?: Maybe<Scalars["String"]>;
}

export interface AccountRegister {
  __typename?: "AccountRegister";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  requiresConfirmation?: Maybe<Scalars["Boolean"]>;
  user?: Maybe<User>;
}

export interface AccountRegisterInput {
  channel?: Maybe<Scalars["String"]>;
  email: Scalars["String"];
  languageCode?: Maybe<LanguageCodeEnum>;
  metadata?: Maybe<MetadataInput[]>;
  password: Scalars["String"];
  redirectUrl?: Maybe<Scalars["String"]>;
}

export interface AccountRequestDeletion {
  __typename?: "AccountRequestDeletion";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
}

export interface AccountSetDefaultAddress {
  __typename?: "AccountSetDefaultAddress";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface AccountUpdate {
  __typename?: "AccountUpdate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export type Address = Node & {
  __typename?: "Address";
  city: Scalars["String"];
  cityArea: Scalars["String"];
  companyName: Scalars["String"];
  country: CountryDisplay;
  countryArea: Scalars["String"];
  firstName: Scalars["String"];
  id: Scalars["ID"];
  isDefaultBillingAddress?: Maybe<Scalars["Boolean"]>;
  isDefaultShippingAddress?: Maybe<Scalars["Boolean"]>;
  lastName: Scalars["String"];
  phone?: Maybe<Scalars["String"]>;
  postalCode: Scalars["String"];
  streetAddress1: Scalars["String"];
  streetAddress2: Scalars["String"];
};

export interface AddressCreate {
  __typename?: "AddressCreate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  address?: Maybe<Address>;
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface AddressDelete {
  __typename?: "AddressDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  address?: Maybe<Address>;
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface AddressInput {
  city?: Maybe<Scalars["String"]>;
  cityArea?: Maybe<Scalars["String"]>;
  companyName?: Maybe<Scalars["String"]>;
  country?: Maybe<CountryCode>;
  countryArea?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  postalCode?: Maybe<Scalars["String"]>;
  streetAddress1?: Maybe<Scalars["String"]>;
  streetAddress2?: Maybe<Scalars["String"]>;
}

export interface AddressSetDefault {
  __typename?: "AddressSetDefault";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export enum AddressTypeEnum {
  Billing = "BILLING",
  Shipping = "SHIPPING",
}

export interface AddressUpdate {
  __typename?: "AddressUpdate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  address?: Maybe<Address>;
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface AddressValidationData {
  __typename?: "AddressValidationData";
  addressFormat?: Maybe<Scalars["String"]>;
  addressLatinFormat?: Maybe<Scalars["String"]>;
  allowedFields?: Maybe<Array<Maybe<Scalars["String"]>>>;
  cityAreaChoices?: Maybe<Array<Maybe<ChoiceValue>>>;
  cityAreaType?: Maybe<Scalars["String"]>;
  cityChoices?: Maybe<Array<Maybe<ChoiceValue>>>;
  cityType?: Maybe<Scalars["String"]>;
  countryAreaChoices?: Maybe<Array<Maybe<ChoiceValue>>>;
  countryAreaType?: Maybe<Scalars["String"]>;
  countryCode?: Maybe<Scalars["String"]>;
  countryName?: Maybe<Scalars["String"]>;
  postalCodeExamples?: Maybe<Array<Maybe<Scalars["String"]>>>;
  postalCodeMatchers?: Maybe<Array<Maybe<Scalars["String"]>>>;
  postalCodePrefix?: Maybe<Scalars["String"]>;
  postalCodeType?: Maybe<Scalars["String"]>;
  requiredFields?: Maybe<Array<Maybe<Scalars["String"]>>>;
  upperFields?: Maybe<Array<Maybe<Scalars["String"]>>>;
}

export type Allocation = Node & {
  __typename?: "Allocation";
  id: Scalars["ID"];
  quantity: Scalars["Int"];
  warehouse: Warehouse;
};

export type App = Node &
  ObjectWithMetadata & {
    __typename?: "App";
    aboutApp?: Maybe<Scalars["String"]>;
    accessToken?: Maybe<Scalars["String"]>;
    appUrl?: Maybe<Scalars["String"]>;
    configurationUrl?: Maybe<Scalars["String"]>;
    created?: Maybe<Scalars["DateTime"]>;
    dataPrivacy?: Maybe<Scalars["String"]>;
    dataPrivacyUrl?: Maybe<Scalars["String"]>;
    homepageUrl?: Maybe<Scalars["String"]>;
    id: Scalars["ID"];
    isActive?: Maybe<Scalars["Boolean"]>;
    metadata: Array<Maybe<MetadataItem>>;
    name?: Maybe<Scalars["String"]>;
    permissions?: Maybe<Array<Maybe<Permission>>>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    supportUrl?: Maybe<Scalars["String"]>;
    tokens?: Maybe<Array<Maybe<AppToken>>>;
    type?: Maybe<AppTypeEnum>;
    version?: Maybe<Scalars["String"]>;
    webhooks?: Maybe<Array<Maybe<Webhook>>>;
  };

export interface AppActivate {
  __typename?: "AppActivate";
  app?: Maybe<App>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  errors: AppError[];
}

export interface AppCountableConnection {
  __typename?: "AppCountableConnection";
  edges: AppCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface AppCountableEdge {
  __typename?: "AppCountableEdge";
  cursor: Scalars["String"];
  node: App;
}

export interface AppCreate {
  __typename?: "AppCreate";
  app?: Maybe<App>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  authToken?: Maybe<Scalars["String"]>;
  errors: AppError[];
}

export interface AppDeactivate {
  __typename?: "AppDeactivate";
  app?: Maybe<App>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  errors: AppError[];
}

export interface AppDelete {
  __typename?: "AppDelete";
  app?: Maybe<App>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  errors: AppError[];
}

export interface AppDeleteFailedInstallation {
  __typename?: "AppDeleteFailedInstallation";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  appInstallation?: Maybe<AppInstallation>;
  errors: AppError[];
}

export interface AppError {
  __typename?: "AppError";
  code: AppErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  permissions?: Maybe<PermissionEnum[]>;
}

export enum AppErrorCode {
  Forbidden = "FORBIDDEN",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  InvalidManifestFormat = "INVALID_MANIFEST_FORMAT",
  InvalidPermission = "INVALID_PERMISSION",
  InvalidStatus = "INVALID_STATUS",
  InvalidUrlFormat = "INVALID_URL_FORMAT",
  ManifestUrlCantConnect = "MANIFEST_URL_CANT_CONNECT",
  NotFound = "NOT_FOUND",
  OutOfScopeApp = "OUT_OF_SCOPE_APP",
  OutOfScopePermission = "OUT_OF_SCOPE_PERMISSION",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface AppFetchManifest {
  __typename?: "AppFetchManifest";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  errors: AppError[];
  manifest?: Maybe<Manifest>;
}

export interface AppFilterInput {
  isActive?: Maybe<Scalars["Boolean"]>;
  search?: Maybe<Scalars["String"]>;
  type?: Maybe<AppTypeEnum>;
}

export interface AppInput {
  name?: Maybe<Scalars["String"]>;
  permissions?: Maybe<Array<Maybe<PermissionEnum>>>;
}

export interface AppInstall {
  __typename?: "AppInstall";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  appInstallation?: Maybe<AppInstallation>;
  errors: AppError[];
}

export interface AppInstallInput {
  activateAfterInstallation?: Maybe<Scalars["Boolean"]>;
  appName?: Maybe<Scalars["String"]>;
  manifestUrl?: Maybe<Scalars["String"]>;
  permissions?: Maybe<Array<Maybe<PermissionEnum>>>;
}

export type AppInstallation = Job &
  Node & {
    __typename?: "AppInstallation";
    appName: Scalars["String"];
    createdAt: Scalars["DateTime"];
    id: Scalars["ID"];
    manifestUrl: Scalars["String"];
    message?: Maybe<Scalars["String"]>;
    status: JobStatusEnum;
    updatedAt: Scalars["DateTime"];
  };

export interface AppRetryInstall {
  __typename?: "AppRetryInstall";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  appInstallation?: Maybe<AppInstallation>;
  errors: AppError[];
}

export enum AppSortField {
  CreationDate = "CREATION_DATE",
  Name = "NAME",
}

export interface AppSortingInput {
  direction: OrderDirection;
  field: AppSortField;
}

export type AppToken = Node & {
  __typename?: "AppToken";
  authToken?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
};

export interface AppTokenCreate {
  __typename?: "AppTokenCreate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  appToken?: Maybe<AppToken>;
  authToken?: Maybe<Scalars["String"]>;
  errors: AppError[];
}

export interface AppTokenDelete {
  __typename?: "AppTokenDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  appToken?: Maybe<AppToken>;
  errors: AppError[];
}

export interface AppTokenInput {
  app: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
}

export interface AppTokenVerify {
  __typename?: "AppTokenVerify";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  errors: AppError[];
  valid: Scalars["Boolean"];
}

export enum AppTypeEnum {
  Local = "LOCAL",
  Thirdparty = "THIRDPARTY",
}

export interface AppUpdate {
  __typename?: "AppUpdate";
  app?: Maybe<App>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: AppError[];
  errors: AppError[];
}

export enum AreaUnitsEnum {
  SqCm = "SQ_CM",
  SqFt = "SQ_FT",
  SqInch = "SQ_INCH",
  SqKm = "SQ_KM",
  SqM = "SQ_M",
  SqYd = "SQ_YD",
}

export interface AssignNavigation {
  __typename?: "AssignNavigation";
  errors: MenuError[];
  menu?: Maybe<Menu>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: MenuError[];
}

export type Attribute = Node &
  ObjectWithMetadata & {
    __typename?: "Attribute";
    availableInGrid: Scalars["Boolean"];
    choices?: Maybe<AttributeValueCountableConnection>;
    entityType?: Maybe<AttributeEntityTypeEnum>;
    filterableInDashboard: Scalars["Boolean"];
    filterableInStorefront: Scalars["Boolean"];
    id: Scalars["ID"];
    inputType?: Maybe<AttributeInputTypeEnum>;
    metadata: Array<Maybe<MetadataItem>>;
    name?: Maybe<Scalars["String"]>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    productTypes: ProductTypeCountableConnection;
    productVariantTypes: ProductTypeCountableConnection;
    slug?: Maybe<Scalars["String"]>;
    storefrontSearchPosition: Scalars["Int"];
    translation?: Maybe<AttributeTranslation>;
    type?: Maybe<AttributeTypeEnum>;
    unit?: Maybe<MeasurementUnitsEnum>;
    valueRequired: Scalars["Boolean"];
    visibleInStorefront: Scalars["Boolean"];
    withChoices: Scalars["Boolean"];
  };

export interface AttributeChoicesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<AttributeValueFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<AttributeChoicesSortingInput>;
}

export interface AttributeProductTypesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface AttributeProductVariantTypesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface AttributeTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface AttributeBulkDelete {
  __typename?: "AttributeBulkDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: AttributeError[];
  count: Scalars["Int"];
  errors: AttributeError[];
}

export enum AttributeChoicesSortField {
  Name = "NAME",
  Slug = "SLUG",
}

export interface AttributeChoicesSortingInput {
  direction: OrderDirection;
  field: AttributeChoicesSortField;
}

export interface AttributeCountableConnection {
  __typename?: "AttributeCountableConnection";
  edges: AttributeCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface AttributeCountableEdge {
  __typename?: "AttributeCountableEdge";
  cursor: Scalars["String"];
  node: Attribute;
}

export interface AttributeCreate {
  __typename?: "AttributeCreate";
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: AttributeError[];
  errors: AttributeError[];
}

export interface AttributeCreateInput {
  availableInGrid?: Maybe<Scalars["Boolean"]>;
  entityType?: Maybe<AttributeEntityTypeEnum>;
  filterableInDashboard?: Maybe<Scalars["Boolean"]>;
  filterableInStorefront?: Maybe<Scalars["Boolean"]>;
  inputType?: Maybe<AttributeInputTypeEnum>;
  isVariantOnly?: Maybe<Scalars["Boolean"]>;
  name: Scalars["String"];
  slug?: Maybe<Scalars["String"]>;
  storefrontSearchPosition?: Maybe<Scalars["Int"]>;
  type: AttributeTypeEnum;
  unit?: Maybe<MeasurementUnitsEnum>;
  valueRequired?: Maybe<Scalars["Boolean"]>;
  values?: Maybe<Array<Maybe<AttributeValueCreateInput>>>;
  visibleInStorefront?: Maybe<Scalars["Boolean"]>;
}

export interface AttributeDelete {
  __typename?: "AttributeDelete";
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: AttributeError[];
  errors: AttributeError[];
}

export enum AttributeEntityTypeEnum {
  Page = "PAGE",
  Product = "PRODUCT",
}

export interface AttributeError {
  __typename?: "AttributeError";
  code: AttributeErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum AttributeErrorCode {
  AlreadyExists = "ALREADY_EXISTS",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface AttributeFilterInput {
  availableInGrid?: Maybe<Scalars["Boolean"]>;
  channel?: Maybe<Scalars["String"]>;
  filterableInDashboard?: Maybe<Scalars["Boolean"]>;
  filterableInStorefront?: Maybe<Scalars["Boolean"]>;
  ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  inCategory?: Maybe<Scalars["ID"]>;
  inCollection?: Maybe<Scalars["ID"]>;
  isVariantOnly?: Maybe<Scalars["Boolean"]>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  search?: Maybe<Scalars["String"]>;
  type?: Maybe<AttributeTypeEnum>;
  valueRequired?: Maybe<Scalars["Boolean"]>;
  visibleInStorefront?: Maybe<Scalars["Boolean"]>;
}

export interface AttributeInput {
  boolean?: Maybe<Scalars["Boolean"]>;
  date?: Maybe<DateRangeInput>;
  dateTime?: Maybe<DateTimeRangeInput>;
  slug: Scalars["String"];
  values?: Maybe<Array<Maybe<Scalars["String"]>>>;
  valuesRange?: Maybe<IntRangeInput>;
}

export enum AttributeInputTypeEnum {
  Boolean = "BOOLEAN",
  Date = "DATE",
  DateTime = "DATE_TIME",
  Dropdown = "DROPDOWN",
  File = "FILE",
  Multiselect = "MULTISELECT",
  Numeric = "NUMERIC",
  Reference = "REFERENCE",
  RichText = "RICH_TEXT",
}

export interface AttributeReorderValues {
  __typename?: "AttributeReorderValues";
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: AttributeError[];
  errors: AttributeError[];
}

export enum AttributeSortField {
  AvailableInGrid = "AVAILABLE_IN_GRID",
  FilterableInDashboard = "FILTERABLE_IN_DASHBOARD",
  FilterableInStorefront = "FILTERABLE_IN_STOREFRONT",
  IsVariantOnly = "IS_VARIANT_ONLY",
  Name = "NAME",
  Slug = "SLUG",
  StorefrontSearchPosition = "STOREFRONT_SEARCH_POSITION",
  ValueRequired = "VALUE_REQUIRED",
  VisibleInStorefront = "VISIBLE_IN_STOREFRONT",
}

export interface AttributeSortingInput {
  direction: OrderDirection;
  field: AttributeSortField;
}

export type AttributeTranslatableContent = Node & {
  __typename?: "AttributeTranslatableContent";
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  attribute?: Maybe<Attribute>;
  id: Scalars["ID"];
  name: Scalars["String"];
  translation?: Maybe<AttributeTranslation>;
};

export interface AttributeTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface AttributeTranslate {
  __typename?: "AttributeTranslate";
  attribute?: Maybe<Attribute>;
  errors: TranslationError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export type AttributeTranslation = Node & {
  __typename?: "AttributeTranslation";
  id: Scalars["ID"];
  language: LanguageDisplay;
  name: Scalars["String"];
};

export enum AttributeTypeEnum {
  PageType = "PAGE_TYPE",
  ProductType = "PRODUCT_TYPE",
}

export interface AttributeUpdate {
  __typename?: "AttributeUpdate";
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: AttributeError[];
  errors: AttributeError[];
}

export interface AttributeUpdateInput {
  addValues?: Maybe<Array<Maybe<AttributeValueCreateInput>>>;
  availableInGrid?: Maybe<Scalars["Boolean"]>;
  filterableInDashboard?: Maybe<Scalars["Boolean"]>;
  filterableInStorefront?: Maybe<Scalars["Boolean"]>;
  isVariantOnly?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  removeValues?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  slug?: Maybe<Scalars["String"]>;
  storefrontSearchPosition?: Maybe<Scalars["Int"]>;
  unit?: Maybe<MeasurementUnitsEnum>;
  valueRequired?: Maybe<Scalars["Boolean"]>;
  visibleInStorefront?: Maybe<Scalars["Boolean"]>;
}

export type AttributeValue = Node & {
  __typename?: "AttributeValue";
  boolean?: Maybe<Scalars["Boolean"]>;
  date?: Maybe<Scalars["Date"]>;
  dateTime?: Maybe<Scalars["DateTime"]>;
  file?: Maybe<File>;
  id: Scalars["ID"];
  inputType?: Maybe<AttributeInputTypeEnum>;
  name?: Maybe<Scalars["String"]>;
  reference?: Maybe<Scalars["ID"]>;
  richText?: Maybe<Scalars["JSONString"]>;
  slug?: Maybe<Scalars["String"]>;
  translation?: Maybe<AttributeValueTranslation>;
  value?: Maybe<Scalars["String"]>;
};

export interface AttributeValueTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface AttributeValueBulkDelete {
  __typename?: "AttributeValueBulkDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: AttributeError[];
  count: Scalars["Int"];
  errors: AttributeError[];
}

export interface AttributeValueCountableConnection {
  __typename?: "AttributeValueCountableConnection";
  edges: AttributeValueCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface AttributeValueCountableEdge {
  __typename?: "AttributeValueCountableEdge";
  cursor: Scalars["String"];
  node: AttributeValue;
}

export interface AttributeValueCreate {
  __typename?: "AttributeValueCreate";
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: AttributeError[];
  attributeValue?: Maybe<AttributeValue>;
  errors: AttributeError[];
}

export interface AttributeValueCreateInput {
  name: Scalars["String"];
  richText?: Maybe<Scalars["JSONString"]>;
  value?: Maybe<Scalars["String"]>;
}

export interface AttributeValueDelete {
  __typename?: "AttributeValueDelete";
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: AttributeError[];
  attributeValue?: Maybe<AttributeValue>;
  errors: AttributeError[];
}

export interface AttributeValueFilterInput {
  search?: Maybe<Scalars["String"]>;
}

export interface AttributeValueInput {
  boolean?: Maybe<Scalars["Boolean"]>;
  contentType?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["Date"]>;
  dateTime?: Maybe<Scalars["DateTime"]>;
  file?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  references?: Maybe<Array<Scalars["ID"]>>;
  richText?: Maybe<Scalars["JSONString"]>;
  values?: Maybe<Array<Scalars["String"]>>;
}

export type AttributeValueTranslatableContent = Node & {
  __typename?: "AttributeValueTranslatableContent";
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  attributeValue?: Maybe<AttributeValue>;
  id: Scalars["ID"];
  name: Scalars["String"];
  richText?: Maybe<Scalars["JSONString"]>;
  translation?: Maybe<AttributeValueTranslation>;
};

export interface AttributeValueTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface AttributeValueTranslate {
  __typename?: "AttributeValueTranslate";
  attributeValue?: Maybe<AttributeValue>;
  errors: TranslationError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export type AttributeValueTranslation = Node & {
  __typename?: "AttributeValueTranslation";
  id: Scalars["ID"];
  language: LanguageDisplay;
  name: Scalars["String"];
  richText?: Maybe<Scalars["JSONString"]>;
};

export interface AttributeValueTranslationInput {
  name?: Maybe<Scalars["String"]>;
  richText?: Maybe<Scalars["JSONString"]>;
}

export interface AttributeValueUpdate {
  __typename?: "AttributeValueUpdate";
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: AttributeError[];
  attributeValue?: Maybe<AttributeValue>;
  errors: AttributeError[];
}

export interface BulkAttributeValueInput {
  boolean?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["ID"]>;
  values?: Maybe<Array<Scalars["String"]>>;
}

export interface BulkProductError {
  __typename?: "BulkProductError";
  attributes?: Maybe<Array<Scalars["ID"]>>;
  channels?: Maybe<Array<Scalars["ID"]>>;
  code: ProductErrorCode;
  field?: Maybe<Scalars["String"]>;
  index?: Maybe<Scalars["Int"]>;
  message?: Maybe<Scalars["String"]>;
  values?: Maybe<Array<Scalars["ID"]>>;
  warehouses?: Maybe<Array<Scalars["ID"]>>;
}

export interface BulkStockError {
  __typename?: "BulkStockError";
  attributes?: Maybe<Array<Scalars["ID"]>>;
  code: ProductErrorCode;
  field?: Maybe<Scalars["String"]>;
  index?: Maybe<Scalars["Int"]>;
  message?: Maybe<Scalars["String"]>;
  values?: Maybe<Array<Scalars["ID"]>>;
}

export interface CatalogueInput {
  categories?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  collections?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  products?: Maybe<Array<Maybe<Scalars["ID"]>>>;
}

export type Category = Node &
  ObjectWithMetadata & {
    __typename?: "Category";
    ancestors?: Maybe<CategoryCountableConnection>;
    backgroundImage?: Maybe<Image>;
    children?: Maybe<CategoryCountableConnection>;
    description?: Maybe<Scalars["JSONString"]>;
    /** @deprecated Will be removed in Saleor 4.0. Use the `description` field instead. */
    descriptionJson?: Maybe<Scalars["JSONString"]>;
    id: Scalars["ID"];
    level: Scalars["Int"];
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    parent?: Maybe<Category>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    products?: Maybe<ProductCountableConnection>;
    seoDescription?: Maybe<Scalars["String"]>;
    seoTitle?: Maybe<Scalars["String"]>;
    slug: Scalars["String"];
    translation?: Maybe<CategoryTranslation>;
  };

export interface CategoryAncestorsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface CategoryBackgroundImageArgs {
  size?: Maybe<Scalars["Int"]>;
}

export interface CategoryChildrenArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface CategoryProductsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface CategoryTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface CategoryBulkDelete {
  __typename?: "CategoryBulkDelete";
  count: Scalars["Int"];
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface CategoryCountableConnection {
  __typename?: "CategoryCountableConnection";
  edges: CategoryCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface CategoryCountableEdge {
  __typename?: "CategoryCountableEdge";
  cursor: Scalars["String"];
  node: Category;
}

export interface CategoryCreate {
  __typename?: "CategoryCreate";
  category?: Maybe<Category>;
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface CategoryDelete {
  __typename?: "CategoryDelete";
  category?: Maybe<Category>;
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface CategoryFilterInput {
  ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  search?: Maybe<Scalars["String"]>;
}

export interface CategoryInput {
  backgroundImage?: Maybe<Scalars["Upload"]>;
  backgroundImageAlt?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["JSONString"]>;
  name?: Maybe<Scalars["String"]>;
  seo?: Maybe<SeoInput>;
  slug?: Maybe<Scalars["String"]>;
}

export enum CategorySortField {
  Name = "NAME",
  ProductCount = "PRODUCT_COUNT",
  SubcategoryCount = "SUBCATEGORY_COUNT",
}

export interface CategorySortingInput {
  channel?: Maybe<Scalars["String"]>;
  direction: OrderDirection;
  field: CategorySortField;
}

export type CategoryTranslatableContent = Node & {
  __typename?: "CategoryTranslatableContent";
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  category?: Maybe<Category>;
  description?: Maybe<Scalars["JSONString"]>;
  /** @deprecated Will be removed in Saleor 4.0. Use the `description` field instead. */
  descriptionJson?: Maybe<Scalars["JSONString"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  seoDescription?: Maybe<Scalars["String"]>;
  seoTitle?: Maybe<Scalars["String"]>;
  translation?: Maybe<CategoryTranslation>;
};

export interface CategoryTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface CategoryTranslate {
  __typename?: "CategoryTranslate";
  category?: Maybe<Category>;
  errors: TranslationError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export type CategoryTranslation = Node & {
  __typename?: "CategoryTranslation";
  description?: Maybe<Scalars["JSONString"]>;
  /** @deprecated Will be removed in Saleor 4.0. Use the `description` field instead. */
  descriptionJson?: Maybe<Scalars["JSONString"]>;
  id: Scalars["ID"];
  language: LanguageDisplay;
  name?: Maybe<Scalars["String"]>;
  seoDescription?: Maybe<Scalars["String"]>;
  seoTitle?: Maybe<Scalars["String"]>;
};

export interface CategoryUpdate {
  __typename?: "CategoryUpdate";
  category?: Maybe<Category>;
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export type Channel = Node & {
  __typename?: "Channel";
  currencyCode: Scalars["String"];
  defaultCountry: CountryDisplay;
  hasOrders: Scalars["Boolean"];
  id: Scalars["ID"];
  isActive: Scalars["Boolean"];
  name: Scalars["String"];
  slug: Scalars["String"];
};

export interface ChannelActivate {
  __typename?: "ChannelActivate";
  channel?: Maybe<Channel>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: ChannelError[];
  errors: ChannelError[];
}

export interface ChannelCreate {
  __typename?: "ChannelCreate";
  channel?: Maybe<Channel>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: ChannelError[];
  errors: ChannelError[];
}

export interface ChannelCreateInput {
  addShippingZones?: Maybe<Array<Scalars["ID"]>>;
  currencyCode: Scalars["String"];
  defaultCountry: CountryCode;
  isActive?: Maybe<Scalars["Boolean"]>;
  name: Scalars["String"];
  slug: Scalars["String"];
}

export interface ChannelDeactivate {
  __typename?: "ChannelDeactivate";
  channel?: Maybe<Channel>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: ChannelError[];
  errors: ChannelError[];
}

export interface ChannelDelete {
  __typename?: "ChannelDelete";
  channel?: Maybe<Channel>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: ChannelError[];
  errors: ChannelError[];
}

export interface ChannelDeleteInput {
  channelId: Scalars["ID"];
}

export interface ChannelError {
  __typename?: "ChannelError";
  code: ChannelErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  shippingZones?: Maybe<Array<Scalars["ID"]>>;
}

export enum ChannelErrorCode {
  AlreadyExists = "ALREADY_EXISTS",
  ChannelsCurrencyMustBeTheSame = "CHANNELS_CURRENCY_MUST_BE_THE_SAME",
  ChannelWithOrders = "CHANNEL_WITH_ORDERS",
  DuplicatedInputItem = "DUPLICATED_INPUT_ITEM",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface ChannelUpdate {
  __typename?: "ChannelUpdate";
  channel?: Maybe<Channel>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: ChannelError[];
  errors: ChannelError[];
}

export interface ChannelUpdateInput {
  addShippingZones?: Maybe<Array<Scalars["ID"]>>;
  defaultCountry?: Maybe<CountryCode>;
  isActive?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  removeShippingZones?: Maybe<Array<Scalars["ID"]>>;
  slug?: Maybe<Scalars["String"]>;
}

export type Checkout = Node &
  ObjectWithMetadata & {
    __typename?: "Checkout";
    availablePaymentGateways: PaymentGateway[];
    availableShippingMethods: Array<Maybe<ShippingMethod>>;
    billingAddress?: Maybe<Address>;
    channel: Channel;
    created: Scalars["DateTime"];
    discount?: Maybe<Money>;
    discountName?: Maybe<Scalars["String"]>;
    email: Scalars["String"];
    giftCards?: Maybe<Array<Maybe<GiftCard>>>;
    id: Scalars["ID"];
    isShippingRequired: Scalars["Boolean"];
    languageCode: LanguageCodeEnum;
    lastChange: Scalars["DateTime"];
    lines?: Maybe<Array<Maybe<CheckoutLine>>>;
    metadata: Array<Maybe<MetadataItem>>;
    note: Scalars["String"];
    privateMetadata: Array<Maybe<MetadataItem>>;
    quantity: Scalars["Int"];
    shippingAddress?: Maybe<Address>;
    shippingMethod?: Maybe<ShippingMethod>;
    shippingPrice?: Maybe<TaxedMoney>;
    subtotalPrice?: Maybe<TaxedMoney>;
    token: Scalars["UUID"];
    totalPrice?: Maybe<TaxedMoney>;
    translatedDiscountName?: Maybe<Scalars["String"]>;
    user?: Maybe<User>;
    voucherCode?: Maybe<Scalars["String"]>;
  };

export interface CheckoutAddPromoCode {
  __typename?: "CheckoutAddPromoCode";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface CheckoutBillingAddressUpdate {
  __typename?: "CheckoutBillingAddressUpdate";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface CheckoutComplete {
  __typename?: "CheckoutComplete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  confirmationData?: Maybe<Scalars["JSONString"]>;
  confirmationNeeded: Scalars["Boolean"];
  errors: CheckoutError[];
  order?: Maybe<Order>;
}

export interface CheckoutCountableConnection {
  __typename?: "CheckoutCountableConnection";
  edges: CheckoutCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface CheckoutCountableEdge {
  __typename?: "CheckoutCountableEdge";
  cursor: Scalars["String"];
  node: Checkout;
}

export interface CheckoutCreate {
  __typename?: "CheckoutCreate";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  created?: Maybe<Scalars["Boolean"]>;
  errors: CheckoutError[];
}

export interface CheckoutCreateInput {
  billingAddress?: Maybe<AddressInput>;
  channel?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  languageCode?: Maybe<LanguageCodeEnum>;
  lines: Array<Maybe<CheckoutLineInput>>;
  shippingAddress?: Maybe<AddressInput>;
}

export interface CheckoutCustomerAttach {
  __typename?: "CheckoutCustomerAttach";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface CheckoutCustomerDetach {
  __typename?: "CheckoutCustomerDetach";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface CheckoutEmailUpdate {
  __typename?: "CheckoutEmailUpdate";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface CheckoutError {
  __typename?: "CheckoutError";
  addressType?: Maybe<AddressTypeEnum>;
  code: CheckoutErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  variants?: Maybe<Array<Scalars["ID"]>>;
}

export enum CheckoutErrorCode {
  BillingAddressNotSet = "BILLING_ADDRESS_NOT_SET",
  ChannelInactive = "CHANNEL_INACTIVE",
  CheckoutNotFullyPaid = "CHECKOUT_NOT_FULLY_PAID",
  GraphqlError = "GRAPHQL_ERROR",
  InsufficientStock = "INSUFFICIENT_STOCK",
  Invalid = "INVALID",
  InvalidShippingMethod = "INVALID_SHIPPING_METHOD",
  MissingChannelSlug = "MISSING_CHANNEL_SLUG",
  NotFound = "NOT_FOUND",
  PaymentError = "PAYMENT_ERROR",
  ProductNotPublished = "PRODUCT_NOT_PUBLISHED",
  ProductUnavailableForPurchase = "PRODUCT_UNAVAILABLE_FOR_PURCHASE",
  QuantityGreaterThanLimit = "QUANTITY_GREATER_THAN_LIMIT",
  Required = "REQUIRED",
  ShippingAddressNotSet = "SHIPPING_ADDRESS_NOT_SET",
  ShippingMethodNotApplicable = "SHIPPING_METHOD_NOT_APPLICABLE",
  ShippingMethodNotSet = "SHIPPING_METHOD_NOT_SET",
  ShippingNotRequired = "SHIPPING_NOT_REQUIRED",
  TaxError = "TAX_ERROR",
  UnavailableVariantInChannel = "UNAVAILABLE_VARIANT_IN_CHANNEL",
  Unique = "UNIQUE",
  VoucherNotApplicable = "VOUCHER_NOT_APPLICABLE",
  ZeroQuantity = "ZERO_QUANTITY",
}

export interface CheckoutLanguageCodeUpdate {
  __typename?: "CheckoutLanguageCodeUpdate";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export type CheckoutLine = Node & {
  __typename?: "CheckoutLine";
  id: Scalars["ID"];
  quantity: Scalars["Int"];
  requiresShipping?: Maybe<Scalars["Boolean"]>;
  totalPrice?: Maybe<TaxedMoney>;
  variant: ProductVariant;
};

export interface CheckoutLineCountableConnection {
  __typename?: "CheckoutLineCountableConnection";
  edges: CheckoutLineCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface CheckoutLineCountableEdge {
  __typename?: "CheckoutLineCountableEdge";
  cursor: Scalars["String"];
  node: CheckoutLine;
}

export interface CheckoutLineDelete {
  __typename?: "CheckoutLineDelete";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface CheckoutLineInput {
  quantity: Scalars["Int"];
  variantId: Scalars["ID"];
}

export interface CheckoutLinesAdd {
  __typename?: "CheckoutLinesAdd";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface CheckoutLinesUpdate {
  __typename?: "CheckoutLinesUpdate";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface CheckoutPaymentCreate {
  __typename?: "CheckoutPaymentCreate";
  checkout?: Maybe<Checkout>;
  errors: PaymentError[];
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: PaymentError[];
}

export interface CheckoutRemovePromoCode {
  __typename?: "CheckoutRemovePromoCode";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface CheckoutShippingAddressUpdate {
  __typename?: "CheckoutShippingAddressUpdate";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface CheckoutShippingMethodUpdate {
  __typename?: "CheckoutShippingMethodUpdate";
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: CheckoutError[];
  errors: CheckoutError[];
}

export interface ChoiceValue {
  __typename?: "ChoiceValue";
  raw?: Maybe<Scalars["String"]>;
  verbose?: Maybe<Scalars["String"]>;
}

export type Collection = Node &
  ObjectWithMetadata & {
    __typename?: "Collection";
    backgroundImage?: Maybe<Image>;
    channel?: Maybe<Scalars["String"]>;
    channelListings?: Maybe<CollectionChannelListing[]>;
    description?: Maybe<Scalars["JSONString"]>;
    /** @deprecated Will be removed in Saleor 4.0. Use the `description` field instead. */
    descriptionJson?: Maybe<Scalars["JSONString"]>;
    id: Scalars["ID"];
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    privateMetadata: Array<Maybe<MetadataItem>>;
    products?: Maybe<ProductCountableConnection>;
    seoDescription?: Maybe<Scalars["String"]>;
    seoTitle?: Maybe<Scalars["String"]>;
    slug: Scalars["String"];
    translation?: Maybe<CollectionTranslation>;
  };

export interface CollectionBackgroundImageArgs {
  size?: Maybe<Scalars["Int"]>;
}

export interface CollectionProductsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<ProductFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<ProductOrder>;
}

export interface CollectionTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface CollectionAddProducts {
  __typename?: "CollectionAddProducts";
  collection?: Maybe<Collection>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: CollectionError[];
  errors: CollectionError[];
}

export interface CollectionBulkDelete {
  __typename?: "CollectionBulkDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: CollectionError[];
  count: Scalars["Int"];
  errors: CollectionError[];
}

export type CollectionChannelListing = Node & {
  __typename?: "CollectionChannelListing";
  channel: Channel;
  id: Scalars["ID"];
  isPublished: Scalars["Boolean"];
  publicationDate?: Maybe<Scalars["Date"]>;
};

export interface CollectionChannelListingError {
  __typename?: "CollectionChannelListingError";
  attributes?: Maybe<Array<Scalars["ID"]>>;
  channels?: Maybe<Array<Scalars["ID"]>>;
  code: ProductErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  values?: Maybe<Array<Scalars["ID"]>>;
}

export interface CollectionChannelListingUpdate {
  __typename?: "CollectionChannelListingUpdate";
  collection?: Maybe<Collection>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionChannelListingErrors: CollectionChannelListingError[];
  errors: CollectionChannelListingError[];
}

export interface CollectionChannelListingUpdateInput {
  addChannels?: Maybe<PublishableChannelListingInput[]>;
  removeChannels?: Maybe<Array<Scalars["ID"]>>;
}

export interface CollectionCountableConnection {
  __typename?: "CollectionCountableConnection";
  edges: CollectionCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface CollectionCountableEdge {
  __typename?: "CollectionCountableEdge";
  cursor: Scalars["String"];
  node: Collection;
}

export interface CollectionCreate {
  __typename?: "CollectionCreate";
  collection?: Maybe<Collection>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: CollectionError[];
  errors: CollectionError[];
}

export interface CollectionCreateInput {
  backgroundImage?: Maybe<Scalars["Upload"]>;
  backgroundImageAlt?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["JSONString"]>;
  isPublished?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  products?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  publicationDate?: Maybe<Scalars["Date"]>;
  seo?: Maybe<SeoInput>;
  slug?: Maybe<Scalars["String"]>;
}

export interface CollectionDelete {
  __typename?: "CollectionDelete";
  collection?: Maybe<Collection>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: CollectionError[];
  errors: CollectionError[];
}

export interface CollectionError {
  __typename?: "CollectionError";
  code: CollectionErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  products?: Maybe<Array<Scalars["ID"]>>;
}

export enum CollectionErrorCode {
  CannotManageProductWithoutVariant = "CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT",
  DuplicatedInputItem = "DUPLICATED_INPUT_ITEM",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface CollectionFilterInput {
  channel?: Maybe<Scalars["String"]>;
  ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  published?: Maybe<CollectionPublished>;
  search?: Maybe<Scalars["String"]>;
}

export interface CollectionInput {
  backgroundImage?: Maybe<Scalars["Upload"]>;
  backgroundImageAlt?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["JSONString"]>;
  isPublished?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  publicationDate?: Maybe<Scalars["Date"]>;
  seo?: Maybe<SeoInput>;
  slug?: Maybe<Scalars["String"]>;
}

export enum CollectionPublished {
  Hidden = "HIDDEN",
  Published = "PUBLISHED",
}

export interface CollectionRemoveProducts {
  __typename?: "CollectionRemoveProducts";
  collection?: Maybe<Collection>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: CollectionError[];
  errors: CollectionError[];
}

export interface CollectionReorderProducts {
  __typename?: "CollectionReorderProducts";
  collection?: Maybe<Collection>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: CollectionError[];
  errors: CollectionError[];
}

export enum CollectionSortField {
  Availability = "AVAILABILITY",
  Name = "NAME",
  ProductCount = "PRODUCT_COUNT",
  PublicationDate = "PUBLICATION_DATE",
}

export interface CollectionSortingInput {
  channel?: Maybe<Scalars["String"]>;
  direction: OrderDirection;
  field: CollectionSortField;
}

export type CollectionTranslatableContent = Node & {
  __typename?: "CollectionTranslatableContent";
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  collection?: Maybe<Collection>;
  description?: Maybe<Scalars["JSONString"]>;
  /** @deprecated Will be removed in Saleor 4.0. Use the `description` field instead. */
  descriptionJson?: Maybe<Scalars["JSONString"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  seoDescription?: Maybe<Scalars["String"]>;
  seoTitle?: Maybe<Scalars["String"]>;
  translation?: Maybe<CollectionTranslation>;
};

export interface CollectionTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface CollectionTranslate {
  __typename?: "CollectionTranslate";
  collection?: Maybe<Collection>;
  errors: TranslationError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export type CollectionTranslation = Node & {
  __typename?: "CollectionTranslation";
  description?: Maybe<Scalars["JSONString"]>;
  /** @deprecated Will be removed in Saleor 4.0. Use the `description` field instead. */
  descriptionJson?: Maybe<Scalars["JSONString"]>;
  id: Scalars["ID"];
  language: LanguageDisplay;
  name?: Maybe<Scalars["String"]>;
  seoDescription?: Maybe<Scalars["String"]>;
  seoTitle?: Maybe<Scalars["String"]>;
};

export interface CollectionUpdate {
  __typename?: "CollectionUpdate";
  collection?: Maybe<Collection>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: CollectionError[];
  errors: CollectionError[];
}

export interface ConfigurationItem {
  __typename?: "ConfigurationItem";
  helpText?: Maybe<Scalars["String"]>;
  label?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  type?: Maybe<ConfigurationTypeFieldEnum>;
  value?: Maybe<Scalars["String"]>;
}

export interface ConfigurationItemInput {
  name: Scalars["String"];
  value?: Maybe<Scalars["String"]>;
}

export enum ConfigurationTypeFieldEnum {
  Boolean = "BOOLEAN",
  Multiline = "MULTILINE",
  Output = "OUTPUT",
  Password = "PASSWORD",
  Secret = "SECRET",
  Secretmultiline = "SECRETMULTILINE",
  String = "STRING",
}

export interface ConfirmAccount {
  __typename?: "ConfirmAccount";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface ConfirmEmailChange {
  __typename?: "ConfirmEmailChange";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export enum CountryCode {
  Ad = "AD",
  Ae = "AE",
  Af = "AF",
  Ag = "AG",
  Ai = "AI",
  Al = "AL",
  Am = "AM",
  Ao = "AO",
  Aq = "AQ",
  Ar = "AR",
  As = "AS",
  At = "AT",
  Au = "AU",
  Aw = "AW",
  Ax = "AX",
  Az = "AZ",
  Ba = "BA",
  Bb = "BB",
  Bd = "BD",
  Be = "BE",
  Bf = "BF",
  Bg = "BG",
  Bh = "BH",
  Bi = "BI",
  Bj = "BJ",
  Bl = "BL",
  Bm = "BM",
  Bn = "BN",
  Bo = "BO",
  Bq = "BQ",
  Br = "BR",
  Bs = "BS",
  Bt = "BT",
  Bv = "BV",
  Bw = "BW",
  By = "BY",
  Bz = "BZ",
  Ca = "CA",
  Cc = "CC",
  Cd = "CD",
  Cf = "CF",
  Cg = "CG",
  Ch = "CH",
  Ci = "CI",
  Ck = "CK",
  Cl = "CL",
  Cm = "CM",
  Cn = "CN",
  Co = "CO",
  Cr = "CR",
  Cu = "CU",
  Cv = "CV",
  Cw = "CW",
  Cx = "CX",
  Cy = "CY",
  Cz = "CZ",
  De = "DE",
  Dj = "DJ",
  Dk = "DK",
  Dm = "DM",
  Do = "DO",
  Dz = "DZ",
  Ec = "EC",
  Ee = "EE",
  Eg = "EG",
  Eh = "EH",
  Er = "ER",
  Es = "ES",
  Et = "ET",
  Eu = "EU",
  Fi = "FI",
  Fj = "FJ",
  Fk = "FK",
  Fm = "FM",
  Fo = "FO",
  Fr = "FR",
  Ga = "GA",
  Gb = "GB",
  Gd = "GD",
  Ge = "GE",
  Gf = "GF",
  Gg = "GG",
  Gh = "GH",
  Gi = "GI",
  Gl = "GL",
  Gm = "GM",
  Gn = "GN",
  Gp = "GP",
  Gq = "GQ",
  Gr = "GR",
  Gs = "GS",
  Gt = "GT",
  Gu = "GU",
  Gw = "GW",
  Gy = "GY",
  Hk = "HK",
  Hm = "HM",
  Hn = "HN",
  Hr = "HR",
  Ht = "HT",
  Hu = "HU",
  Id = "ID",
  Ie = "IE",
  Il = "IL",
  Im = "IM",
  In = "IN",
  Io = "IO",
  Iq = "IQ",
  Ir = "IR",
  Is = "IS",
  It = "IT",
  Je = "JE",
  Jm = "JM",
  Jo = "JO",
  Jp = "JP",
  Ke = "KE",
  Kg = "KG",
  Kh = "KH",
  Ki = "KI",
  Km = "KM",
  Kn = "KN",
  Kp = "KP",
  Kr = "KR",
  Kw = "KW",
  Ky = "KY",
  Kz = "KZ",
  La = "LA",
  Lb = "LB",
  Lc = "LC",
  Li = "LI",
  Lk = "LK",
  Lr = "LR",
  Ls = "LS",
  Lt = "LT",
  Lu = "LU",
  Lv = "LV",
  Ly = "LY",
  Ma = "MA",
  Mc = "MC",
  Md = "MD",
  Me = "ME",
  Mf = "MF",
  Mg = "MG",
  Mh = "MH",
  Mk = "MK",
  Ml = "ML",
  Mm = "MM",
  Mn = "MN",
  Mo = "MO",
  Mp = "MP",
  Mq = "MQ",
  Mr = "MR",
  Ms = "MS",
  Mt = "MT",
  Mu = "MU",
  Mv = "MV",
  Mw = "MW",
  Mx = "MX",
  My = "MY",
  Mz = "MZ",
  Na = "NA",
  Nc = "NC",
  Ne = "NE",
  Nf = "NF",
  Ng = "NG",
  Ni = "NI",
  Nl = "NL",
  No = "NO",
  Np = "NP",
  Nr = "NR",
  Nu = "NU",
  Nz = "NZ",
  Om = "OM",
  Pa = "PA",
  Pe = "PE",
  Pf = "PF",
  Pg = "PG",
  Ph = "PH",
  Pk = "PK",
  Pl = "PL",
  Pm = "PM",
  Pn = "PN",
  Pr = "PR",
  Ps = "PS",
  Pt = "PT",
  Pw = "PW",
  Py = "PY",
  Qa = "QA",
  Re = "RE",
  Ro = "RO",
  Rs = "RS",
  Ru = "RU",
  Rw = "RW",
  Sa = "SA",
  Sb = "SB",
  Sc = "SC",
  Sd = "SD",
  Se = "SE",
  Sg = "SG",
  Sh = "SH",
  Si = "SI",
  Sj = "SJ",
  Sk = "SK",
  Sl = "SL",
  Sm = "SM",
  Sn = "SN",
  So = "SO",
  Sr = "SR",
  Ss = "SS",
  St = "ST",
  Sv = "SV",
  Sx = "SX",
  Sy = "SY",
  Sz = "SZ",
  Tc = "TC",
  Td = "TD",
  Tf = "TF",
  Tg = "TG",
  Th = "TH",
  Tj = "TJ",
  Tk = "TK",
  Tl = "TL",
  Tm = "TM",
  Tn = "TN",
  To = "TO",
  Tr = "TR",
  Tt = "TT",
  Tv = "TV",
  Tw = "TW",
  Tz = "TZ",
  Ua = "UA",
  Ug = "UG",
  Um = "UM",
  Us = "US",
  Uy = "UY",
  Uz = "UZ",
  Va = "VA",
  Vc = "VC",
  Ve = "VE",
  Vg = "VG",
  Vi = "VI",
  Vn = "VN",
  Vu = "VU",
  Wf = "WF",
  Ws = "WS",
  Ye = "YE",
  Yt = "YT",
  Za = "ZA",
  Zm = "ZM",
  Zw = "ZW",
}

export interface CountryDisplay {
  __typename?: "CountryDisplay";
  code: Scalars["String"];
  country: Scalars["String"];
  vat?: Maybe<Vat>;
}

export interface CreateToken {
  __typename?: "CreateToken";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  csrfToken?: Maybe<Scalars["String"]>;
  errors: AccountError[];
  refreshToken?: Maybe<Scalars["String"]>;
  token?: Maybe<Scalars["String"]>;
  user?: Maybe<User>;
}

export interface CreditCard {
  __typename?: "CreditCard";
  brand: Scalars["String"];
  expMonth?: Maybe<Scalars["Int"]>;
  expYear?: Maybe<Scalars["Int"]>;
  firstDigits?: Maybe<Scalars["String"]>;
  lastDigits: Scalars["String"];
}

export interface CustomerBulkDelete {
  __typename?: "CustomerBulkDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  count: Scalars["Int"];
  errors: AccountError[];
}

export interface CustomerCreate {
  __typename?: "CustomerCreate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface CustomerDelete {
  __typename?: "CustomerDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export type CustomerEvent = Node & {
  __typename?: "CustomerEvent";
  app?: Maybe<App>;
  count?: Maybe<Scalars["Int"]>;
  date?: Maybe<Scalars["DateTime"]>;
  id: Scalars["ID"];
  message?: Maybe<Scalars["String"]>;
  order?: Maybe<Order>;
  orderLine?: Maybe<OrderLine>;
  type?: Maybe<CustomerEventsEnum>;
  user?: Maybe<User>;
};

export enum CustomerEventsEnum {
  AccountCreated = "ACCOUNT_CREATED",
  CustomerDeleted = "CUSTOMER_DELETED",
  DigitalLinkDownloaded = "DIGITAL_LINK_DOWNLOADED",
  EmailAssigned = "EMAIL_ASSIGNED",
  EmailChanged = "EMAIL_CHANGED",
  EmailChangedRequest = "EMAIL_CHANGED_REQUEST",
  NameAssigned = "NAME_ASSIGNED",
  NoteAdded = "NOTE_ADDED",
  NoteAddedToOrder = "NOTE_ADDED_TO_ORDER",
  PasswordChanged = "PASSWORD_CHANGED",
  PasswordReset = "PASSWORD_RESET",
  PasswordResetLinkSent = "PASSWORD_RESET_LINK_SENT",
  PlacedOrder = "PLACED_ORDER",
}

export interface CustomerFilterInput {
  dateJoined?: Maybe<DateRangeInput>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  numberOfOrders?: Maybe<IntRangeInput>;
  placedOrders?: Maybe<DateRangeInput>;
  search?: Maybe<Scalars["String"]>;
}

export interface CustomerInput {
  defaultBillingAddress?: Maybe<AddressInput>;
  defaultShippingAddress?: Maybe<AddressInput>;
  email?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  isActive?: Maybe<Scalars["Boolean"]>;
  languageCode?: Maybe<LanguageCodeEnum>;
  lastName?: Maybe<Scalars["String"]>;
  note?: Maybe<Scalars["String"]>;
}

export interface CustomerUpdate {
  __typename?: "CustomerUpdate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface DateRangeInput {
  gte?: Maybe<Scalars["Date"]>;
  lte?: Maybe<Scalars["Date"]>;
}

export interface DateTimeRangeInput {
  gte?: Maybe<Scalars["DateTime"]>;
  lte?: Maybe<Scalars["DateTime"]>;
}

export interface DeactivateAllUserTokens {
  __typename?: "DeactivateAllUserTokens";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
}

export interface DeleteMetadata {
  __typename?: "DeleteMetadata";
  errors: MetadataError[];
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: MetadataError[];
}

export interface DeletePrivateMetadata {
  __typename?: "DeletePrivateMetadata";
  errors: MetadataError[];
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: MetadataError[];
}

export type DigitalContent = Node &
  ObjectWithMetadata & {
    __typename?: "DigitalContent";
    automaticFulfillment: Scalars["Boolean"];
    contentFile: Scalars["String"];
    id: Scalars["ID"];
    maxDownloads?: Maybe<Scalars["Int"]>;
    metadata: Array<Maybe<MetadataItem>>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    productVariant: ProductVariant;
    urlValidDays?: Maybe<Scalars["Int"]>;
    urls?: Maybe<Array<Maybe<DigitalContentUrl>>>;
    useDefaultSettings: Scalars["Boolean"];
  };

export interface DigitalContentCountableConnection {
  __typename?: "DigitalContentCountableConnection";
  edges: DigitalContentCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface DigitalContentCountableEdge {
  __typename?: "DigitalContentCountableEdge";
  cursor: Scalars["String"];
  node: DigitalContent;
}

export interface DigitalContentCreate {
  __typename?: "DigitalContentCreate";
  content?: Maybe<DigitalContent>;
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  variant?: Maybe<ProductVariant>;
}

export interface DigitalContentDelete {
  __typename?: "DigitalContentDelete";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  variant?: Maybe<ProductVariant>;
}

export interface DigitalContentInput {
  automaticFulfillment?: Maybe<Scalars["Boolean"]>;
  maxDownloads?: Maybe<Scalars["Int"]>;
  urlValidDays?: Maybe<Scalars["Int"]>;
  useDefaultSettings: Scalars["Boolean"];
}

export interface DigitalContentUpdate {
  __typename?: "DigitalContentUpdate";
  content?: Maybe<DigitalContent>;
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  variant?: Maybe<ProductVariant>;
}

export interface DigitalContentUploadInput {
  automaticFulfillment?: Maybe<Scalars["Boolean"]>;
  contentFile: Scalars["Upload"];
  maxDownloads?: Maybe<Scalars["Int"]>;
  urlValidDays?: Maybe<Scalars["Int"]>;
  useDefaultSettings: Scalars["Boolean"];
}

export type DigitalContentUrl = Node & {
  __typename?: "DigitalContentUrl";
  content: DigitalContent;
  created: Scalars["DateTime"];
  downloadNum: Scalars["Int"];
  id: Scalars["ID"];
  token: Scalars["UUID"];
  url?: Maybe<Scalars["String"]>;
};

export interface DigitalContentUrlCreate {
  __typename?: "DigitalContentUrlCreate";
  digitalContentUrl?: Maybe<DigitalContentUrl>;
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface DigitalContentUrlCreateInput {
  content: Scalars["ID"];
}

export interface DiscountError {
  __typename?: "DiscountError";
  channels?: Maybe<Array<Scalars["ID"]>>;
  code: DiscountErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  products?: Maybe<Array<Scalars["ID"]>>;
}

export enum DiscountErrorCode {
  AlreadyExists = "ALREADY_EXISTS",
  CannotManageProductWithoutVariant = "CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT",
  DuplicatedInputItem = "DUPLICATED_INPUT_ITEM",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export enum DiscountStatusEnum {
  Active = "ACTIVE",
  Expired = "EXPIRED",
  Scheduled = "SCHEDULED",
}

export enum DiscountValueTypeEnum {
  Fixed = "FIXED",
  Percentage = "PERCENTAGE",
}

export enum DistanceUnitsEnum {
  Cm = "CM",
  Ft = "FT",
  Inch = "INCH",
  Km = "KM",
  M = "M",
  Yd = "YD",
}

export interface Domain {
  __typename?: "Domain";
  host: Scalars["String"];
  sslEnabled: Scalars["Boolean"];
  url: Scalars["String"];
}

export interface DraftOrderBulkDelete {
  __typename?: "DraftOrderBulkDelete";
  count: Scalars["Int"];
  errors: OrderError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface DraftOrderComplete {
  __typename?: "DraftOrderComplete";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface DraftOrderCreate {
  __typename?: "DraftOrderCreate";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface DraftOrderCreateInput {
  billingAddress?: Maybe<AddressInput>;
  channelId?: Maybe<Scalars["ID"]>;
  customerNote?: Maybe<Scalars["String"]>;
  discount?: Maybe<Scalars["PositiveDecimal"]>;
  lines?: Maybe<Array<Maybe<OrderLineCreateInput>>>;
  redirectUrl?: Maybe<Scalars["String"]>;
  shippingAddress?: Maybe<AddressInput>;
  shippingMethod?: Maybe<Scalars["ID"]>;
  user?: Maybe<Scalars["ID"]>;
  userEmail?: Maybe<Scalars["String"]>;
  voucher?: Maybe<Scalars["ID"]>;
}

export interface DraftOrderDelete {
  __typename?: "DraftOrderDelete";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface DraftOrderInput {
  billingAddress?: Maybe<AddressInput>;
  channelId?: Maybe<Scalars["ID"]>;
  customerNote?: Maybe<Scalars["String"]>;
  discount?: Maybe<Scalars["PositiveDecimal"]>;
  redirectUrl?: Maybe<Scalars["String"]>;
  shippingAddress?: Maybe<AddressInput>;
  shippingMethod?: Maybe<Scalars["ID"]>;
  user?: Maybe<Scalars["ID"]>;
  userEmail?: Maybe<Scalars["String"]>;
  voucher?: Maybe<Scalars["ID"]>;
}

export interface DraftOrderLinesBulkDelete {
  __typename?: "DraftOrderLinesBulkDelete";
  count: Scalars["Int"];
  errors: OrderError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface DraftOrderUpdate {
  __typename?: "DraftOrderUpdate";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface ExportError {
  __typename?: "ExportError";
  code: ExportErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum ExportErrorCode {
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
}

export type ExportEvent = Node & {
  __typename?: "ExportEvent";
  app?: Maybe<App>;
  date: Scalars["DateTime"];
  id: Scalars["ID"];
  message: Scalars["String"];
  type: ExportEventsEnum;
  user?: Maybe<User>;
};

export enum ExportEventsEnum {
  ExportedFileSent = "EXPORTED_FILE_SENT",
  ExportDeleted = "EXPORT_DELETED",
  ExportFailed = "EXPORT_FAILED",
  ExportFailedInfoSent = "EXPORT_FAILED_INFO_SENT",
  ExportPending = "EXPORT_PENDING",
  ExportSuccess = "EXPORT_SUCCESS",
}

export type ExportFile = Job &
  Node & {
    __typename?: "ExportFile";
    app?: Maybe<App>;
    createdAt: Scalars["DateTime"];
    events?: Maybe<ExportEvent[]>;
    id: Scalars["ID"];
    message?: Maybe<Scalars["String"]>;
    status: JobStatusEnum;
    updatedAt: Scalars["DateTime"];
    url?: Maybe<Scalars["String"]>;
    user?: Maybe<User>;
  };

export interface ExportFileCountableConnection {
  __typename?: "ExportFileCountableConnection";
  edges: ExportFileCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface ExportFileCountableEdge {
  __typename?: "ExportFileCountableEdge";
  cursor: Scalars["String"];
  node: ExportFile;
}

export interface ExportFileFilterInput {
  app?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<DateTimeRangeInput>;
  status?: Maybe<JobStatusEnum>;
  updatedAt?: Maybe<DateTimeRangeInput>;
  user?: Maybe<Scalars["String"]>;
}

export enum ExportFileSortField {
  CreatedAt = "CREATED_AT",
  Status = "STATUS",
  UpdatedAt = "UPDATED_AT",
}

export interface ExportFileSortingInput {
  direction: OrderDirection;
  field: ExportFileSortField;
}

export interface ExportInfoInput {
  attributes?: Maybe<Array<Scalars["ID"]>>;
  channels?: Maybe<Array<Scalars["ID"]>>;
  fields?: Maybe<ProductFieldEnum[]>;
  warehouses?: Maybe<Array<Scalars["ID"]>>;
}

export interface ExportProducts {
  __typename?: "ExportProducts";
  errors: ExportError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  exportErrors: ExportError[];
  exportFile?: Maybe<ExportFile>;
}

export interface ExportProductsInput {
  exportInfo?: Maybe<ExportInfoInput>;
  fileType: FileTypesEnum;
  filter?: Maybe<ProductFilterInput>;
  ids?: Maybe<Array<Scalars["ID"]>>;
  scope: ExportScope;
}

export enum ExportScope {
  All = "ALL",
  Filter = "FILTER",
  Ids = "IDS",
}

export interface ExternalAuthentication {
  __typename?: "ExternalAuthentication";
  id: Scalars["String"];
  name?: Maybe<Scalars["String"]>;
}

export interface ExternalAuthenticationUrl {
  __typename?: "ExternalAuthenticationUrl";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  authenticationData?: Maybe<Scalars["JSONString"]>;
  errors: AccountError[];
}

export interface ExternalLogout {
  __typename?: "ExternalLogout";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  logoutData?: Maybe<Scalars["JSONString"]>;
}

export interface ExternalObtainAccessTokens {
  __typename?: "ExternalObtainAccessTokens";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  csrfToken?: Maybe<Scalars["String"]>;
  errors: AccountError[];
  refreshToken?: Maybe<Scalars["String"]>;
  token?: Maybe<Scalars["String"]>;
  user?: Maybe<User>;
}

export interface ExternalRefresh {
  __typename?: "ExternalRefresh";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  csrfToken?: Maybe<Scalars["String"]>;
  errors: AccountError[];
  refreshToken?: Maybe<Scalars["String"]>;
  token?: Maybe<Scalars["String"]>;
  user?: Maybe<User>;
}

export interface ExternalVerify {
  __typename?: "ExternalVerify";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  isValid: Scalars["Boolean"];
  user?: Maybe<User>;
  verifyData?: Maybe<Scalars["JSONString"]>;
}

export interface File {
  __typename?: "File";
  contentType?: Maybe<Scalars["String"]>;
  url: Scalars["String"];
}

export enum FileTypesEnum {
  Csv = "CSV",
  Xlsx = "XLSX",
}

export interface FileUpload {
  __typename?: "FileUpload";
  errors: UploadError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  uploadErrors: UploadError[];
  uploadedFile?: Maybe<File>;
}

export type Fulfillment = Node &
  ObjectWithMetadata & {
    __typename?: "Fulfillment";
    created: Scalars["DateTime"];
    fulfillmentOrder: Scalars["Int"];
    id: Scalars["ID"];
    lines?: Maybe<Array<Maybe<FulfillmentLine>>>;
    metadata: Array<Maybe<MetadataItem>>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    status: FulfillmentStatus;
    statusDisplay?: Maybe<Scalars["String"]>;
    trackingNumber: Scalars["String"];
    warehouse?: Maybe<Warehouse>;
  };

export interface FulfillmentCancel {
  __typename?: "FulfillmentCancel";
  errors: OrderError[];
  fulfillment?: Maybe<Fulfillment>;
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface FulfillmentCancelInput {
  warehouseId: Scalars["ID"];
}

export type FulfillmentLine = Node & {
  __typename?: "FulfillmentLine";
  id: Scalars["ID"];
  orderLine?: Maybe<OrderLine>;
  quantity: Scalars["Int"];
};

export interface FulfillmentRefundProducts {
  __typename?: "FulfillmentRefundProducts";
  errors: OrderError[];
  fulfillment?: Maybe<Fulfillment>;
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface FulfillmentReturnProducts {
  __typename?: "FulfillmentReturnProducts";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
  replaceFulfillment?: Maybe<Fulfillment>;
  replaceOrder?: Maybe<Order>;
  returnFulfillment?: Maybe<Fulfillment>;
}

export enum FulfillmentStatus {
  Canceled = "CANCELED",
  Fulfilled = "FULFILLED",
  Refunded = "REFUNDED",
  RefundedAndReturned = "REFUNDED_AND_RETURNED",
  Replaced = "REPLACED",
  Returned = "RETURNED",
}

export interface FulfillmentUpdateTracking {
  __typename?: "FulfillmentUpdateTracking";
  errors: OrderError[];
  fulfillment?: Maybe<Fulfillment>;
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface FulfillmentUpdateTrackingInput {
  notifyCustomer?: Maybe<Scalars["Boolean"]>;
  trackingNumber?: Maybe<Scalars["String"]>;
}

export interface GatewayConfigLine {
  __typename?: "GatewayConfigLine";
  field: Scalars["String"];
  value?: Maybe<Scalars["String"]>;
}

export type GiftCard = Node & {
  __typename?: "GiftCard";
  code?: Maybe<Scalars["String"]>;
  created: Scalars["DateTime"];
  currentBalance?: Maybe<Money>;
  displayCode?: Maybe<Scalars["String"]>;
  endDate?: Maybe<Scalars["Date"]>;
  id: Scalars["ID"];
  initialBalance?: Maybe<Money>;
  isActive: Scalars["Boolean"];
  lastUsedOn?: Maybe<Scalars["DateTime"]>;
  startDate: Scalars["Date"];
  user?: Maybe<User>;
};

export interface GiftCardActivate {
  __typename?: "GiftCardActivate";
  errors: GiftCardError[];
  giftCard?: Maybe<GiftCard>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: GiftCardError[];
}

export interface GiftCardCountableConnection {
  __typename?: "GiftCardCountableConnection";
  edges: GiftCardCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface GiftCardCountableEdge {
  __typename?: "GiftCardCountableEdge";
  cursor: Scalars["String"];
  node: GiftCard;
}

export interface GiftCardCreate {
  __typename?: "GiftCardCreate";
  errors: GiftCardError[];
  giftCard?: Maybe<GiftCard>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: GiftCardError[];
}

export interface GiftCardCreateInput {
  balance?: Maybe<Scalars["PositiveDecimal"]>;
  code?: Maybe<Scalars["String"]>;
  endDate?: Maybe<Scalars["Date"]>;
  startDate?: Maybe<Scalars["Date"]>;
  userEmail?: Maybe<Scalars["String"]>;
}

export interface GiftCardDeactivate {
  __typename?: "GiftCardDeactivate";
  errors: GiftCardError[];
  giftCard?: Maybe<GiftCard>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: GiftCardError[];
}

export interface GiftCardError {
  __typename?: "GiftCardError";
  code: GiftCardErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum GiftCardErrorCode {
  AlreadyExists = "ALREADY_EXISTS",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface GiftCardUpdate {
  __typename?: "GiftCardUpdate";
  errors: GiftCardError[];
  giftCard?: Maybe<GiftCard>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: GiftCardError[];
}

export interface GiftCardUpdateInput {
  balance?: Maybe<Scalars["PositiveDecimal"]>;
  endDate?: Maybe<Scalars["Date"]>;
  startDate?: Maybe<Scalars["Date"]>;
  userEmail?: Maybe<Scalars["String"]>;
}

export type Group = Node & {
  __typename?: "Group";
  id: Scalars["ID"];
  name: Scalars["String"];
  permissions?: Maybe<Array<Maybe<Permission>>>;
  userCanManage: Scalars["Boolean"];
  users?: Maybe<Array<Maybe<User>>>;
};

export interface GroupCountableConnection {
  __typename?: "GroupCountableConnection";
  edges: GroupCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface GroupCountableEdge {
  __typename?: "GroupCountableEdge";
  cursor: Scalars["String"];
  node: Group;
}

export interface Image {
  __typename?: "Image";
  alt?: Maybe<Scalars["String"]>;
  url: Scalars["String"];
}

export interface IntRangeInput {
  gte?: Maybe<Scalars["Int"]>;
  lte?: Maybe<Scalars["Int"]>;
}

export type Invoice = Job &
  Node &
  ObjectWithMetadata & {
    __typename?: "Invoice";
    createdAt: Scalars["DateTime"];
    externalUrl?: Maybe<Scalars["String"]>;
    id: Scalars["ID"];
    message?: Maybe<Scalars["String"]>;
    metadata: Array<Maybe<MetadataItem>>;
    number?: Maybe<Scalars["String"]>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    status: JobStatusEnum;
    updatedAt: Scalars["DateTime"];
    url?: Maybe<Scalars["String"]>;
  };

export interface InvoiceCreate {
  __typename?: "InvoiceCreate";
  errors: InvoiceError[];
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: InvoiceError[];
}

export interface InvoiceCreateInput {
  number: Scalars["String"];
  url: Scalars["String"];
}

export interface InvoiceDelete {
  __typename?: "InvoiceDelete";
  errors: InvoiceError[];
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: InvoiceError[];
}

export interface InvoiceError {
  __typename?: "InvoiceError";
  code: InvoiceErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum InvoiceErrorCode {
  EmailNotSet = "EMAIL_NOT_SET",
  InvalidStatus = "INVALID_STATUS",
  NotFound = "NOT_FOUND",
  NotReady = "NOT_READY",
  NumberNotSet = "NUMBER_NOT_SET",
  Required = "REQUIRED",
  UrlNotSet = "URL_NOT_SET",
}

export interface InvoiceRequest {
  __typename?: "InvoiceRequest";
  errors: InvoiceError[];
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: InvoiceError[];
  order?: Maybe<Order>;
}

export interface InvoiceRequestDelete {
  __typename?: "InvoiceRequestDelete";
  errors: InvoiceError[];
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: InvoiceError[];
}

export interface InvoiceSendNotification {
  __typename?: "InvoiceSendNotification";
  errors: InvoiceError[];
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: InvoiceError[];
}

export interface InvoiceUpdate {
  __typename?: "InvoiceUpdate";
  errors: InvoiceError[];
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: InvoiceError[];
}

export interface Job {
  createdAt: Scalars["DateTime"];
  message?: Maybe<Scalars["String"]>;
  status: JobStatusEnum;
  updatedAt: Scalars["DateTime"];
}

export enum JobStatusEnum {
  Deleted = "DELETED",
  Failed = "FAILED",
  Pending = "PENDING",
  Success = "SUCCESS",
}

export enum LanguageCodeEnum {
  Af = "AF",
  AfNa = "AF_NA",
  AfZa = "AF_ZA",
  Agq = "AGQ",
  AgqCm = "AGQ_CM",
  Ak = "AK",
  AkGh = "AK_GH",
  Am = "AM",
  AmEt = "AM_ET",
  Ar = "AR",
  ArAe = "AR_AE",
  ArBh = "AR_BH",
  ArDj = "AR_DJ",
  ArDz = "AR_DZ",
  ArEg = "AR_EG",
  ArEh = "AR_EH",
  ArEr = "AR_ER",
  ArIl = "AR_IL",
  ArIq = "AR_IQ",
  ArJo = "AR_JO",
  ArKm = "AR_KM",
  ArKw = "AR_KW",
  ArLb = "AR_LB",
  ArLy = "AR_LY",
  ArMa = "AR_MA",
  ArMr = "AR_MR",
  ArOm = "AR_OM",
  ArPs = "AR_PS",
  ArQa = "AR_QA",
  ArSa = "AR_SA",
  ArSd = "AR_SD",
  ArSo = "AR_SO",
  ArSs = "AR_SS",
  ArSy = "AR_SY",
  ArTd = "AR_TD",
  ArTn = "AR_TN",
  ArYe = "AR_YE",
  As = "AS",
  Asa = "ASA",
  AsaTz = "ASA_TZ",
  Ast = "AST",
  AstEs = "AST_ES",
  AsIn = "AS_IN",
  Az = "AZ",
  AzCyrl = "AZ_CYRL",
  AzCyrlAz = "AZ_CYRL_AZ",
  AzLatn = "AZ_LATN",
  AzLatnAz = "AZ_LATN_AZ",
  Bas = "BAS",
  BasCm = "BAS_CM",
  Be = "BE",
  Bem = "BEM",
  BemZm = "BEM_ZM",
  Bez = "BEZ",
  BezTz = "BEZ_TZ",
  BeBy = "BE_BY",
  Bg = "BG",
  BgBg = "BG_BG",
  Bm = "BM",
  BmMl = "BM_ML",
  Bn = "BN",
  BnBd = "BN_BD",
  BnIn = "BN_IN",
  Bo = "BO",
  BoCn = "BO_CN",
  BoIn = "BO_IN",
  Br = "BR",
  Brx = "BRX",
  BrxIn = "BRX_IN",
  BrFr = "BR_FR",
  Bs = "BS",
  BsCyrl = "BS_CYRL",
  BsCyrlBa = "BS_CYRL_BA",
  BsLatn = "BS_LATN",
  BsLatnBa = "BS_LATN_BA",
  Ca = "CA",
  CaAd = "CA_AD",
  CaEs = "CA_ES",
  CaEsValencia = "CA_ES_VALENCIA",
  CaFr = "CA_FR",
  CaIt = "CA_IT",
  Ccp = "CCP",
  CcpBd = "CCP_BD",
  CcpIn = "CCP_IN",
  Ce = "CE",
  Ceb = "CEB",
  CebPh = "CEB_PH",
  CeRu = "CE_RU",
  Cgg = "CGG",
  CggUg = "CGG_UG",
  Chr = "CHR",
  ChrUs = "CHR_US",
  Ckb = "CKB",
  CkbIq = "CKB_IQ",
  CkbIr = "CKB_IR",
  Cs = "CS",
  CsCz = "CS_CZ",
  Cu = "CU",
  CuRu = "CU_RU",
  Cy = "CY",
  CyGb = "CY_GB",
  Da = "DA",
  Dav = "DAV",
  DavKe = "DAV_KE",
  DaDk = "DA_DK",
  DaGl = "DA_GL",
  De = "DE",
  DeAt = "DE_AT",
  DeBe = "DE_BE",
  DeCh = "DE_CH",
  DeDe = "DE_DE",
  DeIt = "DE_IT",
  DeLi = "DE_LI",
  DeLu = "DE_LU",
  Dje = "DJE",
  DjeNe = "DJE_NE",
  Dsb = "DSB",
  DsbDe = "DSB_DE",
  Dua = "DUA",
  DuaCm = "DUA_CM",
  Dyo = "DYO",
  DyoSn = "DYO_SN",
  Dz = "DZ",
  DzBt = "DZ_BT",
  Ebu = "EBU",
  EbuKe = "EBU_KE",
  Ee = "EE",
  EeGh = "EE_GH",
  EeTg = "EE_TG",
  El = "EL",
  ElCy = "EL_CY",
  ElGr = "EL_GR",
  En = "EN",
  EnAe = "EN_AE",
  EnAg = "EN_AG",
  EnAi = "EN_AI",
  EnAs = "EN_AS",
  EnAt = "EN_AT",
  EnAu = "EN_AU",
  EnBb = "EN_BB",
  EnBe = "EN_BE",
  EnBi = "EN_BI",
  EnBm = "EN_BM",
  EnBs = "EN_BS",
  EnBw = "EN_BW",
  EnBz = "EN_BZ",
  EnCa = "EN_CA",
  EnCc = "EN_CC",
  EnCh = "EN_CH",
  EnCk = "EN_CK",
  EnCm = "EN_CM",
  EnCx = "EN_CX",
  EnCy = "EN_CY",
  EnDe = "EN_DE",
  EnDg = "EN_DG",
  EnDk = "EN_DK",
  EnDm = "EN_DM",
  EnEr = "EN_ER",
  EnFi = "EN_FI",
  EnFj = "EN_FJ",
  EnFk = "EN_FK",
  EnFm = "EN_FM",
  EnGb = "EN_GB",
  EnGd = "EN_GD",
  EnGg = "EN_GG",
  EnGh = "EN_GH",
  EnGi = "EN_GI",
  EnGm = "EN_GM",
  EnGu = "EN_GU",
  EnGy = "EN_GY",
  EnHk = "EN_HK",
  EnIe = "EN_IE",
  EnIl = "EN_IL",
  EnIm = "EN_IM",
  EnIn = "EN_IN",
  EnIo = "EN_IO",
  EnJe = "EN_JE",
  EnJm = "EN_JM",
  EnKe = "EN_KE",
  EnKi = "EN_KI",
  EnKn = "EN_KN",
  EnKy = "EN_KY",
  EnLc = "EN_LC",
  EnLr = "EN_LR",
  EnLs = "EN_LS",
  EnMg = "EN_MG",
  EnMh = "EN_MH",
  EnMo = "EN_MO",
  EnMp = "EN_MP",
  EnMs = "EN_MS",
  EnMt = "EN_MT",
  EnMu = "EN_MU",
  EnMw = "EN_MW",
  EnMy = "EN_MY",
  EnNa = "EN_NA",
  EnNf = "EN_NF",
  EnNg = "EN_NG",
  EnNl = "EN_NL",
  EnNr = "EN_NR",
  EnNu = "EN_NU",
  EnNz = "EN_NZ",
  EnPg = "EN_PG",
  EnPh = "EN_PH",
  EnPk = "EN_PK",
  EnPn = "EN_PN",
  EnPr = "EN_PR",
  EnPw = "EN_PW",
  EnRw = "EN_RW",
  EnSb = "EN_SB",
  EnSc = "EN_SC",
  EnSd = "EN_SD",
  EnSe = "EN_SE",
  EnSg = "EN_SG",
  EnSh = "EN_SH",
  EnSi = "EN_SI",
  EnSl = "EN_SL",
  EnSs = "EN_SS",
  EnSx = "EN_SX",
  EnSz = "EN_SZ",
  EnTc = "EN_TC",
  EnTk = "EN_TK",
  EnTo = "EN_TO",
  EnTt = "EN_TT",
  EnTv = "EN_TV",
  EnTz = "EN_TZ",
  EnUg = "EN_UG",
  EnUm = "EN_UM",
  EnUs = "EN_US",
  EnVc = "EN_VC",
  EnVg = "EN_VG",
  EnVi = "EN_VI",
  EnVu = "EN_VU",
  EnWs = "EN_WS",
  EnZa = "EN_ZA",
  EnZm = "EN_ZM",
  EnZw = "EN_ZW",
  Eo = "EO",
  Es = "ES",
  EsAr = "ES_AR",
  EsBo = "ES_BO",
  EsBr = "ES_BR",
  EsBz = "ES_BZ",
  EsCl = "ES_CL",
  EsCo = "ES_CO",
  EsCr = "ES_CR",
  EsCu = "ES_CU",
  EsDo = "ES_DO",
  EsEa = "ES_EA",
  EsEc = "ES_EC",
  EsEs = "ES_ES",
  EsGq = "ES_GQ",
  EsGt = "ES_GT",
  EsHn = "ES_HN",
  EsIc = "ES_IC",
  EsMx = "ES_MX",
  EsNi = "ES_NI",
  EsPa = "ES_PA",
  EsPe = "ES_PE",
  EsPh = "ES_PH",
  EsPr = "ES_PR",
  EsPy = "ES_PY",
  EsSv = "ES_SV",
  EsUs = "ES_US",
  EsUy = "ES_UY",
  EsVe = "ES_VE",
  Et = "ET",
  EtEe = "ET_EE",
  Eu = "EU",
  EuEs = "EU_ES",
  Ewo = "EWO",
  EwoCm = "EWO_CM",
  Fa = "FA",
  FaAf = "FA_AF",
  FaIr = "FA_IR",
  Ff = "FF",
  FfAdlm = "FF_ADLM",
  FfAdlmBf = "FF_ADLM_BF",
  FfAdlmCm = "FF_ADLM_CM",
  FfAdlmGh = "FF_ADLM_GH",
  FfAdlmGm = "FF_ADLM_GM",
  FfAdlmGn = "FF_ADLM_GN",
  FfAdlmGw = "FF_ADLM_GW",
  FfAdlmLr = "FF_ADLM_LR",
  FfAdlmMr = "FF_ADLM_MR",
  FfAdlmNe = "FF_ADLM_NE",
  FfAdlmNg = "FF_ADLM_NG",
  FfAdlmSl = "FF_ADLM_SL",
  FfAdlmSn = "FF_ADLM_SN",
  FfLatn = "FF_LATN",
  FfLatnBf = "FF_LATN_BF",
  FfLatnCm = "FF_LATN_CM",
  FfLatnGh = "FF_LATN_GH",
  FfLatnGm = "FF_LATN_GM",
  FfLatnGn = "FF_LATN_GN",
  FfLatnGw = "FF_LATN_GW",
  FfLatnLr = "FF_LATN_LR",
  FfLatnMr = "FF_LATN_MR",
  FfLatnNe = "FF_LATN_NE",
  FfLatnNg = "FF_LATN_NG",
  FfLatnSl = "FF_LATN_SL",
  FfLatnSn = "FF_LATN_SN",
  Fi = "FI",
  Fil = "FIL",
  FilPh = "FIL_PH",
  FiFi = "FI_FI",
  Fo = "FO",
  FoDk = "FO_DK",
  FoFo = "FO_FO",
  Fr = "FR",
  FrBe = "FR_BE",
  FrBf = "FR_BF",
  FrBi = "FR_BI",
  FrBj = "FR_BJ",
  FrBl = "FR_BL",
  FrCa = "FR_CA",
  FrCd = "FR_CD",
  FrCf = "FR_CF",
  FrCg = "FR_CG",
  FrCh = "FR_CH",
  FrCi = "FR_CI",
  FrCm = "FR_CM",
  FrDj = "FR_DJ",
  FrDz = "FR_DZ",
  FrFr = "FR_FR",
  FrGa = "FR_GA",
  FrGf = "FR_GF",
  FrGn = "FR_GN",
  FrGp = "FR_GP",
  FrGq = "FR_GQ",
  FrHt = "FR_HT",
  FrKm = "FR_KM",
  FrLu = "FR_LU",
  FrMa = "FR_MA",
  FrMc = "FR_MC",
  FrMf = "FR_MF",
  FrMg = "FR_MG",
  FrMl = "FR_ML",
  FrMq = "FR_MQ",
  FrMr = "FR_MR",
  FrMu = "FR_MU",
  FrNc = "FR_NC",
  FrNe = "FR_NE",
  FrPf = "FR_PF",
  FrPm = "FR_PM",
  FrRe = "FR_RE",
  FrRw = "FR_RW",
  FrSc = "FR_SC",
  FrSn = "FR_SN",
  FrSy = "FR_SY",
  FrTd = "FR_TD",
  FrTg = "FR_TG",
  FrTn = "FR_TN",
  FrVu = "FR_VU",
  FrWf = "FR_WF",
  FrYt = "FR_YT",
  Fur = "FUR",
  FurIt = "FUR_IT",
  Fy = "FY",
  FyNl = "FY_NL",
  Ga = "GA",
  GaGb = "GA_GB",
  GaIe = "GA_IE",
  Gd = "GD",
  GdGb = "GD_GB",
  Gl = "GL",
  GlEs = "GL_ES",
  Gsw = "GSW",
  GswCh = "GSW_CH",
  GswFr = "GSW_FR",
  GswLi = "GSW_LI",
  Gu = "GU",
  Guz = "GUZ",
  GuzKe = "GUZ_KE",
  GuIn = "GU_IN",
  Gv = "GV",
  GvIm = "GV_IM",
  Ha = "HA",
  Haw = "HAW",
  HawUs = "HAW_US",
  HaGh = "HA_GH",
  HaNe = "HA_NE",
  HaNg = "HA_NG",
  He = "HE",
  HeIl = "HE_IL",
  Hi = "HI",
  HiIn = "HI_IN",
  Hr = "HR",
  HrBa = "HR_BA",
  HrHr = "HR_HR",
  Hsb = "HSB",
  HsbDe = "HSB_DE",
  Hu = "HU",
  HuHu = "HU_HU",
  Hy = "HY",
  HyAm = "HY_AM",
  Ia = "IA",
  Id = "ID",
  IdId = "ID_ID",
  Ig = "IG",
  IgNg = "IG_NG",
  Ii = "II",
  IiCn = "II_CN",
  Is = "IS",
  IsIs = "IS_IS",
  It = "IT",
  ItCh = "IT_CH",
  ItIt = "IT_IT",
  ItSm = "IT_SM",
  ItVa = "IT_VA",
  Ja = "JA",
  JaJp = "JA_JP",
  Jgo = "JGO",
  JgoCm = "JGO_CM",
  Jmc = "JMC",
  JmcTz = "JMC_TZ",
  Jv = "JV",
  JvId = "JV_ID",
  Ka = "KA",
  Kab = "KAB",
  KabDz = "KAB_DZ",
  Kam = "KAM",
  KamKe = "KAM_KE",
  KaGe = "KA_GE",
  Kde = "KDE",
  KdeTz = "KDE_TZ",
  Kea = "KEA",
  KeaCv = "KEA_CV",
  Khq = "KHQ",
  KhqMl = "KHQ_ML",
  Ki = "KI",
  KiKe = "KI_KE",
  Kk = "KK",
  Kkj = "KKJ",
  KkjCm = "KKJ_CM",
  KkKz = "KK_KZ",
  Kl = "KL",
  Kln = "KLN",
  KlnKe = "KLN_KE",
  KlGl = "KL_GL",
  Km = "KM",
  KmKh = "KM_KH",
  Kn = "KN",
  KnIn = "KN_IN",
  Ko = "KO",
  Kok = "KOK",
  KokIn = "KOK_IN",
  KoKp = "KO_KP",
  KoKr = "KO_KR",
  Ks = "KS",
  Ksb = "KSB",
  KsbTz = "KSB_TZ",
  Ksf = "KSF",
  KsfCm = "KSF_CM",
  Ksh = "KSH",
  KshDe = "KSH_DE",
  KsArab = "KS_ARAB",
  KsArabIn = "KS_ARAB_IN",
  Ku = "KU",
  KuTr = "KU_TR",
  Kw = "KW",
  KwGb = "KW_GB",
  Ky = "KY",
  KyKg = "KY_KG",
  Lag = "LAG",
  LagTz = "LAG_TZ",
  Lb = "LB",
  LbLu = "LB_LU",
  Lg = "LG",
  LgUg = "LG_UG",
  Lkt = "LKT",
  LktUs = "LKT_US",
  Ln = "LN",
  LnAo = "LN_AO",
  LnCd = "LN_CD",
  LnCf = "LN_CF",
  LnCg = "LN_CG",
  Lo = "LO",
  LoLa = "LO_LA",
  Lrc = "LRC",
  LrcIq = "LRC_IQ",
  LrcIr = "LRC_IR",
  Lt = "LT",
  LtLt = "LT_LT",
  Lu = "LU",
  Luo = "LUO",
  LuoKe = "LUO_KE",
  Luy = "LUY",
  LuyKe = "LUY_KE",
  LuCd = "LU_CD",
  Lv = "LV",
  LvLv = "LV_LV",
  Mai = "MAI",
  MaiIn = "MAI_IN",
  Mas = "MAS",
  MasKe = "MAS_KE",
  MasTz = "MAS_TZ",
  Mer = "MER",
  MerKe = "MER_KE",
  Mfe = "MFE",
  MfeMu = "MFE_MU",
  Mg = "MG",
  Mgh = "MGH",
  MghMz = "MGH_MZ",
  Mgo = "MGO",
  MgoCm = "MGO_CM",
  MgMg = "MG_MG",
  Mi = "MI",
  MiNz = "MI_NZ",
  Mk = "MK",
  MkMk = "MK_MK",
  Ml = "ML",
  MlIn = "ML_IN",
  Mn = "MN",
  Mni = "MNI",
  MniBeng = "MNI_BENG",
  MniBengIn = "MNI_BENG_IN",
  MnMn = "MN_MN",
  Mr = "MR",
  MrIn = "MR_IN",
  Ms = "MS",
  MsBn = "MS_BN",
  MsId = "MS_ID",
  MsMy = "MS_MY",
  MsSg = "MS_SG",
  Mt = "MT",
  MtMt = "MT_MT",
  Mua = "MUA",
  MuaCm = "MUA_CM",
  My = "MY",
  MyMm = "MY_MM",
  Mzn = "MZN",
  MznIr = "MZN_IR",
  Naq = "NAQ",
  NaqNa = "NAQ_NA",
  Nb = "NB",
  NbNo = "NB_NO",
  NbSj = "NB_SJ",
  Nd = "ND",
  Nds = "NDS",
  NdsDe = "NDS_DE",
  NdsNl = "NDS_NL",
  NdZw = "ND_ZW",
  Ne = "NE",
  NeIn = "NE_IN",
  NeNp = "NE_NP",
  Nl = "NL",
  NlAw = "NL_AW",
  NlBe = "NL_BE",
  NlBq = "NL_BQ",
  NlCw = "NL_CW",
  NlNl = "NL_NL",
  NlSr = "NL_SR",
  NlSx = "NL_SX",
  Nmg = "NMG",
  NmgCm = "NMG_CM",
  Nn = "NN",
  Nnh = "NNH",
  NnhCm = "NNH_CM",
  NnNo = "NN_NO",
  Nus = "NUS",
  NusSs = "NUS_SS",
  Nyn = "NYN",
  NynUg = "NYN_UG",
  Om = "OM",
  OmEt = "OM_ET",
  OmKe = "OM_KE",
  Or = "OR",
  OrIn = "OR_IN",
  Os = "OS",
  OsGe = "OS_GE",
  OsRu = "OS_RU",
  Pa = "PA",
  PaArab = "PA_ARAB",
  PaArabPk = "PA_ARAB_PK",
  PaGuru = "PA_GURU",
  PaGuruIn = "PA_GURU_IN",
  Pcm = "PCM",
  PcmNg = "PCM_NG",
  Pl = "PL",
  PlPl = "PL_PL",
  Prg = "PRG",
  Ps = "PS",
  PsAf = "PS_AF",
  PsPk = "PS_PK",
  Pt = "PT",
  PtAo = "PT_AO",
  PtBr = "PT_BR",
  PtCh = "PT_CH",
  PtCv = "PT_CV",
  PtGq = "PT_GQ",
  PtGw = "PT_GW",
  PtLu = "PT_LU",
  PtMo = "PT_MO",
  PtMz = "PT_MZ",
  PtPt = "PT_PT",
  PtSt = "PT_ST",
  PtTl = "PT_TL",
  Qu = "QU",
  QuBo = "QU_BO",
  QuEc = "QU_EC",
  QuPe = "QU_PE",
  Rm = "RM",
  RmCh = "RM_CH",
  Rn = "RN",
  RnBi = "RN_BI",
  Ro = "RO",
  Rof = "ROF",
  RofTz = "ROF_TZ",
  RoMd = "RO_MD",
  RoRo = "RO_RO",
  Ru = "RU",
  RuBy = "RU_BY",
  RuKg = "RU_KG",
  RuKz = "RU_KZ",
  RuMd = "RU_MD",
  RuRu = "RU_RU",
  RuUa = "RU_UA",
  Rw = "RW",
  Rwk = "RWK",
  RwkTz = "RWK_TZ",
  RwRw = "RW_RW",
  Sah = "SAH",
  SahRu = "SAH_RU",
  Saq = "SAQ",
  SaqKe = "SAQ_KE",
  Sat = "SAT",
  SatOlck = "SAT_OLCK",
  SatOlckIn = "SAT_OLCK_IN",
  Sbp = "SBP",
  SbpTz = "SBP_TZ",
  Sd = "SD",
  SdArab = "SD_ARAB",
  SdArabPk = "SD_ARAB_PK",
  SdDeva = "SD_DEVA",
  SdDevaIn = "SD_DEVA_IN",
  Se = "SE",
  Seh = "SEH",
  SehMz = "SEH_MZ",
  Ses = "SES",
  SesMl = "SES_ML",
  SeFi = "SE_FI",
  SeNo = "SE_NO",
  SeSe = "SE_SE",
  Sg = "SG",
  SgCf = "SG_CF",
  Shi = "SHI",
  ShiLatn = "SHI_LATN",
  ShiLatnMa = "SHI_LATN_MA",
  ShiTfng = "SHI_TFNG",
  ShiTfngMa = "SHI_TFNG_MA",
  Si = "SI",
  SiLk = "SI_LK",
  Sk = "SK",
  SkSk = "SK_SK",
  Sl = "SL",
  SlSi = "SL_SI",
  Smn = "SMN",
  SmnFi = "SMN_FI",
  Sn = "SN",
  SnZw = "SN_ZW",
  So = "SO",
  SoDj = "SO_DJ",
  SoEt = "SO_ET",
  SoKe = "SO_KE",
  SoSo = "SO_SO",
  Sq = "SQ",
  SqAl = "SQ_AL",
  SqMk = "SQ_MK",
  SqXk = "SQ_XK",
  Sr = "SR",
  SrCyrl = "SR_CYRL",
  SrCyrlBa = "SR_CYRL_BA",
  SrCyrlMe = "SR_CYRL_ME",
  SrCyrlRs = "SR_CYRL_RS",
  SrCyrlXk = "SR_CYRL_XK",
  SrLatn = "SR_LATN",
  SrLatnBa = "SR_LATN_BA",
  SrLatnMe = "SR_LATN_ME",
  SrLatnRs = "SR_LATN_RS",
  SrLatnXk = "SR_LATN_XK",
  Su = "SU",
  SuLatn = "SU_LATN",
  SuLatnId = "SU_LATN_ID",
  Sv = "SV",
  SvAx = "SV_AX",
  SvFi = "SV_FI",
  SvSe = "SV_SE",
  Sw = "SW",
  SwCd = "SW_CD",
  SwKe = "SW_KE",
  SwTz = "SW_TZ",
  SwUg = "SW_UG",
  Ta = "TA",
  TaIn = "TA_IN",
  TaLk = "TA_LK",
  TaMy = "TA_MY",
  TaSg = "TA_SG",
  Te = "TE",
  Teo = "TEO",
  TeoKe = "TEO_KE",
  TeoUg = "TEO_UG",
  TeIn = "TE_IN",
  Tg = "TG",
  TgTj = "TG_TJ",
  Th = "TH",
  ThTh = "TH_TH",
  Ti = "TI",
  TiEr = "TI_ER",
  TiEt = "TI_ET",
  Tk = "TK",
  TkTm = "TK_TM",
  To = "TO",
  ToTo = "TO_TO",
  Tr = "TR",
  TrCy = "TR_CY",
  TrTr = "TR_TR",
  Tt = "TT",
  TtRu = "TT_RU",
  Twq = "TWQ",
  TwqNe = "TWQ_NE",
  Tzm = "TZM",
  TzmMa = "TZM_MA",
  Ug = "UG",
  UgCn = "UG_CN",
  Uk = "UK",
  UkUa = "UK_UA",
  Ur = "UR",
  UrIn = "UR_IN",
  UrPk = "UR_PK",
  Uz = "UZ",
  UzArab = "UZ_ARAB",
  UzArabAf = "UZ_ARAB_AF",
  UzCyrl = "UZ_CYRL",
  UzCyrlUz = "UZ_CYRL_UZ",
  UzLatn = "UZ_LATN",
  UzLatnUz = "UZ_LATN_UZ",
  Vai = "VAI",
  VaiLatn = "VAI_LATN",
  VaiLatnLr = "VAI_LATN_LR",
  VaiVaii = "VAI_VAII",
  VaiVaiiLr = "VAI_VAII_LR",
  Vi = "VI",
  ViVn = "VI_VN",
  Vo = "VO",
  Vun = "VUN",
  VunTz = "VUN_TZ",
  Wae = "WAE",
  WaeCh = "WAE_CH",
  Wo = "WO",
  WoSn = "WO_SN",
  Xh = "XH",
  XhZa = "XH_ZA",
  Xog = "XOG",
  XogUg = "XOG_UG",
  Yav = "YAV",
  YavCm = "YAV_CM",
  Yi = "YI",
  Yo = "YO",
  YoBj = "YO_BJ",
  YoNg = "YO_NG",
  Yue = "YUE",
  YueHans = "YUE_HANS",
  YueHansCn = "YUE_HANS_CN",
  YueHant = "YUE_HANT",
  YueHantHk = "YUE_HANT_HK",
  Zgh = "ZGH",
  ZghMa = "ZGH_MA",
  Zh = "ZH",
  ZhHans = "ZH_HANS",
  ZhHansCn = "ZH_HANS_CN",
  ZhHansHk = "ZH_HANS_HK",
  ZhHansMo = "ZH_HANS_MO",
  ZhHansSg = "ZH_HANS_SG",
  ZhHant = "ZH_HANT",
  ZhHantHk = "ZH_HANT_HK",
  ZhHantMo = "ZH_HANT_MO",
  ZhHantTw = "ZH_HANT_TW",
  Zu = "ZU",
  ZuZa = "ZU_ZA",
}

export interface LanguageDisplay {
  __typename?: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: Scalars["String"];
}

export interface LimitInfo {
  __typename?: "LimitInfo";
  allowedUsage: Limits;
  currentUsage: Limits;
}

export interface Limits {
  __typename?: "Limits";
  channels?: Maybe<Scalars["Int"]>;
  orders?: Maybe<Scalars["Int"]>;
  productVariants?: Maybe<Scalars["Int"]>;
  staffUsers?: Maybe<Scalars["Int"]>;
  warehouses?: Maybe<Scalars["Int"]>;
}

export interface Manifest {
  __typename?: "Manifest";
  about?: Maybe<Scalars["String"]>;
  appUrl?: Maybe<Scalars["String"]>;
  configurationUrl?: Maybe<Scalars["String"]>;
  dataPrivacy?: Maybe<Scalars["String"]>;
  dataPrivacyUrl?: Maybe<Scalars["String"]>;
  homepageUrl?: Maybe<Scalars["String"]>;
  identifier: Scalars["String"];
  name: Scalars["String"];
  permissions?: Maybe<Array<Maybe<Permission>>>;
  supportUrl?: Maybe<Scalars["String"]>;
  tokenTargetUrl?: Maybe<Scalars["String"]>;
  version: Scalars["String"];
}

export interface Margin {
  __typename?: "Margin";
  start?: Maybe<Scalars["Int"]>;
  stop?: Maybe<Scalars["Int"]>;
}

export enum MeasurementUnitsEnum {
  AcreFt = "ACRE_FT",
  AcreIn = "ACRE_IN",
  Cm = "CM",
  CubicCentimeter = "CUBIC_CENTIMETER",
  CubicDecimeter = "CUBIC_DECIMETER",
  CubicFoot = "CUBIC_FOOT",
  CubicInch = "CUBIC_INCH",
  CubicMeter = "CUBIC_METER",
  CubicMillimeter = "CUBIC_MILLIMETER",
  CubicYard = "CUBIC_YARD",
  FlOz = "FL_OZ",
  Ft = "FT",
  G = "G",
  Inch = "INCH",
  Kg = "KG",
  Km = "KM",
  Lb = "LB",
  Liter = "LITER",
  M = "M",
  Oz = "OZ",
  Pint = "PINT",
  Qt = "QT",
  SqCm = "SQ_CM",
  SqFt = "SQ_FT",
  SqInch = "SQ_INCH",
  SqKm = "SQ_KM",
  SqM = "SQ_M",
  SqYd = "SQ_YD",
  Tonne = "TONNE",
  Yd = "YD",
}

export type Menu = Node &
  ObjectWithMetadata & {
    __typename?: "Menu";
    id: Scalars["ID"];
    items?: Maybe<Array<Maybe<MenuItem>>>;
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    privateMetadata: Array<Maybe<MetadataItem>>;
    slug: Scalars["String"];
  };

export interface MenuBulkDelete {
  __typename?: "MenuBulkDelete";
  count: Scalars["Int"];
  errors: MenuError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: MenuError[];
}

export interface MenuCountableConnection {
  __typename?: "MenuCountableConnection";
  edges: MenuCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface MenuCountableEdge {
  __typename?: "MenuCountableEdge";
  cursor: Scalars["String"];
  node: Menu;
}

export interface MenuCreate {
  __typename?: "MenuCreate";
  errors: MenuError[];
  menu?: Maybe<Menu>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: MenuError[];
}

export interface MenuCreateInput {
  items?: Maybe<Array<Maybe<MenuItemInput>>>;
  name: Scalars["String"];
  slug?: Maybe<Scalars["String"]>;
}

export interface MenuDelete {
  __typename?: "MenuDelete";
  errors: MenuError[];
  menu?: Maybe<Menu>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: MenuError[];
}

export interface MenuError {
  __typename?: "MenuError";
  code: MenuErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum MenuErrorCode {
  CannotAssignNode = "CANNOT_ASSIGN_NODE",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  InvalidMenuItem = "INVALID_MENU_ITEM",
  NotFound = "NOT_FOUND",
  NoMenuItemProvided = "NO_MENU_ITEM_PROVIDED",
  Required = "REQUIRED",
  TooManyMenuItems = "TOO_MANY_MENU_ITEMS",
  Unique = "UNIQUE",
}

export interface MenuFilterInput {
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  search?: Maybe<Scalars["String"]>;
  slug?: Maybe<Array<Maybe<Scalars["String"]>>>;
}

export interface MenuInput {
  name?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
}

export type MenuItem = Node &
  ObjectWithMetadata & {
    __typename?: "MenuItem";
    category?: Maybe<Category>;
    children?: Maybe<Array<Maybe<MenuItem>>>;
    collection?: Maybe<Collection>;
    id: Scalars["ID"];
    level: Scalars["Int"];
    menu: Menu;
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    page?: Maybe<Page>;
    parent?: Maybe<MenuItem>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    translation?: Maybe<MenuItemTranslation>;
    url?: Maybe<Scalars["String"]>;
  };

export interface MenuItemTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface MenuItemBulkDelete {
  __typename?: "MenuItemBulkDelete";
  count: Scalars["Int"];
  errors: MenuError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: MenuError[];
}

export interface MenuItemCountableConnection {
  __typename?: "MenuItemCountableConnection";
  edges: MenuItemCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface MenuItemCountableEdge {
  __typename?: "MenuItemCountableEdge";
  cursor: Scalars["String"];
  node: MenuItem;
}

export interface MenuItemCreate {
  __typename?: "MenuItemCreate";
  errors: MenuError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: MenuError[];
  menuItem?: Maybe<MenuItem>;
}

export interface MenuItemCreateInput {
  category?: Maybe<Scalars["ID"]>;
  collection?: Maybe<Scalars["ID"]>;
  menu: Scalars["ID"];
  name: Scalars["String"];
  page?: Maybe<Scalars["ID"]>;
  parent?: Maybe<Scalars["ID"]>;
  url?: Maybe<Scalars["String"]>;
}

export interface MenuItemDelete {
  __typename?: "MenuItemDelete";
  errors: MenuError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: MenuError[];
  menuItem?: Maybe<MenuItem>;
}

export interface MenuItemFilterInput {
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  search?: Maybe<Scalars["String"]>;
}

export interface MenuItemInput {
  category?: Maybe<Scalars["ID"]>;
  collection?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  page?: Maybe<Scalars["ID"]>;
  url?: Maybe<Scalars["String"]>;
}

export interface MenuItemMove {
  __typename?: "MenuItemMove";
  errors: MenuError[];
  menu?: Maybe<Menu>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: MenuError[];
}

export interface MenuItemMoveInput {
  itemId: Scalars["ID"];
  parentId?: Maybe<Scalars["ID"]>;
  sortOrder?: Maybe<Scalars["Int"]>;
}

export interface MenuItemSortingInput {
  direction: OrderDirection;
  field: MenuItemsSortField;
}

export type MenuItemTranslatableContent = Node & {
  __typename?: "MenuItemTranslatableContent";
  id: Scalars["ID"];
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  menuItem?: Maybe<MenuItem>;
  name: Scalars["String"];
  translation?: Maybe<MenuItemTranslation>;
};

export interface MenuItemTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface MenuItemTranslate {
  __typename?: "MenuItemTranslate";
  errors: TranslationError[];
  menuItem?: Maybe<MenuItem>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export type MenuItemTranslation = Node & {
  __typename?: "MenuItemTranslation";
  id: Scalars["ID"];
  language: LanguageDisplay;
  name: Scalars["String"];
};

export interface MenuItemUpdate {
  __typename?: "MenuItemUpdate";
  errors: MenuError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: MenuError[];
  menuItem?: Maybe<MenuItem>;
}

export enum MenuItemsSortField {
  Name = "NAME",
}

export enum MenuSortField {
  ItemsCount = "ITEMS_COUNT",
  Name = "NAME",
}

export interface MenuSortingInput {
  direction: OrderDirection;
  field: MenuSortField;
}

export interface MenuUpdate {
  __typename?: "MenuUpdate";
  errors: MenuError[];
  menu?: Maybe<Menu>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: MenuError[];
}

export interface MetadataError {
  __typename?: "MetadataError";
  code: MetadataErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum MetadataErrorCode {
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
}

export interface MetadataFilter {
  key: Scalars["String"];
  value?: Maybe<Scalars["String"]>;
}

export interface MetadataInput {
  key: Scalars["String"];
  value: Scalars["String"];
}

export interface MetadataItem {
  __typename?: "MetadataItem";
  key: Scalars["String"];
  value: Scalars["String"];
}

export interface Money {
  __typename?: "Money";
  amount: Scalars["Float"];
  currency: Scalars["String"];
}

export interface MoneyRange {
  __typename?: "MoneyRange";
  start?: Maybe<Money>;
  stop?: Maybe<Money>;
}

export interface MoveProductInput {
  productId: Scalars["ID"];
  sortOrder?: Maybe<Scalars["Int"]>;
}

export interface Mutation {
  __typename?: "Mutation";
  accountAddressCreate?: Maybe<AccountAddressCreate>;
  accountAddressDelete?: Maybe<AccountAddressDelete>;
  accountAddressUpdate?: Maybe<AccountAddressUpdate>;
  accountDelete?: Maybe<AccountDelete>;
  accountRegister?: Maybe<AccountRegister>;
  accountRequestDeletion?: Maybe<AccountRequestDeletion>;
  accountSetDefaultAddress?: Maybe<AccountSetDefaultAddress>;
  accountUpdate?: Maybe<AccountUpdate>;
  addressCreate?: Maybe<AddressCreate>;
  addressDelete?: Maybe<AddressDelete>;
  addressSetDefault?: Maybe<AddressSetDefault>;
  addressUpdate?: Maybe<AddressUpdate>;
  appActivate?: Maybe<AppActivate>;
  appCreate?: Maybe<AppCreate>;
  appDeactivate?: Maybe<AppDeactivate>;
  appDelete?: Maybe<AppDelete>;
  appDeleteFailedInstallation?: Maybe<AppDeleteFailedInstallation>;
  appFetchManifest?: Maybe<AppFetchManifest>;
  appInstall?: Maybe<AppInstall>;
  appRetryInstall?: Maybe<AppRetryInstall>;
  appTokenCreate?: Maybe<AppTokenCreate>;
  appTokenDelete?: Maybe<AppTokenDelete>;
  appTokenVerify?: Maybe<AppTokenVerify>;
  appUpdate?: Maybe<AppUpdate>;
  assignNavigation?: Maybe<AssignNavigation>;
  assignWarehouseShippingZone?: Maybe<WarehouseShippingZoneAssign>;
  attributeBulkDelete?: Maybe<AttributeBulkDelete>;
  attributeCreate?: Maybe<AttributeCreate>;
  attributeDelete?: Maybe<AttributeDelete>;
  attributeReorderValues?: Maybe<AttributeReorderValues>;
  attributeTranslate?: Maybe<AttributeTranslate>;
  attributeUpdate?: Maybe<AttributeUpdate>;
  attributeValueBulkDelete?: Maybe<AttributeValueBulkDelete>;
  attributeValueCreate?: Maybe<AttributeValueCreate>;
  attributeValueDelete?: Maybe<AttributeValueDelete>;
  attributeValueTranslate?: Maybe<AttributeValueTranslate>;
  attributeValueUpdate?: Maybe<AttributeValueUpdate>;
  categoryBulkDelete?: Maybe<CategoryBulkDelete>;
  categoryCreate?: Maybe<CategoryCreate>;
  categoryDelete?: Maybe<CategoryDelete>;
  categoryTranslate?: Maybe<CategoryTranslate>;
  categoryUpdate?: Maybe<CategoryUpdate>;
  channelActivate?: Maybe<ChannelActivate>;
  channelCreate?: Maybe<ChannelCreate>;
  channelDeactivate?: Maybe<ChannelDeactivate>;
  channelDelete?: Maybe<ChannelDelete>;
  channelUpdate?: Maybe<ChannelUpdate>;
  checkoutAddPromoCode?: Maybe<CheckoutAddPromoCode>;
  checkoutBillingAddressUpdate?: Maybe<CheckoutBillingAddressUpdate>;
  checkoutComplete?: Maybe<CheckoutComplete>;
  checkoutCreate?: Maybe<CheckoutCreate>;
  checkoutCustomerAttach?: Maybe<CheckoutCustomerAttach>;
  checkoutCustomerDetach?: Maybe<CheckoutCustomerDetach>;
  checkoutEmailUpdate?: Maybe<CheckoutEmailUpdate>;
  checkoutLanguageCodeUpdate?: Maybe<CheckoutLanguageCodeUpdate>;
  checkoutLineDelete?: Maybe<CheckoutLineDelete>;
  checkoutLinesAdd?: Maybe<CheckoutLinesAdd>;
  checkoutLinesUpdate?: Maybe<CheckoutLinesUpdate>;
  checkoutPaymentCreate?: Maybe<CheckoutPaymentCreate>;
  checkoutRemovePromoCode?: Maybe<CheckoutRemovePromoCode>;
  checkoutShippingAddressUpdate?: Maybe<CheckoutShippingAddressUpdate>;
  checkoutShippingMethodUpdate?: Maybe<CheckoutShippingMethodUpdate>;
  collectionAddProducts?: Maybe<CollectionAddProducts>;
  collectionBulkDelete?: Maybe<CollectionBulkDelete>;
  collectionChannelListingUpdate?: Maybe<CollectionChannelListingUpdate>;
  collectionCreate?: Maybe<CollectionCreate>;
  collectionDelete?: Maybe<CollectionDelete>;
  collectionRemoveProducts?: Maybe<CollectionRemoveProducts>;
  collectionReorderProducts?: Maybe<CollectionReorderProducts>;
  collectionTranslate?: Maybe<CollectionTranslate>;
  collectionUpdate?: Maybe<CollectionUpdate>;
  confirmAccount?: Maybe<ConfirmAccount>;
  confirmEmailChange?: Maybe<ConfirmEmailChange>;
  createWarehouse?: Maybe<WarehouseCreate>;
  customerBulkDelete?: Maybe<CustomerBulkDelete>;
  customerCreate?: Maybe<CustomerCreate>;
  customerDelete?: Maybe<CustomerDelete>;
  customerUpdate?: Maybe<CustomerUpdate>;
  deleteMetadata?: Maybe<DeleteMetadata>;
  deletePrivateMetadata?: Maybe<DeletePrivateMetadata>;
  deleteWarehouse?: Maybe<WarehouseDelete>;
  digitalContentCreate?: Maybe<DigitalContentCreate>;
  digitalContentDelete?: Maybe<DigitalContentDelete>;
  digitalContentUpdate?: Maybe<DigitalContentUpdate>;
  digitalContentUrlCreate?: Maybe<DigitalContentUrlCreate>;
  draftOrderBulkDelete?: Maybe<DraftOrderBulkDelete>;
  draftOrderComplete?: Maybe<DraftOrderComplete>;
  draftOrderCreate?: Maybe<DraftOrderCreate>;
  draftOrderDelete?: Maybe<DraftOrderDelete>;
  draftOrderLinesBulkDelete?: Maybe<DraftOrderLinesBulkDelete>;
  draftOrderUpdate?: Maybe<DraftOrderUpdate>;
  exportProducts?: Maybe<ExportProducts>;
  externalAuthenticationUrl?: Maybe<ExternalAuthenticationUrl>;
  externalLogout?: Maybe<ExternalLogout>;
  externalObtainAccessTokens?: Maybe<ExternalObtainAccessTokens>;
  externalRefresh?: Maybe<ExternalRefresh>;
  externalVerify?: Maybe<ExternalVerify>;
  fileUpload?: Maybe<FileUpload>;
  giftCardActivate?: Maybe<GiftCardActivate>;
  giftCardCreate?: Maybe<GiftCardCreate>;
  giftCardDeactivate?: Maybe<GiftCardDeactivate>;
  giftCardUpdate?: Maybe<GiftCardUpdate>;
  invoiceCreate?: Maybe<InvoiceCreate>;
  invoiceDelete?: Maybe<InvoiceDelete>;
  invoiceRequest?: Maybe<InvoiceRequest>;
  invoiceRequestDelete?: Maybe<InvoiceRequestDelete>;
  invoiceSendNotification?: Maybe<InvoiceSendNotification>;
  invoiceUpdate?: Maybe<InvoiceUpdate>;
  menuBulkDelete?: Maybe<MenuBulkDelete>;
  menuCreate?: Maybe<MenuCreate>;
  menuDelete?: Maybe<MenuDelete>;
  menuItemBulkDelete?: Maybe<MenuItemBulkDelete>;
  menuItemCreate?: Maybe<MenuItemCreate>;
  menuItemDelete?: Maybe<MenuItemDelete>;
  menuItemMove?: Maybe<MenuItemMove>;
  menuItemTranslate?: Maybe<MenuItemTranslate>;
  menuItemUpdate?: Maybe<MenuItemUpdate>;
  menuUpdate?: Maybe<MenuUpdate>;
  orderAddNote?: Maybe<OrderAddNote>;
  orderBulkCancel?: Maybe<OrderBulkCancel>;
  orderCancel?: Maybe<OrderCancel>;
  orderCapture?: Maybe<OrderCapture>;
  orderConfirm?: Maybe<OrderConfirm>;
  orderDiscountAdd?: Maybe<OrderDiscountAdd>;
  orderDiscountDelete?: Maybe<OrderDiscountDelete>;
  orderDiscountUpdate?: Maybe<OrderDiscountUpdate>;
  orderFulfill?: Maybe<OrderFulfill>;
  orderFulfillmentCancel?: Maybe<FulfillmentCancel>;
  orderFulfillmentRefundProducts?: Maybe<FulfillmentRefundProducts>;
  orderFulfillmentReturnProducts?: Maybe<FulfillmentReturnProducts>;
  orderFulfillmentUpdateTracking?: Maybe<FulfillmentUpdateTracking>;
  orderLineDelete?: Maybe<OrderLineDelete>;
  orderLineDiscountRemove?: Maybe<OrderLineDiscountRemove>;
  orderLineDiscountUpdate?: Maybe<OrderLineDiscountUpdate>;
  orderLineUpdate?: Maybe<OrderLineUpdate>;
  orderLinesCreate?: Maybe<OrderLinesCreate>;
  orderMarkAsPaid?: Maybe<OrderMarkAsPaid>;
  orderRefund?: Maybe<OrderRefund>;
  orderSettingsUpdate?: Maybe<OrderSettingsUpdate>;
  orderUpdate?: Maybe<OrderUpdate>;
  orderUpdateShipping?: Maybe<OrderUpdateShipping>;
  orderVoid?: Maybe<OrderVoid>;
  pageAttributeAssign?: Maybe<PageAttributeAssign>;
  pageAttributeUnassign?: Maybe<PageAttributeUnassign>;
  pageBulkDelete?: Maybe<PageBulkDelete>;
  pageBulkPublish?: Maybe<PageBulkPublish>;
  pageCreate?: Maybe<PageCreate>;
  pageDelete?: Maybe<PageDelete>;
  pageReorderAttributeValues?: Maybe<PageReorderAttributeValues>;
  pageTranslate?: Maybe<PageTranslate>;
  pageTypeBulkDelete?: Maybe<PageTypeBulkDelete>;
  pageTypeCreate?: Maybe<PageTypeCreate>;
  pageTypeDelete?: Maybe<PageTypeDelete>;
  pageTypeReorderAttributes?: Maybe<PageTypeReorderAttributes>;
  pageTypeUpdate?: Maybe<PageTypeUpdate>;
  pageUpdate?: Maybe<PageUpdate>;
  passwordChange?: Maybe<PasswordChange>;
  paymentCapture?: Maybe<PaymentCapture>;
  paymentInitialize?: Maybe<PaymentInitialize>;
  paymentRefund?: Maybe<PaymentRefund>;
  paymentVoid?: Maybe<PaymentVoid>;
  permissionGroupCreate?: Maybe<PermissionGroupCreate>;
  permissionGroupDelete?: Maybe<PermissionGroupDelete>;
  permissionGroupUpdate?: Maybe<PermissionGroupUpdate>;
  pluginUpdate?: Maybe<PluginUpdate>;
  productAttributeAssign?: Maybe<ProductAttributeAssign>;
  productAttributeUnassign?: Maybe<ProductAttributeUnassign>;
  productBulkDelete?: Maybe<ProductBulkDelete>;
  productChannelListingUpdate?: Maybe<ProductChannelListingUpdate>;
  productCreate?: Maybe<ProductCreate>;
  productDelete?: Maybe<ProductDelete>;
  productMediaBulkDelete?: Maybe<ProductMediaBulkDelete>;
  productMediaCreate?: Maybe<ProductMediaCreate>;
  productMediaDelete?: Maybe<ProductMediaDelete>;
  productMediaReorder?: Maybe<ProductMediaReorder>;
  productMediaUpdate?: Maybe<ProductMediaUpdate>;
  productReorderAttributeValues?: Maybe<ProductReorderAttributeValues>;
  productTranslate?: Maybe<ProductTranslate>;
  productTypeBulkDelete?: Maybe<ProductTypeBulkDelete>;
  productTypeCreate?: Maybe<ProductTypeCreate>;
  productTypeDelete?: Maybe<ProductTypeDelete>;
  productTypeReorderAttributes?: Maybe<ProductTypeReorderAttributes>;
  productTypeUpdate?: Maybe<ProductTypeUpdate>;
  productUpdate?: Maybe<ProductUpdate>;
  productVariantBulkCreate?: Maybe<ProductVariantBulkCreate>;
  productVariantBulkDelete?: Maybe<ProductVariantBulkDelete>;
  productVariantChannelListingUpdate?: Maybe<ProductVariantChannelListingUpdate>;
  productVariantCreate?: Maybe<ProductVariantCreate>;
  productVariantDelete?: Maybe<ProductVariantDelete>;
  productVariantReorder?: Maybe<ProductVariantReorder>;
  productVariantReorderAttributeValues?: Maybe<ProductVariantReorderAttributeValues>;
  productVariantSetDefault?: Maybe<ProductVariantSetDefault>;
  productVariantStocksCreate?: Maybe<ProductVariantStocksCreate>;
  productVariantStocksDelete?: Maybe<ProductVariantStocksDelete>;
  productVariantStocksUpdate?: Maybe<ProductVariantStocksUpdate>;
  productVariantTranslate?: Maybe<ProductVariantTranslate>;
  productVariantUpdate?: Maybe<ProductVariantUpdate>;
  requestEmailChange?: Maybe<RequestEmailChange>;
  requestPasswordReset?: Maybe<RequestPasswordReset>;
  saleBulkDelete?: Maybe<SaleBulkDelete>;
  saleCataloguesAdd?: Maybe<SaleAddCatalogues>;
  saleCataloguesRemove?: Maybe<SaleRemoveCatalogues>;
  saleChannelListingUpdate?: Maybe<SaleChannelListingUpdate>;
  saleCreate?: Maybe<SaleCreate>;
  saleDelete?: Maybe<SaleDelete>;
  saleTranslate?: Maybe<SaleTranslate>;
  saleUpdate?: Maybe<SaleUpdate>;
  setPassword?: Maybe<SetPassword>;
  shippingMethodChannelListingUpdate?: Maybe<ShippingMethodChannelListingUpdate>;
  shippingPriceBulkDelete?: Maybe<ShippingPriceBulkDelete>;
  shippingPriceCreate?: Maybe<ShippingPriceCreate>;
  shippingPriceDelete?: Maybe<ShippingPriceDelete>;
  shippingPriceExcludeProducts?: Maybe<ShippingPriceExcludeProducts>;
  shippingPriceRemoveProductFromExclude?: Maybe<ShippingPriceRemoveProductFromExclude>;
  shippingPriceTranslate?: Maybe<ShippingPriceTranslate>;
  shippingPriceUpdate?: Maybe<ShippingPriceUpdate>;
  shippingZoneBulkDelete?: Maybe<ShippingZoneBulkDelete>;
  shippingZoneCreate?: Maybe<ShippingZoneCreate>;
  shippingZoneDelete?: Maybe<ShippingZoneDelete>;
  shippingZoneUpdate?: Maybe<ShippingZoneUpdate>;
  shopAddressUpdate?: Maybe<ShopAddressUpdate>;
  shopDomainUpdate?: Maybe<ShopDomainUpdate>;
  shopFetchTaxRates?: Maybe<ShopFetchTaxRates>;
  shopSettingsTranslate?: Maybe<ShopSettingsTranslate>;
  shopSettingsUpdate?: Maybe<ShopSettingsUpdate>;
  staffBulkDelete?: Maybe<StaffBulkDelete>;
  staffCreate?: Maybe<StaffCreate>;
  staffDelete?: Maybe<StaffDelete>;
  staffNotificationRecipientCreate?: Maybe<StaffNotificationRecipientCreate>;
  staffNotificationRecipientDelete?: Maybe<StaffNotificationRecipientDelete>;
  staffNotificationRecipientUpdate?: Maybe<StaffNotificationRecipientUpdate>;
  staffUpdate?: Maybe<StaffUpdate>;
  tokenCreate?: Maybe<CreateToken>;
  tokenRefresh?: Maybe<RefreshToken>;
  tokenVerify?: Maybe<VerifyToken>;
  tokensDeactivateAll?: Maybe<DeactivateAllUserTokens>;
  unassignWarehouseShippingZone?: Maybe<WarehouseShippingZoneUnassign>;
  updateMetadata?: Maybe<UpdateMetadata>;
  updatePrivateMetadata?: Maybe<UpdatePrivateMetadata>;
  updateWarehouse?: Maybe<WarehouseUpdate>;
  userAvatarDelete?: Maybe<UserAvatarDelete>;
  userAvatarUpdate?: Maybe<UserAvatarUpdate>;
  userBulkSetActive?: Maybe<UserBulkSetActive>;
  variantMediaAssign?: Maybe<VariantMediaAssign>;
  variantMediaUnassign?: Maybe<VariantMediaUnassign>;
  voucherBulkDelete?: Maybe<VoucherBulkDelete>;
  voucherCataloguesAdd?: Maybe<VoucherAddCatalogues>;
  voucherCataloguesRemove?: Maybe<VoucherRemoveCatalogues>;
  voucherChannelListingUpdate?: Maybe<VoucherChannelListingUpdate>;
  voucherCreate?: Maybe<VoucherCreate>;
  voucherDelete?: Maybe<VoucherDelete>;
  voucherTranslate?: Maybe<VoucherTranslate>;
  voucherUpdate?: Maybe<VoucherUpdate>;
  webhookCreate?: Maybe<WebhookCreate>;
  webhookDelete?: Maybe<WebhookDelete>;
  webhookUpdate?: Maybe<WebhookUpdate>;
}

export interface MutationAccountAddressCreateArgs {
  input: AddressInput;
  type?: Maybe<AddressTypeEnum>;
}

export interface MutationAccountAddressDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationAccountAddressUpdateArgs {
  id: Scalars["ID"];
  input: AddressInput;
}

export interface MutationAccountDeleteArgs {
  token: Scalars["String"];
}

export interface MutationAccountRegisterArgs {
  input: AccountRegisterInput;
}

export interface MutationAccountRequestDeletionArgs {
  channel?: Maybe<Scalars["String"]>;
  redirectUrl: Scalars["String"];
}

export interface MutationAccountSetDefaultAddressArgs {
  id: Scalars["ID"];
  type: AddressTypeEnum;
}

export interface MutationAccountUpdateArgs {
  input: AccountInput;
}

export interface MutationAddressCreateArgs {
  input: AddressInput;
  userId: Scalars["ID"];
}

export interface MutationAddressDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationAddressSetDefaultArgs {
  addressId: Scalars["ID"];
  type: AddressTypeEnum;
  userId: Scalars["ID"];
}

export interface MutationAddressUpdateArgs {
  id: Scalars["ID"];
  input: AddressInput;
}

export interface MutationAppActivateArgs {
  id: Scalars["ID"];
}

export interface MutationAppCreateArgs {
  input: AppInput;
}

export interface MutationAppDeactivateArgs {
  id: Scalars["ID"];
}

export interface MutationAppDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationAppDeleteFailedInstallationArgs {
  id: Scalars["ID"];
}

export interface MutationAppFetchManifestArgs {
  manifestUrl: Scalars["String"];
}

export interface MutationAppInstallArgs {
  input: AppInstallInput;
}

export interface MutationAppRetryInstallArgs {
  activateAfterInstallation?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
}

export interface MutationAppTokenCreateArgs {
  input: AppTokenInput;
}

export interface MutationAppTokenDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationAppTokenVerifyArgs {
  token: Scalars["String"];
}

export interface MutationAppUpdateArgs {
  id: Scalars["ID"];
  input: AppInput;
}

export interface MutationAssignNavigationArgs {
  menu?: Maybe<Scalars["ID"]>;
  navigationType: NavigationType;
}

export interface MutationAssignWarehouseShippingZoneArgs {
  id: Scalars["ID"];
  shippingZoneIds: Array<Scalars["ID"]>;
}

export interface MutationAttributeBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationAttributeCreateArgs {
  input: AttributeCreateInput;
}

export interface MutationAttributeDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationAttributeReorderValuesArgs {
  attributeId: Scalars["ID"];
  moves: Array<Maybe<ReorderInput>>;
}

export interface MutationAttributeTranslateArgs {
  id: Scalars["ID"];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationAttributeUpdateArgs {
  id: Scalars["ID"];
  input: AttributeUpdateInput;
}

export interface MutationAttributeValueBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationAttributeValueCreateArgs {
  attribute: Scalars["ID"];
  input: AttributeValueCreateInput;
}

export interface MutationAttributeValueDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationAttributeValueTranslateArgs {
  id: Scalars["ID"];
  input: AttributeValueTranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationAttributeValueUpdateArgs {
  id: Scalars["ID"];
  input: AttributeValueCreateInput;
}

export interface MutationCategoryBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationCategoryCreateArgs {
  input: CategoryInput;
  parent?: Maybe<Scalars["ID"]>;
}

export interface MutationCategoryDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationCategoryTranslateArgs {
  id: Scalars["ID"];
  input: TranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationCategoryUpdateArgs {
  id: Scalars["ID"];
  input: CategoryInput;
}

export interface MutationChannelActivateArgs {
  id: Scalars["ID"];
}

export interface MutationChannelCreateArgs {
  input: ChannelCreateInput;
}

export interface MutationChannelDeactivateArgs {
  id: Scalars["ID"];
}

export interface MutationChannelDeleteArgs {
  id: Scalars["ID"];
  input?: Maybe<ChannelDeleteInput>;
}

export interface MutationChannelUpdateArgs {
  id: Scalars["ID"];
  input: ChannelUpdateInput;
}

export interface MutationCheckoutAddPromoCodeArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  promoCode: Scalars["String"];
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutBillingAddressUpdateArgs {
  billingAddress: AddressInput;
  checkoutId?: Maybe<Scalars["ID"]>;
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutCompleteArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  paymentData?: Maybe<Scalars["JSONString"]>;
  redirectUrl?: Maybe<Scalars["String"]>;
  storeSource?: Maybe<Scalars["Boolean"]>;
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutCreateArgs {
  input: CheckoutCreateInput;
}

export interface MutationCheckoutCustomerAttachArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  customerId?: Maybe<Scalars["ID"]>;
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutCustomerDetachArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutEmailUpdateArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  email: Scalars["String"];
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutLanguageCodeUpdateArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  languageCode: LanguageCodeEnum;
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutLineDeleteArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  lineId?: Maybe<Scalars["ID"]>;
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutLinesAddArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  lines: Array<Maybe<CheckoutLineInput>>;
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutLinesUpdateArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  lines: Array<Maybe<CheckoutLineInput>>;
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutPaymentCreateArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  input: PaymentInput;
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutRemovePromoCodeArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  promoCode: Scalars["String"];
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutShippingAddressUpdateArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  shippingAddress: AddressInput;
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCheckoutShippingMethodUpdateArgs {
  checkoutId?: Maybe<Scalars["ID"]>;
  shippingMethodId: Scalars["ID"];
  token?: Maybe<Scalars["UUID"]>;
}

export interface MutationCollectionAddProductsArgs {
  collectionId: Scalars["ID"];
  products: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationCollectionBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationCollectionChannelListingUpdateArgs {
  id: Scalars["ID"];
  input: CollectionChannelListingUpdateInput;
}

export interface MutationCollectionCreateArgs {
  input: CollectionCreateInput;
}

export interface MutationCollectionDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationCollectionRemoveProductsArgs {
  collectionId: Scalars["ID"];
  products: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationCollectionReorderProductsArgs {
  collectionId: Scalars["ID"];
  moves: Array<Maybe<MoveProductInput>>;
}

export interface MutationCollectionTranslateArgs {
  id: Scalars["ID"];
  input: TranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationCollectionUpdateArgs {
  id: Scalars["ID"];
  input: CollectionInput;
}

export interface MutationConfirmAccountArgs {
  email: Scalars["String"];
  token: Scalars["String"];
}

export interface MutationConfirmEmailChangeArgs {
  channel?: Maybe<Scalars["String"]>;
  token: Scalars["String"];
}

export interface MutationCreateWarehouseArgs {
  input: WarehouseCreateInput;
}

export interface MutationCustomerBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationCustomerCreateArgs {
  input: UserCreateInput;
}

export interface MutationCustomerDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationCustomerUpdateArgs {
  id: Scalars["ID"];
  input: CustomerInput;
}

export interface MutationDeleteMetadataArgs {
  id: Scalars["ID"];
  keys: Array<Scalars["String"]>;
}

export interface MutationDeletePrivateMetadataArgs {
  id: Scalars["ID"];
  keys: Array<Scalars["String"]>;
}

export interface MutationDeleteWarehouseArgs {
  id: Scalars["ID"];
}

export interface MutationDigitalContentCreateArgs {
  input: DigitalContentUploadInput;
  variantId: Scalars["ID"];
}

export interface MutationDigitalContentDeleteArgs {
  variantId: Scalars["ID"];
}

export interface MutationDigitalContentUpdateArgs {
  input: DigitalContentInput;
  variantId: Scalars["ID"];
}

export interface MutationDigitalContentUrlCreateArgs {
  input: DigitalContentUrlCreateInput;
}

export interface MutationDraftOrderBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationDraftOrderCompleteArgs {
  id: Scalars["ID"];
}

export interface MutationDraftOrderCreateArgs {
  input: DraftOrderCreateInput;
}

export interface MutationDraftOrderDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationDraftOrderLinesBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationDraftOrderUpdateArgs {
  id: Scalars["ID"];
  input: DraftOrderInput;
}

export interface MutationExportProductsArgs {
  input: ExportProductsInput;
}

export interface MutationExternalAuthenticationUrlArgs {
  input: Scalars["JSONString"];
  pluginId: Scalars["String"];
}

export interface MutationExternalLogoutArgs {
  input: Scalars["JSONString"];
  pluginId: Scalars["String"];
}

export interface MutationExternalObtainAccessTokensArgs {
  input: Scalars["JSONString"];
  pluginId: Scalars["String"];
}

export interface MutationExternalRefreshArgs {
  input: Scalars["JSONString"];
  pluginId: Scalars["String"];
}

export interface MutationExternalVerifyArgs {
  input: Scalars["JSONString"];
  pluginId: Scalars["String"];
}

export interface MutationFileUploadArgs {
  file: Scalars["Upload"];
}

export interface MutationGiftCardActivateArgs {
  id: Scalars["ID"];
}

export interface MutationGiftCardCreateArgs {
  input: GiftCardCreateInput;
}

export interface MutationGiftCardDeactivateArgs {
  id: Scalars["ID"];
}

export interface MutationGiftCardUpdateArgs {
  id: Scalars["ID"];
  input: GiftCardUpdateInput;
}

export interface MutationInvoiceCreateArgs {
  input: InvoiceCreateInput;
  orderId: Scalars["ID"];
}

export interface MutationInvoiceDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationInvoiceRequestArgs {
  number?: Maybe<Scalars["String"]>;
  orderId: Scalars["ID"];
}

export interface MutationInvoiceRequestDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationInvoiceSendNotificationArgs {
  id: Scalars["ID"];
}

export interface MutationInvoiceUpdateArgs {
  id: Scalars["ID"];
  input: UpdateInvoiceInput;
}

export interface MutationMenuBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationMenuCreateArgs {
  input: MenuCreateInput;
}

export interface MutationMenuDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationMenuItemBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationMenuItemCreateArgs {
  input: MenuItemCreateInput;
}

export interface MutationMenuItemDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationMenuItemMoveArgs {
  menu: Scalars["ID"];
  moves: Array<Maybe<MenuItemMoveInput>>;
}

export interface MutationMenuItemTranslateArgs {
  id: Scalars["ID"];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationMenuItemUpdateArgs {
  id: Scalars["ID"];
  input: MenuItemInput;
}

export interface MutationMenuUpdateArgs {
  id: Scalars["ID"];
  input: MenuInput;
}

export interface MutationOrderAddNoteArgs {
  input: OrderAddNoteInput;
  order: Scalars["ID"];
}

export interface MutationOrderBulkCancelArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationOrderCancelArgs {
  id: Scalars["ID"];
}

export interface MutationOrderCaptureArgs {
  amount: Scalars["PositiveDecimal"];
  id: Scalars["ID"];
}

export interface MutationOrderConfirmArgs {
  id: Scalars["ID"];
}

export interface MutationOrderDiscountAddArgs {
  input: OrderDiscountCommonInput;
  orderId: Scalars["ID"];
}

export interface MutationOrderDiscountDeleteArgs {
  discountId: Scalars["ID"];
}

export interface MutationOrderDiscountUpdateArgs {
  discountId: Scalars["ID"];
  input: OrderDiscountCommonInput;
}

export interface MutationOrderFulfillArgs {
  input: OrderFulfillInput;
  order?: Maybe<Scalars["ID"]>;
}

export interface MutationOrderFulfillmentCancelArgs {
  id: Scalars["ID"];
  input: FulfillmentCancelInput;
}

export interface MutationOrderFulfillmentRefundProductsArgs {
  input: OrderRefundProductsInput;
  order: Scalars["ID"];
}

export interface MutationOrderFulfillmentReturnProductsArgs {
  input: OrderReturnProductsInput;
  order: Scalars["ID"];
}

export interface MutationOrderFulfillmentUpdateTrackingArgs {
  id: Scalars["ID"];
  input: FulfillmentUpdateTrackingInput;
}

export interface MutationOrderLineDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationOrderLineDiscountRemoveArgs {
  orderLineId: Scalars["ID"];
}

export interface MutationOrderLineDiscountUpdateArgs {
  input: OrderDiscountCommonInput;
  orderLineId: Scalars["ID"];
}

export interface MutationOrderLineUpdateArgs {
  id: Scalars["ID"];
  input: OrderLineInput;
}

export interface MutationOrderLinesCreateArgs {
  id: Scalars["ID"];
  input: Array<Maybe<OrderLineCreateInput>>;
}

export interface MutationOrderMarkAsPaidArgs {
  id: Scalars["ID"];
  transactionReference?: Maybe<Scalars["String"]>;
}

export interface MutationOrderRefundArgs {
  amount: Scalars["PositiveDecimal"];
  id: Scalars["ID"];
}

export interface MutationOrderSettingsUpdateArgs {
  input: OrderSettingsUpdateInput;
}

export interface MutationOrderUpdateArgs {
  id: Scalars["ID"];
  input: OrderUpdateInput;
}

export interface MutationOrderUpdateShippingArgs {
  input?: Maybe<OrderUpdateShippingInput>;
  order: Scalars["ID"];
}

export interface MutationOrderVoidArgs {
  id: Scalars["ID"];
}

export interface MutationPageAttributeAssignArgs {
  attributeIds: Array<Scalars["ID"]>;
  pageTypeId: Scalars["ID"];
}

export interface MutationPageAttributeUnassignArgs {
  attributeIds: Array<Scalars["ID"]>;
  pageTypeId: Scalars["ID"];
}

export interface MutationPageBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationPageBulkPublishArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
  isPublished: Scalars["Boolean"];
}

export interface MutationPageCreateArgs {
  input: PageCreateInput;
}

export interface MutationPageDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationPageReorderAttributeValuesArgs {
  attributeId: Scalars["ID"];
  moves: Array<Maybe<ReorderInput>>;
  pageId: Scalars["ID"];
}

export interface MutationPageTranslateArgs {
  id: Scalars["ID"];
  input: PageTranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationPageTypeBulkDeleteArgs {
  ids: Array<Scalars["ID"]>;
}

export interface MutationPageTypeCreateArgs {
  input: PageTypeCreateInput;
}

export interface MutationPageTypeDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationPageTypeReorderAttributesArgs {
  moves: ReorderInput[];
  pageTypeId: Scalars["ID"];
}

export interface MutationPageTypeUpdateArgs {
  id?: Maybe<Scalars["ID"]>;
  input: PageTypeUpdateInput;
}

export interface MutationPageUpdateArgs {
  id: Scalars["ID"];
  input: PageInput;
}

export interface MutationPasswordChangeArgs {
  newPassword: Scalars["String"];
  oldPassword: Scalars["String"];
}

export interface MutationPaymentCaptureArgs {
  amount?: Maybe<Scalars["PositiveDecimal"]>;
  paymentId: Scalars["ID"];
}

export interface MutationPaymentInitializeArgs {
  channel?: Maybe<Scalars["String"]>;
  gateway: Scalars["String"];
  paymentData?: Maybe<Scalars["JSONString"]>;
}

export interface MutationPaymentRefundArgs {
  amount?: Maybe<Scalars["PositiveDecimal"]>;
  paymentId: Scalars["ID"];
}

export interface MutationPaymentVoidArgs {
  paymentId: Scalars["ID"];
}

export interface MutationPermissionGroupCreateArgs {
  input: PermissionGroupCreateInput;
}

export interface MutationPermissionGroupDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationPermissionGroupUpdateArgs {
  id: Scalars["ID"];
  input: PermissionGroupUpdateInput;
}

export interface MutationPluginUpdateArgs {
  channelId?: Maybe<Scalars["ID"]>;
  id: Scalars["ID"];
  input: PluginUpdateInput;
}

export interface MutationProductAttributeAssignArgs {
  operations: Array<Maybe<ProductAttributeAssignInput>>;
  productTypeId: Scalars["ID"];
}

export interface MutationProductAttributeUnassignArgs {
  attributeIds: Array<Maybe<Scalars["ID"]>>;
  productTypeId: Scalars["ID"];
}

export interface MutationProductBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationProductChannelListingUpdateArgs {
  id: Scalars["ID"];
  input: ProductChannelListingUpdateInput;
}

export interface MutationProductCreateArgs {
  input: ProductCreateInput;
}

export interface MutationProductDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationProductMediaBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationProductMediaCreateArgs {
  input: ProductMediaCreateInput;
}

export interface MutationProductMediaDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationProductMediaReorderArgs {
  mediaIds: Array<Maybe<Scalars["ID"]>>;
  productId: Scalars["ID"];
}

export interface MutationProductMediaUpdateArgs {
  id: Scalars["ID"];
  input: ProductMediaUpdateInput;
}

export interface MutationProductReorderAttributeValuesArgs {
  attributeId: Scalars["ID"];
  moves: Array<Maybe<ReorderInput>>;
  productId: Scalars["ID"];
}

export interface MutationProductTranslateArgs {
  id: Scalars["ID"];
  input: TranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationProductTypeBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationProductTypeCreateArgs {
  input: ProductTypeInput;
}

export interface MutationProductTypeDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationProductTypeReorderAttributesArgs {
  moves: Array<Maybe<ReorderInput>>;
  productTypeId: Scalars["ID"];
  type: ProductAttributeType;
}

export interface MutationProductTypeUpdateArgs {
  id: Scalars["ID"];
  input: ProductTypeInput;
}

export interface MutationProductUpdateArgs {
  id: Scalars["ID"];
  input: ProductInput;
}

export interface MutationProductVariantBulkCreateArgs {
  product: Scalars["ID"];
  variants: Array<Maybe<ProductVariantBulkCreateInput>>;
}

export interface MutationProductVariantBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationProductVariantChannelListingUpdateArgs {
  id: Scalars["ID"];
  input: ProductVariantChannelListingAddInput[];
}

export interface MutationProductVariantCreateArgs {
  input: ProductVariantCreateInput;
}

export interface MutationProductVariantDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationProductVariantReorderArgs {
  moves: Array<Maybe<ReorderInput>>;
  productId: Scalars["ID"];
}

export interface MutationProductVariantReorderAttributeValuesArgs {
  attributeId: Scalars["ID"];
  moves: Array<Maybe<ReorderInput>>;
  variantId: Scalars["ID"];
}

export interface MutationProductVariantSetDefaultArgs {
  productId: Scalars["ID"];
  variantId: Scalars["ID"];
}

export interface MutationProductVariantStocksCreateArgs {
  stocks: StockInput[];
  variantId: Scalars["ID"];
}

export interface MutationProductVariantStocksDeleteArgs {
  variantId: Scalars["ID"];
  warehouseIds?: Maybe<Array<Scalars["ID"]>>;
}

export interface MutationProductVariantStocksUpdateArgs {
  stocks: StockInput[];
  variantId: Scalars["ID"];
}

export interface MutationProductVariantTranslateArgs {
  id: Scalars["ID"];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationProductVariantUpdateArgs {
  id: Scalars["ID"];
  input: ProductVariantInput;
}

export interface MutationRequestEmailChangeArgs {
  channel?: Maybe<Scalars["String"]>;
  newEmail: Scalars["String"];
  password: Scalars["String"];
  redirectUrl: Scalars["String"];
}

export interface MutationRequestPasswordResetArgs {
  channel?: Maybe<Scalars["String"]>;
  email: Scalars["String"];
  redirectUrl: Scalars["String"];
}

export interface MutationSaleBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationSaleCataloguesAddArgs {
  id: Scalars["ID"];
  input: CatalogueInput;
}

export interface MutationSaleCataloguesRemoveArgs {
  id: Scalars["ID"];
  input: CatalogueInput;
}

export interface MutationSaleChannelListingUpdateArgs {
  id: Scalars["ID"];
  input: SaleChannelListingInput;
}

export interface MutationSaleCreateArgs {
  input: SaleInput;
}

export interface MutationSaleDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationSaleTranslateArgs {
  id: Scalars["ID"];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationSaleUpdateArgs {
  id: Scalars["ID"];
  input: SaleInput;
}

export interface MutationSetPasswordArgs {
  email: Scalars["String"];
  password: Scalars["String"];
  token: Scalars["String"];
}

export interface MutationShippingMethodChannelListingUpdateArgs {
  id: Scalars["ID"];
  input: ShippingMethodChannelListingInput;
}

export interface MutationShippingPriceBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationShippingPriceCreateArgs {
  input: ShippingPriceInput;
}

export interface MutationShippingPriceDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationShippingPriceExcludeProductsArgs {
  id: Scalars["ID"];
  input: ShippingPriceExcludeProductsInput;
}

export interface MutationShippingPriceRemoveProductFromExcludeArgs {
  id: Scalars["ID"];
  products: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationShippingPriceTranslateArgs {
  id: Scalars["ID"];
  input: ShippingPriceTranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationShippingPriceUpdateArgs {
  id: Scalars["ID"];
  input: ShippingPriceInput;
}

export interface MutationShippingZoneBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationShippingZoneCreateArgs {
  input: ShippingZoneCreateInput;
}

export interface MutationShippingZoneDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationShippingZoneUpdateArgs {
  id: Scalars["ID"];
  input: ShippingZoneUpdateInput;
}

export interface MutationShopAddressUpdateArgs {
  input?: Maybe<AddressInput>;
}

export interface MutationShopDomainUpdateArgs {
  input?: Maybe<SiteDomainInput>;
}

export interface MutationShopSettingsTranslateArgs {
  input: ShopSettingsTranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationShopSettingsUpdateArgs {
  input: ShopSettingsInput;
}

export interface MutationStaffBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationStaffCreateArgs {
  input: StaffCreateInput;
}

export interface MutationStaffDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationStaffNotificationRecipientCreateArgs {
  input: StaffNotificationRecipientInput;
}

export interface MutationStaffNotificationRecipientDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationStaffNotificationRecipientUpdateArgs {
  id: Scalars["ID"];
  input: StaffNotificationRecipientInput;
}

export interface MutationStaffUpdateArgs {
  id: Scalars["ID"];
  input: StaffUpdateInput;
}

export interface MutationTokenCreateArgs {
  email: Scalars["String"];
  password: Scalars["String"];
}

export interface MutationTokenRefreshArgs {
  csrfToken?: Maybe<Scalars["String"]>;
  refreshToken?: Maybe<Scalars["String"]>;
}

export interface MutationTokenVerifyArgs {
  token: Scalars["String"];
}

export interface MutationUnassignWarehouseShippingZoneArgs {
  id: Scalars["ID"];
  shippingZoneIds: Array<Scalars["ID"]>;
}

export interface MutationUpdateMetadataArgs {
  id: Scalars["ID"];
  input: MetadataInput[];
}

export interface MutationUpdatePrivateMetadataArgs {
  id: Scalars["ID"];
  input: MetadataInput[];
}

export interface MutationUpdateWarehouseArgs {
  id: Scalars["ID"];
  input: WarehouseUpdateInput;
}

export interface MutationUserAvatarUpdateArgs {
  image: Scalars["Upload"];
}

export interface MutationUserBulkSetActiveArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
  isActive: Scalars["Boolean"];
}

export interface MutationVariantMediaAssignArgs {
  mediaId: Scalars["ID"];
  variantId: Scalars["ID"];
}

export interface MutationVariantMediaUnassignArgs {
  mediaId: Scalars["ID"];
  variantId: Scalars["ID"];
}

export interface MutationVoucherBulkDeleteArgs {
  ids: Array<Maybe<Scalars["ID"]>>;
}

export interface MutationVoucherCataloguesAddArgs {
  id: Scalars["ID"];
  input: CatalogueInput;
}

export interface MutationVoucherCataloguesRemoveArgs {
  id: Scalars["ID"];
  input: CatalogueInput;
}

export interface MutationVoucherChannelListingUpdateArgs {
  id: Scalars["ID"];
  input: VoucherChannelListingInput;
}

export interface MutationVoucherCreateArgs {
  input: VoucherInput;
}

export interface MutationVoucherDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationVoucherTranslateArgs {
  id: Scalars["ID"];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
}

export interface MutationVoucherUpdateArgs {
  id: Scalars["ID"];
  input: VoucherInput;
}

export interface MutationWebhookCreateArgs {
  input: WebhookCreateInput;
}

export interface MutationWebhookDeleteArgs {
  id: Scalars["ID"];
}

export interface MutationWebhookUpdateArgs {
  id: Scalars["ID"];
  input: WebhookUpdateInput;
}

export interface NameTranslationInput {
  name?: Maybe<Scalars["String"]>;
}

export enum NavigationType {
  Main = "MAIN",
  Secondary = "SECONDARY",
}

export interface Node {
  id: Scalars["ID"];
}

export interface ObjectWithMetadata {
  metadata: Array<Maybe<MetadataItem>>;
  privateMetadata: Array<Maybe<MetadataItem>>;
}

export type Order = Node &
  ObjectWithMetadata & {
    __typename?: "Order";
    actions: Array<Maybe<OrderAction>>;
    availableShippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
    billingAddress?: Maybe<Address>;
    canFinalize: Scalars["Boolean"];
    channel: Channel;
    created: Scalars["DateTime"];
    customerNote: Scalars["String"];
    /** @deprecated Use discounts field. This field will be removed in Saleor 4.0. */
    discount?: Maybe<Money>;
    /** @deprecated Use discounts field. This field will be removed in Saleor 4.0. */
    discountName?: Maybe<Scalars["String"]>;
    discounts?: Maybe<OrderDiscount[]>;
    displayGrossPrices: Scalars["Boolean"];
    errors: OrderError[];
    events?: Maybe<Array<Maybe<OrderEvent>>>;
    fulfillments: Array<Maybe<Fulfillment>>;
    giftCards?: Maybe<Array<Maybe<GiftCard>>>;
    id: Scalars["ID"];
    invoices?: Maybe<Array<Maybe<Invoice>>>;
    isPaid: Scalars["Boolean"];
    isShippingRequired: Scalars["Boolean"];
    /** @deprecated Use the `languageCodeEnum` field to fetch the language code. This field will be removed in Saleor 4.0. */
    languageCode: Scalars["String"];
    languageCodeEnum: LanguageCodeEnum;
    lines: Array<Maybe<OrderLine>>;
    metadata: Array<Maybe<MetadataItem>>;
    number?: Maybe<Scalars["String"]>;
    origin: OrderOriginEnum;
    original?: Maybe<Scalars["ID"]>;
    paymentStatus: PaymentChargeStatusEnum;
    paymentStatusDisplay: Scalars["String"];
    payments?: Maybe<Array<Maybe<Payment>>>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    redirectUrl?: Maybe<Scalars["String"]>;
    shippingAddress?: Maybe<Address>;
    shippingMethod?: Maybe<ShippingMethod>;
    shippingMethodName?: Maybe<Scalars["String"]>;
    shippingPrice: TaxedMoney;
    shippingTaxRate: Scalars["Float"];
    status: OrderStatus;
    statusDisplay?: Maybe<Scalars["String"]>;
    subtotal: TaxedMoney;
    token: Scalars["String"];
    total: TaxedMoney;
    totalAuthorized: Money;
    totalBalance: Money;
    totalCaptured: Money;
    trackingClientId: Scalars["String"];
    /** @deprecated Use discounts field. This field will be removed in Saleor 4.0. */
    translatedDiscountName?: Maybe<Scalars["String"]>;
    undiscountedTotal: TaxedMoney;
    user?: Maybe<User>;
    userEmail?: Maybe<Scalars["String"]>;
    voucher?: Maybe<Voucher>;
    weight?: Maybe<Weight>;
  };

export enum OrderAction {
  Capture = "CAPTURE",
  MarkAsPaid = "MARK_AS_PAID",
  Refund = "REFUND",
  Void = "VOID",
}

export interface OrderAddNote {
  __typename?: "OrderAddNote";
  errors: OrderError[];
  event?: Maybe<OrderEvent>;
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderAddNoteInput {
  message: Scalars["String"];
}

export interface OrderBulkCancel {
  __typename?: "OrderBulkCancel";
  count: Scalars["Int"];
  errors: OrderError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderCancel {
  __typename?: "OrderCancel";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderCapture {
  __typename?: "OrderCapture";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderConfirm {
  __typename?: "OrderConfirm";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderCountableConnection {
  __typename?: "OrderCountableConnection";
  edges: OrderCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface OrderCountableEdge {
  __typename?: "OrderCountableEdge";
  cursor: Scalars["String"];
  node: Order;
}

export enum OrderDirection {
  Asc = "ASC",
  Desc = "DESC",
}

export type OrderDiscount = Node & {
  __typename?: "OrderDiscount";
  amount: Money;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  reason?: Maybe<Scalars["String"]>;
  translatedName?: Maybe<Scalars["String"]>;
  type: OrderDiscountType;
  value: Scalars["PositiveDecimal"];
  valueType: DiscountValueTypeEnum;
};

export interface OrderDiscountAdd {
  __typename?: "OrderDiscountAdd";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderDiscountCommonInput {
  reason?: Maybe<Scalars["String"]>;
  value: Scalars["PositiveDecimal"];
  valueType: DiscountValueTypeEnum;
}

export interface OrderDiscountDelete {
  __typename?: "OrderDiscountDelete";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export enum OrderDiscountType {
  Manual = "MANUAL",
  Voucher = "VOUCHER",
}

export interface OrderDiscountUpdate {
  __typename?: "OrderDiscountUpdate";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderDraftFilterInput {
  channels?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  created?: Maybe<DateRangeInput>;
  customer?: Maybe<Scalars["String"]>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  search?: Maybe<Scalars["String"]>;
}

export interface OrderError {
  __typename?: "OrderError";
  addressType?: Maybe<AddressTypeEnum>;
  code: OrderErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  orderLines?: Maybe<Array<Scalars["ID"]>>;
  variants?: Maybe<Array<Scalars["ID"]>>;
  warehouse?: Maybe<Scalars["ID"]>;
}

export enum OrderErrorCode {
  BillingAddressNotSet = "BILLING_ADDRESS_NOT_SET",
  CannotCancelFulfillment = "CANNOT_CANCEL_FULFILLMENT",
  CannotCancelOrder = "CANNOT_CANCEL_ORDER",
  CannotDelete = "CANNOT_DELETE",
  CannotDiscount = "CANNOT_DISCOUNT",
  CannotRefund = "CANNOT_REFUND",
  CaptureInactivePayment = "CAPTURE_INACTIVE_PAYMENT",
  ChannelInactive = "CHANNEL_INACTIVE",
  DuplicatedInputItem = "DUPLICATED_INPUT_ITEM",
  FulfillOrderLine = "FULFILL_ORDER_LINE",
  GraphqlError = "GRAPHQL_ERROR",
  InsufficientStock = "INSUFFICIENT_STOCK",
  Invalid = "INVALID",
  InvalidQuantity = "INVALID_QUANTITY",
  NotAvailableInChannel = "NOT_AVAILABLE_IN_CHANNEL",
  NotEditable = "NOT_EDITABLE",
  NotFound = "NOT_FOUND",
  OrderNoShippingAddress = "ORDER_NO_SHIPPING_ADDRESS",
  PaymentError = "PAYMENT_ERROR",
  PaymentMissing = "PAYMENT_MISSING",
  ProductNotPublished = "PRODUCT_NOT_PUBLISHED",
  ProductUnavailableForPurchase = "PRODUCT_UNAVAILABLE_FOR_PURCHASE",
  Required = "REQUIRED",
  ShippingMethodNotApplicable = "SHIPPING_METHOD_NOT_APPLICABLE",
  ShippingMethodRequired = "SHIPPING_METHOD_REQUIRED",
  TaxError = "TAX_ERROR",
  Unique = "UNIQUE",
  VoidInactivePayment = "VOID_INACTIVE_PAYMENT",
  ZeroQuantity = "ZERO_QUANTITY",
}

export type OrderEvent = Node & {
  __typename?: "OrderEvent";
  amount?: Maybe<Scalars["Float"]>;
  app?: Maybe<App>;
  composedId?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["DateTime"]>;
  discount?: Maybe<OrderEventDiscountObject>;
  email?: Maybe<Scalars["String"]>;
  emailType?: Maybe<OrderEventsEmailsEnum>;
  fulfilledItems?: Maybe<Array<Maybe<FulfillmentLine>>>;
  id: Scalars["ID"];
  invoiceNumber?: Maybe<Scalars["String"]>;
  lines?: Maybe<Array<Maybe<OrderEventOrderLineObject>>>;
  message?: Maybe<Scalars["String"]>;
  orderNumber?: Maybe<Scalars["String"]>;
  oversoldItems?: Maybe<Array<Maybe<Scalars["String"]>>>;
  paymentGateway?: Maybe<Scalars["String"]>;
  paymentId?: Maybe<Scalars["String"]>;
  quantity?: Maybe<Scalars["Int"]>;
  relatedOrder?: Maybe<Order>;
  shippingCostsIncluded?: Maybe<Scalars["Boolean"]>;
  transactionReference?: Maybe<Scalars["String"]>;
  type?: Maybe<OrderEventsEnum>;
  user?: Maybe<User>;
  warehouse?: Maybe<Warehouse>;
};

export interface OrderEventCountableConnection {
  __typename?: "OrderEventCountableConnection";
  edges: OrderEventCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface OrderEventCountableEdge {
  __typename?: "OrderEventCountableEdge";
  cursor: Scalars["String"];
  node: OrderEvent;
}

export interface OrderEventDiscountObject {
  __typename?: "OrderEventDiscountObject";
  amount?: Maybe<Money>;
  oldAmount?: Maybe<Money>;
  oldValue?: Maybe<Scalars["PositiveDecimal"]>;
  oldValueType?: Maybe<DiscountValueTypeEnum>;
  reason?: Maybe<Scalars["String"]>;
  value: Scalars["PositiveDecimal"];
  valueType: DiscountValueTypeEnum;
}

export interface OrderEventOrderLineObject {
  __typename?: "OrderEventOrderLineObject";
  discount?: Maybe<OrderEventDiscountObject>;
  itemName?: Maybe<Scalars["String"]>;
  orderLine?: Maybe<OrderLine>;
  quantity?: Maybe<Scalars["Int"]>;
}

export enum OrderEventsEmailsEnum {
  Confirmed = "CONFIRMED",
  DigitalLinks = "DIGITAL_LINKS",
  FulfillmentConfirmation = "FULFILLMENT_CONFIRMATION",
  OrderCancel = "ORDER_CANCEL",
  OrderConfirmation = "ORDER_CONFIRMATION",
  OrderRefund = "ORDER_REFUND",
  PaymentConfirmation = "PAYMENT_CONFIRMATION",
  ShippingConfirmation = "SHIPPING_CONFIRMATION",
  TrackingUpdated = "TRACKING_UPDATED",
}

export enum OrderEventsEnum {
  AddedProducts = "ADDED_PRODUCTS",
  Canceled = "CANCELED",
  Confirmed = "CONFIRMED",
  DraftCreated = "DRAFT_CREATED",
  DraftCreatedFromReplace = "DRAFT_CREATED_FROM_REPLACE",
  EmailSent = "EMAIL_SENT",
  ExternalServiceNotification = "EXTERNAL_SERVICE_NOTIFICATION",
  FulfillmentCanceled = "FULFILLMENT_CANCELED",
  FulfillmentFulfilledItems = "FULFILLMENT_FULFILLED_ITEMS",
  FulfillmentRefunded = "FULFILLMENT_REFUNDED",
  FulfillmentReplaced = "FULFILLMENT_REPLACED",
  FulfillmentRestockedItems = "FULFILLMENT_RESTOCKED_ITEMS",
  FulfillmentReturned = "FULFILLMENT_RETURNED",
  InvoiceGenerated = "INVOICE_GENERATED",
  InvoiceRequested = "INVOICE_REQUESTED",
  InvoiceSent = "INVOICE_SENT",
  InvoiceUpdated = "INVOICE_UPDATED",
  NoteAdded = "NOTE_ADDED",
  OrderDiscountAdded = "ORDER_DISCOUNT_ADDED",
  OrderDiscountAutomaticallyUpdated = "ORDER_DISCOUNT_AUTOMATICALLY_UPDATED",
  OrderDiscountDeleted = "ORDER_DISCOUNT_DELETED",
  OrderDiscountUpdated = "ORDER_DISCOUNT_UPDATED",
  OrderFullyPaid = "ORDER_FULLY_PAID",
  OrderLineDiscountRemoved = "ORDER_LINE_DISCOUNT_REMOVED",
  OrderLineDiscountUpdated = "ORDER_LINE_DISCOUNT_UPDATED",
  OrderLineProductDeleted = "ORDER_LINE_PRODUCT_DELETED",
  OrderLineVariantDeleted = "ORDER_LINE_VARIANT_DELETED",
  OrderMarkedAsPaid = "ORDER_MARKED_AS_PAID",
  OrderReplacementCreated = "ORDER_REPLACEMENT_CREATED",
  Other = "OTHER",
  OversoldItems = "OVERSOLD_ITEMS",
  PaymentAuthorized = "PAYMENT_AUTHORIZED",
  PaymentCaptured = "PAYMENT_CAPTURED",
  PaymentFailed = "PAYMENT_FAILED",
  PaymentRefunded = "PAYMENT_REFUNDED",
  PaymentVoided = "PAYMENT_VOIDED",
  Placed = "PLACED",
  PlacedFromDraft = "PLACED_FROM_DRAFT",
  RemovedProducts = "REMOVED_PRODUCTS",
  TrackingUpdated = "TRACKING_UPDATED",
  UpdatedAddress = "UPDATED_ADDRESS",
}

export interface OrderFilterInput {
  channels?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  created?: Maybe<DateRangeInput>;
  customer?: Maybe<Scalars["String"]>;
  ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  paymentStatus?: Maybe<Array<Maybe<PaymentChargeStatusEnum>>>;
  search?: Maybe<Scalars["String"]>;
  status?: Maybe<Array<Maybe<OrderStatusFilter>>>;
}

export interface OrderFulfill {
  __typename?: "OrderFulfill";
  errors: OrderError[];
  fulfillments?: Maybe<Array<Maybe<Fulfillment>>>;
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderFulfillInput {
  allowStockToBeExceeded?: Maybe<Scalars["Boolean"]>;
  lines: OrderFulfillLineInput[];
  notifyCustomer?: Maybe<Scalars["Boolean"]>;
}

export interface OrderFulfillLineInput {
  orderLineId?: Maybe<Scalars["ID"]>;
  stocks: OrderFulfillStockInput[];
}

export interface OrderFulfillStockInput {
  quantity: Scalars["Int"];
  warehouse: Scalars["ID"];
}

export type OrderLine = Node & {
  __typename?: "OrderLine";
  allocations?: Maybe<Allocation[]>;
  digitalContentUrl?: Maybe<DigitalContentUrl>;
  id: Scalars["ID"];
  isShippingRequired: Scalars["Boolean"];
  productName: Scalars["String"];
  productSku: Scalars["String"];
  quantity: Scalars["Int"];
  quantityFulfilled: Scalars["Int"];
  taxRate: Scalars["Float"];
  thumbnail?: Maybe<Image>;
  totalPrice: TaxedMoney;
  translatedProductName: Scalars["String"];
  translatedVariantName: Scalars["String"];
  undiscountedUnitPrice: TaxedMoney;
  unitDiscount: Money;
  unitDiscountReason?: Maybe<Scalars["String"]>;
  unitDiscountType?: Maybe<DiscountValueTypeEnum>;
  unitDiscountValue: Scalars["PositiveDecimal"];
  unitPrice: TaxedMoney;
  variant?: Maybe<ProductVariant>;
  variantName: Scalars["String"];
};

export interface OrderLineThumbnailArgs {
  size?: Maybe<Scalars["Int"]>;
}

export interface OrderLineCreateInput {
  quantity: Scalars["Int"];
  variantId: Scalars["ID"];
}

export interface OrderLineDelete {
  __typename?: "OrderLineDelete";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
  orderLine?: Maybe<OrderLine>;
}

export interface OrderLineDiscountRemove {
  __typename?: "OrderLineDiscountRemove";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
  orderLine?: Maybe<OrderLine>;
}

export interface OrderLineDiscountUpdate {
  __typename?: "OrderLineDiscountUpdate";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
  orderLine?: Maybe<OrderLine>;
}

export interface OrderLineInput {
  quantity: Scalars["Int"];
}

export interface OrderLineUpdate {
  __typename?: "OrderLineUpdate";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
  orderLine?: Maybe<OrderLine>;
}

export interface OrderLinesCreate {
  __typename?: "OrderLinesCreate";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
  orderLines?: Maybe<OrderLine[]>;
}

export interface OrderMarkAsPaid {
  __typename?: "OrderMarkAsPaid";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export enum OrderOriginEnum {
  Checkout = "CHECKOUT",
  Draft = "DRAFT",
  Reissue = "REISSUE",
}

export interface OrderRefund {
  __typename?: "OrderRefund";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderRefundFulfillmentLineInput {
  fulfillmentLineId: Scalars["ID"];
  quantity: Scalars["Int"];
}

export interface OrderRefundLineInput {
  orderLineId: Scalars["ID"];
  quantity: Scalars["Int"];
}

export interface OrderRefundProductsInput {
  amountToRefund?: Maybe<Scalars["PositiveDecimal"]>;
  fulfillmentLines?: Maybe<OrderRefundFulfillmentLineInput[]>;
  includeShippingCosts?: Maybe<Scalars["Boolean"]>;
  orderLines?: Maybe<OrderRefundLineInput[]>;
}

export interface OrderReturnFulfillmentLineInput {
  fulfillmentLineId: Scalars["ID"];
  quantity: Scalars["Int"];
  replace?: Maybe<Scalars["Boolean"]>;
}

export interface OrderReturnLineInput {
  orderLineId: Scalars["ID"];
  quantity: Scalars["Int"];
  replace?: Maybe<Scalars["Boolean"]>;
}

export interface OrderReturnProductsInput {
  amountToRefund?: Maybe<Scalars["PositiveDecimal"]>;
  fulfillmentLines?: Maybe<OrderReturnFulfillmentLineInput[]>;
  includeShippingCosts?: Maybe<Scalars["Boolean"]>;
  orderLines?: Maybe<OrderReturnLineInput[]>;
  refund?: Maybe<Scalars["Boolean"]>;
}

export interface OrderSettings {
  __typename?: "OrderSettings";
  automaticallyConfirmAllNewOrders: Scalars["Boolean"];
}

export interface OrderSettingsError {
  __typename?: "OrderSettingsError";
  code: OrderSettingsErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum OrderSettingsErrorCode {
  Invalid = "INVALID",
}

export interface OrderSettingsUpdate {
  __typename?: "OrderSettingsUpdate";
  errors: OrderSettingsError[];
  orderSettings?: Maybe<OrderSettings>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderSettingsErrors: OrderSettingsError[];
}

export interface OrderSettingsUpdateInput {
  automaticallyConfirmAllNewOrders: Scalars["Boolean"];
}

export enum OrderSortField {
  CreationDate = "CREATION_DATE",
  Customer = "CUSTOMER",
  FulfillmentStatus = "FULFILLMENT_STATUS",
  Number = "NUMBER",
  Payment = "PAYMENT",
}

export interface OrderSortingInput {
  direction: OrderDirection;
  field: OrderSortField;
}

export enum OrderStatus {
  Canceled = "CANCELED",
  Draft = "DRAFT",
  Fulfilled = "FULFILLED",
  PartiallyFulfilled = "PARTIALLY_FULFILLED",
  PartiallyReturned = "PARTIALLY_RETURNED",
  Returned = "RETURNED",
  Unconfirmed = "UNCONFIRMED",
  Unfulfilled = "UNFULFILLED",
}

export enum OrderStatusFilter {
  Canceled = "CANCELED",
  Fulfilled = "FULFILLED",
  PartiallyFulfilled = "PARTIALLY_FULFILLED",
  ReadyToCapture = "READY_TO_CAPTURE",
  ReadyToFulfill = "READY_TO_FULFILL",
  Unconfirmed = "UNCONFIRMED",
  Unfulfilled = "UNFULFILLED",
}

export interface OrderUpdate {
  __typename?: "OrderUpdate";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderUpdateInput {
  billingAddress?: Maybe<AddressInput>;
  shippingAddress?: Maybe<AddressInput>;
  userEmail?: Maybe<Scalars["String"]>;
}

export interface OrderUpdateShipping {
  __typename?: "OrderUpdateShipping";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export interface OrderUpdateShippingInput {
  shippingMethod?: Maybe<Scalars["ID"]>;
}

export interface OrderVoid {
  __typename?: "OrderVoid";
  errors: OrderError[];
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: OrderError[];
}

export type Page = Node &
  ObjectWithMetadata & {
    __typename?: "Page";
    attributes: SelectedAttribute[];
    content?: Maybe<Scalars["JSONString"]>;
    /** @deprecated Will be removed in Saleor 4.0. Use the `content` field instead. */
    contentJson: Scalars["JSONString"];
    created: Scalars["DateTime"];
    id: Scalars["ID"];
    isPublished: Scalars["Boolean"];
    metadata: Array<Maybe<MetadataItem>>;
    pageType: PageType;
    privateMetadata: Array<Maybe<MetadataItem>>;
    publicationDate?: Maybe<Scalars["Date"]>;
    seoDescription?: Maybe<Scalars["String"]>;
    seoTitle?: Maybe<Scalars["String"]>;
    slug: Scalars["String"];
    title: Scalars["String"];
    translation?: Maybe<PageTranslation>;
  };

export interface PageTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface PageAttributeAssign {
  __typename?: "PageAttributeAssign";
  errors: PageError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
  pageType?: Maybe<PageType>;
}

export interface PageAttributeUnassign {
  __typename?: "PageAttributeUnassign";
  errors: PageError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
  pageType?: Maybe<PageType>;
}

export interface PageBulkDelete {
  __typename?: "PageBulkDelete";
  count: Scalars["Int"];
  errors: PageError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
}

export interface PageBulkPublish {
  __typename?: "PageBulkPublish";
  count: Scalars["Int"];
  errors: PageError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
}

export interface PageCountableConnection {
  __typename?: "PageCountableConnection";
  edges: PageCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface PageCountableEdge {
  __typename?: "PageCountableEdge";
  cursor: Scalars["String"];
  node: Page;
}

export interface PageCreate {
  __typename?: "PageCreate";
  errors: PageError[];
  page?: Maybe<Page>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
}

export interface PageCreateInput {
  attributes?: Maybe<AttributeValueInput[]>;
  content?: Maybe<Scalars["JSONString"]>;
  isPublished?: Maybe<Scalars["Boolean"]>;
  pageType: Scalars["ID"];
  publicationDate?: Maybe<Scalars["String"]>;
  seo?: Maybe<SeoInput>;
  slug?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
}

export interface PageDelete {
  __typename?: "PageDelete";
  errors: PageError[];
  page?: Maybe<Page>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
}

export interface PageError {
  __typename?: "PageError";
  attributes?: Maybe<Array<Scalars["ID"]>>;
  code: PageErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  values?: Maybe<Array<Scalars["ID"]>>;
}

export enum PageErrorCode {
  AttributeAlreadyAssigned = "ATTRIBUTE_ALREADY_ASSIGNED",
  DuplicatedInputItem = "DUPLICATED_INPUT_ITEM",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface PageFilterInput {
  ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  pageTypes?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  search?: Maybe<Scalars["String"]>;
}

export interface PageInfo {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]>;
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
  startCursor?: Maybe<Scalars["String"]>;
}

export interface PageInput {
  attributes?: Maybe<AttributeValueInput[]>;
  content?: Maybe<Scalars["JSONString"]>;
  isPublished?: Maybe<Scalars["Boolean"]>;
  publicationDate?: Maybe<Scalars["String"]>;
  seo?: Maybe<SeoInput>;
  slug?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
}

export interface PageReorderAttributeValues {
  __typename?: "PageReorderAttributeValues";
  errors: PageError[];
  page?: Maybe<Page>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
}

export enum PageSortField {
  CreationDate = "CREATION_DATE",
  PublicationDate = "PUBLICATION_DATE",
  Slug = "SLUG",
  Title = "TITLE",
  Visibility = "VISIBILITY",
}

export interface PageSortingInput {
  direction: OrderDirection;
  field: PageSortField;
}

export type PageTranslatableContent = Node & {
  __typename?: "PageTranslatableContent";
  attributeValues: AttributeValueTranslatableContent[];
  content?: Maybe<Scalars["JSONString"]>;
  /** @deprecated Will be removed in Saleor 4.0. Use the `content` field instead. */
  contentJson?: Maybe<Scalars["JSONString"]>;
  id: Scalars["ID"];
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  page?: Maybe<Page>;
  seoDescription?: Maybe<Scalars["String"]>;
  seoTitle?: Maybe<Scalars["String"]>;
  title: Scalars["String"];
  translation?: Maybe<PageTranslation>;
};

export interface PageTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface PageTranslate {
  __typename?: "PageTranslate";
  errors: TranslationError[];
  page?: Maybe<PageTranslatableContent>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export type PageTranslation = Node & {
  __typename?: "PageTranslation";
  content?: Maybe<Scalars["JSONString"]>;
  /** @deprecated Will be removed in Saleor 4.0. Use the `content` field instead. */
  contentJson?: Maybe<Scalars["JSONString"]>;
  id: Scalars["ID"];
  language: LanguageDisplay;
  seoDescription?: Maybe<Scalars["String"]>;
  seoTitle?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
};

export interface PageTranslationInput {
  content?: Maybe<Scalars["JSONString"]>;
  seoDescription?: Maybe<Scalars["String"]>;
  seoTitle?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
}

export type PageType = Node &
  ObjectWithMetadata & {
    __typename?: "PageType";
    attributes?: Maybe<Array<Maybe<Attribute>>>;
    availableAttributes?: Maybe<AttributeCountableConnection>;
    hasPages?: Maybe<Scalars["Boolean"]>;
    id: Scalars["ID"];
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    privateMetadata: Array<Maybe<MetadataItem>>;
    slug: Scalars["String"];
  };

export interface PageTypeAvailableAttributesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<AttributeFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface PageTypeBulkDelete {
  __typename?: "PageTypeBulkDelete";
  count: Scalars["Int"];
  errors: PageError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
}

export interface PageTypeCountableConnection {
  __typename?: "PageTypeCountableConnection";
  edges: PageTypeCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface PageTypeCountableEdge {
  __typename?: "PageTypeCountableEdge";
  cursor: Scalars["String"];
  node: PageType;
}

export interface PageTypeCreate {
  __typename?: "PageTypeCreate";
  errors: PageError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
  pageType?: Maybe<PageType>;
}

export interface PageTypeCreateInput {
  addAttributes?: Maybe<Array<Scalars["ID"]>>;
  name?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
}

export interface PageTypeDelete {
  __typename?: "PageTypeDelete";
  errors: PageError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
  pageType?: Maybe<PageType>;
}

export interface PageTypeFilterInput {
  search?: Maybe<Scalars["String"]>;
}

export interface PageTypeReorderAttributes {
  __typename?: "PageTypeReorderAttributes";
  errors: PageError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
  pageType?: Maybe<PageType>;
}

export enum PageTypeSortField {
  Name = "NAME",
  Slug = "SLUG",
}

export interface PageTypeSortingInput {
  direction: OrderDirection;
  field: PageTypeSortField;
}

export interface PageTypeUpdate {
  __typename?: "PageTypeUpdate";
  errors: PageError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
  pageType?: Maybe<PageType>;
}

export interface PageTypeUpdateInput {
  addAttributes?: Maybe<Array<Scalars["ID"]>>;
  name?: Maybe<Scalars["String"]>;
  removeAttributes?: Maybe<Array<Scalars["ID"]>>;
  slug?: Maybe<Scalars["String"]>;
}

export interface PageUpdate {
  __typename?: "PageUpdate";
  errors: PageError[];
  page?: Maybe<Page>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: PageError[];
}

export interface PasswordChange {
  __typename?: "PasswordChange";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export type Payment = Node & {
  __typename?: "Payment";
  actions: Array<Maybe<OrderAction>>;
  availableCaptureAmount?: Maybe<Money>;
  availableRefundAmount?: Maybe<Money>;
  capturedAmount?: Maybe<Money>;
  chargeStatus: PaymentChargeStatusEnum;
  checkout?: Maybe<Checkout>;
  created: Scalars["DateTime"];
  creditCard?: Maybe<CreditCard>;
  customerIpAddress?: Maybe<Scalars["String"]>;
  gateway: Scalars["String"];
  id: Scalars["ID"];
  isActive: Scalars["Boolean"];
  modified: Scalars["DateTime"];
  order?: Maybe<Order>;
  paymentMethodType: Scalars["String"];
  token: Scalars["String"];
  total?: Maybe<Money>;
  transactions?: Maybe<Array<Maybe<Transaction>>>;
};

export interface PaymentCapture {
  __typename?: "PaymentCapture";
  errors: PaymentError[];
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: PaymentError[];
}

export enum PaymentChargeStatusEnum {
  Cancelled = "CANCELLED",
  FullyCharged = "FULLY_CHARGED",
  FullyRefunded = "FULLY_REFUNDED",
  NotCharged = "NOT_CHARGED",
  PartiallyCharged = "PARTIALLY_CHARGED",
  PartiallyRefunded = "PARTIALLY_REFUNDED",
  Pending = "PENDING",
  Refused = "REFUSED",
}

export interface PaymentCountableConnection {
  __typename?: "PaymentCountableConnection";
  edges: PaymentCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface PaymentCountableEdge {
  __typename?: "PaymentCountableEdge";
  cursor: Scalars["String"];
  node: Payment;
}

export interface PaymentError {
  __typename?: "PaymentError";
  code: PaymentErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum PaymentErrorCode {
  BillingAddressNotSet = "BILLING_ADDRESS_NOT_SET",
  ChannelInactive = "CHANNEL_INACTIVE",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  InvalidShippingMethod = "INVALID_SHIPPING_METHOD",
  NotFound = "NOT_FOUND",
  NotSupportedGateway = "NOT_SUPPORTED_GATEWAY",
  PartialPaymentNotAllowed = "PARTIAL_PAYMENT_NOT_ALLOWED",
  PaymentError = "PAYMENT_ERROR",
  Required = "REQUIRED",
  ShippingAddressNotSet = "SHIPPING_ADDRESS_NOT_SET",
  ShippingMethodNotSet = "SHIPPING_METHOD_NOT_SET",
  Unique = "UNIQUE",
}

export interface PaymentFilterInput {
  checkouts?: Maybe<Array<Maybe<Scalars["ID"]>>>;
}

export interface PaymentGateway {
  __typename?: "PaymentGateway";
  config: GatewayConfigLine[];
  currencies: Array<Maybe<Scalars["String"]>>;
  id: Scalars["ID"];
  name: Scalars["String"];
}

export interface PaymentInitialize {
  __typename?: "PaymentInitialize";
  errors: PaymentError[];
  initializedPayment?: Maybe<PaymentInitialized>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: PaymentError[];
}

export interface PaymentInitialized {
  __typename?: "PaymentInitialized";
  data?: Maybe<Scalars["JSONString"]>;
  gateway: Scalars["String"];
  name: Scalars["String"];
}

export interface PaymentInput {
  amount?: Maybe<Scalars["PositiveDecimal"]>;
  gateway: Scalars["String"];
  returnUrl?: Maybe<Scalars["String"]>;
  token?: Maybe<Scalars["String"]>;
}

export interface PaymentRefund {
  __typename?: "PaymentRefund";
  errors: PaymentError[];
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: PaymentError[];
}

export interface PaymentSource {
  __typename?: "PaymentSource";
  creditCardInfo?: Maybe<CreditCard>;
  gateway: Scalars["String"];
  paymentMethodId?: Maybe<Scalars["String"]>;
}

export interface PaymentVoid {
  __typename?: "PaymentVoid";
  errors: PaymentError[];
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: PaymentError[];
}

export interface Permission {
  __typename?: "Permission";
  code: PermissionEnum;
  name: Scalars["String"];
}

export enum PermissionEnum {
  HandlePayments = "HANDLE_PAYMENTS",
  ImpersonateUser = "IMPERSONATE_USER",
  ManageApps = "MANAGE_APPS",
  ManageChannels = "MANAGE_CHANNELS",
  ManageCheckouts = "MANAGE_CHECKOUTS",
  ManageDiscounts = "MANAGE_DISCOUNTS",
  ManageGiftCard = "MANAGE_GIFT_CARD",
  ManageMenus = "MANAGE_MENUS",
  ManageOrders = "MANAGE_ORDERS",
  ManagePages = "MANAGE_PAGES",
  ManagePageTypesAndAttributes = "MANAGE_PAGE_TYPES_AND_ATTRIBUTES",
  ManagePlugins = "MANAGE_PLUGINS",
  ManageProducts = "MANAGE_PRODUCTS",
  ManageProductTypesAndAttributes = "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES",
  ManageSettings = "MANAGE_SETTINGS",
  ManageShipping = "MANAGE_SHIPPING",
  ManageStaff = "MANAGE_STAFF",
  ManageTranslations = "MANAGE_TRANSLATIONS",
  ManageUsers = "MANAGE_USERS",
}

export interface PermissionGroupCreate {
  __typename?: "PermissionGroupCreate";
  errors: PermissionGroupError[];
  group?: Maybe<Group>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  permissionGroupErrors: PermissionGroupError[];
}

export interface PermissionGroupCreateInput {
  addPermissions?: Maybe<PermissionEnum[]>;
  addUsers?: Maybe<Array<Scalars["ID"]>>;
  name: Scalars["String"];
}

export interface PermissionGroupDelete {
  __typename?: "PermissionGroupDelete";
  errors: PermissionGroupError[];
  group?: Maybe<Group>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  permissionGroupErrors: PermissionGroupError[];
}

export interface PermissionGroupError {
  __typename?: "PermissionGroupError";
  code: PermissionGroupErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  permissions?: Maybe<PermissionEnum[]>;
  users?: Maybe<Array<Scalars["ID"]>>;
}

export enum PermissionGroupErrorCode {
  AssignNonStaffMember = "ASSIGN_NON_STAFF_MEMBER",
  CannotRemoveFromLastGroup = "CANNOT_REMOVE_FROM_LAST_GROUP",
  DuplicatedInputItem = "DUPLICATED_INPUT_ITEM",
  LeftNotManageablePermission = "LEFT_NOT_MANAGEABLE_PERMISSION",
  OutOfScopePermission = "OUT_OF_SCOPE_PERMISSION",
  OutOfScopeUser = "OUT_OF_SCOPE_USER",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface PermissionGroupFilterInput {
  search?: Maybe<Scalars["String"]>;
}

export enum PermissionGroupSortField {
  Name = "NAME",
}

export interface PermissionGroupSortingInput {
  direction: OrderDirection;
  field: PermissionGroupSortField;
}

export interface PermissionGroupUpdate {
  __typename?: "PermissionGroupUpdate";
  errors: PermissionGroupError[];
  group?: Maybe<Group>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  permissionGroupErrors: PermissionGroupError[];
}

export interface PermissionGroupUpdateInput {
  addPermissions?: Maybe<PermissionEnum[]>;
  addUsers?: Maybe<Array<Scalars["ID"]>>;
  name?: Maybe<Scalars["String"]>;
  removePermissions?: Maybe<PermissionEnum[]>;
  removeUsers?: Maybe<Array<Scalars["ID"]>>;
}

export interface Plugin {
  __typename?: "Plugin";
  channelConfigurations: PluginConfiguration[];
  description: Scalars["String"];
  globalConfiguration?: Maybe<PluginConfiguration>;
  id: Scalars["ID"];
  name: Scalars["String"];
}

export interface PluginConfiguration {
  __typename?: "PluginConfiguration";
  active: Scalars["Boolean"];
  channel?: Maybe<Channel>;
  configuration?: Maybe<Array<Maybe<ConfigurationItem>>>;
}

export enum PluginConfigurationType {
  Global = "GLOBAL",
  PerChannel = "PER_CHANNEL",
}

export interface PluginCountableConnection {
  __typename?: "PluginCountableConnection";
  edges: PluginCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface PluginCountableEdge {
  __typename?: "PluginCountableEdge";
  cursor: Scalars["String"];
  node: Plugin;
}

export interface PluginError {
  __typename?: "PluginError";
  code: PluginErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum PluginErrorCode {
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  PluginMisconfigured = "PLUGIN_MISCONFIGURED",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface PluginFilterInput {
  search?: Maybe<Scalars["String"]>;
  statusInChannels?: Maybe<PluginStatusInChannelsInput>;
  type?: Maybe<PluginConfigurationType>;
}

export enum PluginSortField {
  IsActive = "IS_ACTIVE",
  Name = "NAME",
}

export interface PluginSortingInput {
  direction: OrderDirection;
  field: PluginSortField;
}

export interface PluginStatusInChannelsInput {
  active: Scalars["Boolean"];
  channels: Array<Scalars["ID"]>;
}

export interface PluginUpdate {
  __typename?: "PluginUpdate";
  errors: PluginError[];
  plugin?: Maybe<Plugin>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pluginsErrors: PluginError[];
}

export interface PluginUpdateInput {
  active?: Maybe<Scalars["Boolean"]>;
  configuration?: Maybe<Array<Maybe<ConfigurationItemInput>>>;
}

export enum PostalCodeRuleInclusionTypeEnum {
  Exclude = "EXCLUDE",
  Include = "INCLUDE",
}

export interface PriceRangeInput {
  gte?: Maybe<Scalars["Float"]>;
  lte?: Maybe<Scalars["Float"]>;
}

export type Product = Node &
  ObjectWithMetadata & {
    __typename?: "Product";
    attributes: SelectedAttribute[];
    availableForPurchase?: Maybe<Scalars["Date"]>;
    category?: Maybe<Category>;
    channel?: Maybe<Scalars["String"]>;
    channelListings?: Maybe<ProductChannelListing[]>;
    chargeTaxes: Scalars["Boolean"];
    collections?: Maybe<Array<Maybe<Collection>>>;
    defaultVariant?: Maybe<ProductVariant>;
    description?: Maybe<Scalars["JSONString"]>;
    /** @deprecated Will be removed in Saleor 4.0. Use the `description` field instead. */
    descriptionJson?: Maybe<Scalars["JSONString"]>;
    id: Scalars["ID"];
    /** @deprecated Will be removed in Saleor 4.0. Use the `mediaById` field instead. */
    imageById?: Maybe<ProductImage>;
    /** @deprecated Will be removed in Saleor 4.0. Use the `media` field instead. */
    images?: Maybe<Array<Maybe<ProductImage>>>;
    isAvailable?: Maybe<Scalars["Boolean"]>;
    isAvailableForPurchase?: Maybe<Scalars["Boolean"]>;
    media?: Maybe<ProductMedia[]>;
    mediaById?: Maybe<ProductMedia>;
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    pricing?: Maybe<ProductPricingInfo>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    productType: ProductType;
    rating?: Maybe<Scalars["Float"]>;
    seoDescription?: Maybe<Scalars["String"]>;
    seoTitle?: Maybe<Scalars["String"]>;
    slug: Scalars["String"];
    taxType?: Maybe<TaxType>;
    thumbnail?: Maybe<Image>;
    translation?: Maybe<ProductTranslation>;
    updatedAt?: Maybe<Scalars["DateTime"]>;
    variants?: Maybe<Array<Maybe<ProductVariant>>>;
    weight?: Maybe<Weight>;
  };

export interface ProductImageByIdArgs {
  id?: Maybe<Scalars["ID"]>;
}

export interface ProductIsAvailableArgs {
  address?: Maybe<AddressInput>;
}

export interface ProductMediaByIdArgs {
  id?: Maybe<Scalars["ID"]>;
}

export interface ProductPricingArgs {
  address?: Maybe<AddressInput>;
}

export interface ProductThumbnailArgs {
  size?: Maybe<Scalars["Int"]>;
}

export interface ProductTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface ProductAttributeAssign {
  __typename?: "ProductAttributeAssign";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productType?: Maybe<ProductType>;
}

export interface ProductAttributeAssignInput {
  id: Scalars["ID"];
  type: ProductAttributeType;
}

export enum ProductAttributeType {
  Product = "PRODUCT",
  Variant = "VARIANT",
}

export interface ProductAttributeUnassign {
  __typename?: "ProductAttributeUnassign";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productType?: Maybe<ProductType>;
}

export interface ProductBulkDelete {
  __typename?: "ProductBulkDelete";
  count: Scalars["Int"];
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export type ProductChannelListing = Node & {
  __typename?: "ProductChannelListing";
  availableForPurchase?: Maybe<Scalars["Date"]>;
  channel: Channel;
  discountedPrice?: Maybe<Money>;
  id: Scalars["ID"];
  isAvailableForPurchase?: Maybe<Scalars["Boolean"]>;
  isPublished: Scalars["Boolean"];
  margin?: Maybe<Margin>;
  pricing?: Maybe<ProductPricingInfo>;
  publicationDate?: Maybe<Scalars["Date"]>;
  purchaseCost?: Maybe<MoneyRange>;
  visibleInListings: Scalars["Boolean"];
};

export interface ProductChannelListingPricingArgs {
  address?: Maybe<AddressInput>;
}

export interface ProductChannelListingAddInput {
  addVariants?: Maybe<Array<Scalars["ID"]>>;
  availableForPurchaseDate?: Maybe<Scalars["Date"]>;
  channelId: Scalars["ID"];
  isAvailableForPurchase?: Maybe<Scalars["Boolean"]>;
  isPublished?: Maybe<Scalars["Boolean"]>;
  publicationDate?: Maybe<Scalars["Date"]>;
  removeVariants?: Maybe<Array<Scalars["ID"]>>;
  visibleInListings?: Maybe<Scalars["Boolean"]>;
}

export interface ProductChannelListingError {
  __typename?: "ProductChannelListingError";
  attributes?: Maybe<Array<Scalars["ID"]>>;
  channels?: Maybe<Array<Scalars["ID"]>>;
  code: ProductErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  values?: Maybe<Array<Scalars["ID"]>>;
  variants?: Maybe<Array<Scalars["ID"]>>;
}

export interface ProductChannelListingUpdate {
  __typename?: "ProductChannelListingUpdate";
  errors: ProductChannelListingError[];
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productChannelListingErrors: ProductChannelListingError[];
}

export interface ProductChannelListingUpdateInput {
  removeChannels?: Maybe<Array<Scalars["ID"]>>;
  updateChannels?: Maybe<ProductChannelListingAddInput[]>;
}

export interface ProductCountableConnection {
  __typename?: "ProductCountableConnection";
  edges: ProductCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface ProductCountableEdge {
  __typename?: "ProductCountableEdge";
  cursor: Scalars["String"];
  node: Product;
}

export interface ProductCreate {
  __typename?: "ProductCreate";
  errors: ProductError[];
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface ProductCreateInput {
  attributes?: Maybe<AttributeValueInput[]>;
  category?: Maybe<Scalars["ID"]>;
  chargeTaxes?: Maybe<Scalars["Boolean"]>;
  collections?: Maybe<Array<Scalars["ID"]>>;
  description?: Maybe<Scalars["JSONString"]>;
  name?: Maybe<Scalars["String"]>;
  productType: Scalars["ID"];
  rating?: Maybe<Scalars["Float"]>;
  seo?: Maybe<SeoInput>;
  slug?: Maybe<Scalars["String"]>;
  taxCode?: Maybe<Scalars["String"]>;
  weight?: Maybe<Scalars["WeightScalar"]>;
}

export interface ProductDelete {
  __typename?: "ProductDelete";
  errors: ProductError[];
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface ProductError {
  __typename?: "ProductError";
  attributes?: Maybe<Array<Scalars["ID"]>>;
  code: ProductErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  values?: Maybe<Array<Scalars["ID"]>>;
}

export enum ProductErrorCode {
  AlreadyExists = "ALREADY_EXISTS",
  AttributeAlreadyAssigned = "ATTRIBUTE_ALREADY_ASSIGNED",
  AttributeCannotBeAssigned = "ATTRIBUTE_CANNOT_BE_ASSIGNED",
  AttributeVariantsDisabled = "ATTRIBUTE_VARIANTS_DISABLED",
  CannotManageProductWithoutVariant = "CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT",
  DuplicatedInputItem = "DUPLICATED_INPUT_ITEM",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  NotProductsImage = "NOT_PRODUCTS_IMAGE",
  NotProductsVariant = "NOT_PRODUCTS_VARIANT",
  ProductNotAssignedToChannel = "PRODUCT_NOT_ASSIGNED_TO_CHANNEL",
  ProductWithoutCategory = "PRODUCT_WITHOUT_CATEGORY",
  Required = "REQUIRED",
  Unique = "UNIQUE",
  UnsupportedMediaProvider = "UNSUPPORTED_MEDIA_PROVIDER",
  VariantNoDigitalContent = "VARIANT_NO_DIGITAL_CONTENT",
}

export enum ProductFieldEnum {
  Category = "CATEGORY",
  ChargeTaxes = "CHARGE_TAXES",
  Collections = "COLLECTIONS",
  Description = "DESCRIPTION",
  Name = "NAME",
  ProductMedia = "PRODUCT_MEDIA",
  ProductType = "PRODUCT_TYPE",
  ProductWeight = "PRODUCT_WEIGHT",
  VariantMedia = "VARIANT_MEDIA",
  VariantSku = "VARIANT_SKU",
  VariantWeight = "VARIANT_WEIGHT",
}

export interface ProductFilterInput {
  attributes?: Maybe<Array<Maybe<AttributeInput>>>;
  categories?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  channel?: Maybe<Scalars["String"]>;
  collections?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  hasCategory?: Maybe<Scalars["Boolean"]>;
  ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  isPublished?: Maybe<Scalars["Boolean"]>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  minimalPrice?: Maybe<PriceRangeInput>;
  price?: Maybe<PriceRangeInput>;
  productTypes?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  search?: Maybe<Scalars["String"]>;
  stockAvailability?: Maybe<StockAvailability>;
  stocks?: Maybe<ProductStockFilterInput>;
}

export interface ProductImage {
  __typename?: "ProductImage";
  alt?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  sortOrder?: Maybe<Scalars["Int"]>;
  url: Scalars["String"];
}

export interface ProductImageUrlArgs {
  size?: Maybe<Scalars["Int"]>;
}

export interface ProductInput {
  attributes?: Maybe<AttributeValueInput[]>;
  category?: Maybe<Scalars["ID"]>;
  chargeTaxes?: Maybe<Scalars["Boolean"]>;
  collections?: Maybe<Array<Scalars["ID"]>>;
  description?: Maybe<Scalars["JSONString"]>;
  name?: Maybe<Scalars["String"]>;
  rating?: Maybe<Scalars["Float"]>;
  seo?: Maybe<SeoInput>;
  slug?: Maybe<Scalars["String"]>;
  taxCode?: Maybe<Scalars["String"]>;
  weight?: Maybe<Scalars["WeightScalar"]>;
}

export type ProductMedia = Node & {
  __typename?: "ProductMedia";
  alt: Scalars["String"];
  id: Scalars["ID"];
  oembedData: Scalars["JSONString"];
  sortOrder?: Maybe<Scalars["Int"]>;
  type: ProductMediaType;
  url: Scalars["String"];
};

export interface ProductMediaUrlArgs {
  size?: Maybe<Scalars["Int"]>;
}

export interface ProductMediaBulkDelete {
  __typename?: "ProductMediaBulkDelete";
  count: Scalars["Int"];
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface ProductMediaCreate {
  __typename?: "ProductMediaCreate";
  errors: ProductError[];
  media?: Maybe<ProductMedia>;
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface ProductMediaCreateInput {
  alt?: Maybe<Scalars["String"]>;
  image?: Maybe<Scalars["Upload"]>;
  mediaUrl?: Maybe<Scalars["String"]>;
  product: Scalars["ID"];
}

export interface ProductMediaDelete {
  __typename?: "ProductMediaDelete";
  errors: ProductError[];
  media?: Maybe<ProductMedia>;
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface ProductMediaReorder {
  __typename?: "ProductMediaReorder";
  errors: ProductError[];
  media?: Maybe<ProductMedia[]>;
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export enum ProductMediaType {
  Image = "IMAGE",
  Video = "VIDEO",
}

export interface ProductMediaUpdate {
  __typename?: "ProductMediaUpdate";
  errors: ProductError[];
  media?: Maybe<ProductMedia>;
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface ProductMediaUpdateInput {
  alt?: Maybe<Scalars["String"]>;
}

export interface ProductOrder {
  attributeId?: Maybe<Scalars["ID"]>;
  channel?: Maybe<Scalars["String"]>;
  direction: OrderDirection;
  field?: Maybe<ProductOrderField>;
}

export enum ProductOrderField {
  Collection = "COLLECTION",
  Date = "DATE",
  MinimalPrice = "MINIMAL_PRICE",
  Name = "NAME",
  Price = "PRICE",
  PublicationDate = "PUBLICATION_DATE",
  Published = "PUBLISHED",
  Rank = "RANK",
  Rating = "RATING",
  Type = "TYPE",
}

export interface ProductPricingInfo {
  __typename?: "ProductPricingInfo";
  discount?: Maybe<TaxedMoney>;
  discountLocalCurrency?: Maybe<TaxedMoney>;
  onSale?: Maybe<Scalars["Boolean"]>;
  priceRange?: Maybe<TaxedMoneyRange>;
  priceRangeLocalCurrency?: Maybe<TaxedMoneyRange>;
  priceRangeUndiscounted?: Maybe<TaxedMoneyRange>;
}

export interface ProductReorderAttributeValues {
  __typename?: "ProductReorderAttributeValues";
  errors: ProductError[];
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface ProductStockFilterInput {
  quantity?: Maybe<IntRangeInput>;
  warehouseIds?: Maybe<Array<Scalars["ID"]>>;
}

export type ProductTranslatableContent = Node & {
  __typename?: "ProductTranslatableContent";
  attributeValues: AttributeValueTranslatableContent[];
  description?: Maybe<Scalars["JSONString"]>;
  /** @deprecated Will be removed in Saleor 4.0. Use the `description` field instead. */
  descriptionJson?: Maybe<Scalars["JSONString"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  product?: Maybe<Product>;
  seoDescription?: Maybe<Scalars["String"]>;
  seoTitle?: Maybe<Scalars["String"]>;
  translation?: Maybe<ProductTranslation>;
};

export interface ProductTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface ProductTranslate {
  __typename?: "ProductTranslate";
  errors: TranslationError[];
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export type ProductTranslation = Node & {
  __typename?: "ProductTranslation";
  description?: Maybe<Scalars["JSONString"]>;
  /** @deprecated Will be removed in Saleor 4.0. Use the `description` field instead. */
  descriptionJson?: Maybe<Scalars["JSONString"]>;
  id: Scalars["ID"];
  language: LanguageDisplay;
  name?: Maybe<Scalars["String"]>;
  seoDescription?: Maybe<Scalars["String"]>;
  seoTitle?: Maybe<Scalars["String"]>;
};

export type ProductType = Node &
  ObjectWithMetadata & {
    __typename?: "ProductType";
    availableAttributes?: Maybe<AttributeCountableConnection>;
    hasVariants: Scalars["Boolean"];
    id: Scalars["ID"];
    isDigital: Scalars["Boolean"];
    isShippingRequired: Scalars["Boolean"];
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    privateMetadata: Array<Maybe<MetadataItem>>;
    productAttributes?: Maybe<Array<Maybe<Attribute>>>;
    /** @deprecated Will be removed in Saleor 4.0. Use the top-level `products` query with the `productTypes` filter. */
    products?: Maybe<ProductCountableConnection>;
    slug: Scalars["String"];
    taxType?: Maybe<TaxType>;
    variantAttributes?: Maybe<Array<Maybe<Attribute>>>;
    weight?: Maybe<Weight>;
  };

export interface ProductTypeAvailableAttributesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<AttributeFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface ProductTypeProductsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface ProductTypeVariantAttributesArgs {
  variantSelection?: Maybe<VariantAttributeScope>;
}

export interface ProductTypeBulkDelete {
  __typename?: "ProductTypeBulkDelete";
  count: Scalars["Int"];
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export enum ProductTypeConfigurable {
  Configurable = "CONFIGURABLE",
  Simple = "SIMPLE",
}

export interface ProductTypeCountableConnection {
  __typename?: "ProductTypeCountableConnection";
  edges: ProductTypeCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface ProductTypeCountableEdge {
  __typename?: "ProductTypeCountableEdge";
  cursor: Scalars["String"];
  node: ProductType;
}

export interface ProductTypeCreate {
  __typename?: "ProductTypeCreate";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productType?: Maybe<ProductType>;
}

export interface ProductTypeDelete {
  __typename?: "ProductTypeDelete";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productType?: Maybe<ProductType>;
}

export enum ProductTypeEnum {
  Digital = "DIGITAL",
  Shippable = "SHIPPABLE",
}

export interface ProductTypeFilterInput {
  configurable?: Maybe<ProductTypeConfigurable>;
  ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  productType?: Maybe<ProductTypeEnum>;
  search?: Maybe<Scalars["String"]>;
}

export interface ProductTypeInput {
  hasVariants?: Maybe<Scalars["Boolean"]>;
  isDigital?: Maybe<Scalars["Boolean"]>;
  isShippingRequired?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  productAttributes?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  slug?: Maybe<Scalars["String"]>;
  taxCode?: Maybe<Scalars["String"]>;
  variantAttributes?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  weight?: Maybe<Scalars["WeightScalar"]>;
}

export interface ProductTypeReorderAttributes {
  __typename?: "ProductTypeReorderAttributes";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productType?: Maybe<ProductType>;
}

export enum ProductTypeSortField {
  Digital = "DIGITAL",
  Name = "NAME",
  ShippingRequired = "SHIPPING_REQUIRED",
}

export interface ProductTypeSortingInput {
  direction: OrderDirection;
  field: ProductTypeSortField;
}

export interface ProductTypeUpdate {
  __typename?: "ProductTypeUpdate";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productType?: Maybe<ProductType>;
}

export interface ProductUpdate {
  __typename?: "ProductUpdate";
  errors: ProductError[];
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export type ProductVariant = Node &
  ObjectWithMetadata & {
    __typename?: "ProductVariant";
    attributes: SelectedAttribute[];
    channel?: Maybe<Scalars["String"]>;
    channelListings?: Maybe<ProductVariantChannelListing[]>;
    digitalContent?: Maybe<DigitalContent>;
    id: Scalars["ID"];
    /** @deprecated Will be removed in Saleor 4.0. Use the `media` instead. */
    images?: Maybe<Array<Maybe<ProductImage>>>;
    margin?: Maybe<Scalars["Int"]>;
    media?: Maybe<ProductMedia[]>;
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    pricing?: Maybe<VariantPricingInfo>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    product: Product;
    quantityAvailable: Scalars["Int"];
    quantityOrdered?: Maybe<Scalars["Int"]>;
    revenue?: Maybe<TaxedMoney>;
    sku: Scalars["String"];
    stocks?: Maybe<Array<Maybe<Stock>>>;
    trackInventory: Scalars["Boolean"];
    translation?: Maybe<ProductVariantTranslation>;
    weight?: Maybe<Weight>;
  };

export interface ProductVariantAttributesArgs {
  variantSelection?: Maybe<VariantAttributeScope>;
}

export interface ProductVariantPricingArgs {
  address?: Maybe<AddressInput>;
}

export interface ProductVariantQuantityAvailableArgs {
  address?: Maybe<AddressInput>;
  countryCode?: Maybe<CountryCode>;
}

export interface ProductVariantRevenueArgs {
  period?: Maybe<ReportingPeriod>;
}

export interface ProductVariantStocksArgs {
  address?: Maybe<AddressInput>;
  countryCode?: Maybe<CountryCode>;
}

export interface ProductVariantTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface ProductVariantBulkCreate {
  __typename?: "ProductVariantBulkCreate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  bulkProductErrors: BulkProductError[];
  count: Scalars["Int"];
  errors: BulkProductError[];
  productVariants: ProductVariant[];
}

export interface ProductVariantBulkCreateInput {
  attributes: BulkAttributeValueInput[];
  channelListings?: Maybe<ProductVariantChannelListingAddInput[]>;
  sku: Scalars["String"];
  stocks?: Maybe<StockInput[]>;
  trackInventory?: Maybe<Scalars["Boolean"]>;
  weight?: Maybe<Scalars["WeightScalar"]>;
}

export interface ProductVariantBulkDelete {
  __typename?: "ProductVariantBulkDelete";
  count: Scalars["Int"];
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export type ProductVariantChannelListing = Node & {
  __typename?: "ProductVariantChannelListing";
  channel: Channel;
  costPrice?: Maybe<Money>;
  id: Scalars["ID"];
  margin?: Maybe<Scalars["Int"]>;
  price?: Maybe<Money>;
};

export interface ProductVariantChannelListingAddInput {
  channelId: Scalars["ID"];
  costPrice?: Maybe<Scalars["PositiveDecimal"]>;
  price: Scalars["PositiveDecimal"];
}

export interface ProductVariantChannelListingUpdate {
  __typename?: "ProductVariantChannelListingUpdate";
  errors: ProductChannelListingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productChannelListingErrors: ProductChannelListingError[];
  variant?: Maybe<ProductVariant>;
}

export interface ProductVariantCountableConnection {
  __typename?: "ProductVariantCountableConnection";
  edges: ProductVariantCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface ProductVariantCountableEdge {
  __typename?: "ProductVariantCountableEdge";
  cursor: Scalars["String"];
  node: ProductVariant;
}

export interface ProductVariantCreate {
  __typename?: "ProductVariantCreate";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productVariant?: Maybe<ProductVariant>;
}

export interface ProductVariantCreateInput {
  attributes: AttributeValueInput[];
  product: Scalars["ID"];
  sku?: Maybe<Scalars["String"]>;
  stocks?: Maybe<StockInput[]>;
  trackInventory?: Maybe<Scalars["Boolean"]>;
  weight?: Maybe<Scalars["WeightScalar"]>;
}

export interface ProductVariantDelete {
  __typename?: "ProductVariantDelete";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productVariant?: Maybe<ProductVariant>;
}

export interface ProductVariantFilterInput {
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  search?: Maybe<Scalars["String"]>;
  sku?: Maybe<Array<Maybe<Scalars["String"]>>>;
}

export interface ProductVariantInput {
  attributes?: Maybe<AttributeValueInput[]>;
  sku?: Maybe<Scalars["String"]>;
  trackInventory?: Maybe<Scalars["Boolean"]>;
  weight?: Maybe<Scalars["WeightScalar"]>;
}

export interface ProductVariantReorder {
  __typename?: "ProductVariantReorder";
  errors: ProductError[];
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface ProductVariantReorderAttributeValues {
  __typename?: "ProductVariantReorderAttributeValues";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productVariant?: Maybe<ProductVariant>;
}

export interface ProductVariantSetDefault {
  __typename?: "ProductVariantSetDefault";
  errors: ProductError[];
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
}

export interface ProductVariantStocksCreate {
  __typename?: "ProductVariantStocksCreate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  bulkStockErrors: BulkStockError[];
  errors: BulkStockError[];
  productVariant?: Maybe<ProductVariant>;
}

export interface ProductVariantStocksDelete {
  __typename?: "ProductVariantStocksDelete";
  errors: StockError[];
  productVariant?: Maybe<ProductVariant>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  stockErrors: StockError[];
}

export interface ProductVariantStocksUpdate {
  __typename?: "ProductVariantStocksUpdate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  bulkStockErrors: BulkStockError[];
  errors: BulkStockError[];
  productVariant?: Maybe<ProductVariant>;
}

export type ProductVariantTranslatableContent = Node & {
  __typename?: "ProductVariantTranslatableContent";
  attributeValues: AttributeValueTranslatableContent[];
  id: Scalars["ID"];
  name: Scalars["String"];
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  productVariant?: Maybe<ProductVariant>;
  translation?: Maybe<ProductVariantTranslation>;
};

export interface ProductVariantTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface ProductVariantTranslate {
  __typename?: "ProductVariantTranslate";
  errors: TranslationError[];
  productVariant?: Maybe<ProductVariant>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export type ProductVariantTranslation = Node & {
  __typename?: "ProductVariantTranslation";
  id: Scalars["ID"];
  language: LanguageDisplay;
  name: Scalars["String"];
};

export interface ProductVariantUpdate {
  __typename?: "ProductVariantUpdate";
  errors: ProductError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productVariant?: Maybe<ProductVariant>;
}

export interface PublishableChannelListingInput {
  channelId: Scalars["ID"];
  isPublished?: Maybe<Scalars["Boolean"]>;
  publicationDate?: Maybe<Scalars["Date"]>;
}

export interface Query {
  __typename?: "Query";
  _entities?: Maybe<Array<Maybe<_Entity>>>;
  _service?: Maybe<_Service>;
  address?: Maybe<Address>;
  addressValidationRules?: Maybe<AddressValidationData>;
  app?: Maybe<App>;
  apps?: Maybe<AppCountableConnection>;
  appsInstallations: AppInstallation[];
  attribute?: Maybe<Attribute>;
  attributes?: Maybe<AttributeCountableConnection>;
  categories?: Maybe<CategoryCountableConnection>;
  category?: Maybe<Category>;
  channel?: Maybe<Channel>;
  channels?: Maybe<Channel[]>;
  checkout?: Maybe<Checkout>;
  checkoutLines?: Maybe<CheckoutLineCountableConnection>;
  checkouts?: Maybe<CheckoutCountableConnection>;
  collection?: Maybe<Collection>;
  collections?: Maybe<CollectionCountableConnection>;
  customers?: Maybe<UserCountableConnection>;
  digitalContent?: Maybe<DigitalContent>;
  digitalContents?: Maybe<DigitalContentCountableConnection>;
  draftOrders?: Maybe<OrderCountableConnection>;
  exportFile?: Maybe<ExportFile>;
  exportFiles?: Maybe<ExportFileCountableConnection>;
  giftCard?: Maybe<GiftCard>;
  giftCards?: Maybe<GiftCardCountableConnection>;
  homepageEvents?: Maybe<OrderEventCountableConnection>;
  me?: Maybe<User>;
  menu?: Maybe<Menu>;
  menuItem?: Maybe<MenuItem>;
  menuItems?: Maybe<MenuItemCountableConnection>;
  menus?: Maybe<MenuCountableConnection>;
  order?: Maybe<Order>;
  orderByToken?: Maybe<Order>;
  orderSettings?: Maybe<OrderSettings>;
  orders?: Maybe<OrderCountableConnection>;
  ordersTotal?: Maybe<TaxedMoney>;
  page?: Maybe<Page>;
  pageType?: Maybe<PageType>;
  pageTypes?: Maybe<PageTypeCountableConnection>;
  pages?: Maybe<PageCountableConnection>;
  payment?: Maybe<Payment>;
  payments?: Maybe<PaymentCountableConnection>;
  permissionGroup?: Maybe<Group>;
  permissionGroups?: Maybe<GroupCountableConnection>;
  plugin?: Maybe<Plugin>;
  plugins?: Maybe<PluginCountableConnection>;
  product?: Maybe<Product>;
  productType?: Maybe<ProductType>;
  productTypes?: Maybe<ProductTypeCountableConnection>;
  productVariant?: Maybe<ProductVariant>;
  productVariants?: Maybe<ProductVariantCountableConnection>;
  products?: Maybe<ProductCountableConnection>;
  reportProductSales?: Maybe<ProductVariantCountableConnection>;
  sale?: Maybe<Sale>;
  sales?: Maybe<SaleCountableConnection>;
  shippingZone?: Maybe<ShippingZone>;
  shippingZones?: Maybe<ShippingZoneCountableConnection>;
  shop: Shop;
  staffUsers?: Maybe<UserCountableConnection>;
  stock?: Maybe<Stock>;
  stocks?: Maybe<StockCountableConnection>;
  taxTypes?: Maybe<Array<Maybe<TaxType>>>;
  translation?: Maybe<TranslatableItem>;
  translations?: Maybe<TranslatableItemConnection>;
  user?: Maybe<User>;
  voucher?: Maybe<Voucher>;
  vouchers?: Maybe<VoucherCountableConnection>;
  warehouse?: Maybe<Warehouse>;
  warehouses?: Maybe<WarehouseCountableConnection>;
  webhook?: Maybe<Webhook>;
  webhookEvents?: Maybe<Array<Maybe<WebhookEvent>>>;
  webhookSamplePayload?: Maybe<Scalars["JSONString"]>;
}

export interface Query_EntitiesArgs {
  representations?: Maybe<Array<Maybe<Scalars["_Any"]>>>;
}

export interface QueryAddressArgs {
  id: Scalars["ID"];
}

export interface QueryAddressValidationRulesArgs {
  city?: Maybe<Scalars["String"]>;
  cityArea?: Maybe<Scalars["String"]>;
  countryArea?: Maybe<Scalars["String"]>;
  countryCode: CountryCode;
}

export interface QueryAppArgs {
  id?: Maybe<Scalars["ID"]>;
}

export interface QueryAppsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<AppFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<AppSortingInput>;
}

export interface QueryAttributeArgs {
  id?: Maybe<Scalars["ID"]>;
  slug?: Maybe<Scalars["String"]>;
}

export interface QueryAttributesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  filter?: Maybe<AttributeFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<AttributeSortingInput>;
}

export interface QueryCategoriesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<CategoryFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  level?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<CategorySortingInput>;
}

export interface QueryCategoryArgs {
  id?: Maybe<Scalars["ID"]>;
  slug?: Maybe<Scalars["String"]>;
}

export interface QueryChannelArgs {
  id?: Maybe<Scalars["ID"]>;
}

export interface QueryCheckoutArgs {
  token?: Maybe<Scalars["UUID"]>;
}

export interface QueryCheckoutLinesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface QueryCheckoutsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface QueryCollectionArgs {
  channel?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  slug?: Maybe<Scalars["String"]>;
}

export interface QueryCollectionsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  filter?: Maybe<CollectionFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<CollectionSortingInput>;
}

export interface QueryCustomersArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<CustomerFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<UserSortingInput>;
}

export interface QueryDigitalContentArgs {
  id: Scalars["ID"];
}

export interface QueryDigitalContentsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface QueryDraftOrdersArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<OrderDraftFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<OrderSortingInput>;
}

export interface QueryExportFileArgs {
  id: Scalars["ID"];
}

export interface QueryExportFilesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<ExportFileFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<ExportFileSortingInput>;
}

export interface QueryGiftCardArgs {
  id: Scalars["ID"];
}

export interface QueryGiftCardsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface QueryHomepageEventsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface QueryMenuArgs {
  channel?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
}

export interface QueryMenuItemArgs {
  channel?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
}

export interface QueryMenuItemsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  filter?: Maybe<MenuItemFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<MenuItemSortingInput>;
}

export interface QueryMenusArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  filter?: Maybe<MenuFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<MenuSortingInput>;
}

export interface QueryOrderArgs {
  id: Scalars["ID"];
}

export interface QueryOrderByTokenArgs {
  token: Scalars["UUID"];
}

export interface QueryOrdersArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  filter?: Maybe<OrderFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<OrderSortingInput>;
}

export interface QueryOrdersTotalArgs {
  channel?: Maybe<Scalars["String"]>;
  period?: Maybe<ReportingPeriod>;
}

export interface QueryPageArgs {
  id?: Maybe<Scalars["ID"]>;
  slug?: Maybe<Scalars["String"]>;
}

export interface QueryPageTypeArgs {
  id: Scalars["ID"];
}

export interface QueryPageTypesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<PageTypeFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<PageTypeSortingInput>;
}

export interface QueryPagesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<PageFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<PageSortingInput>;
}

export interface QueryPaymentArgs {
  id: Scalars["ID"];
}

export interface QueryPaymentsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<PaymentFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface QueryPermissionGroupArgs {
  id: Scalars["ID"];
}

export interface QueryPermissionGroupsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<PermissionGroupFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<PermissionGroupSortingInput>;
}

export interface QueryPluginArgs {
  id: Scalars["ID"];
}

export interface QueryPluginsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<PluginFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<PluginSortingInput>;
}

export interface QueryProductArgs {
  channel?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  slug?: Maybe<Scalars["String"]>;
}

export interface QueryProductTypeArgs {
  id: Scalars["ID"];
}

export interface QueryProductTypesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<ProductTypeFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<ProductTypeSortingInput>;
}

export interface QueryProductVariantArgs {
  channel?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  sku?: Maybe<Scalars["String"]>;
}

export interface QueryProductVariantsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  filter?: Maybe<ProductVariantFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  last?: Maybe<Scalars["Int"]>;
}

export interface QueryProductsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  filter?: Maybe<ProductFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<ProductOrder>;
}

export interface QueryReportProductSalesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel: Scalars["String"];
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  period: ReportingPeriod;
}

export interface QuerySaleArgs {
  channel?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
}

export interface QuerySalesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  filter?: Maybe<SaleFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  query?: Maybe<Scalars["String"]>;
  sortBy?: Maybe<SaleSortingInput>;
}

export interface QueryShippingZoneArgs {
  channel?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
}

export interface QueryShippingZonesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  filter?: Maybe<ShippingZoneFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface QueryStaffUsersArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<StaffUserInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<UserSortingInput>;
}

export interface QueryStockArgs {
  id: Scalars["ID"];
}

export interface QueryStocksArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<StockFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface QueryTranslationArgs {
  id: Scalars["ID"];
  kind: TranslatableKinds;
}

export interface QueryTranslationsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  kind: TranslatableKinds;
  last?: Maybe<Scalars["Int"]>;
}

export interface QueryUserArgs {
  email?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
}

export interface QueryVoucherArgs {
  channel?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
}

export interface QueryVouchersArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  filter?: Maybe<VoucherFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  query?: Maybe<Scalars["String"]>;
  sortBy?: Maybe<VoucherSortingInput>;
}

export interface QueryWarehouseArgs {
  id: Scalars["ID"];
}

export interface QueryWarehousesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  filter?: Maybe<WarehouseFilterInput>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<WarehouseSortingInput>;
}

export interface QueryWebhookArgs {
  id: Scalars["ID"];
}

export interface QueryWebhookSamplePayloadArgs {
  eventType: WebhookSampleEventTypeEnum;
}

export interface ReducedRate {
  __typename?: "ReducedRate";
  rate: Scalars["Float"];
  rateType: Scalars["String"];
}

export interface RefreshToken {
  __typename?: "RefreshToken";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  token?: Maybe<Scalars["String"]>;
  user?: Maybe<User>;
}

export interface ReorderInput {
  id: Scalars["ID"];
  sortOrder?: Maybe<Scalars["Int"]>;
}

export enum ReportingPeriod {
  ThisMonth = "THIS_MONTH",
  Today = "TODAY",
}

export interface RequestEmailChange {
  __typename?: "RequestEmailChange";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface RequestPasswordReset {
  __typename?: "RequestPasswordReset";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
}

export type Sale = Node &
  ObjectWithMetadata & {
    __typename?: "Sale";
    categories?: Maybe<CategoryCountableConnection>;
    channelListings?: Maybe<SaleChannelListing[]>;
    collections?: Maybe<CollectionCountableConnection>;
    currency?: Maybe<Scalars["String"]>;
    discountValue?: Maybe<Scalars["Float"]>;
    endDate?: Maybe<Scalars["DateTime"]>;
    id: Scalars["ID"];
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    privateMetadata: Array<Maybe<MetadataItem>>;
    products?: Maybe<ProductCountableConnection>;
    startDate: Scalars["DateTime"];
    translation?: Maybe<SaleTranslation>;
    type: SaleType;
  };

export interface SaleCategoriesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface SaleCollectionsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface SaleProductsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface SaleTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface SaleAddCatalogues {
  __typename?: "SaleAddCatalogues";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  sale?: Maybe<Sale>;
}

export interface SaleBulkDelete {
  __typename?: "SaleBulkDelete";
  count: Scalars["Int"];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
}

export type SaleChannelListing = Node & {
  __typename?: "SaleChannelListing";
  channel: Channel;
  currency: Scalars["String"];
  discountValue: Scalars["Float"];
  id: Scalars["ID"];
};

export interface SaleChannelListingAddInput {
  channelId: Scalars["ID"];
  discountValue: Scalars["PositiveDecimal"];
}

export interface SaleChannelListingInput {
  addChannels?: Maybe<SaleChannelListingAddInput[]>;
  removeChannels?: Maybe<Array<Scalars["ID"]>>;
}

export interface SaleChannelListingUpdate {
  __typename?: "SaleChannelListingUpdate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  sale?: Maybe<Sale>;
}

export interface SaleCountableConnection {
  __typename?: "SaleCountableConnection";
  edges: SaleCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface SaleCountableEdge {
  __typename?: "SaleCountableEdge";
  cursor: Scalars["String"];
  node: Sale;
}

export interface SaleCreate {
  __typename?: "SaleCreate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  sale?: Maybe<Sale>;
}

export interface SaleDelete {
  __typename?: "SaleDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  sale?: Maybe<Sale>;
}

export interface SaleFilterInput {
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  saleType?: Maybe<DiscountValueTypeEnum>;
  search?: Maybe<Scalars["String"]>;
  started?: Maybe<DateTimeRangeInput>;
  status?: Maybe<Array<Maybe<DiscountStatusEnum>>>;
}

export interface SaleInput {
  categories?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  collections?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  endDate?: Maybe<Scalars["DateTime"]>;
  name?: Maybe<Scalars["String"]>;
  products?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  startDate?: Maybe<Scalars["DateTime"]>;
  type?: Maybe<DiscountValueTypeEnum>;
  value?: Maybe<Scalars["PositiveDecimal"]>;
}

export interface SaleRemoveCatalogues {
  __typename?: "SaleRemoveCatalogues";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  sale?: Maybe<Sale>;
}

export enum SaleSortField {
  EndDate = "END_DATE",
  Name = "NAME",
  StartDate = "START_DATE",
  Type = "TYPE",
  Value = "VALUE",
}

export interface SaleSortingInput {
  channel?: Maybe<Scalars["String"]>;
  direction: OrderDirection;
  field: SaleSortField;
}

export type SaleTranslatableContent = Node & {
  __typename?: "SaleTranslatableContent";
  id: Scalars["ID"];
  name: Scalars["String"];
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  sale?: Maybe<Sale>;
  translation?: Maybe<SaleTranslation>;
};

export interface SaleTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface SaleTranslate {
  __typename?: "SaleTranslate";
  errors: TranslationError[];
  sale?: Maybe<Sale>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export type SaleTranslation = Node & {
  __typename?: "SaleTranslation";
  id: Scalars["ID"];
  language: LanguageDisplay;
  name?: Maybe<Scalars["String"]>;
};

export enum SaleType {
  Fixed = "FIXED",
  Percentage = "PERCENTAGE",
}

export interface SaleUpdate {
  __typename?: "SaleUpdate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  sale?: Maybe<Sale>;
}

export interface SelectedAttribute {
  __typename?: "SelectedAttribute";
  attribute: Attribute;
  values: Array<Maybe<AttributeValue>>;
}

export interface SeoInput {
  description?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
}

export interface SetPassword {
  __typename?: "SetPassword";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  csrfToken?: Maybe<Scalars["String"]>;
  errors: AccountError[];
  refreshToken?: Maybe<Scalars["String"]>;
  token?: Maybe<Scalars["String"]>;
  user?: Maybe<User>;
}

export interface ShippingError {
  __typename?: "ShippingError";
  channels?: Maybe<Array<Scalars["ID"]>>;
  code: ShippingErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  warehouses?: Maybe<Array<Scalars["ID"]>>;
}

export enum ShippingErrorCode {
  AlreadyExists = "ALREADY_EXISTS",
  DuplicatedInputItem = "DUPLICATED_INPUT_ITEM",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  MaxLessThanMin = "MAX_LESS_THAN_MIN",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export type ShippingMethod = Node &
  ObjectWithMetadata & {
    __typename?: "ShippingMethod";
    channelListings?: Maybe<ShippingMethodChannelListing[]>;
    description?: Maybe<Scalars["JSONString"]>;
    excludedProducts?: Maybe<ProductCountableConnection>;
    id: Scalars["ID"];
    maximumDeliveryDays?: Maybe<Scalars["Int"]>;
    maximumOrderPrice?: Maybe<Money>;
    maximumOrderWeight?: Maybe<Weight>;
    metadata: Array<Maybe<MetadataItem>>;
    minimumDeliveryDays?: Maybe<Scalars["Int"]>;
    minimumOrderPrice?: Maybe<Money>;
    minimumOrderWeight?: Maybe<Weight>;
    name: Scalars["String"];
    postalCodeRules?: Maybe<Array<Maybe<ShippingMethodPostalCodeRule>>>;
    price?: Maybe<Money>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    translation?: Maybe<ShippingMethodTranslation>;
    type?: Maybe<ShippingMethodTypeEnum>;
  };

export interface ShippingMethodExcludedProductsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface ShippingMethodTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export type ShippingMethodChannelListing = Node & {
  __typename?: "ShippingMethodChannelListing";
  channel: Channel;
  id: Scalars["ID"];
  maximumOrderPrice?: Maybe<Money>;
  minimumOrderPrice?: Maybe<Money>;
  price?: Maybe<Money>;
};

export interface ShippingMethodChannelListingAddInput {
  channelId: Scalars["ID"];
  maximumOrderPrice?: Maybe<Scalars["PositiveDecimal"]>;
  minimumOrderPrice?: Maybe<Scalars["PositiveDecimal"]>;
  price?: Maybe<Scalars["PositiveDecimal"]>;
}

export interface ShippingMethodChannelListingInput {
  addChannels?: Maybe<ShippingMethodChannelListingAddInput[]>;
  removeChannels?: Maybe<Array<Scalars["ID"]>>;
}

export interface ShippingMethodChannelListingUpdate {
  __typename?: "ShippingMethodChannelListingUpdate";
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
  shippingMethod?: Maybe<ShippingMethod>;
}

export type ShippingMethodPostalCodeRule = Node & {
  __typename?: "ShippingMethodPostalCodeRule";
  end?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  inclusionType?: Maybe<PostalCodeRuleInclusionTypeEnum>;
  start?: Maybe<Scalars["String"]>;
};

export type ShippingMethodTranslatableContent = Node & {
  __typename?: "ShippingMethodTranslatableContent";
  description?: Maybe<Scalars["JSONString"]>;
  id: Scalars["ID"];
  name: Scalars["String"];
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  shippingMethod?: Maybe<ShippingMethod>;
  translation?: Maybe<ShippingMethodTranslation>;
};

export interface ShippingMethodTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export type ShippingMethodTranslation = Node & {
  __typename?: "ShippingMethodTranslation";
  description?: Maybe<Scalars["JSONString"]>;
  id: Scalars["ID"];
  language: LanguageDisplay;
  name?: Maybe<Scalars["String"]>;
};

export enum ShippingMethodTypeEnum {
  Price = "PRICE",
  Weight = "WEIGHT",
}

export interface ShippingPostalCodeRulesCreateInputRange {
  end?: Maybe<Scalars["String"]>;
  start: Scalars["String"];
}

export interface ShippingPriceBulkDelete {
  __typename?: "ShippingPriceBulkDelete";
  count: Scalars["Int"];
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
}

export interface ShippingPriceCreate {
  __typename?: "ShippingPriceCreate";
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
  shippingMethod?: Maybe<ShippingMethod>;
  shippingZone?: Maybe<ShippingZone>;
}

export interface ShippingPriceDelete {
  __typename?: "ShippingPriceDelete";
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
  shippingMethod?: Maybe<ShippingMethod>;
  shippingZone?: Maybe<ShippingZone>;
}

export interface ShippingPriceExcludeProducts {
  __typename?: "ShippingPriceExcludeProducts";
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
  shippingMethod?: Maybe<ShippingMethod>;
}

export interface ShippingPriceExcludeProductsInput {
  products: Array<Maybe<Scalars["ID"]>>;
}

export interface ShippingPriceInput {
  addPostalCodeRules?: Maybe<ShippingPostalCodeRulesCreateInputRange[]>;
  deletePostalCodeRules?: Maybe<Array<Scalars["ID"]>>;
  description?: Maybe<Scalars["JSONString"]>;
  inclusionType?: Maybe<PostalCodeRuleInclusionTypeEnum>;
  maximumDeliveryDays?: Maybe<Scalars["Int"]>;
  maximumOrderWeight?: Maybe<Scalars["WeightScalar"]>;
  minimumDeliveryDays?: Maybe<Scalars["Int"]>;
  minimumOrderWeight?: Maybe<Scalars["WeightScalar"]>;
  name?: Maybe<Scalars["String"]>;
  shippingZone?: Maybe<Scalars["ID"]>;
  type?: Maybe<ShippingMethodTypeEnum>;
}

export interface ShippingPriceRemoveProductFromExclude {
  __typename?: "ShippingPriceRemoveProductFromExclude";
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
  shippingMethod?: Maybe<ShippingMethod>;
}

export interface ShippingPriceTranslate {
  __typename?: "ShippingPriceTranslate";
  errors: TranslationError[];
  shippingMethod?: Maybe<ShippingMethod>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export interface ShippingPriceTranslationInput {
  description?: Maybe<Scalars["JSONString"]>;
  name?: Maybe<Scalars["String"]>;
}

export interface ShippingPriceUpdate {
  __typename?: "ShippingPriceUpdate";
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
  shippingMethod?: Maybe<ShippingMethod>;
  shippingZone?: Maybe<ShippingZone>;
}

export type ShippingZone = Node &
  ObjectWithMetadata & {
    __typename?: "ShippingZone";
    channels: Channel[];
    countries?: Maybe<Array<Maybe<CountryDisplay>>>;
    default: Scalars["Boolean"];
    description?: Maybe<Scalars["String"]>;
    id: Scalars["ID"];
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    priceRange?: Maybe<MoneyRange>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    shippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
    warehouses: Warehouse[];
  };

export interface ShippingZoneBulkDelete {
  __typename?: "ShippingZoneBulkDelete";
  count: Scalars["Int"];
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
}

export interface ShippingZoneCountableConnection {
  __typename?: "ShippingZoneCountableConnection";
  edges: ShippingZoneCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface ShippingZoneCountableEdge {
  __typename?: "ShippingZoneCountableEdge";
  cursor: Scalars["String"];
  node: ShippingZone;
}

export interface ShippingZoneCreate {
  __typename?: "ShippingZoneCreate";
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
  shippingZone?: Maybe<ShippingZone>;
}

export interface ShippingZoneCreateInput {
  addChannels?: Maybe<Array<Scalars["ID"]>>;
  addWarehouses?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  countries?: Maybe<Array<Maybe<Scalars["String"]>>>;
  default?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
}

export interface ShippingZoneDelete {
  __typename?: "ShippingZoneDelete";
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
  shippingZone?: Maybe<ShippingZone>;
}

export interface ShippingZoneFilterInput {
  channels?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  search?: Maybe<Scalars["String"]>;
}

export interface ShippingZoneUpdate {
  __typename?: "ShippingZoneUpdate";
  errors: ShippingError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: ShippingError[];
  shippingZone?: Maybe<ShippingZone>;
}

export interface ShippingZoneUpdateInput {
  addChannels?: Maybe<Array<Scalars["ID"]>>;
  addWarehouses?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  countries?: Maybe<Array<Maybe<Scalars["String"]>>>;
  default?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  removeChannels?: Maybe<Array<Scalars["ID"]>>;
  removeWarehouses?: Maybe<Array<Maybe<Scalars["ID"]>>>;
}

export interface Shop {
  __typename?: "Shop";
  automaticFulfillmentDigitalProducts?: Maybe<Scalars["Boolean"]>;
  availableExternalAuthentications: ExternalAuthentication[];
  availablePaymentGateways: PaymentGateway[];
  availableShippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
  chargeTaxesOnShipping: Scalars["Boolean"];
  companyAddress?: Maybe<Address>;
  countries: CountryDisplay[];
  customerSetPasswordUrl?: Maybe<Scalars["String"]>;
  defaultCountry?: Maybe<CountryDisplay>;
  defaultDigitalMaxDownloads?: Maybe<Scalars["Int"]>;
  defaultDigitalUrlValidDays?: Maybe<Scalars["Int"]>;
  defaultMailSenderAddress?: Maybe<Scalars["String"]>;
  defaultMailSenderName?: Maybe<Scalars["String"]>;
  defaultWeightUnit?: Maybe<WeightUnitsEnum>;
  description?: Maybe<Scalars["String"]>;
  displayGrossPrices: Scalars["Boolean"];
  domain: Domain;
  headerText?: Maybe<Scalars["String"]>;
  includeTaxesInPrices: Scalars["Boolean"];
  languages: Array<Maybe<LanguageDisplay>>;
  limits: LimitInfo;
  name: Scalars["String"];
  permissions: Array<Maybe<Permission>>;
  phonePrefixes: Array<Maybe<Scalars["String"]>>;
  staffNotificationRecipients?: Maybe<Array<Maybe<StaffNotificationRecipient>>>;
  trackInventoryByDefault?: Maybe<Scalars["Boolean"]>;
  translation?: Maybe<ShopTranslation>;
  version: Scalars["String"];
}

export interface ShopAvailablePaymentGatewaysArgs {
  channel?: Maybe<Scalars["String"]>;
  currency?: Maybe<Scalars["String"]>;
}

export interface ShopAvailableShippingMethodsArgs {
  address?: Maybe<AddressInput>;
  channel: Scalars["String"];
}

export interface ShopCountriesArgs {
  languageCode?: Maybe<LanguageCodeEnum>;
}

export interface ShopTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface ShopAddressUpdate {
  __typename?: "ShopAddressUpdate";
  errors: ShopError[];
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: ShopError[];
}

export interface ShopDomainUpdate {
  __typename?: "ShopDomainUpdate";
  errors: ShopError[];
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: ShopError[];
}

export interface ShopError {
  __typename?: "ShopError";
  code: ShopErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum ShopErrorCode {
  AlreadyExists = "ALREADY_EXISTS",
  CannotFetchTaxRates = "CANNOT_FETCH_TAX_RATES",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface ShopFetchTaxRates {
  __typename?: "ShopFetchTaxRates";
  errors: ShopError[];
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: ShopError[];
}

export interface ShopSettingsInput {
  automaticFulfillmentDigitalProducts?: Maybe<Scalars["Boolean"]>;
  chargeTaxesOnShipping?: Maybe<Scalars["Boolean"]>;
  customerSetPasswordUrl?: Maybe<Scalars["String"]>;
  defaultDigitalMaxDownloads?: Maybe<Scalars["Int"]>;
  defaultDigitalUrlValidDays?: Maybe<Scalars["Int"]>;
  defaultMailSenderAddress?: Maybe<Scalars["String"]>;
  defaultMailSenderName?: Maybe<Scalars["String"]>;
  defaultWeightUnit?: Maybe<WeightUnitsEnum>;
  description?: Maybe<Scalars["String"]>;
  displayGrossPrices?: Maybe<Scalars["Boolean"]>;
  headerText?: Maybe<Scalars["String"]>;
  includeTaxesInPrices?: Maybe<Scalars["Boolean"]>;
  trackInventoryByDefault?: Maybe<Scalars["Boolean"]>;
}

export interface ShopSettingsTranslate {
  __typename?: "ShopSettingsTranslate";
  errors: TranslationError[];
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
}

export interface ShopSettingsTranslationInput {
  description?: Maybe<Scalars["String"]>;
  headerText?: Maybe<Scalars["String"]>;
}

export interface ShopSettingsUpdate {
  __typename?: "ShopSettingsUpdate";
  errors: ShopError[];
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: ShopError[];
}

export type ShopTranslation = Node & {
  __typename?: "ShopTranslation";
  description: Scalars["String"];
  headerText: Scalars["String"];
  id: Scalars["ID"];
  language: LanguageDisplay;
};

export interface SiteDomainInput {
  domain?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
}

export interface StaffBulkDelete {
  __typename?: "StaffBulkDelete";
  count: Scalars["Int"];
  errors: StaffError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  staffErrors: StaffError[];
}

export interface StaffCreate {
  __typename?: "StaffCreate";
  errors: StaffError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  staffErrors: StaffError[];
  user?: Maybe<User>;
}

export interface StaffCreateInput {
  addGroups?: Maybe<Array<Scalars["ID"]>>;
  email?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  isActive?: Maybe<Scalars["Boolean"]>;
  lastName?: Maybe<Scalars["String"]>;
  note?: Maybe<Scalars["String"]>;
  redirectUrl?: Maybe<Scalars["String"]>;
}

export interface StaffDelete {
  __typename?: "StaffDelete";
  errors: StaffError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  staffErrors: StaffError[];
  user?: Maybe<User>;
}

export interface StaffError {
  __typename?: "StaffError";
  addressType?: Maybe<AddressTypeEnum>;
  code: AccountErrorCode;
  field?: Maybe<Scalars["String"]>;
  groups?: Maybe<Array<Scalars["ID"]>>;
  message?: Maybe<Scalars["String"]>;
  permissions?: Maybe<PermissionEnum[]>;
  users?: Maybe<Array<Scalars["ID"]>>;
}

export enum StaffMemberStatus {
  Active = "ACTIVE",
  Deactivated = "DEACTIVATED",
}

export type StaffNotificationRecipient = Node & {
  __typename?: "StaffNotificationRecipient";
  active?: Maybe<Scalars["Boolean"]>;
  email?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  user?: Maybe<User>;
};

export interface StaffNotificationRecipientCreate {
  __typename?: "StaffNotificationRecipientCreate";
  errors: ShopError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: ShopError[];
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
}

export interface StaffNotificationRecipientDelete {
  __typename?: "StaffNotificationRecipientDelete";
  errors: ShopError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: ShopError[];
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
}

export interface StaffNotificationRecipientInput {
  active?: Maybe<Scalars["Boolean"]>;
  email?: Maybe<Scalars["String"]>;
  user?: Maybe<Scalars["ID"]>;
}

export interface StaffNotificationRecipientUpdate {
  __typename?: "StaffNotificationRecipientUpdate";
  errors: ShopError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: ShopError[];
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
}

export interface StaffUpdate {
  __typename?: "StaffUpdate";
  errors: StaffError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  staffErrors: StaffError[];
  user?: Maybe<User>;
}

export interface StaffUpdateInput {
  addGroups?: Maybe<Array<Scalars["ID"]>>;
  email?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  isActive?: Maybe<Scalars["Boolean"]>;
  lastName?: Maybe<Scalars["String"]>;
  note?: Maybe<Scalars["String"]>;
  removeGroups?: Maybe<Array<Scalars["ID"]>>;
}

export interface StaffUserInput {
  search?: Maybe<Scalars["String"]>;
  status?: Maybe<StaffMemberStatus>;
}

export type Stock = Node & {
  __typename?: "Stock";
  id: Scalars["ID"];
  productVariant: ProductVariant;
  quantity: Scalars["Int"];
  quantityAllocated: Scalars["Int"];
  warehouse: Warehouse;
};

export enum StockAvailability {
  InStock = "IN_STOCK",
  OutOfStock = "OUT_OF_STOCK",
}

export interface StockCountableConnection {
  __typename?: "StockCountableConnection";
  edges: StockCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface StockCountableEdge {
  __typename?: "StockCountableEdge";
  cursor: Scalars["String"];
  node: Stock;
}

export interface StockError {
  __typename?: "StockError";
  code: StockErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum StockErrorCode {
  AlreadyExists = "ALREADY_EXISTS",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface StockFilterInput {
  quantity?: Maybe<Scalars["Float"]>;
  search?: Maybe<Scalars["String"]>;
}

export interface StockInput {
  quantity: Scalars["Int"];
  warehouse: Scalars["ID"];
}

export interface TaxType {
  __typename?: "TaxType";
  description?: Maybe<Scalars["String"]>;
  taxCode?: Maybe<Scalars["String"]>;
}

export interface TaxedMoney {
  __typename?: "TaxedMoney";
  currency: Scalars["String"];
  gross: Money;
  net: Money;
  tax: Money;
}

export interface TaxedMoneyRange {
  __typename?: "TaxedMoneyRange";
  start?: Maybe<TaxedMoney>;
  stop?: Maybe<TaxedMoney>;
}

export type Transaction = Node & {
  __typename?: "Transaction";
  amount?: Maybe<Money>;
  created: Scalars["DateTime"];
  error?: Maybe<Scalars["String"]>;
  gatewayResponse: Scalars["JSONString"];
  id: Scalars["ID"];
  isSuccess: Scalars["Boolean"];
  kind: TransactionKind;
  payment: Payment;
  token: Scalars["String"];
};

export enum TransactionKind {
  ActionToConfirm = "ACTION_TO_CONFIRM",
  Auth = "AUTH",
  Cancel = "CANCEL",
  Capture = "CAPTURE",
  Confirm = "CONFIRM",
  External = "EXTERNAL",
  Pending = "PENDING",
  Refund = "REFUND",
  RefundOngoing = "REFUND_ONGOING",
  Void = "VOID",
}

export type TranslatableItem =
  | AttributeTranslatableContent
  | AttributeValueTranslatableContent
  | CategoryTranslatableContent
  | CollectionTranslatableContent
  | MenuItemTranslatableContent
  | PageTranslatableContent
  | ProductTranslatableContent
  | ProductVariantTranslatableContent
  | SaleTranslatableContent
  | ShippingMethodTranslatableContent
  | VoucherTranslatableContent;

export interface TranslatableItemConnection {
  __typename?: "TranslatableItemConnection";
  edges: TranslatableItemEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface TranslatableItemEdge {
  __typename?: "TranslatableItemEdge";
  cursor: Scalars["String"];
  node: TranslatableItem;
}

export enum TranslatableKinds {
  Attribute = "ATTRIBUTE",
  AttributeValue = "ATTRIBUTE_VALUE",
  Category = "CATEGORY",
  Collection = "COLLECTION",
  MenuItem = "MENU_ITEM",
  Page = "PAGE",
  Product = "PRODUCT",
  Sale = "SALE",
  ShippingMethod = "SHIPPING_METHOD",
  Variant = "VARIANT",
  Voucher = "VOUCHER",
}

export interface TranslationError {
  __typename?: "TranslationError";
  code: TranslationErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum TranslationErrorCode {
  GraphqlError = "GRAPHQL_ERROR",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
}

export interface TranslationInput {
  description?: Maybe<Scalars["JSONString"]>;
  name?: Maybe<Scalars["String"]>;
  seoDescription?: Maybe<Scalars["String"]>;
  seoTitle?: Maybe<Scalars["String"]>;
}

export interface UpdateInvoiceInput {
  number?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
}

export interface UpdateMetadata {
  __typename?: "UpdateMetadata";
  errors: MetadataError[];
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: MetadataError[];
}

export interface UpdatePrivateMetadata {
  __typename?: "UpdatePrivateMetadata";
  errors: MetadataError[];
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: MetadataError[];
}

export interface UploadError {
  __typename?: "UploadError";
  code: UploadErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum UploadErrorCode {
  GraphqlError = "GRAPHQL_ERROR",
}

export type User = Node &
  ObjectWithMetadata & {
    __typename?: "User";
    addresses?: Maybe<Array<Maybe<Address>>>;
    avatar?: Maybe<Image>;
    /** @deprecated Will be removed in Saleor 4.0. Use the `checkout_tokens` field to fetch the user checkouts. */
    checkout?: Maybe<Checkout>;
    checkoutTokens?: Maybe<Array<Scalars["UUID"]>>;
    dateJoined: Scalars["DateTime"];
    defaultBillingAddress?: Maybe<Address>;
    defaultShippingAddress?: Maybe<Address>;
    editableGroups?: Maybe<Array<Maybe<Group>>>;
    email: Scalars["String"];
    events?: Maybe<Array<Maybe<CustomerEvent>>>;
    firstName: Scalars["String"];
    giftCards?: Maybe<GiftCardCountableConnection>;
    id: Scalars["ID"];
    isActive: Scalars["Boolean"];
    isStaff: Scalars["Boolean"];
    languageCode: LanguageCodeEnum;
    lastLogin?: Maybe<Scalars["DateTime"]>;
    lastName: Scalars["String"];
    metadata: Array<Maybe<MetadataItem>>;
    note?: Maybe<Scalars["String"]>;
    orders?: Maybe<OrderCountableConnection>;
    permissionGroups?: Maybe<Array<Maybe<Group>>>;
    privateMetadata: Array<Maybe<MetadataItem>>;
    storedPaymentSources?: Maybe<Array<Maybe<PaymentSource>>>;
    userPermissions?: Maybe<Array<Maybe<UserPermission>>>;
  };

export interface UserAvatarArgs {
  size?: Maybe<Scalars["Int"]>;
}

export interface UserCheckoutTokensArgs {
  channel?: Maybe<Scalars["String"]>;
}

export interface UserGiftCardsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface UserOrdersArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface UserStoredPaymentSourcesArgs {
  channel?: Maybe<Scalars["String"]>;
}

export interface UserAvatarDelete {
  __typename?: "UserAvatarDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface UserAvatarUpdate {
  __typename?: "UserAvatarUpdate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  user?: Maybe<User>;
}

export interface UserBulkSetActive {
  __typename?: "UserBulkSetActive";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  count: Scalars["Int"];
  errors: AccountError[];
}

export interface UserCountableConnection {
  __typename?: "UserCountableConnection";
  edges: UserCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface UserCountableEdge {
  __typename?: "UserCountableEdge";
  cursor: Scalars["String"];
  node: User;
}

export interface UserCreateInput {
  channel?: Maybe<Scalars["String"]>;
  defaultBillingAddress?: Maybe<AddressInput>;
  defaultShippingAddress?: Maybe<AddressInput>;
  email?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  isActive?: Maybe<Scalars["Boolean"]>;
  languageCode?: Maybe<LanguageCodeEnum>;
  lastName?: Maybe<Scalars["String"]>;
  note?: Maybe<Scalars["String"]>;
  redirectUrl?: Maybe<Scalars["String"]>;
}

export interface UserPermission {
  __typename?: "UserPermission";
  code: PermissionEnum;
  name: Scalars["String"];
  sourcePermissionGroups?: Maybe<Group[]>;
}

export interface UserPermissionSourcePermissionGroupsArgs {
  userId: Scalars["ID"];
}

export enum UserSortField {
  Email = "EMAIL",
  FirstName = "FIRST_NAME",
  LastName = "LAST_NAME",
  OrderCount = "ORDER_COUNT",
}

export interface UserSortingInput {
  direction: OrderDirection;
  field: UserSortField;
}

export interface Vat {
  __typename?: "VAT";
  countryCode: Scalars["String"];
  reducedRates: Array<Maybe<ReducedRate>>;
  standardRate?: Maybe<Scalars["Float"]>;
}

export enum VariantAttributeScope {
  All = "ALL",
  NotVariantSelection = "NOT_VARIANT_SELECTION",
  VariantSelection = "VARIANT_SELECTION",
}

export interface VariantMediaAssign {
  __typename?: "VariantMediaAssign";
  errors: ProductError[];
  media?: Maybe<ProductMedia>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productVariant?: Maybe<ProductVariant>;
}

export interface VariantMediaUnassign {
  __typename?: "VariantMediaUnassign";
  errors: ProductError[];
  media?: Maybe<ProductMedia>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: ProductError[];
  productVariant?: Maybe<ProductVariant>;
}

export interface VariantPricingInfo {
  __typename?: "VariantPricingInfo";
  discount?: Maybe<TaxedMoney>;
  discountLocalCurrency?: Maybe<TaxedMoney>;
  onSale?: Maybe<Scalars["Boolean"]>;
  price?: Maybe<TaxedMoney>;
  priceLocalCurrency?: Maybe<TaxedMoney>;
  priceUndiscounted?: Maybe<TaxedMoney>;
}

export interface VerifyToken {
  __typename?: "VerifyToken";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: AccountError[];
  errors: AccountError[];
  isValid: Scalars["Boolean"];
  payload?: Maybe<Scalars["GenericScalar"]>;
  user?: Maybe<User>;
}

export enum VolumeUnitsEnum {
  AcreFt = "ACRE_FT",
  AcreIn = "ACRE_IN",
  CubicCentimeter = "CUBIC_CENTIMETER",
  CubicDecimeter = "CUBIC_DECIMETER",
  CubicFoot = "CUBIC_FOOT",
  CubicInch = "CUBIC_INCH",
  CubicMeter = "CUBIC_METER",
  CubicMillimeter = "CUBIC_MILLIMETER",
  CubicYard = "CUBIC_YARD",
  FlOz = "FL_OZ",
  Liter = "LITER",
  Pint = "PINT",
  Qt = "QT",
}

export type Voucher = Node &
  ObjectWithMetadata & {
    __typename?: "Voucher";
    applyOncePerCustomer: Scalars["Boolean"];
    applyOncePerOrder: Scalars["Boolean"];
    categories?: Maybe<CategoryCountableConnection>;
    channelListings?: Maybe<VoucherChannelListing[]>;
    code: Scalars["String"];
    collections?: Maybe<CollectionCountableConnection>;
    countries?: Maybe<Array<Maybe<CountryDisplay>>>;
    currency?: Maybe<Scalars["String"]>;
    discountValue?: Maybe<Scalars["Float"]>;
    discountValueType: DiscountValueTypeEnum;
    endDate?: Maybe<Scalars["DateTime"]>;
    id: Scalars["ID"];
    metadata: Array<Maybe<MetadataItem>>;
    minCheckoutItemsQuantity?: Maybe<Scalars["Int"]>;
    minSpent?: Maybe<Money>;
    name?: Maybe<Scalars["String"]>;
    onlyForStaff: Scalars["Boolean"];
    privateMetadata: Array<Maybe<MetadataItem>>;
    products?: Maybe<ProductCountableConnection>;
    startDate: Scalars["DateTime"];
    translation?: Maybe<VoucherTranslation>;
    type: VoucherTypeEnum;
    usageLimit?: Maybe<Scalars["Int"]>;
    used: Scalars["Int"];
  };

export interface VoucherCategoriesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface VoucherCollectionsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface VoucherProductsArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface VoucherTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface VoucherAddCatalogues {
  __typename?: "VoucherAddCatalogues";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  voucher?: Maybe<Voucher>;
}

export interface VoucherBulkDelete {
  __typename?: "VoucherBulkDelete";
  count: Scalars["Int"];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
}

export type VoucherChannelListing = Node & {
  __typename?: "VoucherChannelListing";
  channel: Channel;
  currency: Scalars["String"];
  discountValue: Scalars["Float"];
  id: Scalars["ID"];
  minSpent?: Maybe<Money>;
};

export interface VoucherChannelListingAddInput {
  channelId: Scalars["ID"];
  discountValue?: Maybe<Scalars["PositiveDecimal"]>;
  minAmountSpent?: Maybe<Scalars["PositiveDecimal"]>;
}

export interface VoucherChannelListingInput {
  addChannels?: Maybe<VoucherChannelListingAddInput[]>;
  removeChannels?: Maybe<Array<Scalars["ID"]>>;
}

export interface VoucherChannelListingUpdate {
  __typename?: "VoucherChannelListingUpdate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  voucher?: Maybe<Voucher>;
}

export interface VoucherCountableConnection {
  __typename?: "VoucherCountableConnection";
  edges: VoucherCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface VoucherCountableEdge {
  __typename?: "VoucherCountableEdge";
  cursor: Scalars["String"];
  node: Voucher;
}

export interface VoucherCreate {
  __typename?: "VoucherCreate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  voucher?: Maybe<Voucher>;
}

export interface VoucherDelete {
  __typename?: "VoucherDelete";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  voucher?: Maybe<Voucher>;
}

export enum VoucherDiscountType {
  Fixed = "FIXED",
  Percentage = "PERCENTAGE",
  Shipping = "SHIPPING",
}

export interface VoucherFilterInput {
  discountType?: Maybe<Array<Maybe<VoucherDiscountType>>>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  search?: Maybe<Scalars["String"]>;
  started?: Maybe<DateTimeRangeInput>;
  status?: Maybe<Array<Maybe<DiscountStatusEnum>>>;
  timesUsed?: Maybe<IntRangeInput>;
}

export interface VoucherInput {
  applyOncePerCustomer?: Maybe<Scalars["Boolean"]>;
  applyOncePerOrder?: Maybe<Scalars["Boolean"]>;
  categories?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  code?: Maybe<Scalars["String"]>;
  collections?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  countries?: Maybe<Array<Maybe<Scalars["String"]>>>;
  discountValueType?: Maybe<DiscountValueTypeEnum>;
  endDate?: Maybe<Scalars["DateTime"]>;
  minCheckoutItemsQuantity?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  onlyForStaff?: Maybe<Scalars["Boolean"]>;
  products?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  startDate?: Maybe<Scalars["DateTime"]>;
  type?: Maybe<VoucherTypeEnum>;
  usageLimit?: Maybe<Scalars["Int"]>;
}

export interface VoucherRemoveCatalogues {
  __typename?: "VoucherRemoveCatalogues";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  voucher?: Maybe<Voucher>;
}

export enum VoucherSortField {
  Code = "CODE",
  EndDate = "END_DATE",
  MinimumSpentAmount = "MINIMUM_SPENT_AMOUNT",
  StartDate = "START_DATE",
  Type = "TYPE",
  UsageLimit = "USAGE_LIMIT",
  Value = "VALUE",
}

export interface VoucherSortingInput {
  channel?: Maybe<Scalars["String"]>;
  direction: OrderDirection;
  field: VoucherSortField;
}

export type VoucherTranslatableContent = Node & {
  __typename?: "VoucherTranslatableContent";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  translation?: Maybe<VoucherTranslation>;
  /** @deprecated Will be removed in Saleor 4.0. Get model fields from the root level. */
  voucher?: Maybe<Voucher>;
};

export interface VoucherTranslatableContentTranslationArgs {
  languageCode: LanguageCodeEnum;
}

export interface VoucherTranslate {
  __typename?: "VoucherTranslate";
  errors: TranslationError[];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: TranslationError[];
  voucher?: Maybe<Voucher>;
}

export type VoucherTranslation = Node & {
  __typename?: "VoucherTranslation";
  id: Scalars["ID"];
  language: LanguageDisplay;
  name?: Maybe<Scalars["String"]>;
};

export enum VoucherTypeEnum {
  EntireOrder = "ENTIRE_ORDER",
  Shipping = "SHIPPING",
  SpecificProduct = "SPECIFIC_PRODUCT",
}

export interface VoucherUpdate {
  __typename?: "VoucherUpdate";
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: DiscountError[];
  errors: DiscountError[];
  voucher?: Maybe<Voucher>;
}

export type Warehouse = Node &
  ObjectWithMetadata & {
    __typename?: "Warehouse";
    address: Address;
    /** @deprecated Use address.CompanyName. This field will be removed in Saleor 4.0. */
    companyName: Scalars["String"];
    email: Scalars["String"];
    id: Scalars["ID"];
    metadata: Array<Maybe<MetadataItem>>;
    name: Scalars["String"];
    privateMetadata: Array<Maybe<MetadataItem>>;
    shippingZones: ShippingZoneCountableConnection;
    slug: Scalars["String"];
  };

export interface WarehouseShippingZonesArgs {
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
}

export interface WarehouseCountableConnection {
  __typename?: "WarehouseCountableConnection";
  edges: WarehouseCountableEdge[];
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars["Int"]>;
}

export interface WarehouseCountableEdge {
  __typename?: "WarehouseCountableEdge";
  cursor: Scalars["String"];
  node: Warehouse;
}

export interface WarehouseCreate {
  __typename?: "WarehouseCreate";
  errors: WarehouseError[];
  warehouse?: Maybe<Warehouse>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: WarehouseError[];
}

export interface WarehouseCreateInput {
  address: AddressInput;
  email?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  shippingZones?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  slug?: Maybe<Scalars["String"]>;
}

export interface WarehouseDelete {
  __typename?: "WarehouseDelete";
  errors: WarehouseError[];
  warehouse?: Maybe<Warehouse>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: WarehouseError[];
}

export interface WarehouseError {
  __typename?: "WarehouseError";
  code: WarehouseErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum WarehouseErrorCode {
  AlreadyExists = "ALREADY_EXISTS",
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface WarehouseFilterInput {
  ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  search?: Maybe<Scalars["String"]>;
}

export interface WarehouseShippingZoneAssign {
  __typename?: "WarehouseShippingZoneAssign";
  errors: WarehouseError[];
  warehouse?: Maybe<Warehouse>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: WarehouseError[];
}

export interface WarehouseShippingZoneUnassign {
  __typename?: "WarehouseShippingZoneUnassign";
  errors: WarehouseError[];
  warehouse?: Maybe<Warehouse>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: WarehouseError[];
}

export enum WarehouseSortField {
  Name = "NAME",
}

export interface WarehouseSortingInput {
  direction: OrderDirection;
  field: WarehouseSortField;
}

export interface WarehouseUpdate {
  __typename?: "WarehouseUpdate";
  errors: WarehouseError[];
  warehouse?: Maybe<Warehouse>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: WarehouseError[];
}

export interface WarehouseUpdateInput {
  address?: Maybe<AddressInput>;
  email?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
}

export type Webhook = Node & {
  __typename?: "Webhook";
  app: App;
  events: WebhookEvent[];
  id: Scalars["ID"];
  isActive: Scalars["Boolean"];
  name: Scalars["String"];
  secretKey?: Maybe<Scalars["String"]>;
  targetUrl: Scalars["String"];
};

export interface WebhookCreate {
  __typename?: "WebhookCreate";
  errors: WebhookError[];
  webhook?: Maybe<Webhook>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  webhookErrors: WebhookError[];
}

export interface WebhookCreateInput {
  app?: Maybe<Scalars["ID"]>;
  events?: Maybe<Array<Maybe<WebhookEventTypeEnum>>>;
  isActive?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  secretKey?: Maybe<Scalars["String"]>;
  targetUrl?: Maybe<Scalars["String"]>;
}

export interface WebhookDelete {
  __typename?: "WebhookDelete";
  errors: WebhookError[];
  webhook?: Maybe<Webhook>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  webhookErrors: WebhookError[];
}

export interface WebhookError {
  __typename?: "WebhookError";
  code: WebhookErrorCode;
  field?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
}

export enum WebhookErrorCode {
  GraphqlError = "GRAPHQL_ERROR",
  Invalid = "INVALID",
  NotFound = "NOT_FOUND",
  Required = "REQUIRED",
  Unique = "UNIQUE",
}

export interface WebhookEvent {
  __typename?: "WebhookEvent";
  eventType: WebhookEventTypeEnum;
  name: Scalars["String"];
}

export enum WebhookEventTypeEnum {
  AnyEvents = "ANY_EVENTS",
  CheckoutCreated = "CHECKOUT_CREATED",
  CheckoutUpdated = "CHECKOUT_UPDATED",
  CustomerCreated = "CUSTOMER_CREATED",
  CustomerUpdated = "CUSTOMER_UPDATED",
  DraftOrderCreated = "DRAFT_ORDER_CREATED",
  DraftOrderDeleted = "DRAFT_ORDER_DELETED",
  DraftOrderUpdated = "DRAFT_ORDER_UPDATED",
  FulfillmentCreated = "FULFILLMENT_CREATED",
  InvoiceDeleted = "INVOICE_DELETED",
  InvoiceRequested = "INVOICE_REQUESTED",
  InvoiceSent = "INVOICE_SENT",
  NotifyUser = "NOTIFY_USER",
  OrderCancelled = "ORDER_CANCELLED",
  OrderConfirmed = "ORDER_CONFIRMED",
  OrderCreated = "ORDER_CREATED",
  OrderFulfilled = "ORDER_FULFILLED",
  OrderFullyPaid = "ORDER_FULLY_PAID",
  OrderUpdated = "ORDER_UPDATED",
  PageCreated = "PAGE_CREATED",
  PageDeleted = "PAGE_DELETED",
  PageUpdated = "PAGE_UPDATED",
  PaymentAuthorize = "PAYMENT_AUTHORIZE",
  PaymentCapture = "PAYMENT_CAPTURE",
  PaymentConfirm = "PAYMENT_CONFIRM",
  PaymentListGateways = "PAYMENT_LIST_GATEWAYS",
  PaymentProcess = "PAYMENT_PROCESS",
  PaymentRefund = "PAYMENT_REFUND",
  PaymentVoid = "PAYMENT_VOID",
  ProductCreated = "PRODUCT_CREATED",
  ProductDeleted = "PRODUCT_DELETED",
  ProductUpdated = "PRODUCT_UPDATED",
  ProductVariantCreated = "PRODUCT_VARIANT_CREATED",
  ProductVariantDeleted = "PRODUCT_VARIANT_DELETED",
  ProductVariantUpdated = "PRODUCT_VARIANT_UPDATED",
  TranslationCreated = "TRANSLATION_CREATED",
  TranslationUpdated = "TRANSLATION_UPDATED",
}

export enum WebhookSampleEventTypeEnum {
  CheckoutCreated = "CHECKOUT_CREATED",
  CheckoutUpdated = "CHECKOUT_UPDATED",
  CustomerCreated = "CUSTOMER_CREATED",
  CustomerUpdated = "CUSTOMER_UPDATED",
  DraftOrderCreated = "DRAFT_ORDER_CREATED",
  DraftOrderDeleted = "DRAFT_ORDER_DELETED",
  DraftOrderUpdated = "DRAFT_ORDER_UPDATED",
  FulfillmentCreated = "FULFILLMENT_CREATED",
  InvoiceDeleted = "INVOICE_DELETED",
  InvoiceRequested = "INVOICE_REQUESTED",
  InvoiceSent = "INVOICE_SENT",
  NotifyUser = "NOTIFY_USER",
  OrderCancelled = "ORDER_CANCELLED",
  OrderConfirmed = "ORDER_CONFIRMED",
  OrderCreated = "ORDER_CREATED",
  OrderFulfilled = "ORDER_FULFILLED",
  OrderFullyPaid = "ORDER_FULLY_PAID",
  OrderUpdated = "ORDER_UPDATED",
  PageCreated = "PAGE_CREATED",
  PageDeleted = "PAGE_DELETED",
  PageUpdated = "PAGE_UPDATED",
  PaymentAuthorize = "PAYMENT_AUTHORIZE",
  PaymentCapture = "PAYMENT_CAPTURE",
  PaymentConfirm = "PAYMENT_CONFIRM",
  PaymentListGateways = "PAYMENT_LIST_GATEWAYS",
  PaymentProcess = "PAYMENT_PROCESS",
  PaymentRefund = "PAYMENT_REFUND",
  PaymentVoid = "PAYMENT_VOID",
  ProductCreated = "PRODUCT_CREATED",
  ProductDeleted = "PRODUCT_DELETED",
  ProductUpdated = "PRODUCT_UPDATED",
  ProductVariantCreated = "PRODUCT_VARIANT_CREATED",
  ProductVariantDeleted = "PRODUCT_VARIANT_DELETED",
  ProductVariantUpdated = "PRODUCT_VARIANT_UPDATED",
  TranslationCreated = "TRANSLATION_CREATED",
  TranslationUpdated = "TRANSLATION_UPDATED",
}

export interface WebhookUpdate {
  __typename?: "WebhookUpdate";
  errors: WebhookError[];
  webhook?: Maybe<Webhook>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  webhookErrors: WebhookError[];
}

export interface WebhookUpdateInput {
  app?: Maybe<Scalars["ID"]>;
  events?: Maybe<Array<Maybe<WebhookEventTypeEnum>>>;
  isActive?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  secretKey?: Maybe<Scalars["String"]>;
  targetUrl?: Maybe<Scalars["String"]>;
}

export interface Weight {
  __typename?: "Weight";
  unit: WeightUnitsEnum;
  value: Scalars["Float"];
}

export enum WeightUnitsEnum {
  G = "G",
  Kg = "KG",
  Lb = "LB",
  Oz = "OZ",
  Tonne = "TONNE",
}

export type _Entity =
  | Address
  | App
  | Category
  | Collection
  | Group
  | PageType
  | Product
  | ProductImage
  | ProductMedia
  | ProductType
  | ProductVariant
  | User;

export interface _Service {
  __typename?: "_Service";
  sdl?: Maybe<Scalars["String"]>;
}

export type AppInstallMutationVariables = Exact<{
  input: AppInstallInput;
}>;

export interface AppInstallMutation {
  __typename?: "Mutation";
  appInstall?: Maybe<{
    __typename?: "AppInstall";
    errors: Array<{
      __typename?: "AppError";
      field?: Maybe<string>;
      message?: Maybe<string>;
    }>;
    appInstallation?: Maybe<{
      __typename?: "AppInstallation";
      id: string;
      status: JobStatusEnum;
    }>;
  }>;
}

export type AppTokenVerifyMutationVariables = Exact<{
  token: Scalars["String"];
}>;

export interface AppTokenVerifyMutation {
  __typename?: "Mutation";
  appTokenVerify?: Maybe<{ __typename?: "AppTokenVerify"; valid: boolean }>;
}

export type CategoryCreateMutationVariables = Exact<{
  input: CategoryInput;
}>;

export interface CategoryCreateMutation {
  __typename?: "Mutation";
  categoryCreate?: Maybe<{
    __typename?: "CategoryCreate";
    category?: Maybe<{ __typename?: "Category"; id: string }>;
    errors: Array<{
      __typename?: "ProductError";
      field?: Maybe<string>;
      message?: Maybe<string>;
    }>;
  }>;
}

export type ChannelCreateMutationVariables = Exact<{
  input: ChannelCreateInput;
}>;

export interface ChannelCreateMutation {
  __typename?: "Mutation";
  channelCreate?: Maybe<{
    __typename?: "ChannelCreate";
    errors: Array<{
      __typename?: "ChannelError";
      field?: Maybe<string>;
      message?: Maybe<string>;
    }>;
    channel?: Maybe<{ __typename?: "Channel"; id: string; slug: string }>;
  }>;
}

export type ProductChannelListingUpdateMutationVariables = Exact<{
  id: Scalars["ID"];
  input: ProductChannelListingUpdateInput;
}>;

export interface ProductChannelListingUpdateMutation {
  __typename?: "Mutation";
  productChannelListingUpdate?: Maybe<{
    __typename?: "ProductChannelListingUpdate";
    errors: Array<{
      __typename?: "ProductChannelListingError";
      field?: Maybe<string>;
      message?: Maybe<string>;
    }>;
  }>;
}

export type ProductCreateMutationVariables = Exact<{
  input: ProductCreateInput;
}>;

export interface ProductCreateMutation {
  __typename?: "Mutation";
  productCreate?: Maybe<{
    __typename?: "ProductCreate";
    errors: Array<{
      __typename?: "ProductError";
      field?: Maybe<string>;
      message?: Maybe<string>;
    }>;
    product?: Maybe<{
      __typename?: "Product";
      id: string;
      defaultVariant?: Maybe<{ __typename?: "ProductVariant"; id: string }>;
    }>;
  }>;
}

export type ProductTypeCreateMutationVariables = Exact<{
  input: ProductTypeInput;
}>;

export interface ProductTypeCreateMutation {
  __typename?: "Mutation";
  productTypeCreate?: Maybe<{
    __typename?: "ProductTypeCreate";
    productType?: Maybe<{ __typename?: "ProductType"; id: string }>;
    errors: Array<{
      __typename?: "ProductError";
      field?: Maybe<string>;
      message?: Maybe<string>;
    }>;
  }>;
}

export type ProductVariantChannelListingUpdateMutationVariables = Exact<{
  id: Scalars["ID"];
  input:
    | ProductVariantChannelListingAddInput[]
    | ProductVariantChannelListingAddInput;
}>;

export interface ProductVariantChannelListingUpdateMutation {
  __typename?: "Mutation";
  productVariantChannelListingUpdate?: Maybe<{
    __typename?: "ProductVariantChannelListingUpdate";
    errors: Array<{
      __typename?: "ProductChannelListingError";
      field?: Maybe<string>;
      message?: Maybe<string>;
    }>;
    variant?: Maybe<{ __typename?: "ProductVariant"; id: string }>;
  }>;
}

export type ProductVariantCreateMutationVariables = Exact<{
  input: ProductVariantCreateInput;
}>;

export interface ProductVariantCreateMutation {
  __typename?: "Mutation";
  productVariantCreate?: Maybe<{
    __typename?: "ProductVariantCreate";
    errors: Array<{
      __typename?: "ProductError";
      field?: Maybe<string>;
      message?: Maybe<string>;
    }>;
    productVariant?: Maybe<{ __typename?: "ProductVariant"; id: string }>;
  }>;
}

export type TokenCreateMutationVariables = Exact<{
  email: Scalars["String"];
  password: Scalars["String"];
}>;

export interface TokenCreateMutation {
  __typename?: "Mutation";
  tokenCreate?: Maybe<{
    __typename?: "CreateToken";
    token?: Maybe<string>;
    refreshToken?: Maybe<string>;
    csrfToken?: Maybe<string>;
    user?: Maybe<{ __typename?: "User"; email: string }>;
    errors: Array<{
      __typename?: "AccountError";
      field?: Maybe<string>;
      message?: Maybe<string>;
    }>;
  }>;
}

export type WebhookCreateMutationVariables = Exact<{
  input: WebhookCreateInput;
}>;

export interface WebhookCreateMutation {
  __typename?: "Mutation";
  webhookCreate?: Maybe<{
    __typename?: "WebhookCreate";
    errors: Array<{
      __typename?: "WebhookError";
      field?: Maybe<string>;
      message?: Maybe<string>;
      code: WebhookErrorCode;
    }>;
    webhook?: Maybe<{ __typename?: "Webhook"; id: string }>;
  }>;
}

export type AppQueryVariables = Exact<{
  id?: Maybe<Scalars["ID"]>;
}>;

export interface AppQuery {
  __typename?: "Query";
  app?: Maybe<{
    __typename?: "App";
    id: string;
    webhooks?: Maybe<
      Array<
        Maybe<{
          __typename?: "Webhook";
          id: string;
          targetUrl: string;
          secretKey?: Maybe<string>;
          isActive: boolean;
        }>
      >
    >;
  }>;
}

export type ProductsQueryVariables = Exact<{
  first: Scalars["Int"];
  channel?: Maybe<Scalars["String"]>;
}>;

export interface ProductsQuery {
  __typename?: "Query";
  products?: Maybe<{
    __typename?: "ProductCountableConnection";
    edges: Array<{
      __typename?: "ProductCountableEdge";
      node: {
        __typename?: "Product";
        seoDescription?: Maybe<string>;
        name: string;
        seoTitle?: Maybe<string>;
        isAvailableForPurchase?: Maybe<boolean>;
        description?: Maybe<any>;
        slug: string;
        weight?: Maybe<{
          __typename?: "Weight";
          unit: WeightUnitsEnum;
          value: number;
        }>;
        images?: Maybe<
          Array<Maybe<{ __typename?: "ProductImage"; id: string; url: string }>>
        >;
        metadata: Array<
          Maybe<{ __typename?: "MetadataItem"; key: string; value: string }>
        >;
        attributes: Array<{
          __typename?: "SelectedAttribute";
          attribute: {
            __typename?: "Attribute";
            id: string;
            name?: Maybe<string>;
          };
          values: Array<
            Maybe<{
              __typename?: "AttributeValue";
              id: string;
              name?: Maybe<string>;
            }>
          >;
        }>;
        productType: {
          __typename?: "ProductType";
          name: string;
          id: string;
          hasVariants: boolean;
        };
        variants?: Maybe<
          Array<
            Maybe<{
              __typename?: "ProductVariant";
              id: string;
              name: string;
              sku: string;
              quantityAvailable: number;
              weight?: Maybe<{
                __typename?: "Weight";
                unit: WeightUnitsEnum;
                value: number;
              }>;
              metadata: Array<
                Maybe<{
                  __typename?: "MetadataItem";
                  key: string;
                  value: string;
                }>
              >;
              pricing?: Maybe<{
                __typename?: "VariantPricingInfo";
                onSale?: Maybe<boolean>;
                priceUndiscounted?: Maybe<{
                  __typename?: "TaxedMoney";
                  gross: {
                    __typename?: "Money";
                    amount: number;
                    currency: string;
                  };
                }>;
                price?: Maybe<{
                  __typename?: "TaxedMoney";
                  gross: {
                    __typename?: "Money";
                    amount: number;
                    currency: string;
                  };
                  net: { __typename?: "Money"; amount: number };
                }>;
                discount?: Maybe<{
                  __typename?: "TaxedMoney";
                  gross: { __typename?: "Money"; amount: number };
                }>;
              }>;
              images?: Maybe<
                Array<Maybe<{ __typename?: "ProductImage"; url: string }>>
              >;
            }>
          >
        >;
      };
    }>;
  }>;
}

export const AppInstallDocument = gql`
  mutation appInstall($input: AppInstallInput!) {
    appInstall(input: $input) {
      errors {
        field
        message
      }
      appInstallation {
        id
        status
      }
    }
  }
`;
export const AppTokenVerifyDocument = gql`
  mutation appTokenVerify($token: String!) {
    appTokenVerify(token: $token) {
      valid
    }
  }
`;
export const CategoryCreateDocument = gql`
  mutation categoryCreate($input: CategoryInput!) {
    categoryCreate(input: $input) {
      category {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;
export const ChannelCreateDocument = gql`
  mutation channelCreate($input: ChannelCreateInput!) {
    channelCreate(input: $input) {
      errors {
        field
        message
      }
      channel {
        id
        slug
      }
    }
  }
`;
export const ProductChannelListingUpdateDocument = gql`
  mutation productChannelListingUpdate(
    $id: ID!
    $input: ProductChannelListingUpdateInput!
  ) {
    productChannelListingUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
    }
  }
`;
export const ProductCreateDocument = gql`
  mutation productCreate($input: ProductCreateInput!) {
    productCreate(input: $input) {
      errors {
        field
        message
      }
      product {
        id
        defaultVariant {
          id
        }
      }
    }
  }
`;
export const ProductTypeCreateDocument = gql`
  mutation productTypeCreate($input: ProductTypeInput!) {
    productTypeCreate(input: $input) {
      productType {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;
export const ProductVariantChannelListingUpdateDocument = gql`
  mutation productVariantChannelListingUpdate(
    $id: ID!
    $input: [ProductVariantChannelListingAddInput!]!
  ) {
    productVariantChannelListingUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      variant {
        id
      }
    }
  }
`;
export const ProductVariantCreateDocument = gql`
  mutation productVariantCreate($input: ProductVariantCreateInput!) {
    productVariantCreate(input: $input) {
      errors {
        field
        message
      }
      productVariant {
        id
      }
    }
  }
`;
export const TokenCreateDocument = gql`
  mutation tokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      csrfToken
      user {
        email
      }
      errors {
        field
        message
      }
    }
  }
`;
export const WebhookCreateDocument = gql`
  mutation webhookCreate($input: WebhookCreateInput!) {
    webhookCreate(input: $input) {
      errors {
        field
        message
        code
      }
      webhook {
        id
      }
    }
  }
`;
export const AppDocument = gql`
  query app($id: ID) {
    app(id: $id) {
      id
      webhooks {
        id
        targetUrl
        secretKey
        isActive
      }
    }
  }
`;
export const ProductsDocument = gql`
  query products($first: Int!, $channel: String) {
    products(first: $first, channel: $channel) {
      edges {
        node {
          seoDescription
          name
          seoTitle
          isAvailableForPurchase
          description
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
export type Requester<C = {}> = <R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: C,
) => Promise<R>;
export function getSdk<C>(requester: Requester<C>) {
  return {
    async appInstall(
      variables: AppInstallMutationVariables,
      options?: C,
    ): Promise<AppInstallMutation> {
      return await requester<AppInstallMutation, AppInstallMutationVariables>(
        AppInstallDocument,
        variables,
        options,
      );
    },
    async appTokenVerify(
      variables: AppTokenVerifyMutationVariables,
      options?: C,
    ): Promise<AppTokenVerifyMutation> {
      return await requester<
        AppTokenVerifyMutation,
        AppTokenVerifyMutationVariables
      >(AppTokenVerifyDocument, variables, options);
    },
    async categoryCreate(
      variables: CategoryCreateMutationVariables,
      options?: C,
    ): Promise<CategoryCreateMutation> {
      return await requester<
        CategoryCreateMutation,
        CategoryCreateMutationVariables
      >(CategoryCreateDocument, variables, options);
    },
    async channelCreate(
      variables: ChannelCreateMutationVariables,
      options?: C,
    ): Promise<ChannelCreateMutation> {
      return await requester<
        ChannelCreateMutation,
        ChannelCreateMutationVariables
      >(ChannelCreateDocument, variables, options);
    },
    async productChannelListingUpdate(
      variables: ProductChannelListingUpdateMutationVariables,
      options?: C,
    ): Promise<ProductChannelListingUpdateMutation> {
      return await requester<
        ProductChannelListingUpdateMutation,
        ProductChannelListingUpdateMutationVariables
      >(ProductChannelListingUpdateDocument, variables, options);
    },
    async productCreate(
      variables: ProductCreateMutationVariables,
      options?: C,
    ): Promise<ProductCreateMutation> {
      return await requester<
        ProductCreateMutation,
        ProductCreateMutationVariables
      >(ProductCreateDocument, variables, options);
    },
    async productTypeCreate(
      variables: ProductTypeCreateMutationVariables,
      options?: C,
    ): Promise<ProductTypeCreateMutation> {
      return await requester<
        ProductTypeCreateMutation,
        ProductTypeCreateMutationVariables
      >(ProductTypeCreateDocument, variables, options);
    },
    async productVariantChannelListingUpdate(
      variables: ProductVariantChannelListingUpdateMutationVariables,
      options?: C,
    ): Promise<ProductVariantChannelListingUpdateMutation> {
      return await requester<
        ProductVariantChannelListingUpdateMutation,
        ProductVariantChannelListingUpdateMutationVariables
      >(ProductVariantChannelListingUpdateDocument, variables, options);
    },
    async productVariantCreate(
      variables: ProductVariantCreateMutationVariables,
      options?: C,
    ): Promise<ProductVariantCreateMutation> {
      return await requester<
        ProductVariantCreateMutation,
        ProductVariantCreateMutationVariables
      >(ProductVariantCreateDocument, variables, options);
    },
    async tokenCreate(
      variables: TokenCreateMutationVariables,
      options?: C,
    ): Promise<TokenCreateMutation> {
      return await requester<TokenCreateMutation, TokenCreateMutationVariables>(
        TokenCreateDocument,
        variables,
        options,
      );
    },
    async webhookCreate(
      variables: WebhookCreateMutationVariables,
      options?: C,
    ): Promise<WebhookCreateMutation> {
      return await requester<
        WebhookCreateMutation,
        WebhookCreateMutationVariables
      >(WebhookCreateDocument, variables, options);
    },
    async app(variables?: AppQueryVariables, options?: C): Promise<AppQuery> {
      return await requester<AppQuery, AppQueryVariables>(
        AppDocument,
        variables,
        options,
      );
    },
    async products(
      variables: ProductsQueryVariables,
      options?: C,
    ): Promise<ProductsQuery> {
      return await requester<ProductsQuery, ProductsQueryVariables>(
        ProductsDocument,
        variables,
        options,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
