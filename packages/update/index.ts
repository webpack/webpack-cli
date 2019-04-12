import defaultGenerator from "@webpack-cli/generators/update-generator";
import modifyConfigHelper from "@webpack-cli/utils/modify-config-helper";

/**
 * Is called and returns a scaffolding instance, updating properties
 *
 * @param	{String[]} args - array of arguments such as
 * @returns {Function} modifyConfigHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

export default function update(...args: string[]): Function {
	const DEFAULT_WEBPACK_CONFIG_FILENAME = "webpack.config.js";

	const filePaths = args.slice(3);
	let configFile = DEFAULT_WEBPACK_CONFIG_FILENAME;
	if (filePaths.length) {
		configFile = filePaths[0];
	}

	return modifyConfigHelper("update", defaultGenerator, configFile);
}
