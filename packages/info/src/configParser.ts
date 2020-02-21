import path from 'path';
import  chalk = require('chalk');
import prettyjson from 'prettyjson';

export function getNameFromPath(fullPath: string): string {
    const filename = fullPath.replace(/^.*[\\\/]/, '');
    return filename;
}

export function resolveFilePath(relativeFilePath: string): string {
    const configPath = path.resolve(process.cwd() + '/' + relativeFilePath);
    return configPath;
}

export function fetchConfig(configPath: string): object {
    let config = null;
    try {
        config = require(configPath);
    } catch (e) {
        process.stdout.write(chalk.red(`Error:`, e.code) + `\n` + e);
    }
    return config;
}

const CONFIG_SCHEMA = {
    plugins: 'Array',
};

function modifyConfig(config, key): void {
    switch (CONFIG_SCHEMA[key]) {
        case 'Array':
            config[key].forEach((element, idx) => {
                config[key][idx] = {
                    name: chalk.greenBright(element.constructor.name),
                    ...element,
                };
            });
    }
}

export function configReader(config): string[] {
    let filteredArray = [];

    const options = {
        noColor: true,
    };
    Object.keys(config).map((key): void => {
        if (CONFIG_SCHEMA[key]) {
            modifyConfig(config, key);
        }
        const rowArray = [key];
        rowArray.push(prettyjson.render(config[key], options));
        filteredArray = [...filteredArray, rowArray];
    });

    return filteredArray;
}
