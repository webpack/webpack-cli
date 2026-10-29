---
"webpack-cli": patch
---

fix: don't detect browsers in `webpack info` on Windows, `envinfo` starts them to get their versions, which can hang
