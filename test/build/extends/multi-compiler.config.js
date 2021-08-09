module.exports = () => {
    console.log("multi-compiler.config.js");

    return [
        {
            mode: "development",
            entry: "./src/first.js",
            name: "first-compiler",
        },
        {
            mode: "development",
            entry: "./src/second.js",
            name: "second-compiler",
            extends: ["./webpack.config.js"],
        },
    ];
};
