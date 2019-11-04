const WebpackCli = require("./webpack-cli");
const { core, commands } = require("./utils/cli-flags");
const cmdArgs = require("command-line-args");
const logger = require('./utils/logger')

process.on("uncaughtException", error => {
	logger.error(`Uncaught exception: ${error}`);
	if (error && error.stack) logger.error(error.stack);
	process.exit(1);
});

process.on("unhandledRejection", error => {
	logger.error(`Promise rejection: ${error}`);
	if (error && error.stack) logger.error(error.stack);
	process.exit(1);
});

async function runCLI(cli, commandIsUsed) {
	let args;
	if (commandIsUsed) {
		commandIsUsed.defaultOption = true;
		args = process.argv
			.slice(2)
			.filter(p => p.indexOf("--") < 0 && p !== commandIsUsed.name && p !== commandIsUsed.alias);
		return await cli.runCommand(commandIsUsed, ...args);
	} else {
		args = cmdArgs(core, { stopAtFirstUnknown: true });
		try {
			const result = await cli.run(args, core);
			if (!result) {
				return;
			}
		} catch (err) {
			logger.error(err);
			process.exit(1);
		}
	}
}

function isCommandUsed(commands) {
	return commands.find(cmd => {
		if (cmd.alias) {
			return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias);
		}
		return process.argv.includes(cmd.name);
	});
}
(async() => {
	const commandIsUsed = isCommandUsed(commands);
	const cli = new WebpackCli();
	await runCLI(cli, commandIsUsed);
})();
