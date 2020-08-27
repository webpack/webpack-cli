const { resolve, join } = require('path');
const { existsSync } = require('fs');

class GroupHelper {
    constructor(options) {
        this.args = this.arrayToObject(options);
        this.opts = {
            outputOptions: {},
            options: {},
        };
        this.strategy = undefined;
    }

    hyphenToUpperCase(name) {
        if (!name) {
            return name;
        }
        return name.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });
    }

    arrayToObject(arr) {
        if (!arr) {
            return;
        }
        return arr.reduce((result, currentItem) => {
            const key = Object.keys(currentItem)[0];
            result[this.hyphenToUpperCase(key)] = currentItem[key];
            return result;
        }, {});
    }

    resolveFilePath(filename = '', defaultValue) {
        if (filename && Array.isArray(filename)) {
            return filename.map((fp) => this.resolveFilePath(fp, defaultValue)).filter((e) => e);
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
            const LOOKUP_PATHS = [`${filename}`, `src/${filename}`, ...(defaultValue ? [defaultValue, `src/${defaultValue}`] : [])];

            if (filename) {
                LOOKUP_PATHS.unshift(filename);
            }
            LOOKUP_PATHS.forEach((p) => {
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
