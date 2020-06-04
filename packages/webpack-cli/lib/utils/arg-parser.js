const commander = require('commander');
const logger = require('./logger');

/**
 *  Creates Argument parser corresponding to the supplied options
 *  parse the args and return the result
 *
 * @param {object[]} options Array of objects with details about flags
 * @param {string[]} args process.argv or it's subset
 * @param {boolean} argsOnly false if all of process.argv has been provided, true if
 * args is only a subset of process.argv that removes the first couple elements
 */
function argParser(options, args, argsOnly = false, name = '', helpFunction = undefined, versionFunction = undefined) {
    const parser = new commander.Command();
    // Set parser name
    parser.name(name);

    // Use customized version output if available
    if (versionFunction) {
        parser.on('option:version', () => {
            versionFunction();
            process.exit(0);
        });
    }

    // Use customized help output if available
    if (helpFunction) {
        parser.on('option:help', () => {
            helpFunction(args);
            process.exit(0);
        });
    }

    // Allow execution if unknown arguments are present
    parser.allowUnknownOption(true);

    // Register options on the parser
    options.reduce((parserInstance, option) => {
        const flags = option.alias ? `-${option.alias}, --${option.name}` : `--${option.name}`;
        const flagsWithType = option.type !== Boolean ? flags + ' <value>' : flags;
        if (option.type === Boolean || option.type === String) {
            parserInstance.option(flagsWithType, option.description, option.defaultValue);
        } else {
            // in this case the type is a parsing function
            parserInstance.option(flagsWithType, option.description, option.type, option.defaultValue);
        }

        return parserInstance;
    }, parser);

    // if we are parsing a subset of process.argv that includes
    // only the arguments themselves (e.g. ['--option', 'value'])
    // then we need from: 'user' passed into commander parse
    // otherwise we are parsing a full process.argv
    // (e.g. ['node', '/path/to/...', '--option', 'value'])
    const parseOptions = argsOnly ? { from: 'user' } : {};

    const result = parser.parse(args, parseOptions);
    const opts = result.opts();

    const unknownArgs = result.args;

    args.forEach((arg) => {
        const flagName = arg.slice(5);
        const option = options.find((opt) => opt.name === flagName);
        const flag = `--${flagName}`;
        const flagUsed = args.includes(flag) && !unknownArgs.includes(flag);
        let alias = '';
        let aliasUsed = false;
        if (option && option.alias) {
            alias = `-${option.alias}`;
            aliasUsed = args.includes(alias) && !unknownArgs.includes(alias);
        }

        // this is a negated flag that is not an unknown flag, but the flag
        // it is negating was also provided
        if (arg.startsWith('--no-') && (flagUsed || aliasUsed) && !unknownArgs.includes(arg)) {
            logger.warn(
                `You provided both ${
                    flagUsed ? flag : alias
                } and ${arg}. We will use only the last of these flags that you provided in your CLI arguments`,
            );
        }
    });

    Object.keys(opts).forEach((key) => {
        if (opts[key] === undefined) {
            delete opts[key];
        }
    });

    return {
        unknownArgs,
        opts,
    };
}

module.exports = argParser;
