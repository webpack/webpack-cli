const { resolve, join } = require('path');
const { existsSync } = require('fs');
const { arrayToObject } = require('../utils/arg-utils');

class GroupHelper {
    constructor(options) {
        this.args = arrayToObject(options);
        this.opts = {
            outputOptions: {},
            options: {},
        };
        this.strategy = undefined;
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
