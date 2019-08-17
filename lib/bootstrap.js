const webpackCli = require('./webpack-cli');
const { core, commands } = require('./utils/cli-flags');
const cmdArgs = require('command-line-args');

require('./utils/process-log');

const isFlagPresent = (args, flag) => args.find(arg => [flag, `--${flag}`].includes(arg));
const normalizeFlags = cmd => process.argv.slice(2).filter(arg => arg.indexOf('--') < 0 && arg !== cmd.name && arg !== cmd.alias);

const isCommandUsed = commands =>
    commands.find(cmd => {
        return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias);
    });

async function runCLI(cli, commandIsUsed) {
    let args;
    const helpFlagExists = isFlagPresent(process.argv, 'help');
    const versionFlagExists = isFlagPresent(process.argv, 'version');

    if (helpFlagExists) {
        cli.runHelp();
        return;
    } else if (versionFlagExists) {
      cli.runVersion();
      return;
    }

    if (commandIsUsed) {
        commandIsUsed.defaultOption = true;
        args = normalizeFlags(commandIsUsed);
        return await cli.runCommand(commandIsUsed, ...args);
    } else {
        args = cmdArgs(core, { stopAtFirstUnknown: false });
        try {
            const result = await cli.run(args, core);
            if (!result) {
                return;
            }
        } catch (err) {
            process.cliLogger.error(err);
            process.exit(1);
        }
    }
}

// eslint-disable-next-line space-before-function-paren
(async () => {
    const commandIsUsed = isCommandUsed(commands);
    const cli = new webpackCli();
    runCLI(cli, commandIsUsed);
})();
