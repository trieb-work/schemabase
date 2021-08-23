import MailchimpApi from "mailchimp-api-v3";
import assert from "assert";
import { encode } from "js-base64";
import crypto from "crypto";
import winston from "winston";
import { MailchimpMemberStatus, MailchimpOrder } from "./types";

/**
 * Just recursively clean an object. Delete all empty values.
 * @param obj
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeEmpty = (obj: Record<any, any>): Record<any, any> => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object") {
      removeEmpty(obj[key]);
    } else if (!obj[key] || obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};

type MailchimpConfig = {
  listId: string;
  apiKey: string;
  /**
   * The Domain of the store. Gets base64 encoded to become the StoreID in Api
   */
  storeDomain: string;
  logger?: winston.Logger;
  /**
   * When the store ID is set we don't generate it by ourselves using the storeDomain
   */
  storeId?: string;
};

export class MailChimp {
  private listId: string;

  private apiKey: string;

  private api: MailchimpApi;

  private storeId: string;

  private storeDomain: string;

  private logger: winston.Logger | Console;

  constructor(config: MailchimpConfig) {
    this.listId = config.listId;
    this.apiKey = config.apiKey;
    // the Store ID is the encoded store Domain, limited to 50 characters.
    // when the Storefront URL changes, we add a new Store
    this.storeId = config.storeId
      ? config.storeId
      : encode(config.storeDomain).substr(0, 49);
    this.storeDomain = config.storeDomain;
    this.api = new MailchimpApi(this.apiKey);
    this.logger = config.logger || console;
  }

  public async setupStore({
    name,
    defaultCurrency = "EUR",
    companyAddress,
  }: {
    name: string;
    defaultCurrency?: string;
    companyAddress?: {
      streetAddress1?: string;
      streetAddress2?: string;
      city?: string;
      postalCode?: string;
      country?: { code: string };
    };
  }) {
    if (!this.listId) {
      throw new Error(
        "No mailchimp listId found. Set it via env variable MAILCHIMP_listId",
      );
    }
    if (!companyAddress) {
      console.error(
        `No Store Company Adress given! Set it in Saleor. We got name: ${name}`,
      );
    }

    const result = await this.api
      .get({
        path: `/ecommerce/stores/${this.storeId}`,
      })
      .catch((error) => {
        if (error.statusCode === 404) {
          console.log("No store yet");
        } else {
          throw new Error(`Error getting mailchimp store, ${error}`);
        }
      });
    if (!result) {
      console.log(
        "The Mailchimp store",
        this.storeDomain,
        "does not exist. We create it now.",
      );
      const Create = await this.api.post({
        path: "/ecommerce/stores",
        body: {
          id: this.storeId,
          list_id: this.listId,
          name,
          platform: "Saleor",
          currency_code: defaultCurrency,
          domain: this.storeDomain,
          address: {
            address1: companyAddress?.streetAddress1,
            address2: companyAddress?.streetAddress2,
            city: companyAddress?.city,
            postal_code: companyAddress?.postalCode,
            country_code: companyAddress?.country?.code,
          },
        },
      });
      assert.strictEqual(Create.id, this.storeId);
    }
    const mergeFields = [
      {
        name: "Package Tracking Number",
        type: "text",
        tag: "MMERGE45",
        required: false,
        public: false,
      },
      {
        name: "Package Tracking Provider",
        type: "text",
        tag: "MMERGE46",
        required: false,
        public: false,
      },
      {
        name: "Package Tracking URL",
        type: "url",
        tag: "MMERGE47",
        required: false,
        public: false,
      },
      {
        name: "Invoice Download Link",
        type: "url",
        tag: "MMERGE48",
        required: false,
        public: false,
      },
      {
        name: "Invoice Number",
        type: "text",
        tag: "MMERGE49",
        required: false,
        public: false,
      },
      {
        name: "Order Number",
        type: "text",
        tag: "MMERGE50",
        required: false,
        public: false,
      },
    ];
    console.log("Verifying merge fields in mailchimp ..");
    await Promise.all(
      mergeFields.map((field) => {
        this.api
          .post({
            path: `/lists/${this.listId}/merge-fields`,
            body: field,
          })
          .catch((error) => {
            if (error.statusCode !== 400) {
              throw new Error(
                `Error creating merge fields in Mailchimp!${JSON.stringify(
                  error,
                )}`,
              );
            }
          });
      }),
    );

    return this.storeId;
  }

  /**
   * returns the MD5 hash of the lowercase Email address, to access that person
   */
  public getMailchimpIdFromEmail(email: string): string {
    return crypto.createHash("md5").update(email.toLowerCase()).digest("hex");
  }
  /**
   * Create an order in Mailchimp
   * @param {string} StoreId The ID you choose when creating the store
   * @param {object} Order The Order details in the official mailchimp format.
   */
  public async createOrder(Order: MailchimpOrder) {
    const checkExistence = await this.api
      .get({
        path: `/ecommerce/stores/${this.storeId}/orders/${Order.id}`,
      })
      .catch((e) => {
        if (e.statusCode !== 404)
          this.logger.error("Error getting order! Someting went wrong.");
      });
    if (checkExistence) {
      return Order.id;
    }
    this.logger.info(`Order ${Order.id} does not yet exist. Creating it now.`);
    const Create = await this.api.post({
      path: `/ecommerce/stores/${this.storeId}/orders/`,
      body: Order,
    });

    return Create;
  }

  /**
   * Get a product by its ID
   * @param ProductID
   */
  public async getProduct(ProductID: string) {
    const result = await this.api
      .get({
        path: `/ecommerce/stores/${this.storeId}/products/${ProductID}`,
      })
      .catch((error) => {
        if (error.statusCode !== 404) {
          throw new Error(`Error getting product in mailchimp, ${error}`);
        }
        return null;
      });

    return result;
  }

  /**
   * Gets an order from Mailchimp. If not existing, returns null
   * @param OrderID
   */
  public async getOrder(OrderID: string) {
    return await this.api
      .get({
        path: `/ecommerce/stores/${this.storeId}/orders/${OrderID}`,
      })
      .catch((error) => {
        if (error.statusCode !== 404) {
          throw new Error(`Error getting mailchimp order, ${error}`);
        }
        return null;
      });
  }

  public async createProduct(product: { id: string }): Promise<string> {
    const res = await this.api.post({
      path: `/ecommerce/stores/${this.storeId}/products`,
      body: product,
    });

    assert.strictEqual(res.statusCode, 200);

    return product.id;
  }

  public async updateProduct(ProductId: string, data: unknown): Promise<void> {
    const Update = await this.api.patch({
      path: `/ecommerce/stores/${this.storeId}/products/${ProductId}`,
      body: data,
    });
    assert.strictEqual(Update.statusCode, 200);
  }

  public async addMemberToList(
    email: string,
    status: MailchimpMemberStatus,
  ): Promise<void> {
    await this.api.post({
      path: `/lists/${this.listId}/members`,
      body: {
        email_address: email,
        status,
      },
    });
  }

  /**
   * Updates a specific Mailchimp User. Get the user ID by creating an md5sum of the email address.
   * @param {string} md5sum
   * @param {object} data
   */
  public async updateUser(md5sum: string, data: unknown): Promise<void> {
    const Update = await this.api.patch({
      path: `/lists/${this.listId}/members/${md5sum}`,
      body: data,
    });
    assert.strictEqual(Update.statusCode, 200);
  }

  /**
   * Update the details of a specific order
   */
  public async updateOrder(orderId: string, data: unknown): Promise<void> {
    const Update = await this.api.patch({
      path: `/ecommerce/stores/${this.storeId}/orders/${orderId}`,
      body: data,
    });
    assert.strictEqual(Update.statusCode, 200);
  }

  /**
   * Creates and updates promo rules and codes in Mailchimp.
   * @param {*} param1 the voucher object
   * @param {string} param1.id the voucher and promo rule id (we use the same for both)
   * @param {string} param1.code the voucher code
   * @param {string} param1.start the beginning of the validity period
   * @param {string} param1.end the end of the validity period
   * @param {string} param1.type can be fixed or percentage. For free shipping set to fixed
   * @param {string} param1.target per_item, total, shipping
   * @param {integer} param1.count the usage count
   */
  public async voucherCreateAndUpdate({
    id,
    code,
    start,
    end,
    type,
    amount,
    target,
    description,
    count,
    url,
  }: {
    id: string;
    code: string;
    start: string;
    end: string;
    type: "fixed" | "percentage";
    amount: number;
    target: "per_item" | "total" | "shipping";
    description: string;
    count: number;
    url: string;
  }): Promise<void> {
    const checkExistence = await this.api
      .get({
        path: `/ecommerce/stores/${this.storeId}/promo-rules/${id}`,
      })
      .catch((error) => {
        if (error.statusCode === 404) {
          console.log("Promo Rule has to be created");
        } else {
          throw new Error("Error trying to get Promo Rule");
        }
      });
    const body = {
      id,
      starts_at: start,
      ends_at: end,
      type,
      amount,
      target,
      description,
    };
    removeEmpty(body);

    // when promo rule already exist, we patch, otherwise we create it.
    if (checkExistence) {
      await this.api
        .patch({
          path: `/ecommerce/stores/${this.storeId}/promo-rules/${id}`,
          body,
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      await this.api
        .post({
          path: `/ecommerce/stores/${this.storeId}/promo-rules`,
          body,
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // check if the code is already existing, else create it
    const checkCodeExistence = await this.api
      .get({
        path: `/ecommerce/stores/${this.storeId}/promo-rules/${id}/promo-codes/${id}`,
      })
      .catch((error) => {
        if (error.statusCode === 404) {
          console.log("Promo Code has to be created");
        } else {
          throw new Error("Error trying to get Promo Code");
        }
      });
    type CodeBody = {
      id?: string;
      code: string;
      usage_count: number;
      redemption_url: string;
    };
    const codebody: CodeBody = {
      code,
      usage_count: count,
      redemption_url: url,
    };
    if (checkCodeExistence) {
      await this.api.patch({
        path: `/ecommerce/stores/${this.storeId}/promo-rules/${id}/promo-codes/${id}`,
        body: codebody,
      });
    } else {
      codebody.id = id;
      await this.api.post({
        path: `/ecommerce/stores/${this.storeId}/promo-rules/${id}/promo-codes`,
        body: codebody,
      });
    }
  }

  /**
   * Get a specific ecommerce customer from Mailchimp. Checks, if customer already exist.
   * @param StoreId
   * @param customerID
   */
  public async getCustomer(customerID: string) {
    const user = await this.api
      .get({
        path: `/ecommerce/stores/${this.storeId}/customers/${customerID}`,
      })
      .catch((e) => {
        if (e.statusCode === 404) {
          console.log("This user could not be found in mailchimp");
        }
      });
    return user;
  }

  /**
   * This function sets the needed package information as metadata for a mailchimp user and creates a fulfillment afterwards
   */
  public async fulfillOrderInMailChimp(
    email: string,
    orderId: string,
    {
      tracking_number,
      carrier,
      tracking_portal_url,
    }: {
      tracking_number: string;
      carrier: string;
      tracking_portal_url?: string;
    },
  ): Promise<void> {
    const chimpId = this.getMailchimpIdFromEmail(email);

    this.logger.info(
      `Setting now Mailchimp merge fields for tracking number and carrier - Order Id ${orderId}`,
    );
    // set the metadata / merge fields for the specific user
    await this.updateUser(chimpId, {
      merge_fields: {
        MMERGE45: tracking_number,
        MMERGE46: carrier,
        MMERGE47: tracking_portal_url,
      },
    });

    const Update = {
      fulfillment_status: "shipped",
    };

    this.logger.info(
      `Updating the Mailchimp order with status fullfilled - Order Id ${orderId}`,
    );
    await this.updateOrder(orderId, Update);
  }
}
