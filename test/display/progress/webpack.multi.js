const { ProgressPlugin } = require('webpack');

module.exports = [
    {
        mode: 'development',
        entry: './a.js',
        plugins: [new ProgressPlugin()],
    },
];
