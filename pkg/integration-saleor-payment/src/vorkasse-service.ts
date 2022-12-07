/* eslint-disable camelcase */
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

interface PaymentProcess {
  action_required: boolean;
  kind:
    | "action_to_confirm"
    | "auth"
    | "cancel"
    | "capture"
    | "capture_failed"
    | "confirm"
    | "external"
    | "pending"
    | "refund"
    | "refund_failed"
    | "refund_ongoing"
    | "refund_reversed"
    | "void";
  transaction_id?: string;
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
        config: [
          {
            field: "transaction_id",
            value: (Math.random() + 1).toString(36).substring(2),
          },
        ],
      },
    ];

    return vorkasseReturnObject;
  }

  public async paymentProcess(): Promise<PaymentProcess> {
    const returnObject: PaymentProcess = {
      action_required: false,
      kind: "auth",
      // action_required_data: {
      // confirmation_url: "https://www.example.com/3ds-confirmation/",
      // },
      // customer_id: "customer-1234",
      // payment_method: {
      //   brand: "Visa",
      //   exp_month: "01",
      //   exp_year: "2025",
      //   last_4: "4242",
      //   name: "John Doe",
      //   type: "Credit card",
      // },

      transaction_id: (Math.random() + 1).toString(36).substring(2),
    };
    return returnObject;
  }

  public async paymentConfirm(): Promise<PaymentProcess> {
    return {
      action_required: false,
      kind: "capture",
    };
  }

  public async paymentVoid(): Promise<PaymentProcess> {
    return {
      action_required: false,
      kind: "void",
    };
  }

  public async paymentCapture(): Promise<PaymentProcess> {
    return {
      action_required: false,
      kind: "capture",
    };
  }
}
