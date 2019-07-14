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
    console.log("Connected as Customer, ID#" + connection.threadId);
    userInput();
});

function userInput() {
    inquirer.prompt([{
            name: "input",
            type: "list",
            message: "What Would You Like to Do?",
            choices: ["Purchase Supplies", "Exit"]
        }

    ]).then(function(user) {

        if (user.input === "Purchase Supplies") {
            displayProducts();
        } else {
            connection.end();
        }
    });
};


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
        purchasePrompt();
    });
}

function purchasePrompt() {
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "Please enter Item ID you like to purhcase.",
            filter: Number
        },
        {
            name: "Quantity",
            type: "input",
            message: "How many items do you wish to purchase?",
            filter: Number
        },

    ]).then(function(answers) {
        var quantityNeeded = answers.Quantity;
        var IDrequested = answers.ID;
        purchaseOrder(IDrequested, quantityNeeded);
    });
};

function purchaseOrder(ID, amtNeeded) {
    connection.query('Select * FROM products WHERE item_id = ' + ID, function(err, res) {
        if (err) { console.log(err) };
        if (amtNeeded <= res[0].quantity) {
            var totalCostRaw = res[0].price * amtNeeded;
            var totalCost = totalCostRaw.toFixed(2);

            console.log("Good news your order is in stock!");
            console.log("Your total cost for " + amtNeeded + " " + res[0].product_name + " is $" + totalCost + ", Thank you!");

            connection.query("UPDATE products SET quantity = quantity - " + amtNeeded + " WHERE item_id = " + ID);
            connection.query("UPDATE products SET product_sales =  " + totalCost + " WHERE item_id = " + ID);

        } else {
            console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + " to complete your order.");
        };
        userInput();
    });
};