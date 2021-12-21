"use strict";
exports.id = 304;
exports.ids = [304];
exports.modules = {

/***/ 50077:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "zq": () => (/* reexport */ WebhookEventTypeEnum1),
  "NA": () => (/* reexport */ createSaleorClient)
});

// UNUSED EXPORTS: AccountErrorCode, AddressTypeEnum, AppDocument, AppErrorCode, AppInstallDocument, AppSortField, AppTokenVerifyDocument, AppTypeEnum, AreaUnitsEnum, AttributeChoicesSortField, AttributeEntityTypeEnum, AttributeErrorCode, AttributeInputTypeEnum, AttributeSortField, AttributeTypeEnum, CategoryCreateDocument, CategorySortField, ChannelCreateDocument, ChannelErrorCode, CheckoutErrorCode, CollectionErrorCode, CollectionPublished, CollectionSortField, ConfigurationTypeFieldEnum, CountryCode, CustomerEventsEnum, DiscountErrorCode, DiscountStatusEnum, DiscountValueTypeEnum, DistanceUnitsEnum, ExportErrorCode, ExportEventsEnum, ExportFileSortField, ExportScope, FileTypesEnum, FulfillmentStatus, GiftCardErrorCode, InvoiceErrorCode, JobStatusEnum, LanguageCodeEnum, MeasurementUnitsEnum, MenuErrorCode, MenuItemsSortField, MenuSortField, MetadataErrorCode, NavigationType, OrderAction, OrderDirection, OrderDiscountType, OrderErrorCode, OrderEventsEmailsEnum, OrderEventsEnum, OrderOriginEnum, OrderSettingsErrorCode, OrderSortField, OrderStatus, OrderStatusFilter, PageErrorCode, PageSortField, PageTypeSortField, PaymentChargeStatusEnum, PaymentErrorCode, PermissionEnum, PermissionGroupErrorCode, PermissionGroupSortField, PluginConfigurationType, PluginErrorCode, PluginSortField, PostalCodeRuleInclusionTypeEnum, ProductAttributeType, ProductChannelListingUpdateDocument, ProductCreateDocument, ProductErrorCode, ProductFieldEnum, ProductMediaType, ProductOrderField, ProductTypeConfigurable, ProductTypeCreateDocument, ProductTypeEnum, ProductTypeSortField, ProductVariantChannelListingUpdateDocument, ProductVariantCreateDocument, ProductsDocument, ReportingPeriod, SaleSortField, SaleType, ShippingErrorCode, ShippingMethodTypeEnum, ShopErrorCode, StaffMemberStatus, StockAvailability, StockErrorCode, TokenCreateDocument, TransactionKind, TranslatableKinds, TranslationErrorCode, UploadErrorCode, UserSortField, VariantAttributeScope, VolumeUnitsEnum, VoucherDiscountType, VoucherSortField, VoucherTypeEnum, WarehouseErrorCode, WarehouseSortField, WebhookCreateDocument, WebhookErrorCode, WebhookSampleEventTypeEnum, WeightUnitsEnum, getSdk

// EXTERNAL MODULE: ../../node_modules/.pnpm/graphql-tag@2.12.6_graphql@16.2.0/node_modules/graphql-tag/main.js
var main = __webpack_require__(11116);
var main_default = /*#__PURE__*/__webpack_require__.n(main);
;// CONCATENATED MODULE: ../../pkg/saleor/src/api/generated/graphql.ts

var AccountErrorCode1;

(function(AccountErrorCode) {
    AccountErrorCode["AccountNotConfirmed"] = "ACCOUNT_NOT_CONFIRMED";
    AccountErrorCode["ActivateOwnAccount"] = "ACTIVATE_OWN_ACCOUNT";
    AccountErrorCode["ActivateSuperuserAccount"] = "ACTIVATE_SUPERUSER_ACCOUNT";
    AccountErrorCode["ChannelInactive"] = "CHANNEL_INACTIVE";
    AccountErrorCode["DeactivateOwnAccount"] = "DEACTIVATE_OWN_ACCOUNT";
    AccountErrorCode["DeactivateSuperuserAccount"] = "DEACTIVATE_SUPERUSER_ACCOUNT";
    AccountErrorCode["DeleteNonStaffUser"] = "DELETE_NON_STAFF_USER";
    AccountErrorCode["DeleteOwnAccount"] = "DELETE_OWN_ACCOUNT";
    AccountErrorCode["DeleteStaffAccount"] = "DELETE_STAFF_ACCOUNT";
    AccountErrorCode["DeleteSuperuserAccount"] = "DELETE_SUPERUSER_ACCOUNT";
    AccountErrorCode["DuplicatedInputItem"] = "DUPLICATED_INPUT_ITEM";
    AccountErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    AccountErrorCode["Inactive"] = "INACTIVE";
    AccountErrorCode["Invalid"] = "INVALID";
    AccountErrorCode["InvalidCredentials"] = "INVALID_CREDENTIALS";
    AccountErrorCode["InvalidPassword"] = "INVALID_PASSWORD";
    AccountErrorCode["JwtDecodeError"] = "JWT_DECODE_ERROR";
    AccountErrorCode["JwtInvalidCsrfToken"] = "JWT_INVALID_CSRF_TOKEN";
    AccountErrorCode["JwtInvalidToken"] = "JWT_INVALID_TOKEN";
    AccountErrorCode["JwtMissingToken"] = "JWT_MISSING_TOKEN";
    AccountErrorCode["JwtSignatureExpired"] = "JWT_SIGNATURE_EXPIRED";
    AccountErrorCode["LeftNotManageablePermission"] = "LEFT_NOT_MANAGEABLE_PERMISSION";
    AccountErrorCode["MissingChannelSlug"] = "MISSING_CHANNEL_SLUG";
    AccountErrorCode["NotFound"] = "NOT_FOUND";
    AccountErrorCode["OutOfScopeGroup"] = "OUT_OF_SCOPE_GROUP";
    AccountErrorCode["OutOfScopePermission"] = "OUT_OF_SCOPE_PERMISSION";
    AccountErrorCode["OutOfScopeUser"] = "OUT_OF_SCOPE_USER";
    AccountErrorCode["PasswordEntirelyNumeric"] = "PASSWORD_ENTIRELY_NUMERIC";
    AccountErrorCode["PasswordTooCommon"] = "PASSWORD_TOO_COMMON";
    AccountErrorCode["PasswordTooShort"] = "PASSWORD_TOO_SHORT";
    AccountErrorCode["PasswordTooSimilar"] = "PASSWORD_TOO_SIMILAR";
    AccountErrorCode["Required"] = "REQUIRED";
    AccountErrorCode["Unique"] = "UNIQUE";
})(AccountErrorCode1 || (AccountErrorCode1 = {
}));
var AddressTypeEnum1;

(function(AddressTypeEnum) {
    AddressTypeEnum["Billing"] = "BILLING";
    AddressTypeEnum["Shipping"] = "SHIPPING";
})(AddressTypeEnum1 || (AddressTypeEnum1 = {
}));
var AppErrorCode1;

(function(AppErrorCode) {
    AppErrorCode["Forbidden"] = "FORBIDDEN";
    AppErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    AppErrorCode["Invalid"] = "INVALID";
    AppErrorCode["InvalidManifestFormat"] = "INVALID_MANIFEST_FORMAT";
    AppErrorCode["InvalidPermission"] = "INVALID_PERMISSION";
    AppErrorCode["InvalidStatus"] = "INVALID_STATUS";
    AppErrorCode["InvalidUrlFormat"] = "INVALID_URL_FORMAT";
    AppErrorCode["ManifestUrlCantConnect"] = "MANIFEST_URL_CANT_CONNECT";
    AppErrorCode["NotFound"] = "NOT_FOUND";
    AppErrorCode["OutOfScopeApp"] = "OUT_OF_SCOPE_APP";
    AppErrorCode["OutOfScopePermission"] = "OUT_OF_SCOPE_PERMISSION";
    AppErrorCode["Required"] = "REQUIRED";
    AppErrorCode["Unique"] = "UNIQUE";
})(AppErrorCode1 || (AppErrorCode1 = {
}));
var AppSortField1;

(function(AppSortField) {
    AppSortField["CreationDate"] = "CREATION_DATE";
    AppSortField["Name"] = "NAME";
})(AppSortField1 || (AppSortField1 = {
}));
var AppTypeEnum1;

(function(AppTypeEnum) {
    AppTypeEnum["Local"] = "LOCAL";
    AppTypeEnum["Thirdparty"] = "THIRDPARTY";
})(AppTypeEnum1 || (AppTypeEnum1 = {
}));
var AreaUnitsEnum1;

(function(AreaUnitsEnum) {
    AreaUnitsEnum["SqCm"] = "SQ_CM";
    AreaUnitsEnum["SqFt"] = "SQ_FT";
    AreaUnitsEnum["SqInch"] = "SQ_INCH";
    AreaUnitsEnum["SqKm"] = "SQ_KM";
    AreaUnitsEnum["SqM"] = "SQ_M";
    AreaUnitsEnum["SqYd"] = "SQ_YD";
})(AreaUnitsEnum1 || (AreaUnitsEnum1 = {
}));
var AttributeChoicesSortField1;

(function(AttributeChoicesSortField) {
    AttributeChoicesSortField["Name"] = "NAME";
    AttributeChoicesSortField["Slug"] = "SLUG";
})(AttributeChoicesSortField1 || (AttributeChoicesSortField1 = {
}));
var AttributeEntityTypeEnum1;

(function(AttributeEntityTypeEnum) {
    AttributeEntityTypeEnum["Page"] = "PAGE";
    AttributeEntityTypeEnum["Product"] = "PRODUCT";
})(AttributeEntityTypeEnum1 || (AttributeEntityTypeEnum1 = {
}));
var AttributeErrorCode1;

(function(AttributeErrorCode) {
    AttributeErrorCode["AlreadyExists"] = "ALREADY_EXISTS";
    AttributeErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    AttributeErrorCode["Invalid"] = "INVALID";
    AttributeErrorCode["NotFound"] = "NOT_FOUND";
    AttributeErrorCode["Required"] = "REQUIRED";
    AttributeErrorCode["Unique"] = "UNIQUE";
})(AttributeErrorCode1 || (AttributeErrorCode1 = {
}));
var AttributeInputTypeEnum1;

(function(AttributeInputTypeEnum) {
    AttributeInputTypeEnum["Boolean"] = "BOOLEAN";
    AttributeInputTypeEnum["Date"] = "DATE";
    AttributeInputTypeEnum["DateTime"] = "DATE_TIME";
    AttributeInputTypeEnum["Dropdown"] = "DROPDOWN";
    AttributeInputTypeEnum["File"] = "FILE";
    AttributeInputTypeEnum["Multiselect"] = "MULTISELECT";
    AttributeInputTypeEnum["Numeric"] = "NUMERIC";
    AttributeInputTypeEnum["Reference"] = "REFERENCE";
    AttributeInputTypeEnum["RichText"] = "RICH_TEXT";
})(AttributeInputTypeEnum1 || (AttributeInputTypeEnum1 = {
}));
var AttributeSortField1;

(function(AttributeSortField) {
    AttributeSortField["AvailableInGrid"] = "AVAILABLE_IN_GRID";
    AttributeSortField["FilterableInDashboard"] = "FILTERABLE_IN_DASHBOARD";
    AttributeSortField["FilterableInStorefront"] = "FILTERABLE_IN_STOREFRONT";
    AttributeSortField["IsVariantOnly"] = "IS_VARIANT_ONLY";
    AttributeSortField["Name"] = "NAME";
    AttributeSortField["Slug"] = "SLUG";
    AttributeSortField["StorefrontSearchPosition"] = "STOREFRONT_SEARCH_POSITION";
    AttributeSortField["ValueRequired"] = "VALUE_REQUIRED";
    AttributeSortField["VisibleInStorefront"] = "VISIBLE_IN_STOREFRONT";
})(AttributeSortField1 || (AttributeSortField1 = {
}));
var AttributeTypeEnum1;

(function(AttributeTypeEnum) {
    AttributeTypeEnum["PageType"] = "PAGE_TYPE";
    AttributeTypeEnum["ProductType"] = "PRODUCT_TYPE";
})(AttributeTypeEnum1 || (AttributeTypeEnum1 = {
}));
var CategorySortField1;

(function(CategorySortField) {
    CategorySortField["Name"] = "NAME";
    CategorySortField["ProductCount"] = "PRODUCT_COUNT";
    CategorySortField["SubcategoryCount"] = "SUBCATEGORY_COUNT";
})(CategorySortField1 || (CategorySortField1 = {
}));
var ChannelErrorCode1;

(function(ChannelErrorCode) {
    ChannelErrorCode["AlreadyExists"] = "ALREADY_EXISTS";
    ChannelErrorCode["ChannelsCurrencyMustBeTheSame"] = "CHANNELS_CURRENCY_MUST_BE_THE_SAME";
    ChannelErrorCode["ChannelWithOrders"] = "CHANNEL_WITH_ORDERS";
    ChannelErrorCode["DuplicatedInputItem"] = "DUPLICATED_INPUT_ITEM";
    ChannelErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    ChannelErrorCode["Invalid"] = "INVALID";
    ChannelErrorCode["NotFound"] = "NOT_FOUND";
    ChannelErrorCode["Required"] = "REQUIRED";
    ChannelErrorCode["Unique"] = "UNIQUE";
})(ChannelErrorCode1 || (ChannelErrorCode1 = {
}));
var CheckoutErrorCode1;

(function(CheckoutErrorCode) {
    CheckoutErrorCode["BillingAddressNotSet"] = "BILLING_ADDRESS_NOT_SET";
    CheckoutErrorCode["ChannelInactive"] = "CHANNEL_INACTIVE";
    CheckoutErrorCode["CheckoutNotFullyPaid"] = "CHECKOUT_NOT_FULLY_PAID";
    CheckoutErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    CheckoutErrorCode["InsufficientStock"] = "INSUFFICIENT_STOCK";
    CheckoutErrorCode["Invalid"] = "INVALID";
    CheckoutErrorCode["InvalidShippingMethod"] = "INVALID_SHIPPING_METHOD";
    CheckoutErrorCode["MissingChannelSlug"] = "MISSING_CHANNEL_SLUG";
    CheckoutErrorCode["NotFound"] = "NOT_FOUND";
    CheckoutErrorCode["PaymentError"] = "PAYMENT_ERROR";
    CheckoutErrorCode["ProductNotPublished"] = "PRODUCT_NOT_PUBLISHED";
    CheckoutErrorCode["ProductUnavailableForPurchase"] = "PRODUCT_UNAVAILABLE_FOR_PURCHASE";
    CheckoutErrorCode["QuantityGreaterThanLimit"] = "QUANTITY_GREATER_THAN_LIMIT";
    CheckoutErrorCode["Required"] = "REQUIRED";
    CheckoutErrorCode["ShippingAddressNotSet"] = "SHIPPING_ADDRESS_NOT_SET";
    CheckoutErrorCode["ShippingMethodNotApplicable"] = "SHIPPING_METHOD_NOT_APPLICABLE";
    CheckoutErrorCode["ShippingMethodNotSet"] = "SHIPPING_METHOD_NOT_SET";
    CheckoutErrorCode["ShippingNotRequired"] = "SHIPPING_NOT_REQUIRED";
    CheckoutErrorCode["TaxError"] = "TAX_ERROR";
    CheckoutErrorCode["UnavailableVariantInChannel"] = "UNAVAILABLE_VARIANT_IN_CHANNEL";
    CheckoutErrorCode["Unique"] = "UNIQUE";
    CheckoutErrorCode["VoucherNotApplicable"] = "VOUCHER_NOT_APPLICABLE";
    CheckoutErrorCode["ZeroQuantity"] = "ZERO_QUANTITY";
})(CheckoutErrorCode1 || (CheckoutErrorCode1 = {
}));
var CollectionErrorCode1;

(function(CollectionErrorCode) {
    CollectionErrorCode["CannotManageProductWithoutVariant"] = "CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT";
    CollectionErrorCode["DuplicatedInputItem"] = "DUPLICATED_INPUT_ITEM";
    CollectionErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    CollectionErrorCode["Invalid"] = "INVALID";
    CollectionErrorCode["NotFound"] = "NOT_FOUND";
    CollectionErrorCode["Required"] = "REQUIRED";
    CollectionErrorCode["Unique"] = "UNIQUE";
})(CollectionErrorCode1 || (CollectionErrorCode1 = {
}));
var CollectionPublished1;

(function(CollectionPublished) {
    CollectionPublished["Hidden"] = "HIDDEN";
    CollectionPublished["Published"] = "PUBLISHED";
})(CollectionPublished1 || (CollectionPublished1 = {
}));
var CollectionSortField1;

(function(CollectionSortField) {
    CollectionSortField["Availability"] = "AVAILABILITY";
    CollectionSortField["Name"] = "NAME";
    CollectionSortField["ProductCount"] = "PRODUCT_COUNT";
    CollectionSortField["PublicationDate"] = "PUBLICATION_DATE";
})(CollectionSortField1 || (CollectionSortField1 = {
}));
var ConfigurationTypeFieldEnum1;

(function(ConfigurationTypeFieldEnum) {
    ConfigurationTypeFieldEnum["Boolean"] = "BOOLEAN";
    ConfigurationTypeFieldEnum["Multiline"] = "MULTILINE";
    ConfigurationTypeFieldEnum["Output"] = "OUTPUT";
    ConfigurationTypeFieldEnum["Password"] = "PASSWORD";
    ConfigurationTypeFieldEnum["Secret"] = "SECRET";
    ConfigurationTypeFieldEnum["Secretmultiline"] = "SECRETMULTILINE";
    ConfigurationTypeFieldEnum["String"] = "STRING";
})(ConfigurationTypeFieldEnum1 || (ConfigurationTypeFieldEnum1 = {
}));
var CountryCode1;

(function(CountryCode) {
    CountryCode["Ad"] = "AD";
    CountryCode["Ae"] = "AE";
    CountryCode["Af"] = "AF";
    CountryCode["Ag"] = "AG";
    CountryCode["Ai"] = "AI";
    CountryCode["Al"] = "AL";
    CountryCode["Am"] = "AM";
    CountryCode["Ao"] = "AO";
    CountryCode["Aq"] = "AQ";
    CountryCode["Ar"] = "AR";
    CountryCode["As"] = "AS";
    CountryCode["At"] = "AT";
    CountryCode["Au"] = "AU";
    CountryCode["Aw"] = "AW";
    CountryCode["Ax"] = "AX";
    CountryCode["Az"] = "AZ";
    CountryCode["Ba"] = "BA";
    CountryCode["Bb"] = "BB";
    CountryCode["Bd"] = "BD";
    CountryCode["Be"] = "BE";
    CountryCode["Bf"] = "BF";
    CountryCode["Bg"] = "BG";
    CountryCode["Bh"] = "BH";
    CountryCode["Bi"] = "BI";
    CountryCode["Bj"] = "BJ";
    CountryCode["Bl"] = "BL";
    CountryCode["Bm"] = "BM";
    CountryCode["Bn"] = "BN";
    CountryCode["Bo"] = "BO";
    CountryCode["Bq"] = "BQ";
    CountryCode["Br"] = "BR";
    CountryCode["Bs"] = "BS";
    CountryCode["Bt"] = "BT";
    CountryCode["Bv"] = "BV";
    CountryCode["Bw"] = "BW";
    CountryCode["By"] = "BY";
    CountryCode["Bz"] = "BZ";
    CountryCode["Ca"] = "CA";
    CountryCode["Cc"] = "CC";
    CountryCode["Cd"] = "CD";
    CountryCode["Cf"] = "CF";
    CountryCode["Cg"] = "CG";
    CountryCode["Ch"] = "CH";
    CountryCode["Ci"] = "CI";
    CountryCode["Ck"] = "CK";
    CountryCode["Cl"] = "CL";
    CountryCode["Cm"] = "CM";
    CountryCode["Cn"] = "CN";
    CountryCode["Co"] = "CO";
    CountryCode["Cr"] = "CR";
    CountryCode["Cu"] = "CU";
    CountryCode["Cv"] = "CV";
    CountryCode["Cw"] = "CW";
    CountryCode["Cx"] = "CX";
    CountryCode["Cy"] = "CY";
    CountryCode["Cz"] = "CZ";
    CountryCode["De"] = "DE";
    CountryCode["Dj"] = "DJ";
    CountryCode["Dk"] = "DK";
    CountryCode["Dm"] = "DM";
    CountryCode["Do"] = "DO";
    CountryCode["Dz"] = "DZ";
    CountryCode["Ec"] = "EC";
    CountryCode["Ee"] = "EE";
    CountryCode["Eg"] = "EG";
    CountryCode["Eh"] = "EH";
    CountryCode["Er"] = "ER";
    CountryCode["Es"] = "ES";
    CountryCode["Et"] = "ET";
    CountryCode["Eu"] = "EU";
    CountryCode["Fi"] = "FI";
    CountryCode["Fj"] = "FJ";
    CountryCode["Fk"] = "FK";
    CountryCode["Fm"] = "FM";
    CountryCode["Fo"] = "FO";
    CountryCode["Fr"] = "FR";
    CountryCode["Ga"] = "GA";
    CountryCode["Gb"] = "GB";
    CountryCode["Gd"] = "GD";
    CountryCode["Ge"] = "GE";
    CountryCode["Gf"] = "GF";
    CountryCode["Gg"] = "GG";
    CountryCode["Gh"] = "GH";
    CountryCode["Gi"] = "GI";
    CountryCode["Gl"] = "GL";
    CountryCode["Gm"] = "GM";
    CountryCode["Gn"] = "GN";
    CountryCode["Gp"] = "GP";
    CountryCode["Gq"] = "GQ";
    CountryCode["Gr"] = "GR";
    CountryCode["Gs"] = "GS";
    CountryCode["Gt"] = "GT";
    CountryCode["Gu"] = "GU";
    CountryCode["Gw"] = "GW";
    CountryCode["Gy"] = "GY";
    CountryCode["Hk"] = "HK";
    CountryCode["Hm"] = "HM";
    CountryCode["Hn"] = "HN";
    CountryCode["Hr"] = "HR";
    CountryCode["Ht"] = "HT";
    CountryCode["Hu"] = "HU";
    CountryCode["Id"] = "ID";
    CountryCode["Ie"] = "IE";
    CountryCode["Il"] = "IL";
    CountryCode["Im"] = "IM";
    CountryCode["In"] = "IN";
    CountryCode["Io"] = "IO";
    CountryCode["Iq"] = "IQ";
    CountryCode["Ir"] = "IR";
    CountryCode["Is"] = "IS";
    CountryCode["It"] = "IT";
    CountryCode["Je"] = "JE";
    CountryCode["Jm"] = "JM";
    CountryCode["Jo"] = "JO";
    CountryCode["Jp"] = "JP";
    CountryCode["Ke"] = "KE";
    CountryCode["Kg"] = "KG";
    CountryCode["Kh"] = "KH";
    CountryCode["Ki"] = "KI";
    CountryCode["Km"] = "KM";
    CountryCode["Kn"] = "KN";
    CountryCode["Kp"] = "KP";
    CountryCode["Kr"] = "KR";
    CountryCode["Kw"] = "KW";
    CountryCode["Ky"] = "KY";
    CountryCode["Kz"] = "KZ";
    CountryCode["La"] = "LA";
    CountryCode["Lb"] = "LB";
    CountryCode["Lc"] = "LC";
    CountryCode["Li"] = "LI";
    CountryCode["Lk"] = "LK";
    CountryCode["Lr"] = "LR";
    CountryCode["Ls"] = "LS";
    CountryCode["Lt"] = "LT";
    CountryCode["Lu"] = "LU";
    CountryCode["Lv"] = "LV";
    CountryCode["Ly"] = "LY";
    CountryCode["Ma"] = "MA";
    CountryCode["Mc"] = "MC";
    CountryCode["Md"] = "MD";
    CountryCode["Me"] = "ME";
    CountryCode["Mf"] = "MF";
    CountryCode["Mg"] = "MG";
    CountryCode["Mh"] = "MH";
    CountryCode["Mk"] = "MK";
    CountryCode["Ml"] = "ML";
    CountryCode["Mm"] = "MM";
    CountryCode["Mn"] = "MN";
    CountryCode["Mo"] = "MO";
    CountryCode["Mp"] = "MP";
    CountryCode["Mq"] = "MQ";
    CountryCode["Mr"] = "MR";
    CountryCode["Ms"] = "MS";
    CountryCode["Mt"] = "MT";
    CountryCode["Mu"] = "MU";
    CountryCode["Mv"] = "MV";
    CountryCode["Mw"] = "MW";
    CountryCode["Mx"] = "MX";
    CountryCode["My"] = "MY";
    CountryCode["Mz"] = "MZ";
    CountryCode["Na"] = "NA";
    CountryCode["Nc"] = "NC";
    CountryCode["Ne"] = "NE";
    CountryCode["Nf"] = "NF";
    CountryCode["Ng"] = "NG";
    CountryCode["Ni"] = "NI";
    CountryCode["Nl"] = "NL";
    CountryCode["No"] = "NO";
    CountryCode["Np"] = "NP";
    CountryCode["Nr"] = "NR";
    CountryCode["Nu"] = "NU";
    CountryCode["Nz"] = "NZ";
    CountryCode["Om"] = "OM";
    CountryCode["Pa"] = "PA";
    CountryCode["Pe"] = "PE";
    CountryCode["Pf"] = "PF";
    CountryCode["Pg"] = "PG";
    CountryCode["Ph"] = "PH";
    CountryCode["Pk"] = "PK";
    CountryCode["Pl"] = "PL";
    CountryCode["Pm"] = "PM";
    CountryCode["Pn"] = "PN";
    CountryCode["Pr"] = "PR";
    CountryCode["Ps"] = "PS";
    CountryCode["Pt"] = "PT";
    CountryCode["Pw"] = "PW";
    CountryCode["Py"] = "PY";
    CountryCode["Qa"] = "QA";
    CountryCode["Re"] = "RE";
    CountryCode["Ro"] = "RO";
    CountryCode["Rs"] = "RS";
    CountryCode["Ru"] = "RU";
    CountryCode["Rw"] = "RW";
    CountryCode["Sa"] = "SA";
    CountryCode["Sb"] = "SB";
    CountryCode["Sc"] = "SC";
    CountryCode["Sd"] = "SD";
    CountryCode["Se"] = "SE";
    CountryCode["Sg"] = "SG";
    CountryCode["Sh"] = "SH";
    CountryCode["Si"] = "SI";
    CountryCode["Sj"] = "SJ";
    CountryCode["Sk"] = "SK";
    CountryCode["Sl"] = "SL";
    CountryCode["Sm"] = "SM";
    CountryCode["Sn"] = "SN";
    CountryCode["So"] = "SO";
    CountryCode["Sr"] = "SR";
    CountryCode["Ss"] = "SS";
    CountryCode["St"] = "ST";
    CountryCode["Sv"] = "SV";
    CountryCode["Sx"] = "SX";
    CountryCode["Sy"] = "SY";
    CountryCode["Sz"] = "SZ";
    CountryCode["Tc"] = "TC";
    CountryCode["Td"] = "TD";
    CountryCode["Tf"] = "TF";
    CountryCode["Tg"] = "TG";
    CountryCode["Th"] = "TH";
    CountryCode["Tj"] = "TJ";
    CountryCode["Tk"] = "TK";
    CountryCode["Tl"] = "TL";
    CountryCode["Tm"] = "TM";
    CountryCode["Tn"] = "TN";
    CountryCode["To"] = "TO";
    CountryCode["Tr"] = "TR";
    CountryCode["Tt"] = "TT";
    CountryCode["Tv"] = "TV";
    CountryCode["Tw"] = "TW";
    CountryCode["Tz"] = "TZ";
    CountryCode["Ua"] = "UA";
    CountryCode["Ug"] = "UG";
    CountryCode["Um"] = "UM";
    CountryCode["Us"] = "US";
    CountryCode["Uy"] = "UY";
    CountryCode["Uz"] = "UZ";
    CountryCode["Va"] = "VA";
    CountryCode["Vc"] = "VC";
    CountryCode["Ve"] = "VE";
    CountryCode["Vg"] = "VG";
    CountryCode["Vi"] = "VI";
    CountryCode["Vn"] = "VN";
    CountryCode["Vu"] = "VU";
    CountryCode["Wf"] = "WF";
    CountryCode["Ws"] = "WS";
    CountryCode["Ye"] = "YE";
    CountryCode["Yt"] = "YT";
    CountryCode["Za"] = "ZA";
    CountryCode["Zm"] = "ZM";
    CountryCode["Zw"] = "ZW";
})(CountryCode1 || (CountryCode1 = {
}));
var CustomerEventsEnum1;

(function(CustomerEventsEnum) {
    CustomerEventsEnum["AccountCreated"] = "ACCOUNT_CREATED";
    CustomerEventsEnum["CustomerDeleted"] = "CUSTOMER_DELETED";
    CustomerEventsEnum["DigitalLinkDownloaded"] = "DIGITAL_LINK_DOWNLOADED";
    CustomerEventsEnum["EmailAssigned"] = "EMAIL_ASSIGNED";
    CustomerEventsEnum["EmailChanged"] = "EMAIL_CHANGED";
    CustomerEventsEnum["EmailChangedRequest"] = "EMAIL_CHANGED_REQUEST";
    CustomerEventsEnum["NameAssigned"] = "NAME_ASSIGNED";
    CustomerEventsEnum["NoteAdded"] = "NOTE_ADDED";
    CustomerEventsEnum["NoteAddedToOrder"] = "NOTE_ADDED_TO_ORDER";
    CustomerEventsEnum["PasswordChanged"] = "PASSWORD_CHANGED";
    CustomerEventsEnum["PasswordReset"] = "PASSWORD_RESET";
    CustomerEventsEnum["PasswordResetLinkSent"] = "PASSWORD_RESET_LINK_SENT";
    CustomerEventsEnum["PlacedOrder"] = "PLACED_ORDER";
})(CustomerEventsEnum1 || (CustomerEventsEnum1 = {
}));
var DiscountErrorCode1;

(function(DiscountErrorCode) {
    DiscountErrorCode["AlreadyExists"] = "ALREADY_EXISTS";
    DiscountErrorCode["CannotManageProductWithoutVariant"] = "CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT";
    DiscountErrorCode["DuplicatedInputItem"] = "DUPLICATED_INPUT_ITEM";
    DiscountErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    DiscountErrorCode["Invalid"] = "INVALID";
    DiscountErrorCode["NotFound"] = "NOT_FOUND";
    DiscountErrorCode["Required"] = "REQUIRED";
    DiscountErrorCode["Unique"] = "UNIQUE";
})(DiscountErrorCode1 || (DiscountErrorCode1 = {
}));
var DiscountStatusEnum1;

(function(DiscountStatusEnum) {
    DiscountStatusEnum["Active"] = "ACTIVE";
    DiscountStatusEnum["Expired"] = "EXPIRED";
    DiscountStatusEnum["Scheduled"] = "SCHEDULED";
})(DiscountStatusEnum1 || (DiscountStatusEnum1 = {
}));
var DiscountValueTypeEnum1;

(function(DiscountValueTypeEnum) {
    DiscountValueTypeEnum["Fixed"] = "FIXED";
    DiscountValueTypeEnum["Percentage"] = "PERCENTAGE";
})(DiscountValueTypeEnum1 || (DiscountValueTypeEnum1 = {
}));
var DistanceUnitsEnum1;

(function(DistanceUnitsEnum) {
    DistanceUnitsEnum["Cm"] = "CM";
    DistanceUnitsEnum["Ft"] = "FT";
    DistanceUnitsEnum["Inch"] = "INCH";
    DistanceUnitsEnum["Km"] = "KM";
    DistanceUnitsEnum["M"] = "M";
    DistanceUnitsEnum["Yd"] = "YD";
})(DistanceUnitsEnum1 || (DistanceUnitsEnum1 = {
}));
var ExportErrorCode1;

(function(ExportErrorCode) {
    ExportErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    ExportErrorCode["Invalid"] = "INVALID";
    ExportErrorCode["NotFound"] = "NOT_FOUND";
    ExportErrorCode["Required"] = "REQUIRED";
})(ExportErrorCode1 || (ExportErrorCode1 = {
}));
var ExportEventsEnum1;

(function(ExportEventsEnum) {
    ExportEventsEnum["ExportedFileSent"] = "EXPORTED_FILE_SENT";
    ExportEventsEnum["ExportDeleted"] = "EXPORT_DELETED";
    ExportEventsEnum["ExportFailed"] = "EXPORT_FAILED";
    ExportEventsEnum["ExportFailedInfoSent"] = "EXPORT_FAILED_INFO_SENT";
    ExportEventsEnum["ExportPending"] = "EXPORT_PENDING";
    ExportEventsEnum["ExportSuccess"] = "EXPORT_SUCCESS";
})(ExportEventsEnum1 || (ExportEventsEnum1 = {
}));
var ExportFileSortField1;

(function(ExportFileSortField) {
    ExportFileSortField["CreatedAt"] = "CREATED_AT";
    ExportFileSortField["Status"] = "STATUS";
    ExportFileSortField["UpdatedAt"] = "UPDATED_AT";
})(ExportFileSortField1 || (ExportFileSortField1 = {
}));
var ExportScope1;

(function(ExportScope) {
    ExportScope["All"] = "ALL";
    ExportScope["Filter"] = "FILTER";
    ExportScope["Ids"] = "IDS";
})(ExportScope1 || (ExportScope1 = {
}));
var FileTypesEnum1;

(function(FileTypesEnum) {
    FileTypesEnum["Csv"] = "CSV";
    FileTypesEnum["Xlsx"] = "XLSX";
})(FileTypesEnum1 || (FileTypesEnum1 = {
}));
var FulfillmentStatus1;

(function(FulfillmentStatus) {
    FulfillmentStatus["Canceled"] = "CANCELED";
    FulfillmentStatus["Fulfilled"] = "FULFILLED";
    FulfillmentStatus["Refunded"] = "REFUNDED";
    FulfillmentStatus["RefundedAndReturned"] = "REFUNDED_AND_RETURNED";
    FulfillmentStatus["Replaced"] = "REPLACED";
    FulfillmentStatus["Returned"] = "RETURNED";
})(FulfillmentStatus1 || (FulfillmentStatus1 = {
}));
var GiftCardErrorCode1;

(function(GiftCardErrorCode) {
    GiftCardErrorCode["AlreadyExists"] = "ALREADY_EXISTS";
    GiftCardErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    GiftCardErrorCode["Invalid"] = "INVALID";
    GiftCardErrorCode["NotFound"] = "NOT_FOUND";
    GiftCardErrorCode["Required"] = "REQUIRED";
    GiftCardErrorCode["Unique"] = "UNIQUE";
})(GiftCardErrorCode1 || (GiftCardErrorCode1 = {
}));
var InvoiceErrorCode1;

(function(InvoiceErrorCode) {
    InvoiceErrorCode["EmailNotSet"] = "EMAIL_NOT_SET";
    InvoiceErrorCode["InvalidStatus"] = "INVALID_STATUS";
    InvoiceErrorCode["NotFound"] = "NOT_FOUND";
    InvoiceErrorCode["NotReady"] = "NOT_READY";
    InvoiceErrorCode["NumberNotSet"] = "NUMBER_NOT_SET";
    InvoiceErrorCode["Required"] = "REQUIRED";
    InvoiceErrorCode["UrlNotSet"] = "URL_NOT_SET";
})(InvoiceErrorCode1 || (InvoiceErrorCode1 = {
}));
var JobStatusEnum1;

(function(JobStatusEnum) {
    JobStatusEnum["Deleted"] = "DELETED";
    JobStatusEnum["Failed"] = "FAILED";
    JobStatusEnum["Pending"] = "PENDING";
    JobStatusEnum["Success"] = "SUCCESS";
})(JobStatusEnum1 || (JobStatusEnum1 = {
}));
var LanguageCodeEnum1;

(function(LanguageCodeEnum) {
    LanguageCodeEnum["Af"] = "AF";
    LanguageCodeEnum["AfNa"] = "AF_NA";
    LanguageCodeEnum["AfZa"] = "AF_ZA";
    LanguageCodeEnum["Agq"] = "AGQ";
    LanguageCodeEnum["AgqCm"] = "AGQ_CM";
    LanguageCodeEnum["Ak"] = "AK";
    LanguageCodeEnum["AkGh"] = "AK_GH";
    LanguageCodeEnum["Am"] = "AM";
    LanguageCodeEnum["AmEt"] = "AM_ET";
    LanguageCodeEnum["Ar"] = "AR";
    LanguageCodeEnum["ArAe"] = "AR_AE";
    LanguageCodeEnum["ArBh"] = "AR_BH";
    LanguageCodeEnum["ArDj"] = "AR_DJ";
    LanguageCodeEnum["ArDz"] = "AR_DZ";
    LanguageCodeEnum["ArEg"] = "AR_EG";
    LanguageCodeEnum["ArEh"] = "AR_EH";
    LanguageCodeEnum["ArEr"] = "AR_ER";
    LanguageCodeEnum["ArIl"] = "AR_IL";
    LanguageCodeEnum["ArIq"] = "AR_IQ";
    LanguageCodeEnum["ArJo"] = "AR_JO";
    LanguageCodeEnum["ArKm"] = "AR_KM";
    LanguageCodeEnum["ArKw"] = "AR_KW";
    LanguageCodeEnum["ArLb"] = "AR_LB";
    LanguageCodeEnum["ArLy"] = "AR_LY";
    LanguageCodeEnum["ArMa"] = "AR_MA";
    LanguageCodeEnum["ArMr"] = "AR_MR";
    LanguageCodeEnum["ArOm"] = "AR_OM";
    LanguageCodeEnum["ArPs"] = "AR_PS";
    LanguageCodeEnum["ArQa"] = "AR_QA";
    LanguageCodeEnum["ArSa"] = "AR_SA";
    LanguageCodeEnum["ArSd"] = "AR_SD";
    LanguageCodeEnum["ArSo"] = "AR_SO";
    LanguageCodeEnum["ArSs"] = "AR_SS";
    LanguageCodeEnum["ArSy"] = "AR_SY";
    LanguageCodeEnum["ArTd"] = "AR_TD";
    LanguageCodeEnum["ArTn"] = "AR_TN";
    LanguageCodeEnum["ArYe"] = "AR_YE";
    LanguageCodeEnum["As"] = "AS";
    LanguageCodeEnum["Asa"] = "ASA";
    LanguageCodeEnum["AsaTz"] = "ASA_TZ";
    LanguageCodeEnum["Ast"] = "AST";
    LanguageCodeEnum["AstEs"] = "AST_ES";
    LanguageCodeEnum["AsIn"] = "AS_IN";
    LanguageCodeEnum["Az"] = "AZ";
    LanguageCodeEnum["AzCyrl"] = "AZ_CYRL";
    LanguageCodeEnum["AzCyrlAz"] = "AZ_CYRL_AZ";
    LanguageCodeEnum["AzLatn"] = "AZ_LATN";
    LanguageCodeEnum["AzLatnAz"] = "AZ_LATN_AZ";
    LanguageCodeEnum["Bas"] = "BAS";
    LanguageCodeEnum["BasCm"] = "BAS_CM";
    LanguageCodeEnum["Be"] = "BE";
    LanguageCodeEnum["Bem"] = "BEM";
    LanguageCodeEnum["BemZm"] = "BEM_ZM";
    LanguageCodeEnum["Bez"] = "BEZ";
    LanguageCodeEnum["BezTz"] = "BEZ_TZ";
    LanguageCodeEnum["BeBy"] = "BE_BY";
    LanguageCodeEnum["Bg"] = "BG";
    LanguageCodeEnum["BgBg"] = "BG_BG";
    LanguageCodeEnum["Bm"] = "BM";
    LanguageCodeEnum["BmMl"] = "BM_ML";
    LanguageCodeEnum["Bn"] = "BN";
    LanguageCodeEnum["BnBd"] = "BN_BD";
    LanguageCodeEnum["BnIn"] = "BN_IN";
    LanguageCodeEnum["Bo"] = "BO";
    LanguageCodeEnum["BoCn"] = "BO_CN";
    LanguageCodeEnum["BoIn"] = "BO_IN";
    LanguageCodeEnum["Br"] = "BR";
    LanguageCodeEnum["Brx"] = "BRX";
    LanguageCodeEnum["BrxIn"] = "BRX_IN";
    LanguageCodeEnum["BrFr"] = "BR_FR";
    LanguageCodeEnum["Bs"] = "BS";
    LanguageCodeEnum["BsCyrl"] = "BS_CYRL";
    LanguageCodeEnum["BsCyrlBa"] = "BS_CYRL_BA";
    LanguageCodeEnum["BsLatn"] = "BS_LATN";
    LanguageCodeEnum["BsLatnBa"] = "BS_LATN_BA";
    LanguageCodeEnum["Ca"] = "CA";
    LanguageCodeEnum["CaAd"] = "CA_AD";
    LanguageCodeEnum["CaEs"] = "CA_ES";
    LanguageCodeEnum["CaEsValencia"] = "CA_ES_VALENCIA";
    LanguageCodeEnum["CaFr"] = "CA_FR";
    LanguageCodeEnum["CaIt"] = "CA_IT";
    LanguageCodeEnum["Ccp"] = "CCP";
    LanguageCodeEnum["CcpBd"] = "CCP_BD";
    LanguageCodeEnum["CcpIn"] = "CCP_IN";
    LanguageCodeEnum["Ce"] = "CE";
    LanguageCodeEnum["Ceb"] = "CEB";
    LanguageCodeEnum["CebPh"] = "CEB_PH";
    LanguageCodeEnum["CeRu"] = "CE_RU";
    LanguageCodeEnum["Cgg"] = "CGG";
    LanguageCodeEnum["CggUg"] = "CGG_UG";
    LanguageCodeEnum["Chr"] = "CHR";
    LanguageCodeEnum["ChrUs"] = "CHR_US";
    LanguageCodeEnum["Ckb"] = "CKB";
    LanguageCodeEnum["CkbIq"] = "CKB_IQ";
    LanguageCodeEnum["CkbIr"] = "CKB_IR";
    LanguageCodeEnum["Cs"] = "CS";
    LanguageCodeEnum["CsCz"] = "CS_CZ";
    LanguageCodeEnum["Cu"] = "CU";
    LanguageCodeEnum["CuRu"] = "CU_RU";
    LanguageCodeEnum["Cy"] = "CY";
    LanguageCodeEnum["CyGb"] = "CY_GB";
    LanguageCodeEnum["Da"] = "DA";
    LanguageCodeEnum["Dav"] = "DAV";
    LanguageCodeEnum["DavKe"] = "DAV_KE";
    LanguageCodeEnum["DaDk"] = "DA_DK";
    LanguageCodeEnum["DaGl"] = "DA_GL";
    LanguageCodeEnum["De"] = "DE";
    LanguageCodeEnum["DeAt"] = "DE_AT";
    LanguageCodeEnum["DeBe"] = "DE_BE";
    LanguageCodeEnum["DeCh"] = "DE_CH";
    LanguageCodeEnum["DeDe"] = "DE_DE";
    LanguageCodeEnum["DeIt"] = "DE_IT";
    LanguageCodeEnum["DeLi"] = "DE_LI";
    LanguageCodeEnum["DeLu"] = "DE_LU";
    LanguageCodeEnum["Dje"] = "DJE";
    LanguageCodeEnum["DjeNe"] = "DJE_NE";
    LanguageCodeEnum["Dsb"] = "DSB";
    LanguageCodeEnum["DsbDe"] = "DSB_DE";
    LanguageCodeEnum["Dua"] = "DUA";
    LanguageCodeEnum["DuaCm"] = "DUA_CM";
    LanguageCodeEnum["Dyo"] = "DYO";
    LanguageCodeEnum["DyoSn"] = "DYO_SN";
    LanguageCodeEnum["Dz"] = "DZ";
    LanguageCodeEnum["DzBt"] = "DZ_BT";
    LanguageCodeEnum["Ebu"] = "EBU";
    LanguageCodeEnum["EbuKe"] = "EBU_KE";
    LanguageCodeEnum["Ee"] = "EE";
    LanguageCodeEnum["EeGh"] = "EE_GH";
    LanguageCodeEnum["EeTg"] = "EE_TG";
    LanguageCodeEnum["El"] = "EL";
    LanguageCodeEnum["ElCy"] = "EL_CY";
    LanguageCodeEnum["ElGr"] = "EL_GR";
    LanguageCodeEnum["En"] = "EN";
    LanguageCodeEnum["EnAe"] = "EN_AE";
    LanguageCodeEnum["EnAg"] = "EN_AG";
    LanguageCodeEnum["EnAi"] = "EN_AI";
    LanguageCodeEnum["EnAs"] = "EN_AS";
    LanguageCodeEnum["EnAt"] = "EN_AT";
    LanguageCodeEnum["EnAu"] = "EN_AU";
    LanguageCodeEnum["EnBb"] = "EN_BB";
    LanguageCodeEnum["EnBe"] = "EN_BE";
    LanguageCodeEnum["EnBi"] = "EN_BI";
    LanguageCodeEnum["EnBm"] = "EN_BM";
    LanguageCodeEnum["EnBs"] = "EN_BS";
    LanguageCodeEnum["EnBw"] = "EN_BW";
    LanguageCodeEnum["EnBz"] = "EN_BZ";
    LanguageCodeEnum["EnCa"] = "EN_CA";
    LanguageCodeEnum["EnCc"] = "EN_CC";
    LanguageCodeEnum["EnCh"] = "EN_CH";
    LanguageCodeEnum["EnCk"] = "EN_CK";
    LanguageCodeEnum["EnCm"] = "EN_CM";
    LanguageCodeEnum["EnCx"] = "EN_CX";
    LanguageCodeEnum["EnCy"] = "EN_CY";
    LanguageCodeEnum["EnDe"] = "EN_DE";
    LanguageCodeEnum["EnDg"] = "EN_DG";
    LanguageCodeEnum["EnDk"] = "EN_DK";
    LanguageCodeEnum["EnDm"] = "EN_DM";
    LanguageCodeEnum["EnEr"] = "EN_ER";
    LanguageCodeEnum["EnFi"] = "EN_FI";
    LanguageCodeEnum["EnFj"] = "EN_FJ";
    LanguageCodeEnum["EnFk"] = "EN_FK";
    LanguageCodeEnum["EnFm"] = "EN_FM";
    LanguageCodeEnum["EnGb"] = "EN_GB";
    LanguageCodeEnum["EnGd"] = "EN_GD";
    LanguageCodeEnum["EnGg"] = "EN_GG";
    LanguageCodeEnum["EnGh"] = "EN_GH";
    LanguageCodeEnum["EnGi"] = "EN_GI";
    LanguageCodeEnum["EnGm"] = "EN_GM";
    LanguageCodeEnum["EnGu"] = "EN_GU";
    LanguageCodeEnum["EnGy"] = "EN_GY";
    LanguageCodeEnum["EnHk"] = "EN_HK";
    LanguageCodeEnum["EnIe"] = "EN_IE";
    LanguageCodeEnum["EnIl"] = "EN_IL";
    LanguageCodeEnum["EnIm"] = "EN_IM";
    LanguageCodeEnum["EnIn"] = "EN_IN";
    LanguageCodeEnum["EnIo"] = "EN_IO";
    LanguageCodeEnum["EnJe"] = "EN_JE";
    LanguageCodeEnum["EnJm"] = "EN_JM";
    LanguageCodeEnum["EnKe"] = "EN_KE";
    LanguageCodeEnum["EnKi"] = "EN_KI";
    LanguageCodeEnum["EnKn"] = "EN_KN";
    LanguageCodeEnum["EnKy"] = "EN_KY";
    LanguageCodeEnum["EnLc"] = "EN_LC";
    LanguageCodeEnum["EnLr"] = "EN_LR";
    LanguageCodeEnum["EnLs"] = "EN_LS";
    LanguageCodeEnum["EnMg"] = "EN_MG";
    LanguageCodeEnum["EnMh"] = "EN_MH";
    LanguageCodeEnum["EnMo"] = "EN_MO";
    LanguageCodeEnum["EnMp"] = "EN_MP";
    LanguageCodeEnum["EnMs"] = "EN_MS";
    LanguageCodeEnum["EnMt"] = "EN_MT";
    LanguageCodeEnum["EnMu"] = "EN_MU";
    LanguageCodeEnum["EnMw"] = "EN_MW";
    LanguageCodeEnum["EnMy"] = "EN_MY";
    LanguageCodeEnum["EnNa"] = "EN_NA";
    LanguageCodeEnum["EnNf"] = "EN_NF";
    LanguageCodeEnum["EnNg"] = "EN_NG";
    LanguageCodeEnum["EnNl"] = "EN_NL";
    LanguageCodeEnum["EnNr"] = "EN_NR";
    LanguageCodeEnum["EnNu"] = "EN_NU";
    LanguageCodeEnum["EnNz"] = "EN_NZ";
    LanguageCodeEnum["EnPg"] = "EN_PG";
    LanguageCodeEnum["EnPh"] = "EN_PH";
    LanguageCodeEnum["EnPk"] = "EN_PK";
    LanguageCodeEnum["EnPn"] = "EN_PN";
    LanguageCodeEnum["EnPr"] = "EN_PR";
    LanguageCodeEnum["EnPw"] = "EN_PW";
    LanguageCodeEnum["EnRw"] = "EN_RW";
    LanguageCodeEnum["EnSb"] = "EN_SB";
    LanguageCodeEnum["EnSc"] = "EN_SC";
    LanguageCodeEnum["EnSd"] = "EN_SD";
    LanguageCodeEnum["EnSe"] = "EN_SE";
    LanguageCodeEnum["EnSg"] = "EN_SG";
    LanguageCodeEnum["EnSh"] = "EN_SH";
    LanguageCodeEnum["EnSi"] = "EN_SI";
    LanguageCodeEnum["EnSl"] = "EN_SL";
    LanguageCodeEnum["EnSs"] = "EN_SS";
    LanguageCodeEnum["EnSx"] = "EN_SX";
    LanguageCodeEnum["EnSz"] = "EN_SZ";
    LanguageCodeEnum["EnTc"] = "EN_TC";
    LanguageCodeEnum["EnTk"] = "EN_TK";
    LanguageCodeEnum["EnTo"] = "EN_TO";
    LanguageCodeEnum["EnTt"] = "EN_TT";
    LanguageCodeEnum["EnTv"] = "EN_TV";
    LanguageCodeEnum["EnTz"] = "EN_TZ";
    LanguageCodeEnum["EnUg"] = "EN_UG";
    LanguageCodeEnum["EnUm"] = "EN_UM";
    LanguageCodeEnum["EnUs"] = "EN_US";
    LanguageCodeEnum["EnVc"] = "EN_VC";
    LanguageCodeEnum["EnVg"] = "EN_VG";
    LanguageCodeEnum["EnVi"] = "EN_VI";
    LanguageCodeEnum["EnVu"] = "EN_VU";
    LanguageCodeEnum["EnWs"] = "EN_WS";
    LanguageCodeEnum["EnZa"] = "EN_ZA";
    LanguageCodeEnum["EnZm"] = "EN_ZM";
    LanguageCodeEnum["EnZw"] = "EN_ZW";
    LanguageCodeEnum["Eo"] = "EO";
    LanguageCodeEnum["Es"] = "ES";
    LanguageCodeEnum["EsAr"] = "ES_AR";
    LanguageCodeEnum["EsBo"] = "ES_BO";
    LanguageCodeEnum["EsBr"] = "ES_BR";
    LanguageCodeEnum["EsBz"] = "ES_BZ";
    LanguageCodeEnum["EsCl"] = "ES_CL";
    LanguageCodeEnum["EsCo"] = "ES_CO";
    LanguageCodeEnum["EsCr"] = "ES_CR";
    LanguageCodeEnum["EsCu"] = "ES_CU";
    LanguageCodeEnum["EsDo"] = "ES_DO";
    LanguageCodeEnum["EsEa"] = "ES_EA";
    LanguageCodeEnum["EsEc"] = "ES_EC";
    LanguageCodeEnum["EsEs"] = "ES_ES";
    LanguageCodeEnum["EsGq"] = "ES_GQ";
    LanguageCodeEnum["EsGt"] = "ES_GT";
    LanguageCodeEnum["EsHn"] = "ES_HN";
    LanguageCodeEnum["EsIc"] = "ES_IC";
    LanguageCodeEnum["EsMx"] = "ES_MX";
    LanguageCodeEnum["EsNi"] = "ES_NI";
    LanguageCodeEnum["EsPa"] = "ES_PA";
    LanguageCodeEnum["EsPe"] = "ES_PE";
    LanguageCodeEnum["EsPh"] = "ES_PH";
    LanguageCodeEnum["EsPr"] = "ES_PR";
    LanguageCodeEnum["EsPy"] = "ES_PY";
    LanguageCodeEnum["EsSv"] = "ES_SV";
    LanguageCodeEnum["EsUs"] = "ES_US";
    LanguageCodeEnum["EsUy"] = "ES_UY";
    LanguageCodeEnum["EsVe"] = "ES_VE";
    LanguageCodeEnum["Et"] = "ET";
    LanguageCodeEnum["EtEe"] = "ET_EE";
    LanguageCodeEnum["Eu"] = "EU";
    LanguageCodeEnum["EuEs"] = "EU_ES";
    LanguageCodeEnum["Ewo"] = "EWO";
    LanguageCodeEnum["EwoCm"] = "EWO_CM";
    LanguageCodeEnum["Fa"] = "FA";
    LanguageCodeEnum["FaAf"] = "FA_AF";
    LanguageCodeEnum["FaIr"] = "FA_IR";
    LanguageCodeEnum["Ff"] = "FF";
    LanguageCodeEnum["FfAdlm"] = "FF_ADLM";
    LanguageCodeEnum["FfAdlmBf"] = "FF_ADLM_BF";
    LanguageCodeEnum["FfAdlmCm"] = "FF_ADLM_CM";
    LanguageCodeEnum["FfAdlmGh"] = "FF_ADLM_GH";
    LanguageCodeEnum["FfAdlmGm"] = "FF_ADLM_GM";
    LanguageCodeEnum["FfAdlmGn"] = "FF_ADLM_GN";
    LanguageCodeEnum["FfAdlmGw"] = "FF_ADLM_GW";
    LanguageCodeEnum["FfAdlmLr"] = "FF_ADLM_LR";
    LanguageCodeEnum["FfAdlmMr"] = "FF_ADLM_MR";
    LanguageCodeEnum["FfAdlmNe"] = "FF_ADLM_NE";
    LanguageCodeEnum["FfAdlmNg"] = "FF_ADLM_NG";
    LanguageCodeEnum["FfAdlmSl"] = "FF_ADLM_SL";
    LanguageCodeEnum["FfAdlmSn"] = "FF_ADLM_SN";
    LanguageCodeEnum["FfLatn"] = "FF_LATN";
    LanguageCodeEnum["FfLatnBf"] = "FF_LATN_BF";
    LanguageCodeEnum["FfLatnCm"] = "FF_LATN_CM";
    LanguageCodeEnum["FfLatnGh"] = "FF_LATN_GH";
    LanguageCodeEnum["FfLatnGm"] = "FF_LATN_GM";
    LanguageCodeEnum["FfLatnGn"] = "FF_LATN_GN";
    LanguageCodeEnum["FfLatnGw"] = "FF_LATN_GW";
    LanguageCodeEnum["FfLatnLr"] = "FF_LATN_LR";
    LanguageCodeEnum["FfLatnMr"] = "FF_LATN_MR";
    LanguageCodeEnum["FfLatnNe"] = "FF_LATN_NE";
    LanguageCodeEnum["FfLatnNg"] = "FF_LATN_NG";
    LanguageCodeEnum["FfLatnSl"] = "FF_LATN_SL";
    LanguageCodeEnum["FfLatnSn"] = "FF_LATN_SN";
    LanguageCodeEnum["Fi"] = "FI";
    LanguageCodeEnum["Fil"] = "FIL";
    LanguageCodeEnum["FilPh"] = "FIL_PH";
    LanguageCodeEnum["FiFi"] = "FI_FI";
    LanguageCodeEnum["Fo"] = "FO";
    LanguageCodeEnum["FoDk"] = "FO_DK";
    LanguageCodeEnum["FoFo"] = "FO_FO";
    LanguageCodeEnum["Fr"] = "FR";
    LanguageCodeEnum["FrBe"] = "FR_BE";
    LanguageCodeEnum["FrBf"] = "FR_BF";
    LanguageCodeEnum["FrBi"] = "FR_BI";
    LanguageCodeEnum["FrBj"] = "FR_BJ";
    LanguageCodeEnum["FrBl"] = "FR_BL";
    LanguageCodeEnum["FrCa"] = "FR_CA";
    LanguageCodeEnum["FrCd"] = "FR_CD";
    LanguageCodeEnum["FrCf"] = "FR_CF";
    LanguageCodeEnum["FrCg"] = "FR_CG";
    LanguageCodeEnum["FrCh"] = "FR_CH";
    LanguageCodeEnum["FrCi"] = "FR_CI";
    LanguageCodeEnum["FrCm"] = "FR_CM";
    LanguageCodeEnum["FrDj"] = "FR_DJ";
    LanguageCodeEnum["FrDz"] = "FR_DZ";
    LanguageCodeEnum["FrFr"] = "FR_FR";
    LanguageCodeEnum["FrGa"] = "FR_GA";
    LanguageCodeEnum["FrGf"] = "FR_GF";
    LanguageCodeEnum["FrGn"] = "FR_GN";
    LanguageCodeEnum["FrGp"] = "FR_GP";
    LanguageCodeEnum["FrGq"] = "FR_GQ";
    LanguageCodeEnum["FrHt"] = "FR_HT";
    LanguageCodeEnum["FrKm"] = "FR_KM";
    LanguageCodeEnum["FrLu"] = "FR_LU";
    LanguageCodeEnum["FrMa"] = "FR_MA";
    LanguageCodeEnum["FrMc"] = "FR_MC";
    LanguageCodeEnum["FrMf"] = "FR_MF";
    LanguageCodeEnum["FrMg"] = "FR_MG";
    LanguageCodeEnum["FrMl"] = "FR_ML";
    LanguageCodeEnum["FrMq"] = "FR_MQ";
    LanguageCodeEnum["FrMr"] = "FR_MR";
    LanguageCodeEnum["FrMu"] = "FR_MU";
    LanguageCodeEnum["FrNc"] = "FR_NC";
    LanguageCodeEnum["FrNe"] = "FR_NE";
    LanguageCodeEnum["FrPf"] = "FR_PF";
    LanguageCodeEnum["FrPm"] = "FR_PM";
    LanguageCodeEnum["FrRe"] = "FR_RE";
    LanguageCodeEnum["FrRw"] = "FR_RW";
    LanguageCodeEnum["FrSc"] = "FR_SC";
    LanguageCodeEnum["FrSn"] = "FR_SN";
    LanguageCodeEnum["FrSy"] = "FR_SY";
    LanguageCodeEnum["FrTd"] = "FR_TD";
    LanguageCodeEnum["FrTg"] = "FR_TG";
    LanguageCodeEnum["FrTn"] = "FR_TN";
    LanguageCodeEnum["FrVu"] = "FR_VU";
    LanguageCodeEnum["FrWf"] = "FR_WF";
    LanguageCodeEnum["FrYt"] = "FR_YT";
    LanguageCodeEnum["Fur"] = "FUR";
    LanguageCodeEnum["FurIt"] = "FUR_IT";
    LanguageCodeEnum["Fy"] = "FY";
    LanguageCodeEnum["FyNl"] = "FY_NL";
    LanguageCodeEnum["Ga"] = "GA";
    LanguageCodeEnum["GaGb"] = "GA_GB";
    LanguageCodeEnum["GaIe"] = "GA_IE";
    LanguageCodeEnum["Gd"] = "GD";
    LanguageCodeEnum["GdGb"] = "GD_GB";
    LanguageCodeEnum["Gl"] = "GL";
    LanguageCodeEnum["GlEs"] = "GL_ES";
    LanguageCodeEnum["Gsw"] = "GSW";
    LanguageCodeEnum["GswCh"] = "GSW_CH";
    LanguageCodeEnum["GswFr"] = "GSW_FR";
    LanguageCodeEnum["GswLi"] = "GSW_LI";
    LanguageCodeEnum["Gu"] = "GU";
    LanguageCodeEnum["Guz"] = "GUZ";
    LanguageCodeEnum["GuzKe"] = "GUZ_KE";
    LanguageCodeEnum["GuIn"] = "GU_IN";
    LanguageCodeEnum["Gv"] = "GV";
    LanguageCodeEnum["GvIm"] = "GV_IM";
    LanguageCodeEnum["Ha"] = "HA";
    LanguageCodeEnum["Haw"] = "HAW";
    LanguageCodeEnum["HawUs"] = "HAW_US";
    LanguageCodeEnum["HaGh"] = "HA_GH";
    LanguageCodeEnum["HaNe"] = "HA_NE";
    LanguageCodeEnum["HaNg"] = "HA_NG";
    LanguageCodeEnum["He"] = "HE";
    LanguageCodeEnum["HeIl"] = "HE_IL";
    LanguageCodeEnum["Hi"] = "HI";
    LanguageCodeEnum["HiIn"] = "HI_IN";
    LanguageCodeEnum["Hr"] = "HR";
    LanguageCodeEnum["HrBa"] = "HR_BA";
    LanguageCodeEnum["HrHr"] = "HR_HR";
    LanguageCodeEnum["Hsb"] = "HSB";
    LanguageCodeEnum["HsbDe"] = "HSB_DE";
    LanguageCodeEnum["Hu"] = "HU";
    LanguageCodeEnum["HuHu"] = "HU_HU";
    LanguageCodeEnum["Hy"] = "HY";
    LanguageCodeEnum["HyAm"] = "HY_AM";
    LanguageCodeEnum["Ia"] = "IA";
    LanguageCodeEnum["Id"] = "ID";
    LanguageCodeEnum["IdId"] = "ID_ID";
    LanguageCodeEnum["Ig"] = "IG";
    LanguageCodeEnum["IgNg"] = "IG_NG";
    LanguageCodeEnum["Ii"] = "II";
    LanguageCodeEnum["IiCn"] = "II_CN";
    LanguageCodeEnum["Is"] = "IS";
    LanguageCodeEnum["IsIs"] = "IS_IS";
    LanguageCodeEnum["It"] = "IT";
    LanguageCodeEnum["ItCh"] = "IT_CH";
    LanguageCodeEnum["ItIt"] = "IT_IT";
    LanguageCodeEnum["ItSm"] = "IT_SM";
    LanguageCodeEnum["ItVa"] = "IT_VA";
    LanguageCodeEnum["Ja"] = "JA";
    LanguageCodeEnum["JaJp"] = "JA_JP";
    LanguageCodeEnum["Jgo"] = "JGO";
    LanguageCodeEnum["JgoCm"] = "JGO_CM";
    LanguageCodeEnum["Jmc"] = "JMC";
    LanguageCodeEnum["JmcTz"] = "JMC_TZ";
    LanguageCodeEnum["Jv"] = "JV";
    LanguageCodeEnum["JvId"] = "JV_ID";
    LanguageCodeEnum["Ka"] = "KA";
    LanguageCodeEnum["Kab"] = "KAB";
    LanguageCodeEnum["KabDz"] = "KAB_DZ";
    LanguageCodeEnum["Kam"] = "KAM";
    LanguageCodeEnum["KamKe"] = "KAM_KE";
    LanguageCodeEnum["KaGe"] = "KA_GE";
    LanguageCodeEnum["Kde"] = "KDE";
    LanguageCodeEnum["KdeTz"] = "KDE_TZ";
    LanguageCodeEnum["Kea"] = "KEA";
    LanguageCodeEnum["KeaCv"] = "KEA_CV";
    LanguageCodeEnum["Khq"] = "KHQ";
    LanguageCodeEnum["KhqMl"] = "KHQ_ML";
    LanguageCodeEnum["Ki"] = "KI";
    LanguageCodeEnum["KiKe"] = "KI_KE";
    LanguageCodeEnum["Kk"] = "KK";
    LanguageCodeEnum["Kkj"] = "KKJ";
    LanguageCodeEnum["KkjCm"] = "KKJ_CM";
    LanguageCodeEnum["KkKz"] = "KK_KZ";
    LanguageCodeEnum["Kl"] = "KL";
    LanguageCodeEnum["Kln"] = "KLN";
    LanguageCodeEnum["KlnKe"] = "KLN_KE";
    LanguageCodeEnum["KlGl"] = "KL_GL";
    LanguageCodeEnum["Km"] = "KM";
    LanguageCodeEnum["KmKh"] = "KM_KH";
    LanguageCodeEnum["Kn"] = "KN";
    LanguageCodeEnum["KnIn"] = "KN_IN";
    LanguageCodeEnum["Ko"] = "KO";
    LanguageCodeEnum["Kok"] = "KOK";
    LanguageCodeEnum["KokIn"] = "KOK_IN";
    LanguageCodeEnum["KoKp"] = "KO_KP";
    LanguageCodeEnum["KoKr"] = "KO_KR";
    LanguageCodeEnum["Ks"] = "KS";
    LanguageCodeEnum["Ksb"] = "KSB";
    LanguageCodeEnum["KsbTz"] = "KSB_TZ";
    LanguageCodeEnum["Ksf"] = "KSF";
    LanguageCodeEnum["KsfCm"] = "KSF_CM";
    LanguageCodeEnum["Ksh"] = "KSH";
    LanguageCodeEnum["KshDe"] = "KSH_DE";
    LanguageCodeEnum["KsArab"] = "KS_ARAB";
    LanguageCodeEnum["KsArabIn"] = "KS_ARAB_IN";
    LanguageCodeEnum["Ku"] = "KU";
    LanguageCodeEnum["KuTr"] = "KU_TR";
    LanguageCodeEnum["Kw"] = "KW";
    LanguageCodeEnum["KwGb"] = "KW_GB";
    LanguageCodeEnum["Ky"] = "KY";
    LanguageCodeEnum["KyKg"] = "KY_KG";
    LanguageCodeEnum["Lag"] = "LAG";
    LanguageCodeEnum["LagTz"] = "LAG_TZ";
    LanguageCodeEnum["Lb"] = "LB";
    LanguageCodeEnum["LbLu"] = "LB_LU";
    LanguageCodeEnum["Lg"] = "LG";
    LanguageCodeEnum["LgUg"] = "LG_UG";
    LanguageCodeEnum["Lkt"] = "LKT";
    LanguageCodeEnum["LktUs"] = "LKT_US";
    LanguageCodeEnum["Ln"] = "LN";
    LanguageCodeEnum["LnAo"] = "LN_AO";
    LanguageCodeEnum["LnCd"] = "LN_CD";
    LanguageCodeEnum["LnCf"] = "LN_CF";
    LanguageCodeEnum["LnCg"] = "LN_CG";
    LanguageCodeEnum["Lo"] = "LO";
    LanguageCodeEnum["LoLa"] = "LO_LA";
    LanguageCodeEnum["Lrc"] = "LRC";
    LanguageCodeEnum["LrcIq"] = "LRC_IQ";
    LanguageCodeEnum["LrcIr"] = "LRC_IR";
    LanguageCodeEnum["Lt"] = "LT";
    LanguageCodeEnum["LtLt"] = "LT_LT";
    LanguageCodeEnum["Lu"] = "LU";
    LanguageCodeEnum["Luo"] = "LUO";
    LanguageCodeEnum["LuoKe"] = "LUO_KE";
    LanguageCodeEnum["Luy"] = "LUY";
    LanguageCodeEnum["LuyKe"] = "LUY_KE";
    LanguageCodeEnum["LuCd"] = "LU_CD";
    LanguageCodeEnum["Lv"] = "LV";
    LanguageCodeEnum["LvLv"] = "LV_LV";
    LanguageCodeEnum["Mai"] = "MAI";
    LanguageCodeEnum["MaiIn"] = "MAI_IN";
    LanguageCodeEnum["Mas"] = "MAS";
    LanguageCodeEnum["MasKe"] = "MAS_KE";
    LanguageCodeEnum["MasTz"] = "MAS_TZ";
    LanguageCodeEnum["Mer"] = "MER";
    LanguageCodeEnum["MerKe"] = "MER_KE";
    LanguageCodeEnum["Mfe"] = "MFE";
    LanguageCodeEnum["MfeMu"] = "MFE_MU";
    LanguageCodeEnum["Mg"] = "MG";
    LanguageCodeEnum["Mgh"] = "MGH";
    LanguageCodeEnum["MghMz"] = "MGH_MZ";
    LanguageCodeEnum["Mgo"] = "MGO";
    LanguageCodeEnum["MgoCm"] = "MGO_CM";
    LanguageCodeEnum["MgMg"] = "MG_MG";
    LanguageCodeEnum["Mi"] = "MI";
    LanguageCodeEnum["MiNz"] = "MI_NZ";
    LanguageCodeEnum["Mk"] = "MK";
    LanguageCodeEnum["MkMk"] = "MK_MK";
    LanguageCodeEnum["Ml"] = "ML";
    LanguageCodeEnum["MlIn"] = "ML_IN";
    LanguageCodeEnum["Mn"] = "MN";
    LanguageCodeEnum["Mni"] = "MNI";
    LanguageCodeEnum["MniBeng"] = "MNI_BENG";
    LanguageCodeEnum["MniBengIn"] = "MNI_BENG_IN";
    LanguageCodeEnum["MnMn"] = "MN_MN";
    LanguageCodeEnum["Mr"] = "MR";
    LanguageCodeEnum["MrIn"] = "MR_IN";
    LanguageCodeEnum["Ms"] = "MS";
    LanguageCodeEnum["MsBn"] = "MS_BN";
    LanguageCodeEnum["MsId"] = "MS_ID";
    LanguageCodeEnum["MsMy"] = "MS_MY";
    LanguageCodeEnum["MsSg"] = "MS_SG";
    LanguageCodeEnum["Mt"] = "MT";
    LanguageCodeEnum["MtMt"] = "MT_MT";
    LanguageCodeEnum["Mua"] = "MUA";
    LanguageCodeEnum["MuaCm"] = "MUA_CM";
    LanguageCodeEnum["My"] = "MY";
    LanguageCodeEnum["MyMm"] = "MY_MM";
    LanguageCodeEnum["Mzn"] = "MZN";
    LanguageCodeEnum["MznIr"] = "MZN_IR";
    LanguageCodeEnum["Naq"] = "NAQ";
    LanguageCodeEnum["NaqNa"] = "NAQ_NA";
    LanguageCodeEnum["Nb"] = "NB";
    LanguageCodeEnum["NbNo"] = "NB_NO";
    LanguageCodeEnum["NbSj"] = "NB_SJ";
    LanguageCodeEnum["Nd"] = "ND";
    LanguageCodeEnum["Nds"] = "NDS";
    LanguageCodeEnum["NdsDe"] = "NDS_DE";
    LanguageCodeEnum["NdsNl"] = "NDS_NL";
    LanguageCodeEnum["NdZw"] = "ND_ZW";
    LanguageCodeEnum["Ne"] = "NE";
    LanguageCodeEnum["NeIn"] = "NE_IN";
    LanguageCodeEnum["NeNp"] = "NE_NP";
    LanguageCodeEnum["Nl"] = "NL";
    LanguageCodeEnum["NlAw"] = "NL_AW";
    LanguageCodeEnum["NlBe"] = "NL_BE";
    LanguageCodeEnum["NlBq"] = "NL_BQ";
    LanguageCodeEnum["NlCw"] = "NL_CW";
    LanguageCodeEnum["NlNl"] = "NL_NL";
    LanguageCodeEnum["NlSr"] = "NL_SR";
    LanguageCodeEnum["NlSx"] = "NL_SX";
    LanguageCodeEnum["Nmg"] = "NMG";
    LanguageCodeEnum["NmgCm"] = "NMG_CM";
    LanguageCodeEnum["Nn"] = "NN";
    LanguageCodeEnum["Nnh"] = "NNH";
    LanguageCodeEnum["NnhCm"] = "NNH_CM";
    LanguageCodeEnum["NnNo"] = "NN_NO";
    LanguageCodeEnum["Nus"] = "NUS";
    LanguageCodeEnum["NusSs"] = "NUS_SS";
    LanguageCodeEnum["Nyn"] = "NYN";
    LanguageCodeEnum["NynUg"] = "NYN_UG";
    LanguageCodeEnum["Om"] = "OM";
    LanguageCodeEnum["OmEt"] = "OM_ET";
    LanguageCodeEnum["OmKe"] = "OM_KE";
    LanguageCodeEnum["Or"] = "OR";
    LanguageCodeEnum["OrIn"] = "OR_IN";
    LanguageCodeEnum["Os"] = "OS";
    LanguageCodeEnum["OsGe"] = "OS_GE";
    LanguageCodeEnum["OsRu"] = "OS_RU";
    LanguageCodeEnum["Pa"] = "PA";
    LanguageCodeEnum["PaArab"] = "PA_ARAB";
    LanguageCodeEnum["PaArabPk"] = "PA_ARAB_PK";
    LanguageCodeEnum["PaGuru"] = "PA_GURU";
    LanguageCodeEnum["PaGuruIn"] = "PA_GURU_IN";
    LanguageCodeEnum["Pcm"] = "PCM";
    LanguageCodeEnum["PcmNg"] = "PCM_NG";
    LanguageCodeEnum["Pl"] = "PL";
    LanguageCodeEnum["PlPl"] = "PL_PL";
    LanguageCodeEnum["Prg"] = "PRG";
    LanguageCodeEnum["Ps"] = "PS";
    LanguageCodeEnum["PsAf"] = "PS_AF";
    LanguageCodeEnum["PsPk"] = "PS_PK";
    LanguageCodeEnum["Pt"] = "PT";
    LanguageCodeEnum["PtAo"] = "PT_AO";
    LanguageCodeEnum["PtBr"] = "PT_BR";
    LanguageCodeEnum["PtCh"] = "PT_CH";
    LanguageCodeEnum["PtCv"] = "PT_CV";
    LanguageCodeEnum["PtGq"] = "PT_GQ";
    LanguageCodeEnum["PtGw"] = "PT_GW";
    LanguageCodeEnum["PtLu"] = "PT_LU";
    LanguageCodeEnum["PtMo"] = "PT_MO";
    LanguageCodeEnum["PtMz"] = "PT_MZ";
    LanguageCodeEnum["PtPt"] = "PT_PT";
    LanguageCodeEnum["PtSt"] = "PT_ST";
    LanguageCodeEnum["PtTl"] = "PT_TL";
    LanguageCodeEnum["Qu"] = "QU";
    LanguageCodeEnum["QuBo"] = "QU_BO";
    LanguageCodeEnum["QuEc"] = "QU_EC";
    LanguageCodeEnum["QuPe"] = "QU_PE";
    LanguageCodeEnum["Rm"] = "RM";
    LanguageCodeEnum["RmCh"] = "RM_CH";
    LanguageCodeEnum["Rn"] = "RN";
    LanguageCodeEnum["RnBi"] = "RN_BI";
    LanguageCodeEnum["Ro"] = "RO";
    LanguageCodeEnum["Rof"] = "ROF";
    LanguageCodeEnum["RofTz"] = "ROF_TZ";
    LanguageCodeEnum["RoMd"] = "RO_MD";
    LanguageCodeEnum["RoRo"] = "RO_RO";
    LanguageCodeEnum["Ru"] = "RU";
    LanguageCodeEnum["RuBy"] = "RU_BY";
    LanguageCodeEnum["RuKg"] = "RU_KG";
    LanguageCodeEnum["RuKz"] = "RU_KZ";
    LanguageCodeEnum["RuMd"] = "RU_MD";
    LanguageCodeEnum["RuRu"] = "RU_RU";
    LanguageCodeEnum["RuUa"] = "RU_UA";
    LanguageCodeEnum["Rw"] = "RW";
    LanguageCodeEnum["Rwk"] = "RWK";
    LanguageCodeEnum["RwkTz"] = "RWK_TZ";
    LanguageCodeEnum["RwRw"] = "RW_RW";
    LanguageCodeEnum["Sah"] = "SAH";
    LanguageCodeEnum["SahRu"] = "SAH_RU";
    LanguageCodeEnum["Saq"] = "SAQ";
    LanguageCodeEnum["SaqKe"] = "SAQ_KE";
    LanguageCodeEnum["Sat"] = "SAT";
    LanguageCodeEnum["SatOlck"] = "SAT_OLCK";
    LanguageCodeEnum["SatOlckIn"] = "SAT_OLCK_IN";
    LanguageCodeEnum["Sbp"] = "SBP";
    LanguageCodeEnum["SbpTz"] = "SBP_TZ";
    LanguageCodeEnum["Sd"] = "SD";
    LanguageCodeEnum["SdArab"] = "SD_ARAB";
    LanguageCodeEnum["SdArabPk"] = "SD_ARAB_PK";
    LanguageCodeEnum["SdDeva"] = "SD_DEVA";
    LanguageCodeEnum["SdDevaIn"] = "SD_DEVA_IN";
    LanguageCodeEnum["Se"] = "SE";
    LanguageCodeEnum["Seh"] = "SEH";
    LanguageCodeEnum["SehMz"] = "SEH_MZ";
    LanguageCodeEnum["Ses"] = "SES";
    LanguageCodeEnum["SesMl"] = "SES_ML";
    LanguageCodeEnum["SeFi"] = "SE_FI";
    LanguageCodeEnum["SeNo"] = "SE_NO";
    LanguageCodeEnum["SeSe"] = "SE_SE";
    LanguageCodeEnum["Sg"] = "SG";
    LanguageCodeEnum["SgCf"] = "SG_CF";
    LanguageCodeEnum["Shi"] = "SHI";
    LanguageCodeEnum["ShiLatn"] = "SHI_LATN";
    LanguageCodeEnum["ShiLatnMa"] = "SHI_LATN_MA";
    LanguageCodeEnum["ShiTfng"] = "SHI_TFNG";
    LanguageCodeEnum["ShiTfngMa"] = "SHI_TFNG_MA";
    LanguageCodeEnum["Si"] = "SI";
    LanguageCodeEnum["SiLk"] = "SI_LK";
    LanguageCodeEnum["Sk"] = "SK";
    LanguageCodeEnum["SkSk"] = "SK_SK";
    LanguageCodeEnum["Sl"] = "SL";
    LanguageCodeEnum["SlSi"] = "SL_SI";
    LanguageCodeEnum["Smn"] = "SMN";
    LanguageCodeEnum["SmnFi"] = "SMN_FI";
    LanguageCodeEnum["Sn"] = "SN";
    LanguageCodeEnum["SnZw"] = "SN_ZW";
    LanguageCodeEnum["So"] = "SO";
    LanguageCodeEnum["SoDj"] = "SO_DJ";
    LanguageCodeEnum["SoEt"] = "SO_ET";
    LanguageCodeEnum["SoKe"] = "SO_KE";
    LanguageCodeEnum["SoSo"] = "SO_SO";
    LanguageCodeEnum["Sq"] = "SQ";
    LanguageCodeEnum["SqAl"] = "SQ_AL";
    LanguageCodeEnum["SqMk"] = "SQ_MK";
    LanguageCodeEnum["SqXk"] = "SQ_XK";
    LanguageCodeEnum["Sr"] = "SR";
    LanguageCodeEnum["SrCyrl"] = "SR_CYRL";
    LanguageCodeEnum["SrCyrlBa"] = "SR_CYRL_BA";
    LanguageCodeEnum["SrCyrlMe"] = "SR_CYRL_ME";
    LanguageCodeEnum["SrCyrlRs"] = "SR_CYRL_RS";
    LanguageCodeEnum["SrCyrlXk"] = "SR_CYRL_XK";
    LanguageCodeEnum["SrLatn"] = "SR_LATN";
    LanguageCodeEnum["SrLatnBa"] = "SR_LATN_BA";
    LanguageCodeEnum["SrLatnMe"] = "SR_LATN_ME";
    LanguageCodeEnum["SrLatnRs"] = "SR_LATN_RS";
    LanguageCodeEnum["SrLatnXk"] = "SR_LATN_XK";
    LanguageCodeEnum["Su"] = "SU";
    LanguageCodeEnum["SuLatn"] = "SU_LATN";
    LanguageCodeEnum["SuLatnId"] = "SU_LATN_ID";
    LanguageCodeEnum["Sv"] = "SV";
    LanguageCodeEnum["SvAx"] = "SV_AX";
    LanguageCodeEnum["SvFi"] = "SV_FI";
    LanguageCodeEnum["SvSe"] = "SV_SE";
    LanguageCodeEnum["Sw"] = "SW";
    LanguageCodeEnum["SwCd"] = "SW_CD";
    LanguageCodeEnum["SwKe"] = "SW_KE";
    LanguageCodeEnum["SwTz"] = "SW_TZ";
    LanguageCodeEnum["SwUg"] = "SW_UG";
    LanguageCodeEnum["Ta"] = "TA";
    LanguageCodeEnum["TaIn"] = "TA_IN";
    LanguageCodeEnum["TaLk"] = "TA_LK";
    LanguageCodeEnum["TaMy"] = "TA_MY";
    LanguageCodeEnum["TaSg"] = "TA_SG";
    LanguageCodeEnum["Te"] = "TE";
    LanguageCodeEnum["Teo"] = "TEO";
    LanguageCodeEnum["TeoKe"] = "TEO_KE";
    LanguageCodeEnum["TeoUg"] = "TEO_UG";
    LanguageCodeEnum["TeIn"] = "TE_IN";
    LanguageCodeEnum["Tg"] = "TG";
    LanguageCodeEnum["TgTj"] = "TG_TJ";
    LanguageCodeEnum["Th"] = "TH";
    LanguageCodeEnum["ThTh"] = "TH_TH";
    LanguageCodeEnum["Ti"] = "TI";
    LanguageCodeEnum["TiEr"] = "TI_ER";
    LanguageCodeEnum["TiEt"] = "TI_ET";
    LanguageCodeEnum["Tk"] = "TK";
    LanguageCodeEnum["TkTm"] = "TK_TM";
    LanguageCodeEnum["To"] = "TO";
    LanguageCodeEnum["ToTo"] = "TO_TO";
    LanguageCodeEnum["Tr"] = "TR";
    LanguageCodeEnum["TrCy"] = "TR_CY";
    LanguageCodeEnum["TrTr"] = "TR_TR";
    LanguageCodeEnum["Tt"] = "TT";
    LanguageCodeEnum["TtRu"] = "TT_RU";
    LanguageCodeEnum["Twq"] = "TWQ";
    LanguageCodeEnum["TwqNe"] = "TWQ_NE";
    LanguageCodeEnum["Tzm"] = "TZM";
    LanguageCodeEnum["TzmMa"] = "TZM_MA";
    LanguageCodeEnum["Ug"] = "UG";
    LanguageCodeEnum["UgCn"] = "UG_CN";
    LanguageCodeEnum["Uk"] = "UK";
    LanguageCodeEnum["UkUa"] = "UK_UA";
    LanguageCodeEnum["Ur"] = "UR";
    LanguageCodeEnum["UrIn"] = "UR_IN";
    LanguageCodeEnum["UrPk"] = "UR_PK";
    LanguageCodeEnum["Uz"] = "UZ";
    LanguageCodeEnum["UzArab"] = "UZ_ARAB";
    LanguageCodeEnum["UzArabAf"] = "UZ_ARAB_AF";
    LanguageCodeEnum["UzCyrl"] = "UZ_CYRL";
    LanguageCodeEnum["UzCyrlUz"] = "UZ_CYRL_UZ";
    LanguageCodeEnum["UzLatn"] = "UZ_LATN";
    LanguageCodeEnum["UzLatnUz"] = "UZ_LATN_UZ";
    LanguageCodeEnum["Vai"] = "VAI";
    LanguageCodeEnum["VaiLatn"] = "VAI_LATN";
    LanguageCodeEnum["VaiLatnLr"] = "VAI_LATN_LR";
    LanguageCodeEnum["VaiVaii"] = "VAI_VAII";
    LanguageCodeEnum["VaiVaiiLr"] = "VAI_VAII_LR";
    LanguageCodeEnum["Vi"] = "VI";
    LanguageCodeEnum["ViVn"] = "VI_VN";
    LanguageCodeEnum["Vo"] = "VO";
    LanguageCodeEnum["Vun"] = "VUN";
    LanguageCodeEnum["VunTz"] = "VUN_TZ";
    LanguageCodeEnum["Wae"] = "WAE";
    LanguageCodeEnum["WaeCh"] = "WAE_CH";
    LanguageCodeEnum["Wo"] = "WO";
    LanguageCodeEnum["WoSn"] = "WO_SN";
    LanguageCodeEnum["Xh"] = "XH";
    LanguageCodeEnum["XhZa"] = "XH_ZA";
    LanguageCodeEnum["Xog"] = "XOG";
    LanguageCodeEnum["XogUg"] = "XOG_UG";
    LanguageCodeEnum["Yav"] = "YAV";
    LanguageCodeEnum["YavCm"] = "YAV_CM";
    LanguageCodeEnum["Yi"] = "YI";
    LanguageCodeEnum["Yo"] = "YO";
    LanguageCodeEnum["YoBj"] = "YO_BJ";
    LanguageCodeEnum["YoNg"] = "YO_NG";
    LanguageCodeEnum["Yue"] = "YUE";
    LanguageCodeEnum["YueHans"] = "YUE_HANS";
    LanguageCodeEnum["YueHansCn"] = "YUE_HANS_CN";
    LanguageCodeEnum["YueHant"] = "YUE_HANT";
    LanguageCodeEnum["YueHantHk"] = "YUE_HANT_HK";
    LanguageCodeEnum["Zgh"] = "ZGH";
    LanguageCodeEnum["ZghMa"] = "ZGH_MA";
    LanguageCodeEnum["Zh"] = "ZH";
    LanguageCodeEnum["ZhHans"] = "ZH_HANS";
    LanguageCodeEnum["ZhHansCn"] = "ZH_HANS_CN";
    LanguageCodeEnum["ZhHansHk"] = "ZH_HANS_HK";
    LanguageCodeEnum["ZhHansMo"] = "ZH_HANS_MO";
    LanguageCodeEnum["ZhHansSg"] = "ZH_HANS_SG";
    LanguageCodeEnum["ZhHant"] = "ZH_HANT";
    LanguageCodeEnum["ZhHantHk"] = "ZH_HANT_HK";
    LanguageCodeEnum["ZhHantMo"] = "ZH_HANT_MO";
    LanguageCodeEnum["ZhHantTw"] = "ZH_HANT_TW";
    LanguageCodeEnum["Zu"] = "ZU";
    LanguageCodeEnum["ZuZa"] = "ZU_ZA";
})(LanguageCodeEnum1 || (LanguageCodeEnum1 = {
}));
var MeasurementUnitsEnum1;

(function(MeasurementUnitsEnum) {
    MeasurementUnitsEnum["AcreFt"] = "ACRE_FT";
    MeasurementUnitsEnum["AcreIn"] = "ACRE_IN";
    MeasurementUnitsEnum["Cm"] = "CM";
    MeasurementUnitsEnum["CubicCentimeter"] = "CUBIC_CENTIMETER";
    MeasurementUnitsEnum["CubicDecimeter"] = "CUBIC_DECIMETER";
    MeasurementUnitsEnum["CubicFoot"] = "CUBIC_FOOT";
    MeasurementUnitsEnum["CubicInch"] = "CUBIC_INCH";
    MeasurementUnitsEnum["CubicMeter"] = "CUBIC_METER";
    MeasurementUnitsEnum["CubicMillimeter"] = "CUBIC_MILLIMETER";
    MeasurementUnitsEnum["CubicYard"] = "CUBIC_YARD";
    MeasurementUnitsEnum["FlOz"] = "FL_OZ";
    MeasurementUnitsEnum["Ft"] = "FT";
    MeasurementUnitsEnum["G"] = "G";
    MeasurementUnitsEnum["Inch"] = "INCH";
    MeasurementUnitsEnum["Kg"] = "KG";
    MeasurementUnitsEnum["Km"] = "KM";
    MeasurementUnitsEnum["Lb"] = "LB";
    MeasurementUnitsEnum["Liter"] = "LITER";
    MeasurementUnitsEnum["M"] = "M";
    MeasurementUnitsEnum["Oz"] = "OZ";
    MeasurementUnitsEnum["Pint"] = "PINT";
    MeasurementUnitsEnum["Qt"] = "QT";
    MeasurementUnitsEnum["SqCm"] = "SQ_CM";
    MeasurementUnitsEnum["SqFt"] = "SQ_FT";
    MeasurementUnitsEnum["SqInch"] = "SQ_INCH";
    MeasurementUnitsEnum["SqKm"] = "SQ_KM";
    MeasurementUnitsEnum["SqM"] = "SQ_M";
    MeasurementUnitsEnum["SqYd"] = "SQ_YD";
    MeasurementUnitsEnum["Tonne"] = "TONNE";
    MeasurementUnitsEnum["Yd"] = "YD";
})(MeasurementUnitsEnum1 || (MeasurementUnitsEnum1 = {
}));
var MenuErrorCode1;

(function(MenuErrorCode) {
    MenuErrorCode["CannotAssignNode"] = "CANNOT_ASSIGN_NODE";
    MenuErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    MenuErrorCode["Invalid"] = "INVALID";
    MenuErrorCode["InvalidMenuItem"] = "INVALID_MENU_ITEM";
    MenuErrorCode["NotFound"] = "NOT_FOUND";
    MenuErrorCode["NoMenuItemProvided"] = "NO_MENU_ITEM_PROVIDED";
    MenuErrorCode["Required"] = "REQUIRED";
    MenuErrorCode["TooManyMenuItems"] = "TOO_MANY_MENU_ITEMS";
    MenuErrorCode["Unique"] = "UNIQUE";
})(MenuErrorCode1 || (MenuErrorCode1 = {
}));
var MenuItemsSortField1;

(function(MenuItemsSortField) {
    MenuItemsSortField["Name"] = "NAME";
})(MenuItemsSortField1 || (MenuItemsSortField1 = {
}));
var MenuSortField1;

(function(MenuSortField) {
    MenuSortField["ItemsCount"] = "ITEMS_COUNT";
    MenuSortField["Name"] = "NAME";
})(MenuSortField1 || (MenuSortField1 = {
}));
var MetadataErrorCode1;

(function(MetadataErrorCode) {
    MetadataErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    MetadataErrorCode["Invalid"] = "INVALID";
    MetadataErrorCode["NotFound"] = "NOT_FOUND";
    MetadataErrorCode["Required"] = "REQUIRED";
})(MetadataErrorCode1 || (MetadataErrorCode1 = {
}));
var NavigationType1;

(function(NavigationType) {
    NavigationType["Main"] = "MAIN";
    NavigationType["Secondary"] = "SECONDARY";
})(NavigationType1 || (NavigationType1 = {
}));
var OrderAction1;

(function(OrderAction) {
    OrderAction["Capture"] = "CAPTURE";
    OrderAction["MarkAsPaid"] = "MARK_AS_PAID";
    OrderAction["Refund"] = "REFUND";
    OrderAction["Void"] = "VOID";
})(OrderAction1 || (OrderAction1 = {
}));
var OrderDirection1;

(function(OrderDirection) {
    OrderDirection["Asc"] = "ASC";
    OrderDirection["Desc"] = "DESC";
})(OrderDirection1 || (OrderDirection1 = {
}));
var OrderDiscountType1;

(function(OrderDiscountType) {
    OrderDiscountType["Manual"] = "MANUAL";
    OrderDiscountType["Voucher"] = "VOUCHER";
})(OrderDiscountType1 || (OrderDiscountType1 = {
}));
var OrderErrorCode1;

(function(OrderErrorCode) {
    OrderErrorCode["BillingAddressNotSet"] = "BILLING_ADDRESS_NOT_SET";
    OrderErrorCode["CannotCancelFulfillment"] = "CANNOT_CANCEL_FULFILLMENT";
    OrderErrorCode["CannotCancelOrder"] = "CANNOT_CANCEL_ORDER";
    OrderErrorCode["CannotDelete"] = "CANNOT_DELETE";
    OrderErrorCode["CannotDiscount"] = "CANNOT_DISCOUNT";
    OrderErrorCode["CannotRefund"] = "CANNOT_REFUND";
    OrderErrorCode["CaptureInactivePayment"] = "CAPTURE_INACTIVE_PAYMENT";
    OrderErrorCode["ChannelInactive"] = "CHANNEL_INACTIVE";
    OrderErrorCode["DuplicatedInputItem"] = "DUPLICATED_INPUT_ITEM";
    OrderErrorCode["FulfillOrderLine"] = "FULFILL_ORDER_LINE";
    OrderErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    OrderErrorCode["InsufficientStock"] = "INSUFFICIENT_STOCK";
    OrderErrorCode["Invalid"] = "INVALID";
    OrderErrorCode["InvalidQuantity"] = "INVALID_QUANTITY";
    OrderErrorCode["NotAvailableInChannel"] = "NOT_AVAILABLE_IN_CHANNEL";
    OrderErrorCode["NotEditable"] = "NOT_EDITABLE";
    OrderErrorCode["NotFound"] = "NOT_FOUND";
    OrderErrorCode["OrderNoShippingAddress"] = "ORDER_NO_SHIPPING_ADDRESS";
    OrderErrorCode["PaymentError"] = "PAYMENT_ERROR";
    OrderErrorCode["PaymentMissing"] = "PAYMENT_MISSING";
    OrderErrorCode["ProductNotPublished"] = "PRODUCT_NOT_PUBLISHED";
    OrderErrorCode["ProductUnavailableForPurchase"] = "PRODUCT_UNAVAILABLE_FOR_PURCHASE";
    OrderErrorCode["Required"] = "REQUIRED";
    OrderErrorCode["ShippingMethodNotApplicable"] = "SHIPPING_METHOD_NOT_APPLICABLE";
    OrderErrorCode["ShippingMethodRequired"] = "SHIPPING_METHOD_REQUIRED";
    OrderErrorCode["TaxError"] = "TAX_ERROR";
    OrderErrorCode["Unique"] = "UNIQUE";
    OrderErrorCode["VoidInactivePayment"] = "VOID_INACTIVE_PAYMENT";
    OrderErrorCode["ZeroQuantity"] = "ZERO_QUANTITY";
})(OrderErrorCode1 || (OrderErrorCode1 = {
}));
var OrderEventsEmailsEnum1;

(function(OrderEventsEmailsEnum) {
    OrderEventsEmailsEnum["Confirmed"] = "CONFIRMED";
    OrderEventsEmailsEnum["DigitalLinks"] = "DIGITAL_LINKS";
    OrderEventsEmailsEnum["FulfillmentConfirmation"] = "FULFILLMENT_CONFIRMATION";
    OrderEventsEmailsEnum["OrderCancel"] = "ORDER_CANCEL";
    OrderEventsEmailsEnum["OrderConfirmation"] = "ORDER_CONFIRMATION";
    OrderEventsEmailsEnum["OrderRefund"] = "ORDER_REFUND";
    OrderEventsEmailsEnum["PaymentConfirmation"] = "PAYMENT_CONFIRMATION";
    OrderEventsEmailsEnum["ShippingConfirmation"] = "SHIPPING_CONFIRMATION";
    OrderEventsEmailsEnum["TrackingUpdated"] = "TRACKING_UPDATED";
})(OrderEventsEmailsEnum1 || (OrderEventsEmailsEnum1 = {
}));
var OrderEventsEnum1;

(function(OrderEventsEnum) {
    OrderEventsEnum["AddedProducts"] = "ADDED_PRODUCTS";
    OrderEventsEnum["Canceled"] = "CANCELED";
    OrderEventsEnum["Confirmed"] = "CONFIRMED";
    OrderEventsEnum["DraftCreated"] = "DRAFT_CREATED";
    OrderEventsEnum["DraftCreatedFromReplace"] = "DRAFT_CREATED_FROM_REPLACE";
    OrderEventsEnum["EmailSent"] = "EMAIL_SENT";
    OrderEventsEnum["ExternalServiceNotification"] = "EXTERNAL_SERVICE_NOTIFICATION";
    OrderEventsEnum["FulfillmentCanceled"] = "FULFILLMENT_CANCELED";
    OrderEventsEnum["FulfillmentFulfilledItems"] = "FULFILLMENT_FULFILLED_ITEMS";
    OrderEventsEnum["FulfillmentRefunded"] = "FULFILLMENT_REFUNDED";
    OrderEventsEnum["FulfillmentReplaced"] = "FULFILLMENT_REPLACED";
    OrderEventsEnum["FulfillmentRestockedItems"] = "FULFILLMENT_RESTOCKED_ITEMS";
    OrderEventsEnum["FulfillmentReturned"] = "FULFILLMENT_RETURNED";
    OrderEventsEnum["InvoiceGenerated"] = "INVOICE_GENERATED";
    OrderEventsEnum["InvoiceRequested"] = "INVOICE_REQUESTED";
    OrderEventsEnum["InvoiceSent"] = "INVOICE_SENT";
    OrderEventsEnum["InvoiceUpdated"] = "INVOICE_UPDATED";
    OrderEventsEnum["NoteAdded"] = "NOTE_ADDED";
    OrderEventsEnum["OrderDiscountAdded"] = "ORDER_DISCOUNT_ADDED";
    OrderEventsEnum["OrderDiscountAutomaticallyUpdated"] = "ORDER_DISCOUNT_AUTOMATICALLY_UPDATED";
    OrderEventsEnum["OrderDiscountDeleted"] = "ORDER_DISCOUNT_DELETED";
    OrderEventsEnum["OrderDiscountUpdated"] = "ORDER_DISCOUNT_UPDATED";
    OrderEventsEnum["OrderFullyPaid"] = "ORDER_FULLY_PAID";
    OrderEventsEnum["OrderLineDiscountRemoved"] = "ORDER_LINE_DISCOUNT_REMOVED";
    OrderEventsEnum["OrderLineDiscountUpdated"] = "ORDER_LINE_DISCOUNT_UPDATED";
    OrderEventsEnum["OrderLineProductDeleted"] = "ORDER_LINE_PRODUCT_DELETED";
    OrderEventsEnum["OrderLineVariantDeleted"] = "ORDER_LINE_VARIANT_DELETED";
    OrderEventsEnum["OrderMarkedAsPaid"] = "ORDER_MARKED_AS_PAID";
    OrderEventsEnum["OrderReplacementCreated"] = "ORDER_REPLACEMENT_CREATED";
    OrderEventsEnum["Other"] = "OTHER";
    OrderEventsEnum["OversoldItems"] = "OVERSOLD_ITEMS";
    OrderEventsEnum["PaymentAuthorized"] = "PAYMENT_AUTHORIZED";
    OrderEventsEnum["PaymentCaptured"] = "PAYMENT_CAPTURED";
    OrderEventsEnum["PaymentFailed"] = "PAYMENT_FAILED";
    OrderEventsEnum["PaymentRefunded"] = "PAYMENT_REFUNDED";
    OrderEventsEnum["PaymentVoided"] = "PAYMENT_VOIDED";
    OrderEventsEnum["Placed"] = "PLACED";
    OrderEventsEnum["PlacedFromDraft"] = "PLACED_FROM_DRAFT";
    OrderEventsEnum["RemovedProducts"] = "REMOVED_PRODUCTS";
    OrderEventsEnum["TrackingUpdated"] = "TRACKING_UPDATED";
    OrderEventsEnum["UpdatedAddress"] = "UPDATED_ADDRESS";
})(OrderEventsEnum1 || (OrderEventsEnum1 = {
}));
var OrderOriginEnum1;

(function(OrderOriginEnum) {
    OrderOriginEnum["Checkout"] = "CHECKOUT";
    OrderOriginEnum["Draft"] = "DRAFT";
    OrderOriginEnum["Reissue"] = "REISSUE";
})(OrderOriginEnum1 || (OrderOriginEnum1 = {
}));
var OrderSettingsErrorCode1;

(function(OrderSettingsErrorCode) {
    OrderSettingsErrorCode["Invalid"] = "INVALID";
})(OrderSettingsErrorCode1 || (OrderSettingsErrorCode1 = {
}));
var OrderSortField1;

(function(OrderSortField) {
    OrderSortField["CreationDate"] = "CREATION_DATE";
    OrderSortField["Customer"] = "CUSTOMER";
    OrderSortField["FulfillmentStatus"] = "FULFILLMENT_STATUS";
    OrderSortField["Number"] = "NUMBER";
    OrderSortField["Payment"] = "PAYMENT";
})(OrderSortField1 || (OrderSortField1 = {
}));
var OrderStatus1;

(function(OrderStatus) {
    OrderStatus["Canceled"] = "CANCELED";
    OrderStatus["Draft"] = "DRAFT";
    OrderStatus["Fulfilled"] = "FULFILLED";
    OrderStatus["PartiallyFulfilled"] = "PARTIALLY_FULFILLED";
    OrderStatus["PartiallyReturned"] = "PARTIALLY_RETURNED";
    OrderStatus["Returned"] = "RETURNED";
    OrderStatus["Unconfirmed"] = "UNCONFIRMED";
    OrderStatus["Unfulfilled"] = "UNFULFILLED";
})(OrderStatus1 || (OrderStatus1 = {
}));
var OrderStatusFilter1;

(function(OrderStatusFilter) {
    OrderStatusFilter["Canceled"] = "CANCELED";
    OrderStatusFilter["Fulfilled"] = "FULFILLED";
    OrderStatusFilter["PartiallyFulfilled"] = "PARTIALLY_FULFILLED";
    OrderStatusFilter["ReadyToCapture"] = "READY_TO_CAPTURE";
    OrderStatusFilter["ReadyToFulfill"] = "READY_TO_FULFILL";
    OrderStatusFilter["Unconfirmed"] = "UNCONFIRMED";
    OrderStatusFilter["Unfulfilled"] = "UNFULFILLED";
})(OrderStatusFilter1 || (OrderStatusFilter1 = {
}));
var PageErrorCode1;

(function(PageErrorCode) {
    PageErrorCode["AttributeAlreadyAssigned"] = "ATTRIBUTE_ALREADY_ASSIGNED";
    PageErrorCode["DuplicatedInputItem"] = "DUPLICATED_INPUT_ITEM";
    PageErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    PageErrorCode["Invalid"] = "INVALID";
    PageErrorCode["NotFound"] = "NOT_FOUND";
    PageErrorCode["Required"] = "REQUIRED";
    PageErrorCode["Unique"] = "UNIQUE";
})(PageErrorCode1 || (PageErrorCode1 = {
}));
var PageSortField1;

(function(PageSortField) {
    PageSortField["CreationDate"] = "CREATION_DATE";
    PageSortField["PublicationDate"] = "PUBLICATION_DATE";
    PageSortField["Slug"] = "SLUG";
    PageSortField["Title"] = "TITLE";
    PageSortField["Visibility"] = "VISIBILITY";
})(PageSortField1 || (PageSortField1 = {
}));
var PageTypeSortField1;

(function(PageTypeSortField) {
    PageTypeSortField["Name"] = "NAME";
    PageTypeSortField["Slug"] = "SLUG";
})(PageTypeSortField1 || (PageTypeSortField1 = {
}));
var PaymentChargeStatusEnum1;

(function(PaymentChargeStatusEnum) {
    PaymentChargeStatusEnum["Cancelled"] = "CANCELLED";
    PaymentChargeStatusEnum["FullyCharged"] = "FULLY_CHARGED";
    PaymentChargeStatusEnum["FullyRefunded"] = "FULLY_REFUNDED";
    PaymentChargeStatusEnum["NotCharged"] = "NOT_CHARGED";
    PaymentChargeStatusEnum["PartiallyCharged"] = "PARTIALLY_CHARGED";
    PaymentChargeStatusEnum["PartiallyRefunded"] = "PARTIALLY_REFUNDED";
    PaymentChargeStatusEnum["Pending"] = "PENDING";
    PaymentChargeStatusEnum["Refused"] = "REFUSED";
})(PaymentChargeStatusEnum1 || (PaymentChargeStatusEnum1 = {
}));
var PaymentErrorCode1;

(function(PaymentErrorCode) {
    PaymentErrorCode["BillingAddressNotSet"] = "BILLING_ADDRESS_NOT_SET";
    PaymentErrorCode["ChannelInactive"] = "CHANNEL_INACTIVE";
    PaymentErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    PaymentErrorCode["Invalid"] = "INVALID";
    PaymentErrorCode["InvalidShippingMethod"] = "INVALID_SHIPPING_METHOD";
    PaymentErrorCode["NotFound"] = "NOT_FOUND";
    PaymentErrorCode["NotSupportedGateway"] = "NOT_SUPPORTED_GATEWAY";
    PaymentErrorCode["PartialPaymentNotAllowed"] = "PARTIAL_PAYMENT_NOT_ALLOWED";
    PaymentErrorCode["PaymentError"] = "PAYMENT_ERROR";
    PaymentErrorCode["Required"] = "REQUIRED";
    PaymentErrorCode["ShippingAddressNotSet"] = "SHIPPING_ADDRESS_NOT_SET";
    PaymentErrorCode["ShippingMethodNotSet"] = "SHIPPING_METHOD_NOT_SET";
    PaymentErrorCode["Unique"] = "UNIQUE";
})(PaymentErrorCode1 || (PaymentErrorCode1 = {
}));
var PermissionEnum1;

(function(PermissionEnum) {
    PermissionEnum["HandlePayments"] = "HANDLE_PAYMENTS";
    PermissionEnum["ImpersonateUser"] = "IMPERSONATE_USER";
    PermissionEnum["ManageApps"] = "MANAGE_APPS";
    PermissionEnum["ManageChannels"] = "MANAGE_CHANNELS";
    PermissionEnum["ManageCheckouts"] = "MANAGE_CHECKOUTS";
    PermissionEnum["ManageDiscounts"] = "MANAGE_DISCOUNTS";
    PermissionEnum["ManageGiftCard"] = "MANAGE_GIFT_CARD";
    PermissionEnum["ManageMenus"] = "MANAGE_MENUS";
    PermissionEnum["ManageOrders"] = "MANAGE_ORDERS";
    PermissionEnum["ManagePages"] = "MANAGE_PAGES";
    PermissionEnum["ManagePageTypesAndAttributes"] = "MANAGE_PAGE_TYPES_AND_ATTRIBUTES";
    PermissionEnum["ManagePlugins"] = "MANAGE_PLUGINS";
    PermissionEnum["ManageProducts"] = "MANAGE_PRODUCTS";
    PermissionEnum["ManageProductTypesAndAttributes"] = "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES";
    PermissionEnum["ManageSettings"] = "MANAGE_SETTINGS";
    PermissionEnum["ManageShipping"] = "MANAGE_SHIPPING";
    PermissionEnum["ManageStaff"] = "MANAGE_STAFF";
    PermissionEnum["ManageTranslations"] = "MANAGE_TRANSLATIONS";
    PermissionEnum["ManageUsers"] = "MANAGE_USERS";
})(PermissionEnum1 || (PermissionEnum1 = {
}));
var PermissionGroupErrorCode1;

(function(PermissionGroupErrorCode) {
    PermissionGroupErrorCode["AssignNonStaffMember"] = "ASSIGN_NON_STAFF_MEMBER";
    PermissionGroupErrorCode["CannotRemoveFromLastGroup"] = "CANNOT_REMOVE_FROM_LAST_GROUP";
    PermissionGroupErrorCode["DuplicatedInputItem"] = "DUPLICATED_INPUT_ITEM";
    PermissionGroupErrorCode["LeftNotManageablePermission"] = "LEFT_NOT_MANAGEABLE_PERMISSION";
    PermissionGroupErrorCode["OutOfScopePermission"] = "OUT_OF_SCOPE_PERMISSION";
    PermissionGroupErrorCode["OutOfScopeUser"] = "OUT_OF_SCOPE_USER";
    PermissionGroupErrorCode["Required"] = "REQUIRED";
    PermissionGroupErrorCode["Unique"] = "UNIQUE";
})(PermissionGroupErrorCode1 || (PermissionGroupErrorCode1 = {
}));
var PermissionGroupSortField1;

(function(PermissionGroupSortField) {
    PermissionGroupSortField["Name"] = "NAME";
})(PermissionGroupSortField1 || (PermissionGroupSortField1 = {
}));
var PluginConfigurationType1;

(function(PluginConfigurationType) {
    PluginConfigurationType["Global"] = "GLOBAL";
    PluginConfigurationType["PerChannel"] = "PER_CHANNEL";
})(PluginConfigurationType1 || (PluginConfigurationType1 = {
}));
var PluginErrorCode1;

(function(PluginErrorCode) {
    PluginErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    PluginErrorCode["Invalid"] = "INVALID";
    PluginErrorCode["NotFound"] = "NOT_FOUND";
    PluginErrorCode["PluginMisconfigured"] = "PLUGIN_MISCONFIGURED";
    PluginErrorCode["Required"] = "REQUIRED";
    PluginErrorCode["Unique"] = "UNIQUE";
})(PluginErrorCode1 || (PluginErrorCode1 = {
}));
var PluginSortField1;

(function(PluginSortField) {
    PluginSortField["IsActive"] = "IS_ACTIVE";
    PluginSortField["Name"] = "NAME";
})(PluginSortField1 || (PluginSortField1 = {
}));
var PostalCodeRuleInclusionTypeEnum1;

(function(PostalCodeRuleInclusionTypeEnum) {
    PostalCodeRuleInclusionTypeEnum["Exclude"] = "EXCLUDE";
    PostalCodeRuleInclusionTypeEnum["Include"] = "INCLUDE";
})(PostalCodeRuleInclusionTypeEnum1 || (PostalCodeRuleInclusionTypeEnum1 = {
}));
var ProductAttributeType1;

(function(ProductAttributeType) {
    ProductAttributeType["Product"] = "PRODUCT";
    ProductAttributeType["Variant"] = "VARIANT";
})(ProductAttributeType1 || (ProductAttributeType1 = {
}));
var ProductErrorCode1;

(function(ProductErrorCode) {
    ProductErrorCode["AlreadyExists"] = "ALREADY_EXISTS";
    ProductErrorCode["AttributeAlreadyAssigned"] = "ATTRIBUTE_ALREADY_ASSIGNED";
    ProductErrorCode["AttributeCannotBeAssigned"] = "ATTRIBUTE_CANNOT_BE_ASSIGNED";
    ProductErrorCode["AttributeVariantsDisabled"] = "ATTRIBUTE_VARIANTS_DISABLED";
    ProductErrorCode["CannotManageProductWithoutVariant"] = "CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT";
    ProductErrorCode["DuplicatedInputItem"] = "DUPLICATED_INPUT_ITEM";
    ProductErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    ProductErrorCode["Invalid"] = "INVALID";
    ProductErrorCode["NotFound"] = "NOT_FOUND";
    ProductErrorCode["NotProductsImage"] = "NOT_PRODUCTS_IMAGE";
    ProductErrorCode["NotProductsVariant"] = "NOT_PRODUCTS_VARIANT";
    ProductErrorCode["ProductNotAssignedToChannel"] = "PRODUCT_NOT_ASSIGNED_TO_CHANNEL";
    ProductErrorCode["ProductWithoutCategory"] = "PRODUCT_WITHOUT_CATEGORY";
    ProductErrorCode["Required"] = "REQUIRED";
    ProductErrorCode["Unique"] = "UNIQUE";
    ProductErrorCode["UnsupportedMediaProvider"] = "UNSUPPORTED_MEDIA_PROVIDER";
    ProductErrorCode["VariantNoDigitalContent"] = "VARIANT_NO_DIGITAL_CONTENT";
})(ProductErrorCode1 || (ProductErrorCode1 = {
}));
var ProductFieldEnum1;

(function(ProductFieldEnum) {
    ProductFieldEnum["Category"] = "CATEGORY";
    ProductFieldEnum["ChargeTaxes"] = "CHARGE_TAXES";
    ProductFieldEnum["Collections"] = "COLLECTIONS";
    ProductFieldEnum["Description"] = "DESCRIPTION";
    ProductFieldEnum["Name"] = "NAME";
    ProductFieldEnum["ProductMedia"] = "PRODUCT_MEDIA";
    ProductFieldEnum["ProductType"] = "PRODUCT_TYPE";
    ProductFieldEnum["ProductWeight"] = "PRODUCT_WEIGHT";
    ProductFieldEnum["VariantMedia"] = "VARIANT_MEDIA";
    ProductFieldEnum["VariantSku"] = "VARIANT_SKU";
    ProductFieldEnum["VariantWeight"] = "VARIANT_WEIGHT";
})(ProductFieldEnum1 || (ProductFieldEnum1 = {
}));
var ProductMediaType1;

(function(ProductMediaType) {
    ProductMediaType["Image"] = "IMAGE";
    ProductMediaType["Video"] = "VIDEO";
})(ProductMediaType1 || (ProductMediaType1 = {
}));
var ProductOrderField1;

(function(ProductOrderField) {
    ProductOrderField["Collection"] = "COLLECTION";
    ProductOrderField["Date"] = "DATE";
    ProductOrderField["MinimalPrice"] = "MINIMAL_PRICE";
    ProductOrderField["Name"] = "NAME";
    ProductOrderField["Price"] = "PRICE";
    ProductOrderField["PublicationDate"] = "PUBLICATION_DATE";
    ProductOrderField["Published"] = "PUBLISHED";
    ProductOrderField["Rank"] = "RANK";
    ProductOrderField["Rating"] = "RATING";
    ProductOrderField["Type"] = "TYPE";
})(ProductOrderField1 || (ProductOrderField1 = {
}));
var ProductTypeConfigurable1;

(function(ProductTypeConfigurable) {
    ProductTypeConfigurable["Configurable"] = "CONFIGURABLE";
    ProductTypeConfigurable["Simple"] = "SIMPLE";
})(ProductTypeConfigurable1 || (ProductTypeConfigurable1 = {
}));
var ProductTypeEnum1;

(function(ProductTypeEnum) {
    ProductTypeEnum["Digital"] = "DIGITAL";
    ProductTypeEnum["Shippable"] = "SHIPPABLE";
})(ProductTypeEnum1 || (ProductTypeEnum1 = {
}));
var ProductTypeSortField1;

(function(ProductTypeSortField) {
    ProductTypeSortField["Digital"] = "DIGITAL";
    ProductTypeSortField["Name"] = "NAME";
    ProductTypeSortField["ShippingRequired"] = "SHIPPING_REQUIRED";
})(ProductTypeSortField1 || (ProductTypeSortField1 = {
}));
var ReportingPeriod1;

(function(ReportingPeriod) {
    ReportingPeriod["ThisMonth"] = "THIS_MONTH";
    ReportingPeriod["Today"] = "TODAY";
})(ReportingPeriod1 || (ReportingPeriod1 = {
}));
var SaleSortField1;

(function(SaleSortField) {
    SaleSortField["EndDate"] = "END_DATE";
    SaleSortField["Name"] = "NAME";
    SaleSortField["StartDate"] = "START_DATE";
    SaleSortField["Type"] = "TYPE";
    SaleSortField["Value"] = "VALUE";
})(SaleSortField1 || (SaleSortField1 = {
}));
var SaleType1;

(function(SaleType) {
    SaleType["Fixed"] = "FIXED";
    SaleType["Percentage"] = "PERCENTAGE";
})(SaleType1 || (SaleType1 = {
}));
var ShippingErrorCode1;

(function(ShippingErrorCode) {
    ShippingErrorCode["AlreadyExists"] = "ALREADY_EXISTS";
    ShippingErrorCode["DuplicatedInputItem"] = "DUPLICATED_INPUT_ITEM";
    ShippingErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    ShippingErrorCode["Invalid"] = "INVALID";
    ShippingErrorCode["MaxLessThanMin"] = "MAX_LESS_THAN_MIN";
    ShippingErrorCode["NotFound"] = "NOT_FOUND";
    ShippingErrorCode["Required"] = "REQUIRED";
    ShippingErrorCode["Unique"] = "UNIQUE";
})(ShippingErrorCode1 || (ShippingErrorCode1 = {
}));
var ShippingMethodTypeEnum1;

(function(ShippingMethodTypeEnum) {
    ShippingMethodTypeEnum["Price"] = "PRICE";
    ShippingMethodTypeEnum["Weight"] = "WEIGHT";
})(ShippingMethodTypeEnum1 || (ShippingMethodTypeEnum1 = {
}));
var ShopErrorCode1;

(function(ShopErrorCode) {
    ShopErrorCode["AlreadyExists"] = "ALREADY_EXISTS";
    ShopErrorCode["CannotFetchTaxRates"] = "CANNOT_FETCH_TAX_RATES";
    ShopErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    ShopErrorCode["Invalid"] = "INVALID";
    ShopErrorCode["NotFound"] = "NOT_FOUND";
    ShopErrorCode["Required"] = "REQUIRED";
    ShopErrorCode["Unique"] = "UNIQUE";
})(ShopErrorCode1 || (ShopErrorCode1 = {
}));
var StaffMemberStatus1;

(function(StaffMemberStatus) {
    StaffMemberStatus["Active"] = "ACTIVE";
    StaffMemberStatus["Deactivated"] = "DEACTIVATED";
})(StaffMemberStatus1 || (StaffMemberStatus1 = {
}));
var StockAvailability1;

(function(StockAvailability) {
    StockAvailability["InStock"] = "IN_STOCK";
    StockAvailability["OutOfStock"] = "OUT_OF_STOCK";
})(StockAvailability1 || (StockAvailability1 = {
}));
var StockErrorCode1;

(function(StockErrorCode) {
    StockErrorCode["AlreadyExists"] = "ALREADY_EXISTS";
    StockErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    StockErrorCode["Invalid"] = "INVALID";
    StockErrorCode["NotFound"] = "NOT_FOUND";
    StockErrorCode["Required"] = "REQUIRED";
    StockErrorCode["Unique"] = "UNIQUE";
})(StockErrorCode1 || (StockErrorCode1 = {
}));
var TransactionKind1;

(function(TransactionKind) {
    TransactionKind["ActionToConfirm"] = "ACTION_TO_CONFIRM";
    TransactionKind["Auth"] = "AUTH";
    TransactionKind["Cancel"] = "CANCEL";
    TransactionKind["Capture"] = "CAPTURE";
    TransactionKind["Confirm"] = "CONFIRM";
    TransactionKind["External"] = "EXTERNAL";
    TransactionKind["Pending"] = "PENDING";
    TransactionKind["Refund"] = "REFUND";
    TransactionKind["RefundOngoing"] = "REFUND_ONGOING";
    TransactionKind["Void"] = "VOID";
})(TransactionKind1 || (TransactionKind1 = {
}));
var TranslatableKinds1;

(function(TranslatableKinds) {
    TranslatableKinds["Attribute"] = "ATTRIBUTE";
    TranslatableKinds["AttributeValue"] = "ATTRIBUTE_VALUE";
    TranslatableKinds["Category"] = "CATEGORY";
    TranslatableKinds["Collection"] = "COLLECTION";
    TranslatableKinds["MenuItem"] = "MENU_ITEM";
    TranslatableKinds["Page"] = "PAGE";
    TranslatableKinds["Product"] = "PRODUCT";
    TranslatableKinds["Sale"] = "SALE";
    TranslatableKinds["ShippingMethod"] = "SHIPPING_METHOD";
    TranslatableKinds["Variant"] = "VARIANT";
    TranslatableKinds["Voucher"] = "VOUCHER";
})(TranslatableKinds1 || (TranslatableKinds1 = {
}));
var TranslationErrorCode1;

(function(TranslationErrorCode) {
    TranslationErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    TranslationErrorCode["NotFound"] = "NOT_FOUND";
    TranslationErrorCode["Required"] = "REQUIRED";
})(TranslationErrorCode1 || (TranslationErrorCode1 = {
}));
var UploadErrorCode1;

(function(UploadErrorCode) {
    UploadErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
})(UploadErrorCode1 || (UploadErrorCode1 = {
}));
var UserSortField1;

(function(UserSortField) {
    UserSortField["Email"] = "EMAIL";
    UserSortField["FirstName"] = "FIRST_NAME";
    UserSortField["LastName"] = "LAST_NAME";
    UserSortField["OrderCount"] = "ORDER_COUNT";
})(UserSortField1 || (UserSortField1 = {
}));
var VariantAttributeScope1;

(function(VariantAttributeScope) {
    VariantAttributeScope["All"] = "ALL";
    VariantAttributeScope["NotVariantSelection"] = "NOT_VARIANT_SELECTION";
    VariantAttributeScope["VariantSelection"] = "VARIANT_SELECTION";
})(VariantAttributeScope1 || (VariantAttributeScope1 = {
}));
var VolumeUnitsEnum1;

(function(VolumeUnitsEnum) {
    VolumeUnitsEnum["AcreFt"] = "ACRE_FT";
    VolumeUnitsEnum["AcreIn"] = "ACRE_IN";
    VolumeUnitsEnum["CubicCentimeter"] = "CUBIC_CENTIMETER";
    VolumeUnitsEnum["CubicDecimeter"] = "CUBIC_DECIMETER";
    VolumeUnitsEnum["CubicFoot"] = "CUBIC_FOOT";
    VolumeUnitsEnum["CubicInch"] = "CUBIC_INCH";
    VolumeUnitsEnum["CubicMeter"] = "CUBIC_METER";
    VolumeUnitsEnum["CubicMillimeter"] = "CUBIC_MILLIMETER";
    VolumeUnitsEnum["CubicYard"] = "CUBIC_YARD";
    VolumeUnitsEnum["FlOz"] = "FL_OZ";
    VolumeUnitsEnum["Liter"] = "LITER";
    VolumeUnitsEnum["Pint"] = "PINT";
    VolumeUnitsEnum["Qt"] = "QT";
})(VolumeUnitsEnum1 || (VolumeUnitsEnum1 = {
}));
var VoucherDiscountType1;

(function(VoucherDiscountType) {
    VoucherDiscountType["Fixed"] = "FIXED";
    VoucherDiscountType["Percentage"] = "PERCENTAGE";
    VoucherDiscountType["Shipping"] = "SHIPPING";
})(VoucherDiscountType1 || (VoucherDiscountType1 = {
}));
var VoucherSortField1;

(function(VoucherSortField) {
    VoucherSortField["Code"] = "CODE";
    VoucherSortField["EndDate"] = "END_DATE";
    VoucherSortField["MinimumSpentAmount"] = "MINIMUM_SPENT_AMOUNT";
    VoucherSortField["StartDate"] = "START_DATE";
    VoucherSortField["Type"] = "TYPE";
    VoucherSortField["UsageLimit"] = "USAGE_LIMIT";
    VoucherSortField["Value"] = "VALUE";
})(VoucherSortField1 || (VoucherSortField1 = {
}));
var VoucherTypeEnum1;

(function(VoucherTypeEnum) {
    VoucherTypeEnum["EntireOrder"] = "ENTIRE_ORDER";
    VoucherTypeEnum["Shipping"] = "SHIPPING";
    VoucherTypeEnum["SpecificProduct"] = "SPECIFIC_PRODUCT";
})(VoucherTypeEnum1 || (VoucherTypeEnum1 = {
}));
var WarehouseErrorCode1;

(function(WarehouseErrorCode) {
    WarehouseErrorCode["AlreadyExists"] = "ALREADY_EXISTS";
    WarehouseErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    WarehouseErrorCode["Invalid"] = "INVALID";
    WarehouseErrorCode["NotFound"] = "NOT_FOUND";
    WarehouseErrorCode["Required"] = "REQUIRED";
    WarehouseErrorCode["Unique"] = "UNIQUE";
})(WarehouseErrorCode1 || (WarehouseErrorCode1 = {
}));
var WarehouseSortField1;

(function(WarehouseSortField) {
    WarehouseSortField["Name"] = "NAME";
})(WarehouseSortField1 || (WarehouseSortField1 = {
}));
var WebhookErrorCode1;

(function(WebhookErrorCode) {
    WebhookErrorCode["GraphqlError"] = "GRAPHQL_ERROR";
    WebhookErrorCode["Invalid"] = "INVALID";
    WebhookErrorCode["NotFound"] = "NOT_FOUND";
    WebhookErrorCode["Required"] = "REQUIRED";
    WebhookErrorCode["Unique"] = "UNIQUE";
})(WebhookErrorCode1 || (WebhookErrorCode1 = {
}));
var WebhookEventTypeEnum1;

(function(WebhookEventTypeEnum) {
    WebhookEventTypeEnum["AnyEvents"] = "ANY_EVENTS";
    WebhookEventTypeEnum["CheckoutCreated"] = "CHECKOUT_CREATED";
    WebhookEventTypeEnum["CheckoutUpdated"] = "CHECKOUT_UPDATED";
    WebhookEventTypeEnum["CustomerCreated"] = "CUSTOMER_CREATED";
    WebhookEventTypeEnum["CustomerUpdated"] = "CUSTOMER_UPDATED";
    WebhookEventTypeEnum["DraftOrderCreated"] = "DRAFT_ORDER_CREATED";
    WebhookEventTypeEnum["DraftOrderDeleted"] = "DRAFT_ORDER_DELETED";
    WebhookEventTypeEnum["DraftOrderUpdated"] = "DRAFT_ORDER_UPDATED";
    WebhookEventTypeEnum["FulfillmentCreated"] = "FULFILLMENT_CREATED";
    WebhookEventTypeEnum["InvoiceDeleted"] = "INVOICE_DELETED";
    WebhookEventTypeEnum["InvoiceRequested"] = "INVOICE_REQUESTED";
    WebhookEventTypeEnum["InvoiceSent"] = "INVOICE_SENT";
    WebhookEventTypeEnum["NotifyUser"] = "NOTIFY_USER";
    WebhookEventTypeEnum["OrderCancelled"] = "ORDER_CANCELLED";
    WebhookEventTypeEnum["OrderConfirmed"] = "ORDER_CONFIRMED";
    WebhookEventTypeEnum["OrderCreated"] = "ORDER_CREATED";
    WebhookEventTypeEnum["OrderFulfilled"] = "ORDER_FULFILLED";
    WebhookEventTypeEnum["OrderFullyPaid"] = "ORDER_FULLY_PAID";
    WebhookEventTypeEnum["OrderUpdated"] = "ORDER_UPDATED";
    WebhookEventTypeEnum["PageCreated"] = "PAGE_CREATED";
    WebhookEventTypeEnum["PageDeleted"] = "PAGE_DELETED";
    WebhookEventTypeEnum["PageUpdated"] = "PAGE_UPDATED";
    WebhookEventTypeEnum["PaymentAuthorize"] = "PAYMENT_AUTHORIZE";
    WebhookEventTypeEnum["PaymentCapture"] = "PAYMENT_CAPTURE";
    WebhookEventTypeEnum["PaymentConfirm"] = "PAYMENT_CONFIRM";
    WebhookEventTypeEnum["PaymentListGateways"] = "PAYMENT_LIST_GATEWAYS";
    WebhookEventTypeEnum["PaymentProcess"] = "PAYMENT_PROCESS";
    WebhookEventTypeEnum["PaymentRefund"] = "PAYMENT_REFUND";
    WebhookEventTypeEnum["PaymentVoid"] = "PAYMENT_VOID";
    WebhookEventTypeEnum["ProductCreated"] = "PRODUCT_CREATED";
    WebhookEventTypeEnum["ProductDeleted"] = "PRODUCT_DELETED";
    WebhookEventTypeEnum["ProductUpdated"] = "PRODUCT_UPDATED";
    WebhookEventTypeEnum["ProductVariantCreated"] = "PRODUCT_VARIANT_CREATED";
    WebhookEventTypeEnum["ProductVariantDeleted"] = "PRODUCT_VARIANT_DELETED";
    WebhookEventTypeEnum["ProductVariantUpdated"] = "PRODUCT_VARIANT_UPDATED";
    WebhookEventTypeEnum["TranslationCreated"] = "TRANSLATION_CREATED";
    WebhookEventTypeEnum["TranslationUpdated"] = "TRANSLATION_UPDATED";
})(WebhookEventTypeEnum1 || (WebhookEventTypeEnum1 = {
}));
var WebhookSampleEventTypeEnum1;

(function(WebhookSampleEventTypeEnum) {
    WebhookSampleEventTypeEnum["CheckoutCreated"] = "CHECKOUT_CREATED";
    WebhookSampleEventTypeEnum["CheckoutUpdated"] = "CHECKOUT_UPDATED";
    WebhookSampleEventTypeEnum["CustomerCreated"] = "CUSTOMER_CREATED";
    WebhookSampleEventTypeEnum["CustomerUpdated"] = "CUSTOMER_UPDATED";
    WebhookSampleEventTypeEnum["DraftOrderCreated"] = "DRAFT_ORDER_CREATED";
    WebhookSampleEventTypeEnum["DraftOrderDeleted"] = "DRAFT_ORDER_DELETED";
    WebhookSampleEventTypeEnum["DraftOrderUpdated"] = "DRAFT_ORDER_UPDATED";
    WebhookSampleEventTypeEnum["FulfillmentCreated"] = "FULFILLMENT_CREATED";
    WebhookSampleEventTypeEnum["InvoiceDeleted"] = "INVOICE_DELETED";
    WebhookSampleEventTypeEnum["InvoiceRequested"] = "INVOICE_REQUESTED";
    WebhookSampleEventTypeEnum["InvoiceSent"] = "INVOICE_SENT";
    WebhookSampleEventTypeEnum["NotifyUser"] = "NOTIFY_USER";
    WebhookSampleEventTypeEnum["OrderCancelled"] = "ORDER_CANCELLED";
    WebhookSampleEventTypeEnum["OrderConfirmed"] = "ORDER_CONFIRMED";
    WebhookSampleEventTypeEnum["OrderCreated"] = "ORDER_CREATED";
    WebhookSampleEventTypeEnum["OrderFulfilled"] = "ORDER_FULFILLED";
    WebhookSampleEventTypeEnum["OrderFullyPaid"] = "ORDER_FULLY_PAID";
    WebhookSampleEventTypeEnum["OrderUpdated"] = "ORDER_UPDATED";
    WebhookSampleEventTypeEnum["PageCreated"] = "PAGE_CREATED";
    WebhookSampleEventTypeEnum["PageDeleted"] = "PAGE_DELETED";
    WebhookSampleEventTypeEnum["PageUpdated"] = "PAGE_UPDATED";
    WebhookSampleEventTypeEnum["PaymentAuthorize"] = "PAYMENT_AUTHORIZE";
    WebhookSampleEventTypeEnum["PaymentCapture"] = "PAYMENT_CAPTURE";
    WebhookSampleEventTypeEnum["PaymentConfirm"] = "PAYMENT_CONFIRM";
    WebhookSampleEventTypeEnum["PaymentListGateways"] = "PAYMENT_LIST_GATEWAYS";
    WebhookSampleEventTypeEnum["PaymentProcess"] = "PAYMENT_PROCESS";
    WebhookSampleEventTypeEnum["PaymentRefund"] = "PAYMENT_REFUND";
    WebhookSampleEventTypeEnum["PaymentVoid"] = "PAYMENT_VOID";
    WebhookSampleEventTypeEnum["ProductCreated"] = "PRODUCT_CREATED";
    WebhookSampleEventTypeEnum["ProductDeleted"] = "PRODUCT_DELETED";
    WebhookSampleEventTypeEnum["ProductUpdated"] = "PRODUCT_UPDATED";
    WebhookSampleEventTypeEnum["ProductVariantCreated"] = "PRODUCT_VARIANT_CREATED";
    WebhookSampleEventTypeEnum["ProductVariantDeleted"] = "PRODUCT_VARIANT_DELETED";
    WebhookSampleEventTypeEnum["ProductVariantUpdated"] = "PRODUCT_VARIANT_UPDATED";
    WebhookSampleEventTypeEnum["TranslationCreated"] = "TRANSLATION_CREATED";
    WebhookSampleEventTypeEnum["TranslationUpdated"] = "TRANSLATION_UPDATED";
})(WebhookSampleEventTypeEnum1 || (WebhookSampleEventTypeEnum1 = {
}));
var WeightUnitsEnum1;

(function(WeightUnitsEnum) {
    WeightUnitsEnum["G"] = "G";
    WeightUnitsEnum["Kg"] = "KG";
    WeightUnitsEnum["Lb"] = "LB";
    WeightUnitsEnum["Oz"] = "OZ";
    WeightUnitsEnum["Tonne"] = "TONNE";
})(WeightUnitsEnum1 || (WeightUnitsEnum1 = {
}));
const AppInstallDocument = (main_default())`
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
const AppTokenVerifyDocument = (main_default())`
  mutation appTokenVerify($token: String!) {
    appTokenVerify(token: $token) {
      valid
    }
  }
`;
const CategoryCreateDocument = (main_default())`
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
const ChannelCreateDocument = (main_default())`
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
const ProductChannelListingUpdateDocument = (main_default())`
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
const ProductCreateDocument = (main_default())`
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
const ProductTypeCreateDocument = (main_default())`
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
const ProductVariantChannelListingUpdateDocument = (main_default())`
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
const ProductVariantCreateDocument = (main_default())`
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
const TokenCreateDocument = (main_default())`
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
const WebhookCreateDocument = (main_default())`
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
const AppDocument = (main_default())`
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
const ProductsDocument = (main_default())`
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
function getSdk(requester) {
    return {
        appInstall (variables, options) {
            return requester(AppInstallDocument, variables, options);
        },
        appTokenVerify (variables, options) {
            return requester(AppTokenVerifyDocument, variables, options);
        },
        categoryCreate (variables, options) {
            return requester(CategoryCreateDocument, variables, options);
        },
        channelCreate (variables, options) {
            return requester(ChannelCreateDocument, variables, options);
        },
        productChannelListingUpdate (variables, options) {
            return requester(ProductChannelListingUpdateDocument, variables, options);
        },
        productCreate (variables, options) {
            return requester(ProductCreateDocument, variables, options);
        },
        productTypeCreate (variables, options) {
            return requester(ProductTypeCreateDocument, variables, options);
        },
        productVariantChannelListingUpdate (variables, options) {
            return requester(ProductVariantChannelListingUpdateDocument, variables, options);
        },
        productVariantCreate (variables, options) {
            return requester(ProductVariantCreateDocument, variables, options);
        },
        tokenCreate (variables, options) {
            return requester(TokenCreateDocument, variables, options);
        },
        webhookCreate (variables, options) {
            return requester(WebhookCreateDocument, variables, options);
        },
        app (variables, options) {
            return requester(AppDocument, variables, options);
        },
        products (variables, options) {
            return requester(ProductsDocument, variables, options);
        }
    };
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/graphql-request@3.7.0_graphql@16.2.0/node_modules/graphql-request/dist/index.js
var dist = __webpack_require__(54956);
// EXTERNAL MODULE: ../../pkg/constants/src/headers.ts
var headers = __webpack_require__(65166);
;// CONCATENATED MODULE: ../../pkg/saleor/src/api/client.ts



function createSaleorClient({ traceId , graphqlEndpoint , token  }) {
    async function requester(doc, vars) {
        const graphqlClient = new dist.GraphQLClient(graphqlEndpoint);
        graphqlClient.setHeader(headers/* ECI_TRACE_HEADER */.X, traceId);
        if (token) {
            graphqlClient.setHeader("Authorization", `Bearer ${token}`);
        }
        const res = await graphqlClient.request(doc, vars);
        if (res.errors) {
            throw new Error(res.errors.map((e)=>e.message
            ));
        }
        return res;
    }
    return getSdk(requester);
}

;// CONCATENATED MODULE: ../../pkg/saleor/src/api/index.ts



;// CONCATENATED MODULE: ../../pkg/saleor/index.ts



/***/ }),

/***/ 46304:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Zz": () => (/* reexport */ authorizeIntegration),
  "sj": () => (/* reexport */ extendContext1),
  "Vy": () => (/* reexport */ newSaleorClient),
  "o7": () => (/* reexport */ setupPrisma)
});

;// CONCATENATED MODULE: ../../pkg/webhook-context/src/context.ts
async function extendContext1(ctx, // eslint-disable-next-line @typescript-eslint/no-explicit-any
...extendContext) {
    if (extendContext) {
        for (const extend of extendContext){
            ctx = await extend(ctx);
        }
    }
    return ctx;
}
/**
 * Convenience function to batch multiple setup functions together
 */ 

// EXTERNAL MODULE: external "@prisma/client"
var client_ = __webpack_require__(53524);
;// CONCATENATED MODULE: ../../pkg/prisma/index.ts


// EXTERNAL MODULE: ../../node_modules/.pnpm/@chronark+env@0.1.2/node_modules/@chronark/env/esm/mod.js + 2 modules
var mod = __webpack_require__(74824);
;// CONCATENATED MODULE: ../../pkg/webhook-context/src/setup/prisma.ts


/**
 * Initialize a prisma client and make it public to the context
 */ const setupPrisma = ()=>async (ctx)=>{
        const url = mod/* env.require */.O.require("DATABASE_URL_POOL");
        const prisma = new client_.PrismaClient({
            datasources: {
                db: {
                    url
                }
            }
        });
        return Object.assign(ctx, {
            prisma
        });
    }
;

// EXTERNAL MODULE: ../../pkg/errors/index.ts + 4 modules
var errors = __webpack_require__(69523);
// EXTERNAL MODULE: ../../pkg/saleor/index.ts + 3 modules
var saleor = __webpack_require__(50077);
;// CONCATENATED MODULE: ../../pkg/webhook-context/src/setup/saleor.ts



/**
 * Create a new saleor client for the given domain
 */ const newSaleorClient = (ctx, /**
   * The domain of the graphql server, with or without protocol.
   * `/graphql/` will be appended automatically to the url
   * @example
   *  `http://localhost:3000`
   */ host, token)=>{
    if (!ctx.prisma) {
        throw new errors/* ContextMissingFieldError */.fs("prisma");
    }
    ctx.logger = ctx.logger.with({
        saleorHost: host
    });
    /**
   * Add a protocol if none is provided
   */ if (!host.startsWith("http")) {
        const eciEnv = mod/* env.require */.O.require("ECI_ENV");
        const protocol = eciEnv === "production" || eciEnv === "preview" ? "https" : "http";
        host = `${protocol}://${host}`;
    }
    return (0,saleor/* createSaleorClient */.NA)({
        traceId: ctx.trace.id,
        graphqlEndpoint: `${host}/graphql/`,
        token
    });
};

;// CONCATENATED MODULE: ../../pkg/webhook-context/src/authorizeIntegration.ts

function authorizeIntegration(integration) {
    if (!integration.enabled) {
        throw new errors/* HttpError */.oo(403, "The integration is disabled by the user");
    }
    const { subscription  } = integration;
    if (!(subscription === null || subscription === void 0 ? void 0 : subscription.payedUntil) || subscription.payedUntil.getTime() < Date.now()) {
        throw new errors/* HttpError */.oo(403, "Active subcription required");
    }
}

;// CONCATENATED MODULE: ../../pkg/webhook-context/index.ts






/***/ })

};
;