DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT(4) NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	quantity INT(20) NOT NULL,
	PRIMARY KEY (item_id)
);

Select * FROM products;

INSERT INTO products (item_id, product_name, department_name, price, quantity)
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