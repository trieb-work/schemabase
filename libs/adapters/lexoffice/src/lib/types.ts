// category ID: 8f8664a8-fd86-11e1-a21f-0800200c9a66 = Warenverkäufe
export type LexOfficeVoucherItem = {
  amount: number
  taxAmount: number
  taxRatePercent: number
  categoryId: "8f8664a8-fd86-11e1-a21f-0800200c9a66"
}
export type VoucherStatus =
  | "draft"
  | "open"
  | "paid"
  | "paidoff"
  | "voided"
  | "overdue"
  | "accepted"
  | "rejected"
export type LexOfficeVoucher = {
  id: string
  voucherStatus: VoucherStatus
  voucherNumber: string
  totalGrossAmount: number
  files: []
}

export type LexofficeInvoiceObject = {
  type: "salesinvoice"
  voucherNumber: string
  voucherDate: string
  shippingDate?: string
  remark?: string
  voucherStatus: "open" | "paid" | "paidoff" | "voided" | "transferred" | "sepadebit"
  dueDate: string
  totalGrossAmount: number
  totalTaxAmount: number
  taxType: "gross"
  useCollectiveContact: boolean
  contactId?: string
  voucherItems: LexOfficeVoucherItem[]
  version: number
}
