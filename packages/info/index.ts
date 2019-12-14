import chalk from 'chalk';
import * as envinfo from 'envinfo';
import * as process from 'process';
import { AVAILABLE_COMMANDS, AVAILABLE_FORMATS, IGNORE_FLAGS } from './commands';
import { configReader, fetchConfig, getNameFromPath, resolveFilePath } from './configParser';
import { argv } from './options';
import { renderTable } from './renderTable';

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

const CONFIG = {};
const DEFAULT_DETAILS: Information = {
    Binaries: ['Node', 'Yarn', 'npm'],
    Browsers: ['Chrome', 'Firefox', 'Safari'],
    System: ['OS', 'CPU', 'Memory'],
    npmGlobalPackages: ['webpack', 'webpack-cli'],
    npmPackages: '*webpack*',
};

let DETAILS_OBJ = {};

export function informationType(type: string): Information {
    switch (type) {
        case 'system':
            return { System: ['OS', 'CPU', 'Memory'] };
        case 'binaries':
            return { Binaries: ['Node', 'Yarn', 'npm'] };
        case 'browsers':
            return { Browsers: ['Chrome', 'Firefox', 'Safari'] };
        case 'npmg':
            return { npmGlobalPackages: ['webpack', 'webpack-cli'] };
        case 'npmPackages':
            return { npmPackages: '*webpack*' };
    }
}
export default async function info(CustomArgv: object): Promise<string[]> {
    const CUSTOM_AGRUMENTS: boolean = CustomArgv && Object.entries(CustomArgv).length !== 0 && CustomArgv.constructor === Object;
    const args: ArgvI = CUSTOM_AGRUMENTS ? CustomArgv : argv;
    const configRelativePath = argv._[1] ? argv._[1] : args.config;
    if (configRelativePath) {
        const fullConfigPath = resolveFilePath(configRelativePath);
        const fileName = getNameFromPath(fullConfigPath);
        const config = fetchConfig(fullConfigPath);
        const parsedConfig = configReader(config);

        const stringifiedTable = renderTable(parsedConfig, fileName);
        if (args.config) return parsedConfig;
        else process.stdout.write(stringifiedTable + '\n');
    } else {
        Object.keys(args).forEach((flag: string) => {
            if (IGNORE_FLAGS.includes(flag)) {
                return;
            } else if (AVAILABLE_COMMANDS.includes(flag)) {
                const flagVal = informationType(flag);
                DETAILS_OBJ = { ...DETAILS_OBJ, ...flagVal };
            } else if (AVAILABLE_FORMATS.includes(flag)) {
                switch (flag) {
                    case 'output-json':
                        CONFIG['json'] = true;
                        break;
                    case 'output-markdown':
                        CONFIG['markdown'] = true;
                        break;
                }
            } else {
                // Invalid option
                process.stdout.write('\n' + chalk.bgRed(flag) + chalk.red(' is an invalid option' + '\n'));
                return;
            }
        });

        const OUTPUT = await envinfo.run(Object.keys(DETAILS_OBJ).length ? DETAILS_OBJ : DEFAULT_DETAILS, CONFIG);
        !CUSTOM_AGRUMENTS ? process.stdout.write(OUTPUT + '\n') : null;
        return OUTPUT;
    }
    process.exit(0);
}
