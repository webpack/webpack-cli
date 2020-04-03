const path = require('path');
const fs = require('fs');

fs.writeFileSync(
    path.resolve('./node_modules/eslint-plugin-node/lib/util/import-target.js'),
    `
/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const resolve = require("resolve")

/**
 * Resolve the given id to file paths.
 * @param {boolean} isModule The flag which indicates this id is a module.
 * @param {string} id The id to resolve.
 * @param {object} options The options of node-resolve module.
 * It requires \`options.basedir\`.
 * @returns {string|null} The resolved path.
 */
function getFilePath(isModule, id, options) {
    try {
        console.log(id);
        console.log(options);
        console.log('File path: ' + resolve.sync(id, options))
        return resolve.sync(id, options);
    } catch (_err) {
        console.log(_err);

        if (isModule) {
            return null
        }
        return path.resolve(options.basedir, id)
    }
}

/**
 * Gets the module name of a given path.
 *
 * e.g. \`eslint/lib/ast-utils\` -> \`eslint\`
 *
 * @param {string} nameOrPath - A path to get.
 * @returns {string} The module name of the path.
 */
function getModuleName(nameOrPath) {
    let end = nameOrPath.indexOf("/")
    if (end !== -1 && nameOrPath[0] === "@") {
        end = nameOrPath.indexOf("/", 1 + end)
    }

    return end === -1 ? nameOrPath : nameOrPath.slice(0, end)
}

/**
 * Information of an import target.
 */
module.exports = class ImportTarget {
    /**
     * Initialize this instance.
     * @param {ASTNode} node - The node of a \`require()\` or a module declaraiton.
     * @param {string} name - The name of an import target.
     * @param {object} options - The options of \`node-resolve\` module.
     */
    constructor(node, name, options) {
        const isModule = !/^(?:[./\\\\]|\\w+:)/u.test(name)

        /**
         * The node of a \`require()\` or a module declaraiton.
         * @type {ASTNode}
         */
        this.node = node

        /**
         * The name of this import target.
         * @type {string}
         */
        this.name = name

        /**
         * The full path of this import target.
         * If the target is a module and it does not exist then this is \`null\`.
         * @type {string|null}
         */
        console.log(isModule);
        console.log(name);
        console.log(options);
        this.filePath = getFilePath(isModule, name, options)
        console.log(this.filePath);

        /**
         * The module name of this import target.
         * If the target is a relative path then this is \`null\`.
         * @type {string|null}
         */
        this.moduleName = isModule ? getModuleName(name) : null
    }
}
`,
);
