class InfiniteWaitPlugin {
  constructor(options = {}) {
    this.time = options.time || 10000;
  }
  apply(compiler) {
    compiler.hooks.done.tapPromise("Infinite Wait Plugin", async () => {
      await new Promise((resolve) => process.nextTick(resolve));
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, this.time);
      });
    });
  }
}

module.exports = InfiniteWaitPlugin;
