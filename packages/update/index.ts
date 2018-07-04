import defaultGenerator from "@webpack-cli/generators/update-generator";
import modifyConfigHelper from "@webpack-cli/utils/modify-config-helper";

/**
 * Is called and returns a scaffolding instance, updating properties
 *
 * @returns {Function} modifyConfigHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

export default function() {
	return modifyConfigHelper("update", defaultGenerator);
}
