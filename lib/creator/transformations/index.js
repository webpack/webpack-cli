const fs = require('fs');
const chalk = require('chalk');
const spawn = require('cross-spawn');
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
const nodeTransform = require('./node/node');
const performanceTransform = require('./performance/performance');
const statsTransform = require('./stats/stats');
const amdTransform = require('./other/amd');
const bailTransform = require('./other/bail');
const cacheTransform = require('./other/cache');
const profileTransform = require('./other/profile');
const mergeTransform = require('./other/merge');
const moduleTransform = require('./module/module');
const pluginsTransform = require('./plugins/plugins');
const topScopeTransform = require('./top-scope/top-scope');

/*
* @function runTransform
*
* Runs the transformations from an object we get from yeoman
*
* @param { Object } transformObject - Options to transform
* @returns { <Promise> } - A promise that writes each transform, runs prettier
* and writes the file
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
	externalsTransform,
	nodeTransform,
	performanceTransform,
	statsTransform,
	amdTransform,
	bailTransform,
	cacheTransform,
	profileTransform,
	moduleTransform,
	pluginsTransform,
	topScopeTransform,
	mergeTransform
};

module.exports = function runTransform(webpackProperties) {
	Object.keys(webpackProperties).forEach( (scaffoldPiece) => {
		const config = webpackProperties[scaffoldPiece];
		const transformations = Object.keys(transformsObject).map(k => {
			const stringVal = k.substr(0, k.indexOf('Transform'));
			if(config.webpackOptions[stringVal]) {
				return [transformsObject[k], config.webpackOptions[stringVal]];
			} else {
				return [transformsObject[k], config[stringVal]];
			}
		});
		let ast = j('module.exports = {}');
		return pEachSeries(transformations, f => {
			return f[0](j, ast, f[1]);
		})
		.then(() => {

			const outputPath = process.cwd() + '/webpack.' + (config.configName ? config.configName : 'config') + '.js';
			const source = ast.toSource({
				quote: 'single'
			});
			const runPrettier = () => {
				const processPromise = (child) => {
					return new Promise(function(resolve, reject) { //eslint-disable-line
						child.addListener('error', reject);
						child.addListener('exit', resolve);
					});
				};
				const spawnPrettier = () => {
					console.log('\n');
					return spawn(
						'prettier', ['--single-quote', '--trailing-comma es5', '--write', outputPath],
						{ stdio: 'inherit', customFds: [0, 1, 2] }
					);
				};
				processPromise(spawnPrettier()).then( () => {
					try {
						const webpackOptionsValidationErrors = validateSchema(webpackOptionsSchema, require(outputPath));
						if (webpackOptionsValidationErrors.length) {
							const errorMsg = new WebpackOptionsValidationError(webpackOptionsValidationErrors);
							throw errorMsg.message;
						} else {
							process.stdout.write('\n' + chalk.green(
								'Congratulations! Your new webpack config file is created!'
							) + '\n');
							process.exit(0);
						}
					} catch(err) {
						console.log('\n');
						console.error(err);
						process.exit(-1);
					}
				});
			};
			fs.writeFile(outputPath, source, 'utf8', runPrettier);
		}).catch(err => {
			console.error(err);
		});
	});
};
