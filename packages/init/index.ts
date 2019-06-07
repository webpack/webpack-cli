import defaultGenerator from "@webpack-cli/generators/init-generator";
import modifyConfigHelper from "@webpack-cli/utils/modify-config-helper";
import npmPackagesExists from "@webpack-cli/utils/npm-packages-exists";

const AUTO_PREFIX = "--auto";

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
	const packages = args.slice(3);
	const includesDefaultPrefix = packages.includes(AUTO_PREFIX);
	if (packages.length === 0 || includesDefaultPrefix) {
		return modifyConfigHelper("init", defaultGenerator, null, null, includesDefaultPrefix);
	}
	return npmPackagesExists(packages);
}
