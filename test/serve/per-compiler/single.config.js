module.exports = (env) => ({
  name: "app",
  mode: "development",
  entry: "./src/app.js",
  output: { filename: "app.js" },
  devServer: {
    host: "127.0.0.1",
    port: Number(env.appPort),
    static: false,
    hot: false,
    client: false,
    onListening() {
      console.error("Listening app");
    },
  },
});
