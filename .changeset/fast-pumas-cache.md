---
"webpack-cli": patch
---

Reduced CLI startup CPU and memory usage by caching schema-derived argument metadata, registering only the options present in the arguments, and reading config directories once during default-config discovery.
