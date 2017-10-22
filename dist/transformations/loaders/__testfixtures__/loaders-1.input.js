export default {
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css?modules&importLoaders=1&string=test123'
        }]
    }
}
