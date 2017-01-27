export default [{
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel'
        }]
    }
}, {
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css?modules&importLoaders=1&string=test123'
        }]
    }
}, {
    module: {
        loaders: [{
            test: /\.css$/,
            loaders: [{
                loader: 'style'
            }, {
                loader: 'css',
                query: {
                    modules: true
                }
            }]
        }]
    }
}, {
    module: {
        preLoaders:[{
            test: /\.js$/,
            loader: 'eslint'
        }]
    }
}, {
    module: {
        postLoaders:[{
            test: /\.js$/,
            loader: 'my-post'
        }]
    }
}, {
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
}, {
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
}];
