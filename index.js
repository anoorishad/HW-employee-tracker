const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'track_db'
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
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Exit"]
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
    db.query('SELECT * FROM employee', function (err, results) {
        console.log(results);
        mainMenu();
    })
}


// function to pull managers from DB
const getManagers = () => {
    return new Promise((fulfill, reject) => {
        const manager = []
        db.query('SELECT first_name, last_name, id FROM employee', (err, res) => {
            if (err) reject(err);
            for (let index = 0; index < res.length; index++) {
                manager.push({ name: res[index].first_name + " " + res[index].last_name, value: res[index].id })

            }
            fulfill(manager)
        })
    })
};


// function to pull roles from DB
const getRoles = () => {
    return new Promise((fulfill,reject) => {
        const role = []
        db.query('SELECT title, id FROM role' , (err,res) => {
            if (err) reject(err);
            for (let index = 0; index < res.length; index++) {
                role.push({ name: res[index].title, value: res[index].id})
                
            }
            fulfill(role)
        }) 
    })
};



// Add Employee
const addEmp = async () => {
    // Pull managers from DB
    const managers = await getManagers();

    // Pull employee roles from DB
    const roles = await getRoles();

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