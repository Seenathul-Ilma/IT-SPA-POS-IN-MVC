import {customer_db, item_db, orders_db, invoices} from "../db/DB.js";
import OrdersModel from "../model/OrdersModel.js";
import OrderDetailModel from '../model/OrderDetailModel.js';
import InvoiceModel from '../model/InvoiceModel.js';
import { loadItemsOnTable } from "./ItemController.js";
import {updateInvoiceTable} from "./InvoiceController.js";

// Sample items array (can be fetched from backend too)
let available_items = [];

$(document).ready(function () {
    $("#search_order_item_input").prop("disabled", true);
    $("#search_order_item_btn").prop("disabled", true);
    $("#search_customer_input").prop("disabled", true);
    $("#search_customer_btn").prop("disabled", true);
    $("#finalize-order-place-btn").prop("disabled", true);
    $("#order-available-item-card").css("pointer-events", "none").css("opacity", "0.6");
    $("#order-items-card").css("pointer-events", "none").css("opacity", "0.6");

    syncCustomers();

    /*available_items = [
        {name: "Toffee", price: 15.00, qoh: 20},
        {name: "Cake", price: 1200.00, qoh: 5},
        {name: "Chocolate", price: 160.00, qoh: 50},
        {name: "Lollipop", price: 10.00, qoh: 100},
        {name: "Biscuit", price: 100.00, qoh: 40},
        {name: "Marshmallows", price: 150.00, qoh: 80}
    ];*/
    //renderItems();
});

export function syncAvailableItems() {
    available_items = item_db
        .filter(item => item.qoh > 0) // Exclude items with QoH <= 0
        .map(item => ({
            name: item.name,
            price: parseFloat(item.price),
            qoh: parseInt(item.qoh)
        }));
    renderItems();
}

function renderItems(filter = "") {
    const container = $("#order_item_tbody");
    container.empty();

    $.each(available_items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase())), function (index, item) {
        const card = `
                    <div class="col-6 col-md-6 mb-3">
                        <div class="card h-100 bg-light text-dark shadow-sm">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div class="text-start">
                                    <h6 class="card-title mb-1">${item.name}</h6>
                                    <p class="card-text mb-2">Rs. ${item.price.toFixed(2)}</p>
                                </div>
                                <div class="text-end mt-auto">
                                    <button class="btn btn-transparent border-0 btn-sm add_to_cart_btn" data-index="${index}">
                                        <i class="bi bi-cart4 fs-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        container.append(card);
    });
}

//renderItems();

// Search filter (live typing)
$("#search_order_item_input").on("keyup", function () {
    renderItems($(this).val());
});

// Search button
$("#search_order_item_btn").on("click", function (e) {
    e.preventDefault();
    renderItems($("#search_order_item_input").val());
});


// get Customer list
/*const customerList = [
    {id: "C001", name: "John"},
    {id: "C002", name: "Mary"},
    {id: "C003", name: "Nimal"},
    {id: "C004", name: "Jeeva"},
    {id: "C005", name: "Priya"},
    {id: "C006", name: "Akshay"}
];*/
let customerList = [];
const datalist_customers = $("#customerDropdown");
/*
const datalist_customers = $("#customerDatalistOptions");
*/

export function syncCustomers() {
    customerList = customer_db;

    datalist_customers.find("option:not(:first)").remove();

    $.each(customerList, function (index, customer) {
        let customerOption = `<option value="${customer.name}">${customer.name}</option>`;
        datalist_customers.append(customerOption);
    });
}

/*$(document).ready(function () {
    syncCustomers();
});*/

// add items to cart
$(document).on("click", ".add_to_cart_btn", function () {
    const index = $(this).data("index");
    const item = available_items[index];
    let count = 1;
    let itemTotalAmount = item.price * count;
    const cartCard = `
                    <div class="col-12 col-md-12 mb-3">
                        <div class="card h-100 bg-light text-dark shadow-sm">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div class="text-start">
                                    <h6 class="card-title mb-1">${item.name} x <span class="item-cart-count-display">${count}</span></h6>
                                    <p class="card-text mb-2 item-total">Rs. ${item.price.toFixed(2)} x <span class="item-cart-count-display">${count}</span> = <span class="item-total-amount">${itemTotalAmount.toFixed(2)}</span></p>
                                    <button class="btn btn-outline-dark rounded-circle btn-dark text-white btn-sm me-1 increaseCount" style="width: 20px; height: 20px; padding: 0;"><i class="ti ti-plus"></i></button><span class="item-cart-count">${count}</span>
                                    <button class="btn btn-outline-dark rounded-circle btn-dark text-white btn-sm me-1 decreaseCount" style="width: 20px; height: 20px; padding: 0;"><i class="ti ti-minus"></i></button>
                                </div>
                                <div class="text-end mt-auto">
                                    <button class="btn btn-transparent text-danger border-0 btn-sm remove_from_cart_btn"><i class="bi bi-trash3-fill fs-5"></i></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    $("#item_cart").append(cartCard);
});

$(document).on('click', ".increaseCount", function () {
    const cardBody = $(this).closest(".card-body");
    const countDisplay = cardBody.find(".item-cart-count-display");
    const countSpans = cardBody.find(".item-cart-count");
    const totalItemAmountText = cardBody.find(".item-total-amount");
    const item = cardBody.find(".card-title").text().split(" x ")[0].trim();
    const price = available_items.find(i => i.name === item).price;
    const itemData = available_items.find(i => i.name === item);

    let count = parseInt($(countSpans[0]).text());
    count++;

    // Check quantity limit
    if (count > itemData.qoh) {
        alert(`Only ${itemData.qoh} ${item}(s) available.`);
        return;
    }

    countSpans.text(count);
    countDisplay.text(count);

    totalItemAmountText.text((price * count).toFixed(2));
});

$(document).on('click', ".decreaseCount", function () {
    const cardBody = $(this).closest(".card-body");
    const countDisplay = cardBody.find(".item-cart-count-display");
    const countSpans = cardBody.find(".item-cart-count");
    const totalItemAmountText = cardBody.find(".item-total-amount");
    const item = cardBody.find(".card-title").text().split(" x ")[0].trim();
    const price = available_items.find(i => i.name === item).price;
    //const itemData = items.find(i => i.name === item);

    let count = parseInt($(countSpans[0]).text());
    count--;

    // Check quantity limit
    if (count < 1) {
        return;
    }

    countSpans.text(count);
    countDisplay.text(count);

    totalItemAmountText.text((price * count).toFixed(2));
    syncAvailableItems();
});

$(document).on("click", ".remove_from_cart_btn", function () {
    $(this).closest(".col-12").remove();
});

$(document).on("click", "#finalize-order-place-btn", function (e) {
    e.preventDefault();

    const customerName = $("#customerDropdown").val();
    if (!customerName) {
        Swal.fire({
            icon: 'error',
            title: 'Customer not selected!',
            text: 'Please select a valid customer before placing the order.',
        });
        return;
    }

    const customer = customerList.find(c => c.name === customerName);
    if (!customer) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid customer!',
            text: 'Selected customer does not exist.',
        });
        return;
    }

    const cartItems = $("#item_cart").children(".col-12, .col-md-12");

    if (cartItems.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cart is empty!',
            text: 'Please add items before placing the order.',
        });
        return;
    }

    // to get order details
    const orderId = $("#next_order_id").val();
    const orderedItems = [];

    cartItems.each(function () {
        const itemName = $(this).find(".card-title").text().split(" x ")[0].trim();
        const itemQuantity = parseInt($(this).find(".item-cart-count").text().trim());
        const itemPrice = Number(available_items.find(i => i.name === itemName).price);

        /*const item = {name: itemName, quantity: itemQuantity, price: itemPrice};*/
        const orderDetail = new OrderDetailModel(itemName, itemQuantity, itemPrice);
        orderedItems.push(orderDetail);
        console.log("Item:", orderDetail.name, "Price:", orderDetail.price, "Quantity:", orderDetail.quantity);
        console.log("Raw quantity text:", $(this).find(".item-cart-count").text());

    });

    /*const order = {
        orderId: orderId,
        customer: customerName,
        available_items: orderedItems
    };*/

    const order = new OrdersModel(orderId, customerName, orderedItems);

    orders_db.push(order);

    const totalAmount = orderedItems.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
    console.log("Item Prices:", orderedItems.map(item => item.price));
    console.log("Calculated Total:", totalAmount);

    /*const invoice = {
        invoiceId: invoices.length + 1 ,
        orderId: orderId,
        customerName: customerName,
        items: orderedItems,
        totalAmount: Number(totalAmount.toFixed(2))
    }*/
    const invoice = new InvoiceModel(
        invoices.length + 1,  // invoiceId
        orderId,              // orderId
        customerName,         // customerName
        orderedItems,         // items (array of OrderDetailModel)
        Number(totalAmount.toFixed(2)) // to format totalAmount in 2 decimal place
    );

    invoices.push(invoice);
    console.log("Invoices Data:", invoices);
    updateInvoiceTable();

    // If cart is not empty
    Swal.fire({
        icon: 'success',
        title: 'Order placed!',
        text: 'Your order has been successfully submitted.',
        confirmButtonText: 'OK'
    }).then(() => {
        const order = {
            orderId: $('#next_order_id').val(),
            customer: customer.id,
            available_items: []
        };

        orderedItems.forEach(item => {
            const inventoryItem = item_db.find(i => i.name === item.name);
            if (inventoryItem) {
                if (inventoryItem.qoh - item.quantity < 0) {
                    console.error(`Insufficient stock for ${item.name}.`);
                    return; // Prevent QoH from going negative
                }

                inventoryItem.qoh -= item.quantity; // Reduce stock
                console.log(`Updated QoH for ${item.name}:`, inventoryItem.qoh);

                // Ensure item_db updates correctly
                const itemIndex = item_db.findIndex(i => i.name === item.name);
                if (itemIndex !== -1) {
                    item_db[itemIndex].qoh = inventoryItem.qoh;
                }
            }
        });
        console.log(item_db);
        console.log(available_items);
        syncAvailableItems();
        loadItemsOnTable();

        console.log("updated item db: "+item_db);
        console.log("updated available items: "+available_items);

        $("#item_cart").empty();

        generateNextOrderId();
        $("#customerDropdown").val(""); // Clear the customer dropdown to default option
        /*$("#search_item_input").prop("disabled", true);
        $("#search_item_btn").prop("disabled", true);
        $("#search_customer_input").prop("disabled", true);
        $("#search_customer_btn").prop("disabled", true);
        $("#finalize-order-place-btn").prop("disabled", true);
        $(".card-body").css("pointer-events", "none").css("opacity", "0.6");*/

    });
});

$(document).on("click", "#new_order_btn", function () {
    $("#search_order_item_input").prop("disabled", false);
    $("#search_order_item_btn").prop("disabled", false);
    $("#search_customer_input").prop("disabled", false);
    $("#search_customer_btn").prop("disabled", false);
    $("#finalize-order-place-btn").prop("disabled", false);
    $("#order-available-item-card").css("pointer-events", "auto").css("opacity", "1");
    $("#order-items-card").css("pointer-events", "auto").css("opacity", "1");

    generateNextOrderId();
});

function generateNextOrderId() {
    const nextOrderId = 'OR' + String(orders_db.length + 1).padStart(3, '0');
    $('#next_order_id').val(nextOrderId);
}
