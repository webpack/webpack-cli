const watchOptionTypes = require('./watchOptions-types');
const isAssignment = require('../../utils/is-assignment');

/*
*
* Transform for watchOptions. Finds the watchOptions property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createWatchOptionsProperty(p) {
		let watchOptionsNode = p.value.properties;
		watchOptionsNode.push(j.property('init', j.identifier('watchOptions'), j.objectExpression([])));
		watchOptionsNode.filter(n => n.key.name === 'watchOptions').forEach( (prop) => {
			Object.keys(webpackProperties['watchOptions']).filter( (watchOption) => {
				if(watchOptionTypes.includes(watchOption)) {
					if(typeof(webpackProperties['watchOptions'][watchOption]) === 'number') {
						prop.value.properties.push(
							j.property(
								'init',
								j.identifier(watchOption),
								j.literal(webpackProperties['watchOptions'][watchOption])
							)
						);
					} else {
						prop.value.properties.push(
							j.property(
								'init',
								j.identifier(watchOption),
								j.identifier(webpackProperties['watchOptions'][watchOption])
							)
						);
					}
				} else {
					throw new Error('Unknown Property', watchOption);
				}
			});
		});
	}
	if(webpackProperties['watchOptions'] && webpackProperties['watchOptions']) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createWatchOptionsProperty));
	} else {
		return ast;
	}
};
