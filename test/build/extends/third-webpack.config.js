module.exports = () => {
    console.log("third-webpack.config.js");

    return {
        stats: "detalied",
        entry: "./src/third.js",
    };
};
