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
            args = cmdArgs(core, { stopAtFirstUnknown: false, partial: true });
            const result = await cli.run(args, core);
            if (!result) {
                return;
            }
        } catch (err) {

            if (err.name === 'UNKNOWN_VALUE') {
                process.cliLogger.error(`Parse Error (unknown argument): ${err.value}`);
                return;
            }
            else if (err.name === 'ALREADY_SET') {
                const argsMap = {};
                const keysToDelete = [];
                process.argv.forEach((arg, idx) => {
                    const oldMapValue = argsMap[arg];
                    argsMap[arg] = {
                        value: process.argv[idx],
                        pos: idx
                    }
                    // Swap idx of overriden value
                    if (oldMapValue) {
                        argsMap[arg].pos = oldMapValue.pos;
                        keysToDelete.push(idx + 1);
                    }
                })
                // Filter out the value for the overriden key
                const newArgKeys = Object.keys(argsMap).filter(arg => !keysToDelete.includes(argsMap[arg].pos));
                process.argv = newArgKeys;
                args = cmdArgs(core, { stopAtFirstUnknown: false, partial: true });
                const result = await cli.run(args, core);
                if (!result) {
                    return;
                }
                process.cliLogger.warn(`duplicate flags found, defaulting to last set value`);
            }
            else {
                process.cliLogger.error(err);
                return;
            }
        }
    }
}

// eslint-disable-next-line space-before-function-paren
(async () => {
    const commandIsUsed = isCommandUsed(commands);
    const cli = new webpackCli();
    runCLI(cli, commandIsUsed);
})();
