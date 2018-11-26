"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_utils_1 = require("@webpack-cli/utils/ast-utils");
/**
 *
 * Transform for CommonsChunkPlugin. If found, removes the
 * plugin and sets optimizations.namedModules to true
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
function default_1(j, ast) {
    const splitChunksProps = [];
    const cacheGroupsProps = [];
    const optimizationProps = {};
    let commonCacheGroupsProps = [
        ast_utils_1.createProperty(j, "chunks", "initial"),
        ast_utils_1.createProperty(j, "enforce", true),
    ];
    // find old options
    const CommonsChunkPlugin = ast_utils_1.findPluginsByName(j, ast, [
        "webpack.optimize.CommonsChunkPlugin",
    ]);
    if (!CommonsChunkPlugin.size()) {
        return ast;
    }
    // cache group options based on keys
    let cacheGroup = {};
    let cacheGroups = [];
    // iterate each CommonsChunkPlugin instance
    CommonsChunkPlugin.forEach((path) => {
        const CCPProps = path.value.arguments[0].properties;
        // reset chunks from old props
        cacheGroup = {};
        cacheGroups = [];
        commonCacheGroupsProps = [
            ast_utils_1.createProperty(j, "chunks", "initial"),
            ast_utils_1.createProperty(j, "enforce", true),
        ];
        let chunkKey;
        let chunkCount = 0;
        // iterate CCP props and map SCP props
        CCPProps.forEach((p) => {
            const propKey = p.key.name;
            switch (propKey) {
                case "names":
                    p.value.elements.forEach(({ value: chunkValue }) => {
                        if (chunkValue === "runtime") {
                            optimizationProps["runtimeChunk"] = j.objectExpression([
                                ast_utils_1.createProperty(j, "name", chunkValue),
                            ]);
                        }
                        else {
                            if (!Array.isArray(cacheGroup[chunkValue])) {
                                cacheGroup[chunkValue] = [];
                            }
                            ast_utils_1.findRootNodesByName(j, ast, "entry").forEach(({ value: { value: { properties: entries } } }) => {
                                chunkCount = entries.length;
                                entries.forEach(({ key: { name: entryName } }) => {
                                    if (entryName === chunkValue) {
                                        cacheGroup[chunkValue].push(ast_utils_1.createProperty(j, "test", entryName));
                                    }
                                });
                            });
                        }
                    });
                    break;
                case "name":
                    const nameKey = p.value.value;
                    if (nameKey === "runtime") {
                        optimizationProps["runtimeChunk"] = j.objectExpression([
                            ast_utils_1.createProperty(j, "name", nameKey),
                        ]);
                    }
                    else {
                        chunkKey = nameKey;
                        if (!Array.isArray(cacheGroup[nameKey])) {
                            cacheGroup[nameKey] = [];
                        }
                        ast_utils_1.findRootNodesByName(j, ast, "entry").forEach(({ value: { value: { properties: entries } } }) => {
                            chunkCount = entries.length;
                            entries.forEach(({ key: { name: entryName } }) => {
                                if (entryName === nameKey) {
                                    cacheGroup[nameKey].push(ast_utils_1.createProperty(j, "test", entryName));
                                }
                            });
                        });
                    }
                    break;
                case "filename":
                    if (chunkKey) {
                        if (!Array.isArray(cacheGroup[chunkKey])) {
                            cacheGroup[chunkKey] = [];
                        }
                        cacheGroup[chunkKey].push(ast_utils_1.createProperty(j, propKey, p.value.value));
                    }
                    break;
                case "async":
                    if (!Array.isArray(cacheGroup[chunkKey])) {
                        cacheGroup[chunkKey] = [];
                    }
                    cacheGroup[chunkKey].push(ast_utils_1.createProperty(j, "chunks", "async"));
                    break;
                case "minSize":
                    if (!Array.isArray(cacheGroup[chunkKey])) {
                        cacheGroup[chunkKey] = [];
                    }
                    cacheGroup[chunkKey].push(j.property("init", ast_utils_1.createIdentifierOrLiteral(j, propKey), p.value));
                    break;
                case "minChunks":
                    const { value: pathValue } = p;
                    // minChunk is a function
                    if (pathValue.type === "ArrowFunctionExpression" ||
                        pathValue.type === "FunctionExpression") {
                        if (!Array.isArray(cacheGroup[chunkKey])) {
                            cacheGroup[chunkKey] = [];
                        }
                        cacheGroup[chunkKey] = cacheGroup[chunkKey].map((prop) => prop.key.name === "test" ? mergeTestPropArrowFunction(j, chunkKey, pathValue) : prop);
                    }
                    break;
            }
        });
        Object.keys(cacheGroup).forEach((chunkName) => {
            let chunkProps = [
                ast_utils_1.createProperty(j, "name", chunkName),
            ];
            const chunkPropsToAdd = cacheGroup[chunkName];
            const chunkPropsKeys = chunkPropsToAdd.map((prop) => prop.key.name);
            commonCacheGroupsProps =
                commonCacheGroupsProps.filter((commonProp) => !chunkPropsKeys.includes(commonProp.key.name));
            chunkProps.push(...commonCacheGroupsProps);
            if (chunkCount > 1) {
                chunkProps.push(j.property("init", ast_utils_1.createIdentifierOrLiteral(j, "minChunks"), ast_utils_1.createIdentifierOrLiteral(j, chunkCount)));
            }
            const chunkPropsContainTest = chunkPropsToAdd.some((prop) => prop.key.name === "test" && prop.value.type === "Literal");
            if (chunkPropsContainTest) {
                chunkProps = chunkProps.filter((prop) => prop.key.name !== "minChunks");
            }
            if (chunkPropsToAdd &&
                Array.isArray(chunkPropsToAdd) &&
                chunkPropsToAdd.length > 0) {
                chunkProps.push(...chunkPropsToAdd);
            }
            cacheGroups.push(j.property("init", ast_utils_1.createIdentifierOrLiteral(j, chunkName), j.objectExpression([...chunkProps])));
        });
        if (cacheGroups.length > 0) {
            cacheGroupsProps.push(...cacheGroups);
        }
    });
    // Remove old plugin
    const root = ast_utils_1.findAndRemovePluginByName(j, ast, "webpack.optimize.CommonsChunkPlugin");
    const rootProps = [...splitChunksProps];
    if (cacheGroupsProps.length > 0) {
        rootProps.push(j.property("init", ast_utils_1.createIdentifierOrLiteral(j, "cacheGroups"), j.objectExpression([...cacheGroupsProps])));
    }
    // Add new optimizations splitChunks option
    if (root) {
        ast_utils_1.addOrUpdateConfigObject(j, root, "optimizations", "splitChunks", j.objectExpression([...rootProps]));
        Object.keys(optimizationProps).forEach((key) => {
            ast_utils_1.addOrUpdateConfigObject(j, root, "optimizations", key, optimizationProps[key]);
        });
    }
    return ast;
}
exports.default = default_1;
// merge test entry prop and function expression. case 6[x]
const mergeTestPropArrowFunction = (j, chunkKey, testFunc) => {
    return j.property("init", ast_utils_1.createIdentifierOrLiteral(j, "test"), j.arrowFunctionExpression([j.identifier("module")], j.blockStatement([
        j.ifStatement(j.callExpression(j.memberExpression(j.callExpression(j.memberExpression(j.identifier("module"), j.identifier("getChunks")), []), j.identifier("some"), false), [j.arrowFunctionExpression([j.identifier("chunk")], j.binaryExpression("===", j.memberExpression(j.identifier("chunk"), j.identifier("name")), j.literal(chunkKey)))]), j.returnStatement(j.literal(true))),
        j.variableDeclaration("const", [j.variableDeclarator(j.identifier("fn"), testFunc)]),
        j.returnStatement(j.callExpression(j.identifier("fn"), [j.identifier("module")])),
    ])));
};
