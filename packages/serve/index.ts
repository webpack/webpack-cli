import chalk from "chalk";
import { SpawnSyncReturns } from "child_process";
import * as spawn from "cross-spawn";
import * as inquirer from "inquirer";
import * as path from "path";

import { processPromise } from "@webpack-cli/utils/resolve-packages";
import { List } from "@webpack-cli/webpack-scaffold";

/**
 *
 * Installs WDS using NPM with --save --dev etc
 *
 * @param {Object} cmd - arg to spawn with
 * @returns {Void}
 */

const spawnNPMWithArg = (cmd: string): SpawnSyncReturns<Buffer> =>
	spawn.sync("npm", ["install", "webpack-dev-server", cmd], {
		stdio: "inherit",
	});

/**
 *
 * Installs WDS using Yarn with add etc
 *
 * @param {Object} cmd - arg to spawn with
 * @returns {Void}
 */

const spawnYarnWithArg = (cmd: string): SpawnSyncReturns<Buffer> =>
	spawn.sync("yarn", ["add", "webpack-dev-server", cmd], {
		stdio: "inherit",
	});

/**
 *
 * Find the path of a given module
 *
 * @param {Object} dep - dependency to find
 * @returns {String} string with given path
 */

const getRootPathModule = (dep: string): string => path.resolve(process.cwd(), dep);

/**
 *
 * Prompts for installing the devServer and running it
 *
 * @param {String[]} args - args processed from the CLI
 * @returns {Function} invokes the devServer API
 */

export default function serve(...args: string[]) {
	const packageJSONPath = getRootPathModule("package.json");
	if (!packageJSONPath) {
		console.error(
			"\n",
			chalk.red("✖ Could not find your package.json file"),
			"\n",
		);
		process.exit(1);
	}
	const packageJSON: object = require(packageJSONPath);
	/*
	 * We gotta do this, cause some configs might not have devdep,
	 * dep or optional dep, so we'd need sanity checks for each
	*/
	const hasDevServerDep: string[] = packageJSON
		? Object.keys(packageJSON).filter((p: string) => packageJSON[p]["webpack-dev-server"])
		: [];

	if (hasDevServerDep.length) {
		const WDSPath: string = getRootPathModule(
			"node_modules/webpack-dev-server/bin/webpack-dev-server.js",
		);
		if (!WDSPath) {
			console.error(
				"\n",
				chalk.red(
					"✖ Could not find the webpack-dev-server dependency in node_modules root path",
				),
			);
			console.info(
				chalk.bold.green(" ✔︎"),
				"Try this command:",
				chalk.bold.green("rm -rf node_modules && npm install"),
			);
			process.exit(1);
		}
		return require(WDSPath);
	} else {
		process.stdout.write(
			"\n" +
				chalk.bold(
					"✖ We didn't find any webpack-dev-server dependency in your project,",
				) +
				"\n" +
				chalk.bold.green("  'webpack serve'") +
				" " +
				chalk.bold("requires you to have it installed ") +
				"\n\n",
		);
		return inquirer
			.prompt([
				{
					default: "Y",
					message: "Do you want to install it? (default: Y)",
					name: "confirmDevserver",
					type: "confirm",
				},
			])
			.then((answer: {
				confirmDevserver: boolean,
			}) => {
				if (answer.confirmDevserver) {
					return inquirer
						.prompt(
							List(
								"confirmDepType",
								"What kind of dependency do you want it to be under? (default: devDependency)",
								["devDependency", "optionalDependency", "dependency"],
							),
						)
						.then((depTypeAns: {
							confirmDepType: string;
						}) => {
							const packager: string = getRootPathModule("package-lock.json")
								? "npm"
								: "yarn";
							let spawnAction: (_?: void) => SpawnSyncReturns<Buffer>;
							if (depTypeAns.confirmDepType === "devDependency") {
								if (packager === "yarn") {
									spawnAction = (_?: void) => spawnYarnWithArg("--dev");
								} else {
									spawnAction = (_?: void) => spawnNPMWithArg("--save-dev");
								}
							}
							if (depTypeAns.confirmDepType === "dependency") {
								if (packager === "yarn") {
									spawnAction = (_?: void) => spawnYarnWithArg(" ");
								} else {
									spawnAction = (_?: void) => spawnNPMWithArg("--save");
								}
							}
							if (depTypeAns.confirmDepType === "optionalDependency") {
								if (packager === "yarn") {
									spawnAction = (_?: void) => spawnYarnWithArg("--optional");
								} else {
									spawnAction = (_?: void) => spawnNPMWithArg("--save-optional");
								}
							}
							return processPromise(spawnAction())
								.then((_: void) => {
									// Recursion doesn't work well with require call being cached
									delete require.cache[require.resolve(packageJSONPath)];
									return serve();
							});
						});
				} else {
					console.error(chalk.bold.red("✖ Serve aborted due cancelling"));
					process.exitCode = 1;
				}
			})
			.catch((err: object) => {
				console.error(chalk.red("✖ Serve aborted due to some errors"));
				console.error(err);
				process.exitCode = 1;
			});
	}
}
