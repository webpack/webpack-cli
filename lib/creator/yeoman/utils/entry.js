const InputValidate = require('webpack-addons').InputValidate;
const validate = require('./validate');

module.exports = (self, answer) => {
	let entryIdentifiers;
	let entryProperties;

	const validateProperties = (value) => {
		const valLength = value.length;
		const values = value.split(',');
		if(!valLength) {
			return 'Please specify an answer!';
		}
		else if(valLength && values.length == entryIdentifiers.length) {
			return true;
		} else {
			return 'You forgot to add one or more property to your entry point!';
		}
	};
	return new Promise( (resolve) => {
		let webpackEntryPoint;

		if(answer['entryType'] == 'Multiple') {
			self.prompt([
				InputValidate(
					'multipleEntries',
					'Write the name you want for your modules seperated by comma',
					validate
				)
			]).then( (multipleEntriesAnswer) => {
				webpackEntryPoint = {};
				entryIdentifiers = multipleEntriesAnswer['multipleEntries'].split(',');
				self.prompt([
					InputValidate(
						'objectProperties',
						'Write the location of those modules seperated by comma',
						validateProperties
					)
				]).then( (objectPropAnswer) => {
					entryProperties = objectPropAnswer['objectProperties'].split(',');
					for(let k = 0; k < entryIdentifiers.length; k++) {
						if(entryProperties[k].charAt(0) == '(' ||  entryProperties[k].charAt(0) == '[') {
							webpackEntryPoint[entryIdentifiers[k]] = entryProperties[k];
						} else {
							webpackEntryPoint[entryIdentifiers[k]] = `'${entryProperties[k]}.js'`;
						}
					}
					resolve(webpackEntryPoint);
				});
			});
		}
		else {
			self.prompt([
				InputValidate(
					'singularEntry',
					'Write the location of module you would like to use',
					validate
				)
			]).then( (singularAnswer) => {
				resolve(`'${singularAnswer['singularEntry']}.js'`);
			});
		}
	});
};
