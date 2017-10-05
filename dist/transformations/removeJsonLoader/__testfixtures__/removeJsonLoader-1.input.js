export default {
    module: {
        rules: [{
            test: /\.yml/,
            use: [{
                loader: 'json-loader'
            }, {
                loader: 'yml-loader'
            }]
        }]
    }
}
