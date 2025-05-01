import {item_db,} from "../DB/Db.js";
import ItemModel from "../Model/ItemModel.js";


function loadItem(){
    $('#item-tbody').empty();
    item_db.map((item , index)=> {
            let id = item.id;
            let name = item.name;
            let qty = item.qty;
            let price = item.price;

            let data =  `<tr>
                                <td>${index+1}</td>
                                <td>${id}</td>
                                <td>${name}</td>
                                <td>${qty}</td>
                                <td>${price}</td>
                                </tr>`
        $('#item-tbody').append(data);
    });

}


$('#addItem').on('click', function(){

    let id = $('#inputItemId').val();
    let name = $('#inputName').val();
    let qty = $('#inputQty').val();
    let price = $('#inputPrice').val();

    console.log(id, name, qty, price);
    let item_data = new ItemModel(id, name, qty, price);
    item_db.push(item_data);
    loadItem();
});