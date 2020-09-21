const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "EMPLOYEE_TRACKER"
});

function promptUser() {
    const options = [
        "View all employees", // 0
        "View all employees by department",

        // "View all employees by manager",

        "View all roles",
        "View all departments",
        "Add department",
        "Add role",
        "Add employee",
        "Update employee role",

        // "Update employee manager",

        "DELETE department",
        "DELETE role",
        "DELETE employee",

        "EXIT"];
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: options,
            name: "choice"
        }
    ]).then(response => {
        if (response.choice == options[0]) {
            viewAllEmployees();
        } else if (response.choice == options[1]) {
            viewEmployeesByDepartment();
            // } else if (response.choice == options[]) {
            //     viewEmployeesByManager();
        } else if (response.choice == options[2]) {
            viewAllRoles();
        } else if (response.choice == options[3]) {
            viewAllDepartments();
        } else if (response.choice == options[4]) {
            addDepartment();
        } else if (response.choice == options[5]) {
            addRole();
        } else if (response.choice == options[6]) {
            addEmployee();
        } else if (response.choice == options[7]) {
            updateRole();
            // } else if (response.choice == options[]) {
            //     updateEmployeeManager();
        } else if (response.choice == options[8]) {
            deleteDepartment();
        } else if (response.choice == options[9]) {
            deleteRole();
        } else if (response.choice == options[10]) {
            deleteEmployee()
        } else if (response.choice == options[11]) {
            connection.end();
        }
    })
}

function viewAllEmployees() {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee	
                        INNER JOIN role ON role.id = employee.role_id 
                        INNER JOIN department ON department.id = role.department_id;`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            console.log("\n");
            console.table(results);
            console.log("\n");
            promptUser();
        }
    });
}

function viewEmployeesByDepartment() {
    // we will need to ACCESS the results of the callback function
    connection.query("SELECT * FROM department", (error, listOfDepartments) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // creates an array of the department names
            const departmentNames = listOfDepartments.map((department) => department.name);

            inquirer.prompt([
                {
                    type: "list",
                    message: "Which department would you like to view?",
                    choices: departmentNames,
                    name: "departmentName"
                },
            ]).then((response) => {
                connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee 
                                    INNER JOIN role ON role.id = employee.role_id 
                                    INNER JOIN department ON department.id = role.department_id
                                  WHERE ?`, { name: response.departmentName }, (error, results) => {
                    console.log("\n");
                    console.table(results);
                    console.log("\n");
                    promptUser();
                });
            });
        }
    });
}

function viewEmployeesByManager() { }

function viewAllRoles() {
    connection.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role 
                            INNER JOIN department ON department.id = role.department_id`, function (error, results) {
        // connection.query(`SELECT department.name AS department FROM department`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            console.log("\n");
            console.table(results);
            console.log("\n");
            promptUser();
        }
    });
}

function viewAllDepartments() {
    connection.query(`SELECT * FROM department`, function (error, results) {
        // connection.query(`SELECT department.name AS department FROM department`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            console.log("\n");
            console.table(results);
            console.log("\n");
            promptUser();
        }
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name: "newDepartmentName",
        },
    ]).then((response) => {
        connection.query(`INSERT INTO department SET ?`, { name: response.newDepartmentName }, (error, results) => {
            console.log("\n");
            console.log(`Added ${response.newDepartmentName} to the DEPARTMENT database`)
            console.log("\n");
            promptUser();
        });
    });
}

function addRole() {
    // we will need to ACCESS the results of the callback function
    connection.query("SELECT * FROM department", (error, listOfDepartments) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // creates an array of the department names
            const departmentNames = listOfDepartments.map((department) => department.name);

            inquirer.prompt([
                {
                    type: "list",
                    message: "To which department should the new role belong?",
                    choices: departmentNames,
                    name: "departmentName"
                },
                {
                    type: "input",
                    message: "What is the title for this role?",
                    name: "newRoleTitle",
                },
                {
                    type: "input",
                    message: "What is the salary for this role?",
                    name: "newRoleSalary",
                },
            ]).then((response) => {
                //find department_id that matches user's department choice
                const department = listOfDepartments.find((department) => department.name == response.departmentName);

                connection.query(`INSERT INTO role SET ?`, { title: response.newRoleTitle, salary: response.newRoleSalary, department_id: department.id }, (error, results) => {
                    console.log("\n");
                    console.log(`Added ${response.newRoleTitle} to the ${department.name} department`)
                    console.log("\n");
                    promptUser();
                });
            });
        }
    });
}

function addEmployee() {
    // we will need to ACCESS the results of the callback function
    connection.query("SELECT * FROM role", (error, listOfRoles) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // creates an array of the role titles
            const roleTitles = listOfRoles.map((role) => role.title);
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter the employee's first name",
                    name: "employeeFirst"
                },
                {
                    type: "input",
                    message: "Enter the employee's last name",
                    name: "employeeLast"
                },
                {
                    type: "list",
                    message: "What is the title for this employee?",
                    choices: roleTitles,
                    name: "employeeRole",
                },
            ]).then((response) => {
                //find role that matches user's title choice
                const role = listOfRoles.find((role) => role.title == response.employeeRole);

                connection.query(`INSERT INTO employee SET ?`, { first_name: response.employeeFirst, last_name: response.employeeLast, role_id: role.id }, (error, results) => {
                    console.log("\n");
                    console.log(`Added ${response.employeeFirst} ${response.employeeLast} to the database`)
                    console.log("\n");
                    promptUser();
                });
            });
        }
    });
}

function updateRole() {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role_id, role.title, department.name AS department FROM employee	
                        INNER JOIN role ON role.id = employee.role_id 
                        INNER JOIN department ON department.id = role.department_id;`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            console.table(results);

            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter id number for the employee you would like to update.",
                    name: "employeeID"
                },
                {
                    type: "input",
                    message: "Enter role_id number for the employee's NEW role",
                    name: "roleID"
                },
            ]).then((response) => {
                connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [response.roleID, response.employeeID], function (error, results) {
                    if (error) {
                        console.log(error);
                        connection.end();
                    } else {
                        console.log("\n");
                        console.log("The employee role has been updated");
                        console.log("\n");
                        promptUser();
                    }
                })
            })
        }
    });
}

function deleteDepartment() {
    // we will need to ACCESS the results of the callback function
    connection.query("SELECT * FROM department", (error, listOfDepartments) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // creates an array of the department names
            const departmentNames = listOfDepartments.map((department) => department.name);

            inquirer.prompt([
                {
                    type: "list",
                    message: "Which department would you like to delete?",
                    choices: departmentNames,
                    name: "departmentName"
                },
            ]).then((response) => {
                connection.query(`DELETE FROM department WHERE ?`, { name: response.departmentName }, (error, results) => {
                    console.log("\n");
                    console.log(`Deleted department from the database`);
                    console.log("\n");
                    promptUser();
                });
            });
        }
    });
}

function deleteRole() {
    connection.query("SELECT * FROM role", (error, listOfRoles) => {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            // creates an array of the department names
            const roleTitles = listOfRoles.map((role) => role.title);

            inquirer.prompt([
                {
                    type: "list",
                    message: "Which role would you like to delete?",
                    choices: roleTitles,
                    name: "roleTitle"
                },
            ]).then((response) => {
                connection.query(`DELETE FROM role WHERE ?`, { title: response.roleTitle }, (error, results) => {
                    console.log("\n");
                    console.log(`Deleted role from the database`);
                    console.log("\n");
                    promptUser();
                });
            });
        }
    });
}

function deleteEmployee() {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee`, function (error, results) {
        if (error) {
            console.log(error);
            connection.end();
        } else {
            console.table(results);

            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter id number for the employee you would like to delete.",
                    name: "employeeID"
                },
            ]).then((response) => {
                connection.query(`DELETE FROM employee WHERE ?`, {id: response.employeeID}, function (error, results) {
                    if (error) {
                        console.log(error);
                        connection.end();
                    } else {
                        console.log("\n");
                        console.log(`Deleted employee from the database`);
                        console.log("\n");
                        promptUser();
                    }
                })
            })
        }
    });
}

// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId);
//     connection.end();
// });

connection.connect(function (err) {
    if (err) throw err;

    promptUser();

});