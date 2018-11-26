"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs = require("fs");
const logSymbols = require("log-symbols");
const path = require("path");
const yeoman = require("yeoman-environment");
const Generator = require("yeoman-generator");
const scaffold_1 = require("./scaffold");
const DEFAULT_WEBPACK_CONFIG_FILENAME = "webpack.config.js";
/**
 *
 * Looks up the webpack.config in the user's path and runs a given
 * generator scaffold followed up by a transform
 *
 * @param {String} action — action to be done (add, remove, update, init)
 * @param {Class} generator - Yeoman generator class
 * @param {String} configFile - Name of the existing/default webpack configuration file
 * @param {Array} packages - List of packages to resolve
 * @returns {Function} runTransform - Returns a transformation instance
 */
function modifyHelperUtil(action, generator, configFile = DEFAULT_WEBPACK_CONFIG_FILENAME, packages) {
    let configPath = null;
    if (action !== "init") {
        configPath = path.resolve(process.cwd(), configFile);
        const webpackConfigExists = fs.existsSync(configPath);
        if (webpackConfigExists) {
            process.stdout.write("\n" +
                logSymbols.success +
                chalk_1.default.green(" SUCCESS ") +
                "Found config " +
                chalk_1.default.cyan(configFile + "\n") +
                "\n");
        }
        else {
            process.stdout.write("\n" +
                logSymbols.error +
                chalk_1.default.red(" ERROR ") +
                chalk_1.default.cyan(configFile) +
                " not found. Please specify a valid path to your webpack config like " +
                chalk_1.default.white("$ ") +
                chalk_1.default.cyan(`webpack-cli ${action} webpack.dev.js`) +
                "\n");
            return;
        }
    }
    const env = yeoman.createEnv("webpack", null);
    const generatorName = `webpack-${action}-generator`;
    if (!generator) {
        generator = class extends Generator {
            initializing() {
                packages.forEach((pkgPath) => {
                    return this.composeWith(require.resolve(pkgPath));
                });
            }
        };
    }
    env.registerStub(generator, generatorName);
    env.run(generatorName).then((_) => {
        let configModule;
        try {
            const confPath = path.resolve(process.cwd(), ".yo-rc.json");
            configModule = require(confPath);
            // Change structure of the config to be transformed
            const tmpConfig = {};
            Object.keys(configModule).forEach((prop) => {
                const configs = Object.keys(configModule[prop].configuration);
                configs.forEach((conf) => {
                    tmpConfig[conf] = configModule[prop].configuration[conf];
                });
            });
            configModule = tmpConfig;
        }
        catch (err) {
            console.error(chalk_1.default.red("\nCould not find a yeoman configuration file.\n"));
            console.error(chalk_1.default.red("\nPlease make sure to use 'this.config.set('configuration', this.configuration);' at the end of the generator.\n"));
            Error.stackTraceLimit = 0;
            process.exitCode = -1;
        }
        const transformConfig = Object.assign({
            configFile: !configPath ? null : fs.readFileSync(configPath, "utf8"),
            configPath,
        }, configModule);
        return scaffold_1.default(transformConfig, action);
    }).catch((err) => {
        console.error(chalk_1.default.red("\nUnexpected Error, please file an issue to https://github.com/webpack/webpack-cli\n"));
        console.error(err);
    });
}
exports.default = modifyHelperUtil;
