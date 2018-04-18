"use strict";

const InputValidate = require("webpack-addons").InputValidate;
const validate = require("./validate");

function normalizeEntryPoint(entryPoint) {
	if (
		entryPoint.charAt(0) !== "(" &&
		entryPoint.charAt(0) !== "[" &&
		!entryPoint.includes("function") &&
		!entryPoint.includes("path") &&
		!entryPoint.includes("process")
	) {
		return `\'${entryPoint.replace(/"|'/g,"").concat(".js")}\'`;
	}

	return entryPoint;
}

/**
 *
 * Prompts for entry points, either if it has multiple or one entry
 *
 * @param	{Object} self 	- A variable holding the instance of the prompting
 * @param	{Object} answer - Previous answer from asking if the user wants single or multiple entries
 * @returns	{Object} An Object that holds the answers given by the user, later used to scaffold
 */

module.exports = (self, answer) => {
	let entryIdentifiers;
	let result;
	if (answer["entryType"] === true) {
		result = self
			.prompt([
				InputValidate(
					"multipleEntries",
					"Type the names you want for your modules (entry files), separated by comma [example: app,vendor]",
					validate
				)
			])
			.then(multipleEntriesAnswer => {
				let webpackEntryPoint = {};
				entryIdentifiers = multipleEntriesAnswer["multipleEntries"].split(",");
				function forEachPromise(obj, fn) {
					return obj.reduce((promise, prop) => {
						const trimmedProp = prop.trim();
						return promise.then(n => {
							if (n) {
								Object.keys(n).forEach(val => {
									webpackEntryPoint[val] = normalizeEntryPoint(n[val]);
								});
							} else {
								n = {};
							}
							return fn(trimmedProp);
						});
					}, Promise.resolve());
				}
				return forEachPromise(entryIdentifiers, entryProp =>
					self.prompt([
						InputValidate(
							`${entryProp}`,
							`What is the location of "${entryProp}"? [example: ./src/${entryProp}]`,
							validate
						)
					])
				).then(entryPropAnswer => {
					Object.keys(entryPropAnswer).forEach(val => {
						webpackEntryPoint[val] = normalizeEntryPoint(entryPropAnswer[val]);
					});
					return webpackEntryPoint;
				});
			});
	} else {
		result = self
			.prompt([
				InputValidate(
					"singularEntry",
					"Which module will be the first to enter the application? [default: ./src/index]"
				)
			])
			.then(singularEntryAnswer => {
				const { singularEntry } = singularEntryAnswer;

				return normalizeEntryPoint(singularEntry);
			});
	}
	return result;
};
