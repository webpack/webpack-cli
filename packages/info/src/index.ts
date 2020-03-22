import  chalk = require('chalk');
import envinfo from 'envinfo';
import process from 'process';
import { argv } from './options';

import { AVAILABLE_COMMANDS, AVAILABLE_FORMATS, IGNORE_FLAGS } from './commands';

interface Information {
    Binaries?: string[];
    Browsers?: string[];
    System?: string[];
    npmGlobalPackages?: string[];
    npmPackages?: string | string[];
}

interface ArgvI {
    _?: string[];
    bin?: boolean;
    binaries?: boolean;
    config?: string;
}

const DEFAULT_DETAILS: Information = {
    Binaries: ['Node', 'Yarn', 'npm'],
    Browsers: ['Chrome', 'Firefox', 'Safari'],
    System: ['OS', 'CPU', 'Memory'],
    npmGlobalPackages: ['webpack', 'webpack-cli'],
    npmPackages: '*webpack*',
};

export function informationType(type: string): Information {
    switch (type) {
        case 'system':
            return { System: DEFAULT_DETAILS.System };
        case 'binaries':
            return { Binaries: DEFAULT_DETAILS.Binaries };
        case 'browsers':
            return { Browsers: DEFAULT_DETAILS.Browsers };
        case 'npmg':
            return { npmGlobalPackages: DEFAULT_DETAILS.npmGlobalPackages };
        case 'npmPackages':
            return { npmPackages: DEFAULT_DETAILS.npmPackages };
    }
}

export default async function info(customArgv: object): Promise<string[]> {
    let detailsObj = {};
    const envinfoConfig = {};
    const customArgs: boolean = customArgv && typeof customArgv === 'object' &&
        Object.entries(customArgv).length !== 0 && customArgv.constructor === Object;
    const args: ArgvI = customArgs ? customArgv : argv;
    const configRelativePath = argv._[1] ? argv._[1] : args.config;

    if (!configRelativePath) {
        Object.keys(args).forEach((flag: string) => {
            if (IGNORE_FLAGS.includes(flag)) {
                return;
            } else if (AVAILABLE_COMMANDS.includes(flag)) {
                const flagVal = informationType(flag);
                detailsObj = { ...detailsObj, ...flagVal };
            } else if (AVAILABLE_FORMATS.includes(flag)) {
                switch (flag) {
                    case 'output-json':
                        envinfoConfig['json'] = true;
                        break;
                    case 'output-markdown':
                        envinfoConfig['markdown'] = true;
                        break;
                }
            } else {
                // Invalid option
                process.stdout.write('\n' + chalk.bgRed(flag) + chalk.red(' is an invalid option' + '\n'));
                return;
            }
        });

        const output = await envinfo.run(Object.keys(detailsObj).length ? detailsObj : DEFAULT_DETAILS, envinfoConfig);
        !customArgs ? process.stdout.write(output + '\n') : null;
        return output;
    }
    process.exit(0);
}
