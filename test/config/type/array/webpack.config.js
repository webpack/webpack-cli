module.exports = [
    {
        entry: './a',
        output: {
            path: __dirname + '/binary',
            filename: 'coconut.js',
        },
    },
    {
        output: {
            chunkFilename: 'chunk_norris.js',
        },
        optimization: {
            runtimeChunk: true,
        },
    },
];
