---
"webpack-cli": patch
---

Reduced CLI startup work for `webpack build`: the `interpret` package is now imported only when no common-extension config file (`.js`/`.mjs`/`.cjs`/`.ts`/`.cts`/`.mts`) exists, and the Levenshtein "did you mean" helper was inlined to drop a module import.
