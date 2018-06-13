"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defineTest_1 = require("@webpack-cli/utils/defineTest");
const path_1 = require("path");
const dirName = path_1.join(__dirname, "..");
defineTest_1.default(dirName, "bannerPlugin", "bannerPlugin-0");
defineTest_1.default(dirName, "bannerPlugin", "bannerPlugin-1");
defineTest_1.default(dirName, "bannerPlugin", "bannerPlugin-2");
