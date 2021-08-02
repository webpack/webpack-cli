const path = require("path");

module.exports = () => {
    console.log("second-webpack.config.js");

    return {
        mode: "development",
        entry: "./src/second.js",
        extends: [path.resolve(__dirname, "./third-webpack.config.js")],
    };
};
