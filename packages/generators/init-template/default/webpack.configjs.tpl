// Generated using webpack-cli http://github.com/webpack-cli
const path = require('path');<% if (htmlWebpackPlugin) { %>
const HtmlWebpackPlugin = require('html-webpack-plugin');<% } %>

module.exports = {
    entry: './src/index.js',
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
        rules: [<% if (lang == "ES6") { %>
            {
                test: /\\.(js|jsx)$/,
                loader: 'babel-loader',
            },
<% } %><% if (lang == "Typescript") { %>
            {
                test: /\\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
<% } %><%  if (cssType == 'CSS') { %>
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },        
<% } %>
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },<% if (lang == "Typescript") {%>
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },<% } %>
};
