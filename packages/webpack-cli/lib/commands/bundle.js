const argParser = require('../utils/arg-parser');
const WebpackCLI = require('../webpack-cli');
const { flags } = require('../utils/cli-flags');
const logger = require('../utils/logger');
const leven = require('leven');

async function bundle(...args) {
    const parsedArgs = argParser(flags, args, true, process.title);
    try {
        // Create a new instance of the CLI object
        const cli = new WebpackCLI();

        // Handle entry passed without --entry flag
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

        // Add unknown args
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

        await cli.run(parsedArgsOpts);
    } catch (error) {
        logger.error(error);
        process.exit(2);
    }
}

module.exports = bundle;
