const WebpackCLI = require('./webpack-cli');
const logger = require('./utils/logger');

const runCLI = async (args) => {
    try {
        // Create a new instance of the CLI object
        const cli = new WebpackCLI();

        await cli.run(args);
    } catch (error) {
        logger.error(error);
        process.exit(2);
    }
};

module.exports = runCLI;
