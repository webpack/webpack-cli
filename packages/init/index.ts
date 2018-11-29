import defaultGenerator from "@webpack-cli/generators/init-generator";
import modifyConfigHelper from "@webpack-cli/utils/modify-config-helper";
import npmPackagesExists from "@webpack-cli/utils/npm-packages-exists";
import runTransform from "@webpack-cli/utils/scaffold";

/**
 *
 * First function to be called after running the init flag. This is a check,
 * if we are running the init command with no arguments or if we got dependencies
 *
 * @param	{String[]}		args - array of arguments such as
 * packages included when running the init command
 * @returns	{Function}	creator/npmPackagesExists - returns an installation of the package,
 * followed up with a yeoman instance of that if there's packages. If not, it creates a defaultGenerator
 */

export default function initializeInquirer(...args: string[]): Function | void {
	const packages: string[] = args.slice(3);

	if (packages.length === 0) {
		return modifyConfigHelper("init", defaultGenerator);
	}
	return npmPackagesExists(packages);
}

export function UIManager(dependencies: string[]) {
	// tslint:disable-next-line:no-var-requires
	const npm = require("npm");
	const returnObject: {
		errors: String[],
	} = {errors: []};
	// Install Dependencies
	npm.load((err) => {
		if (err) {
			return { error: err};
		}
		dependencies.forEach( (d) => {
			process.stdout.write(`🛫 Installing ${d}  \n`);
			npm.commands.install([d], (er , data) => {
				if (er) { returnObject.errors.push(er); }
				if (data) {
					process.stdout.write(`.`);
				}
			});
			process.stdout.write(`.. done`);
		});
	});

	return returnObject;
}
