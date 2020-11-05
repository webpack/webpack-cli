const logger = require('../utils/logger');
const { commands } = require('../utils/cli-flags');
const { allNames, hasUnknownArgs } = require('../utils/unknown-args');

const outputVersion = (args) => {
    // This is used to throw err when there are multiple command along with version
    const commandsUsed = commands.filter((command) => {
        return args.includes(command.name) || args.includes(command.alias);
    });

    if (commandsUsed.length > 1) {
        logger.error(
            `You provided multiple commands - ${commandsUsed
                .map((command) => `${command.name} (alias ${command.alias})`)
                .join(', ')}. Please use only one command at a time.`,
        );
        process.exit(2);
    }

    const invalidArgs = hasUnknownArgs(args, allNames);

    if (invalidArgs.length > 0) {
        const argType = invalidArgs[0].startsWith('-') ? 'option' : 'command';
        logger.error(`Error: Invalid ${argType} '${invalidArgs[0]}'.`);
        logger.info('Run webpack --help to see available commands and arguments.\n');
        process.exit(2);
    }

    if (commandsUsed.length === 1) {
        try {
            const { name, version } = require(`${commandsUsed[0].packageName}/package.json`);
            logger.raw(`${name} ${version}`);
        } catch (e) {
            logger.error('Error: External package not found.');
            process.exit(2);
        }
    }

    const pkgJSON = require('../../package.json');
    const webpack = require('webpack');

    logger.raw(`webpack-cli ${pkgJSON.version}`);
    logger.raw(`webpack ${webpack.version}`);
};

module.exports = outputVersion;
