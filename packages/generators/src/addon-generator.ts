import { yellow } from 'colorette';
import fs from 'fs';
import path from 'path';
import Generator from 'yeoman-generator';

import { List } from './utils/scaffold-utils';

// Helper to get the template-directory content

const getFiles = (dir) => {
    return fs.readdirSync(dir).reduce((list, file) => {
        const filePath = path.join(dir, file);
        const isDir = fs.statSync(filePath).isDirectory();
        return list.concat(isDir ? getFiles(filePath) : filePath);
    }, []);
};

/**
 * Creates a Yeoman Generator that generates a project conforming
 * to webpack-defaults.
 *
 * @param {Generator.Questions} prompts An array of Yeoman prompt objects
 *
 * @param {string} templateDir Absolute path to template directory
 *
 * @param {Function} templateFn A function that is passed a generator instance and
 * returns an object containing data to be supplied to the template files.
 *
 * @returns {Generator} A class extending Generator
 */
const addonGenerator = (
    prompts: Generator.Questions,
    templateDir: string,
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
                this.utils.logger.log(`${yellow(`⚠ ${this.template} is not a valid template, please select one from below`)}`);

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

            let files = [];
            try {
                // An array of file paths (relative to `./templates`) of files to be copied to the generated project
                files = getFiles(this.resolvedTemplatePath);
            } catch (error) {
                this.utils.logger.error(`Failed to generate starter template.\n ${error}`);
                process.exit(2);
            }

            // Template file paths should be of the form `path/to/_file.js.tpl`
            const copyTemplateFiles = files.filter((filePath) => path.basename(filePath).startsWith('_'));

            // File paths should be of the form `path/to/file.js.tpl`
            const copyFiles = files.filter((filePath) => !copyTemplateFiles.includes(filePath));

            copyFiles.forEach((filePath) => {
                // `absolute-path/to/file.js.tpl` -> `destination-path/file.js`
                const destFilePath = path.relative(this.resolvedTemplatePath, filePath).replace('.tpl', '');
                this.fs.copyTpl(filePath, this.destinationPath(destFilePath));
            });

            copyTemplateFiles.forEach((filePath) => {
                // `absolute-path/to/_file.js.tpl` -> `destination-path/file.js`
                const destFilePath = path.relative(this.resolvedTemplatePath, filePath).replace('_', '').replace('.tpl', '');
                this.fs.copyTpl(filePath, this.destinationPath(destFilePath), templateFn(this));
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
