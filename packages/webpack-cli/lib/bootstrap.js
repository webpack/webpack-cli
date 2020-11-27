const { flags, isCommandUsed } = require('./utils/cli-flags');
const WebpackCLI = require('./webpack-cli');
const logger = require('./utils/logger');
const argParser = require('./utils/arg-parser');
const leven = require('leven');
const { options: coloretteOptions } = require('colorette');

process.title = 'webpack-cli';

const runCLI = async (cliArgs) => {
    const parsedArgs = argParser(flags, cliArgs, true, process.title);

    // Enable/Disable colors
    if (typeof parsedArgs.opts.color !== 'undefined') {
        coloretteOptions.enabled = Boolean(parsedArgs.opts.color);
    }

    const commandIsUsed = isCommandUsed(cliArgs);

    if (commandIsUsed) {
        return;
    }

    try {
        // Create a new instance of the CLI object
        const cli = new WebpackCLI();

        // Handle the default webpack entry CLI argument, where instead of doing 'webpack-cli --entry ./index.js' you can simply do 'webpack-cli ./index.js'
        // If the unknown arg starts with a '-', it will be considered an unknown flag rather than an entry
        let entry;

        if (parsedArgs.unknownArgs.length > 0) {
            entry = [];

            parsedArgs.unknownArgs = parsedArgs.unknownArgs.filter((item) => {
                if (item.startsWith('-')) {
                    return true;
                }

                entry.push(item);

                return false;
            });
        }

        if (parsedArgs.unknownArgs.length > 0) {
            parsedArgs.unknownArgs.forEach((unknown) => {
                logger.error(`Unknown argument: '${unknown}'`);

                const strippedFlag = unknown.substr(2);
                const found = flags.find((flag) => leven(strippedFlag, flag.name) < 3);

                if (found) {
                    logger.raw(`Did you mean '--${found.name}'?`);
                }
            });

            process.exit(2);
        }

        const parsedArgsOpts = parsedArgs.opts;

        if (entry) {
            parsedArgsOpts.entry = entry;
        }

        await cli.run(parsedArgsOpts, flags);
    } catch (error) {
        logger.error(error);
        process.exit(2);
    }
};

module.exports = runCLI;
