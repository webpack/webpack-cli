import * as jscodeshift from "jscodeshift";
import pEachSeries = require("p-each-series");
import pLazy = require("p-lazy");

import bannerPluginTransform from "./bannerPlugin/bannerPlugin";
import commonsChunkPluginTransform from "./commonsChunkPlugin/commonsChunkPlugin";
import extractTextPluginTransform from "./extractTextPlugin/extractTextPlugin";
import loaderOptionsPluginTransform from "./loaderOptionsPlugin/loaderOptionsPlugin";
import loadersTransform from "./loaders/loaders";
import noEmitOnErrorsPluginTransform from "./noEmitOnErrorsPlugin/noEmitOnErrorsPlugin";
import removeDeprecatedPluginsTransform from "./removeDeprecatedPlugins/removeDeprecatedPlugins";
import removeJsonLoaderTransform from "./removeJsonLoader/removeJsonLoader";
import resolveTransform from "./resolve/resolve";
import uglifyJsPluginTransform from "./uglifyJsPlugin/uglifyJsPlugin";

interface TransformsObject {
	bannerPluginTransform: object;
	commonsChunkPluginTransform?: object;
	extractTextPluginTransform: object;
	loaderOptionsPluginTransform: object;
	loadersTransform: object;
	noEmitOnErrorsPluginTransform: object;
	removeDeprecatedPluginsTransform: object;
	removeJsonLoaderTransform: object;
	resolveTransform: object;
	uglifyJsPluginTransform: object;
}

const transformsObject: TransformsObject = {
	loadersTransform,
	resolveTransform,
	removeJsonLoaderTransform,
	uglifyJsPluginTransform,
	loaderOptionsPluginTransform,
	bannerPluginTransform,
	extractTextPluginTransform,
	noEmitOnErrorsPluginTransform,
	removeDeprecatedPluginsTransform,
	commonsChunkPluginTransform
};

interface LazyTransformObject {
	loadersTransform?: (ast: object, source: string) => pLazy<{}>;
	resolveTransform?: (ast: object, source: string) => pLazy<{}>;
	removeJsonLoaderTransform?: (ast: object, source: string) => pLazy<{}>;
	uglifyJsPluginTransform?: (ast: object, source: string) => pLazy<{}>;
	loaderOptionsPluginTransform?: (ast: object, source: string) => pLazy<{}>;
	bannerPluginTransform?: (ast: object, source: string) => pLazy<{}>;
	extractTextPluginTransform?: (ast: object, source: string) => pLazy<{}>;
	noEmitOnErrorsPluginTransform?: (ast: object, source: string) => pLazy<{}>;
	removeDeprecatedPluginsTransform?: (ast: object, source: string) => pLazy<{}>;
	commonsChunkPluginTransform?: (ast: object, source: string) => pLazy<{}>;
}

/**
 *
 * Transforms single AST based on given transform function
 * and returns back a promise with resolved transformation
 *
 * @param {Object} ast - AST object
 * @param {String} source - source string
 * @param {Function} transformFunction - Transformation function with source object
 * @returns {Object} pLazy promise with resolved transform function
 */

export const transformSingleAST = (
	ast: object,
	source: string,
	transformFunction: (jscodeshift: object, ast: object, source: string) => object
): pLazy<{}> => {
	return new pLazy((resolve: (value?: {} | PromiseLike<{}>) => void, reject: (reason?: object) => void): void => {
		setTimeout((): void => {
			try {
				resolve(transformFunction(jscodeshift, ast, source));
			} catch (err) {
				reject(err);
			}
		}, 0);
	});
};

export const transformations: LazyTransformObject = Object.keys(transformsObject).reduce(
	(res: object, key: string): LazyTransformObject => {
		res[key] = (ast: object, source: string): object => transformSingleAST(ast, source, transformsObject[key]);
		return res;
	},
	{}
);

/**
 *
 * Transforms a given piece of source code by applying selected transformations to the AST.
 * By default, transforms a webpack version 1 configuration file into a webpack version 2
 * configuration file.
 *
 * @param {String} source - source file contents
 * @param {Function[]} [transforms] - List of transformation functions, defined in the
 * order to apply them in. By default, all defined transformations.
 * @param {Object} [options] - recast formatting options
 * @returns {Promise} promise functions for series
 */

export const transform = (
	source: string,
	transforms?: Iterable<Function | PromiseLike<Function>>,
	options?: object
): Promise<string | void> => {
	const ast = jscodeshift(source);
	const recastOptions: object = Object.assign(
		{
			quote: "single"
		},
		options
	);
	transforms = transforms || Object.keys(transformations).map((k: string): Function => transformations[k]);

	return pEachSeries(transforms, (f: Function): void => f(ast, source))
		.then((): string | PromiseLike<string> => {
			return ast.toSource(recastOptions);
		})
		.catch((err: object): void => {
			console.error(err);
		});
};
