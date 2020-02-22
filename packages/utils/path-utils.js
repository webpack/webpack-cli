"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findup = require("findup-sync");
const fs = require("fs");
const path = require("path");
/**
 * Attempts to detect whether the string is a local path regardless of its
 * existence by checking its format. The point is to distinguish between
 * paths and modules on the npm registry. This will fail for non-existent
 * local Windows paths that begin with a drive letter, e.g. C:..\generator.js,
 * but will succeed for any existing files and any absolute paths.
 *
 * @param {String} str - string to check
 * @returns {Boolean} whether the string could be a path to a local file or directory
 */
function isLocalPath(str) {
    return path.isAbsolute(str) || /^\./.test(str) || fs.existsSync(str);
}
exports.isLocalPath = isLocalPath;
/**
 * Find the root directory path of a project.
 *
 * @returns {String} Absolute path of the project root.
 */
function findProjectRoot() {
    const rootFilePath = findup("package.json");
    const projectRoot = path.dirname(rootFilePath);
    return projectRoot;
}
exports.findProjectRoot = findProjectRoot;
//# sourceMappingURL=path-utils.js.map