const { options } = require('colorette');
const WebpackCLI = require('./webpack-cli');
const { core } = require('./utils/cli-flags');
const versionRunner = require('./groups/runVersion');
const helpRunner = require('./groups/runHelp');
const logger = require('./utils/logger');
const { isCommandUsed } = require('./utils/arg-utils');
const cliExecuter = require('./utils/cli-executer');
const argParser = require('./utils/arg-parser');

require('./utils/process-log');

process.title = 'webpack-cli';

// Create a new instance of the CLI object
const cli = new WebpackCLI();

const parseArgs = (args) => argParser(core, args, true, process.title);

const runCLI = async (cliArgs) => {
    let args;

    const commandIsUsed = isCommandUsed(cliArgs);
    const parsedArgs = parseArgs(cliArgs);
    if (parsedArgs.unknownArgs.includes('help') || parsedArgs.opts.help) {
        options.enabled = !cliArgs.includes('--no-color');
        helpRunner(cliArgs);
        process.exit(0);
    }

    if (parsedArgs.unknownArgs.includes('version') || parsedArgs.opts.version) {
        options.enabled = !cliArgs.includes('--no-color');
        versionRunner(cliArgs, commandIsUsed);
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
            const args = await cliExecuter();
            const { opts } = parseArgs(args);
            await cli.run(opts, core);
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
            cliArgs.forEach((arg, idx) => {
                const oldMapValue = argsMap[arg];
                argsMap[arg] = {
                    value: cliArgs[idx],
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

            cliArgs = newArgKeys;
            args = argParser('', core, cliArgs);
            await cli.run(args.opts, core);
            logger.warn('\nDuplicate flags found, defaulting to last set value');
        } else {
            logger.error(err);
            return;
        }
    }
};

module.exports = runCLI;
