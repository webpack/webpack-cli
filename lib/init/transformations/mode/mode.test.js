"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "mode", "mode-1", "'production'", "init");
defineTest(__dirname, "mode", "mode-1", "modeVariable", "init");

defineTest(__dirname, "mode", "mode-2", "none", "add");
defineTest(__dirname, "mode", "mode-2", "'production'", "add");
