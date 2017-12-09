"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "target", "target-0", "'async-node'");
defineTest(__dirname, "target", "target-1", "node");
