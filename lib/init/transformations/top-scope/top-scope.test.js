"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(__dirname, "top-scope", "top-scope-0", ["const test = 'me';"], "init");
defineTest(
	__dirname,
	"top-scope",
	"top-scope-1",
	["const webpack = require('webpack');"],
	"add"
);
