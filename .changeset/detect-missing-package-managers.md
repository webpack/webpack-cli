---
"webpack-cli": patch
---

fix: detect missing package managers, without a lock file the CLI chose npm even when it wasn't installed instead of yarn or pnpm
