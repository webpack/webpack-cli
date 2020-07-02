const commander = require('commander');
const logger = require('./logger');

const { defaultCommands } = require('./commands');

/**
 *  Creates Argument parser corresponding to the supplied options
 *  parse the args and return the result
 *
 * @param {object[]} options Array of objects with details about flags
 * @param {string[]} args process.argv or it's subset
 * @param {boolean} argsOnly false if all of process.argv has been provided, true if
 * args is only a subset of process.argv that removes the first couple elements
 */
function argParser(options, args, argsOnly = false, name = '', helpFunction = undefined, versionFunction = undefined, commands) {
    const parser = new commander.Command();
    // Set parser name
    parser.name(name);

    if (commands) {
        commands.reduce((parserInstance, cmd) => {
            parser
                .command(cmd.name)
                .alias(cmd.alias)
                .description(cmd.description)
                .usage(cmd.usage)
                .allowUnknownOption(true)
                .action(async () => {
                    const cliArgs = args.slice(args.indexOf(cmd.name) + 1 || args.indexOf(cmd.alias) + 1);
                    return await require('../commands/ExternalCommand').run(defaultCommands[cmd.name], ...cliArgs);
                });
            return parser;
        }, parser);

        // Prevent default behavior
        parser.on('command:*', () => {});
    }

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
        let flagsWithType = option.type !== Boolean ? flags + ' <value>' : flags;
        if (option.type === Boolean || option.type === String) {
            if (!option.multiple) {
                // Prevent default behavior for standalone options
                parserInstance.option(flagsWithType, option.description, option.defaultValue).action(() => {});
            } else {
                const multiArg = (value, previous = []) => previous.concat([value]);
                parserInstance.option(flagsWithType, option.description, multiArg, option.defaultValue).action(() => {});
            }
        } else if (option.type === Number) {
            parserInstance.option(flagsWithType, option.description, Number, option.defaultValue);
        } else {
            // in this case the type is a parsing function
            if (option.type.length > 1) {
                flagsWithType = flags + ' [value]';
                parserInstance.option(flagsWithType, option.description, option.type[0], option.defaultValue).action(() => {});
            } else {
                parserInstance.option(flagsWithType, option.description, option.type, option.defaultValue).action(() => {});
            }
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
