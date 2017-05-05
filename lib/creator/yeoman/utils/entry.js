const InputValidate = require('webpack-addons').InputValidate;
const validate = require('./validate');

module.exports = (self, answer) => {
	let webpackEntryPoint;
	let entryIdentifiers;
	let entryProperties;

	let result;

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

	if(answer['entryType'] === 'Multiple') {
		result = self.prompt([
			InputValidate(
				'multipleEntries',
				'Type the name you want for your modules seperated by comma',
				validate
			)
		]).then( (multipleEntriesAnswer) => {
			webpackEntryPoint = {};
			entryIdentifiers = multipleEntriesAnswer['multipleEntries'].split(',');
			return self.prompt([
				InputValidate(
					'objectProperties',
					'Type the location of those modules seperated by comma',
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
					return webpackEntryPoint;
				}
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
		]).then( (singularAnswer) => `'${singularAnswer['singularEntry']}.js'`);
	}
	return result;
};
