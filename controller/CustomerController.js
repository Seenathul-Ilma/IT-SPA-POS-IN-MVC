import {customer_db} from "../db/DB.js";
import CustomerModel from "../model/CustomerModel.js";
import { syncCustomers } from "./PlaceOrderController.js";

//////////////////// Customer Related jQueries /////////////////////////////

// To store customer details on an array / db
//let customer_db = [];

// to search customer by a data
$(document).ready(function () {
    function filterCustomers() {
        var value = $(this).val().toLowerCase();
        $("#customer_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    }

    // to filter customer at live (while typing)
    $("#search_input").on("keyup", filterCustomers);

    // to filter customer after click search btn
    $('#search_btn').on('click', function (e) {
        e.preventDefault();
        filterCustomers();
    });
});

let selectedCustomerIndex = -1;

generateNextCustomerId();

// to load stored customer details on the table
function loadCustomersOnTable() {

    $('#customer_tbody').empty();

    customer_db.map((item, index) => {
        let name = item.name;
        let phone = item.phone;
        let address = item.address;

        let data = `<tr>
                      <td>${'C' + String(index + 1).padStart(3, '0')}</td>
                      <td>${name}</td>
                      <td>${phone}</td>
                      <td>${address}</td>
                  </tr>`

        $('#customer_tbody').append(data);
    });
}

// to generate customer ids automatically
function generateNextCustomerId() {
    const nextId = 'C' + String(customer_db.length + 1).padStart(3, '0');
    $('#nextId').val(nextId);
}

// When Save a new Customer
$('#customer_save').on('click', function () {
    let id = $('#nextId').val();
    let name = $('#newName').val();
    let phone = $('#newPhone').val();
    let address = $('#newAddress').val();

    // console.log(`fname: ${fname}, lname: ${lname}, address: ${address}`);

    if (name === '' || phone === '' || address === '') {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Please enter valid inputs..!"
        });
    } else {
        /*let customer_data = {
            id: id,
            name: name,
            phone: phone,
            address: address
        };*/

        let customer_data = new CustomerModel(id, name, phone, address);

        customer_db.push(customer_data);
        console.log(customer_db);

        syncCustomers();
        loadCustomersOnTable();


        Swal.fire({
            title: "Customer Added successfully..!",
            icon: "success",
            draggable: true
        });
    }

    $('#newName').val("");
    $('#newAddress').val("");
    $('#newPhone').val("");

    generateNextCustomerId();
});

// to update customer details
$('#customer_update').on('click', function () {
    let id = $('#customer_id').val();
    let name = $('#name').val();
    let phone = $('#phone').val();
    let address = $('#address').val();


    if (name === '' || phone === '' || address === '') {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Please enter valid inputs..!"
        });
    } else if (selectedCustomerIndex !== -1) {

        customer_db[selectedCustomerIndex] = {
            id: id,
            name: name,
            phone: phone,
            address: address
        };

        loadCustomersOnTable();
        syncCustomers();

        console.log(customer_db);

        Swal.fire({
            title: "Customer updated successfully..!",
            icon: "success",
            draggable: true
        });

        $('#customer_id').val("");
        $('#name').val("");
        $('#address').val("");
        $('#phone').val("");

        // Reset form and index
        $('#customer_form_fieldset').prop('disabled', true);
        $('#customer_reset').click();
        selectedCustomerIndex = -1;

    } else {
        Swal.fire({
            icon: "warning",
            title: "No customer selected!",
            text: "Please select a customer to update."
        });
    }
});

// Reset the form
$('#customer_reset').on('click', function () {
    $('#customer_id').val("");
    $('#name').val("");
    $('#address').val("");
    $('#phone').val("");
});

$('#customer_delete').on('click', function () {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            if (selectedCustomerIndex !== -1) {
                // selected index and range (ensure only that customer deleting)
                customer_db.splice(selectedCustomerIndex, 1);
                loadCustomersOnTable();
                syncCustomers();

                Swal.fire({
                    title: "Deleted!",
                    text: "Customer has been deleted successfully.",
                    icon: "success"
                });

                // reset form
                $('#customer_form_fieldset').prop('disabled', true);
                $('#customer_reset').click();
                selectedCustomerIndex = -1;
            }
        }
    });
});

// select a customer by click on a table row
$('#customer_tbody').on('click', 'tr', function () {
    //const index = $(this).index();
    //const selectedCustomer = customer_db[index];
    selectedCustomerIndex = $(this).index();
    const selectedCustomer = customer_db[selectedCustomerIndex];

    // to fill the form with selected customer's data
    $('#customer_id').val(selectedCustomer.id);
    $('#name').val(selectedCustomer.name);
    $('#phone').val(selectedCustomer.phone);
    $('#address').val(selectedCustomer.address);

    $('#customer_form_fieldset').prop('disabled', false);
});