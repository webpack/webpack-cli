class WebpackCLITestPlugin {
  constructor(options, showAll = true, showHooks = false) {
    this.opts = options;
    this.showAll = showAll;
    this.showHooks = showHooks;
  }

  apply(compiler) {
    compiler.hooks.done.tap("webpack-cli Test Plugin", () => {
      if (this.showHooks) {
        const identifiers = this.showHooks.split(".");

        let shown = compiler;

        for (const identifier of identifiers) {
          shown = shown[identifier];
        }

        console.log(shown);
      }

      if (this.showAll) {
        console.log(compiler.options);
      }

      if (this.opts) {
        this.opts.map((e) => {
          const config = Object.getOwnPropertyDescriptor(compiler.options, e);

          console.log(config.value);

          return e;
        });
      }
    });
  }
}

module.exports = WebpackCLITestPlugin;
