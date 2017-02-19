export default {
    module: {
        rules: [{
            test: /\.yml/,
            use: ['json-loader', 'another-loader', 'yml-loader']
        }]
    }
}

