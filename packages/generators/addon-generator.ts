import * as mkdirp from "mkdirp";
import * as path from "path";
import Generator = require("yeoman-generator");

import * as copyUtils from "@webpack-cli/utils/copy-utils";
import { IInquirerScaffoldObject } from "@webpack-cli/webpack-scaffold";

/**
 * Creates a Yeoman Generator that generates a project conforming
 * to webpack-defaults.
 *
 * @param {any[]} prompts An array of Yeoman prompt objects
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
export default function addonGenerator(
	prompts: IInquirerScaffoldObject[],
	templateDir: string,
	copyFiles: string[],
	copyTemplateFiles: string[],
	templateFn: Function,
) {
	return class AddOnGenerator extends Generator {
		public props: IInquirerScaffoldObject;
		private copy: (value: string, index: number, array: string[]) => void;
		private copyTpl: (value: string, index: number, array: string[]) => void;

		public prompting(): Promise<{}> {
			return this.prompt(prompts)
				.then((props: IInquirerScaffoldObject): void => {
					this.props = props;
				});
		}

		public default() {
			const currentDirName: string = path.basename(this.destinationPath());
			if (currentDirName !== this.props.name) {
				this.log(`
				Your project must be inside a folder named ${this.props.name}
				I will create this folder for you.
				`);
				mkdirp(this.props.name, (err: object) => {
					console.error("Failed to create directory", err);
				});
				const pathToProjectDir: string = this.destinationPath(this.props.name);
				this.destinationRoot(pathToProjectDir);
			}
		}

		public writing() {
			this.copy = copyUtils.generatorCopy(this, templateDir);
			this.copyTpl = copyUtils.generatorCopyTpl(
				this,
				templateDir,
				templateFn(this),
			);

			copyFiles.forEach(this.copy);
			copyTemplateFiles.forEach(this.copyTpl);
		}

		public install() {
			this.npmInstall(["webpack-defaults", "bluebird"], {
				"save-dev": true,
			});
		}

		public end() {
			this.spawnCommand("npm", ["run", "defaults"]);
		}
	};
}
