const { resolve } = require('path');

module.exports = {
    entry: './a.js',
    output: {
        path: resolve(__dirname, 'bin'),
        filename: 'a.bundle.js',
    },
};
