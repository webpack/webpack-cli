"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const diff = require("diff");
const fs = require("fs");
const inquirer = require("inquirer");
const Listr = require("listr");
const pLazy = require("p-lazy");
const path = require("path");
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const webpack_1 = require("webpack");
const run_prettier_1 = require("@webpack-cli/utils/run-prettier");
const migrate_1 = require("./migrate");
const jscodeshift = require("jscodeshift");
/**
 *
 * Runs migration on a given configuration using AST's and promises
 * to sequentially transform a configuration file.
 *
 * @param {String} currentConfigPath - input path for config
 * @param {String} outputConfigPath - output path for config
 * @returns {Promise} Runs the migration using a promise that
 * will throw any errors during each transform or output if the
 * user decides to abort the migration
 */
function runMigration(currentConfigPath, outputConfigPath) {
    const recastOptions = {
        quote: "single"
    };
    const tasks = new Listr([
        {
            task: (ctx) => new pLazy((resolve, reject) => {
                fs.readFile(currentConfigPath, "utf8", (err, content) => {
                    if (err) {
                        reject(err);
                    }
                    try {
                        ctx.source = content;
                        ctx.ast = jscodeshift(content);
                        resolve();
                    }
                    catch (err) {
                        reject("Error generating AST", err);
                    }
                });
            }),
            title: "Reading webpack config"
        },
        {
            task: (ctx) => {
                return new Listr(Object.keys(migrate_1.transformations).map((key) => {
                    const transform = migrate_1.transformations[key];
                    return {
                        task: () => transform(ctx.ast, ctx.source),
                        title: key
                    };
                }));
            },
            title: "Migrating config to newest version"
        }
    ]);
    tasks
        .run()
        .then((ctx) => {
        const result = ctx.ast.toSource(recastOptions);
        const diffOutput = diff.diffLines(ctx.source, result);
        diffOutput.forEach((diffLine) => {
            if (diffLine.added) {
                process.stdout.write(chalk_1.default.green(`+ ${diffLine.value}`));
            }
            else if (diffLine.removed) {
                process.stdout.write(chalk_1.default.red(`- ${diffLine.value}`));
            }
        });
        return inquirer
            .prompt([
            {
                default: "Y",
                message: "Are you sure these changes are fine?",
                name: "confirmMigration",
                type: "confirm"
            }
        ])
            .then((answers) => {
            if (answers.confirmMigration) {
                return inquirer.prompt([
                    {
                        default: "Y",
                        message: "Do you want to validate your configuration? " +
                            "(If you're using webpack merge, validation isn't useful)",
                        name: "confirmValidation",
                        type: "confirm"
                    }
                ]);
            }
            else {
                console.error(chalk_1.default.red("✖ Migration aborted"));
            }
        })
            .then((answer) => __awaiter(this, void 0, void 0, function* () {
            if (!answer) {
                return;
            }
            run_prettier_1.default(outputConfigPath, result, (err) => {
                if (err) {
                    throw err;
                }
            });
            if (answer.confirmValidation) {
                const outputPath = yield Promise.resolve().then(() => require(outputConfigPath));
                const webpackOptionsValidationErrors = webpack_1.validate(outputPath);
                if (webpackOptionsValidationErrors.length) {
                    console.error(chalk_1.default.red("\n✖ Your configuration validation wasn't successful \n"));
                    console.error(new webpack_1.WebpackOptionsValidationError(webpackOptionsValidationErrors).message);
                }
            }
            console.info(chalk_1.default.green(`\n✔︎ New webpack config file is at ${outputConfigPath}.`));
            console.info(chalk_1.default.green("✔︎ Heads up! Updating to the latest version could contain breaking changes."));
            console.info(chalk_1.default.green("✔︎ Plugin and loader dependencies may need to be updated."));
        }));
    })
        .catch((err) => {
        const errMsg = "\n ✖ ︎Migration aborted due to some errors: \n";
        console.error(chalk_1.default.red(errMsg));
        console.error(err);
        process.exitCode = 1;
    });
}
/**
 *
 * Runs migration on a given configuration using AST's and promises
 * to sequentially transform a configuration file.
 *
 * @param {Array} args - Migrate arguments such as input and
 * output path
 * @returns {Function} Runs the migration using the 'runMigrate'
 * function.
 */
function migrate(...args) {
    const filePaths = args;
    if (!filePaths.length) {
        const errMsg = "\n ✖ Please specify a path to your webpack config \n ";
        console.error(chalk_1.default.red(errMsg));
        return;
    }
    const currentConfigPath = path.resolve(process.cwd(), filePaths[0]);
    let outputConfigPath;
    if (!filePaths[1]) {
        return inquirer
            .prompt([
            {
                default: "Y",
                message: "Migration output path not specified. " +
                    "Do you want to use your existing webpack " +
                    "configuration?",
                name: "confirmPath",
                type: "confirm"
            }
        ])
            .then((ans) => {
            if (!ans.confirmPath) {
                console.error(chalk_1.default.red("✖ ︎Migration aborted due no output path"));
                return;
            }
            outputConfigPath = path.resolve(process.cwd(), filePaths[0]);
            return runMigration(currentConfigPath, outputConfigPath);
        })
            .catch((err) => {
            console.error(err);
        });
    }
    outputConfigPath = path.resolve(process.cwd(), filePaths[1]);
    return runMigration(currentConfigPath, outputConfigPath);
}
exports.default = migrate;
//# sourceMappingURL=index.js.map