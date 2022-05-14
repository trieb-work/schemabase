import { ILogger } from "@eci/pkg/logger";

interface PaymentListGatewaysResponse {
  id: string;
  name: string;
  currencies: string[];
  config:
    | {
        field: string;
        value: string;
      }[]
    | [];
}

export interface VorkasseService {
  paymentListGateways: (
    currency: "USD" | "EUR",
  ) => Promise<PaymentListGatewaysResponse[]>;
}

export interface VorkasseServiceConfig {
  logger: ILogger;
}

export class VorkassePaymentService implements VorkasseService {
  private readonly logger: ILogger;

  public constructor(config: VorkasseServiceConfig) {
    this.logger = config.logger;
  }

  public async paymentListGateways(
    currency: "USD" | "EUR",
  ): Promise<PaymentListGatewaysResponse[]> {
    if (currency !== "EUR") {
      this.logger.error("We can only handle payments in EUR");
      throw new Error("We can only handle payments in EUR");
    }

    const vorkasseReturnObject = [
      {
        id: "triebwork.payments.rechnung",
        name: "Vorkasse",
        currencies: ["EUR"],
        config: [],
      },
    ];

    return vorkasseReturnObject;
  }
}
