/**
 * Resolve advanced flags
 * @param {args} args - Parsed args passed to CLI
 */
const resolveAdvanced = (args) => {
    const { target, prefetch, hot } = args;

    const finalOptions = {
        options: {},
        outputOptions: {},
    };

    if (hot) {
        const { HotModuleReplacementPlugin } = require('webpack');
        const hotModuleVal = new HotModuleReplacementPlugin();
        if (finalOptions.options && finalOptions.options.plugins) {
            finalOptions.options.plugins.unshift(hotModuleVal);
        } else {
            finalOptions.options.plugins = [hotModuleVal];
        }
    }
    if (prefetch) {
        const { PrefetchPlugin } = require('webpack');
        const prefetchVal = new PrefetchPlugin(null, args.prefetch);
        if (finalOptions.options && finalOptions.options.plugins) {
            finalOptions.options.plugins.unshift(prefetchVal);
        } else {
            finalOptions.options.plugins = [prefetchVal];
        }
    }
    if (target) {
        finalOptions.options.target = args.target;
    }

    return finalOptions;
};

module.exports = resolveAdvanced;
