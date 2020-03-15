const { resolve } = require('path');

module.exports = {
    entry: './unknown.js',
    output: {
        path: resolve(__dirname, 'binary'),
        filename: 'a.bundle.js',
    },
};
