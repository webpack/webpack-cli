"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
/**
 * Takes in a file path in the `./templates` directory. Copies that
 * file to the destination, with the `.tpl` extension stripped.
 *
 * @param {Generator} generator A Yeoman Generator instance
 * @param {string} templateDir Absolute path to template directory
 * @returns {Function} A curried function that takes a file path and copies it
 */
exports.generatorCopy = (generator, templateDir) => (filePath) => {
    const sourceParts = templateDir.split(path.delimiter);
    sourceParts.push(...filePath.split("/"));
    const targetParts = path.dirname(filePath).split("/");
    targetParts.push(path.basename(filePath, ".tpl"));
    generator.fs.copy(path.join(...sourceParts), generator.destinationPath(path.join.apply(null, targetParts)));
};
/**
 * Takes in a file path in the `./templates` directory. Copies that
 * file to the destination, with the `.tpl` extension and `_` prefix
 * stripped. Passes `this.props` to the template.
 *
 * @param {Generator} generator A Yeoman Generator instance
 * @param {string} templateDir Absolute path to template directory
 * @param {any} templateData An object containing the data passed to
 * the template files.
 * @returns {Function} A curried function that takes a file path and copies it
 */
exports.generatorCopyTpl = (generator, templateDir, templateData) => (filePath) => {
    const sourceParts = templateDir.split(path.delimiter);
    sourceParts.push(...filePath.split("/"));
    const targetParts = path.dirname(filePath).split("/");
    targetParts.push(path.basename(filePath, ".tpl").slice(1));
    generator.fs.copyTpl(path.join(...sourceParts), generator.destinationPath(path.join.apply(null, targetParts)), templateData);
};
//# sourceMappingURL=copy-utils.js.map