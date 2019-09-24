module.exports = function(groupResult, isDevMode) {
    if (!isDevMode) {
        const prodConfig = require('./prod-config');
        groupResult.options = require('webpack-merge')(prodConfig, groupResult.options);
    } else {
        const devConfig = require('./dev-config');
        groupResult.options = require('webpack-merge')(devConfig, groupResult.options);
    }
    return groupResult;
};
