"use strict";

const defineTest = require("webpack-cli-utils/defineTest");

defineTest(__dirname, "top-scope", "top-scope-0", ["var test = 'me';"], "init");
defineTest(
	__dirname,
	"top-scope",
	"top-scope-1",
	["const webpack = require('webpack');"],
	"add"
);
