// based on https://github.com/webpack/webpack/blob/master/bin/webpack.js
module.exports = function promptForInstallation(package, ...args) {

let packageIsInstalled = false;
try {
	require.resolve(package);
	packageIsInstalled = true;
} catch (err) {
	packageIsInstalled = false;
}

if (!packageIsInstalled) {
	const path = require("path");
	const fs = require("fs");
	const readLine = require("readline");
	const isYarn = fs.existsSync(path.resolve(process.cwd(), "yarn.lock"));

	const packageManager = isYarn ? "yarn" : "npm";
	const options = ["install", "-D", package];

	if (isYarn) {
		options[0] = "add";
	}

	const commandToBeRun = `${packageManager} ${options.join(" ")}`;

	const question = `Would you like to install ${package}? (That will run ${commandToBeRun}) (yes/NO)`;

	console.error(`The command moved into a separate package: @webpack-cli/${package}`);
	const questionInterface = readLine.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	questionInterface.question(question, answer => {
		questionInterface.close();
		switch (answer.toLowerCase()) {
			case "y":
			case "yes":
			case "1": {
				runCommand(packageManager, options)
					.then(result => {
						return require(`@webpack-cli/${package}`)(...args); //eslint-disable-line
					})
					.catch(error => {
						console.error(error);
						process.exitCode = 1;
					});
				break;
			}
			default: {
				console.error(
					"It needs to be installed alongside webpack CLI to use the command"
				);
				process.exitCode = 1;
				break;
			}
		}
	});
} else {
	require(package)(...args); // eslint-disable-line
}
}