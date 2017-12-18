"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "watch", "watch-0", true, "init");
defineTest(__dirname, "watch", "watch-0", false, "init");
defineTest(__dirname, "watch", "watch-1", true, "init");
defineTest(__dirname, "watch", "watch-1", false, "init");

defineTest(__dirname, "watch", "watch-0", true, "add");
defineTest(__dirname, "watch", "watch-0", false, "add");
defineTest(__dirname, "watch", "watch-4", false, "add");
defineTest(__dirname, "watch", "watch-4", "somehin", "add");
