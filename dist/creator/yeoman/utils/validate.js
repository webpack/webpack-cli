"use strict";

module.exports = value => {
	const pass = value.length;
	if (pass) {
		return true;
	}
	return "Please specify an answer!";
};
