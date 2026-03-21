// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from "node:path";
import { fileURLToPath } from "node:url";<% if (htmlWebpackPlugin) { %>
import HtmlWebpackPlugin from "html-webpack-plugin";<% } %><% if (extractPlugin !== "No") { %>
import MiniCssExtractPlugin from "mini-css-extract-plugin";<% } %><% if (workboxWebpackPlugin) { %>
import WorkboxWebpackPlugin from "workbox-webpack-plugin";<% } %>
<% const { execFileSync } = await import("node:child_process")
let host;
try {
    const family = execFileSync(process.execPath, [
        "--input-type=module", 
        "--eval",
        `import dns from "node:dns/promises";
        const { family } = await dns.lookup("localhost");
        process.stdout.write(String(family));`
    ], { encoding: "utf8", timeout: 3000 }).trim();
    host = family === "6" ? "::1" : "127.0.0.1";
} catch { host = null; } %>

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === "production";
<% if (cssType !== "none") { %>
<% if (extractPlugin === "Yes") { %>
const stylesHandler = MiniCssExtractPlugin.loader;
<% } else if (extractPlugin === "Only for Production") { %>
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : "style-loader";
<% } else { %>
const stylesHandler = "style-loader";
<% } %>
<% } %>

/** @type {import("webpack").Configuration} */
const config = {
    entry: "<%= entry %>",
    output: {
        path: path.resolve(__dirname, "dist"),
    },<% if (devServer) { %>
    devServer: {
        open: true,
        host: "localhost",<% if (host) { %>
        allowedHosts: ["<%= host %>"],<% } %>
    },<% } %>
    plugins: [<% if (htmlWebpackPlugin) { %>
        new HtmlWebpackPlugin({
            template: "index.html",
        }),
<% } %><% if (extractPlugin === "Yes") { %>
        new MiniCssExtractPlugin(),
<% } %>
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [<% if (langType == "ES6") { %>
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },<% } %><% if (langType == "Typescript") { %>
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/"],
            },<% } %><%  if (isCSS && !isPostCSS) { %>
            {
                test: /\.css$/i,
                use: [stylesHandler,"css-loader"],
            },<% } %><%  if (cssType == "SASS") { %>
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, "css-loader", <% if (isPostCSS) { %>"postcss-loader", <% } %>"sass-loader"],
            },<% } %><%  if (cssType == "LESS") { %>
            {
                test: /\.less$/i,
                use: [stylesHandler, "css-loader", <% if (isPostCSS) { %>"postcss-loader", <% } %>"less-loader"],
            },<% } %><%  if (cssType == "Stylus") { %>
            {
                test: /\.styl$/i,
                use: [stylesHandler, "css-loader", <% if (isPostCSS) { %>"postcss-loader", <% } %>"stylus-loader"],
            },<% } %><%  if (isPostCSS && isCSS) { %>
            {
                test: /\.css$/i,
                use: [stylesHandler, "css-loader", "postcss-loader"],
            },<% } %>
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/"),
        },
        extensions: [".jsx", ".js"<% if (langType === "Typescript") { %>, ".tsx", ".ts"<% } %>],
    },
};

export default () => {
    if (isProduction) {
        config.mode = "production";
        <% if (extractPlugin === "Only for Production") { %>
        config.plugins.push(new MiniCssExtractPlugin());
        <% } %>
        <% if (workboxWebpackPlugin) { %>
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
        <% } %>
    } else {
        config.mode = "development";
    }
    return config;
};
