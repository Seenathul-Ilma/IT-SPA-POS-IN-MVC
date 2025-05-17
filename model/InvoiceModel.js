export default class InvoiceModel {
    constructor(invoiceId, orderId, customerName, items, totalAmount) {
        this.invoiceId = invoiceId;
        this.orderId = orderId;
        this.customerName = customerName;
        this.items = items;  // array of `OrderDetailModel` items
        this.totalAmount = totalAmount;
    }
}