import {customer_db, item_db,} from "../DB/Db.js";
import ItemModel from "../Model/ItemModel.js";
import {setCustomerIds, setItemIds} from '../Controller/OrderController.js';
import CustomerModel from "../Model/CustomerModel.js";

let rowIndex;


if (localStorage.getItem("item_data")) {
    let raw = JSON.parse(localStorage.getItem("item_data"));

    let loaded = raw.map(i => new ItemModel(i.id,i.name,i.qty,i.price));
    item_db.length = 0;
    item_db.push(...loaded);
}


$(document).ready(function() {
    reset();
    loadItem();
    setItemIds();
});


function nextId(){
    let id;

    if (item_db.length > 0) {
        const lastId = item_db[item_db.length - 1].id;
        id = parseInt(lastId.slice(1)) + 1;
        id = 'I' + id.toString().padStart(3, '0');
    } else {
        id = 'I001';
    }

    return id;
}


function loadItem(){
    $('#item-tbody').empty();

        let id = $('#inputItemId').val();

    item_db.map((item , index)=> {
            let id = item.id;
            let name = item.name;
            let qty = item.qty;
            let price = item.price;

            let data =  `<tr>
                                <td>${id}</td>
                                <td>${name}</td>
                                <td>${qty}</td>
                                <td>${price}</td>
                                </tr>`
        $('#item-tbody').append(data);
    });


}


$('#update-Item').on('click', function(){

    if (!validate()) {
        return
    }

    let id = $('#inputItemId').val();
    let name = $('#inputName').val();
    let qty = $('#inputQty').val();
    let price = $('#inputPrice').val();

    let item_data = new ItemModel(id, name, qty, price);
    item_db.splice(item_db.findIndex(item => item.id === id), 1, item_data);
    localStorage.setItem("item_data", JSON.stringify(item_db));

    loadItem();

    reset();


});


$('#addItem').on('click', function(){

    if (!validate()) {
        return
    }

    let id = nextId();
    var name = $('#inputName').val();
    var qty = $('#inputQty').val();
    var price = $('#inputPrice').val();

    let item_data = new ItemModel(id, name, qty, price);
    item_db.push(item_data);
    localStorage.setItem("item_data", JSON.stringify(item_db));

    loadItem();
    setItemIds();

    reset();

});


$("#item-tbody").on('click', 'tr', function(){

    rowIndex = $(this).index();

    let obj = item_db[rowIndex];

    let id = obj.id;
    let name = obj.name;
    let qty = obj.qty;
    let price = obj.price;

    $('#inputItemId').val(id);
    $('#inputName').val(name);
    $('#inputQty').val(qty);
    $('#inputPrice').val(price);

});

$('#item-reset-button').on('click', function(){

    reset();
});

function reset(){
    $('#inputItemId').val(nextId());
    $('#inputName').val('');
    $('#inputQty').val('');
    $('#inputPrice').val('');
    $('#item-search-input').val('');
    $('#item-tbody tr').css('background-color', '').removeClass('highlight');

}


$('#Remove-Item').on('click', function(){

        const idToRemove = $('#inputItemId').val().trim();
        const index = item_db.findIndex(item => item.id === idToRemove);



        if (index !== nextId()&& index !==-1) {
            item_db.splice(index, 1);
        }else {
            alert("Select Item First")
        }
        localStorage.setItem("item_data", JSON.stringify(item_db));

        loadItem();
        reset();
        setItemIds();

});



$('#item-search-btn').on('click', function() {

    let searchItem = $('#item-search-input').val();

    $('#item-tbody tr').css('background-color', '');
    console.log($('#item-tbody tr'))

    if (searchItem) {
        $('#item-tbody tr').each(function() {

            let rowId = $(this).find('td:first').text();

            if (rowId === searchItem) {
                console.log(rowId);
                $(this).addClass('highlight');

                    $('.customer-table').animate({
                        scrollTop: $('.customer-table').scrollTop() + $(this).position().top
                    }, 300);


            }});


    }else {
        alert("Please enter a customer ID.");
    }});


function validate(){

    let id = $('#inputItemId').val().trim();
    let name = $('#inputName').val().trim();
    let qty = $('#inputQty').val().trim();
    let price = $('#inputPrice').val().trim();


    if (!id || !name || !qty  || !price) {

        alert("All fields are required.");
        return false;
    }

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(name)) {
        $('#inputName').addClass('input-error');
            alert("Names should contain only letters.");
            return false;
    }

    const qtyRegex = /^[1-9]\d{0,9}$/;
    if (!qtyRegex.test(qty)) {
        $('#inputQty').addClass('input-error');
        alert("Quantity should be a positive whole number without leading zeros.");
        return false;
    }

    const priceRegex = /^(?!0\d)\d+(\.\d{1,2})?$/; // Positive number, optional 1-2 decimal places, no leading zeros
    if (!priceRegex.test(price)) {
        $('#inputPrice').addClass('input-error');
        alert("Price should be a positive number with up to two decimal places and no leading zeros.");
        return false;
    }

    return true
}

$('#inputName, #inputQty, #inputPrice').on('input', function () {
    $(this).removeClass('input-error');
});

