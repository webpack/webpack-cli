// Generated using webpack-cli http://github.com/webpack-cli
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // Add your plugins here
        // Learn more obout plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [<% if (lang) { %><% if (lang == "ES6") { %>
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
<% } %><% } %>
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};
