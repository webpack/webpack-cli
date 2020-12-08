'use strict';

const { red } = require('colorette');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const stripAnsi = require('strip-ansi');
const { run, runAndGetWatchProc, runPromptWithAnswers } = require('../../utils/test-utils');

const ENTER = '\x0D';
const outputDir = 'test-assets';
const outputPath = path.join(__dirname, outputDir);
const outputFile = `${outputDir}/updated-webpack.config.js`;
const outputFilePath = path.join(__dirname, outputFile);

describe('migrate command', () => {
    beforeEach(() => {
        rimraf.sync(outputPath);
        fs.mkdirSync(outputPath);
    });

    it('should warn if the source config file is not specified', () => {
        const { stderr } = run(__dirname, ['migrate'], false);
        expect(stderr).toContain("missing required argument 'config-path'");
    });

    it('should prompt accordingly if an output path is not specified', () => {
        const { stdout } = run(__dirname, ['migrate', 'webpack.config.js'], false);
        expect(stripAnsi(stdout)).toContain('? Migration output path not specified');
    });

    it('should throw an error if the user refused to overwrite the source file and no output path is provided', async () => {
        const { stderr } = await runAndGetWatchProc(__dirname, ['migrate', 'webpack.config.js'], false, 'n');
        expect(stderr).toContain(`${red('︎Migration aborted due to no output path')}`);
    });

    it('should prompt for config validation when an output path is provided', async () => {
        const { stdout } = await runAndGetWatchProc(__dirname, ['migrate', 'webpack.config.js', outputFile], false, 'y');
        // should show the diff of the config file
        expect(stdout).toContain('rules: [');
        expect(stripAnsi(stdout)).toContain('? Do you want to validate your configuration?');
    });

    it('should generate an updated config file when an output path is provided', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(
            __dirname,
            ['migrate', 'webpack.config.js', outputFile],
            [ENTER, ENTER],
            true,
        );
        expect(stripAnsi(stdout)).toContain('? Do you want to validate your configuration?');
        // should show the diff of the config file
        expect(stdout).toContain('rules: [');
        expect(stderr).toBeFalsy();

        expect(fs.existsSync(outputFilePath)).toBeTruthy();
        // the output file should be a valid config file
        const config = require(outputFilePath);
        expect(config.module.rules).toEqual([
            {
                test: /\.js$/,
                exclude: /node_modules/,

                use: [
                    {
                        loader: 'babel-loader',

                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                ],
            },
        ]);
    });

    it('should generate an updated config file and warn of an invalid webpack config', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(__dirname, ['migrate', 'bad-webpack.config.js', outputFile], [ENTER, ENTER]);
        expect(stripAnsi(stdout)).toContain('? Do you want to validate your configuration?');
        expect(stderr).toContain("configuration.output has an unknown property 'badOption'");

        expect(fs.existsSync(outputFilePath)).toBeTruthy();
    });
});
