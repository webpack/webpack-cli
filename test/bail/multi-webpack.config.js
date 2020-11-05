module.exports = [
    {
        output: {
            filename: './dist-first.js',
        },
        name: 'first',
        entry: './src/first.js',
        mode: 'development',
        bail: true,
        watch: true,
    },
    {
        output: {
            filename: './dist-second.js',
        },
        name: 'second',
        entry: './src/second.js',
        mode: 'production',
    },
];
