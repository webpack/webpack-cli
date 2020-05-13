const { join, resolve } = require('path');

const defaultOutputPath = resolve(join(process.cwd(), 'dist'));

module.exports = () => ({
    mode: 'production',
    entry: './index.js',
    devtool: 'source-map',
    output: {
        path: defaultOutputPath,
        filename: 'main.js',
    },
});
