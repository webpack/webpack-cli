const path = require("path");

module.exports = () => {
    console.log("first-webpack.config.js");

    return {
        mode: "development",
        entry: "./src/first.js",
        extends: [path.resolve(__dirname, "./second-webpack.config.js")],
    };
};
