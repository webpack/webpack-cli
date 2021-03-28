import { blue, yellow } from 'colorette';
import { utils } from 'webpack-cli';
import path from 'path';
import * as Question from './utils/scaffold-utils';

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
    public answers: Record<string, unknown>;
    public force: boolean;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public constructor(args: any, opts: any) {
        super(args, opts);

        const { options } = opts;

        this.template = options.template;
        this.generationPath = options.generationPath;
        this.resolvedGenerationPath = path.resolve(process.cwd(), this.generationPath);
        this.force = options.force;
        this.dependencies = ['webpack', 'webpack-cli'];
        this.supportedTemplates = Object.keys(handlers);
        this.answers = {};
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async prompting(): Promise<void | any> {
        if (!existsSync(this.resolvedGenerationPath)) {
            logger.log(`${blue('ℹ INFO ')} supplied generation path doesn't exist, required folders will be created.`);
            try {
                mkdirSync(this.resolvedGenerationPath, { recursive: true });
            } catch (error) {
                logger.error(`Failed to create directory.\n ${error}`);
                process.exit(2);
            }
        }

        if (!this.supportedTemplates.includes(this.template)) {
            logger.log(`${yellow(`⚠ ${this.template} is not a valid template, please select one from below`)}`);

            const { selectedTemplate } = await Question.List(
                this,
                'selectedTemplate',
                'Select a valid template from below:',
                this.supportedTemplates,
                'default',
                false,
            );

            this.template = selectedTemplate;
        }

        await handlers[this.template].questions(this, Question);
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
        logger.log(`${blue('ℹ INFO ')} Initialising project...`);
        handlers[this.template].generate(this);
    }
}
