---
"webpack-cli": minor
---

feat: add support for `webpack-dev-server@6`. When v6 is installed, `webpack serve` runs the dev server as a compiler plugin: the CLI drives the compilation in watch mode, prints the build stats itself and owns graceful shutdown (`SIGINT`/`SIGTERM` close the compiler, which stops the server through its `shutdown` hook), and port conflicts between multiple `devServer` configurations are reported before any server starts listening. `webpack-dev-server@5` keeps working through its own compilation flow.
