// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');<% if (htmlWebpackPlugin) { %>
const HtmlWebpackPlugin = require('html-webpack-plugin');<% } %><% if (extractPlugin !== 'No') { %>
const MiniCssExtractPlugin = require('mini-css-extract-plugin');<% } %><% if (workboxWebpackPlugin) { %>
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');<% } %>

const isProduction = process.env.NODE_ENV == 'production';
<% if (cssType !== 'none') { %>
<% if (extractPlugin === "Yes") { %>
const stylesHandler = MiniCssExtractPlugin.loader;
<% } else if (extractPlugin === "Only for Production") { %>
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';
<% } else { %>
const stylesHandler = 'style-loader';
<% } %>
<% } %>

const config = {
    entry: '<%= entry %>',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },<% if (devServer) { %>
    devServer: {
        open: true,
        host: 'localhost',
    },<% } %>
    plugins: [<% if (htmlWebpackPlugin) { %>
        new HtmlWebpackPlugin({
            template: 'index.html',
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
                use: [stylesHandler,'css-loader'],
            },<% } %><%  if (cssType == 'SASS') { %>
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', <% if (isPostCSS) { %>'postcss-loader', <% } %>'sass-loader'],
            },<% } %><%  if (cssType == 'LESS') { %>
            {
                test: /\.less$/i,
                use: [stylesHandler, 'css-loader', <% if (isPostCSS) { %>'postcss-loader', <% } %>'less-loader'],
            },<% } %><%  if (cssType == 'Stylus') { %>
            {
                test: /\.styl$/i,
                use: [stylesHandler, 'css-loader', <% if (isPostCSS) { %>'postcss-loader', <% } %>'stylus-loader'],
            },<% } %><%  if (isPostCSS && isCSS) { %>
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
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
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },<% } %>
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        <% if (extractPlugin === "Only for Production") { %>
        config.plugins.push(new MiniCssExtractPlugin());
        <% } %>
        <% if (workboxWebpackPlugin) { %>
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
        <% } %>
    } else {
        config.mode = 'development';
    }
    return config;
};
