/* eslint-disable node/no-unpublished-require */
const InputValidate = require("../../../webpack-scaffold").InputValidate;
const webpackEntryPoint = {};
function forEachPromise(entries, fn) {
	return entries.reduce((promise, prop) => {
		const trimmedProp = prop.trim();

		return promise.then((n) => {
			if (n) {
				Object.keys(n).forEach((val) => {
					if (
						n[val].charAt(0) !== "(" &&
						n[val].charAt(0) !== "[" &&
						!n[val].includes("function") &&
						!n[val].includes("path") &&
						!n[val].includes("process")
					) {
						n[val] = `\'${n[val].replace(/"|'/g, "").concat(".js")}\'`;
					}
					webpackEntryPoint[val] = n[val];
				});
			} else {
				n = {};
			}
			return fn(trimmedProp);
		});
	}, Promise.resolve());
}
/**
 * Asks for entry points, either if it has multiple or one entry
 * @param {Object} questioner Instance of TCP questioner used by init endpoint
 * @param {Object} answer Boolean answer to whether mutiple entries are used or not
 * @returns {Object} An Object to entry for webpack config
 */
module.exports = function(questioner, answer) {
	if (answer.entryType === true) {
		return questioner.question({
			action: "question",
			question: InputValidate(
				"multipleEntries",
				"Type the names you want for your modules (entry files), separated by comma [example: app,vendor]"
			),
		}).then((entries) => {
			return forEachPromise(entries, (entryProp) => {
				return questioner.question({
					action: "question",
					question: InputValidate(
						`${entryProp}`,
						`What is the location of "${entryProp}"? [example: ./src/${entryProp}]`
					),
				});
			}).then((entryPropAnswer) => {
				Object.keys(entryPropAnswer).forEach(val => {
					if (
						entryPropAnswer[val].charAt(0) !== "(" &&
						entryPropAnswer[val].charAt(0) !== "[" &&
						!entryPropAnswer[val].includes("function") &&
						!entryPropAnswer[val].includes("path") &&
						!entryPropAnswer[val].includes("process")
					) {
						entryPropAnswer[val] = `\'${entryPropAnswer[val]
							.replace(/"|'/g, "")
							.concat(".js")}\'`;
					}
					webpackEntryPoint[val] = entryPropAnswer[val];
				});
				return webpackEntryPoint;
			});
		});
	} else {
		return questioner.question({
			action: "question",
			question: InputValidate(
				"singularEntry",
				"Which module will be the first to enter the application? [default: ./src/index]"
			)
		}).then((singularEntryAnswer) => {
			let singularEntry = singularEntryAnswer.singularEntry;
			if (singularEntry.indexOf("\"") >= 0) {
				singularEntry = singularEntry.replace(/"/g, "'");
			}
			return singularEntry;
		});
	}
};
