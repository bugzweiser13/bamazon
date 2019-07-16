DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT(4) NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	quantity INT(20) NOT NULL,
    product_sales VARCHAR(15) NOT NULL,
	PRIMARY KEY (item_id)
);

Select * FROM products;

CREATE TABLE departments(
	department_id INT(4) NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(100) NOT NULL,
	over_head_costs DECIMAL(10,2) NOT NULL,
	PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("Pencils", "School Supply", .99, 100),
("Headphones", "Electronics", 59.99, 25),
("Paper Ream", "School Supply", 14.99, 30),
("Charge Cord(iPhone)", "Electronics", 24.99, 45),
("Charge Cord(Android)", "Electronics", 22.99, 35),
("Ink Pen", "School Supply", .99, 100),
("Tablet", "Electronics", 249.99, 10),
("Notebook (4x4)", "School Supply", 4.99, 60),
("Backpack", "School Supply", 89.99, 10),
("Voice Recorder", "Electronics", 49.99, 25),
("English Cliff Notes", "Books", 29.99, 75),
("Coding for Dummies", "Books", 39.99, 65),
("School 101", "Books", 19.99, 100);

update products
set quantity = 65
where item_id = 12;

update products
set quantity = 100
where item_id = 13;

update products
set product_name = "School for Dummies"
where item_id = 13;

delete from products where item_id = 15;

delete from products where product_name = test;



CREATE TABLE departments(
	department_id INT(4) NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(100) NOT NULL,
	over_head_costs integer(20) NOT NULL,
	PRIMARY KEY (department_id)
);

ALTER TABLE departments MODIFY over_head_costs DECIMAL(10,2) NOT NULL;

ALTER TABLE products
ADD COLUMN product_sales VARCHAR(15) NOT NULL AFTER quantity;

ALTER TABLE products MODIFY product_sales VARCHAR(15) NOT NULL;

Select * FROM departments;

Select * from departments where department_name='school supply';

Select * from departments where "school supply"=department_name;

Select * FROM departments INNER JOIN products ON departments.department_id = products.item_id;

SELECT * FROM products WHERE quantity <= 5;

SELECT * FROM departments INNER JOIN products ON departments.department_id = products.item_id;

delete from departments where department_id=1;

Select department_name FROM departments WHERE Electronics =  department_name;

SELECT DISTINCT department_id, department_name FROM departments WHERE fse_id=$cat ORDER BY dealer_code"; 