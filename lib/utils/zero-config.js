function getEnvFromOptionsAndMode(mode, optionsObject) {
    const optionsDevFlag = optionsObject.dev;
    const optionsProdFlag = optionsObject.prod;

    if (process.env.NODE_ENV && process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
        return process.env.NODE_ENV;
    }
    else if (optionsProdFlag) {
        return 'production';
    }
    else if (optionsDevFlag) {
        return 'development';
    } else if (!optionsDevFlag && !optionsProdFlag && mode) {
        return mode;
    }
    return 'production';
}

module.exports = function setDefaultConfigBasedOnEnvironment(webpackObject) {
    const merge = require('webpack-merge');
    if (Array.isArray(webpackObject.options)) {
        const newArrayConfigurations = webpackObject.options.map(arrayObject => {
            const modeFlag = arrayObject.mode;
            const defaultConfigType = getEnvFromOptionsAndMode(modeFlag, webpackObject.outputOptions);
            const defaultConfig = require(`./${defaultConfigType}-config`);
            const newConfig = merge(defaultConfig, arrayObject);
            newConfig.mode = defaultConfigType;
            return newConfig;
        });
        webpackObject.options = newArrayConfigurations;
        return webpackObject;
    }
    const modeFlag = webpackObject.options.mode;
    const defaultConfigType = getEnvFromOptionsAndMode(modeFlag, webpackObject.outputOptions);
    const defaultConfig = require(`./${defaultConfigType}-config`);
    const newConfig = merge(defaultConfig, webpackObject.options);
    newConfig.mode = defaultConfigType;
    webpackObject.options = newConfig;
    return webpackObject;
};
