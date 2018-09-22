const { prompt } = require("inquirer");

class ExternalCommand {
	static async runCommand(command, args = []) {
		const cp = require("child_process");
		const executedCommand = await cp.spawn(command, args, {
			stdio: "inherit",
			shell: true
		});
		return new Promise((resolve, reject) => {
			executedCommand.on("error", error => {
				reject(error);
			});

			executedCommand.on("exit", code => {
				resolve();
			});
		});
	}

	static validateEnv(extName) {
		let packageIsInstalled;
		try {
			const path = require("path");
			const pathForCmd = path.resolve(
				process.cwd(),
				"node_modules",
				"@webpack-cli",
				extName
			);
			require.resolve(pathForCmd);
			packageIsInstalled = pathForCmd;
		} catch (err) {
			packageIsInstalled = false;
		}
		return packageIsInstalled;
	}
	static async promptInstallation(scopeName, name) {
		const path = require("path");
		const fs = require("fs");
		const readLine = require("readline");
		const isYarn = fs.existsSync(path.resolve(process.cwd(), "yarn.lock"));

		const packageManager = isYarn ? "yarn" : "npm";
		const options = ["install", "-D", scopeName];

		if (isYarn) {
			options[0] = "add";
		}

		const commandToBeRun = `${packageManager} ${options.join(" ")}`;
		console.error(`\nThe command moved into a separate package: ${name}\n`);
		const question = `Would you like to install ${name}? (That will run ${commandToBeRun})`;
		const answer = await prompt([
			{
				type: "confirm",
				name: "installConfirm",
				message: question,
				default: "Y",
				choices: ["Yes", "No", "Y", "N", "y", "n"]
			}
		]);
		if (answer.installConfirm === true) {
			await ExternalCommand.runCommand(commandToBeRun);
			return ExternalCommand.validateEnv(name);
		}
		process.exitCode = -1;
	}

	static async run(name, ...args) {
		let pkgLoc = ExternalCommand.validateEnv(name);
		const scopeName = "@webpack-cli/" + name;
		if (!pkgLoc) {
			pkgLoc = await ExternalCommand.promptInstallation(scopeName, name);
		}
		// Serve needs to be checked for
		return pkgLoc ? require(pkgLoc).default(args) : null;
	}
}

module.exports = ExternalCommand;
