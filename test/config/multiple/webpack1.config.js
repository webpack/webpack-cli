module.exports = {
    output: {
        filename: './dist-amd.js',
        libraryTarget: 'amd',
    },
    name: 'amd',
    entry: './init.js',
    mode: 'production',
    devtool: 'eval-cheap-module-source-map',
};
