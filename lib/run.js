const webpackCli = require("./webpack-cli");
const webpack = require("webpack");
const { core, commands } = require("./descriptions/args-detailed");
const cmdArgs = require("command-line-args");

process.on("uncaughtException", error => {
	console.error(`Uncaught exception: ${error}`);
	if (error && error.stack) console.error(error.stack);
	process.exit(1);
});

process.on("unhandledRejection", error => {
	console.error(`Promise rejection: ${error}`);
	if (error && error.stack) console.error(error.stack);
	process.exit(1);
});

module.exports = async() => {
	// this needs a better abstraction level
	const commandIsUsed = commands.find(cmd => {
		if (cmd.alias) {
			return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias);
		}
		return process.argv.includes(cmd.name);
	});
	let args;
	const cli = new webpackCli();
	if (commandIsUsed) {
		commandIsUsed.defaultOption = true;
		args = process.argv.slice(2).filter(p => p.indexOf("--") < 0 && p !== commandIsUsed.name && p !== commandIsUsed.alias);
		return await cli.runCommand(commandIsUsed, ...args);
	} else {
		args = cmdArgs(core, { stopAtFirstUnknown: true });
		try {
			const result = await cli.run(args, core);
			if (result.processingErrors.length > 0) {
				throw new Error(result.processingErrors);
			}

			process.exit(0);
			const compiler = webpack(result.webpackOptions);
			compiler.run(() => {});
		} catch (err) {
			console.error(err);
			process.exit(1);
		}
	}
};
