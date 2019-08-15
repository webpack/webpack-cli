module.exports = function(groupResult, isDevMode) {
    if (!isDevMode) {
        const prodConfig = require('./prod-config');
        groupResult.options = require('webpack-merge')(groupResult.options, prodConfig);
    } else {
        const devConfig = require('./dev-config');
        groupResult.options = require('webpack-merge')(groupResult.options, devConfig);
    }
    return groupResult;
};
