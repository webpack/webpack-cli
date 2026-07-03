module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    devMiddleware: { unknownOption: true },
  },
};
