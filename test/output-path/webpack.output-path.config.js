const { resolve } = require('path');

module.exports = {
    entry: {
        a: './a.js',
        b: './b.js',
        c: './c.js',
    },
    output: {
        path: resolve(__dirname, 'bin'),
        filename: '[name].bundle.js',
    },
    mode: 'development',
};
