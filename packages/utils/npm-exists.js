"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const got = require("got");
// TODO: to understand the type
// eslint-disable-next-line
const constant = (value) => (res) => value;
/**
 *
 * Checks if the given dependency/module is registered on npm
 *
 * @param {String} moduleName - The dependency to be checked
 * @returns {Promise} constant - Returns either true or false,
 * based on if it exists or not
 */
// TODO: figure out the correct type here
// eslint-disable-next-line
function npmExists(moduleName) {
    const hostname = "https://www.npmjs.org";
    const pkgUrl = `${hostname}/package/${moduleName}`;
    return got(pkgUrl, {
        method: "HEAD"
    })
        .then(constant(true))
        .catch(constant(false));
}
exports.default = npmExists;
//# sourceMappingURL=npm-exists.js.map