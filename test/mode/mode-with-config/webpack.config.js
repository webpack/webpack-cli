const path = require('path');
const dirname = __dirname;
const TerserPlugin = require('terser-webpack-plugin');

module.exports = () => {
    const config = {
        entry: './index.js',
        output: {
            path: path.join(dirname, 'bin'),
            filename: '[name].js',
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    sourceMap: false,
                    extractComments: {
                        filename: (fileData) => {
                            return `${fileData.filename}.OTHER.LICENSE.txt${fileData.query}`;
                        },
                    },
                }),
            ],
        },
    };
    return config;
};
