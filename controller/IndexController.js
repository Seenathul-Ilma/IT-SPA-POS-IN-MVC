$(document).ready(function() {
    $("#item-content").hide();
    $("#customer-content").hide();
    $("#orders-content").hide();
    $("#invoice-content").hide();
});

$("#home-manage-btn").on("click", function () {
    $("#dashboard-content").css("display", "block");
    $("#item-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#orders-content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#item-manage-btn").on("click", function () {
    $("#item-content").css("display", "block");
    $("#dashboard-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#orders-content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#customer-manage-btn").on("click", function () {
    $("#customer-content").css("display", "block");
    $("#item-content").css("display", "none");
    $("#dashboard-content").css("display", "none");
    $("#orders-content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#order-manage-btn").on("click", function () {
    $("#orders-content").css("display", "block");
    $("#item-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#dashboard-content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#invoice-manage-btn").on("click", function () {
    $("#invoice-content").css("display", "block");
    $("#item-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#orders-content").css("display", "none");
    $("#dashboard-content").css("display", "none");
});
