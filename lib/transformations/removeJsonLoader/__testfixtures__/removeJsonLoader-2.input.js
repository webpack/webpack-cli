export default {
    module: {
        rules: [
            {
                test: /\.json/,
                use: 'json-loader'
            }
        ]
    }
}
