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
};

// View All Emloyees
const viewAllEmp = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        console.log(results);
        mainMenu();
    })
};
// View All Roles
const viewAllRoles = () => {
    db.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        console.log(results);
        mainMenu();
    })
};
// View All Departments
const viewAllDepts = () => {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        console.log(results);
        mainMenu();
    })
};




// function to pull employees from DB into an array
const getEmps = () => {
    return new Promise((fulfill, reject) => {
        const empArray = []
        db.query('SELECT first_name, last_name, id FROM employee', (err, res) => {
            if (err) reject(err);
            for (let index = 0; index < res.length; index++) {
                empArray.push({ name: res[index].first_name + " " + res[index].last_name, value: res[index].id })

            }
            fulfill(empArray)
        })
    })
};
// function to pull managers from DB into an array
const getManagers = () => {
    return new Promise((fulfill, reject) => {
        const managerArray = []
        db.query('SELECT first_name, last_name, id FROM employee WHERE manager_id IS null', (err, res) => {
            if (err) reject(err);
            for (let index = 0; index < res.length; index++) {
                managerArray.push({ name: res[index].first_name + " " + res[index].last_name, value: res[index].id })

            }
            fulfill(managerArray)
        })
    })
};


// function to pull roles from DB into an array
const getRoles = () => {
    return new Promise((fulfill, reject) => {
        const roleArray = []
        db.query('SELECT title, id FROM role', (err, res) => {
            if (err) reject(err);
            for (let index = 0; index < res.length; index++) {
                roleArray.push({ name: res[index].title, value: res[index].id })

            }
            fulfill(roleArray)
        })
    })
};


// function to pull departments from DB into an array
const getDepts = () => {
    return new Promise((fulfill, reject) => {
        const deptArray = []
        db.query('SELECT name, id FROM department', (err, res) => {
            if (err) reject(err);
            for (let index = 0; index < res.length; index++) {
                deptArray.push({ name: res[index].name, value: res[index].id })

            }
            fulfill(deptArray)
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
        db.promise().query('INSERT INTO employee (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)', [res.empFirstName, res.empLastName, res.empRole, res.empManager]
        ).then
            (console.log("Employee Added"));
            mainMenu();

    })
};

// Add Role
const addRole = async () => {
    // Pull departments from DB
    const departments = await getDepts();


    inquirer.prompt([
        {
            name: "roleName",
            type: "input",
            message: "Please enter the name of the new role:"
        },
        {
            name: "roleSalary",
            type: "input",
            message: "Please enter the new role's salary:"
        },
        {
            name: "department",
            type: "list",
            message: "Please select which department this role belongs to:",
            choices: departments
        }
    ]).then(res => {
        db.promise().query('INSERT INTO role (title,salary,department_id)VALUES(?,?,?)', [res.roleName, res.roleSalary, res.department]
        ).then
            (console.log("Role Added"));
            mainMenu();

    })
};


// Update Employee Role
const updateEmpRole = async () => {
    // Pull employees from DB
    const employees = await getEmps();

    const roles = await getRoles();

    inquirer.prompt([
        {
            name: "empName",
            type: "list",
            message: "Please select employee:",
            choices: employees
        },
        {
            name: "empRole",
            type: "list",
            message: "Please select employee's new role:",
            choices: roles
        }
    ]).then(res => {
        db.promise().query('UPDATE employee SET role_id = ? WHERE employee.id = ?', [res.empRole, res.empName]
        ).then
            (console.log("Role Updated"));
            mainMenu();

    })
};

// Add Department
const addDept = async () => {
    inquirer.prompt([
        {
            name: "departName",
            type: "input",
            message: "Please enter the name of the new department:"
        }
    ]).then(res => {
        db.promise().query('INSERT INTO department (name)VALUES(?)', [res.departName]
        ).then
            (console.log("Department Added"));
            mainMenu();

    })
};









mainMenu();