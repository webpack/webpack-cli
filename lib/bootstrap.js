const WebpackCLI = require('./webpack-cli');
const { core, commands } = require('./utils/cli-flags');
const cmdArgs = require('command-line-args');

require('./utils/process-log');

const isFlagPresent = (args, flag) => args.find(arg => [flag, `--${flag}`].includes(arg));
const isArgCommandName = (arg, cmd) => arg === cmd.name || arg === cmd.alias;
const removeCmdFromArgs = (args, cmd) => args.filter(arg => !isArgCommandName(arg, cmd));
const normalizeFlags = (args, cmd) => {
    const slicedArgs = args.slice(2);
    return removeCmdFromArgs(slicedArgs, cmd);
};

const isCommandUsed = commands =>
    commands.find(cmd => {
        return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias);
    });

const resolveNegatedArgs = args => {
    args._unknown.forEach((arg, idx) => {
        if (arg.includes('--') || arg.includes('--no')) {
            const argPair = arg.split('=');
            const optName = arg.includes('--no') ? argPair[0].slice(5) : argPair[0].slice(2);

            let argValue = arg.includes('--no') ? 'false' : argPair[1];
            if (argValue === 'false') {
                argValue = false;
            } else if (argValue === 'true') {
                argValue = true;
            }
            const cliFlag = core.find(opt => opt.name === optName);
            if (cliFlag) {
                args[cliFlag.group][optName] = argValue;
                args._all[optName] = argValue;
                args._unknown[idx] = null;
            }
        }
    });
};

async function runCLI(cli, commandIsUsed) {
    let args;
    const helpFlagExists = isFlagPresent(process.argv, 'help');
    const versionFlagExists = isFlagPresent(process.argv, 'version');

    if (helpFlagExists) {
        cli.runHelp(process.argv);
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
            if (args._unknown) {
                resolveNegatedArgs(args);
                args._unknown
                    .filter(e => e)
                    .forEach(unknown => {
                        process.cliLogger.warn('Unknown argument:', unknown);
                    });
            }
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
                        pos: idx,
                    };
                    // Swap idx of overriden value
                    if (oldMapValue) {
                        argsMap[arg].pos = oldMapValue.pos;
                        keysToDelete.push(idx + 1);
                    }
                });
                // Filter out the value for the overriden key
                const newArgKeys = Object.keys(argsMap).filter(arg => !keysToDelete.includes(argsMap[arg].pos));
                // eslint-disable-next-line require-atomic-updates
                process.argv = newArgKeys;
                args = cmdArgs(core, { stopAtFirstUnknown: false, partial: true });

                await cli.run(args, core);
                process.stdout.write('\n');
                process.cliLogger.warn('Duplicate flags found, defaulting to last set value');
            } else {
                process.cliLogger.error(err);
                return;
            }
        }
    }
}

const commandIsUsed = isCommandUsed(commands);
const cli = new WebpackCLI();
runCLI(cli, commandIsUsed);
