const { join, resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const JsConfigWebpackPlugin = require('js-config-webpack-plugin');

const defaultOutputPath = resolve(join(process.cwd(), 'dist'));

module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        path: defaultOutputPath,
        filename: 'bundle.js'
    },
    plugins: [new JsConfigWebpackPlugin()],

    optimization: {
        minimizer: [new TerserPlugin()],
    },
};
