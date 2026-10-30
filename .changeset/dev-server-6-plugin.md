---
"webpack-cli": minor
---

feat: run `webpack-dev-server@6` as a compiler plugin. The CLI drives watch compilation, prints build stats and closes the compiler on shutdown. Older dev servers continue to manage their own compilation.

In multi-compiler mode, every dev server serves all compilers by default. Use the new `--dev-server-per-compiler` option of `webpack serve` to serve each compiler only by the dev server from its own configuration.
