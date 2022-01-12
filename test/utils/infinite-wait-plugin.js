class InfiniteWaitPlugin {
  constructor(options) {
    this.time = options.time || 1000;
  }
  apply(compiler) {
    compiler.hooks.done.tapPromise("Infinite Wait Plugin", async () => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, this.time);
      });
    });
  }
}

module.exports = InfiniteWaitPlugin;
