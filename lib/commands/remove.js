"use strict";

const defaultGenerator = require("../generators/remove-generator");
const modifyHelper = require("../utils/modify-config-helper");

module.exports = function() {
	return modifyHelper("remove", defaultGenerator);
};
