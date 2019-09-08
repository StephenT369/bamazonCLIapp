var mysql = require('mysql');
var inquirer = require('inquirer');
var c = require('colors');
var clear = require('clear');

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
});

function showProducts(){
    db.query("SELECT item_id AS 'Product ID', product_name AS 'Product Name', department_name AS 'Department', CONCAT('$',FORMAT(price,2)) AS 'Price', stock_quantity AS 'Available Qty.' FROM products WHERE stock_quantity > 0 ", function(err,res){
        if (err) throw err;
        clear();
        console.log('\r\n***WELCOME TO bAMAzON!****'.rainbow + '\r\n');
        console.log('\r\nAvailable Products for Purchase:'.inverse.cyan.underline+'\r\n');
        console.table(res);
        startBamazon();
    })
};

//start the Bamazon App
function startBamazon(){
    inquirer
    .prompt({
        name: 'askID',
        type: 'input',
        message: "Enter the Product ID of the product you'd like to buy, type EXIT to quit:"
    })
    .then(function(answer){
        if (answer.askID === 'EXIT'){
            db.end;
            clear();
            process.exit();
        };
        db.query("SELECT item_id AS 'Product ID', product_name AS 'Product Name', CONCAT('$',FORMAT(price,2)) AS 'Price', stock_quantity AS 'Available Qty.' FROM products WHERE item_id="+answer.askID+" ", function(err,res){
            if (err) throw err;
            if (!res.length){
                console.log('Item not in store or enter an ID on the list!'.red.inverse);
                startBamazon();
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

//Start Order
function orderBamazon(itemID){
    var updQty;
inquirer
.prompt({
    name: 'askQty',
    type: 'input',
    message: 'Enter enter the quantity you want to purchase, type EXIT to quit: '
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
        } else if(answer.askQty === 'EXIT'){
            db.end;
            clear();
            process.exit();
        }
    }) 
})
};

//Process Order
function fulfillBamazon(rmgQty,buyQty,itemID){
    db.query("UPDATE products SET stock_quantity="+rmgQty+" WHERE (item_id="+itemID+")", function(err,res){
        if (err) throw err;
    });
    db.query("SELECT price FROM products WHERE item_id="+itemID+"", function(err,res){
        if (err) throw err;
        var itemPrice = res[0].price;
        var totalCost = itemPrice * buyQty;
        console.log("\r\nThank you for your business. Your purchase amount:".inverse.italic.underline.green + totalCost.toLocaleString('en-US',{style:'currency', currency:'USD'})+'\r\n');
    });
    inquirer
    .prompt({
        name: 'askShop',
        type: 'input',
        message: 'Would you like to purchase another product?(y/n)'
    })
    .then(function(answer){
        switch(answer.askShop){
            case 'y':
                clear();
                showProducts();
            break;
            case 'Y':
                clear();
                showProducts();
            break;
            case 'n':
                db.end;
                clear();
                process.exit();
            break;
            case 'N':
                db.end;
                clear();
                process.exit();
            break;
            default:
                db.end;
                clear();
                process.exit();
        }
    });
};