import * as c from "ansi-colors";
import chalk from "chalk";
import { exec } from "child_process";
import * as fs from "fs";
import * as fse from "fs-extra";
import * as inquirer from "inquirer";
import { resolve } from "path";
import {createNewPackageJSON} from "./utils/helper";
import * as PROMPT_QUESTIONS from "./utils/questions";

const cl = console;
const log = cl.log;

const USER_DIRECTORY: string = process.env.PWD ? process.env.PWD : process.cwd();
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

	const answers: inquirer.Answers = await inquirer.prompt(PROMPT_QUESTIONS);

	return answers;
}

function scaffold(answers: inquirer.Answers) {
	log(`${blueColor("[.....]")} Preparing Your Scaffold Creater Project`);
	const packageJSON = createNewPackageJSON(require("./template/package.json"), answers);
	const scaffoldProjectName = `webpack-scaffold-${answers.name}`;
	fse.copy("./template", resolveProjectDirectory("./", scaffoldProjectName), (err) => {
		if (err) { throw err; }
		fs.unlink(`${scaffoldProjectName}/package.json`, (linkErr) => {
			if (linkErr) { throw linkErr; }
		});
		fs.writeFile(
			resolveProjectDirectory("./package.json", scaffoldProjectName)
			, JSON.stringify(packageJSON, null, 2), (writeErr) => {
			if (writeErr) { throw writeErr; }
			done("Scaffold Created Successfully");
		});
	});
}

function install(answers: inquirer.Answers) {
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
		log(`
		\n
		${blueColor("\n Navigate to your scaffold project run")}
		\n > cd webpack-scaffold-${answers.name}
		\n ${blueColor("\n Install Dependecies")}
		\n > npm install
		\n ${blueColor("\n To test it locally , link it")}
		\n > npm link
		\n ${blueColor("\n Run the generator with init command of webpack")}
		\n > webpack init generator.js
		\n ${c.greenBright(`You are Good To Go ! `)}
		`);
	});
}

export default async () => {
	start();
	const answers = await question();
	scaffold(answers);
	install(answers);
};

(async () => {
	start();
	const answers: inquirer.Answers = await question();
	scaffold(answers);
	install(answers);
})();
