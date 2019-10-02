const { resolve, join } = require('path');
const { existsSync } = require('fs');

const parseAndValidatedFilename = pathToResolve => {
    const pathToArray = pathToResolve.split('/');
    let pathBeforeFileName;
    let fileName = pathToArray[pathToArray.length - 1];
    const isLastNameAFile = existsSync(resolve(join(pathToArray.slice(0, pathToArray.length - 1).join('/'), fileName.includes('.js') ? fileName : fileName + '.js')));
    fileName = isLastNameAFile ? fileName : 'index.js';
    fileName = fileName.includes('.js') ? fileName : fileName + '.js';
    const isPathNotHavingIndexFile = pathToArray[pathToArray.length - 1] != 'index' && pathToArray[pathToArray.length - 1] != 'index.js';
    if (fileName == 'index.js' && isPathNotHavingIndexFile) {
        pathBeforeFileName = pathToArray.join('/');
    } else {
        pathBeforeFileName = pathToArray.slice(0, pathToArray.length - 1).join('/');
    }
    return [pathBeforeFileName, fileName];
};

class GroupHelper {
    constructor(options) {
        this.args = this.arrayToObject(options);
        this.opts = {
            outputOptions: {},
            options: {},
            processingErrors: [],
        };
    }

    hyphenToUpperCase(name) {
        if (!name) {
            return name;
        }
        return name.replace(/-([a-z])/g, function(g) {
            return g[1].toUpperCase();
        });
    }
    mergeRecursive(acc, curr) {
        for (var p in curr) {
            try {
                // Property in destination object set; update its value.
                if (curr[p].constructor == Object) {
                    acc[p] = this.mergeRecursive(acc[p], curr[p]);
                } else {
                    acc[p] = curr[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                acc[p] = curr[p];
            }
        }

        return acc;
    }
    arrayToObject(arr) {
        if (!arr) {
            return;
        }
        var result = {};
        let arrLength = arr.length;
        for (let i = 0; i < arrLength; i++) {
            let key = Object.keys(arr[i])[0];
            const val = arr[i][key];
            result[this.hyphenToUpperCase(key)] = val;
        }
        return result;
    }
    verifyType(key, val) {
        /*  if(!schemaProp.includes(val)) {
            const errMsg = 'Unrecognized Option: ' + val + ' supplied to ' + key;
            this.errors.push(errMsg);
        } */
    }
    mapArgToBoolean(name, optionName) {
        ifArg(name, function(bool) {
            if ([true, false].includes(bool)) {
                options[optionName || name] = bool;
            }
        });
    }

    loadPlugin(name) {
        const loadUtils = require('loader-utils');
        let args;
        try {
            const p = name && name.indexOf('?');
            if (p > -1) {
                args = loadUtils.parseQuery(name.substring(p));
                name = name.substring(0, p);
            }
        } catch (e) {
            console.error('Invalid plugin arguments ' + name + ' (' + e + ').');
            process.exit(-1); // eslint-disable-line
        }

        let path;
        try {
            const resolve = require('enhanced-resolve');
            path = resolve.sync(process.cwd(), name);
        } catch (e) {
            console.error('Cannot resolve plugin ' + name + '.');
            process.exit(-1); // eslint-disable-line
        }
        let Plugin;
        try {
            Plugin = require(path);
        } catch (e) {
            console.error('Cannot load plugin ' + name + '. (' + path + ')');
            throw e;
        }
        try {
            return new Plugin(args);
        } catch (e) {
            console.error('Cannot instantiate plugin ' + name + '. (' + path + ')');
            throw e;
        }
    }

    ensureArray(parent, name) {
        if (!Array.isArray(parent[name])) {
            parent[name] = [];
        }
    }

    addPlugin(options, plugin) {
        ensureArray(options, 'plugins');
        options.plugins.unshift(plugin);
    }

    resolveFilePath(filename='', defaultValue) {
        if (filename && Array.isArray(filename)) {
            return filename.map(fp => this.resolveFilePath(fp, defaultValue)).filter(e => e);
        }
        if (filename) {
            if (!defaultValue) {
                [filename, defaultValue] = parseAndValidatedFilename(filename);
            }
            let configPath;
            const predefinedConfigPath = filename ? resolve(process.cwd(), filename, defaultValue) : null;
            const configPathExists = predefinedConfigPath ? existsSync(predefinedConfigPath) : false;
            return configPathExists ? predefinedConfigPath : configPath;
        }

        defaultValue = 'index.js';
        if (filename && filename.includes('.js')) {
            filename = filename + '.js';
        }
        if (defaultValue && defaultValue.includes('.js')) {
            defaultValue = defaultValue + '.js';
        }
        let configPath;
        const predefinedConfigPath = filename ? resolve(process.cwd(), filename) : undefined;
        const configPathExists = predefinedConfigPath ? existsSync(predefinedConfigPath) : undefined;

        if (!configPathExists) {
            let LOOKUP_PATHS = [`${filename}`, `src/${filename}`, defaultValue, `src/${defaultValue}`];
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
}

module.exports = GroupHelper;
