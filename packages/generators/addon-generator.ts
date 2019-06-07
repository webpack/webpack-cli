import * as mkdirp from "mkdirp";
import * as path from "path";
import * as Generator from "yeoman-generator";

import * as copyUtils from "@webpack-cli/utils/copy-utils";

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
	templateFn: Function
): typeof Generator =>
	class AddonGenerator extends Generator {
		public props: Generator.Question;
		public copy: (value: string, index: number, array: string[]) => void;
		public copyTpl: (value: string, index: number, array: string[]) => void;

		public prompting(): Promise<void | {}> {
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
				mkdirp(this.props.name, (err: object): void => {
					console.error("Failed to create directory", err);
				});
				const pathToProjectDir: string = this.destinationPath(this.props.name);
				this.destinationRoot(pathToProjectDir);
			}
		}

		public writing(): void {
			this.copy = copyUtils.generatorCopy(this, templateDir);
			this.copyTpl = copyUtils.generatorCopyTpl(this, templateDir, templateFn(this));

			copyFiles.forEach(this.copy);
			copyTemplateFiles.forEach(this.copyTpl);
		}

		public install(): void {
			this.npmInstall(["webpack-defaults", "bluebird"], {
				"save-dev": true
			});
		}

		public end(): void {
			this.spawnCommand("npm", ["run", "defaults"]);
		}
	};

export default addonGenerator;
