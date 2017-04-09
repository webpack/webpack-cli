const fs = require('fs');
const chalk = require('chalk');
const validateSchema = require('../../utils/validateSchema.js');
const webpackOptionsSchema = require('../../utils/webpackOptionsSchema.json');
const WebpackOptionsValidationError = require('../../utils/WebpackOptionsValidationError');
const j = require('jscodeshift');
const pEachSeries = require('p-each-series');
const entryTransform = require('./entry/entry');
const outputTransform = require('./output/output');
const contextTransform = require('./context/context');
const resolveTransform = require('./resolve/resolve');
const devtoolTransform = require('./devtool/devtool');
const targetTransform = require('./target/target');
const watchTransform = require('./watch/watch');
const watchOptionsTransform = require('./watch/watchOptions');
const externalsTransform = require('./externals/externals');

/*
* @function runTransform
*
* Runs the transformations from an object we get from yeoman
*
* @param { Object } transformObject - Options to transform
* @returns { <Void> } TODO
*/

const transformsObject = {
	entryTransform,
	outputTransform,
	contextTransform,
	resolveTransform,
	devtoolTransform,
	targetTransform,
	watchTransform,
	watchOptionsTransform,
	externalsTransform
};

module.exports = function runTransform(yeomanConfig) {
	const transformations = Object.keys(transformsObject).map(k => transformsObject[k]);

	if (yeomanConfig.webpackOptions) {
		let ast = j('module.exports = {}');
		return pEachSeries(transformations, f => f(j, ast, yeomanConfig.webpackOptions))
			.then(() => {
				const recastOptions = {
					quote: 'single'
				};
				const outputPath = process.cwd() + '/webpack.config.js';
				const source = ast.toSource(recastOptions);
				fs.writeFileSync(outputPath, source, 'utf-8');
			})
			.catch(err => {
				console.error(err);
			});
	}
		/*
		const webpackOptionsValidationErrors = validateSchema(webpackOptionsSchema, initialWebpackConfig);
		if (webpackOptionsValidationErrors.length) {
			throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
		} else {
			process.stdout.write('\n' + chalk.green('Congratulations! Your new webpack config file is created!') + '\n');
		}
		*/
};
