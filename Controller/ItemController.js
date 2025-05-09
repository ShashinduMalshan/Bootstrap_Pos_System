import {customer_db, item_db,} from "../DB/Db.js";
import ItemModel from "../Model/ItemModel.js";
import { setItemIds } from '../Controller/OrderController.js';

let rowIndex;


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

    let id = $('#inputItemId').val();
    let name = $('#inputName').val();
    let qty = $('#inputQty').val();
    let price = $('#inputPrice').val();

    let item_data = new ItemModel(id, name, qty, price);
    item_db.splice(item_db.findIndex(item => item.id === id), 1, item_data);
    loadItem();

    reset();


});


$('#addItem').on('click', function(){

    let id = nextId();
    var name = $('#inputName').val();
    var qty = $('#inputQty').val();
    var price = $('#inputPrice').val();

    let item_data = new ItemModel(id, name, qty, price);
    item_db.push(item_data);
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

    reset()
});

function reset(){
    $('#inputItemId').val(nextId());
    $('#inputName').val('');
    $('#inputQty').val('');
    $('#inputPrice').val('');

}


$('#Remove-Item').on('click', function(){

        let val = $('#inputItemId').val();
        console.log(val + " val ");


        item_db.splice(rowIndex,1);
        loadItem();
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

            }
        });

    } else {
        alert("Item not found!");
    }
});


