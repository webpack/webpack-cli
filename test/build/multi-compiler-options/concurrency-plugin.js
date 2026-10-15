"use strict";

// Shared by every child: reports how many compilers ran at the same time.
let running = 0;
let max = 0;
let finished = 0;

class ConcurrencyPlugin {
  apply(compiler) {
    compiler.hooks.run.tap("ConcurrencyPlugin", () => {
      running++;
      max = Math.max(max, running);
    });
    compiler.hooks.done.tap("ConcurrencyPlugin", () => {
      running--;
      finished++;

      if (finished === 2) {
        console.log(`max concurrent compilers: ${max}`);
      }
    });
  }
}

module.exports = ConcurrencyPlugin;
