// Generated using webpack-cli http://github.com/webpack-cli
const path = require('path');<% if (htmlWebpackPlugin) { %>
const HtmlWebpackPlugin = require('html-webpack-plugin');<% } %>

module.exports = {
    mode: 'development',
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
<% } %>
        // Add your plugins here
        // Learn more obout plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [<% if (langType == "ES6") { %>
            {
                test: /\\.(js|jsx)$/,
                loader: 'babel-loader',
            },<% } %><% if (langType == "Typescript") { %>
            {
                test: /\\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },<% } %><%  if (isCSS && !isPostCSS) { %>
            {
                test: /\.css$/i,
                use: ['style-loader','css-loader'],
            },<% } %><%  if (cssType == 'SASS') { %>
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', <% if (isPostCSS) { %>'postcss-loader', <% } %>'sass-loader'],
            },<% } %><%  if (cssType == 'LESS') { %>
            {
                test: /\.less$/i,
                use: [<% if (isPostCSS) { %>'style-loader', 'css-loader', 'postcss-loader', <% } %>'less-loader'],
            },<% } %><%  if (cssType == 'Stylus') { %>
            {
                test: /\.styl$/,
                use: [<% if (isPostCSS) { %>'style-loader', 'css-loader', 'postcss-loader', <% } %>'stylus-loader'],
            },<% } %><%  if (isPostCSS && isCSS) { %>
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },<% } %>
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
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
