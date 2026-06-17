---
"webpack-cli": minor
---

feat: support `.json5`, `.yaml`/`.yml` and `.toml` configuration files

webpack-cli now reads and parses these non-JavaScript config formats directly,
without relying on `interpret`/`rechoir`. The parsers are intentionally not
shipped — install the one you need yourself (`json5` for `.json5`, `js-yaml`
for `.yaml`/`.yml`, `toml` for `.toml`) and it is imported on demand. When the
parser is missing, webpack-cli exits with a clear error telling you exactly
which package to install. JavaScript variants (`.ts`, `.coffee`, `.babel.js`,
…) continue to be handled through `interpret` for now.
