const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const mode = process.env.NODE_ENV || "development";
const isProduction = mode === "production";

module.exports = {
    entry: {
        "build/bundle": ["./src/main.js"],
    },
    resolve: {
        alias: {
            svelte: path.dirname(require.resolve("svelte/package.json")),
        },
        extensions: [".mjs", ".js", ".svelte"],
        mainFields: ["svelte", "browser", "module", "main"],
    },
    output: {
        path: path.join(__dirname, "public"),
        filename: "[name].js",
        chunkFilename: "[name].[id].js",
    },
    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: {
                    loader: "svelte-loader",
                    options: {
                        compilerOptions: {
                            dev: !isProduction,
                        },
                        emitCss: isProduction,
                        hotReload: !isProduction,
                    },
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                // required to prevent errors from Svelte on Webpack 5+
                test: /node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },
    mode,
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
    devtool: isProduction ? false : "source-map",
    devServer: {
        contentBase: path.join(__dirname, "public"),
        hot: true,
    },
};
