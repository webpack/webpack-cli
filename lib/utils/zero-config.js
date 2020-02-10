function getEnvFromOptionsAndMode(mode, optionsObject) {
    const { dev, prod } = optionsObject;
    const NODE_ENV = process.env.NODE_ENV;
    if (NODE_ENV && (NODE_ENV === 'production' || NODE_ENV === 'development')) {
        return NODE_ENV;
    } else if (prod) {
        return 'production';
    } else if (dev) {
        return 'development';
    } else if (mode) {
        return mode;
    }
    return 'production';
}

function getConfigurations(options, outputOptions) {
    const merge = require('webpack-merge');
    const { mode } = options;
    const defaultConfigType = getEnvFromOptionsAndMode(mode, outputOptions);
    const defaultConfig = require(`./${defaultConfigType}-config`)(options, outputOptions);
    const newConfig = merge(defaultConfig, options);
    newConfig.mode = defaultConfigType;

    const isEntryObject = newConfig.entry && newConfig.entry instanceof Object;
    const isOutputDefined = newConfig.output && newConfig.output.filename;
    const isConflictingOutput = isEntryObject && isOutputDefined && newConfig.output.filename === 'bundle.js';
    if (isConflictingOutput) {
        newConfig.output.filename = '[name].bundle.js';
    }
    return newConfig;
}

module.exports = function setDefaultConfigBasedOnEnvironment(options, outputOptions) {
    let newOptions;
    if (Array.isArray(options)) {
        newOptions = options.map(arrayOptions => getConfigurations(arrayOptions, outputOptions));
        return {
            options: newOptions,
        };
    }
    newOptions = getConfigurations(options, outputOptions);
    return {
        options: newOptions,
    };
};
