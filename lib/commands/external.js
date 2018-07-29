class ExternalCommand {
	// TODO: get functionality up then improve
	static validateEnv(extName) {
		let packageIsInstalled;
		try {
			const path = require("path");
			pathForCmd = path.resolve(
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

		const question = `Would you like to install ${name}? (That will run ${commandToBeRun}) (yes/NO)`;

		console.error(`The command moved into a separate package: ${name}`);
		const questionInterface = readLine.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		return questionInterface.question(question, answer => {
			questionInterface.close();
			switch (answer.toLowerCase()) {
				case "y":
				case "yes":
				case "1": {
					//eslint-disable-next-line
					return ExternalCommand.runCommand(packageManager, options)
						.then(result => {
							pathForCmd = path.resolve(
								process.cwd(),
								"node_modules",
								"@webpack-cli",
								name
							);
							if (name === "serve") {
								return require(pathForCmd).serve();
							}
							return require(pathForCmd)(...args); //eslint-disable-line
						})
						.catch(error => {
							console.error(error);
							process.exitCode = 1;
						});
					break;
				}
				default: {
					console.error(
						`${name} needs to be installed in order to run the command.`
					);
					process.exitCode = 1;
					break;
				}
			}
		});
	}
	static async runCommand(command, args) {
		const cp = require("child_process");
		return new Promise((resolve, reject) => {
			resolve();
			const executedCommand = cp.spawn(command, args, {
				stdio: "inherit",
				shell: true
			});

			executedCommand.on("error", error => {
				reject(error);
			});

			executedCommand.on("exit", code => {
				if (code === 0) {
					resolve();
				} else {
					reject();
				}
			});
		});
	}

	static async run(name, ...args) {
		const pkgLoc = ExternalCommand.validateEnv(name);
		const scopeName = "@webpack-cli/" + name;
		// This needs to be await based and resolve the same loc to preserve shell
		if (!pkgLoc) {
			await ExternalCommand.promptInstallation(scopeName, name);
		}
		//return require(pkgLoc)
	}
}

module.exports = ExternalCommand;
