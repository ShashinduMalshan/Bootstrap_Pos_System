import {customer_db,} from "../DB/Db.js";
import CustomerModel from "../Model/CustomerModel.js";

function loadCustomer(){
    $('#customer-tbody').empty();
    customer_db.map((item , index)=> {
            let fname = item.fname;
            let lname = item.lname;
            let address = item.address;
            let phone = item.phone;
            let email = item.email;

            let data =  `<tr>
                                <td>${index+1}</td>
                                <td>${fname}</td>
                                <td>${lname}</td>
                                <td>${address}</td>
                                <td>${phone}</td>
                                <td>${email}</td>
                                </tr>`

        $('#customer-tbody').append(data);
})}



$('#Add').on('click', function(){
    let fname = $('#inputFname').val();
    let lname = $('#inputLname').val();
    let address = $('#inputAddress').val();
    let phone = $('#inputPhone').val();
    let email = $('#inputEmail').val();


    let customer_data = new CustomerModel(fname, lname, address, phone, email);
    customer_db.push(customer_data);

    loadCustomer();


    });