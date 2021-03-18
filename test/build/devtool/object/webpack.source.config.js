module.exports = {
    output: {
        filename: './dist-amd.js',
        libraryTarget: 'amd',
    },
    name: 'amd',
    entry: './index.js',
    mode: 'development',
    devtool: 'source-map',
};
