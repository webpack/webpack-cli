const { core, groups } = require('../utils/cli-flags');
const { InteractiveModePlugin } = require('../utils/InteractiveModePlugin');

const WEBPACK_OPTION_FLAGS = core
    .filter((coreFlag) => {
        return coreFlag.group === groups.BASIC_GROUP;
    })
    .reduce((result, flagObject) => {
        result.push(flagObject.name);
        if (flagObject.alias) {
            result.push(flagObject.alias);
        }
        return result;
    }, []);

function resolveArgs(args) {
    const finalOptions = {
        options: {},
        outputOptions: {},
    };
    Object.keys(args).forEach((arg) => {
        if (WEBPACK_OPTION_FLAGS.includes(arg)) {
            finalOptions.outputOptions[arg] = args[arg];
        }
        if (arg === 'devtool') {
            finalOptions.options.devtool = args[arg];
        }
        if (arg === 'name') {
            finalOptions.options.name = args[arg];
        }
        if (arg === 'watch') {
            finalOptions.options.watch = true;
        }
        if (arg === 'entry') {
            finalOptions.options[arg] = args[arg];
        }
        if (arg === 'interactive') {
            if (finalOptions.options.plugins) {
                finalOptions.options.plugins.push(new InteractiveModePlugin());
            } else {
                finalOptions.options.plugins = [new InteractiveModePlugin()];
            }
        }
    });
    return finalOptions;
}

module.exports = resolveArgs;
