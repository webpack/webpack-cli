function mergeObjectOrArrayConfig(defaults, config) {
    const merge = require('webpack-merge');
    if(Array.isArray(config)) {
        return config.map(arrayObject => merge(defaults, arrayObject));
    }
    return merge(defaults, config);
}

module.exports = function(webpackObject, isDevMode) {
    if (!isDevMode) {
        const prodConfig = require('./prod-config');
        webpackObject.options = mergeObjectOrArrayConfig(prodConfig, webpackObject.options);
    } else {
        const devConfig = require('./dev-config');
        webpackObject.options = mergeObjectOrArrayConfig(devConfig, webpackObject.options);
    }
    return webpackObject;
};
