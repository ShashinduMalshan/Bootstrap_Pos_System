import {order_db, customer_db, item_db, order_details_db} from "../DB/Db.js";
import OrderModel from "../Model/OrderModel.js";
import Order_details from "../Model/Order_details.js";



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
            $('#OrderInputPrice').val(getItemByUd(this.textContent).price);
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
                                    <i class="bi bi-trash"></i>
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

    let orderId = $('#inputOrderId').val();
    let cusId = $('#inputCustomerId').val();
    let date = $('#inputDate').val();
    let cusName = $('#inputCustomerName').val();


    let itemId = $('#inputItemIds').val();
    let itemName = $('#OrderInputName').val();
    let qty = $('#OrderInputQty').val();
    let price = $('#OrderInputPrice').val();

    let order_data = new OrderModel(itemId, itemName, price, qty);
    order_db.push(order_data);
    loadOrder();
    setTotal();

});

$('#btn-purchase').on('click', function () {

    let orderId = $('#inputOrderId').val();
    let cusId = $('#inputCustomerId').val();
    let date = $('#inputDate').val();
    let cusName = $('#inputCustomerName').val();


    let itemId = $('#inputItemIds').val();
    let itemName = $('#OrderInputName').val();
    let qty = $('#OrderInputQty').val();
    let price = $('#OrderInputPrice').val();
    let qtyOnHand = $('#qtyOnHand').val();


    let orderDetailsData = new Order_details(orderId, cusId, [...order_db], date);
    order_details_db.push(orderDetailsData);
    subtractQty();
    console.log(order_db);
    console.log(order_details_db);
    reset();


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
    let total = 0;

    order_db.forEach(orderItem => {
        total += parseFloat(orderItem.price);
    });

    $('#total-label').text('Total : ' + total.toFixed(2) + ' Rs/=');
}
