const transformUtils = require('../../../transformations/utils');

// optional for the user to parse using jscodeshift for only this if a regular regexp doesnt work.
function regExpStrategy(j, webpackProperties, webpackProp, prop) {
	let RegExpDec = transformUtils.createExternalRegExp(j, webpackProperties.module[webpackProp]);
	prop.value.properties.push(
		transformUtils.createPropertyWithSuppliedProperty(j, webpackProp, RegExpDec)
	);
}

// Module.rules.myRule.test
function createTestProperty(j, moduleProp, seen, key, subProps) {
	moduleProp.value.elements[seen].properties.push(
		transformUtils.createPropertyWithSuppliedProperty(j, key, j.literal(subProps[key]))
	);
}
// Module.rules.myRule.option
function createOption(j, subProps, key) {
	let optionVal;
	let optionProp;

	if(typeof(subProps[key]) === 'string') {
		optionProp = transformUtils.createIdentifierOrLiteral(j, subProps[key]);
		optionVal = transformUtils.createPropertyWithSuppliedProperty(j, key, optionProp);
	} else {
		optionVal = transformUtils.createPropertyWithSuppliedProperty(j, key, j.objectExpression([]));

		Object.keys(subProps[key]).forEach( (optionProperty) => {
			if(Array.isArray(subProps[key][optionProperty])) {
				const optionArray = transformUtils.createArrayWithChildren(
					j, optionProperty, subProps[key][optionProperty], true
				);
				optionVal.value.properties.push(optionArray);
			} else {
				optionVal.value.properties.push(
					transformUtils.createPropertyWithSuppliedProperty(
						j,
						optionProperty,
						transformUtils.createIdentifierOrLiteral(
							j, subProps[key][optionProperty]
						)
					)
				);
			}
		});
	}
	return optionVal;
}
// Module.rules.rule.use
function createUseProperties(j, key, subProps) {
	let useVal = transformUtils.createEmptyArrayProperty(j, key);

	Object.keys(subProps[key]).forEach( (optionProperty) => {
		if(typeof(subProps[key][optionProperty]) === 'string') {
			useVal.value.elements.push(
				transformUtils.createIdentifierOrLiteral(subProps[key][optionProperty])
			);
		} else {
			let loaderProperty = j.objectExpression([]);
			Object.keys(subProps[key][optionProperty]).forEach( subOptionProp => {
				if(typeof(subProps[key][optionProperty][subOptionProp]) === 'string') {
					loaderProperty.properties.push(
						transformUtils.createPropertyWithSuppliedProperty(
							j,
							subOptionProp,
							transformUtils.createIdentifierOrLiteral(
								j, subProps[key][optionProperty][subOptionProp]
							)
						)
					);
				} else {
					let subSubProps = j.objectExpression([]);
					Object.keys(subProps[key][optionProperty][subOptionProp]).forEach( (underlyingOption) => {
						subSubProps.properties.push(
							transformUtils.createPropertyWithSuppliedProperty(
								j,
								underlyingOption,
								transformUtils.createIdentifierOrLiteral(
									j, subProps[key][optionProperty][subOptionProp][underlyingOption]
								)
							)
						);
					});
					loaderProperty.properties.push(
						transformUtils.createPropertyWithSuppliedProperty(j, subOptionProp, subSubProps)
					);
				}
			});
			useVal.value.elements.push(loaderProperty);
		}
	});
	return useVal;
}

module.exports = {
	regExpStrategy,
	createTestProperty,
	createOption,
	createUseProperties
};
