export default class OrdersModel {
    constructor(orderId, customerName, orderedItems) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.orderedItems = orderedItems; // array of {name, price, quantity}
    }
}