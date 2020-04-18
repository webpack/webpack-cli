const commander = require('commander');

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
            versionFunction(args);
            process.exit(0);
        });
    }

    // Use customised help output is avaliable
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
        parserInstance.option(flagsWithType, option.description, option.defaultValue);
        return parserInstance;
    }, parser);

    // if we are parsing a subset of process.argv that includes
    // only the arguments themselves (e.g. ['--option', 'value'])
    // then we need from: 'user' passed into commander parse
    // otherwise we are parsing a full process.argv
    // (e.g. ['node', '/path/to/...', '--option', 'value'])
    const parseOptions = argsOnly ? { from: 'user' } : {};

    return parser.parse(args, parseOptions);
}

module.exports = argParser;
