"use strict";

// Loaded via `WEBPACK_PACKAGE`: webpack before 5.112 doesn't apply `plugins` of multi configurations
const webpack = require("webpack");

module.exports = new Proxy(webpack, {
  get: (target, property) => (property === "version" ? "5.111.0" : Reflect.get(target, property)),
});
