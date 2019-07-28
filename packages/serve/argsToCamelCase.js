"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * Converts dash-seperated strings to camel case
 *
 * @param {String} str - the string to convert
 *
 * @returns {String} - new camel case string
 */
function dashesToCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
/**
 *
 * Converts CLI args to camel case from dash-separated words
 *
 * @param {Object} args - argument object parsed by command-line-args
 *
 * @returns {Object} - the same args object as passed in, with new keys
 */
function argsToCamelCase(args) {
    Object.keys(args).forEach((key) => {
        const newKey = dashesToCamelCase(key);
        if (key !== newKey) {
            const arg = args[key];
            delete args[key];
            args[newKey] = arg;
        }
    });
    return args;
}
exports.default = argsToCamelCase;
//# sourceMappingURL=argsToCamelCase.js.map