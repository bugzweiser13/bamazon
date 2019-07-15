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

// user selection
function userInput() {
    inquirer.prompt([{
            name: "input",
            type: "list",
            message: "Please Select Desired Option:",
            choices: ["View Total Sales of All Departments", "View Total Sales of an Individual Department", "Exit"]
        }

    ]).then(function(user) {
        switch (user.input) {
            case 'View Total Sales of All Departments':
                displayAll();
                break;
            case 'View Total Sales of an Individual Department':
                displaySelected1();
                break;
            case 'Exit':
                connection.end();
        }
    });
};

function displayAll() {
    var query = "Select * FROM departments INNER JOIN products ON departments.item_id = products.item_id";
    connection.query(query, function(err, res) {
        if (err) throw err;
        var displayTable = new Table({
            head: ["Item ID", "Product Name", "Department Name", "Department ID", "Overhead Cost", "Product Sales", "Total Profit"],
            colWidths: [10, 30, 20, 15, 15, 15, 15]
        });
        for (var i = 0; i < res.length; i++) {

            var val = res[i].over_head_costs;
            var rawVal = val - (val * .25);
            var realCost = rawVal.toFixed(2);

            var profitRaw = val - realCost;
            var salesRaw = res[i].product_sales;
            var calc = profitRaw * salesRaw
            var profit = calc.toFixed(2);

            displayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].department_id, realCost, res[i].product_sales, profit]
            );
        }
        console.log(displayTable.toString());
        userInput();
    });
}

function displaySelected() {
    inquirer.prompt([{

            name: "dept",
            type: "list",
            message: "Please select a department.",
            choices: ["School Supply", "Electronics", "Books"]
        },

    ]).then(function(input) {
        // debugging
        // console.log("You Selected " + input.dept + " department");
        // console.log("Input is a: " + typeof input.dept);

        if (input.dept === "School Supply") {
            var choice = 1
        }
        if (input.dept === "Electronics") {
            var choice = 2
        }
        if (input.dept === "Books") {
            var choice = 3
        };

        // debugging
        // console.log("Your Choice= " + choice);

        var query = "Select * FROM departments INNER JOIN products ON departments.item_id = products.item_id WHERE departments.department_id= " + choice;

        connection.query(query, function(err, res) {
            if (err) throw err;
            var displayTable = new Table({
                head: ["Item ID", "Department Name", "Overhead Cost", "Product Sales", "Total Profit"],
                colWidths: [16, 20, 15, 15, 15]
            });
            for (var i = 0; i < res.length; i++) {
                // debugging
                // console.log(res[i].product_sales);

                // var query2 = "SELECT SUM (" + res[i].over_head_costs + ") FROM departments WHERE departments.department_id= " + choice;

                var val = res[i].over_head_costs;
                var rawVal = val - (val * .25);
                var realCost = rawVal.toFixed(2);

                var profitRaw = val - realCost;
                var salesRaw = res[i].product_sales;
                var calc = profitRaw * salesRaw
                var profit = calc.toFixed(2);

                // var totalSales = connection.query(query2, function(err, res) {
                //     if (err) throw err;
                // });
                // console.log(totalSales);

                var totalProfit;
                var totalOverhead;

                displayTable.push(
                    // [res[i].department_id, res[i].department_name, res[i].product_sales]
                    [res[i].item_id, res[i].department_name, realCost, res[i].product_sales, profit]
                );
            }
            console.log(displayTable.toString());
            userInput();
        });
    });
}

function displaySelected1() {
    inquirer.prompt([{

            name: "dept",
            type: "list",
            message: "Please select a department.",
            choices: ["School Supply", "Electronics", "Books"]
        },

    ]).then(function(input) {
        // debugging
        // console.log("You Selected " + input.dept + " department");
        // console.log("Input is a: " + typeof input.dept);

        if (input.dept === "School Supply") {
            var choice = 1
        }
        if (input.dept === "Electronics") {
            var choice = 2
        }
        if (input.dept === "Books") {
            var choice = 3
        };

        // var query = "Select * FROM departments INNER JOIN products ON departments.item_id = products.item_id WHERE departments.department_id= " + choice;
        var query = "SELECT * FROM departments INNER JOIN products ON departments.item_id = products.item_id WHERE departments.department_id= " + choice;

        connection.query(query, function(err, res) {
            if (err) throw err;
            // debugging
            // console.log(res);

            const salePrice = [];
            const prodSales = [];



            const reducer = (accumulator, currentValue) => accumulator + currentValue;

            for (i = 0; i < res.length; i++) {
                // console.log(res[i].price);
                var saleData = res[i].price;
                var prodData = res[i].product_sales;
                prodSales.push(prodData);
                salePrice.push(saleData);

            }
            // totals calculations

            // sale price
            // console.log(salePrice);
            var saleOut = (salePrice.reduce(reducer));
            var totalPrice = saleOut.toFixed(2);
            console.log("Total Price: " + totalPrice);

            //product sales
            // console.log(prodSales);
            var prodOut = (prodSales.reduce(reducer));
            var totalProd = prodOut.toFixed(2);
            console.log("Total Sales: " + totalProd);

            var displayTable = new Table({
                head: ["Department Name", "Overhead Cost", "Product Sales", "Total Profit"],
                colWidths: [16, 20, 15, 15, 15]
            });
            // for (var i = 0; i < res.length; i++) {
            //     // debugging
            //     // console.log(res[i].product_sales);

            //     // var query2 = "SELECT SUM (" + res[i].over_head_costs + ") FROM departments WHERE departments.department_id= " + choice;

            //     var val = res[i].over_head_costs;
            //     var rawVal = val - (val * .25);
            //     var realCost = rawVal.toFixed(2);

            //     var profitRaw = val - realCost;
            //     var salesRaw = res[i].product_sales;
            //     var calc = profitRaw * salesRaw
            //     var profit = calc.toFixed(2);

            //     // var totalSales = connection.query(query2, function(err, res) {
            //     //     if (err) throw err;
            //     // });
            //     // console.log(totalSales);

            //     var totalProfit;
            //     var totalOverhead;

            // displayTable.push(
            //     // [res[i].department_id, res[i].department_name, res[i].product_sales]
            //     [res[i].item_id, totalPrice, realCost, res[i].product_sales, profit]
            // );
            // }
            // console.log(displayTable.toString());
            userInput();
        });
    });
}