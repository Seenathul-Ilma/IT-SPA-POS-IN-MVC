import {item_db} from "../db/DB.js";
import ItemModel from "../model/ItemModel.js";
import { syncAvailableItems } from "./PlaceOrderController.js";


//////////////////// Item Related jQueries /////////////////////////////

// To store item details on an array / db
//let item_db = [];

// to search items by a data
$(document).ready(function () {

    function filterItems() {
        var value = $(this).val().toLowerCase();
        $("#item_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    }

    // to filter items at live (while typing)
    $("#search_item_input").on("keyup", filterItems);

    // to filter items after click search btn
    $('#search_item_btn').on('click', function (e) {
        e.preventDefault();
        filterItems();
    });
});

let selectedItemIndex = -1;

generateNextItemId();

// to load stored item details on the table
export function loadItemsOnTable() {

    $('#item_tbody').empty();

    item_db.map((item, index) => {
        let name = item.name;
        let price = item.price;
        let qoh = item.qoh;

        let data = `<tr>
                      <td>${'I' + String(index + 1).padStart(3, '0')}</td>
                      <td>${name}</td>
                      <td>${price}</td>
                      <td>${qoh}</td>
                  </tr>`

        $('#item_tbody').append(data);
    });
}

// to generate item ids automatically
function generateNextItemId() {
    const nextItemId = 'I' + String(item_db.length + 1).padStart(3, '0');
    $('#nextItemId').val(nextItemId);
}

// When Save a new item
$('#item_save').on('click', function () {
    let id = $('#nextItemId').val();
    let name = $('#newItemName').val();
    let price = $('#newItemPrice').val();
    let qoh = $('#newItemQoh').val();

    if (name === '' || price === '' || qoh === '') {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Please enter valid inputs..!"
        });
    } else {
        /*let item_data = {
            id: id,
            name: name,
            price: price,
            qoh: qoh
        };*/

        let item_data = new ItemModel(id, name, price, qoh);

        item_db.push(item_data);
        console.log(item_db);
        syncAvailableItems();

        loadItemsOnTable();

        Swal.fire({
            title: "Item Added successfully..!",
            icon: "success",
            draggable: true
        });
    }

    $('#newItemName').val("");
    $('#newItemPrice').val("");
    $('#newItemQoh').val("");

    generateNextItemId();
});

// to update item details
$('#item_update').on('click', function () {
    let id = $('#id').val();
    let name = $('#item_name').val();
    let price = $('#price').val();
    let qoh = $('#qoh').val();


    if (name === '' || price === '' || qoh === '') {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Please enter valid inputs..!"
        });
    } else if (selectedItemIndex !== -1) {

        item_db[selectedItemIndex] = {
            id: id,
            name: name,
            price: price,
            qoh: qoh
        };

        loadItemsOnTable();

        console.log(item_db);
        syncAvailableItems();

        Swal.fire({
            title: "Item updated successfully..!",
            icon: "success",
            draggable: true
        });

        $('#id').val("");
        $('#item_name').val("");
        $('#price').val("");
        $('#qoh').val("");

        // Reset form and index
        $('#item_form_fieldset').prop('disabled', true);
        $('#item_reset').click();
        selectedItemIndex = -1;

    } else {
        Swal.fire({
            icon: "warning",
            title: "No item selected!",
            text: "Please select an item to update."
        });
    }
});

// Reset the form
$('#item_reset').on('click', function () {
    $('#id').val("");
    $('#item_name').val("");
    $('#price').val("");
    $('#qoh').val("");
});

$('#item_delete').on('click', function () {
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
            if (selectedItemIndex !== -1) {
                // selected index and range (ensure only selected item deleting)
                item_db.splice(selectedItemIndex, 1);
                loadItemsOnTable();
                syncAvailableItems();

                Swal.fire({
                    title: "Deleted!",
                    text: "Item has been deleted successfully.",
                    icon: "success"
                });

                // reset form
                $('#item_form_fieldset').prop('disabled', true);
                $('#item_reset').click();
                selectedItemIndex = -1;
            }
        }
    });
});


// select an item by click on a table row
$('#item_tbody').on('click', 'tr', function () {
    //const index = $(this).index();
    //const selectedItem = item_db[index];
    selectedItemIndex = $(this).index();
    const selectedItem = item_db[selectedItemIndex];

    // to fill the form with selected customer's data
    $('#id').val(selectedItem.id);
    $('#item_name').val(selectedItem.name);
    $('#price').val(selectedItem.price);
    $('#qoh').val(selectedItem.qoh);

    $('#item_form_fieldset').prop('disabled', false);
});


