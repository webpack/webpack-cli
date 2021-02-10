import { blue, yellow, green, bold, options } from 'colorette';
import { utils } from 'webpack-cli';
import logSymbols from 'log-symbols';
import path from 'path';
import { Confirm, Input, List } from './utils/scaffold-utils';

import { LangType, langQuestionHandler, tooltip, StylingType, styleQuestionHandler, entryQuestions } from './utils';
import { CustomGenerator } from './types';
import { existsSync } from 'fs';

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
    public template: string;
    public generationPath: string;
    public resolvedGenerationPath: string;
    public supportedTemplates: string[];

    public constructor(args, options) {
        super(args, options);

        this.template = options.template;
        this.generationPath = options.generationPath;
        this.resolvedGenerationPath = path.resolve(process.cwd(), this.generationPath);

        this.dependencies = ['webpack', 'webpack-cli'];
        this.supportedTemplates = ['default'];
    }

    public async prompting(): Promise<void | {}> {
        if (!existsSync(this.resolvedGenerationPath)) {
            logger.log(`${logSymbols.info}${blue(' INFO ')} supplied generation path doesn't exists, required folders willbe created`);
        }

        if (!this.template) {
            this.template = 'default';
        }

        if (!this.supportedTemplates.includes(this.template)) {
            logger.log(`${logSymbols.warning}${yellow(`${this.template} is not a valid template, please select one from below`)}`);

            const { selectedTemplate } = await List(
                this,
                'selectedTemplate',
                'Select a valid template from below:',
                this.supportedTemplates,
                'default',
                false,
            );

            this.template = selectedTemplate;
        }
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
    }
}
