---
"webpack-cli": patch
---

refactor(cli): make the styled help/info/version/configtest output use hierarchical indentation — branded headers, dividers, descriptions, status messages and the footer now sit at column 0, and the two-space indent is reserved for content nested inside a section (envinfo rows, option/command lists). This keeps the padding meaningful and leaves output that never went through the renderer (e.g. webpack/dev-server errors) untouched.
