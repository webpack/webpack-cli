module.exports = [
    {
        output: {
            filename: './dist-first.js',
        },
        name: 'first',
        entry: './src/first.js',
        mode: 'development',
    },
    {
        output: {
            filename: './dist-second.js',
        },
        name: 'second',
        entry: './src/second.js',
        mode: 'production',
        bail: true,
        watch: true,
    },
];
