"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jscodeshift = require("jscodeshift");
const pEachSeries = require("p-each-series");
const pLazy = require("p-lazy");
const bannerPlugin_1 = require("./bannerPlugin/bannerPlugin");
const commonsChunkPlugin_1 = require("./commonsChunkPlugin/commonsChunkPlugin");
const extractTextPlugin_1 = require("./extractTextPlugin/extractTextPlugin");
const loaderOptionsPlugin_1 = require("./loaderOptionsPlugin/loaderOptionsPlugin");
const loaders_1 = require("./loaders/loaders");
const noEmitOnErrorsPlugin_1 = require("./noEmitOnErrorsPlugin/noEmitOnErrorsPlugin");
const removeDeprecatedPlugins_1 = require("./removeDeprecatedPlugins/removeDeprecatedPlugins");
const removeJsonLoader_1 = require("./removeJsonLoader/removeJsonLoader");
const resolve_1 = require("./resolve/resolve");
const uglifyJsPlugin_1 = require("./uglifyJsPlugin/uglifyJsPlugin");
const transformsObject = {
    loadersTransform: loaders_1.default,
    resolveTransform: resolve_1.default,
    removeJsonLoaderTransform: removeJsonLoader_1.default,
    uglifyJsPluginTransform: uglifyJsPlugin_1.default,
    loaderOptionsPluginTransform: loaderOptionsPlugin_1.default,
    bannerPluginTransform: bannerPlugin_1.default,
    extractTextPluginTransform: extractTextPlugin_1.default,
    noEmitOnErrorsPluginTransform: noEmitOnErrorsPlugin_1.default,
    removeDeprecatedPluginsTransform: removeDeprecatedPlugins_1.default,
    commonsChunkPluginTransform: commonsChunkPlugin_1.default
};
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
exports.transformSingleAST = (ast, source, transformFunction) => {
    return new pLazy((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(transformFunction(jscodeshift, ast, source));
            }
            catch (err) {
                reject(err);
            }
        }, 0);
    });
};
exports.transformations = Object.keys(transformsObject).reduce((res, key) => {
    res[key] = (ast, source) => exports.transformSingleAST(ast, source, transformsObject[key]);
    return res;
}, {});
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
exports.transform = (source, transforms, options) => {
    const ast = jscodeshift(source);
    const recastOptions = Object.assign({
        quote: "single"
    }, options);
    transforms = transforms || Object.keys(exports.transformations).map((k) => exports.transformations[k]);
    return pEachSeries(transforms, (f) => f(ast, source))
        .then(() => {
        return ast.toSource(recastOptions);
    })
        .catch((err) => {
        console.error(err);
    });
};
//# sourceMappingURL=migrate.js.map