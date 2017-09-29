import path from 'path';
import webpack from 'webpack';
import Promise from 'bluebird';
import MemoryFs from 'memory-fs';

const fs = new MemoryFs();
const unitTestFixtures = path.resolve(__dirname, 'fixtures');

/**
 *
 *
 * @param {string} fixtureName
 * @param {string} [withQueryString='']
 * @returns {string} Absolute path of a file with query that is to be run by a loader.
 */
function getFixtureResource(fixtureName, withQueryString = '') {
	return `${getFixture(fixtureName)}?${withQueryString}`;
}

/**
 *
 *
 * @param {string} fixtureName
 * @returns {string} Absolute path of a file with query that is to be run by a loader.
 */
function getFixture(fixtureName) {
	return path.resolve(unitTestFixtures, `${fixtureName}.js`);
}

/**
 *
 *
 * @param {Object} withOptions - Loader Options
 * @returns {{loader: string, options: Object}}
 */
function getLoader(withOptions) {
	return [{ loader: path.resolve(__dirname, '../dist/index.js'), options: withOptions }];
}

/**
 *
 *
 * @param {string} exampleName
 * @returns {Object|Array} - Returns an object or array of objects representing the webpack configuration options
 */
function getExampleConfig(exampleName) {
	return require(`../examples/${exampleName}/webpack.config.js`);
}

/**
 *
 *
 * @param {string} exampleName - name of example inside of examples folder
 * @returns
 */
async function runWebpackExampleInMemory(exampleName) {
	const webpackConfig = getExampleConfig(exampleName);
	const compiler = webpack(webpackConfig);

	compiler.outputFileSystem = fs;

	const run = Promise.promisify(compiler.run, { context: compiler });
	const stats = await run();


	const { compilation } = stats;
	const { errors, warnings, assets, entrypoints, chunks, modules } = compilation;
	const statsJson = stats.toJson();

	return {
		assets,
		entrypoints,
		errors,
		warnings,
		stats,
		chunks,
		modules,
		statsJson,
	};
}

export { getExampleConfig, runWebpackExampleInMemory, fs, getFixtureResource, getLoader, getFixture };
