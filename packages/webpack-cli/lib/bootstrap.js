const WebpackCLI = require('./webpack-cli');
const { core, commands } = require('./utils/cli-flags');
const logger = require('./utils/logger');
const cliExecuter = require('./utils/cli-executer');
const argParser = require('./utils/arg-parser');
require('./utils/process-log');
process.title = 'webpack-cli';

// const isFlagPresent = (args, flag) => args.find((arg) => [flag, `--${flag}`].includes(arg));
const isArgCommandName = (arg, cmd) => arg === cmd.name || arg === cmd.alias;
const removeCmdFromArgs = (args, cmd) => args.filter((arg) => !isArgCommandName(arg, cmd));
const normalizeFlags = (args, cmd) => {
    const slicedArgs = args.slice(2);
    return removeCmdFromArgs(slicedArgs, cmd);
};

const isCommandUsed = (commands) =>
    commands.find((cmd) => {
        return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias);
    });

async function runCLI(cli, commandIsUsed) {
    let args;
    const runVersion = () => {
        cli.runVersion(process.argv, commandIsUsed);
    };
    const parsedArgs = argParser(core, process.argv, false, process.title, cli.runHelp, runVersion);
    if (parsedArgs.unknownArgs.includes('help')) {
        cli.runHelp(process.argv);
        process.exit(0);
    }

    if (parsedArgs.unknownArgs.includes('version')) {
        runVersion();
        process.exit(0);
    }

    if (commandIsUsed) {
        commandIsUsed.defaultOption = true;
        args = normalizeFlags(process.argv, commandIsUsed);
        return await cli.runCommand(commandIsUsed, ...args);
    } else {
        try {
            // handle the default webpack entry CLI argument, where instead
            // of doing 'webpack-cli --entry ./index.js' you can simply do
            // 'webpack-cli ./index.js'
            // if the unknown arg starts with a '-', it will be considered
            // an unknown flag rather than an entry
            let entry;
            if (parsedArgs.unknownArgs.length === 1 && !parsedArgs.unknownArgs[0].startsWith('-')) {
                entry = parsedArgs.unknownArgs[0];
            } else if (parsedArgs.unknownArgs.length > 0) {
                parsedArgs.unknownArgs
                    .filter((e) => e)
                    .forEach((unknown) => {
                        logger.warn('Unknown argument:', unknown);
                    });
                cliExecuter();
                return;
            }
            const parsedArgsOpts = parsedArgs.opts;
            if (entry) {
                parsedArgsOpts.entry = entry;
            }
            const result = await cli.run(parsedArgsOpts, core);
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
                const newArgKeys = Object.keys(argsMap).filter((arg) => !keysToDelete.includes(argsMap[arg].pos));
                // eslint-disable-next-line require-atomic-updates
                process.argv = newArgKeys;
                args = argParser('', core, process.argv);
                await cli.run(args.opts, core);
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
