const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

var teamSizes = {
  noOfEngineers: 0,
  noOfInterns: 0
};

const writeFileAsync = util.promisify(fs.writeFile);

function prompty() {
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
    },
    {
      type: "list",
      message: "Do you want to continue?",
      name: "continue",
      choices: [
        "yes",
        "no"
      ]
    }
  ]);
}

async function promptTeamSizes() {
  var noOfEngineers = 0;
  var noOfInterns = 0;
  var contLooping = true;
  while (contLooping) {
    const response = await prompty();
    noOfEngineers += parseInt(response.noOfEngineers);
    noOfInterns += parseInt(response.noOfInterns);
    if (response.continue === "no") {
      contLooping = false;
      teamSizes.noOfEngineers = noOfEngineers;
      teamSizes.noOfInterns = noOfInterns;
      console.log("teamSizes.noOfEngineers: " + teamSizes.noOfEngineers);
      console.log("teamSizes.noOfInterns: " + teamSizes.noOfInterns);
    }

  }
}


// Not in use
function buildTeamSizes(teamSizeData) {
  //let teamSizes;
  teamSizes.noOfEngineers = teamSizeData.noOfEngineers;
  teamSizes.noOfInterns = teamSizeData.noOfInterns;
  //return teamSizes;
}

async function initTeam() {
  console.log("hi")
  try {
    //const teamSizeData = await promptTeamSizes();
    await promptTeamSizes();
    console.log("teamSizes.noOfEngineers:" + teamSizes.noOfEngineers);
    console.log("teamSizes.noOfInterns:" + teamSizes.noOfInterns);
    //var teamSizes = buildTeamSizes(teamSizeData);
    //buildTeamSizes(teamSizeData);

    const html = generateHTML(teamSizes);

    await writeFileAsync("index.html", html);

    console.log("Successfully wrote to index.html");
  } catch (err) {
    console.log(err);
  }
}

function generateHTML(teamSizes) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <title>Document</title>
  </head>
  <body>
    <div class="jumbotron jumbotron-fluid">
    <div class="container">
      <h1 class="display-4">Hi! Number of engineers are: ${teamSizes.noOfEngineers}</h1>
      <p class="lead">Number of interns are: ${teamSizes.noOfInterns}.</p>
      <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
      <ul class="list-group">
        <li class="list-group-item">My GitHub username is ${teamSizes.noOfEngineers}</li>
        <li class="list-group-item">LinkedIn: ${teamSizes.noOfInterns}</li>
      </ul>
    </div>
  </div>
  </body>
  </html>`;
}

initTeam();