'use strict';

const fs = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const { runPromptWithAnswers } = require('../../../utils/test-utils');
const firstPrompt = 'Will your application have multiple bundles?';

const ENTER = '\x0D';
const DOWN = '\x1B\x5B\x42';
const genPath = join(__dirname, 'test-assets');

describe('init with SCSS', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    it('should use SCSS', async () => {
        const { stdout } = await runPromptWithAnswers(
            genPath,
            ['init'],
            [`N${ENTER}`, ENTER, ENTER, ENTER, `${DOWN}${DOWN}${ENTER}`, `Y${ENTER}`, `apple${ENTER}`, ENTER, ENTER, ENTER],
        );

        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!fs.existsSync(resolve(genPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['./package.json', './.yo-rc.json', './src/index.js', './webpack.config.js'];

        files.forEach((file) => {
            expect(fs.existsSync(resolve(genPath, file))).toBeTruthy();
        });

        const webpackConfig = require(join(genPath, './webpack.config.js'));

        expect(webpackConfig.module.rules).toEqual([
            {
                test: /.(sa|sc|c)ss$/,

                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, // eslint-disable-line
                    },
                    {
                        loader: 'css-loader',

                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',

                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ]);

        // Check if package.json is correctly configured
        const pkgJsonTests = () => {
            const pkgJson = require(join(genPath, './package.json'));
            expect(pkgJson).toBeTruthy();
            expect(pkgJson['devDependencies']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack-dev-server']).toBeTruthy();
            expect(pkgJson['devDependencies']['node-sass']).toBeTruthy();
            expect(pkgJson['devDependencies']['mini-css-extract-plugin']).toBeTruthy();
            expect(pkgJson['scripts']['build'] == 'webpack').toBeTruthy();
            expect(pkgJson['scripts']['serve'] == 'webpack serve').toBeTruthy();
        };
        expect(pkgJsonTests).not.toThrow();
    });
});
