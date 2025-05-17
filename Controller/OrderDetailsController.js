import {customer_db, order_details_db} from "../DB/Db.js";
import CustomerModel from "../Model/CustomerModel.js";
import Order_details_Model from "../Model/Order_details.js";


if (localStorage.getItem("order_data")) {
    let raw = JSON.parse(localStorage.getItem("order_data"));

    let loaded = raw.map(o => new Order_details_Model(o.oId, o.cId, o.order_data,o.date, o.qty));
    order_details_db.length = 0;
    order_details_db.push(...loaded);
}


$(document).ready(function() {
    loadOrders();
});


function loadOrders(){

    $('#orderDetails-tbody').empty();
    order_details_db.map((item , index)=> {
            let oderId = item.oId;
            let customerName = getCustomerByUd(item.cId).fname+" " +getCustomerByUd(item.cId).lname;
            let date = item.date;
            let itemCount = item.order_data.filter(i => i != null).length;
            let totalPrice = 0;

            item.order_data.forEach((i, index) => {
                let price = parseFloat(i.price) || 0;
                totalPrice += price;
            });
            let data =  `<tr class="table-row">
                                <td>${oderId}</td>
                                <td>${date}</td>
                                <td>${customerName}</td>
                                <td>${itemCount}</td>
                                <td>${"Rs "+totalPrice}</td>
                                </tr>`

        $('#orderDetails-tbody').append(data);
})}





$("#orderDetails-tbody").on('click', 'tr', function(){


    let rowIndex = $(this).index();
    let obj = order_details_db[rowIndex];




    $('#ItemDetails-tbody').empty();
    obj.order_data.map((item , index)=> {
        let itemId = item.id;
        let itemName = item.name;
        let qty = item.qty;
        let price = item.price;qty

        let data = `<tr class="table-row">
                            
                                <td>${itemId}</td>
                                <td>${itemName}</td>
                                <td>${qty}</td>
                                <td>${"Rs "+price}</td>
                                </tr>`

        $('#ItemDetails-tbody').append(data);
    });

});




function getCustomerByUd(id) {
  return customer_db.find(item => item.id === id);
}




$('#order-search-btn').on('click', function () {
    let searchOrder = $('#order-search-input').val().trim();


    $('#orderDetails-tbody tr').css('background-color', '').removeClass('highlight');

    if (searchOrder) {
        let found = false;

        $('#orderDetails-tbody tr').each(function () {
            let rowId = $(this).find('td:first').text().trim();

            if (rowId === searchOrder) {
                $(this).addClass('highlight');

                $('.customer-table').animate({
                    scrollTop: $(this).position().top + $('.customer-table').scrollTop()
                }, 300);
                found = true;
            }
        });

        if (!found) {
            alert("Order not found!");
        }
    } else {
        alert("Please enter a order ID.");
    }
});


$('#order-reset-button').on('click', function () {
    reset();

});






function reset(){


    $('#order-search-input').val('');
    $('#orderDetails-tbody tr').css('background-color', '').removeClass('highlight');

}



