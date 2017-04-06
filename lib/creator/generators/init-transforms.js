const j = require('jscodeshift');

module.exports = function (promptOptions) {
	const promptParams = Object.keys(promptOptions);
	if (promptParams && promptParams.length) {
		let ast = j('{}');
		const transforms = initTransforms(promptOptions);
		promptParams.reduce(function(config, param) {
			return transforms[param](j, ast);
		}, {});
		return ast.toSource();
	}
};


function initTransforms (options) {
	return {
		'entry': function (j, ast) {
			const value = options['entry'];
			ast.find(j.Program)
				.replaceWith(() => {
					return j.objectExpression([
						j.property('init', j.literal('entry'), j.literal(value))
					]);
				});
			return ast;
		},
		'output': function (j, ast) {
			const value = options['output'];
			ast.find(j.ObjectExpression)
				.forEach(
					p => p.value.properties.push(
						j.property('init', j.literal('output'),
						j.objectExpression([j.property('init', j.literal('filename'), j.literal(value))])))
				);
			return ast;
		}
	};
}
