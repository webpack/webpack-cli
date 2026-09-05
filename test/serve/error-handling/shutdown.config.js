const configuration = require("./warning.config");

module.exports = {
  ...configuration,
  devServer: {
    setupExitSignals: true,
    onListening: () => {
      console.error(
        `Server ready: ${process.listenerCount("SIGINT")} SIGINT, ${process.listenerCount("SIGTERM")} SIGTERM`,
      );
    },
  },
  plugins: [
    {
      apply(compiler) {
        compiler.hooks.shutdown.tap("ShutdownTest", () => {
          console.log("Compiler shutdown");
        });
      },
    },
  ],
};
