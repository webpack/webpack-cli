"use strict";

const defaultGenerator = require("../generators/update-generator");
const modifyHelper = require("../utils/modify-config-helper");

module.exports = function() {
	return modifyHelper("update", defaultGenerator);
};
