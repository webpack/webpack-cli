const InputValidate = require('webpack-addons').InputValidate;
const validate = require('./validate');

module.exports = (self, answer) => {
	let entryIdentifiers;
	let result;

	if(answer['entryType'] === 'Multiple') {
		result = self.prompt([
			InputValidate(
				'multipleEntries',
				'Type the name you want for your modules seperated by comma',
				validate
			)
		]).then( (multipleEntriesAnswer) => {
			let webpackEntryPoint = {};
			entryIdentifiers = multipleEntriesAnswer['multipleEntries'].split(',');
			function forEachPromise(obj, fn) {
				return obj.reduce(function (promise, prop) {
					const trimmedProp = prop.trim();
					return promise.then(function (n) {
						webpackEntryPoint = Object.assign({}, n);
						return fn(trimmedProp);
					});
				}, Promise.resolve());
			}
			return forEachPromise(entryIdentifiers, (entryProp) => self.prompt([
				InputValidate(
					`${entryProp}`,
					`What is the location of '${entryProp}'?`,
					validate
				)
			])).then(propAns => {
				const prop = Object.keys(propAns);
				webpackEntryPoint[prop] = propAns[prop];
				return webpackEntryPoint;
			});
		});
	}
	else {
		result = self.prompt([
			InputValidate(
				'singularEntry',
				'Type the location of module you would like to use',
				validate
			)
		]).then( (singularAnswer) => singularAnswer['singularEntry']);
	}
	return result;
};
