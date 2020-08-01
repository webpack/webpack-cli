module.exports = [
    {
        output: {
            filename: './dist-amd.js',
            libraryTarget: 'amd',
        },
        name: 'amd',
        entry: './index.js',
        mode: 'production',
        devtool: 'eval-cheap-module-source-map',
    },
    {
        output: {
            filename: './dist-commonjs.js',
            libraryTarget: 'commonjs',
        },
        name: 'commonjs',
        entry: './index.js',
        mode: 'production',
        devtool: 'source-map',
        target: 'node',
    },
];
