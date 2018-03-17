"use strict";

/**
 *
 * First function to be called after running a flag. This is a check,
 * to match the flag with the respective require.
 *
 * @param	{String}	command - which feature to use
 * @param	{Object}	args - arguments from the CLI
 * @returns	{Function}	invokes the module with the supplied command
 *
 */

module.exports = function initialize(command, args) {
<<<<<<< HEAD
	if (!command) {
		throw new Error(`Unknown command ${command} found`);
	} else if (command === "serve") {
		return require(`./commands/${command}`).serve();
=======
	const popArgs = args ? args.slice(2).pop() : null;
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
			const configPath = path.resolve(process.cwd(), filePaths[0]);
			//eslint-disable-next-line
			return require("./commands/migrate.js")(configPath);
		}
		case "add": {
			//eslint-disable-next-line
			return require("./commands/add")();
		}
		case "remove": {
			//eslint-disable-next-line
			return require("./commands/remove")();
		}
		case "update": {
			return require("./commands/update")();
		}
		case "serve": {
			return require("./commands/serve").serve();
		}
		case "make": {
			return require("./commands/make")();
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
>>>>>>> cli(migrate): clean dedundant config param
	}
	return require(`./commands/${command}`)(...args);
};
