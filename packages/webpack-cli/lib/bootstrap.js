const WebpackCLI = require('./webpack-cli');
const { core } = require('./utils/cli-flags');
const logger = require('./utils/logger');
const { isCommandUsed } = require('./utils/arg-utils');
const argParser = require('./utils/arg-parser');

process.title = 'webpack-cli';

const runCLI = async (cliArgs) => {
    const parsedArgs = argParser(core, cliArgs, true, process.title);

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
            parsedArgs.unknownArgs.forEach(async (unknown) => {
                logger.error(`Unknown argument: ${unknown}`);
            });

            process.exit(2);
        }

        const parsedArgsOpts = parsedArgs.opts;

        if (entry) {
            parsedArgsOpts.entry = entry;
        }

        await cli.run(parsedArgsOpts, core);
    } catch (error) {
        logger.error(error);
        process.exit(2);
    }
};

module.exports = runCLI;
