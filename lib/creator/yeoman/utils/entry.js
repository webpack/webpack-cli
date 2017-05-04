const Input = require('webpack-addons').Input;

module.exports = (self, answer) => {
	return new Promise( (resolve) => {
		let webpackEntryPoint;

		let entryIdentifiers;
		let entryProperties;
		if(answer['entryType'] == 'Multiple') {
			self.prompt([
				Input('multipleEntries', 'Write the name you want for your modules seperated by comma')
			]).then( (multipleEntriesAnswer) => {
				webpackEntryPoint = {};
				entryIdentifiers = multipleEntriesAnswer['multipleEntries'].split(',');
				self.prompt([
					Input('objectProperties', 'Write the location of those modules seperated by comma')
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
				Input('singularEntry', 'Write the location of module you would like to use')
			]).then( (singularAnswer) => {
				resolve(`'${singularAnswer['singularEntry']}.js'`);
			});
		}
	});
};
