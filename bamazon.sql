DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
item_id INTEGER(6) NOT NULL auto_increment,
product_name VARCHAR(100),
department_name VARCHAR(100),
price DECIMAL(13,2), /*Price to customer */
stock_quantity INTEGER(100),
PRIMARY KEY (item_id)
) AUTO_INCREMENT=333;

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ('IBM Laptop', 'Electronics', 1000.00, 4);
    
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ('VW CC', 'Cars', 17000.40, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ('Asus Laptop', 'Electronics', 899.99, 14);
    
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ('Blue Bomber Jacket', 'Clothing', 35.95, 21);

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ('Black Cargo Shorts', 'Clothing', 21.30, 44);
    
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ('27" LED Monitor', 'Electronics', 110.00, 55);
    
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ('Brother Printer MFC 10000', 'Electronics', 155.38, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ('Audi S4', 'Cars', 25596.45, 1);
    
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ('Toy Gun', 'Toys', 5.99, 300);
    
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ('Toy Car', 'Toys', 1.99, 545);