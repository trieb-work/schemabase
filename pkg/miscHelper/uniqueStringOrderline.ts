const uniqueStringOrderLine = (
  orderNumber: string,
  sku: string,
  quantity: number,
) => {
  return `${orderNumber}${sku}${quantity}`;
};
export { uniqueStringOrderLine };
