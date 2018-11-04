import defaultGenerator from "@webpack-cli/generators/remove-generator";
import modifyConfigHelper from "@webpack-cli/utils/modify-config-helper";

/**
 * Is called and returns a scaffolding instance, removing properties
 *
 * @param	{String[]} args - array of arguments such as
 * @returns {Function} modifyConfigHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

export default function remove(...args: string[]): Function {
	const DEFAULT_WEBPACK_CONFIG_FILENAME: string = "webpack.config.js";

	const filePaths: string[] = args.slice(3);
	let configFile: string = DEFAULT_WEBPACK_CONFIG_FILENAME;
	if (filePaths.length) {
		configFile = filePaths[0];
	}

	return modifyConfigHelper("remove", defaultGenerator, configFile);
}
