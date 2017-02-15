export default {
    module: {
        rules: [{
            test: /\.yml/,
            use: ['json-loader', 'yml-loader']
        }]
    }
}
