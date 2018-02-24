"use strict";

const npmPackagesExists = require("../utils/npm-packages-exists");
const defaultGenerator = require("../generators/init-generator");
const modifyHelper = require("../utils/modify-config-helper");

/**
 *
 * First function to be called after running the init flag. This is a check,
 * if we are running the init command with no arguments or if we got dependencies
 *
 * @param {Object} pkg - packages included when running the init command
 * @returns {Function} creator/npmPackagesExists - returns an installation of the package,
 * followed up with a yeoman instance of that if there's packages. If not, it creates a defaultGenerator
 */

module.exports = function initializeInquirer(pkg) {
	if (pkg.length === 0) {
		return modifyHelper("init", defaultGenerator);
	}
	return npmPackagesExists(pkg);
};
