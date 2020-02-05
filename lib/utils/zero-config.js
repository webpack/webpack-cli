function getEnvFromOptionsAndMode(mode, optionsObject) {
    const { dev, prod } = optionsObject;

    if ((process.env.NODE_ENV && process.env.NODE_ENV === 'production') || process.env.NODE_ENV === 'development') {
        return process.env.NODE_ENV;
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

module.exports = function setDefaultConfigBasedOnEnvironment(webpackObject) {
    const { options, outputOptions } = webpackObject;
    if (Array.isArray(options)) {
        const newArrayConfigurations = webpackObject.options.map(arrayOptions => getConfigurations(arrayOptions, outputOptions));
        webpackObject.options = newArrayConfigurations;
        return webpackObject;
    }
    webpackObject.options = getConfigurations(options, outputOptions);
    return webpackObject;
};
