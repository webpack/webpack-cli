import { blue, yellow } from 'colorette';
import { utils } from 'webpack-cli';
import logSymbols from 'log-symbols';
import path from 'path';
import { List } from './utils/scaffold-utils';

import { CustomGenerator } from './types';
import { existsSync, mkdirSync } from 'fs';
import handlers from './handlers';

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

    public constructor(args, opts) {
        super(args, opts);

        const { options } = opts;

        this.template = options.template;
        this.generationPath = options.generationPath;
        this.resolvedGenerationPath = path.resolve(process.cwd(), this.generationPath);

        this.dependencies = ['webpack', 'webpack-cli', 'webpack-dev-server'];
        this.supportedTemplates = ['default'];
    }

    public async prompting(): Promise<void | {}> {
        if (!existsSync(this.resolvedGenerationPath)) {
            logger.log(`${logSymbols.info}${blue(' INFO ')} supplied generation path doesn't exist, required folders will be created.`);
            try {
                mkdirSync(this.resolvedGenerationPath, { recursive: true });
            } catch (err) {
                logger.error('Failed to create directory');
                logger.error(err);
                process.exit(1);
            }
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
        logger.log(`${logSymbols.info}${blue(' INFO ')} Initialising project...`);
        handlers[this.template](this);
    }
}
