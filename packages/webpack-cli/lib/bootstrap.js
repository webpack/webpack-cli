const WebpackCLI = require('./webpack-cli');
const { core, commands } = require('./utils/cli-flags');
const logger = require('./utils/logger');
const cliExecuter = require('./utils/cli-executer');
const argParser = require('./utils/arg-parser');
require('./utils/process-log');

process.title = 'webpack-cli';

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
    args.forEach((arg, idx) => {
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
                args.args[idx] = null;
            }
        }
    });
};

async function runCLI(cli, commandIsUsed) {
    const parsedArgs = argParser(core, process.argv, process.title, cli.runHelp, cli.runVersion);

    if (parsedArgs.args.includes('help')) {
        cli.runHelp(process.argv);
        process.exit(0);
    }

    if (parsedArgs.args.includes('version')) {
        cli.runVersion();
        process.exit(0);
    }

    if (commandIsUsed) {
        commandIsUsed.defaultOption = true;
        args = normalizeFlags(process.argv, commandIsUsed);
        return await cli.runCommand(commandIsUsed, ...args);
    } else {
        try {
            if (parsedArgs.args.length > 0) {
                resolveNegatedArgs(parsedArgs.args);
                parsedArgs.args
                    .filter(e => e)
                    .forEach(unknown => {
                        logger.warn('Unknown argument:', unknown);
                    });
                    cliExecuter();
                    return;
            }
            const result = await cli.run(parsedArgs.opts(), core);
            if (!result) {
                return;
            }
        } catch (err) {
            if (err.name === 'UNKNOWN_VALUE') {
                logger.error(`Parse Error (unknown argument): ${err.value}`);
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
                    // Swap idx of overridden value
                    if (oldMapValue) {
                        argsMap[arg].pos = oldMapValue.pos;
                        keysToDelete.push(idx + 1);
                    }
                });
                // Filter out the value for the overridden key
                const newArgKeys = Object.keys(argsMap).filter(arg => !keysToDelete.includes(argsMap[arg].pos));
                // eslint-disable-next-line require-atomic-updates
                process.argv = newArgKeys;
                args = argParser("", core, process.argv);
                await cli.run(args.opts(), core);
                process.stdout.write('\n');
                logger.warn('Duplicate flags found, defaulting to last set value');
            } else {
                logger.error(err);
                return;
            }
        }
    }
}

const commandIsUsed = isCommandUsed(commands);
const cli = new WebpackCLI();
runCLI(cli, commandIsUsed);
