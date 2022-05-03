const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log("Successfully connected to employee_db.")
);


function mainMenu() {
    inquirer.prompt()
}











mainMenu();