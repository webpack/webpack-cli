const { resolve, join } = require('path');
const { existsSync } = require('fs');

class GroupHelper {
    constructor(options) {
        this.args = this.arrayToObject(options);
        this.opts = {
            outputOptions: {},
            options: {},
            processingMessageBuffer: [],
        };
        this.strategy = undefined;
    }

    hyphenToUpperCase(name) {
        if (!name) {
            return name;
        }
        return name.replace(/-([a-z])/g, function(g) {
            return g[1].toUpperCase();
        });
    }

    arrayToObject(arr) {
        if (!arr) {
            return;
        }
        return arr.reduce((result, currentItem, index) => {
            const key = Object.keys(currentItem)[0];
            result[this.hyphenToUpperCase(key)] = currentItem[key];
            return result;
        }, {});
    }

    // TODO: to re implement
    // loadPlugin(name) {
    //     const loadUtils = require('loader-utils');
    //     let args;
    //     try {
    //         const p = name && name.indexOf('?');
    //         if (p > -1) {
    //             args = loadUtils.parseQuery(name.substring(p));
    //             name = name.substring(0, p);
    //         }
    //     } catch (e) {
    //         console.error('Invalid plugin arguments ' + name + ' (' + e + ').');
    //         process.exit(-1); // eslint-disable-line
    //     }
    //
    //     let path;
    //     try {
    //         const resolve = require('enhanced-resolve');
    //         path = resolve.sync(process.cwd(), name);
    //     } catch (e) {
    //         console.error('Cannot resolve plugin ' + name + '.');
    //         process.exit(-1); // eslint-disable-line
    //     }
    //     let Plugin;
    //     try {
    //         Plugin = require(path);
    //     } catch (e) {
    //         console.error('Cannot load plugin ' + name + '. (' + path + ')');
    //         throw e;
    //     }
    //     try {
    //         return new Plugin(args);
    //     } catch (e) {
    //         console.error('Cannot instantiate plugin ' + name + '. (' + path + ')');
    //         throw e;
    //     }
    // }

    resolveFilePath(filename = '', defaultValue) {
        if (filename && Array.isArray(filename)) {
            return filename.map(fp => this.resolveFilePath(fp, defaultValue)).filter(e => e);
        }
        if (filename && !filename.includes('.js')) {
            filename = filename + '.js';
        }
        if (defaultValue && !defaultValue.includes('.js')) {
            defaultValue = defaultValue + '.js';
        }
        let configPath;
        const predefinedConfigPath = filename ? resolve(process.cwd(), filename) : undefined;
        const configPathExists = predefinedConfigPath ? existsSync(predefinedConfigPath) : undefined;

        if (!configPathExists) {
            const LOOKUP_PATHS = [`${filename}`, `src/${filename}`, defaultValue, `src/${defaultValue}`];
            if (filename) {
                LOOKUP_PATHS.unshift(filename);
            }
            LOOKUP_PATHS.forEach(p => {
                const lookUpPath = join(process.cwd(), ...p.split('/'));
                if (existsSync(lookUpPath) && !configPath) {
                    configPath = lookUpPath;
                }
            });
        }
        return configPathExists ? predefinedConfigPath : configPath;
    }

    run() {
        throw new Error('You must implement the "run" function');
    }
}

module.exports = GroupHelper;
