const commander = require("commander");

/**
 *  Creates Argument parser corresponding to the supplied options
 *  parse the args and return the result
 *
 * @param {object[]} options Array of objects with details about flags
 * @param {string[]} args process.argv or it's subset
 */
function argParser(options, args, name = "", helpFunction = undefined, versionFunction = undefined) {
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
        const flagsWithType = option.type !== Boolean ? flags + ' [type]' : flags;
        parserInstance.option(flagsWithType, option.description, option.defaultValue);
        return parserInstance;
    }, parser);

    return parser.parse(args);
}

module.exports = argParser;
