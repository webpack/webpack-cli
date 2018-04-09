const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.export = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'style-loader'
                }))
            }
        ]
    },
    plugins: [
        new Foo(),
        new ExtractTextPlugin({
            id: 'foo',
            filename: 'foo.css',
            allChunks: true,
            disable: false,
            ignoreOrder: true
        })
    ]
}
