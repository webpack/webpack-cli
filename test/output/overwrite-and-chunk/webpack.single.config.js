const { resolve } = require('path');

module.exports = {
    entry: {
        b: './b.js',
        c: './c.js',
    },
    output: {
        path: resolve(__dirname, 'bin'),
        filename: 'bundle.js',
    },
};
