import { AppPermission, WebhookManifest } from "@saleor/app-sdk/types";

const getPermissions = (): AppPermission[] => {
    return ["HANDLE_PAYMENTS"];
};
const getName = () => "pre-payment";

const getWebhookManifest = (baseUrl: string): WebhookManifest[] => {
    const syncWebhook: WebhookManifest = {
        name: "Payment processing",
        targetUrl: `${baseUrl}/api/saleor/syncwebhook/v1/prepayment`,
        query: `
    subscription {
      event {
        ... on PaymentAuthorize {
          __typename
        }
        ... on PaymentListGateways {
          __typename
        }
        ... on PaymentCaptureEvent {
          __typename
        }    
        ... on PaymentConfirmEvent {
          __typename
        }   
        ... on PaymentProcessEvent {
          __typename
        } 
        ... on PaymentVoidEvent {
          __typename
        } 
        ... on PaymentRefundEvent {
          __typename
        }     
      }
    }
      `,
        syncEvents: [
            "PAYMENT_AUTHORIZE",
            "PAYMENT_CAPTURE",
            "PAYMENT_CONFIRM",
            "PAYMENT_LIST_GATEWAYS",
            "PAYMENT_PROCESS",
            "PAYMENT_REFUND",
            "PAYMENT_VOID",
        ] as any,
    };
    return [syncWebhook];
};

export const prepayment = { getPermissions, getWebhookManifest, getName };
