import { blue, green, bold } from 'colorette';
import { utils } from 'webpack-cli';
import logSymbols from 'log-symbols';
import path from 'path';
import { Confirm, Input, List } from './utils/scaffold-utils';

import { LangType, langQuestionHandler, tooltip, StylingType, styleQuestionHandler, entryQuestions } from './utils';
import { CustomGenerator } from './types';

const { logger, getPackageManager } = utils;

/**
 *
 * Generator for initializing a webpack config
 *
 * @class 	InitGenerator
 * @extends CustomGenerator
 * @returns {Void} After execution, transforms are triggered
 *
 */
export default class InitGenerator extends CustomGenerator {
    public autoGenerateConfig: boolean;
    public generationPath: string;
    private langType: string;

    public constructor(args, opts) {
        super(args, opts);

        this.autoGenerateConfig = opts.autoSetDefaults;
        this.generationPath = opts.generationPath;

        this.dependencies = ['webpack', 'webpack-cli', 'babel-plugin-syntax-dynamic-import'];

        this.configuration = {
            config: {
                configName: 'config',
                topScope: [],
                webpackOptions: {
                    mode: "'production'",
                    entry: undefined,
                    output: undefined,
                    plugins: [],
                    module: {
                        rules: [],
                    },
                },
            },
        };

        this.entryOption = './src/index.js';

        this.configuration.config.topScope.push("const path = require('path');", "const webpack = require('webpack');", '\n');

        (this.configuration.config.webpackOptions.plugins as string[]).push('new webpack.ProgressPlugin()');
    }

    public async prompting(): Promise<void | {}> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: this = this;

        logger.log(
            `${logSymbols.info}${blue(' INFO ')} ` +
                'For more information and a detailed description of each question, have a look at: ' +
                `${bold(green('https://github.com/webpack/webpack-cli/blob/master/INIT.md'))}`,
        );
        logger.log(`${logSymbols.info}${blue(' INFO ')} ` + 'Alternatively, run "webpack(-cli) --help" for usage info\n');

        const { multiEntries } = await Confirm(
            self,
            'multiEntries',
            'Will your application have multiple bundles?',
            false,
            this.autoGenerateConfig,
        );

        const entryOption: string | object = await entryQuestions(self, multiEntries, this.autoGenerateConfig);

        if (typeof entryOption === 'string') {
            // single entry apply when default is not used
            if (entryOption.length > 0 && entryOption !== "'./src/index.js'") {
                this.configuration.config.webpackOptions.entry = entryOption;
            }
        } else if (typeof entryOption === 'object') {
            // multiple entries
            this.configuration.config.webpackOptions.entry = entryOption;
        }

        this.entryOption = entryOption;

        const { outputDir } = await Input(
            self,
            'outputDir',
            'In which folder do you want to store your generated bundles?',
            'dist',
            this.autoGenerateConfig,
        );

        // only apply when output dir is not default
        if (outputDir !== 'dist') {
            this.configuration.config.webpackOptions.output = {
                path: `path.resolve(__dirname, '${outputDir}')`,
            };
        }

        const { langType } = await List(
            self,
            'langType',
            'Will you use one of the below JS solutions?',
            ['No', LangType.ES6, LangType.Typescript],
            'No',
            this.autoGenerateConfig,
        );

        langQuestionHandler(this, langType);
        this.langType = langType;

        const { stylingType } = await List(
            self,
            'stylingType',
            'Will you use one of the below CSS solutions?',
            ['No', StylingType.CSS, StylingType.SASS, StylingType.LESS, StylingType.PostCSS],
            'No',
            this.autoGenerateConfig,
        );
        const { ExtractUseProps, regExpForStyles } = styleQuestionHandler(self, stylingType);

        if (regExpForStyles) {
            // Ask if the user wants to use extractPlugin
            const { useExtractPlugin } = await Confirm(
                self,
                'useExtractPlugin',
                'Will you bundle your CSS files with MiniCssExtractPlugin?',
                false,
                this.autoGenerateConfig,
            );
            if (useExtractPlugin) {
                const { cssBundleName } = await Input(
                    self,
                    'cssBundleName',
                    'What will you name the CSS bundle?',
                    'main',
                    this.autoGenerateConfig,
                );
                this.dependencies.push('mini-css-extract-plugin');
                this.configuration.config.topScope.push(
                    tooltip.cssPlugin(),
                    "const MiniCssExtractPlugin = require('mini-css-extract-plugin');",
                    '\n',
                );
                if (cssBundleName.length !== 0) {
                    (this.configuration.config.webpackOptions.plugins as string[]).push(
                        `new MiniCssExtractPlugin({ filename:'${cssBundleName}.[contenthash].css' })`,
                    );
                } else {
                    (this.configuration.config.webpackOptions.plugins as string[]).push(
                        "new MiniCssExtractPlugin({ filename:'style.css' })",
                    );
                }

                // Remove style-loader from the loader chain
                ExtractUseProps.shift();

                ExtractUseProps.unshift({
                    loader: 'MiniCssExtractPlugin.loader',
                });
            }

            // load CSS assets, with or without mini-css-extract-plugin
            this.configuration.config.webpackOptions.module.rules.push({
                test: regExpForStyles,
                use: ExtractUseProps,
            });
        }

        // webpack Dev Server
        const { useDevServer } = await Confirm(
            self,
            'useDevServer',
            'Do you want to use webpack-dev-server?',
            true,
            this.autoGenerateConfig,
        );
        if (useDevServer) {
            this.dependencies.push('webpack-dev-server');
            this.configuration.config.webpackOptions.devServer = {
                open: true,
                host: "'localhost'",
            };
        }

        const { useHTMLPlugin } = await Confirm(
            self,
            'useHTMLPlugin',
            'Do you want to simplify the creation of HTML files for your bundle?',
            false,
            this.autoGenerateConfig,
        );

        if (useHTMLPlugin) {
            // Html webpack Plugin
            this.dependencies.push('html-webpack-plugin');
            const htmlWebpackDependency = 'html-webpack-plugin';
            (this.configuration.config.topScope as string[]).push(
                `const HtmlWebpackPlugin = require('${htmlWebpackDependency}')`,
                '\n',
                tooltip.html(),
            );
            (this.configuration.config.webpackOptions.plugins as string[]).push(`new HtmlWebpackPlugin({
					template: 'index.html'
				})`);
        }

        const { useWorkboxPlugin } = await Confirm(
            self,
            'useWorkboxPlugin',
            'Do you want to add PWA support?',
            true,
            this.autoGenerateConfig,
        );
        // webpack Dev Server
        if (useWorkboxPlugin) {
            this.configuration.config.topScope.push("const WorkboxWebpackPlugin = require('workbox-webpack-plugin');", '\n');
            this.dependencies.push('workbox-webpack-plugin');
            (this.configuration.config.webpackOptions.plugins as string[]).push(`new WorkboxWebpackPlugin.GenerateSW({
				swDest: 'sw.js',
				clientsClaim: true,
				skipWaiting: false,
			})`);
        }

        this.configuration.config.webpackOptions.mode = this.autoGenerateConfig ? "'production'" : "'development'";
    }

    public installPlugins(): void {
        const packager = getPackageManager();
        const opts: {
            dev?: boolean;
            'save-dev'?: boolean;
        } = packager === 'yarn' ? { dev: true } : { 'save-dev': true };

        this.scheduleInstallTask(packager, this.dependencies, opts, { cwd: this.generationPath });
    }

    public writing(): void {
        this.config.set('configuration', this.configuration);

        const isUsingDevServer = this.dependencies.includes('webpack-dev-server');
        const packageJsonTemplatePath = '../init-template/package.json.js';
        this.fs.extendJSON(
            this.destinationPath('package.json'),
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require(packageJsonTemplatePath)(isUsingDevServer),
        );

        const generateEntryFile = (entryPath: string, name: string): void => {
            entryPath = entryPath.replace(/'/g, '');
            this.fs.copyTpl(path.resolve(__dirname, '../init-template/index.js'), this.destinationPath(entryPath), { name });
        };

        // Generate entry file/files
        const entry = this.configuration.config.webpackOptions.entry || './src/index.js';
        if (typeof entry === 'string') {
            generateEntryFile(entry, 'your main file!');
        } else if (typeof entry === 'object') {
            Object.keys(entry).forEach((name: string): void => generateEntryFile(entry[name], `${name} main file!`));
        }

        // Generate README
        this.fs.copyTpl(path.resolve(__dirname, '../init-template/README.md'), this.destinationPath('README.md'), {});

        // Generate HTML template file
        this.fs.copyTpl(path.resolve(__dirname, '../init-template/template.html'), this.destinationPath('index.html'), {});

        if (this.langType === LangType.ES6) {
            this.fs.copyTpl(path.resolve(__dirname, '../init-template/.babelrc'), this.destinationPath('.babelrc'), {});
        } else if (this.langType === LangType.Typescript) {
            // Generate tsconfig
            const tsConfigTemplatePath = '../init-template/tsconfig.json.js';
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            this.fs.extendJSON(this.destinationPath('tsconfig.json'), require(tsConfigTemplatePath));
        }
    }
}
