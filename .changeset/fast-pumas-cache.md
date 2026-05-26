---
"webpack-cli": patch
---

Cache CLI argument metadata built from the webpack/dev-server schema and apply CLI options using the cached name-keyed map directly, avoiding a redundant schema walk and the rebuild of a large options array and lookup map on every run. Default-config discovery now reads each candidate directory once instead of probing every `<name><ext>` combination with a separate `fs.access` call (up to ~100 sequential syscalls when no config file exists). Colors are also created lazily, so commands that don't need webpack (such as `version` and `info`) no longer load it. The cached argument metadata (~1MB per schema) is held via `WeakRef` so the garbage collector can reclaim it once command setup is done, which matters for long-running `serve`/`watch`. This reduces per-invocation CPU work, syscalls, and memory usage.
