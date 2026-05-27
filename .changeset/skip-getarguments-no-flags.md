---
"webpack-cli": patch
---

Skip the webpack schema-to-arguments walk on a plain `webpack build` (and other no-flag invocations). When no option flags are present, the CLI no longer builds the full option list or calls `getArguments`, reducing startup time and peak memory for the most common invocation.
