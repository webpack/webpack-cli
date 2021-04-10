// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');<% if (htmlWebpackPlugin) { %>
const HtmlWebpackPlugin = require('html-webpack-plugin');<% } %><% if (isExtractPlugin) { %>
const MiniCssExtractPlugin = require('mini-css-extract-plugin');<% } %>
const { merge } = require('webpack-merge');

const base = {
    entry: '<%= entry %>',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [<% if (htmlWebpackPlugin) { %>
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
<% } %><% if (isExtractPlugin) { %>
        new MiniCssExtractPlugin(),
<% } %>
        // Add your plugins here
        // Learn more obout plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [<% if (langType == "ES6") { %>
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },<% } %><% if (langType == "Typescript") { %>
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },<% } %><%  if (isCSS && !isPostCSS) { %>
            {
                test: /\.css$/i,
                use: [<% if (isExtractPlugin) { %>MiniCssExtractPlugin.loader<% } else { %>'style-loader' <% } %>,'css-loader'],
            },<% } %><%  if (cssType == 'SASS') { %>
            {
                test: /\.s[ac]ss$/i,
                use: [<% if (isExtractPlugin) { %>MiniCssExtractPlugin.loader<% } else { %>'style-loader' <% } %>, 'css-loader', <% if (isPostCSS) { %>'postcss-loader', <% } %>'sass-loader'],
            },<% } %><%  if (cssType == 'LESS') { %>
            {
                test: /\.less$/i,
                use: [<% if (isPostCSS) { %><% if (isExtractPlugin) { %>MiniCssExtractPlugin.loader<% } else { %>'style-loader' <% } %>, 'css-loader', 'postcss-loader', <% } %>'less-loader'],
            },<% } %><%  if (cssType == 'Stylus') { %>
            {
                test: /\.styl$/i,
                use: [<% if (isPostCSS) { %><% if (isExtractPlugin) { %>MiniCssExtractPlugin.loader<% } else { %>'style-loader' <% } %>, 'css-loader', 'postcss-loader', <% } %>'stylus-loader'],
            },<% } %><%  if (isPostCSS && isCSS) { %>
            {
                test: /\.css$/i,
                use: [<% if (isExtractPlugin) { %>MiniCssExtractPlugin.loader<% } else { %>'style-loader' <% } %>, 'css-loader', 'postcss-loader'],
            },<% } %>
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },<% if (langType == "Typescript") {%>
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },<% } %>
};

// Add mode specific configurations below
// Learn more about mode at https://webpack.js.org/configuration/mode/

const production = {
    mode: 'production',
};

const development = {
    mode: 'development',<% if (devServer) { %>
    devServer: {
        open: true,
        host: 'localhost',
    },<% } %>
};

module.exports = function (env, argv) {
    if (argv.mode == 'production') {
        return merge(base, production);
    }
    return merge(base, development);
};
