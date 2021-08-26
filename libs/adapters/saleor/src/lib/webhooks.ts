import { Logger } from "tslog";

export type SaleorWebHookReceiver = {
  receive: (event: string) => Promise<void>;
};
export type SaleorWebHookServiceConfig = {
  logger: Logger;
};

export class Saleor implements SaleorWebHookReceiver {
  private logger: Logger;
  constructor(config: SaleorWebHookServiceConfig) {
    this.logger = config.logger;
  }

  public async receive(event: string): Promise<void> {
    // apply middleware

    switch (event) {
      case "customer_created":
        return await this.onCustomerCreated();

      case "order_created" || "order_confirmed":
        return await this.onOrderCreatedOrConfirmed();

      case "checkout_update":
        return await this.onCheckoutUpdate();

      case "order_fully_paid":
        return await this.onOrderFullyPayed();

      case "product_updated" || "product_created":
        return await this.onProductCreatedOrUpdated();

      default:
        throw new Error(`Unknown event: ${event}`);
    }
  }

  private async onCustomerCreated(): Promise<void> {
    this.logger.fatal("IMPLEMENT ME");
  }
  private async onOrderCreatedOrConfirmed(): Promise<void> {
    this.logger.fatal("IMPLEMENT ME");
  }
  private async onCheckoutUpdate(): Promise<void> {
    this.logger.fatal("IMPLEMENT ME");
  }
  private async onOrderFullyPayed(): Promise<void> {
    this.logger.fatal("IMPLEMENT ME");
  }
  private async onProductCreatedOrUpdated(): Promise<void> {
    this.logger.fatal("IMPLEMENT ME");
  }
}
