---
"webpack-cli": patch
---

Cache CLI argument metadata built from the webpack/dev-server schema and use map lookups instead of linear scans when applying CLI options, reducing redundant work and memory allocations per run.
