#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

const cmd = process.argv[2];

function runCmd(comm) {
    try {
        execSync(comm + ' ' + process.argv.slice(3).join(' '), { stdio: 'inherit' });
    }
    catch (err) {
        console.error(chalk.red(`Command failed: ${err.message}`));
        process.exit(1);
    }
}

function helpCmd() {
    console.log(`
${chalk.cyan("Usage:")}
  ${chalk.yellow("save-my-som")} ${chalk.white("<command>")} ${chalk.gray("-- <params>")}

${chalk.cyan("Commands:")}
  ${chalk.green("get")}                  Gather SoM project data
  ${chalk.green("build")}                Build HTML & CSS from data (must have run get first)
  ${chalk.green("preview")}              Preview HTML & CSS (must have run build first)
  ${chalk.green("--help")}               Display this help message

${chalk.cyan("Params:")}
  ${chalk.green("get")} -- ${chalk.bgGray("cookiefile=\"<filepath>\"")}    File path of txt file with cookie data
  ${chalk.green("preview")} -- ${chalk.bgGray("port=<port>")}            Local port on which to run preview
`);
}

switch (cmd) {
    case "get":
        runCmd("node index.js");
        break;
    case "build":
        runCmd("node build.js");
        break;
    case "preview":
        runCmd("node preview.js");
        break;
    case "--help":
    case "-h":
    default:
        helpCmd();
}