import {order_db, customer_db, item_db, order_details_db} from "../DB/Db.js";
import OrderModel from "../Model/OrderModel.js";
import Order_details from "../Model/Order_details.js";
import Order_details_Model from "../Model/Order_details.js";

let total;
let subTotal;


if (localStorage.getItem("order_data")) {
    let raw = JSON.parse(localStorage.getItem("order_data"));

    let loaded = raw.map(o => new Order_details_Model(o.oId, o.cId, o.order_data,o.date, o.qty));
    order_details_db.length = 0;
    order_details_db.push(...loaded);
}

$(document).ready(function() {
    reset();
    setItemIds();
});


function reset() {
    $('#inputOrderId').val(nextId());
    $('#inputCustomerId').val('');
    $('#inputDate').val('');
    $('#inputCustomerName').val('');

    $('#inputItemIds').val('');
    $('#OrderInputName').val('');
    $('#OrderInputQty').val('');
    $('#OrderInputPrice').val('');
    $('#qtyOnHand').val('');

    $('#order-tbody').empty();

    order_db.length = 0;
}



function nextId(){

    let oId;

    if (order_details_db.length > 0) {
        const lastId = order_details_db[order_details_db.length - 1].oId;
        oId = parseInt(lastId.slice(1)) + 1;
        oId = 'O' + oId.toString().padStart(3, '0');
    } else {
        oId = 'O001';
    }
return oId

}


export function setCustomerIds(){
    const customerIds = customer_db.map(customer => customer.id);
    const dropdown = document.getElementById("dropdownList");
    const input = document.getElementById("inputCustomerId");

    dropdown.innerHTML = "";

    customerIds.forEach(id => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.textContent = id;

        a.addEventListener("click", function (e) {
            e.preventDefault();
            input.value = this.textContent;
            $('#inputCustomerName').val(getCustomerByUd(this.textContent).fname+ ' '+getCustomerByUd(this.textContent).lname);
        });

        li.appendChild(a);
        dropdown.appendChild(li);
    });}


export function setItemIds(){
    const itemIds = item_db.map(item => item.id);
    const dropdown = document.getElementById("itemDropdownList");
    const input = document.getElementById("inputItemIds");


    if (!dropdown || !input) {
        console.warn("Dropdown or input element not found");
        return;
    }

    dropdown.innerHTML = "";

    itemIds.forEach(id => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.textContent = id;

        a.addEventListener("click", function (e) {
            e.preventDefault();
            input.value = this.textContent;
            $('#OrderInputName').val(getItemByUd(this.textContent).name);
            $('#qtyOnHand').val(getItemByUd(this.textContent).qty);

        });

        li.appendChild(a);
        dropdown.appendChild(li);
    });}



function loadOrder(){
    $('#order-tbody').empty();
    order_db.map((item , index)=> {
        let id = item.id;
        let name = item.name;
        let price = item.price;
        let qty = item.qty;

        let data =  `<tr>
                            <td>${id}</td>
                            <td>${name}</td>
                            <td>${price}</td>
                            <td>${qty}</td>
                            <td> <button class="table-remove-btn">
                                    <i class=" bi bi-trash"></i>
                                    </button>
                            </td>
                            </tr>`
        $('#order-tbody').append(data);
    })

}



function getCustomerByUd(id) {
  return customer_db.find(item => item.id === id);
}

function getItemByUd(id) {
  return item_db.find(item => item.id === id);
}



$('#Add-Item').on('click', function () {

    if (!validate()) {
        return
    }

    let itemId = $('#inputItemIds').val();
    let itemName = $('#OrderInputName').val();
    let qty = $('#OrderInputQty').val();
    let price = $('#OrderInputPrice').val();

    let order_data = new OrderModel(itemId, itemName, price, qty);
    order_db.push(order_data);
    loadOrder();
    setTotal();

    $('#inputItemIds').val('');
    $('#OrderInputName').val('');
    $('#OrderInputQty').val('');
    $('#OrderInputPrice').val('');
    $('#qtyOnHand').val('');


});

$('#btn-purchase').on('click', function () {

    if (!validatePurchase()) {
        return
    }



    let orderId = $('#inputOrderId').val();
    let cusId = $('#inputCustomerId').val();
    let date = $('#inputDate').val();

    Swal.fire({
        title: 'Are you sure?',
        text: "Complete this purchase?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, complete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let orderDetailsData = new Order_details(orderId, cusId, [...order_db], date);
            order_details_db.push(orderDetailsData);
            localStorage.setItem("order_data", JSON.stringify(order_details_db));

            subtractQty();
            reset();
            
            Swal.fire({
                title: 'Success!',
                text: 'Purchase completed successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
});


function subtractQty() {
    order_db.forEach(orderItem => {
        const matchingItem = item_db.find(dbItem => dbItem.id === orderItem.id);
        if (matchingItem) {
            matchingItem.qty -= parseInt(orderItem.qty);
            localStorage.setItem('item_db', JSON.stringify(item_db));
        }
    });
}


function setTotal() {
    total = 0;

    order_db.forEach(orderItem => {
        total += parseFloat(orderItem.price);
        setSubTotal();
    });

    $('#total-label').text('Total : ' + total.toFixed(2) + ' Rs/=');
}


function setSubTotal() {
    let discount = parseFloat($('#disInput').val()) || 0;
    subTotal = total - (discount / 100 * 45);
    $('#subtotal-label').text('SubTotal : ' + subTotal.toFixed(2) + ' Rs/=');
}

// When a dropdown item is clicked
$('.dropdown-menu .dropdown-item').on('click', function(e) {
    e.preventDefault();
    const selected = $(this).text();
    $('#disInput').val(selected);
    setSubTotal();
});



$('#cash').on('keyup', function () {
    let cash = parseFloat($(this).val());
    if (!isNaN(cash)) {
        let subtractBalance = cash - subTotal;
        $('#balance').val(subtractBalance.toFixed(2));
    }
});

$('#OrderInputQty').on('input', updatePriceField);

function updatePriceField() {
    const qty = parseInt($('#OrderInputQty').val());
    const itemId = $('#inputItemIds').val();
    const item = getItemByUd(itemId);

    if (item && !isNaN(qty)) {
        const totalPrice = item.price * qty;
        $('#OrderInputPrice').val(totalPrice.toFixed(2));
    } else {
        $('#OrderInputPrice').val('');
    }
}


$(document).on('click', '.table-remove-btn', function () {

    const itemId = $(this).closest('tr').find('td:first').text();
    const index = order_db.findIndex(item => item.id === itemId);
    order_db.splice(index, 1);
    loadOrder();
    setTotal();

});



function validate() {

    let id = $('#inputCustomerId').val();
    let date = $('#inputDate').val();
    let itemId = $('#inputItemIds').val();
    let qty = $('#OrderInputQty').val();

    if (!id ){
        alert("Please select a customer");
        return;
    }

    if (!date ){
        alert("Please select a date");
        return;
    }

    if (!itemId ){
        alert("Please select an item");
        return;
    }

    if (!qty){
        alert("Please enter a quantity");
        return;
    }
    if (!parseInt(qty) > 0){
        alert("Quantity should be greater than 0");
        return;
    }

return true;
}

function validatePurchase() {

    let cash = $('#cash').val();
    let balance = $('#balance').val();

    if (!cash ){
        alert("Please enter a cash amount");
        return;
    }
    if (parseInt(cash) < 0){
        alert("Cash amount should be greater than 0");
        return;
    }

    if (parseInt(cash) < parseInt(subTotal)) {
        alert("Cash amount should be greater than or equal to subtotal");
        return;
    }

    return true;

}