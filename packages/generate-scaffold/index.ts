import * as c from "ansi-colors";
import * as inquirer from "inquirer";
import {
	exec
} from "child_process";
import * as fs from "fs";
import * as fse from "fs-extra"
import {
	resolve
} from "path";
import  chalk from "chalk";






const USER_DIRECTORY: string = process.env.PWD ? process.env.PWD : process.cwd();
const QUESTIONS: inquirer.Questions = require("./utils/questions");
const resolveProjectDirectory = (path: string, scaffoldProjectName: string): string => resolve(`${USER_DIRECTORY}/${scaffoldProjectName}`, path);
const info = (message: string): void => {
	console.log(c.bold("\n" + c.blue("i") + c.italic(` ${message}`)));
};
const done = (msg: string): void => {

	console.log(c.greenBright(`\u2713 [Done]: ${msg}`));
};
const blueColor = chalk.bold.rgb(38, 45, 255);

function start(): void {
	console.log(`

	${blueColor("\n Generator Webpack Scaffold \n")}
	`);

}

async function question() {
	info("Details of your scaffold");

	var answers: inquirer.Answers = await inquirer.prompt(QUESTIONS);

	return answers;
}

function scaffold(answers: inquirer.Answers) {
	console.log(`${blueColor("[.....]")} Preparing Your Scaffold Creater Project`);


	var packageJSON = require("./template/package.json");
	packageJSON.name = `webpack-scaffold-${answers.name}`;
	packageJSON.description = answers.description;
	packageJSON.author = answers.author;
	packageJSON.main = answers.main;
	packageJSON.repository.url = `git+${answers.github_repo}`;
	packageJSON.bugs.url = `${answers.github_repo}/issues`;
	packageJSON.homepage = `${answers.github_repo}#readme`;
	packageJSON.license = answers.license;

	var scaffoldProjectName = `webpack-scaffold-${answers.name}`;
	fse.copy("./template", resolveProjectDirectory("./", scaffoldProjectName), err => {
		if (err) throw err;
		fs.unlink(`${scaffoldProjectName}/package.json`, (err) => {
			if (err) throw err;
		});
		fs.writeFile(resolveProjectDirectory("./package.json", scaffoldProjectName), JSON.stringify(packageJSON, null, 2), (err2) => {
			if (err2) throw err;
			done("Scaffold Created Successfully");
		});
	});


}

function install() {
	console.log(`${blueColor("[.....]")} Installing Dependencies`);
	console.log(c.gray("  May take few minutes..."));
	exec(`cd ${USER_DIRECTORY} && npm install `, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`[stdout]: ${stdout}`);
		console.log(`[stderr]: ${stderr}`);
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