const { join, resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const defaultOutputPath = resolve(join(process.cwd(), 'dist'));

module.exports = () => ({
    mode: 'production',
    entry: './index.js',
    devtool: 'source-map',
    output: {
        path: defaultOutputPath,
        filename: 'bundle.js',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
            }),
        ],
    },
});
