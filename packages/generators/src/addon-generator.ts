import fs from 'fs';
import path from 'path';
import Generator from 'yeoman-generator';

import { List } from './utils/scaffold-utils';

/**
 * Creates a Yeoman Generator that generates a project conforming
 * to webpack-defaults.
 *
 * @param {Generator.Questions} prompts An array of Yeoman prompt objects
 *
 * @param {string} templateDir Absolute path to template directory
 *
 * @param {string[]} copyFiles An array of file paths (relative to `./templates`)
 * of files to be copied to the generated project. File paths should be of the
 * form `path/to/file.js.tpl`.
 *
 * @param {string[]} copyTemplateFiles An array of file paths (relative to
 * `./templates`) of files to be copied to the generated project. Template
 * file paths should be of the form `path/to/_file.js.tpl`.
 *
 * @param {Function} templateFn A function that is passed a generator instance and
 * returns an object containing data to be supplied to the template files.
 *
 * @returns {Generator} A class extending Generator
 */
const addonGenerator = (
    prompts: Generator.Questions,
    templateDir: string,
    copyFiles: string[],
    copyTemplateFiles: string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    templateFn: (instance: any) => Record<string, unknown>,
): Generator.GeneratorConstructor => {
    return class extends Generator {
        public template: string;
        public resolvedTemplatePath: string;
        public supportedTemplates: string[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public utils: any;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public constructor(args: any, opts: any) {
            super(args, opts);

            const { cli = {}, options } = opts || {};

            this.utils = cli && cli.utils;
            this.template = options.template;
            this.supportedTemplates = fs.readdirSync(templateDir);
        }

        public props: Generator.Question;
        public copy: (value: string, index: number, array: string[]) => void;
        public copyTpl: (value: string, index: number, array: string[]) => void;

        public async prompting(): Promise<void> {
            if (!this.supportedTemplates.includes(this.template)) {
                this.utils.logger.warn(`⚠ ${this.template} is not a valid template, please select one from below`);

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
            this.resolvedTemplatePath = path.join(templateDir, this.template);

            return this.prompt(prompts).then((props: Generator.Question): void => {
                this.props = props;
            });
        }

        public default(): void {
            const currentDirName = path.basename(this.destinationPath());
            if (currentDirName !== this.props.name) {
                this.log(`
				Your project must be inside a folder named ${this.props.name}
				I will create this folder for you.
                `);
                const pathToProjectDir: string = this.destinationPath(this.props.name);
                try {
                    fs.mkdirSync(pathToProjectDir, { recursive: true });
                } catch (error) {
                    this.utils.logger.error('Failed to create directory');
                    this.utils.logger.error(error);
                }
                this.destinationRoot(pathToProjectDir);
            }
        }

        public writing(): void {
            const packageJsonTemplatePath = '../addon-template/package.json.js';
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            this.fs.extendJSON(this.destinationPath('package.json'), require(packageJsonTemplatePath)(this.props.name));

            copyFiles.forEach((filePath) =>
                this.fs.copyTpl(path.join(this.resolvedTemplatePath, filePath), this.destinationPath(filePath.replace('.tpl', ''))),
            );

            copyTemplateFiles.forEach((filePath) => {
                const destFilePath = filePath.replace('_', '').replace('.tpl', '');
                this.fs.copyTpl(path.join(this.resolvedTemplatePath, filePath), this.destinationPath(destFilePath), templateFn(this));
            });
        }

        public install(): void {
            const packager = this.utils.getPackageManager();
            const opts: {
                dev?: boolean;
                'save-dev'?: boolean;
            } = packager === 'yarn' ? { dev: true } : { 'save-dev': true };

            this.scheduleInstallTask(packager, ['webpack-defaults', 'bluebird'], opts);
        }
    };
};

export default addonGenerator;
