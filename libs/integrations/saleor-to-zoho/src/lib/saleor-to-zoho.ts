


export class SaleorToZohoIntegration {
  private readonly logger: ILogger

  private readonly saleorValidatior: SaleorValidator;
  private readonly zohoApi: ZohoApi;



  /**
   * Create a new contact in zoho if it doesn't exist yet.
   */
  syncCustomer(customer: Customer): Promise<void> {}

  /**
   * Cretea a new payment in zoho
   */
  syncPayment(payment: Payment): Promise<void> {}

}
