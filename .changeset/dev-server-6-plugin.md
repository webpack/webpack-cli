---
"webpack-cli": major
---

feat!: run the dev server as a compiler plugin in `webpack serve`, which requires `webpack-dev-server@6` (v5 is no longer supported). The CLI now drives the compilation in watch mode, prints the build stats itself and owns graceful shutdown: `SIGINT`/`SIGTERM` close the compiler, which stops the server through its `shutdown` hook. Port conflicts between multiple `devServer` configurations are now reported before any server starts listening.
