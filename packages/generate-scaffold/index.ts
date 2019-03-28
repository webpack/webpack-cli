import * as c from "ansi-colors";
import chalk from "chalk";
import { exec } from "child_process";
import * as fs from "fs";
import * as fse from "fs-extra";
import * as inquirer from "inquirer";
import { resolve } from "path";

const cl = console;
const log = cl.log;

const USER_DIRECTORY: string = process.env.PWD ? process.env.PWD : process.cwd();
import * as QUESTIONS from "./utils/questions";
const resolveProjectDirectory = (path: string, scaffoldProjectName: string): string =>
resolve(`${USER_DIRECTORY}/${scaffoldProjectName}`, path);

const info = (message: string): void => {
	log(c.bold("\n" + c.blue("i") + c.italic(` ${message}`)));
};
const done = (msg: string): void => {

	log(c.greenBright(`\u2713 [Done]: ${msg}`));
};
const blueColor = chalk.bold.rgb(38, 45, 255);

function start(): void {
	log(`

	${blueColor("\n Generator Webpack Scaffold \n")}
	`);

}

async function question() {
	info("Details of your scaffold");

	const answers: inquirer.Answers = await inquirer.prompt(QUESTIONS);

	return answers;
}

function scaffold(answers: inquirer.Answers) {
	log(`${blueColor("[.....]")} Preparing Your Scaffold Creater Project`);

	const packageJSON = require("./template/package.json");
	packageJSON.name = `webpack-scaffold-${answers.name}`;
	packageJSON.description = answers.description;
	packageJSON.author = answers.author;
	packageJSON.main = answers.main;
	packageJSON.repository.url = `git+${answers.github_repo}`;
	packageJSON.bugs.url = `${answers.github_repo}/issues`;
	packageJSON.homepage = `${answers.github_repo}#readme`;
	packageJSON.license = answers.license;

	const scaffoldProjectName = `webpack-scaffold-${answers.name}`;
	fse.copy("./template", resolveProjectDirectory("./", scaffoldProjectName), (err) => {
		if (err) { throw err; }
		fs.unlink(`${scaffoldProjectName}/package.json`, (err1) => {
			if (err1) { throw err1; }
		});
		fs.writeFile(
			resolveProjectDirectory("./package.json", scaffoldProjectName)
			, JSON.stringify(packageJSON, null, 2), (err2) => {
			if (err2) { throw err; }
			done("Scaffold Created Successfully");
		});
	});
}

function install() {
	log(`${blueColor("[.....]")} Installing Dependencies`);
	log(c.gray("  May take few minutes..."));
	exec(`cd ${USER_DIRECTORY} && npm install `, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		log(`[stdout]: ${stdout}`);
		log(`[stderr]: ${stderr}`);
		done("Dependencies Installed ");
	});
}

export default async () => {
	start();
	const answers = await question();
	scaffold(answers);
	install();
};

(async () => {
	start();
	const answers: inquirer.Answers = await question();
	scaffold(answers);
	install();
})();
