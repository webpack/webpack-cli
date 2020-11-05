const commandNames = require('./commands').names;
const flagNames = require('./core-flags').names;

const logger = require('./logger');

module.exports = {
    commands: [...commandNames],
    flags: [...flagNames],
    allNames: [...commandNames, ...flagNames],
    hasUnknownArgs: (args, names) =>
        args.filter((e) => !names.includes(e) && !e.includes('color') && e !== 'version' && e !== '-v' && !e.includes('help')),
    handleUnknownArgs: (unknownArgs) => {
        if (unknownArgs.length > 0) {
            logger.error(`Unknown argument: ${unknownArgs}`);
            process.exit(2);
        }
    },
};
