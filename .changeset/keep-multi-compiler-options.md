---
"webpack-cli": patch
---

fix: keep multi-compiler options such as `parallelism` and `plugins` set on a configuration array when `--config-name` or `extends` rebuild it
