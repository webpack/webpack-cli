// Works for OccurrenceOrderPlugin
module.exports = {}

// Works for DedupePlugin
module.exports = {}

// Doesn't remove unmatched plugins
module.exports = {
    plugins: [new webpack.optimize.UglifyJsPlugin()]
}
