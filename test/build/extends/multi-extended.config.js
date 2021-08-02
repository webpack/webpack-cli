module.exports = () => {
    console.log("multi-extended.config.js");

    return {
        extends: [
            "./one.webpack.config.js",
            "./two.webpack.config.js",
            "./second-webpack.config.js",
        ],
        target: "node",
        entry: "./src/multi.js",
    };
};
