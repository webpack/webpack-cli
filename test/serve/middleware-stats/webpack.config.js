module.exports = (env) => {
  const overrides = {
    none: "none",
    false: false,
    true: true,
    assets: { all: false, assets: true },
  };
  const makeConfig = (name) => ({
    name,
    mode: "development",
    entry: "../rebuild/src/index.js",
    output: { filename: `${name}.js` },
    stats: env.kind === "none" || env.kind === "false" ? "normal" : "none",
    plugins: [
      {
        apply(compiler) {
          compiler.hooks.afterDone.tap("StatsTest", () => {
            console.error(`Built ${name}`);
          });
        },
      },
    ],
  });
  const first = makeConfig("first");
  first.devServer = {
    host: "127.0.0.1",
    port: 0,
    static: false,
    client: false,
    hot: false,
    devMiddleware: { stats: overrides[env.kind] },
    onListening() {
      console.error("Server ready");
    },
  };
  return env.multi ? [first, makeConfig("second")] : first;
};
