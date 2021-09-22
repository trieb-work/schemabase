import { Topic, entryValidation } from "@eci/events/strapi";
import { z } from "zod";
import { ZohoClientInstance } from "@trieb.work/zoho-ts";

const statusValidation = z.enum(["Draft", "Confirmed"]);

const modelValidation = z.object({
  event: z.enum([Topic.ENTRY_CREATE, Topic.ENTRY_UPDATE]),
  model: z.enum(["auftrag"]),
  entry: z.object({
    Status: statusValidation,
    zohoCustomerId: z.string(),
  }),
  zohoClient: z.instanceof(ZohoClientInstance),
});

export type StrapiOrdersToZohoConfig = z.infer<typeof entryValidation> &
  z.infer<typeof modelValidation>;

export class integrationsStrapiOrdersToZoho {
  public readonly config: StrapiOrdersToZohoConfig;

  public readonly status: z.infer<typeof statusValidation>;

  public readonly orderPrefix: string;

  public zohoClient: ZohoClientInstance;

  public constructor(config: StrapiOrdersToZohoConfig) {
    this.config = config;
    this.status = config.entry.Status;
    this.orderPrefix = `RP-${config.entry.id}-`;
    this.zohoClient = config.zohoClient;
  }

  /**
   * Internal function to easily get an overview over all orders
   */
  private async fetchOrdersStatus() {
    return await this.zohoClient.searchSalesOrdersWithScrolling(
      this.orderPrefix,
    );
  }

  public async createOrUpdate() {
    switch (this.status) {
      case "Draft": {
        const currentOrders = await this.fetchOrdersStatus();
        console.log(currentOrders);

        break;
      }
      case "Confirmed":
        break;
      default:
        break;
    }
  }
}
