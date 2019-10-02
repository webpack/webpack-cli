module.exports = {
    output: {
        filename: './dist-amd.js',
        libraryTarget: 'amd',
    },
    name: 'amd',
    entry: './index.js',
    mode: 'production',
    devtool: 'eval-module',
};
