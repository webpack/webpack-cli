export default {
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }],
        postLoaders:[{
            test: /\.js$/,
            loader: 'my-post-loader'
        }]
    }
}
