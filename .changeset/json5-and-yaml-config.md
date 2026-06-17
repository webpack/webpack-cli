---
"webpack-cli": minor
---

feat: support non-JavaScript config formats (e.g. `.json5`, `.yaml`/`.yml`) via `interpret`

webpack-cli now recognizes every config extension known to `interpret`, not only the JavaScript variants. The parsers for these formats are intentionally not shipped — install the matching package yourself (for example `json5` or `yaml-hook`) and it will be picked up automatically. When the parser is missing, webpack-cli reports which package to install instead of failing with an opaque error.
