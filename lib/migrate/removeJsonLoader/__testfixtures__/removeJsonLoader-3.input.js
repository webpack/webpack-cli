export default {
    module: {
        rules: [{
            test: /\.json/,
            use: [{
                loader: 'json-loader'
            }]
        }]
    }
}

