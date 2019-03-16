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
const DEFAULT_WEBPACK_CONFIG_FILENAME = "webpack.config.js";

export default function add(...args: string[]): Function {
  const filePaths = args.slice(3);
  let configFile = DEFAULT_WEBPACK_CONFIG_FILENAME;
  if (filePaths.length) {
	  configFile = filePaths[0];
  }

  return modifyConfigHelper("add", defaultGenerator, configFile);
}
