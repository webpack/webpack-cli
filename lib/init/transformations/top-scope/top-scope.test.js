"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "top-scope", "top-scope-0", ["var test = 'me';"], "init");
