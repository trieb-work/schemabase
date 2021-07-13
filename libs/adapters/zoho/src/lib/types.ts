export type LanguageCode = "de" | "en"
export type SalesOrderStatus = "confirmed" | "draft"
export type ContactPerson = {
  contact_person_id?: string
  contact_id?: string
  phone?: string
  mobile?: string
  last_name?: string
  first_name?: string
  email?: string
  is_primary_contact?: boolean
}
export type ContactPersonNonOptional = {
  contact_person_id: string
  contact_id: string
  phone: string
  mobile: string
  last_name: string
  first_name: string
  email: string
  is_primary_contact: boolean
}
export type TemplateName = "Vorkasse" | "Out_for_delivery" | "Paid_Invoice"
export type Entity = "salesorders" | "packages" | "invoices" | "shipmentorders"
export type invoiceStatus = "paid" | "void" | "unpaid" | "partially_paid"
export interface SalesOrderWithInvoicedAmount extends SalesOrderReturn {
  total_invoiced_amount: number
}
export type ZohoEmailTemplate = {
  email_template_id: string
  documents: []
  subject: string
  cc_me: boolean
  name: string
  placeholder: string
  is_default: boolean
  type_formatted: string
  type: string
}
export type Address = {
  address_id: string
  attention: string
  address: string
  street2: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  fax?: string
  update_existing_transactions_address?: "true" | "false"
}
export type AddressOptional = {
  address_id?: string
  attention?: string
  address: string
  street2?: string
  city?: string
  state?: string
  zip: string
  country?: string
  phone?: string
  fax?: string
  update_existing_transactions_address?: "true" | "false"
}
export interface ContactWithFullAddresses extends Contact {
  addresses: Address[]
}
export type LineItemOptional = {
  line_item_id?: string
  item_id?: string
  product_sku?: string
  sku?: "pf-dose-5-cj-dunkle"
  warehouse_id?: "116240000000067007"
  warehouses?: Warehouse[]
  warehouse_name?: "GIGATEC GmbH"
  account_id?: "116240000000000376"
  account_name?: "Verkäufe"
  salesorder_item_id?: string
  header_id?: ""
  header_name?: ""
  pricebook_id?: ""
  project_id?: ""
  time_entry_ids?: []
  expense_id?: ""
  item_type?: "inventory"
  product_id?: string
  variant_id?: string
  expense_receipt_name?: ""
  name?: string
  description?: ""
  item_order?: 1
  bcy_rate?: 19.9
  rate?: number
  purchase_rate?: 8.4
  quantity?: number
  unit?: "box"
  discount_amount?: 0.0
  discount?: number
  tax_id?: string
  tax_name?: "Reduziert - Temp"
  tax_type?: "tax"
  tax_percentage?: number
  item_total?: number
  item_total_inclusive_of_tax?: number
  tags?: []
  documents?: []
  item_custom_fields?: []
  bill_id?: ""
  bill_item_id?: ""
  is_combo_product?: true
  cost_amount?: 0
}

export type LineItem = {
  line_item_id: string
  item_id: string
  product_sku: string
  sku: "pf-dose-5-cj-dunkle"
  warehouse_id: "116240000000067007"
  warehouses: Warehouse[]
  warehouse_name: "GIGATEC GmbH"
  account_id: "116240000000000376"
  account_name: "Verkäufe"
  salesorder_item_id: string
  header_id: ""
  header_name: ""
  pricebook_id: ""
  project_id: ""
  time_entry_ids: []
  expense_id: ""
  item_type: "inventory"
  product_id: string
  variant_id: string
  expense_receipt_name: ""
  name: string
  description: ""
  item_order: 1
  bcy_rate: 19.9
  rate: number
  purchase_rate: 8.4
  quantity: number
  unit: "box"
  discount_amount: 0.0
  discount: number
  tax_id: string
  tax_name: "Reduziert - Temp"
  tax_type: "tax"
  tax_percentage: number
  item_total: number
  item_total_inclusive_of_tax: number
  tags: []
  documents: []
  item_custom_fields: []
  bill_id: ""
  bill_item_id: ""
  is_combo_product: true
  cost_amount: 0
}
export type Warehouse = {
  address: "Siegelsdorfer Str. 30"
  city: "Fürth"
  country: "Germany"
  email: "jannik@trieb.work"
  is_primary: true
  phone: ""
  sales_channels: []
  state: ""
  status: "active"
  status_formatted: "Active"
  warehouse_id: "116240000000067007"
  warehouse_name: "GIGATEC GmbH"
  zip: "90768"
}
export type CustomField = {
  customfield_id?: string
  show_in_store?: false
  show_in_portal?: false
  is_active?: true
  index?: 1
  label?: string
  show_on_pdf?: true
  edit_on_portal?: false
  edit_on_store?: false
  show_in_all_pdf?: true
  value_formatted?: "FERGEG"
  data_type?: "string"
  placeholder?: string
  value?: boolean | string
  api_name?: string
}
export type InvoiceSettings = {
  auto_generate: boolean
  prefix_string: "INV-"
  start_at: 216
  next_number: string
  quantity_precision: 2
  discount_type: "entity_level"
  is_discount_before_tax: false
  is_discount_tax_inclusive: false
  can_send_in_mail: false
  reference_text: ""
  default_template_id: "116240000000000103"
  notes: "Vielen Dank für Ihren Auftrag."
  terms: ""
  is_shipping_charge_required: true
  is_tax_on_shipping_required: false
  is_adjustment_required: true
  adjustment_description: "Adjustment"
  is_open_invoice_editable: true
  warn_convert_to_open: true
  warn_create_creditnotes: true
  warn_attach_expense_receipt: true
  attach_expense_receipt_to_invoice: false
  invoice_item_type: "product"
  is_show_invoice_setup: false
  is_sales_person_required: true
  is_sales_person_mandatory: false
  is_inclusive_tax: false
  is_sales_inclusive_tax_enabled: false
  sales_tax_type: "inclusive"
  entityfields: [
    {
      parent_field_name: "line_items"
      is_enabled: true
      is_configure_permission: true
      can_disable: false
      field_name_formatted: "Sales Price"
      can_show_in_pdf: false
      parent_field_data_type: "array"
      entity: "invoice"
      field_name: "rate"
      field_data_type: "amount"
    },
    {
      is_enabled: true
      is_configure_permission: false
      can_disable: false
      field_name_formatted: "Sales person"
      can_show_in_pdf: false
      entity: "invoice"
      field_name: "sales_person_id"
      field_data_type: "custom"
    },
    {
      is_enabled: false
      is_configure_permission: false
      can_disable: true
      field_name_formatted: "Subject"
      can_show_in_pdf: false
      entity: "invoice"
      field_name: "subject"
      field_data_type: "string"
    },
    {
      is_enabled: false
      is_configure_permission: false
      can_disable: true
      field_name_formatted: "E-Commerce Operator"
      can_show_in_pdf: false
      entity: "invoice"
      field_name: "merchant"
      field_data_type: "string"
    },
  ]
  tax_rounding_type: "not_configured"
  auto_number_uniqueness_yearly: false
}
export interface CustomerPayment {
  payment_id?: string
  payment_number?: "8"
  created_time?: "2020-11-16T11:18:10+0100"
  updated_time?: "2020-11-16T11:18:10+0100"
  payment_number_prefix?: ""
  payment_number_suffix?: "8"
  documents?: []
  customer_id?: string
  customer_name?: string
  payment_mode?: "onlinepayment" | "banktransfer"
  card_type?: ""
  date?: string
  offline_created_date_with_time?: ""
  account_id?: string
  account_name?: "Uneingezahlte Mittel"
  account_type?: "cash"
  currency_id?: "133274000000000071"
  currency_symbol?: "€"
  currency_code?: "EUR"
  exchange_rate?: 1.0
  amount?: number | string
  unused_amount?: 0.0
  bank_charges?: number
  tax_account_id?: ""
  is_client_review_settings_enabled?: false
  tax_account_name?: ""
  tax_amount_withheld?: 0.0
  discount_amount?: 0.0
  description?: ""
  reference_number?: ""
  online_transaction_id?: ""
  settlement_status?: ""
  invoices?: {
    invoice_number?: string
    invoice_payment_id?: "133274000000114088"
    invoice_id?: string
    amount_applied?: number | string
    tax_amount_withheld?: 0.0
    discount_amount?: 0.0
    total?: number
    balance?: 0.0
    date?: "2020-11-16"
    due_date?: "2020-11-16"
    price_precision?: 2
    apply_date?: ""
  }[]
  payment_refunds?: []
  last_four_digits?: ""
  template_id?: "133274000000002001"
  template_name?: "Elite Template"
  page_width?: "8.27in"
  page_height?: "11.69in"
  orientation?: "portrait"
  template_type?: "elite"
  attachment_name?: ""
  can_send_in_mail?: true
  can_send_payment_sms?: true
  is_payment_details_required?: true
  custom_fields?: {
    api_name: string
    value: string
  }[]
  custom_field_hash?: {}
  imported_transactions?: []
  [key: string]: any
}
export type InvoiceShortOverview = {
  invoice_id: string
  invoice_number: string
  reference_number: "STORE-285"
  status: InvoiceStatus
  date: "2020-11-14"
  due_date: "2020-11-14"
  total: number
  balance: number
}
export type DocumentShortOverview = {
  source_formatted: "Desktop"
  can_send_in_mail: boolean
  file_name: string
  file_type: "pdf"
  file_size_formatted: "1.3 MB"
  attachment_order: 1
  source: "desktop"
  document_id: string
  file_size: "1351952"
  alter_text: ""
}
export type InvoiceStatus =
  | "sent"
  | "draft"
  | "overdue"
  | "paid"
  | "void"
  | "unpaid"
  | "partially_paid"
  | "viewed"
export type PackageStatus = "not_shipped" | "shipped" | "delivered"
export type Package = {
  package_id: string
  package_number: string
  salesorder_number: string
  salesorder_id: string
  email: string
  customer_id: string
  contact_persons: string[]
  date: "2020-11-12"
  status: PackageStatus
  detailed_status: ""
  status_message: ""
  shipment_id: ""
  shipment_number: ""
  shipment_status: ""
  carrier: "DPD" | "DPD Germany"
  service: ""
  tracking_number: ""
  shipment_date: ""
  delivery_days: ""
  notes: string
  delivery_guarantee: false
  delivery_method: ""
  quantity: 1.0
  is_tracking_enabled: false
  custom_field_hash: {
    cf_label_printed: "false"
    cf_label_printed_unformatted: boolean
    cf_paypal_id: string
  }
  custom_fields: CustomField[]
  shipmentorder_custom_fields: CustomField[]
  comments?: {
    comment_id: string
    salesorder_id: "98644000000532069"
    description: string
    commented_by_id: "98644000000032001"
    commented_by: "Jannik Zinkl"
    comment_type: "internal"
    date: "2020-11-19"
    date_description: "vor ca. 1 Stunde"
    time: "7:01 PM"
    operation_type: ""
  }[]
  shipment_order: {
    shipment_id: string
    shipment_number: string
    shipment_date: ""
    shipment_date_with_time: ""
    tracking_number: ""
    delivery_date: ""
    delivery_date_with_time: ""
    shipment_type: ""
    associated_packages_count: 0
    carrier: ""
    service: ""
    delivery_days: ""
    delivery_guarantee: false
    tracking_url: ""
    is_carrier_shipment: false
    notes: string
  }
  shipping_address?: {
    address: string
    attention: string
    city: string
    country: string
    fax: ""
    phone: ""
    state: ""
    street2: ""
    zip: string
  }
  line_items: LineItem[]
}
export type SalesOrder = {
  salesorder_id?: string
  documents?: DocumentShortOverview[]
  salesorder_number?: string
  date?: string
  status?: SalesOrderStatus
  shipment_date?: ""
  reference_number?: string
  customer_id?: string
  customer_name?: string
  contact_persons?: string[]
  contact_person_details?: ContactPerson[]
  currency_id?: string
  currency_code?: string
  currency_symbol?: "€"
  exchange_rate?: number
  is_discount_before_tax?: boolean
  discount_type?: "item_level" | "entity_level"
  estimate_id?: ""
  delivery_method?: "DPD Germany" | "DHL" | ""
  delivery_method_id?: "116240000000037235"
  is_inclusive_tax?: boolean
  tax_rounding?: "item_level"
  order_status?: SalesOrderStatus
  invoiced_status?: "not_invoiced" | "invoiced"
  shipped_status?: "pending" | "shipped" | "partially_shipped"
  sales_channel?: "direct_sales"
  is_dropshipped?: boolean
  is_backordered?: false
  is_manually_fulfilled?: false
  has_qty_cancelled?: false
  is_offline_payment?: boolean
  created_by_email?: string
  total_quantity?: number
  line_items?: LineItem[]
  submitter_id?: ""
  approver_id?: ""
  submitted_date?: ""
  submitted_by?: ""
  price_precision?: 2
  is_emailed?: boolean
  has_unconfirmed_line_item?: boolean
  picklists?: []
  purchaseorders?: []
  warehouses?: [
    {
      warehouse_id: "116240000000067007"
      warehouse_name: "GIGATEC GmbH"
      address: "Siegelsdorfer Str. 30"
      city: "Fürth"
      state: ""
      country: "Germany"
      zip: "90768"
      phone: ""
      email: "jannik@trieb.work"
      is_primary: true
      status: "active"
      sales_channels: []
    },
  ]
  billing_address_id?: string
  billing_address?: {
    address: "Humboldtstr. 101"
    street2: ""
    city: "NÜRNBERG"
    state: ""
    zip: "90459"
    country: "Deutschland"
    country_code: "Deutschland"
    state_code: ""
    fax: ""
    phone: ""
    attention: "Jannik Zinkl"
  }
  shipping_address_id?: string
  shipping_address?: {
    address: "Humboldtstr. 101"
    street2: ""
    city: "NÜRNBERG"
    state: ""
    zip: "90459"
    country: "Deutschland"
    country_code: "Deutschland"
    state_code: ""
    fax: ""
    phone: ""
    attention: "Jannik Zinkl"
  }
  is_test_order?: false
  notes?: string
  terms?: ""
  payment_terms?: ""
  payment_terms_label?: ""
  custom_fields?: CustomField[]
  template_id?: "116240000000000111"
  template_name?: "Standard Template"
  page_width?: "8.27in"
  page_height?: "11.69in"
  orientation?: "portrait"
  template_type?: "standard"
  created_time?: "2020-11-07T00:54:16+0100"
  last_modified_time?: "2020-11-07T01:05:22+0100"
  created_by_id?: "116240000000032001"
  created_date?: "2020-11-07"
  last_modified_by_id?: "116240000000032001"
  attachment_name?: ""
  can_send_in_mail?: false
  salesperson_id?: ""
  salesperson_name?: ""
  merchant_id?: ""
  merchant_name?: ""
  discount?: string | number
  discount_applied_on_amount?: 0.0
  is_adv_tracking_in_package?: false
  shipping_charges?: {
    description?: "Shipping charge"
    bcy_rate?: 2.5
    rate?: 2.5
    tax_id?: "116240000000147001"
    tax_name?: "Reduziert - Temp"
    tax_type?: "tax"
    tax_percentage?: 5
    tax_total_fcy?: 0.12
    item_total?: 2.38
  }
  shipping_charge_tax_id?: string
  shipping_charge_tax_name?: "Reduziert - Temp (5%)"
  shipping_charge_tax_type?: "tax"
  shipping_charge_tax_percentage?: number
  shipping_charge_tax?: 0.12
  shipping_charge_exclusive_of_tax?: number
  shipping_charge_inclusive_of_tax?: number
  shipping_charge_tax_formatted?: "€0,12"
  shipping_charge_exclusive_of_tax_formatted?: "€2,38"
  shipping_charge_inclusive_of_tax_formatted?: "€2,50"
  shipping_charge?: number
  bcy_shipping_charge?: 2.5
  adjustment?: 0.0
  bcy_adjustment?: 0.0
  adjustment_description?: ""
  roundoff_value?: 0.0
  transaction_rounding_type?: "no_rounding"
  sub_total?: 18.95
  bcy_sub_total?: 18.95
  sub_total_inclusive_of_tax?: 0.0
  sub_total_exclusive_of_discount?: 18.95
  discount_total?: 0.0
  bcy_discount_total?: 0.0
  discount_percent?: number
  tax_total?: 1.07
  bcy_tax_total?: 0.95
  total?: 22.4
  bcy_total?: 22.4
  taxes?: [
    {
      tax_name?: "Reduziert - Temp (5%)"
      tax_amount?: 1.07
    },
  ]
  packages?: Package[]
  invoices?: InvoiceShortOverview[]
  salesreturns?: []
  payments?: []
  creditnotes?: []
  refunds?: []
  refundable_amount?: 0.0
  balance?: number
  approvers_list?: []
}
export interface SalesOrderReturn extends SalesOrder {
  salesorder_id: string
  date: string
  status: SalesOrderStatus
  shipping_charge: number
}
export type ContactSettings = {
  contact_id: string
  ach_supported: false
  source: "user"
  is_linked_with_zohocrm: boolean
  crm_owner_id: ""
  default_templates: {
    invoice_template_id: ""
    estimate_template_id: ""
    creditnote_template_id: ""
    purchaseorder_template_id: ""
    salesorder_template_id: ""
    retainerinvoice_template_id: ""
    bill_template_id: ""
  }
  display_name: string
  pricebook_id: ""
  is_base_currency: true
  name: string
  email_id: string
  contact_type: 1
  payment_terms: 0
  payment_terms_label: "Due On Receipt"
  customer_balance: 0.0
  credit_limit: 0.0
  unused_customer_credits: 0.0
  primary_contact_id: "116240000000378005"
  currency_id: "116240000000000071"
  currency_code: "EUR"
  currency_symbol: "€"
  price_precision: 2
  unbilled_expense_ids: []
  unbilled_projects: []
  active_projects: []
  notes: ""
  tags: []
  contact_category: ""
  gst_treatment: ""
  pricebook_name: ""
  contact_persons: ContactPersonNonOptional[]
  billing_address: {
    address_id: "116240000000378006"
    is_one_off_address: false
    attention: ""
    address: string
    street2: ""
    city: "München"
    state_code: ""
    state: ""
    zip: "81829"
    country: "Deutschland"
    phone: ""
    fax: ""
  }
  shipping_address: {
    address_id: "116240000000378008"
    is_one_off_address: false
    attention: ""
    address: ""
    street2: ""
    city: ""
    state: ""
    state_code: ""
    zip: ""
    country: ""
    phone: ""
    fax: ""
  }
}
export type Contact = {
  contact_id: string
  contact_name: string
  company_name: ""
  first_name: string
  last_name: string
  designation: ""
  department: ""
  website: ""
  language_code: "de" | "en"
  language_code_formatted: ""
  contact_salutation: ""
  email: string
  phone: ""
  mobile: ""
  portal_status: "disabled"
  is_client_review_asked: false
  has_transaction: true
  contact_type: "customer"
  customer_sub_type: "individual"
  owner_id: ""
  owner_name: ""
  source: "api"
  documents: []
  twitter: ""
  facebook: ""
  is_crm_customer: true
  is_linked_with_zohocrm: true
  primary_contact_id: string
  zcrm_account_id: "255832000001567661"
  zcrm_contact_id: "255832000001567677"
  crm_owner_id: ""
  payment_terms: 0
  payment_terms_label: "Fällig bei Erhalt"
  credit_limit_exceeded_amount: 0.0
  currency_id: "98644000000000071"
  currency_code: "EUR"
  currency_symbol: "€"
  price_precision: 2
  exchange_rate: ""
  can_show_customer_ob: false
  can_show_vendor_ob: false
  opening_balance_amount: 0.0
  opening_balance_amount_bcy: ""
  outstanding_ob_receivable_amount: 0.0
  outstanding_ob_payable_amount: 0.0
  outstanding_receivable_amount: 0.0
  outstanding_receivable_amount_bcy: 0.0
  outstanding_payable_amount: 0.0
  outstanding_payable_amount_bcy: 0.0
  unused_credits_receivable_amount: 0.0
  unused_credits_receivable_amount_bcy: 0.0
  unused_credits_payable_amount: 0.0
  unused_credits_payable_amount_bcy: 0.0
  unused_retainer_payments: 0.0
  status: "active"
  payment_reminder_enabled: true
  is_sms_enabled: true
  is_consent_agreed: false
  consent_date: ""
  is_client_review_settings_enabled: false
  custom_fields: CustomField[]
  custom_field_hash: {}
  contact_category: ""
  sales_channel: "direct_sales"
  ach_supported: false
  portal_receipt_count: 0
  opening_balances: []
  billing_address: Address
  shipping_address: Address
  contact_persons: ContactPerson[]
  pricebook_id: ""
  pricebook_name: ""
  default_templates: {
    invoice_template_id: ""
    invoice_template_name: ""
    bill_template_id: ""
    bill_template_name: ""
    estimate_template_id: ""
    estimate_template_name: ""
    creditnote_template_id: ""
    creditnote_template_name: ""
    purchaseorder_template_id: ""
    purchaseorder_template_name: ""
    salesorder_template_id: ""
    salesorder_template_name: ""
    retainerinvoice_template_id: ""
    retainerinvoice_template_name: ""
    paymentthankyou_template_id: ""
    paymentthankyou_template_name: ""
    retainerinvoice_paymentthankyou_template_id: ""
    retainerinvoice_paymentthankyou_template_name: ""
    invoice_email_template_id: ""
    invoice_email_template_name: ""
    estimate_email_template_id: ""
    estimate_email_template_name: ""
    creditnote_email_template_id: ""
    creditnote_email_template_name: ""
    purchaseorder_email_template_id: ""
    purchaseorder_email_template_name: ""
    salesorder_email_template_id: ""
    salesorder_email_template_name: ""
    retainerinvoice_email_template_id: ""
    retainerinvoice_email_template_name: ""
    paymentthankyou_email_template_id: ""
    paymentthankyou_email_template_name: ""
    payment_remittance_email_template_id: ""
    payment_remittance_email_template_name: ""
    retainerinvoice_paymentthankyou_email_template_id: ""
    retainerinvoice_paymentthankyou_email_template_name: ""
  }
  associated_with_square: false
  cards: []
  checks: []
  bank_accounts: []
  vpa_list: []
  notes: ""
  created_time: "2020-11-15T20:09:15+0100"
  last_modified_time: "2020-11-15T20:09:26+0100"
  tags: []
  zohopeople_client_id: ""
}
export type InvoiceOptional = {
  invoice_id?: string
  invoice_number?: string
  salesorder_id?: string
  salesorder_number?: string
  zcrm_potential_id?: ""
  zcrm_potential_name?: ""
  date?: string
  is_backorder?: boolean
  sales_channel?: "direct_sales"
  status?: InvoiceStatus
  color_code?: ""
  current_sub_status_id?: ""
  payment_terms?: 0
  payment_terms_label?: "Due On Receipt"
  due_date?: "2020-11-08"
  payment_expected_date?: ""
  payment_discount?: 0.0
  stop_reminder_until_payment_expected_date?: false
  last_payment_date?: ""
  reference_number?: string
  customer_id?: string
  estimate_id?: ""
  is_client_review_settings_enabled?: true
  contact_category?: ""
  customer_name?: "Jannik Zinkl"
  unused_retainer_payments?: 0.0
  contact_persons?: string[]
  currency_id?: "116240000000000071"
  currency_code?: "EUR"
  currency_symbol?: "€"
  exchange_rate?: 1.0
  discount?: 0.0
  discount_applied_on_amount?: 0.0
  is_discount_before_tax?: true
  discount_type?: "item_level"
  recurring_invoice_id?: ""
  documents?: []
  is_viewed_by_client?: false
  client_viewed_time?: ""
  is_inclusive_tax?: true
  tax_rounding?: "item_level"
  schedule_time?: ""
  no_of_copies?: 1
  show_no_of_copies?: true
  line_items?: LineItem[]
  submitter_id?: ""
  approver_id?: ""
  submitted_date?: ""
  submitted_by?: ""
  ach_supported?: false
  contact_persons_details?: ContactPerson[]
  salesorders?: [
    {
      salesorder_id: "116240000000288262"
      salesorder_number: "STORE-245"
      reference_number: "T3JkZXI6MjQ1"
      salesorder_order_status: "confirmed"
      total: 22.4
      sub_total: 18.95
      date: "2020-11-08"
      shipment_date: ""
    },
  ]
  shipping_charge_tax_id?: string
  shipping_charge_tax_name?: "Reduziert - Temp (5%)"
  shipping_charge_tax_type?: "tax"
  shipping_charge_tax_percentage?: number
  shipping_charge_tax?: 0.12
  shipping_charge_exclusive_of_tax?: 2.38
  shipping_charge_inclusive_of_tax?: 2.5
  shipping_charge_tax_formatted?: "€0,12"
  shipping_charge_exclusive_of_tax_formatted?: "€2,38"
  shipping_charge_inclusive_of_tax_formatted?: "€2,50"
  shipping_charge?: number
  adjustment?: 0.0
  roundoff_value?: 0.0
  adjustment_description?: ""
  transaction_rounding_type?: "no_rounding"
  sub_total?: 18.95
  tax_total?: 1.07
  discount_total?: 0.0
  total?: number
  discount_percent?: number
  bcy_shipping_charge?: 2.5
  bcy_adjustment?: 0.0
  bcy_sub_total?: 18.95
  bcy_discount_total?: 0.0
  bcy_tax_total?: 0.95
  bcy_total?: 22.4
  taxes?: [
    {
      tax_name: "Reduziert - Temp (5%)"
      tax_amount: 1.07
    },
  ]
  payment_reminder_enabled?: true
  can_send_invoice_sms?: true
  payment_made?: 0.0
  credits_applied?: 0.0
  tax_amount_withheld?: 0.0
  balance?: 22.4
  write_off_amount?: 0.0
  allow_partial_payments?: false
  price_precision?: 2
  payment_options?: {
    payment_gateways: []
  }
  is_emailed?: false
  reminders_sent?: 0
  last_reminder_sent_date?: ""
  next_reminder_date_formatted?: ""
  shipping_bills?: []
  billing_address?: Address
  billing_address_id?: string
  shipping_address?: Address
  customer_default_billing_address?: {
    zip: "90459"
    country: "Germany"
    address: "Humboldtstr."
    city: "NÜRNBERG, LICHTENHOF"
    phone: ""
    street2: "101"
    state: ""
    fax: ""
    state_code: ""
  }
  notes?: "Vielen Dank für Ihren Auftrag."
  terms?: ""
  custom_fields?: CustomField[]
  custom_field_hash?: {
    cf_zahlungs_id: "FERGEG"
    cf_zahlungs_id_unformatted: "FERGEG"
    cf_paypal_id: string
  }
  template_id?: "116240000000000103"
  template_name?: "Standard Template"
  template_type?: "standard"
  page_width?: "8.27in"
  page_height?: "11.69in"
  orientation?: "portrait"
  created_time?: "2020-11-08T16:10:06+0100"
  last_modified_time?: "2020-11-08T23:18:19+0100"
  created_date?: "2020-11-08"
  created_by_id?: "116240000000032001"
  last_modified_by_id?: "116240000000032001"
  attachment_name?: ""
  can_send_in_mail?: false
  salesperson_id?: ""
  salesperson_name?: ""
  merchant_id?: ""
  merchant_name?: ""
  ecomm_operator_id?: ""
  ecomm_operator_name?: ""
  is_autobill_enabled?: false
  invoice_url?: "https://zohosecurepay.eu/inventory/pfefferfrostdev/secure?CInvoiceID=2-62e0e15a7133b6a9920aaa27c92ae6b30fcb14379edd67503688beeb82b1b2925d0521f15aa1c0bc22358309f5b5599af3bf57fdbfe86fdb046c56a9383c4d955ff36ce7c9675220 "
  sub_total_inclusive_of_tax?: 0.0
  subject_content?: ""
  includes_package_tracking_info?: false
  approvers_list?: []
}
export type Invoice = {
  invoice_id: string
  invoice_number: string
  salesorder_id: string
  salesorder_number: string
  zcrm_potential_id: ""
  zcrm_potential_name: ""
  date: string
  is_backorder: boolean
  sales_channel: "direct_sales"
  status: InvoiceStatus
  color_code: ""
  current_sub_status_id: ""
  payment_terms: 0
  payment_terms_label: "Due On Receipt"
  due_date: "2020-11-08"
  payment_expected_date: ""
  payment_discount: 0.0
  stop_reminder_until_payment_expected_date: false
  last_payment_date: ""
  reference_number: string
  customer_id: string
  estimate_id: ""
  is_client_review_settings_enabled: true
  contact_category: ""
  customer_name: "Jannik Zinkl"
  unused_retainer_payments: 0.0
  contact_persons: string[]
  currency_id: "116240000000000071"
  currency_code: "EUR"
  currency_symbol: "€"
  exchange_rate: 1.0
  discount: 0.0
  discount_applied_on_amount: 0.0
  is_discount_before_tax: true
  discount_type: "item_level"
  recurring_invoice_id: ""
  documents: []
  is_viewed_by_client: false
  client_viewed_time: ""
  is_inclusive_tax: true
  tax_rounding: "item_level"
  schedule_time: ""
  no_of_copies: 1
  show_no_of_copies: true
  line_items: LineItem[]
  submitter_id: ""
  approver_id: ""
  submitted_date: ""
  submitted_by: ""
  ach_supported: false
  contact_persons_details: ContactPerson[]
  salesorders: [
    {
      salesorder_id: "116240000000288262"
      salesorder_number: "STORE-245"
      reference_number: "T3JkZXI6MjQ1"
      salesorder_order_status: "confirmed"
      total: 22.4
      sub_total: 18.95
      date: "2020-11-08"
      shipment_date: ""
    },
  ]
  shipping_charge_tax_id: string
  shipping_charge_tax_name: "Reduziert - Temp (5%)"
  shipping_charge_tax_type: "tax"
  shipping_charge_tax_percentage: number
  shipping_charge_tax: 0.12
  shipping_charge_exclusive_of_tax: 2.38
  shipping_charge_inclusive_of_tax: 2.5
  shipping_charge_tax_formatted: "€0,12"
  shipping_charge_exclusive_of_tax_formatted: "€2,38"
  shipping_charge_inclusive_of_tax_formatted: "€2,50"
  shipping_charge: number
  adjustment: 0.0
  roundoff_value: 0.0
  adjustment_description: ""
  transaction_rounding_type: "no_rounding"
  sub_total: 18.95
  tax_total: 1.07
  discount_total: 0.0
  total: number
  discount_percent: number
  bcy_shipping_charge: 2.5
  bcy_adjustment: 0.0
  bcy_sub_total: 18.95
  bcy_discount_total: 0.0
  bcy_tax_total: 0.95
  bcy_total: 22.4
  taxes: [
    {
      tax_name: "Reduziert - Temp (5%)"
      tax_amount: 1.07
    },
  ]
  payment_reminder_enabled: true
  can_send_invoice_sms: true
  payment_made: 0.0
  credits_applied: 0.0
  tax_amount_withheld: 0.0
  balance: 22.4
  write_off_amount: 0.0
  allow_partial_payments: false
  price_precision: 2
  payment_options: {
    payment_gateways: []
  }
  is_emailed: false
  reminders_sent: 0
  last_reminder_sent_date: ""
  next_reminder_date_formatted: ""
  shipping_bills: []
  billing_address: Address
  billing_address_id: string
  shipping_address: Address
  customer_default_billing_address: {
    zip: "90459"
    country: "Germany"
    address: string
    city: string
    phone: ""
    street2: "101"
    state: ""
    fax: ""
    state_code: ""
  }
  notes: "Vielen Dank für Ihren Auftrag."
  terms: ""
  custom_fields: CustomField[]
  custom_field_hash: {
    cf_zahlungs_id: "FERGEG"
    cf_zahlungs_id_unformatted: "FERGEG"
    cf_paypal_id: string
  }
  template_id: "116240000000000103"
  template_name: "Standard Template"
  template_type: "standard"
  page_width: "8.27in"
  page_height: "11.69in"
  orientation: "portrait"
  created_time: "2020-11-08T16:10:06+0100"
  last_modified_time: "2020-11-08T23:18:19+0100"
  created_date: "2020-11-08"
  created_by_id: "116240000000032001"
  last_modified_by_id: "116240000000032001"
  attachment_name: ""
  can_send_in_mail: false
  salesperson_id: ""
  salesperson_name: ""
  merchant_id: ""
  merchant_name: ""
  ecomm_operator_id: ""
  ecomm_operator_name: ""
  is_autobill_enabled: false
  invoice_url: string
  sub_total_inclusive_of_tax: 0.0
  subject_content: ""
  includes_package_tracking_info: false
  approvers_list: []
}
export type Bundle = {
  bundle_id: string
  date: string
  expected_bundle_date: ""
  composite_item_id: "98644000000108431"
  composite_item_name: "Dose - Charlotte Dumortier - Gemischt"
  composite_item_sku: "pf-dose-5-cd-gemischt"
  quantity_to_bundle: number
  description: ""
  reference_number: "BUN-00060"
  transaction_number: ""
  status: "completed"
  total: 210.0
  warehouse_id: "98644000000108128"
  warehouse_name: string
  created_time: "2020-12-02T10:45:15+0100"
  last_modified_time: "2020-12-02T10:45:16+0100"
  created_by_id: "98644000000116001"
  created_by_name: "gigatec Lager"
}

type AdditionalParams = {
  param_value: string
  param_name: string
}[]
export type Webhook = {
  webhook_id: string
  webhook_name: string
  placeholder: "wh_localhorst"
  description: ""
  url: string
  secret: string
  entity: "salesorder"
  entity_formatted: "Sales Order"
  method: "POST"
  entity_parameters: []
  user_defined_format_value: "%24%7BJSONString%7D"
  additional_parameters: AdditionalParams
  form_data: []
  user_defined_format_name: ""
  body_type: "application/x-www-form-urlencoded"
  query_parameters: []
  headers: []
}
export type WebhookUpdate = {
  webhook_name?: string
  description?: string
  url?: string
  secret?: string
  entity?: string
  entity_formatted?: "Sales Order"
  method?: string
  entity_parameters?: []
  user_defined_format_value?: string
  additional_parameters?: AdditionalParams
  form_data?: []
  user_defined_format_name?: string
  body_type?: "application/x-www-form-urlencoded"
  query_parameters?: []
  headers?: []
}
export type CustomFunctionSearch = {
  customfunction_id: string
  function_name: string
  placeholder: "fn_test_invoice_eci"
  entity: "invoice"
  description: "This custom function is triggering the eci-backend for certain invoice events"
  created_time: "2021-02-13T18:23:32+0100"
  related_rules: {
    workflow_id: string
    workflow_name: string
  }[]
}

export type CustomFunction = {
  function_name: string
  description: string
  entity: string
  script: string
  include_orgvariables_params: boolean
}

export type WebhookSearch = {
  webhook_id: string
  webhook_name: "All Salesorders trigger"
  description: ""
  placeholder: ""
  url: string
  entity: Entity
  method: "POST"
  created_time: "2020-04-27T12:22:39+0200"
  related_rules: {
    workflow_id: string
    workflow_name: string
  }[]
}

export type Tax = {
  tax_specific_type: string
  tax_percentage_formatted: string
  is_value_added: boolean
  is_editable: boolean
  tax_id: string
  deleted: boolean
  tax_type: string
  tax_percentage: number
}
