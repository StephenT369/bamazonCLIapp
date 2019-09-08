var mysql = require('mysql');
var inquirer = require('inquirer');
var c = require('colors');

//create mySQL connection to bamazon
var db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'SMUb00tc@mp369',
    database: 'bamazon'
});

//start connection to bamazon then call start function
db.connect(function(err){
    if(err) throw err;
    showProducts();
    //startBamazon();
    //db.end();
});

function showProducts(){
    db.query("SELECT item_id AS 'Product ID', product_name AS 'Product Name', department_name AS 'Department', CONCAT('$',FORMAT(price,2)) AS 'Price', stock_quantity AS 'Available Qty.' FROM products WHERE stock_quantity > 0 ", function(err,res){
        if (err) throw err;
        
        console.log('\r\n\n\n***WELCOME TO bAMAzON!****'.rainbow + '\r\n');
        startBamazon();
        console.log('\r\nAvailable Products for Purchase:'.inverse.cyan.underline+'\r\n');
        console.table(res);
        
    })
}

//start the Bamazon App
function startBamazon(){
    inquirer
    .prompt({
        name: 'askID',
        type: 'input',
        message: "Enter the Product ID of the product you'd like to buy:"
    })
    .then(function(answer){
        db.query("SELECT item_id AS 'Product ID', product_name AS 'Product Name', CONCAT('$',FORMAT(price,2)) AS 'Price', stock_quantity AS 'Available Qty.' FROM products WHERE item_id="+answer.askID+" ", function(err,res){
            if (err) throw err;
            if (!res.length){
                console.log('Item not in store or enter an ID on the list!'.red.inverse);
                showProducts();
            }
            else
            {
                console.log('\r\nYour selcted item:'.inverse.yellow.underline);
                console.table(res);
                orderBamazon(answer.askID);
            };
        });
    });
};

function orderBamazon(itemID){
    var updQty;
inquirer
.prompt({
    name: 'askQty',
    type: 'input',
    message: 'Enter enter the quantity you want to purchase: '
})
.then(function(answer){
    db.query("SELECT stock_quantity FROM products WHERE item_id="+itemID+"", function(err,res){
        if (err) throw err;
        var qtyVal = res[0].stock_quantity;
        var selQty = parseInt(answer.askQty,10);
        
        if (selQty > qtyVal){
            console.log('Insufficient quantity! Enter '.red + qtyVal + ' or less'.red);
            orderBamazon(itemID);
        } else if (selQty === 0){
            console.log('Enter a number greater than zero (0)!'.inverse.red.underline);
            orderBamazon(itemID);
        } else if (selQty <= qtyVal ) {
            updQty = qtyVal - selQty;
            fulfillBamazon(updQty,selQty,itemID);
        }
    }) 
   
})
};

function fulfillBamazon(rmgQty,buyQty,itemID){
    db.query("UPDATE products SET stock_quantity="+rmgQty+" WHERE (item_id="+itemID+")", function(err,res){
        if (err) throw err;
    });
    db.query("SELECT price FROM products WHERE item_id="+itemID+"", function(err,res){
        if (err) throw err;
        var itemPrice = res[0].price;
        var totalCost = itemPrice * buyQty;
        console.log("Total cost of your purchase:".inverse.italic.underline.green + totalCost.toLocaleString('en-US',{style:'currency', currency:'USD'}));
    });
    inquirer
    .prompt({
        name: 'askShop',
        type: 'input',
        message: 'Would you like to purchase another product?'
    })
    .then(function(answer){
        switch(answer.askShop){
            case 'y':
                startBamazon();
            break;
            case 'Y':
                startBamazon();
            break;
            case 'n':
                db.end;
                process.exit();
            break;
            case 'N':
                db.end;
                process.exit();
            break;
            default:
                process.exit();
        }
    });
}