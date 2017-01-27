module.exports = function(j, ast) {
	function getLoadersPropertyPaths(ast) {
		return ast.find(j.Property, { key: { name: 'use' } });
	}

	function removeLoaderByName(path, name) {
		const loadersNode = path.value.value;
		switch (loadersNode.type) {
		case j.ArrayExpression.name: {
			let loaders = loadersNode.elements.map(p => p.value);
			const loaderIndex = loaders.indexOf(name);
			if (loaders.length && loaderIndex > -1) {
				// Remove loader from the array
				loaders.splice(loaderIndex, 1);
				// and from AST
				loadersNode.elements.splice(loaderIndex, 1);
			}

			// If there is only one element left, convert to string
			if (loaders.length === 1) {
				j(path.get('value')).replaceWith(j.literal(loaders[0]));
			}
			break;
		}
		case j.Literal.name: {
			// If only the loader with the matching name was used
			// we can remove the whole Property node completely
			if (loadersNode.value === name) {
				j(path.parent).remove();
			}
			break;
		}
		}
	}

	function removeLoaders(ast) {
		getLoadersPropertyPaths(ast)
			.forEach(path => removeLoaderByName(path, 'json-loader'));
	}

	const transforms = [
		removeLoaders
	];

	transforms.forEach(t => t(ast));

	return ast.toSource({ quote: 'single' });
};
