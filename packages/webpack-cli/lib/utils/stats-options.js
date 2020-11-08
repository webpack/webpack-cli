const packageExists = require('./package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const { options: coloretteOptions } = require('colorette');

const getStatsOptions = (compiler) => {
    let options = compiler.options
        ? typeof compiler.options.stats === 'object'
            ? Object.assign({}, compiler.options.stats)
            : compiler.options.stats
        : undefined;

    // TODO remove after drop webpack@4
    if (webpack.Stats && webpack.Stats.presetToOptions) {
        if (!options) {
            options = {};
        } else if (typeof options === 'boolean' || typeof options === 'string') {
            options = webpack.Stats.presetToOptions(options);
        }
    }

    options.colors = typeof options.colors !== 'undefined' ? options.colors : coloretteOptions.enabled;

    return options;
};

module.exports = { getStatsOptions };
