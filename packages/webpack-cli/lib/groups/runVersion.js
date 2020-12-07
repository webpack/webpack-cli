const logger = require('../utils/logger');
const { commands, flags } = require('../utils/cli-flags');
const { options } = require('colorette');

const outputVersion = (args) => {
    if (args.includes('--color')) {
        options.enabled = true;
    } else if (args.includes('--no-color')) {
        options.enabled = false;
    }

    const hasUnknownVersionArgs = (args, commands, flags) => {
        return args.filter((arg) => {
            if (arg === 'version' || arg === '--version' || arg === '-v' || arg === '--color' || arg === '--no-color') {
                return false;
            }

            const foundCommand = commands.find((command) => {
                return command.name === arg || command.alias === arg;
            });
            const foundFlag = flags.find((command) => {
                return `--${command.name}` === arg || `-${command.alias}` === arg;
            });

            return !foundCommand && !foundFlag;
        });
    };

    const invalidArgs = hasUnknownVersionArgs(args, commands, flags);

    if (invalidArgs.length > 0) {
        const argType = invalidArgs[0].startsWith('-') ? 'option' : 'command';
        logger.error(`Invalid ${argType} '${invalidArgs[0]}'.`);
        logger.error('Run webpack --help to see available commands and arguments.');
        process.exit(2);
    }

    const usedCommands = commands.filter((command) => {
        return args.includes(command.name) || args.includes(command.alias);
    });

    if (usedCommands.length > 1) {
        logger.error(
            `You provided multiple commands - ${usedCommands
                .map((command) => `'${command.name}'${command.alias ? ` (alias '${command.alias}')` : ''}`)
                .join(', ')}. Please use only one command at a time.`,
        );
        process.exit(2);
    }

    if (usedCommands.length === 1) {
        try {
            const { name, version } = require(`${usedCommands[0].packageName}/package.json`);
            logger.raw(`${name} ${version}`);
        } catch (e) {
            logger.error(`Error: package '${usedCommands[0].packageName}' not found.`);
            process.exit(2);
        }
    }

    const pkgJSON = require('../../package.json');
    const webpack = require('webpack');

    logger.raw(`webpack-cli ${pkgJSON.version}`);
    logger.raw(`webpack ${webpack.version}`);
};

module.exports = outputVersion;
