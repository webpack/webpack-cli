"use strict";

const defaultGenerator = require("../generators/remove-generator");
const modifyHelper = require("../utils/modify-config-helper");

/**
 * Is called and returns a scaffolding instance, removing properties
 *
 * @returns {Function} modifyHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

module.exports = class RemoveCommand {
	constructor() {
		this.name = "remove";
	}
	run() {
		return modifyHelper("remove", defaultGenerator);
	}
};
