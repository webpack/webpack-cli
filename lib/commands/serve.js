"use strict";

const inquirer = require("inquirer");
const path = require("path");
const chalk = require("chalk");
const spawn = require("cross-spawn");
const List = require("webpack-addons").List;
const processPromise = require("../utils/resolve-packages").processPromise;

/**
 *
 * Installs WDS using NPM with --save --dev etc
 *
 * @param {Object} cmd - arg to spawn with
 * @returns {Void}
 */

const spawnNPMWithArg = cmd =>
	spawn.sync("npm", ["install", "webpack-dev-server", cmd], {
		stdio: "inherit"
	});

/**
 *
 * Installs WDS using Yarn with add etc
 *
 * @param {Object} cmd - arg to spawn with
 * @returns {Void}
 */

const spawnYarnWithArg = cmd =>
	spawn.sync("yarn", ["add", "webpack-dev-server", cmd], {
		stdio: "inherit"
	});

/**
 *
 * Find the path of a given module
 *
 * @param {Object} dep - dependency to find
 * @returns {String} string with given path
 */

const getRootPathModule = dep => path.resolve(process.cwd(), dep);

/**
 *
 * Prompts for installing the devServer and running it
 *
 * @param {Object} args - args processed from the CLI
 * @returns {Function} invokes the devServer API
 */

function serve() {
	let packageJSONPath = getRootPathModule("package.json");
	if (!packageJSONPath) {
		console.log(
			"\n",
			chalk.red("✖ Could not find your package.json file"),
			"\n"
		);
		process.exit(1);
	}
	let packageJSON = require(packageJSONPath);
	/*
	 * We gotta do this, cause some configs might not have devdep,
	 * dep or optional dep, so we'd need sanity checks for each
	*/
	let hasDevServerDep = packageJSON
		? Object.keys(packageJSON).filter(p => packageJSON[p]["webpack-dev-server"])
		: [];

	if (hasDevServerDep.length) {
		let WDSPath = getRootPathModule("node_modules/webpack-dev-server/cli.js");
		if (!WDSPath) {
			console.log(
				"\n",
				chalk.red(
					"✖ Could not find the webpack-dev-server dependency in node_modules root path"
				)
			);
			console.log(
				chalk.bold.green(" ✔︎"),
				"Try this command:",
				chalk.bold.green("rm -rf node_modules && npm install")
			);
			process.exit(1);
		}
		return require(WDSPath);
	} else {
		process.stdout.write(
			"\n" +
				chalk.bold(
					"✖ We didn't find any webpack-dev-server dependency in your project,"
				) +
				"\n" +
				chalk.bold.green("  'webpack serve'") +
				" " +
				chalk.bold("requires you to have it installed ") +
				"\n\n"
		);
		return inquirer
			.prompt([
				{
					type: "confirm",
					name: "confirmDevserver",
					message: "Do you want to install it? (default: Y)",
					default: "Y"
				}
			])
			.then(answer => {
				if (answer["confirmDevserver"]) {
					return inquirer
						.prompt(
							List(
								"confirmDepType",
								"What kind of dependency do you want it to be under? (default: devDependency)",
								["devDependency", "optionalDependency", "dependency"]
							)
						)
						.then(depTypeAns => {
							const packager = getRootPathModule("package-lock.json")
								? "npm"
								: "yarn";
							let spawnAction;
							if (depTypeAns["confirmDepType"] === "devDependency") {
								if (packager === "yarn") {
									spawnAction = _ => spawnYarnWithArg("--dev");
								} else {
									spawnAction = _ => spawnNPMWithArg("--save-dev");
								}
							}
							if (depTypeAns["confirmDepType"] === "dependency") {
								if (packager === "yarn") {
									spawnAction = _ => spawnYarnWithArg(" ");
								} else {
									spawnAction = _ => spawnNPMWithArg("--save");
								}
							}
							if (depTypeAns["confirmDepType"] === "optionalDependency") {
								if (packager === "yarn") {
									spawnAction = _ => spawnYarnWithArg("--optional");
								} else {
									spawnAction = _ => spawnNPMWithArg("--save-optional");
								}
							}
							return processPromise(spawnAction()).then(_ => {
								// Recursion doesn't work well with require call being cached
								delete require.cache[require.resolve(packageJSONPath)];
								return serve();
							});
						});
				} else {
					console.log(chalk.bold.red("✖ Serve aborted due cancelling"));
					process.exitCode = 1;
				}
			})
			.catch(err => {
				console.log(chalk.red("✖ Serve aborted due to some errors"));
				console.error(err);
				process.exitCode = 1;
			});
	}
}

module.exports = {
	serve,
	getRootPathModule,
	spawnNPMWithArg,
	spawnYarnWithArg
};
