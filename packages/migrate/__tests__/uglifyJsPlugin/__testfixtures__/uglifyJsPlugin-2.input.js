const Uglify  = require('uglifyjs-webpack-plugin');
module.exports = {
    devtool: "source-map",
    plugins: [
        new Uglify({
            sourceMap: true,
            compress: {}
        })
    ]
}
