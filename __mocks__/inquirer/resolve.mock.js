"use strict";

const path = require("path");

function mockPromise(value) {
	const isValueAPromise = (value || {}).then;
	const mockedPromise = {
		then: function(callback) {
			return mockPromise(callback(value));
		}
	};

	return isValueAPromise ? value : mockedPromise;
}
function spawnChild(pkg) {
	return pkg;
}

function getLoc(option) {
	let packageModule = [];
	option.filter(pkg => {
		mockPromise(spawnChild(pkg)).then(() => {
			try {
				let loc = path.join("..", "..", "node_modules", pkg);
				packageModule.push(loc);
			} catch (err) {
				throw new Error(
					"Package wasn't validated correctly.." + "Submit an issue for",
					pkg,
					"if this persists"
				);
			}
		});
		return packageModule;
	});
	return packageModule;
}

module.exports = getLoc;
