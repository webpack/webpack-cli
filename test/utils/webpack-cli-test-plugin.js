class WebpackCLITestPlugin {
  constructor(options, showAll = true, showHooks) {
    this.opts = options;
    this.showAll = showAll;
    this.showHooks = showHooks;
  }

  apply(compiler) {
    compiler.hooks.done.tap("webpack-cli Test Plugin", () => {
      if (this.showHooks) {
        const identifiers = this.showHooks.split(".");

        let shown = compiler;

        identifiers.forEach((identifier) => {
          shown = shown[identifier];
        });

        console.log(shown);
      }

      if (this.showAll) {
        console.log(compiler.options);
      }

      if (this.opts) {
        this.opts.map((e) => {
          const config = Object.getOwnPropertyDescriptor(compiler.options, e);

          console.log(config.value);
        });
      }

      // Print all environment variables starting with "WEBPACK"
      for (const [key, value] of Object.entries(process.env)) {
        if (key.startsWith("WEBPACK")) {
          console.log(`${key}: ${value}`);
        }
      }
    });
  }
}

module.exports = WebpackCLITestPlugin;
