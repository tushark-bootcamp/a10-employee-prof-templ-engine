const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

//const generateTeamRoster = require("./readmefilegenerator");



var teamSizes = {
    noOfEngineers: 0,
    noOfManagers: 0,
    noOfInterns: 0
};

var teamStructure = {
    engineer: {
        role: "Engineer",
        noOfEngineers: 0,
        engineers: [
            {
                name: "",
                id: "",
                email: "",
                gitHub: ""
            }
        ]

    },
    manager: {
        role: "Manager",
        noOfManagers: 0,
        managers: [
            {
                name: "",
                id: "",
                email: "",
                officeNumber: 0
            }
        ]

    },
    intern: {
        role: "Intern",
        noOfInterns: 0,
        interns: [
            {
                name: "",
                id: "",
                email: "",
                school: ""
            }
        ]

    }
};

promptTeamSizes();

const writeTeamRosterFileAsync = util.promisify(fs.writeFile);

function promptTeamSizes() {

    return inquirer.prompt([
        {
            type: "input",
            name: "noOfEngineers",
            message: "How many engineers do you have in your team"
        },
        {
            type: "input",
            name: "noOfInterns",
            message: "How many interns do you have in your team",
        }])
}

function buildTeamSizes(teamSizeData) {
    teamSizes.noOfEngineers = teamSizeData.noOfEngineers;
    teamSizes.noOfInterns = teamSizeData.noOfInterns;
}

function promptEngineerInfo() {

    return inquirer.prompt([
        {
            type: "input",
            name: "nameEngineer",
            message: "Please provide the name of the engineer"
        },
        {
            type: "input",
            name: "idEngineer",
            message: "Please provide the ID of the engineer",
        },
        {
            type: "input",
            name: "emailEngineer",
            message: "Please provide the emailID of the engineer",
        },
        {
            type: "input",
            name: "gitHub",
            message: "Please provide the github URL of the engineer",
        }
    ])
}

function buildEngineerProfile(promptEngineerData) {
    const engineer = new Engineer(promptEngineerData.nameEngineer,
        promptEngineerData.idEngineer,
        promptEngineerData.emailEngineer,
        promptEngineerData.gitHub);
}

function buildEngnTeam(promptData) {
    for (var i = 0; i < teamSizes.noOfEngineers; i++) {
        promptEngineerInfo();
    }
}

promptTeamStructure()
    .then(function (data) {
        const readme = buildTeamStructure(data);
        return writeTeamRosterFileAsync("team.html", team);
    })
    .then(function () {
        console.log("Successfully wrote to readme.md");
    })
    .catch(function (err) {
        console.log(err);
    });



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
