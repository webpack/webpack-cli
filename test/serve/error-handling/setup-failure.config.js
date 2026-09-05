module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    setupMiddlewares: () => {
      throw new Error("Injected middleware failure");
    },
  },
};
