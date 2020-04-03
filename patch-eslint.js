const path = require('path');
const fs = require('fs');

fs.writeFileSync(
    path.resolve('./node_modules/eslint-plugin-node/lib/util/check-existence.js'),
    `
/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const exists = require("./exists")
const getAllowModules = require("./get-allow-modules")

/**
 * Checks whether or not each requirement target exists.
 *
 * It looks up the target according to the logic of Node.js.
 * See Also: https://nodejs.org/api/modules.html
 *
 * @param {RuleContext} context - A context to report.
 * @param {ImportTarget[]} targets - A list of target information to check.
 * @returns {void}
 */
module.exports = function checkForExistence(context, targets) {
    const allowed = new Set(getAllowModules(context))

    for (const target of targets) {
        const missingModule =
            target.moduleName != null &&
            !allowed.has(target.moduleName) &&
            target.filePath == null
        const missingFile =
            target.moduleName == null && !exists(target.filePath)

        console.log('---Start---');
        console.log(target.moduleName);
        console.log(target.filePath);
        console.log('---End---');

        if (missingModule || missingFile) {
            context.report({
                node: target.node,
                loc: target.node.loc,
                message: '"{{name}}" is not found.',
                data: target,
            })
        }
    }
}

`,
);
