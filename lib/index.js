"use strict";

const InitCommand = require("./commands/init");
const MigrateCommand = require("./commands/migrate");
const AddCommand = require("./commands/add");
const RemoveCommand = require("./commands/remove");
const UpdateCommand = require("./commands/update");
const ServeCommand = require("./commands/serve");
const InfoCommand = require("./commands/info");
const GenerateLoaderCommand = require("./commands/generate-loader");
const GeneratePluginCommand = require("./commands/generate-plugin");

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

module.exports = class WebpackCLI {
	constructor() {
		this.commands = new Map();
		// Commands
		this.addCommand(new InitCommand());
		this.addCommand(new MigrateCommand());
		this.addCommand(new AddCommand());
		this.addCommand(new RemoveCommand());
		this.addCommand(new UpdateCommand());
		this.addCommand(new ServeCommand());
		this.addCommand(new InfoCommand());
		this.addCommand(new GenerateLoaderCommand());
		this.addCommand(new GeneratePluginCommand());
	}

	addCommand(command) {
		this.commands.set(command.name, command);
	}

	run(command, args) {
		const popArgs = args ? args.slice(2).pop() : null;
		const commandToRun = this.commands.get(command);
		// if command does not exists.
		if (!commandToRun) {
			throw new Error(`Unknown command ${command} found`);
		}
		// otherwise...
		return commandToRun.run({
			args,
			popArgs
		});
	}
};
