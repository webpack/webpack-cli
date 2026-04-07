---
"webpack-cli": major
---

Migrate webpack-cli from CommonJS to ES Modules. The package now sets `"type": "module"` and uses native ESM `import`/`export`. The `import-local` dependency has been removed.
