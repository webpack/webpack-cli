
// optional for the user to parse using jscodeshift for only this if a regular regexp doesnt work.
function regExpStrategy(j, webpackProperties, webpackProp, prop) {
	let RegExpDec = webpackProperties.module[webpackProp].__paths[0].value.program.body[0].expression;
	prop.value.properties.push(
		j.property('init', j.identifier(webpackProp), j.literal(RegExpDec.value))
	);
}

// Module.rules.myRule.test
function createTestProperty(j, moduleProp, seen, key, subProps) {
	moduleProp.value.elements[seen].properties.push(
		j.property(
			'init',
			j.identifier(key),
			j.literal(
				subProps[key]
			)
		)
	);
}
// Module.rules.myRule.option
function createOption(j, subProps, key) {
	let optionVal = j.property('init', j.identifier(key), j.identifier('null'));

	if(typeof(subProps[key]) === 'string') {
		optionVal.value = j.identifier(subProps[key]);
	} else {
		optionVal.value.type = 'ObjectExpression';
		optionVal.value.properties = [];
		Object.keys(subProps[key]).forEach( (optionProperty) => {
			if(Array.isArray(subProps[key][optionProperty])) {
				const optionArray = j.property(
					'init',
					j.identifier(optionProperty),
					j.arrayExpression([])
				);
				subProps[key][optionProperty].forEach( (n) => {
					optionArray.value.elements.push(j.literal(n));
				});
				optionVal.value.properties.push(optionArray);
			} else {
				if(typeof(subProps[key][optionProperty]) === 'string') {
					optionVal.value.properties.push(
						j.property(
							'init',
							j.identifier(optionProperty),
							j.identifier(subProps[key][optionProperty])
						)
					);
				} else {
					optionVal.value.properties.push(
						j.property(
							'init',
							j.identifier(optionProperty),
							j.literal(subProps[key][optionProperty])
						)
					);
				}
			}
		});
	}
	return optionVal;
}
// Module.rules.rule.use
function createUseProperties(j, key, subProps) {
	let useVal = j.property('init', j.identifier(key), j.arrayExpression([]));

	Object.keys(subProps[key]).forEach( (optionProperty) => {
		if(typeof(subProps[key][optionProperty]) === 'string') {
			useVal.value.elements.push(
				j.identifier(subProps[key][optionProperty])
			);
		} else {
			let loaderProperty = j.objectExpression([]);
			Object.keys(subProps[key][optionProperty]).forEach( subOptionProp => {
				if(typeof(subProps[key][optionProperty][subOptionProp]) === 'string') {
					loaderProperty.properties.push(
						j.property('init',
						j.identifier(subOptionProp),
						j.identifier(subProps[key][optionProperty][subOptionProp])
					));
				} else {
					let subSubProps = j.objectExpression([]);
					Object.keys(subProps[key][optionProperty][subOptionProp]).forEach( (underlyingOption) => {
						subSubProps.properties.push(
							j.property('init',
							j.identifier(underlyingOption),
							j.identifier(
								subProps[key][optionProperty][subOptionProp][underlyingOption]
							))
						);
					});
					loaderProperty.properties.push(
						j.property('init', j.identifier(subOptionProp), subSubProps)
					);
				}
			});
			useVal.value.elements.push(loaderProperty);
		}
	});
	return useVal;
}

// Module.rules.include/exclude
function createIncludeOrExcludeProperties(j, key, subProps) {
	let InExcludeVal = j.property('init', j.identifier(key), j.arrayExpression([]));
	Object.keys(subProps[key]).forEach( (subProperty) => {
		InExcludeVal.value.elements.push(j.identifier(subProps[key][subProperty]));
	});
	return InExcludeVal;
}

module.exports = {
	regExpStrategy,
	createTestProperty,
	createOption,
	createUseProperties,
	createIncludeOrExcludeProperties
};
