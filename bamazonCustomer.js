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
    db.end();
});

function showProducts(){
    db.query("SELECT item_id AS 'Product ID', product_name AS 'Product Name', department_name AS 'Department', CONCAT('$',FORMAT(price,2)) AS 'Price', stock_quantity AS 'Available Qty.' FROM products", function(err,res){
        if (err) throw err;
        
        console.log('\r\n\n\n***WELCOME TO bAMAzON!****'.rainbow + '\r\n');
        startBamazon();
        console.log('\r\nAvailable Products for Purchase:'.inverse.magenta+'\r\n');
        console.table(res);
        
    })
}

//start the Bamazon App
function startBamazon(){
    inquirer
    .prompt({
        name: 'askID',
        type: 'input',
        message: "Enter the ID of the product you'd like to buy'"
    })
    .then(function(answer){

    });
};