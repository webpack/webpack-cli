module.exports = {
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
    ]
}

module.exports = {
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
}
