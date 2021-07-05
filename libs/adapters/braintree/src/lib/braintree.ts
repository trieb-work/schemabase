import braintree from "braintree"

type BraintreeConfig = {
  merchantId: string
  publicKey: string
  privateKey: string
}

export default class Braintree {
  private merchantId: string
  private publicKey: string
  private privateKey: string
  private gateway: braintree.BraintreeGateway

  constructor(config: BraintreeConfig) {
    this.merchantId = config.merchantId
    this.publicKey = config.publicKey
    this.privateKey = config.privateKey

    this.gateway = new braintree.BraintreeGateway({
      environment:
        process.env["APM_ENV"] === "dev"
          ? braintree.Environment.Sandbox
          : braintree.Environment.Production,
      merchantId: this.merchantId,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
    })
  }

  public async getTransaction(transactionId: string): Promise<braintree.Transaction> {
    const details = await this.gateway.transaction.find(transactionId)
    return details as braintree.Transaction
  }
}
