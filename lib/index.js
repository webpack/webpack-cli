"use strict";

const path = require("path");

/*
* @function initialize
*
* First function to be called after running a flag. This is a check,
* to match the flag with the respective require.
*
* @param { String } command - which feature to use
* @param { Object } args - arguments from the CLI
* @returns { Module } returns the module with the command
*
*/

module.exports = function initialize(command, args) {
	const popArgs = args.slice(2).pop();
	switch (command) {
		case "init": {
			const initPkgs = args.slice(2).length === 1 ? [] : [popArgs];
			//eslint-disable-next-line
			return require("./commands/init.js")(initPkgs);
		}
		case "migrate": {
			const filePaths = args.slice(2).length === 1 ? [] : [popArgs];
			if (!filePaths.length) {
				throw new Error("Please specify a path to your webpack config");
			}
			const inputConfigPath = path.resolve(process.cwd(), filePaths[0]);
			//eslint-disable-next-line
			return require("./commands/migrate.js")(inputConfigPath, inputConfigPath);
		}
		case "add": {
			// [action, argument] i.e : [plugin, commonschunk]
			const action = args.slice(2).length === 1 ? [] : args.slice(3);
			const actionType = action.shift();
			if (!action.length) {
				throw new Error("Please specify what action you want to do");
			}
			//eslint-disable-next-line
			return require("./commands/add.js")(actionType, action);
		}
		case "remove": {
			const actionType = args.slice(2).length === 1 ? [] : [popArgs];
			if (!actionType.length) {
				throw new Error("Please specify what action you want to do");
			}
			//eslint-disable-next-line
			return require("./commands/remove.js")(actionType, popArgs);
		}
		case "generate-loader": {
			return require("./generate-loader/index.js")();
		}
		case "generate-plugin": {
			return require("./generate-plugin/index.js")();
		}
		default: {
			throw new Error(`Unknown command ${command} found`);
		}
	}
};
