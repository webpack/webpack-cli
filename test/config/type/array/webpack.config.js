module.exports = [
    {
        output: {
            filename: './dist-amd.js',
            libraryTarget: 'amd',
        },
        name: 'amd',
        entry: './a.js',
        mode: 'production',
        devtool: 'eval-module',
    },
    {
        output: {
            filename: './dist-commonjs.js',
            libraryTarget: 'commonjs',
        },
        name: 'commonjs',
        entry: './a.js',
        mode: 'production',
        target: 'node',
    },
];
