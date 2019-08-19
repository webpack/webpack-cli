const webpackCli = require('./webpack-cli');
const { core, commands } = require('./utils/cli-flags');
const cmdArgs = require('command-line-args');

require('./utils/process-log');

const isFlagPresent = (args, flag) => args.find(arg => [flag, `--${flag}`].includes(arg));
const stripDashedFlags = (args, cmd) => args.slice(2).filter(arg => ~arg.indexOf('--') && arg !== cmd.name && arg !== cmd.alias);

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
        args = stripDashedFlags(process.argv, commandIsUsed);
        return await cli.runCommand(commandIsUsed, ...args);
    } else {
        try {
        args = cmdArgs(core, { stopAtFirstUnknown: false });
            const result = await cli.run(args, core);
            if (!result) {
                return;
            }
        } catch (err) {

            // TODO: normalize and retry args when keys are same

            if(err.name === 'UNKNOWN_VALUE') {
                process.cliLogger.error(`Parse Error (unknown argument): ${err.value}`);
                return;
            }
            process.cliLogger.error(err);
        }
    }
}

// eslint-disable-next-line space-before-function-paren
(async () => {
    const commandIsUsed = isCommandUsed(commands);
    const cli = new webpackCli();
    runCLI(cli, commandIsUsed);
})();
