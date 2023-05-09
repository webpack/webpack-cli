const { join } = require("path");
const DotenvWebpackPlugin = require("../../../../packages/dotenv-webpack-plugin/src");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  output: {
    path: join(__dirname, "dist"),
  },
  plugins: [
    new DotenvWebpackPlugin({
      prefixes: ["custom_prefix_"],
    }),
  ],
};
