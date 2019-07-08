import chalk from "chalk";
import { SpawnSyncReturns } from "child_process";
import * as spawn from "cross-spawn";
import * as inquirer from "inquirer";
import * as path from "path";

import { processPromise } from "@webpack-cli/utils/resolve-packages";

interface Commands {
	dependency: string[];
	devDependency: string[];
	optionalDependency: string[];
}

interface PackageManagerConfig {
	[key: string]: Commands;
}

const pmConfig: PackageManagerConfig = {
	npm: {
		dependency: ["install", "--save"],
		devDependency: ["install", "--save-dev"],
		optionalDependency: ["install", "--save-optional"]
	},
	yarn: {
		dependency: ["add"],
		devDependency: ["add", "-D"],
		optionalDependency: ["add", "--optional"]
	}
};

/**
 *
 * Installs WDS using the respective package manager with corresponding commands
 *
 * @param {String} pm - package manager to be used
 * @param {String} cmd - arg to spawn with
 * @returns {Function} spawn - installs WDS
 *
 * The dependency installation commands for the
 * respective package manager is available as
 * nested objects within pmConfig
 *
 * We gonna extract the root installation command
 * and rest of the flags from pmConfig object
 * by means of array destructuring
 */

const spawnWithArg = (pm: string, cmd: string): SpawnSyncReturns<Buffer> => {
	const [installCmd, ...flags] = pmConfig[pm][cmd];
	const options: string[] = [installCmd, "webpack-dev-server", ...flags];
	return spawn.sync(pm, options, { stdio: "inherit" });
};

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

export default function serve(): Promise<void | Function> {
	const packageJSONPath = getRootPathModule("package.json");
	if (!packageJSONPath) {
		console.error("\n", chalk.red("✖ Could not find your package.json file"), "\n");
		process.exit(1);
	}
	// TODO: to refactor this dynamic require and use import()
	// eslint-disable-next-line
	const packageJSON: object = require(packageJSONPath);
	/*
	 * We gotta do this, cause some configs might not have devdep,
	 * dep or optional dep, so we'd need sanity checks for each
	 */
	const hasDevServerDep: string[] = packageJSON
		? Object.keys(packageJSON).filter((p: string): boolean => packageJSON[p]["webpack-dev-server"])
		: [];

	if (hasDevServerDep.length) {
		const WDSPath: string = getRootPathModule("node_modules/webpack-dev-server/bin/webpack-dev-server.js");
		if (!WDSPath) {
			console.error(
				"\n",
				chalk.red("✖ Could not find the webpack-dev-server dependency in node_modules root path")
			);
			console.info(
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
				chalk.bold("✖ We didn't find any webpack-dev-server dependency in your project,") +
				"\n" +
				chalk.bold.green("  'webpack serve'") +
				" " +
				chalk.bold("requires you to have it installed ") +
				"\n\n"
		);
		return inquirer
			.prompt([
				{
					default: "Y",
					message: "Do you want to install it? (default: Y)",
					name: "confirmDevserver",
					type: "confirm"
				}
			])
			.then(
				(answer: { confirmDevserver: boolean }): Promise<void | Function> => {
					if (answer.confirmDevserver) {
						return inquirer
							.prompt([
								{
									choices: ["devDependency", "optionalDependency", "dependency"],
									message:
										"What kind of dependency do you want it to be under? (default: devDependency)",
									name: "confirmDepType",
									type: "list",
									default: "devDependency"
								}
							])
							.then(
								(depTypeAns: { confirmDepType: string }): Promise<void | Function> => {
									const packager: string = getRootPathModule("package-lock.json") ? "npm" : "yarn";
									let spawnAction: () => SpawnSyncReturns<Buffer>;

									spawnAction = (): SpawnSyncReturns<Buffer> =>
										spawnWithArg(packager, depTypeAns.confirmDepType);

									return processPromise(spawnAction()).then(
										(): Promise<void | Function> => {
											// Recursion doesn't work well with require call being cached
											delete require.cache[require.resolve(packageJSONPath)];
											return serve();
										}
									);
								}
							);
					} else {
						console.error(chalk.bold.red("✖ Serve aborted due cancelling"));
						process.exitCode = 1;
					}
				}
			)
			.catch((err: object): void => {
				console.error(chalk.red("✖ Serve aborted due to some errors"));
				console.error(err);
				process.exitCode = 1;
			});
	}
}
