export default {
    module: {
        preLoaders:[{
            test: /\.js$/,
            loader: 'eslint-loader'
        }],
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }]
    }
}
