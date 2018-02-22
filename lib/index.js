"use strict";

const path = require("path");

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
	const popArgs = args ? args.slice(2).pop() : null;
	switch (command) {
		case "init": {
			const initPkgs = args.slice(2).length === 1 ? [] : [popArgs];
			//eslint-disable-next-line
			return require("webpack-cli-commands/init.js")(initPkgs);
		}
		case "migrate": {
			const filePaths = args.slice(2).length === 1 ? [] : [popArgs];
			if (!filePaths.length) {
				throw new Error("Please specify a path to your webpack config");
			}
			const inputConfigPath = path.resolve(process.cwd(), filePaths[0]);
			//eslint-disable-next-line
			return require("webpack-cli-commands/migrate.js")(inputConfigPath, inputConfigPath);
		}
		case "add": {
			//eslint-disable-next-line
			return require("webpack-cli-commands/add")();
		}
		case "remove": {
			//eslint-disable-next-line
			return require("webpack-cli-commands/remove")();
		}
		case "update": {
			return require("webpack-cli-commands/update")();
		}
		case "serve": {
			return require("webpack-cli-commands/serve").serve();
		}
		case "make": {
			return require("webpack-cli-commands/make")();
		}
		case "generate-loader": {
			return require("webpack-loader-generators")();
		}
		case "generate-plugin": {
			return require("webpack-plugin-generators")();
		}
		default: {
			throw new Error(`Unknown command ${command} found`);
		}
	}
};