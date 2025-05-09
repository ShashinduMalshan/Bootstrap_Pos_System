import {order_db, customer_db, item_db} from "../DB/Db.js";
import OrderModel from "../Model/OrderModel.js";

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

});



