import chalk from 'chalk';
import envinfo from 'envinfo';
import options from './options';
import WebpackCLI from 'webpack-cli';

interface Information {
    Binaries?: string[];
    Browsers?: string[];
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
    System: ['OS', 'CPU', 'Memory'],
    npmGlobalPackages: ['webpack', 'webpack-cli'],
    npmPackages: '*webpack*',
};

export default async function info(...args): Promise<string[]> {
    const cli = new WebpackCLI();
    const infoArgs = cli.commandLineArgs(options, { argv: args, stopAtFirstUnknown: false });
    const envinfoConfig = {};

    if (infoArgs._unknown && infoArgs._unknown.length > 0) {
        process.stderr.write(`Unknown option: ${chalk.red(infoArgs._unknown)}\n`);
    }

    if (infoArgs.output) {
        // Remove quotes if exist
        const output = infoArgs.output.replace(/['"]+/g, '');
        switch (output) {
            case 'markdown':
                envinfoConfig['markdown'] = true;
                break;
            case 'json':
                envinfoConfig['json'] = true;
                break;
            default:
                process.stderr.write(`${chalk.red(infoArgs.output)} is not a valid value for output\n`);
        }
    }

    let output = await envinfo.run(DEFAULT_DETAILS, envinfoConfig);
    output = output.replace(/npmPackages/g, 'Packages');
    output = output.replace(/npmGlobalPackages/g, 'Global Packages');

    const finalOutput = output;
    process.stdout.write(finalOutput + '\n');
    return finalOutput;
}
