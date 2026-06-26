---
"webpack-cli": minor
---

feat: support `.json5`, `.yaml`/`.yml` and `.toml` configuration files by parsing them directly, with the parser package (`json5`, `js-yaml`, `toml`) installed on demand by the user and declared as optional `peerDependencies` so the parsers resolve correctly under Yarn PnP
