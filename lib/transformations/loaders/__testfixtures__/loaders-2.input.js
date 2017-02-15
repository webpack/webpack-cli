export default {
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
}
