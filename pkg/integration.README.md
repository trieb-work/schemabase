## High-level view of the sync jobs and it's dependencies
### Preparation:
```javascript
    // sync saleor paymentGateways to ECI (and create saleoPaymentGateway & paymentMethod)
    await saleorPaymentGatewaySyncService.syncToECI();

    // Sync zoho bank accounts to ECI
    await zohoBankAccountsSyncService.syncToECI();

    // manually connect Zoho Bank accounts with payment methods

    // sync saleor warehouses to ECI (and create warehouses)
    await saleorWarehouseSyncService.syncToECI();

    // sync saleor products to ECI (and create product & productVariants)
    await saleorProductSyncService.syncToECI();

    // sync zoho items to ECI (and connect them with product variants)
    await zohoItemSyncService.syncToECI();

    // sync zoho taxes to ECI (and create zohoTax & tax)
    await zohoTaySyncService.syncToECI();
```


### Order and sub-entities to ECI:
```javascript
    // sync payments from saleor to ECI (and connect them with payment method)
    await saleorPaymentSyncService.syncToECI();
    
    // sync all transaction fees from braintree to ECI (and connectOrCreate them with a payment & connectOrCreate payment method)
    await braintreeTransactionSyncService.syncToECI();

    // sync all orders from saleor to ECI 
    //      and connectOrCreate company
    //      and mainContact: connectOrCreate Contact
    //      and upsert saleorOrder with connectOrCreate Order
    //      and upsert saleorOrderLineItem with connectOrCreate orderLineItem with connect tax, warehouse, productVariant, order
    //      sync addresses of mainContact.id (billingAddress: connectOrCreate Address & shippingAddress: connectOrCreate Address)
    await saleorOrderSyncService.syncToECI();
```

### Order and sub-entities to Zoho:
```javascript
    // sync all contacts to zoho contacts & zoho contact persons from ECI
    // also sync all addresses to zoho addresses and connect them with zoho contacts/contact persons
    await zohoContactSyncService.syncFromECI();

    // sync all orders to zoho salesorders from ECI (and connect salesorder in zoho with: tax, items, warehouses, customer_id: mainCoctact, addresses, contact_persons:[mainContact.contactPerson])
    await zohoSalesOrdersSyncService.syncFromECI();

    // create invoices from zoho salesorders and sync the created invoices back to ECI DB (creates ECI invoice & zoho invocie in ECI DB)
    await zohoSalesOrdersSyncService.syncFromECI_autocreateInvoiceFromSalesorder();

    // sync all payments to zoho from ECI (and connect the payments in zoho with: order.invoices and the order.mainContact)
    await zohoPaymentSyncService.syncFromECI();
```

### Order-Package to Logistics and status (trackingnumber) back from logistics:
```javascript
    // TODO 
```