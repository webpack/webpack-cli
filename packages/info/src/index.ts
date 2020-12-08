import envinfo from 'envinfo';
import { utils } from 'webpack-cli';

const { logger } = utils;

interface Information {
    Binaries?: string[];
    Browsers?: string[];
    Monorepos?: string[];
    System?: string[];
    npmGlobalPackages?: string[];
    npmPackages?: string | string[];
}

const DEFAULT_DETAILS: Information = {
    Binaries: ['Node', 'Yarn', 'npm'],
    Browsers: [
        'Brave Browser',
        'Chrome',
        'Chrome Canary',
        'Edge',
        'Firefox',
        'Firefox Developer Edition',
        'Firefox Nightly',
        'Internet Explorer',
        'Safari',
        'Safari Technology Preview',
    ],
    Monorepos: ['Yarn Workspaces', 'Lerna'],
    System: ['OS', 'CPU', 'Memory'],
    npmGlobalPackages: ['webpack', 'webpack-cli'],
    npmPackages: '*webpack*',
};

export default async function info(args?): Promise<string> {
    const envinfoConfig = {};

    // Support for passing empty options
    if (args === undefined) {
        args = {};
    }

    if (args.unknownArgs && args.unknownArgs.length > 0) {
        logger.error(`Unknown argument: ${args.unknownArgs}`);
        process.exit(2);
    }
    if (args.output) {
        // Remove quotes if exist
        const output = args.output.replace(/['"]+/g, '');
        switch (output) {
            case 'markdown':
                envinfoConfig['markdown'] = true;
                break;
            case 'json':
                envinfoConfig['json'] = true;
                break;
            default:
                logger.error(`'${args.output}' is not a valid value for output`);
                process.exit(2);
        }
    }

    let output = await envinfo.run(DEFAULT_DETAILS, envinfoConfig);
    output = output.replace(/npmPackages/g, 'Packages');
    output = output.replace(/npmGlobalPackages/g, 'Global Packages');

    const finalOutput = output;
    logger.raw(finalOutput);
    return finalOutput;
}
