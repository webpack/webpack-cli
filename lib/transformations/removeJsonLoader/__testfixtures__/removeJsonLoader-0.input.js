export default {
    module: {
        rules: [{
            test: /\.yml/,
            use: [
                {
                    loader: 'json-loader'
                },
                {
                    loader: 'another-loader'
                },
                {
                    loader: 'yml-loader'
                }
            ]
        }]
    }
}

