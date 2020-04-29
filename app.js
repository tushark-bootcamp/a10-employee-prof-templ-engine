const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const util = require("util");


// Stores the employees - Manager, engineers and interns
var employees = [];

const writeFileAsync = util.promisify(fs.writeFile);

async function buildTeam() {
    // Collect manager details
    const responseMgrInfo = await promptEmployeeInfo("manager", "");
    const officeNoInfo = await promptManagerInfo();
    const manager = new Manager(responseMgrInfo.nameOfEmployee, responseMgrInfo.idOfEmployee, responseMgrInfo.emailOfEmployee, officeNoInfo.officeNumber);
    employees.push(manager);
    // Loop in to collect employee details comprising engineers and interns
    var iteration = 0;
    while (true) {
        // suffix is generated to create variations
        var suffix = iteration === 0 ? "" : "-" + iteration;
        const roleInfo = await promptForEmployeeRole();
        const role = roleInfo.employeeRole;
        const employeeInfo = await promptEmployeeInfo(role, suffix);
        if (role === "engineer") {
            const engineerInfo = await promptEngineerInfo(suffix);
            const engineer = new Engineer(employeeInfo.nameOfEmployee, employeeInfo.idOfEmployee, employeeInfo.emailOfEmployee, engineerInfo.github);
            employees.push(engineer);
        } else {
            const internInfo = await promptInternInfo(suffix);
            const intern = new Intern(employeeInfo.nameOfEmployee, employeeInfo.idOfEmployee, employeeInfo.emailOfEmployee, internInfo.school);
            employees.push(intern);
        }
        /// logic to add more employees
        const addEmployee = await promptAddMoreEmployees();
        const addMoreEmployees = addEmployee.addMore;
        console.log("Add more employees? " + addMoreEmployees);
        if (addMoreEmployees === "No") {
            break;
        }
        iteration++;
    }
}

function promptForEmployeeRole() {

    return inquirer.prompt([
        {
            type: "list",
            name: "employeeRole",
            message: "Select the role of employee",
            choices: [
                "engineer",
                "intern"
            ]
        }
    ]);
}

function promptEmployeeInfo(employeeRole, suffix) {
    var defEmployeeName;
    var defEmployeeId;
    var defEmailId;
    if (employeeRole === "manager") { 
        defEmployeeName = "John Smith" + suffix;
        defEmployeeId = "12435687";
        defEmailId = "john" + suffix + "@" + employeeRole + ".com";
    } else if (employeeRole === "engineer") {
        defEmployeeName = "Kieth Turner" + suffix;
        defEmployeeId = "476435687" + suffix;
        defEmailId = "kieth" + suffix + "@" + employeeRole + ".com";
    }else {
        defEmployeeName = "Chris Maker" + suffix;
        defEmployeeId = "87788656" + suffix;
        defEmailId = "chris" + suffix + "@" + employeeRole + ".com";
    }
    return inquirer.prompt([
        {
            type: "input",
            name: "nameOfEmployee",
            default: defEmployeeName,
            message: "Enter the name of " + employeeRole
        },
        {
            type: "input",
            name: "idOfEmployee",
            default: defEmployeeId,
            message: "Provide employeeID of the " + employeeRole
        },
        {
            type: "input",
            name: "emailOfEmployee",
            default: defEmailId,
            message: "Provide email ID of the " + employeeRole
        }
    ]);
}

function promptManagerInfo() {

    return inquirer.prompt([
        {
            type: "input",
            name: "officeNumber",
            default: "4545",
            message: "Provide office number of the manager",
        }
    ]);
}

function promptEngineerInfo(suffix) {

    return inquirer.prompt([
        {
            type: "input",
            name: "github",
            default: "bootcamp" + suffix,
            message: "Provide github ID of the engineer",
        }
    ]);
}

function promptInternInfo(suffix) {

    return inquirer.prompt([
        {
            type: "input",
            name: "school",
            default: "USYD"  + suffix,
            message: "Provide school of the intern",
        }
    ]);
}

function promptAddMoreEmployees() {

    return inquirer.prompt([
        {
            type: "list",
            name: "addMore",
            message: "Do you want to add more employees?",
            choices: [
                "Yes",
                "No"
            ]
        }
    ]);
}

async function generateTeamProfile() {
    console.log("hi!! generating team profile");
    try {
        //const teamSizeData = await promptTeamSizes();
        await buildTeam();
        console.log("employees.length: " + employees.length);
        const html = render(employees);

        await writeFileAsync("team.html", html);

        console.log("Successfully wrote to team.html");
    } catch (err) {
        console.log(err);
    }
}

generateTeamProfile();


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
