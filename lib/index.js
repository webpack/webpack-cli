"use strict";

/**
 *
 * First function to be called after running a flag. This is a check,
 * to match the flag with the respective require.
 *
 * @param {String} command - which feature to use
 * @param {Object} args - arguments from the CLI
 * @returns {Function} invokes the module with the supplied command
 *
 */

module.exports = function initialize(command, args) {
	if (!command) {
		throw new Error(`Unknown command ${command} found`);
	} else if (command === "serve") {
		return require(`./commands/${command}`).serve();
	}
	return require(`./commands/${command}`)(...args);
};
