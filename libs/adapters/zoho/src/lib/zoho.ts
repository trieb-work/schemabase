import axios, { AxiosInstance, AxiosResponse } from "axios";
import { strict as assert } from "assert";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { ClientCredentials, AccessToken } from "simple-oauth2";
import FormData from "form-data";
import { retry } from "@eci/util/retry";
import {
  ContactPerson,
  Contact,
  ContactWithFullAddresses,
  Address,
  InvoiceSettings,
  ContactSettings,
  LineItem,
  Bundle,
  SalesOrder,
  Invoice,
  Package,
  LanguageCode,
  InvoiceOptional,
  AddressOptional,
  SalesOrderReturn,
  Webhook,
  WebhookUpdate,
  CustomerPayment,
  TemplateName,
  ZohoEmailTemplate,
  invoiceStatus,
  SalesOrderWithInvoicedAmount,
  Entity,
  CustomFunction,
  WebhookSearch,
  CustomFunctionSearch,
  Tax,
  //   Warehouse,
} from "./types";

import { env } from "@eci/util/env";

dayjs.extend(isBetween);

type ZohoConfig = {
  clientId: string;
  clientSecret: string;
  tokenHost?: string;
  tokenPath?: string;
  orgId: string;
};

export class Zoho {
  private clientId: string;
  private clientSecret: string;
  private tokenHost: string;
  private tokenPath: string;
  private orgId: string;
  // @ts-expect-error
  private api: AxiosInstance;

  private constructor(config: ZohoConfig) {
    if (!config.clientId) {
      throw new Error(`Zoho Client ID is missing`);
    }
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.orgId = config.orgId;
    this.tokenHost = config.tokenHost ?? "https://accounts.zoho.eu";
    this.tokenPath = config.tokenPath ?? "/oauth/v2/token";
  }

  /**
   * Async constructor to authenticate the user when this class is instantiated
   */
  public static async new(config: ZohoConfig): Promise<Zoho> {
    const zoho = new Zoho(config);
    zoho.api = await zoho.createApi();

    return zoho;
  }

  /**
   * Create an api instance or reuses an existing one.
   */
  private async createApi(): Promise<AxiosInstance> {
    if (this.api) {
      return this.api;
    }

    const cookies = env.get("ZOHO_COOKIES");

    const options = {
      baseURL: "https://inventory.zoho.eu/api/v1",
      timeout: 7000,
      params: { organization_id: this.orgId },
    };

    if (cookies) {
      return axios.create({
        ...options,
        headers: {
          Cookie: cookies,
          "X-ZCSRF-TOKEN": env.require("ZOHO_TOKEN"),
          // TODO: Why do we set this user agent?!
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36",
        },
      });
    }

    const { token } = await this.authenticate();
    this.api = axios.create({
      ...options,
      headers: {
        Authorization: `${token["token_type"]} ${token["access_token"]}`,
      },
    });
    return this.api;
  }

  /**
   * Authenticate the user with the zoho API
   */
  private async authenticate(): Promise<AccessToken> {
    const clientCredentials = new ClientCredentials({
      client: {
        id: this.clientId,
        secret: this.clientSecret,
      },
      auth: {
        tokenHost: this.tokenHost,
        tokenPath: this.tokenPath,
      },
      options: {
        authorizationMethod: "body",
      },
    });

    return await clientCredentials
      .getToken({
        scope: "ZohoInventory.FullAccess.all",
      })
      .catch((err: Error) => {
        throw new Error(`Error authenticating client with Zoho: ${err}`);
      });
  }
  /**
   * Get a package by ID
   */
  private async getPackage(packageId: string): Promise<Package> {
    const result = await this.api({
      url: `/packages/${packageId}`,
      headers: {
        "X-ZB-SOURCE": "zbclient",
      },
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.package as Package;
  }

  /**
   * Create an invoice in Zoho. Set totalGrossAmount to compare the result of the salesorder with a total Gross Amount.
   * @param rawData
   * @param totalGrossAmount
   */
  public async createInvoice(
    rawData: InvoiceOptional,
    // FIXME: totalGrossAmount?: number,
    timeout = 20000,
  ): Promise<string> {
    const data = `JSONString=${encodeURIComponent(JSON.stringify(rawData))}`;

    const result = await this.api({
      timeout,
      method: "post",
      url: "/invoices",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    });

    assert.strictEqual(result.data.code, 0);
    return result.data.invoice.invoice_number as string;
  }

  /**
   * Add an address to a contact. Do not change the default address or edit any existing documents from this customer.
   * @param contactId
   * @param address
   */
  async addAddresstoContact(
    contactId: string,
    address: AddressOptional,
    maxAttempts = 2,
  ): Promise<string> {
    const adressConstructor = { ...address };
    // we don't want to change the address at existing transactions in Zoho.
    adressConstructor.update_existing_transactions_address = "false";
    const addressId = await retry(
      async () => {
        const data = `JSONString=${encodeURIComponent(
          JSON.stringify(adressConstructor),
        )}`;
        const result = await this.api({
          url: `/contacts/${contactId}/address`,
          method: "post",
          data,
        });
        if (result?.data?.code !== 0)
          throw new Error(`Adding the address was not successfull! ${address}`);
        return result.data.address_info.address_id as string;
      },
      {
        maxAttempts,
      },
    );
    return addressId;
  }

  /**
   * This functions gets the total amount of all bundles of a specific month. Use this for example when you need to charge somebody
   * for the bundling and you need to count them per month.
   * @param from Configure the time range from parameter. Format: 2020-11-01
   * @param to Configure the time range to parameter.
   * @param userNameFilter Filter the created bundles by a specific Username
   */
  async getBundles(
    from: string,
    to: string,
    userNameFilter?: string,
  ): Promise<number> {
    const responseData = await this.api.get("/bundles");
    assert.strictEqual(responseData.data.code, 0);
    const From = dayjs(from);
    const To = dayjs(to);
    const bundles: Bundle[] = responseData.data.bundles;
    const bundlesWithDate = bundles.filter((bundle) => {
      const parsedDate = dayjs(bundle.date);
      let user = true;
      if (userNameFilter && bundle.created_by_name !== userNameFilter)
        user = false;
      return parsedDate.isBetween(From, To) && user;
    });
    const totalBundles = bundlesWithDate.reduce(
      (previous, current) => previous + current.quantity_to_bundle,
      0,
    );
    return totalBundles;
  }

  async customField(): Promise<string> {
    const result = await this.api.get("/contacts/editpage");
    const returnValue = result.data.custom_fields.filter(
      (x: { label: string }) => x.label === "saleor-id",
    );
    if (!returnValue)
      throw new Error(
        "no Contact custom field for saleor-id found. Please create it first.",
      );
    return returnValue[0].customfield_id;
  }

  async contactPersonID(
    invoiceId: string,
  ): Promise<{ contact_person_id: string; email: string }> {
    const result = await this.api({
      url: "/invoices/editpage",
      params: {
        invoice_id: invoiceId,
      },
    });
    assert.strictEqual(result.data.code, 0);
    return {
      contact_person_id: result.data.contact.primary_contact_id as string,
      email: result.data.contact.email_id as string,
    };
  }

  /**
   * Search in Zoho for a package with that Tracking Number. Returns null if no match
   * Pulls full package data from Zoho in a second API-call
   * @param trackingNumber
   */
  async getPackageByTrackingNumber(trackingNumber: string) {
    const result = await this.api({
      url: "/packages",
      params: {
        tracking_number_contains: trackingNumber,
      },
    });
    assert.strictEqual(result.data.code, 0);
    const returnValue = result.data.packages;
    if (returnValue.length < 1) return null;
    // we just receive a certain package subset - pulling the full package data to return it.
    const packageId = returnValue[0].package_id;
    const fullPackage = await this.getPackage(packageId);
    return fullPackage;
  }

  /**
   * Get possible metadata for salesorders, like possible tax rates and the custom field ID for "ready to fulfill"
   * @returns { } the ID of the custom field "Ready to Fulfill" in Zoho. We use this to control,
   * if an order is ready to be send out.
   */
  async salesOrderEditpage() {
    const result = await this.api.get("/salesorders/editpage");
    assert.strictEqual(result.data.code, 0);
    const taxes = result.data.taxes.filter(
      (x: { deleted: boolean }) => x.deleted === false,
    ) as Tax[];
    const customFieldReadyToFulfill = result.data.custom_fields.find(
      (x: { placeholder: string }) => x.placeholder === "cf_ready_to_fulfill",
    )?.customfield_id as string;
    if (!customFieldReadyToFulfill)
      throw new Error(
        'Custom Field "Ready to Fulfill" for Salesorders is not created yet!! Please fix ASAP',
      );
    return { taxes, customFieldReadyToFulfill };
  }

  /**
   * Gets a customer and resolves all addresses, that this customer has attached.
   * @param contactId
   */
  async getContactWithFullAdresses(
    contactId: string,
  ): Promise<ContactWithFullAddresses> {
    const result = await this.api({
      url: `/contacts/${contactId}`,
    });
    assert.strictEqual(result?.data?.code, 0);
    const returnValue = result?.data?.contact;
    if (returnValue.language_code === "") returnValue.language_code = "de";

    const addressResult = await this.api({
      url: `/contacts/${contactId}/address`,
    });
    assert.strictEqual(addressResult.data.code, 0);
    return {
      ...(returnValue as Contact),
      addresses: addressResult.data.addresses as Address[],
    } as ContactWithFullAddresses;
  }

  /**
   * Get a contact / customer by its ID.
   * @param {string} contactId
   */
  async getContactById(
    contactId: string,
  ): Promise<Contact | ContactWithFullAddresses> {
    const result = await this.api({
      url: `/contacts/${contactId}`,
    });
    assert.strictEqual(result?.data?.code, 0);
    const returnValue = result?.data?.contact;
    if (returnValue.language_code === "") returnValue.language_code = "de";

    return {
      ...(returnValue as Contact),
    };
  }

  /**
   * Get invoice_items from up to 25 Individual Salesorder Ids. The corresponding invoice will have
   * these Salesorders attached to.
   * @param salesorderIds Array of Salesorder Ids
   * @param contactId Zoho Contact Id for this invoice
   */
  async getInvoiceDataFromMultipleSalesOrders(
    salesorderIds: string[],
    contactId: string,
    isInclusiveTax: boolean,
  ) {
    const salesorderString = salesorderIds.join(",");
    const result = await this.api({
      url: "/invoices/include/salesorderitems",
      params: {
        salesorder_ids: salesorderString,
        is_inclusive_tax: isInclusiveTax,
      },
    });
    assert.strictEqual(result.data.code, 0);
    const invoiceSettingsResult = await this.api({
      url: "/invoices/editpage/fromcontacts",
      params: {
        contact_id: contactId,
      },
    });
    assert.strictEqual(invoiceSettingsResult.data.code, 0);
    const invoiceSettings: InvoiceSettings =
      invoiceSettingsResult.data.invoice_settings;
    const contact: ContactSettings = invoiceSettingsResult.data.contact;
    const lineItems: LineItem[] = result.data.invoice_items;
    const cleanedLineItems = lineItems.map(
      (
        /**
         * Black magic to make warehouse_name and warehouses optional
         */
        item: Pick<Partial<LineItem>, "warehouse_name" | "warehouses"> &
          Omit<LineItem, "warehouse_name" | "warehouses">,
      ) => {
        delete item.warehouse_name;
        delete item.warehouses;
        return item;
      },
    );
    const referenceNumber: string = result.data.reference_number;
    return {
      line_items: cleanedLineItems,
      reference_number: referenceNumber,
      invoice_settings: invoiceSettings,
      contact,
    };
  }

  /**
   * Search for a user in Zoho. Filters results for just customers! No vendors
   * @param param0
   */
  async getContact({
    first_name,
    last_name,
    email,
    company_name,
  }: {
    first_name: string;
    last_name: string;
    email: string;
    company_name: string;
  }) {
    const result = await this.api({
      url: "/customers",
      params: {
        first_name_contains: first_name,
        last_name_contains: last_name,
        email_contains: email,
        company_name_contains: company_name,
        usestate: false,
        sort_order: "A",
        status: "active",
      },
    });
    assert.strictEqual(result.data.code, 0);
    const returnValue = result.data.contacts as {
      email: string;
      contact_id: string;
    }[];
    if (returnValue.length < 1) return null;
    // zoho might give us "closely" matching email addresses, so we select the return value with the exact same email address.
    const exactMatch = returnValue.find((x) => x.email === email);
    return exactMatch?.contact_id;
  }

  async createContactPerson(contactId: string, contactPerson: ContactPerson) {
    if (!contactId)
      throw new Error(
        `contactId missing! Can't create the contact person ${contactPerson}`,
      );
    const createData = {
      ...contactPerson,
      contact_id: contactId,
    };
    const data = `JSONString=${encodeURIComponent(JSON.stringify(createData))}`;
    const result = await this.api({
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      url: "/contacts/contactpersons",
      data,
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.contact_person.contact_person_id;
  }

  /**
   * get the total amount of packages in a specific time-range. Date format: 2020-11-02
   * @param param0
   */
  async getPackagesTotal({ from, to }: { from: string; to: string }) {
    const result = await this.api({
      url: "/packages/",
      headers: {
        "X-ZB-SOURCE": "zbclient",
      },
      params: {
        shipment_date_start: from,
        shipment_date_end: to,
        response_option: 2,
      },
    });
    assert.strictEqual(result.data.code, 0);
    const totalAmount: number = result.data?.page_context?.total;
    return totalAmount;
  }

  /**
   * gets a salesorder by ID
   * @param salesorderId
   */
  async getSalesorderById(salesorderId: string) {
    const result = await this.api({
      url: `/salesorders/${salesorderId}`,
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.salesorder as SalesOrderReturn;
  }

  /**
   * get a salesorder by salesorder number! Searches for the number first.
   * @param salesorderNumber
   */
  async getSalesorder(salesorderNumber: String) {
    const result = await this.api({
      url: "/salesorders",
      params: {
        salesorder_number: salesorderNumber,
      },
    });
    assert.strictEqual(result.data.code, 0);
    const returnValue = result.data.salesorders;
    if (returnValue.length < 1) return null;

    // get the full salesorder with metadata. Search results just offer parts
    const FullResult = await this.api({
      url: `/salesorders/${returnValue[0].salesorder_id}`,
    });
    assert.strictEqual(FullResult.data.code, 0);

    // this easy to use value is NOT set by Zoho when accessing the Salesorder directly ..
    FullResult.data.salesorder.total_invoiced_amount =
      returnValue[0].total_invoiced_amount;

    return FullResult.data.salesorder as SalesOrderWithInvoicedAmount;
  }

  /**
   * Get a list of invoices
   * @param filters
   */
  async getInvoices({
    date_before,
    status,
    customview_id,
  }: {
    date_before: string;
    status: invoiceStatus;
    customview_id?: string;
  }) {
    const result = await this.api({
      url: "/invoices",
      params: {
        date_before,
        status,
        customview_id,
      },
    });
    assert.strictEqual(result.data.code, 0);

    return result.data.invoices as Invoice[];
  }

  /**
   * gets an invoice by its Zoho Invoice ID
   * @param invoiceId
   */
  async getInvoiceById(invoiceId: string) {
    const result = await this.api({
      url: `/invoices/${invoiceId}`,
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.invoice as Invoice;
  }

  /**
   * search for customer payments
   * @param The search params like cf_custom_field etc.
   */
  async getCustomerPayments(searchParams: { [key: string]: string }) {
    const result = await this.api({
      url: "/customerpayments",
      params: searchParams,
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.customerpayments as CustomerPayment[];
  }

  /**
   * Update specific values of a customer payment
   * @param id
   * @param rawData
   */
  async updateCustomerPayment(id: string, rawData: unknown, maxAttempts = 0) {
    if (typeof id !== "string")
      throw new Error("You are missing the Payment ID! Please set it");
    const data = `JSONString=${encodeURIComponent(JSON.stringify(rawData))}`;
    await retry(
      async () => {
        const result = await this.api({
          method: "put",
          url: `/customerpayments/${id}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data,
        });
        assert.strictEqual(result.data.code, 0);
        return true;
      },
      {
        maxAttempts,
      },
    );
  }

  /**
   * Get a corresponding invoice from a salesorder. Fails, if this Saleosorder has no, or more than one invoices attached.
   * @param salesOrderId The Zoho ID of the Salesorder
   */
  async getInvoicefromSalesorder(salesOrderId: string) {
    const result = await this.api({
      url: "/salesorders/editpage",
      params: {
        salesorder_id: salesOrderId,
      },
    });
    assert.strictEqual(result.data.code, 0);
    const returnValue = result.data.salesorder.invoices;
    if (returnValue.length < 1)
      throw new Error("This salesorder has no invoices attached.");
    if (returnValue.length > 1)
      throw new Error(
        "This salesorder has more than one invoice attached. We can't add a payment",
      );
    return {
      invoice_id: returnValue[0].invoice_id,
      metadata: returnValue[0],
    };
  }

  /**
   * Search for a product by SKU in Zoho and get the first result. Return the taxRate in percent and the Item ID
   */
  async getItembySKU(productSKU: string) {
    const result = await this.api({
      url: "/items",
      params: {
        sku: productSKU,
      },
    });
    assert.strictEqual(result.data.code, 0);
    const returnValue = result.data.items;
    if (returnValue < 1)
      throw new Error(
        `No product for this SKU found! Create the product first in Zoho ${productSKU}`,
      );
    return {
      zohoItemId: returnValue[0].item_id as string,
      zohoTaxRate: returnValue[0].tax_percentage as number,
      name: returnValue[0].name as string,
      zohoTaxRateId: returnValue[0].tax_id as string,
    };
  }

  /**
   * Create a contact and return the ID of the contact, the billing_address, shipping_address and contact person ID
   * @param data - Must be json serializable
   */
  async createContact(data: unknown) {
    data = `JSONString=${encodeURIComponent(JSON.stringify(data))}`;
    const result = await this.api({
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      url: "/contacts",
      data,
    });
    assert.strictEqual(result.data.code, 0);
    return {
      contact_id: result.data.contact.contact_id,
      contact_person_id:
        result.data.contact.contact_persons[0].contact_person_id,
      billing_address_id:
        result.data.contact.billing_address.address_id || null,
      shipping_address_id:
        result.data.contact.shipping_address.address_id || null,
    };
  }

  /**
   * Get the Item from Zoho using its ID
   * @param {object} param0
   * @param {string} param0.product_id The Zoho product ID like 116240000000037177
   */
  async getItemasync({ product_id }: { product_id: string }) {
    if (!product_id) throw new Error("Missing mandatory field product ID!");
    const result = await this.api({
      url: `/items/${product_id}`,
    });
    assert.strictEqual(result.data.code, 0);
    if (!result.data.item)
      throw new Error(
        `No Product data returned from Zoho! ${JSON.stringify(result.data)}`,
      );
    return result.data.item;
  }

  /**
   * The the whole itemgroup for a product
   * @param product_id
   */
  async getItemGroup(product_id: string) {
    const result = await this.api({
      url: `/itemgroups/${product_id}`,
    });
    assert.strictEqual(result.data.code, 0);
    if (!result.data.item_group)
      throw new Error(
        `No Product data returned from Zoho! ${JSON.stringify(result.data)}`,
      );
    return result.data.item_group;
  }

  /**
   * Creates a salesorder in Zoho. Set totalGrossAmount to compare the result of the salesorder with a total Gross Amount.
   * @param rawData
   * @param totalGrossAmount
   */
  async createSalesorder(rawData: SalesOrder, totalGrossAmount?: string) {
    const data = `JSONString=${encodeURIComponent(JSON.stringify(rawData))}`;

    const result = await this.api({
      method: "post",
      url: "/salesorders",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        ignore_auto_number_generation: true,
      },
      data,
    });
    if (result.data.code !== 0) {
      console.error(
        "Creating the Salesorder failed in Zoho. Printing out response and the salesorder we wanted to create",
        result.data,
      );
      console.info(JSON.stringify(data, null, 2));
    }
    assert.strictEqual(result.data.code, 0);
    if (totalGrossAmount) {
      assert.strictEqual(
        parseFloat(totalGrossAmount),
        result.data.salesorder.total,
      );
    }

    return result.data.salesorder as SalesOrderReturn;
  }

  /**
   * Update specific values of a salesorder
   * @param id
   * @param rawData - must be json serializable
   */
  async updateSalesorder(id: string, rawData: unknown, maxAttempts = 0) {
    if (typeof id !== "string")
      throw new Error("You are missing the salesorderid! Please set it");
    const data = `JSONString=${encodeURIComponent(JSON.stringify(rawData))}`;
    await retry(
      async () => {
        const result = await this.api({
          method: "put",
          url: `/salesorders/${id}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data,
        });
        assert.strictEqual(result.data.code, 0);
        return true;
      },
      {
        maxAttempts,
      },
    );
  }

  /**
   * Confirm several sales orders at once. Takes long for > 10 salesorders. Limit is 25 salesorders (I think)
   * @param salesorders Array of Salesorder Ids to confirm at once
   * @param maxAttempts the number of maxAttempts we should do when request fails
   */
  async salesordersConfirm(salesorders: string[], maxAttempts = 3) {
    const data = `salesorder_ids=${encodeURIComponent(salesorders.join(","))}`;
    await retry(
      async () => {
        const result = await this.api({
          method: "post",
          url: "/salesorders/status/confirmed",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data,
        });
        assert.strictEqual(result.data.code, 0);
        return true;
      },
      {
        maxAttempts,
      },
    );
  }

  async salesorderConfirm(salesorderId: string, maxAttempts = 3) {
    await retry(
      async () => {
        const result = await this.api({
          method: "post",
          url: `/salesorders/${salesorderId}/status/confirmed`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        assert.strictEqual(result.data.code, 0);
      },
      {
        maxAttempts,
      },
    );
    return true;
  }

  /**
   * Takes an existing non-draft Salesorder and converts it to an invoice
   * @param salesOrderId - the unique ID of this salesorder in Zoho
   */
  async invoicefromSalesorder(salesOrderId: string) {
    const result = await this.api({
      timeout: 15_000,
      url: "/invoices/fromsalesorder",
      method: "post",
      params: {
        salesorder_id: salesOrderId,
      },
    });
    assert.strictEqual(result.data.code, 0);
    const returnValue = result.data.invoice;
    return returnValue.invoice_id;
  }

  async createPayment(paymentData: unknown) {
    const data = `JSONString=${encodeURIComponent(
      JSON.stringify(paymentData),
    )}`;
    const result = await this.api({
      url: "/customerpayments",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    });
    assert.strictEqual(result.data.code, 0);
    return true;
  }

  /**
   * Update an invoice. Takes the full invoice_object, including the invoice_id as input parameter
   * @param invoiceID
   * @param updateData {}
   */
  async updateInvoice(invoiceID: string, updateData: InvoiceOptional) {
    const data = `JSONString=${encodeURIComponent(JSON.stringify(updateData))}`;
    const result = await this.api({
      url: `/invoices/${invoiceID}`,
      method: "put",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.invoice as Invoice;
  }

  /**
   * Get the needed data from a Zoho Emailing Template used to send out Emails to a customer
   * @param entity
   * @param id
   * @param templateName
   * @param languageCode
   */
  async getEmailTemplateData(
    entity: Entity,
    id: string,
    templateName: TemplateName,
    languageCode: LanguageCode,
  ) {
    // first get the Templates
    const templatesResult = await this.api({
      url: "/settings/emailtemplates",
    });
    // generate the template with language code
    const templateNameWithLang = `${templateName}_${languageCode.toLowerCase()}`;
    const template = templatesResult.data?.emailtemplates.find(
      (x: { name: string }) => x.name === templateNameWithLang,
    ) as ZohoEmailTemplate;
    if (!template)
      throw new Error(
        `No template with the name ${templateNameWithLang} found!`,
      );

    // get the email data like body, subject or the email address ID.
    const response = await this.api({
      url: `/${entity}/${id}/email`,
      params: {
        email_template_id: template.email_template_id,
      },
    });
    const emailDataResult = response.data;

    const emailData = {
      from_address: emailDataResult.data?.from_address as string,
      subject: emailDataResult.data.subject as string,
      body: emailDataResult.data.body as string,
    };
    return emailData;
  }

  /**
   * Get custom functions from the Settings Page
   */
  async getCustomFunctionsasync() {
    const result = await this.api({
      url: "/integrations/customfunctions",
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.customfunctions as CustomFunction[];
  }

  /**
   * Get all webhooks from the settings page
   */
  async getWebhooksasync() {
    const result = await this.api({
      url: "/settings/webhooks",
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.webhooks as WebhookSearch[];
  }

  /**
   * Send out an E-Mail by searching for the corresponding Email Template first
   * @param entity
   * @param id
   * @param templateName
   * @param userEmail the Email Address where to send to
   * @param languageCode The user language. The function tries to find an email template with _de or _en as suffix
   */
  async sendEmailWithTemplate(
    entity: Entity,
    id: string,
    templateName: TemplateName,
    userEmail: string,
    languageCode: LanguageCode,
  ) {
    // first get the Templates
    const templatesResult = await this.api({
      url: "/settings/emailtemplates",
    });
    // generate the template with language code
    const templateNameWithLang = `${templateName}_${languageCode.toLowerCase()}`;
    const template = templatesResult.data?.emailtemplates.find(
      (x: { name: string }) => x.name === templateNameWithLang,
    ) as ZohoEmailTemplate;
    if (!template)
      throw new Error(
        `No template with the name ${templateNameWithLang} found!`,
      );

    // get the email data like body, subject or the email address ID.
    const response = await this.api({
      url: `/${entity}/${id}/email`,
      params: {
        email_template_id: template.email_template_id,
      },
    });
    const emailDataResult = response.data;

    const emailData = {
      from_address: emailDataResult.data?.from_address,
      to_mail_ids: [`${userEmail}`],
      subject: emailDataResult.data.subject,
      body: emailDataResult.data.body,
    };

    const form = new FormData();
    form.append("file_name", emailDataResult.data?.file_name);
    form.append("JSONString", JSON.stringify(emailData));
    form.append("attach_pdf", "true");
    // send out the email with the data from the step before
    const emailSendResult = await this.api({
      url: `/${entity}/${id}/email`,
      headers: form.getHeaders(),
      method: "post",
      data: form,
    });
    assert.strictEqual(emailSendResult.data.code, 0);
    return true;
  }
  //FIXME: type
  async sendInvoice(data: {
    email: string;
    invoices: { invoice_id: string }[];
  }) {
    const result = await this.api({
      url: `/invoices/${data.invoices[0].invoice_id}/email`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: `JSONString=${encodeURIComponent(
        JSON.stringify({
          send_from_org_email_id: true,
          to_mail_ids: [data.email],
        }),
      )}`,
    });
    assert.strictEqual(result.data.code, 0);
  }

  /**
   * Get a public download-link with 90 days validity to directly download an invoice
   * @param {string} invoiceId The invoice ID we should create the download link for
   */
  async getPublicInvoiceDownloadURLasync({
    invoiceId,
    invoiceURL,
  }: {
    invoiceId?: string;
    invoiceURL: string;
  }) {
    const expiry_time = dayjs().add(90, "day").format("YYYY-MM-DD");
    let returnValue;
    if (invoiceId) {
      const result = await this.api({
        params: {
          transaction_id: invoiceId,
          transaction_type: "invoice",
          link_type: "public",
          expiry_time,
        },
      });
      assert.strictEqual(result.data.code, 0);
      returnValue = replace(result.data.share_link);
    } else {
      returnValue = replace(invoiceURL);
    }

    /**
     * Dangerously changing the URL link to be a direct download link. Zoho might change that in the future....
     * @param url
     */
    function replace(url: string): string {
      return `${
        url
          .replace(/\/inventory/, "/books")
          .replace(/\/secure/, "/api/v3/clientinvoices/secure")
          .trim() as string
      }&accept=pdf`;
    }

    return returnValue;
  }

  /**
   * Downloads a PDF package slip for a package and returns it as base64 string for further processing (like printing). Retries
   * when a document doesn't seem to exist
   * @param entity
   * @param id
   * @param additions add a string of additions to the download URL (like /image etc.)
   */
  async getDocumentBase64StringOrBuffer(
    entity: Entity,
    id: string,
    additions?: string,
  ) {
    const url = `/${entity}/${id}${additions || ""}`;

    let result: AxiosResponse | undefined = undefined;

    const RetryFunction = async () => {
      return await this.api({
        url,
        params: {
          accept: "pdf",
        },
        responseType: "arraybuffer",
      });
    };

    try {
      result = await RetryFunction();
    } catch (error) {
      if (error?.response?.status === (404 || 400)) {
        await new Promise((resolve) => setTimeout(resolve, 1_000));
        result = await RetryFunction();
        console.error("Document still doesn't exist!");
        return { base64Buffer: null, filename: null, rawBuffer: null };
      }
      console.error("Error downloading document!", error);
      throw new Error(error);
    }

    const rawBuffer = Buffer.from(result.data, "binary");
    const base64Buffer = Buffer.from(result.data, "binary").toString("base64");
    const headerLine = result.headers["content-disposition"];
    const startFileNameIndex = headerLine.indexOf('"') + 1;
    const endFileNameIndex = headerLine.lastIndexOf('"');
    const filename = headerLine.substring(
      startFileNameIndex,
      endFileNameIndex,
    ) as string;

    return { base64Buffer, filename, rawBuffer };
  }

  /**
   * Adds a comment to an entity
   * @param entity
   * @param id
   * @param comment the comment string
   */
  async addComment(
    entity: Entity,
    id: string,
    comment: string,
  ): Promise<boolean> {
    const data = `JSONString=${encodeURIComponent(
      JSON.stringify({ description: comment }),
    )}`;

    const result = await this.api({
      url: `/${entity}/${id}/comments`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    });
    assert.strictEqual(result.data.code, 0);
    return true;
  }

  /**
   * Adds a note to a shipment
   * @param entity
   * @param id
   * @param comment the comment string
   */
  async addNote(shipmentid: string, note: string): Promise<boolean> {
    const data = `shipment_notes=${encodeURIComponent(note)}`;

    const result = await this.api({
      url: `/shipmentorders/${shipmentid}/notes`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    });
    assert.strictEqual(result.data.code, 0);
    return true;
  }

  /**
   * Set a custom field checkbox to true or false
   * @param entity {entity}
   * @param id
   * @param customFieldId
   * @param value
   */
  async setCheckboxValue(
    entity: Entity,
    id: string,
    customFieldId: string,
    value: boolean,
  ): Promise<boolean> {
    const updateValue = {
      custom_fields: [
        {
          customfield_id: customFieldId,
          value,
        },
      ],
    };
    const data = `JSONString=${encodeURIComponent(
      JSON.stringify(updateValue),
    )}`;
    await this.api({
      method: "put",
      url: `/${entity}/${id}`,
      data,
    });
    return true;
  }

  /**
   * returns a base 64 string and a filename for documents attached to a Salesorder
   * @param salesorderId
   * @param documentId
   */
  async getDocumentFromSalesorderBase64String(
    salesorderId: string,
    documentId: string,
  ) {
    const result = await this.api({
      url: `/salesorders/${salesorderId}/documents/${documentId}`,
      params: {
        accept: "pdf",
      },
      responseType: "arraybuffer",
    });
    const base64Buffer = Buffer.from(result.data, "binary").toString("base64");
    const headerLine = result.headers["content-disposition"];
    const startFileNameIndex = headerLine.indexOf('"') + 1;
    const endFileNameIndex = headerLine.lastIndexOf('"');
    const filename = headerLine.substring(startFileNameIndex, endFileNameIndex);

    return { base64Buffer, filename };
  }

  /**
   * This function can be used to create a Webhook in the system.
   * @param creationData
   */
  async createWebhook(creationData: WebhookUpdate) {
    const data = `JSONString=${encodeURIComponent(
      JSON.stringify(creationData),
    )}`;
    const result = await this.api({
      method: "POST",
      url: "/settings/webhooks/",
      data,
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.webhook as Webhook;
  }

  /**
   * This function can be used to update a Webhook in the system.
   * @param webhookId
   * @param updateDate
   */
  async updateWebhook(webhookId: string, updateDate: WebhookUpdate) {
    const data = `JSONString=${encodeURIComponent(JSON.stringify(updateDate))}`;
    const result = await this.api({
      method: "PUT",
      url: `/settings/webhooks/${webhookId}`,
      data,
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.webhook as Webhook;
  }

  /**
   * This function can be used to create a Custom Function in the system.
   * @param creationData
   */
  async createCustomfunction(creationData: any) {
    const data = `JSONString=${encodeURIComponent(
      JSON.stringify(creationData),
    ).replace(/\s/g, "+")}&organization_id=${this.orgId}`;
    // form.append('organization_id', this.zohoOrgId);
    delete this.api.defaults.params.organization_id;
    const result = await this.api({
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        "X-ZB-SOURCE": "zbclient",
      },
      url: "/integrations/customfunctions",
      data,
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.customfunction as CustomFunctionSearch;
  }

  async updateCustomFunction(customfunctionId: string, updateDate: any) {
    const data = `JSONString=${encodeURIComponent(updateDate)}`;
    const result = await this.api({
      method: "PUT",
      url: `/integrations/customfunctions/${customfunctionId}`,
      data,
    });
    assert.strictEqual(result.data.code, 0);
    return result.data.webhook as CustomFunctionSearch;
  }
}
