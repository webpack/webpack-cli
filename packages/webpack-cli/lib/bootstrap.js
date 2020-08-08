const { options } = require('colorette');
const WebpackCLI = require('./webpack-cli');
const { core, commands } = require('./utils/cli-flags');
const logger = require('./utils/logger');
const cliExecuter = require('./utils/cli-executer');
const argParser = require('./utils/arg-parser');
require('./utils/process-log');
process.title = 'webpack-cli';

console.log(process);

const isCommandUsed = (commands) =>
    commands.find((cmd) => {
        return process.argv.includes(cmd.name) || process.argv.includes(cmd.alias);
    });

async function runCLI(cli, commandIsUsed) {
    let args;
    const runVersion = () => {
        cli.runVersion(process.argv, commandIsUsed);
    };
    const parsedArgs = argParser(core, process.argv, false, process.title, cli.runHelp, runVersion, commands);

    if (parsedArgs.unknownArgs.includes('help')) {
        cli.runHelp(process.argv);
        process.exit(0);
    }

    if (parsedArgs.unknownArgs.includes('version')) {
        runVersion();
        process.exit(0);
    }

    if (commandIsUsed) {
        return;
    }

    try {
        // handle the default webpack entry CLI argument, where instead
        // of doing 'webpack-cli --entry ./index.js' you can simply do
        // 'webpack-cli ./index.js'
        // if the unknown arg starts with a '-', it will be considered
        // an unknown flag rather than an entry
        let entry;
        if (parsedArgs.unknownArgs.length > 0 && !parsedArgs.unknownArgs[0].startsWith('-')) {
            if (parsedArgs.unknownArgs.length === 1) {
                entry = parsedArgs.unknownArgs[0];
            } else {
                entry = [];
                parsedArgs.unknownArgs.forEach((unknown) => {
                    if (!unknown.startsWith('-')) {
                        entry.push(unknown);
                    }
                });
            }
        } else if (parsedArgs.unknownArgs.length > 0) {
            parsedArgs.unknownArgs.forEach((unknown) => {
                logger.warn(`Unknown argument: ${unknown}`);
            });
            cliExecuter();
            return;
        }
        const parsedArgsOpts = parsedArgs.opts;
        // Enable/Disable color on console
        options.enabled = parsedArgsOpts.color ? true : false;

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

const commandIsUsed = isCommandUsed(commands);
const cli = new WebpackCLI();
runCLI(cli, commandIsUsed);
