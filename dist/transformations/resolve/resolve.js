//      
// eslint-disable-next-line node/no-unsupported-features
             
             
       
           
                   
                 
                     

module.exports = function transformer(j             , ast          ) {
	const getRootVal = (
		p                                     
	)                              => {
		return p.node.value.properties.filter(prop => prop.key.name === "root")[0];
	};

	const getRootIndex = p => {
		return p.node.value.properties.reduce((rootIndex, prop, index) => {
			return prop.key.name === "root" ? index : rootIndex;
		}, -1);
	};

	const isModulePresent = (p                                     ) => {
		const modules = p.node.value.properties.filter(
			prop => prop.key.name === "modules"
		);
		return modules.length > 0 && modules[0];
	};

	const createModuleArray = (
		p                                     
	)                                      => {
		const rootVal = getRootVal(p);
		let modulesVal = null;
		if (rootVal.value.type === "ArrayExpression") {
			modulesVal = rootVal.value.elements;
		} else {
			modulesVal = [rootVal.value];
		}
		let module = isModulePresent(p);

		if (!module) {
			module = j.property(
				"init",
				j.identifier("modules"),
				j.arrayExpression(modulesVal)
			);
			p.node.value.properties = p.node.value.properties.concat([module]);
		} else {
			module.value.elements = module.value.elements.concat(modulesVal);
		}
		const rootIndex = getRootIndex(p);
		p.node.value.properties.splice(rootIndex, 1);
		return p;
	};

	return ast
		.find(j.Property)
		.filter((p                                     ) => {
			return (
				p.node.key.name === "resolve" &&
				p.node.value.properties.filter(prop => prop.key.name === "root")
					.length === 1
			);
		})
		.forEach(createModuleArray);
};
