const utils = require('../../../transformations/utils');

// optional for the user to parse using jscodeshift for only this if a regular regexp doesnt work.
function regExpStrategy(j, webpackProperties, webpackProp, prop) {
	let RegExpDec = utils.createExternalRegExp(j, webpackProperties.module[webpackProp]);
	return utils.pushCreateProperty(j, prop, webpackProp, RegExpDec);
}

// Module.rules.myRule.test
function createTestProperty(j, moduleProp, seen, key, subProps) {
	moduleProp.value.elements[seen].properties.push(
		utils.createObjectWithSuppliedProperty(j, key, j.literal(subProps[key]))
	);
}
// Module.rules.myRule.option
function createOption(j, subProps, key) {
	let optionVal;
	let optionProp;

	if(typeof(subProps[key]) === 'string') {
		optionProp = utils.createIdentifierOrLiteral(j, subProps[key]);
		optionVal = utils.createObjectWithSuppliedProperty(j, key, optionProp);
	} else {
		optionVal = utils.createObjectWithSuppliedProperty(j, key, j.objectExpression([]));

		Object.keys(subProps[key]).forEach( (optionProperty) => {
			if(Array.isArray(subProps[key][optionProperty])) {
				const optionArray = utils.createArrayWithChildren(
					j, optionProperty, subProps[key][optionProperty], true
				);
				optionVal.value.properties.push(optionArray);
			} else {
				utils.pushCreateProperty(j, optionVal, optionProperty, subProps[key][optionProperty]);
			}
		});
	}
	return optionVal;
}
// Module.rules.rule.use
function createUseProperties(j, key, subProps) {
	let useVal = utils.createEmptyArrayProperty(j, key);

	Object.keys(subProps[key]).forEach( (optionProperty) => {
		if(typeof(subProps[key][optionProperty]) === 'string') {
			useVal.value.elements.push(
				utils.createIdentifierOrLiteral(subProps[key][optionProperty])
			);
		} else {
			let loaderProperty = j.objectExpression([]);
			Object.keys(subProps[key][optionProperty]).forEach( subOptionProp => {
				if(typeof(subProps[key][optionProperty][subOptionProp]) === 'string') {
					loaderProperty.properties.push(
						utils.createObjectWithSuppliedProperty(
							j,
							subOptionProp,
							utils.createIdentifierOrLiteral(
								j, subProps[key][optionProperty][subOptionProp]
							)
						)
					);
				} else {
					let subSubProps = j.objectExpression([]);
					Object.keys(subProps[key][optionProperty][subOptionProp]).forEach( (underlyingOption) => {
						subSubProps.properties.push(
							utils.createObjectWithSuppliedProperty(
								j,
								underlyingOption,
								utils.createIdentifierOrLiteral(
									j, subProps[key][optionProperty][subOptionProp][underlyingOption]
								)
							)
						);
					});
					loaderProperty.properties.push(
						utils.createObjectWithSuppliedProperty(j, subOptionProp, subSubProps)
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
