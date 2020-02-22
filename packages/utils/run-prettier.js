"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs = require("fs");
const prettier = require("prettier");
/**
 *
 * Runs prettier and later prints the output configuration
 *
 * @param {String} outputPath - Path to write the config to
 * @param {Node} source - AST to write at the given path
 * @param {Function} cb - executes a callback after execution if supplied
 * @returns {Void} Writes a file at given location and prints messages accordingly
 */
function runPrettier(outputPath, source, cb) {
    function validateConfig() {
        let prettySource;
        let error;
        try {
            prettySource = prettier.format(source, {
                filepath: outputPath,
                parser: "babel",
                singleQuote: true,
                tabWidth: 1,
                useTabs: true
            });
        }
        catch (err) {
            process.stdout.write(`\n${chalk_1.default.yellow(`WARNING: Could not apply prettier to ${outputPath}` +
                " due validation error, but the file has been created\n")}`);
            prettySource = source;
            error = err;
        }
        if (cb) {
            return cb(error);
        }
        return fs.writeFileSync(outputPath, prettySource, "utf8");
    }
    return fs.writeFile(outputPath, source, "utf8", validateConfig);
}
exports.default = runPrettier;
//# sourceMappingURL=run-prettier.js.map