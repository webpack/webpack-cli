module.exports = () => {
    console.log("webpack.config.js");

    return {
        extends: ["./first-webpack.config.js"],
        target: "node",
    };
};
