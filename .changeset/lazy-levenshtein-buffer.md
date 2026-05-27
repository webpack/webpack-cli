---
"webpack-cli": patch
---

Allocate the Levenshtein lookup buffer lazily so the 256 KB `Uint32Array` is only created when "did you mean" suggestions run (on error paths) rather than on every CLI invocation.
