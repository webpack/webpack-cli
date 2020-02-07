const { join, resolve } = require('path');

const defaultOutputPath = resolve(join(process.cwd(), 'dist'));

module.exports = () => ({
    mode: 'development',
    entry: './index.js',
    devtool: 'eval',
    output: {
        path: defaultOutputPath,
        filename: 'bundle.js',
    },
});
