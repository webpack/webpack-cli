"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "target", "target-0", "'async-node'", "init");
defineTest(__dirname, "target", "target-1", "node", "init");
