import {customer_db} from "../DB/Db.js";
import CustomerModel from "../Model/CustomerModel.js";
import { setCustomerIds } from '../Controller/OrderController.js';

let id ;
let rowIndex;

if (localStorage.getItem("customer_data")) {
    let raw = JSON.parse(localStorage.getItem("customer_data"));

    let loaded = raw.map(c => new CustomerModel(c.id, c.fname, c.lname, c.address, c.phone, c.email));
    customer_db.length = 0;
    customer_db.push(...loaded);
}


$(document).ready(function() {
    loadCustomer();
    setCustomerIds();
});


function loadCustomer(){
    $('#customer-tbody').empty();
    customer_db.map((item , index)=> {
            let id = item.id;
            let fname = item.fname;
            let lname = item.lname;
            let address = item.address;
            let phone = item.phone;
            let email = item.email;

            let data =  `<tr class="table-row">
                                <td>${id}</td>
                                <td>${fname}</td>
                                <td>${lname}</td>
                                <td>${address}</td>
                                <td>${phone}</td>
                                <td>${email}</td>
                                </tr>`

        $('#customer-tbody').append(data);
})}



$("#customer-tbody").on('click', 'tr', function(){

    rowIndex = $(this).index();
    let obj = customer_db[rowIndex];

    console.log(obj);
    id = obj.id;
    let fname = obj.fname;
    let lname = obj.lname;
    let address = obj.address;
    let phone = obj.phone;
    let email = obj.email;

    console.log(id, fname, lname, address, phone, email);
    $('#inputFname').val(fname);
    $('#inputLname').val(lname);
    $('#inputAddress').val(address);
    $('#inputPhone').val(phone);
    $('#inputEmail').val(email);
    $('#inputId').val(id);

});



function nextId(){

    let id;

    if (customer_db.length > 0) {
        const lastId = customer_db[customer_db.length - 1].id;
        id = parseInt(lastId.slice(1)) + 1;
        id = 'C' + id.toString().padStart(3, '0');
    } else {
        id = 'C001';
    }
return id

}


$('#Add').on('click', function() {
    let id = nextId();
    var fname = $('#inputFname').val();
    var lname = $('#inputLname').val();
    var address = $('#inputAddress').val();
    var phone = $('#inputPhone').val();
    var email = $('#inputEmail').val();

    let customer_data = new CustomerModel(id, fname, lname, address, phone, email);
    customer_db.push(customer_data);

    localStorage.setItem("customer_data", JSON.stringify(customer_db));


    loadCustomer();
    setCustomerIds();
    reset();

});


$('#reset-button').on('click', function() {
   reset();
});


function reset(){
     $('#inputFname').val('');
    $('#inputLname').val('');
    $('#inputAddress').val('');
    $('#inputPhone').val('');
    $('#inputEmail').val('');
    $('#inputId').val('');
    $('#search-input').val('');
    $('#customer-tbody tr').css('background-color', '').removeClass('highlight');

}


$('#Update').on('click', function() {


    let fname = $('#inputFname').val();
    let lname = $('#inputLname').val();
    let address = $('#inputAddress').val();
    let phone = $('#inputPhone').val();
    let email = $('#inputEmail').val();

    let customer_data = new CustomerModel(id, fname, lname, address, phone, email);
    customer_db.splice(customer_db.findIndex(item => item.id === id), 1, customer_data);
    localStorage.setItem("customer_data", JSON.stringify(customer_db));

    loadCustomer();
    setCustomerIds();
    reset();

});


$('#Remove').on('click', function() {

   customer_db.splice(rowIndex, 1);
   localStorage.setItem("customer_data", JSON.stringify(customer_db));
   loadCustomer();
   setCustomerIds();
   reset();

});


function getCustomerByUd(id) {
  return customer_db.find(item => item.id === id);
}


$('#search-btn').on('click', function () {
    let searchCustomer = $('#search-input').val().trim();


    $('#customer-tbody tr').css('background-color', '').removeClass('highlight');

    if (searchCustomer) {
        let found = false;

        $('#customer-tbody tr').each(function () {
            let rowId = $(this).find('td:first').text().trim();

            if (rowId === searchCustomer) {
                $(this).addClass('highlight');

                $('.customer-table').animate({
                    scrollTop: $(this).position().top + $('.customer-table').scrollTop()
                }, 300);
                found = true;
            }
        });

        if (!found) {
            alert("Customer not found!");
        }
    } else {
        alert("Please enter a customer ID.");
    }
});
