const WebpackCLI = require('./webpack-cli');
const { core, commands } = require('./utils/cli-flags');
const cmdArgs = require('command-line-args');

require('./utils/process-log');

const isFlagPresent = (args, flag) => args.find(arg => [flag, `--${flag}`].includes(arg));
const isArgCommandName = (arg, cmd) => arg === cmd.name || arg === cmd.alias;
const stripDashedFlags = (args, cmd) => args.filter(arg => ~arg.indexOf('--') && !isArgCommandName(arg, cmd));
const normalizeFlags = (args, cmd) => {
    const slicedArgs = args.slice(2);
    if (cmd.name === 'serve') {
        return slicedArgs.filter(arg => !isArgCommandName(arg, cmd));
    } else {
        return stripDashedFlags(slicedArgs, cmd);
    }
};

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
        args = normalizeFlags(process.argv, commandIsUsed);
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
            } else if (err.name === 'ALREADY_SET') {
                const argsMap = {};
                const keysToDelete = [];
                process.argv.forEach((arg, idx) => {
                    const oldMapValue = argsMap[arg];
                    argsMap[arg] = {
                        value: process.argv[idx],
                        type: (arg.charAt(0) === '-' && arg.charAt(1) === '-') ? 'dash' : 'cmd',
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
            } else {
                process.cliLogger.error(err);
            }
        }
    }
}

const commandIsUsed = isCommandUsed(commands);
const cli = new WebpackCLI();
runCLI(cli, commandIsUsed);
