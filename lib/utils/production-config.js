const { join, resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const defaultOutputPath = resolve(join(process.cwd(), 'dist'));

module.exports = (options, outputOptions) => ({
    mode: 'production',
    entry: './index.js',
    output: {
        path: defaultOutputPath,
        filename: 'bundle.js',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: options.devtool || outputOptions.devtool ? true : false,
            }),
        ],
    },
});
