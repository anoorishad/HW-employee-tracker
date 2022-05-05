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




// Initial main menu
function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'option',
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department","Exit"]
        }
    ]).then(res => {
        switch (res.option) {
            case "View All Employees":
                viewAllEmp();
                break;
            case "Add Employee":
                addEmp();
                break;
            case "Update Employee Role":
                updateEmpRole();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "View All Departments":
                viewAllDepts();
                break;
            case "Add Department":
                addDept();
                break;
            default:
                console.log("You have exited the application");
                break;
        }
    })
}

// View All Emloyees
const viewAllEmp = () => {
    db.query('SELECT * FROM employee', function (err,results) {
        console.log(results);
        mainMenu();
    })
}

// Add Employee
const addEmp = () => {
    // Pull managers from DB
    db.query('SELECT first_name, last_name, id FROM employee', function ([res]){
        res.map(employee => {return managers = {name : employee.first_name + " " + employee.lastname, value: employee.id}})
    });
    // Pull employee roles from DB
    db.query('SELECT title, id FROM role', function ([res]){
        res.map(role => {return roles = {name: role.title, value: role.id}})
    });
    inquirer.prompt([
        {
            name: "empFirstName",
            type: "input",
            message: "Please enter the employee's first name:"
        },
        {
            name: "empLastName",
            type: "input",
            message: "Please enter the employee's last name:"
        },
        {
            name: "empRole",
            type: "list",
            message: "Please select employee's role:",
            choices: roles
        },
        {
            name: "empManager",
            type: "list",
            message: "Please select employee's manager:",
            choices: managers
        }
    ]).then(res => {

    })
}









mainMenu();