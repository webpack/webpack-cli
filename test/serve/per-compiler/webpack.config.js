module.exports = (env) =>
  ["app", "admin"].map((name, index) => ({
    name,
    mode: "development",
    entry: `./src/${name}.js`,
    output: { filename: `${name}.js` },
    stats: "none",
    devServer: {
      host: "127.0.0.1",
      port: Number(env[`${name}Port`]),
      static: false,
      hot: false,
      client: false,
      devMiddleware: { stats: index === 0 ? { all: false, assets: true } : "none" },
      onListening() {
        console.error(`Listening ${name}`);
      },
    },
  }));
