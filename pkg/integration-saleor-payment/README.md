This integration is used to handle synchronous webhook requests from saleor for payments. It can be used to add additional payment gateways and to handle payments in general.
This is a blocking service! So we should respond to these requests as fast as possible.

# Install Payment Webhook in Saleor

We need to add a seperate "Synchronuous Webhook" in saleor for payment purposes. Here is the GraphQL mutation:

```
mutation {
  webhookCreate(
    input: {
      app: "QXBwOjE3"
      name: "Sync Webhook"
      events: [PAYMENT_LIST_GATEWAYS, PAYMENT_CAPTURE, PAYMENT_CONFIRM, PAYMENT_PROCESS, PAYMENT_AUTHORIZE, PAYMENT_VOID]
      targetUrl: "https://eci-v2.vercel.triebwork.com/api/saleor/webhook/v1/pk_62Uz41zGmwuEGxYNGYXxKJ"
      secretKey: "sk_3u7qt7v5WAHJsV3wToSbJs"
    }
  )
  {errors{field message}}
}
```
