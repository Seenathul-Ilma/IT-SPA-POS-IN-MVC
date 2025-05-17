import {invoices} from "../db/DB.js";

//////////////////// Invoice / Order history Related jQueries /////////////////////////////
//let invoices = [];

export function updateInvoiceTable() {
    $("#invoice_tbody").empty(); // Clear previous data

    if (invoices.length === 0) {
        alert("No Invoices Available..!");
        return;
    }

    let orderDate = new Date().toLocaleDateString('en-LK');


    invoices.forEach(invoice => {
        const row = `
                    <tr>
                        <th scope="row">${invoice.invoiceId}</th>
                        <td>${invoice.orderId}</td>
                        <td>${invoice.customerName}</td>
                        <td>${orderDate}</td>
                        <td>${invoice.totalAmount.toFixed(2)}</td>
                        <td>
                            <button class="btn btn-light text-dark btn-sm print_invoice_btn" data-id="${invoice.orderId}" style="width: 30px; height: 30px; padding: 0; font-size: 20px">
                                <i class="ti ti-printer"></i>
                            </button>
                        </td>
                    </tr>
                 `;
        $("#invoice_tbody").append(row);
    });
}

$(document).on("click", ".print_invoice_btn", function () {
    const receiptId = $(this).data("id");

    // Find the invoice details
    const invoice = invoices.find(inv => inv.orderId === receiptId);
    if (!invoice) {
        Swal.fire({
            icon: 'error',
            title: 'Invoice not found!',
            text: 'Something went wrong, please try again.',
        });
        return;
    }

    const items = invoice.items;
    const date = invoice.date || new Date().toLocaleDateString('en-LK');
    const time = new Date().toLocaleTimeString('en-LK', {hour: '2-digit', minute: '2-digit'});
    const subTotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const tax = 0;
    const total = subTotal + tax;

    populateInvoice(items, receiptId, date, time, subTotal, tax, total);
});

function populateInvoice(items, receiptId, date, time, subTotal, tax, total) {
    const modalHtml = `
                    <div class="modal fade" id="invoiceModal" tabindex="-1" aria-labelledby="invoiceModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
                            <div class="modal-content">
                                <div class="modal-header bg-dark text-white">
                                <h5 class="modal-title" id="invoiceModalLabel"><i class="ti ti-receipt"></i> RECEIPT</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="container-fluid">
                                    <div class="text-center mb-3">
                                        <h6 class="mb-0">Bite Of Bliss</h6>
                                        <p class="mb-0 small">31/5z, Main Street, Kalutara South</p>
                                        <p class="mb-0 small">Email: bob@gmail.com</p>
                                        <p class="small">Phone: +94712345678</p>
                                    </div>
                                    <hr class="my-2">
                                    <div class="row mb-2">
                                        <div class="col-8">Reciept Id: ${receiptId}</div>
                                        <div class="col-4 text-end">Invoice No: ${invoices.length}</div>
                                        <div class="col-8">Date: ${date}</div>
                                        <div class="col-4 text-end">Time: ${time}</div>
                                    </div>
                                    <hr class="my-2">
                                    <div id="invoice-items">
                                        ${items.map(item => `
                                            <div class="row">
                                                <div class="col-7">${item.name}${item.quantity ? ' x ' + item.quantity : ''}</div>
                                                <div class="col-5 text-end">Rs. ${(item.price * (item.quantity || 1)).toFixed(2)}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <hr class="my-2">
                                    <div class="row">
                                        <div class="col-7">Sub Total</div>
                                        <div class="col-5 text-end">Rs. ${subTotal.toFixed(2)}</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-7">+ Tax</div>
                                        <div class="col-5 text-end">Rs. ${tax.toFixed(2)}</div>
                                    </div>
                                    <hr class="my-2">
                                    <div class="row">
                                        <div class="col-7"><strong>Total</strong></div>
                                        <div class="col-5 text-end"><strong>Rs. ${total.toFixed(2)}</strong></div>
                                    </div>
                                    <hr class="my-3">
                                    <div class="text-center">
                                        <p class="small">Thank You For Visiting!</p>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-dark">Print</button>
                            </div>
                        </div>
                    </div>
                </div>`;

    $("#invoiceModal").remove();

    $("body").append(modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("invoiceModal"));
    modal.show();
}
