---
"webpack-cli": patch
---

Defer requiring the CLI implementation until after the local-installation check in the `webpack` bin. A run delegated to a local `webpack-cli` no longer loads the outer installation's modules, and `WEBPACK_CLI_SKIP_IMPORT_LOCAL` now also skips loading `import-local` itself.
