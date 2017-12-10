"use strict";

const defaultGenerator = require("../generators/add-generator");
const modifyHelper = require("../utils/modify-config-helper");

module.exports = function() {
	return modifyHelper("add", defaultGenerator);
};
