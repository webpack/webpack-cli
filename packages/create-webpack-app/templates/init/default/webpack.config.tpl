// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from "node:path";
import { fileURLToPath } from "node:url";<% if (langType === "Typescript") { %>
import { type Configuration } from "webpack";<% if (devServer) { %>
import "webpack-dev-server";<% } %><% } %><% if (workboxWebpackPlugin) { %>
import WorkboxWebpackPlugin from "workbox-webpack-plugin";<% } %>

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === "production";

/** @type {import("webpack").Configuration} */
const config <% if (langType === "Typescript") { %>: Configuration <% } %>= {
    // The page itself is the entry: webpack bundles the scripts and stylesheets
    // it references and emits it as `dist/index.html`.
    entry: { index: "./index.html" },
    output: {
        path: path.resolve(__dirname, "dist"),
    },<% if (devServer) { %>
    devServer: {
        open: true,
    },<% } %>
    plugins: [
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [<% if (langType == "ES6") { %>
            {
                test: /\.(js|jsx)$/i,
                loader: "babel-loader",
            },<% } %><% if (langType == "Typescript") { %>
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/"],
            },<% } %><%  if (cssPreprocessor == "SASS") { %>
            {
                test: /\.s[ac]ss$/i,
                type: "css/auto",
                use: ["sass-loader"],
            },<% } %><%  if (cssPreprocessor == "LESS") { %>
            {
                test: /\.less$/i,
                type: "css/auto",
                use: ["less-loader"],
            },<% } %><%  if (cssPreprocessor == "Stylus") { %>
            {
                test: /\.styl$/i,
                type: "css/auto",
                use: ["stylus-loader"],
            },<% } %>
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },<% if (langType == "Typescript") {%>
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
    },<% } %>
};

export default () => {
    if (isProduction) {
        config.mode = "production";<% if (workboxWebpackPlugin) { %>
        config.plugins?.push(new WorkboxWebpackPlugin.GenerateSW());<% } %>
    } else {
        config.mode = "development";
    }
    return config;
};
