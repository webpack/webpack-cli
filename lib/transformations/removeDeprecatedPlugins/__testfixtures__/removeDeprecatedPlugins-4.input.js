// This should throw
const inst = new webpack.optimize.OccurrenceOrderPlugin()
export default (config) => {
    config.plugins = [
        inst
    ]
    return config
}
