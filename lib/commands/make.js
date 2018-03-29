"use strict";

/**
 * Is called and returns a scaffolding instance, adding properties
 *
 * @returns {Function} TBD
 *
 */

module.exports = class MakeCommand {
	constructor() {
		this.name = "make";
	}

	run() {
		console.log("make me");
	}
};
