---
"webpack-cli": minor
---

feat(cli): refresh the `--help` output using commander's `configureHelp` API — branded headers, section dividers, colorized terms and a clearer footer. Colors and chrome collapse to plain text when output is piped or `--no-color` is used, so scripts keep working.
