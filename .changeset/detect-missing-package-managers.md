---
"webpack-cli": patch
---

fix: detect missing package managers and failed installations, without a lock file the CLI chose npm even when it wasn't installed instead of yarn or pnpm, and it continued after a package failed to install
