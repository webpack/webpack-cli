import chalk from 'chalk';
import envinfo from 'envinfo';
import process from 'process';
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
    Browsers: ['Chrome', 'Firefox', 'Safari'],
    System: ['OS', 'CPU', 'Memory'],
    npmGlobalPackages: ['webpack', 'webpack-cli'],
    npmPackages: '*webpack*',
};

export default async function info(args: object): Promise<string[]> {
    console.log(args);
    const cli = new WebpackCLI();
    const infoArgs = cli.commandLineArgs(options, {argv: [], stopAtFirstUnknown: false});
    const envinfoConfig = {};

    if (!infoArgs._unknown || infoArgs._unknown.length > 0) {
        process.stderr.write(`Unknown option: ${chalk.red(infoArgs._unknown[0])}\n`);
    }

    if (infoArgs.output) {
        switch (infoArgs.output) {
            case "markdown":
                envinfoConfig["markdown"] = true;
                break;
            case "json":
                envinfoConfig["json"] = true;
                break;
            default:
                process.stderr.write(`${chalk.red(infoArgs.output)} is not a valid value for output\n`);
        }
    }

    const output = await envinfo.run(DEFAULT_DETAILS, envinfoConfig);
    process.stdout.write(output + '\n');
    process.exit(0);
}
