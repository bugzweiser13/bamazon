var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as Manager, ID# " + connection.threadId);
    userInput();
});



function userInput() {
    inquirer.prompt([{
            name: "input",
            type: "list",
            message: "Please Select Desired Option:",
            choices: ["View all Products", "View Low Inventory", "Add to Inventory", "Add a New Product", "Remove a Product", "Exit"]
        }

    ]).then(function(user) {
        switch (user.input) {
            case 'View all Products':
                displayProducts();
                break;
            case 'View Low Inventory':
                displayLow();
                break;
            case 'Add to Inventory':
                restockItem();
                break;
            case 'Add a New Product':
                addProduct();
                break;
            case 'Remove a Product':
                removeProduct();
                break;
            case 'Exit':
                connection.end();
        }
    });
};

//product display
function displayProducts() {
    var query = "Select * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        var displayTable = new Table({
            head: ["Item ID", "Product Name", "Catergory", "Price", "Quantity"],
            colWidths: [10, 30, 30, 10, 10]
        });
        for (var i = 0; i < res.length; i++) {
            displayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].quantity]
            );
        }
        console.log(displayTable.toString());
        userInput();
    });
}

//view inventory
function displayLow() {
    var query = "SELECT * FROM products WHERE quantity <= 5";
    connection.query(query, function(err, res) {
        if (err) throw err;
        var displayTable = new Table({
            head: ["Item ID", "Product Name", "Catergory", "Price", "Quantity"],
            colWidths: [10, 30, 30, 10, 10]
        });
        for (var i = 0; i < res.length; i++) {
            displayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].quantity]
            );
        }
        console.log(displayTable.toString());
        userInput();
    });
}

//restock inventory
function restockItem() {
    inquirer.prompt([{

            name: "ID",
            type: "input",
            message: "Please enter Item ID you like to restock.",
            filter: Number
        },
        {
            name: "Quantity",
            type: "input",
            message: "How many items do you wish to add?",
            filter: Number
        },

    ]).then(function(answers) {
        var quantityAdd = answers.Quantity;
        var IDadd = answers.ID;
        addItems(IDadd, quantityAdd);
    });
};

function addItems(ID, add) {
    connection.query('Select * FROM products WHERE item_id = ' + ID, function(err, res) {
        if (err) { console.log(err) };
        if (add >= res[0].quantity) {
            console.log("Your have added " + add + " to " + res[0].product_name);
            connection.query("UPDATE products SET quantity = quantity + " + add + " WHERE item_id = " + ID);
        } else {
            console.log("sorry nothing was added");
        };
        userInput();
    });
}

//add a new product
function addProduct() {

    inquirer.prompt([{

            type: "input",
            name: "product",
            message: "What is your Product Name?",
        },
        {
            type: "list",
            name: "catergory",
            message: "What Catergory Does the Item Belong In?",
            choices: ["School Supply", "Electronics", "Books"]
        },
        {
            type: "input",
            name: "price",
            message: "What is the Unit Price?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "qty",
            message: "What is the Unit Quanity?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },

    ]).then(function(input) {

        var products = {
            product_name: input.product,
            department_name: input.catergory,
            price: input.price || 0,
            quantity: input.qty || 0,
        }

        var departments = {
            department_name: input.catergory,
            overhead_cost: input.price || 0,
        }
        console.log(products);
        console.log(departments);
        addProducts(products);
        // addDepartment(departments);
    });

}

//add to products table
function addProducts(products) {
    console.log(products.price);
    var priceFix = parseFloat(products.price)
    var quantityFix = parseFloat(products.quantity)
    connection.query(

        "INSERT INTO products, SET?", {
            product_name: products.product_name,
            department_name: products.department_name,
            price: priceFix || 0,
            quantity: quantityFix || 0,
        },
        function(err) {
            if (err) throw err;
            console.log("Your Item Was Added Successfully!!!");
        }
    );
}

//add to departments table
function addDepartment(departments) {
    console.log(departments);

    connection.query(
        "INSERT INTO departments SET?", +departments,
        function(err) {
            if (err) throw err;
            console.log("Your Item Was Added Successfully!!!");
            userInput();
        }
    );
}

//remove an item from list
function removeProduct() {

    inquirer.prompt([{

            type: "input",
            name: "id",
            message: "What Product ID Would You Like to Remove?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },

    ]).then(function(inputRem) {
        var deleteRow = inputRem.id;

        // console.log(input);
        deleteItem(deleteRow);
    });
}

function deleteItem(deleteRow) {
    console.log(deleteRow);
    connection.query(
        "DELETE FROM products WHERE item_id= " + deleteRow,
        function(err) {
            if (err) throw err;
            console.log("Your Item Was Deleted Successfully!!!");
            userInput();
        }
    );
}