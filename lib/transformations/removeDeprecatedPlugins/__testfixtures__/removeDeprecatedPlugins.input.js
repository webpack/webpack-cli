// Works for OccurrenceOrderPlugin
module.exports = {
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
    ]
}

// Works for DedupePlugin
module.exports = {
    plugins: [
        new webpack.optimize.DedupePlugin(),
    ]
}

// Doesn't remove unmatched plugins
module.exports = {
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin()
    ]
}
