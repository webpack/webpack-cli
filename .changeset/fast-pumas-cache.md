---
"webpack-cli": patch
---

Cache CLI argument metadata built from the webpack/dev-server schema and apply CLI options using the cached name-keyed map directly, avoiding a redundant schema walk and the rebuild of a large options array and lookup map on every run. This reduces per-invocation CPU work and memory allocations, most noticeably in `loadConfig`.
