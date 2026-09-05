module.exports = (env) =>
  [0, 1].map((index) => ({
    name: `server-${index}`,
    mode: "development",
    entry: "../rebuild/src/index.js",
    output: { filename: `server-${index}.js` },
    devServer: {
      host: "127.0.0.1",
      static: false,
      hot: false,
      client: false,
      ...(env.explicit && index === 1 ? { port: Number(env.explicit) } : {}),
      ...(env.auto ? { port: "auto" } : {}),
      onListening(server) {
        console.log(`Listening ${index}: ${server.server.address().port}`);
      },
    },
  }));
