"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./ast-utils");
function recursiveTransform(j, ast, key, value, action) {
    if (key === "topScope") {
        if (Array.isArray(value)) {
            return utils.parseTopScope(j, ast, value, action);
        }
        console.error("Error in parsing top scope, Array required");
        return false;
    }
    else if (key === "merge") {
        if (Array.isArray(value)) {
            return utils.parseMerge(j, ast, value, action);
        }
    }
    const node = utils.findRootNodesByName(j, ast, key);
    // get module.exports prop
    const root = ast
        .find(j.ObjectExpression)
        .filter((p) => {
        return (utils.safeTraverse(p, ["parentPath", "value", "left", "object", "name"]) === "module" &&
            utils.safeTraverse(p, ["parentPath", "value", "left", "property", "name"]) === "exports");
    })
        .filter((p) => !!p.value.properties);
    if (node.size() !== 0) {
        if (action === "add") {
            return utils.findRootNodesByName(j, root, key).forEach((p) => {
                j(p).replaceWith(utils.addProperty(j, p, key, value, action));
            });
        }
        else if (action === "remove") {
            return utils.removeProperty(j, root, key, value);
        }
    }
    else {
        return root.forEach((p) => {
            if (value) {
                // init, add new property
                utils.addProperty(j, p, key, value, null);
            }
        });
    }
}
exports.default = recursiveTransform;
//# sourceMappingURL=recursive-parser.js.map