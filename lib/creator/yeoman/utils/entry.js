const Input = require('webpack-addons').Input;

module.exports = (self, answer) => {
	return new Promise( (resolve) => {
		let webpackEntryPoint;

		let entryIdentifiers;
		let entryProperties;
		if(answer['entryType'].indexOf('Array') >= 0) {
			self.prompt([
				Input('arrayNumber', 'write your entry points seperated by comma')
			]).then( (arrayAnswer) => {
				webpackEntryPoint = arrayAnswer['arrayNumber'].split(',');
				resolve(webpackEntryPoint.map( (prop) => {
					let newProp = `'${prop}'`;
					return newProp;
				}));
			});
		}
		else if(answer['entryType'].indexOf('Object') >= 0) {
			self.prompt([
				Input('objectNames', 'List your entry properties seperated by comma')
			]).then( (objectIdentifierAnswer) => {
				webpackEntryPoint = {};
				entryIdentifiers = objectIdentifierAnswer['objectNames'].split(',');
				self.prompt([
					Input('objectProperties', 'List your entry properties seperated by comma')
				]).then( (objectPropAnswer) => {
					entryProperties = objectPropAnswer['objectProperties'].split(',');
					for(let k = 0; k < entryIdentifiers.length; k++) {
						webpackEntryPoint[entryIdentifiers[k]] = `'${entryProperties[k]}'`;
					}
					resolve(webpackEntryPoint);
				});
			});
		}
		else {
			self.prompt([
				Input('singularEntry', 'What\'s your entry point?')
			]).then( (singularAnswer) => {
				if(answer['entryType'].indexOf('String') >= 0) {
					webpackEntryPoint = `'${singularAnswer['singularEntry']}'`;
				} else {
					webpackEntryPoint = singularAnswer['singularEntry'];
				}
				resolve(webpackEntryPoint);
			});
		}
	});
};
