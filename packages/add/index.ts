import defaultGenerator from "@webpack-cli/generators/add-generator";
import modifyConfigHelper from "@webpack-cli/utils/modify-config-helper";

/**
 * Is called and returns a scaffolding instance, adding properties
 *
 * @param	{String[]} args - array of arguments such as
 * @returns {Function} modifyConfigHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

export default function add(...args: string[]): Function {
	const DEFAULT_WEBPACK_CONFIG_FILENAME: string = "webpack.config.js";

	const filePaths: string[] = args.slice(3);
	let configFile: string = DEFAULT_WEBPACK_CONFIG_FILENAME;
	if (filePaths.length) {
		configFile = filePaths[0];
	}

	return modifyConfigHelper("add", defaultGenerator, configFile);
}
