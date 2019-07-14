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
    displayProducts();
});

function displayProducts() {
    var query = "Select * FROM departments INNER JOIN products ON departments.department_id = products.item_id";
    connection.query(query, function(err, res) {
        if (err) throw err;
        var displayTable = new Table({
            head: ["Deptartment ID", "Department Name", "Overhead Cost", "Product Sales", "Total Profit"],
            colWidths: [20, 20, 15, 15, 15]
        });
        for (var i = 0; i < res.length; i++) {
            displayTable.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales]
            );
        }
        console.log(displayTable.toString());
        connection.end();
        // userInput();
    });
}