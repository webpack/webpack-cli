import fs from "fs";
import path from "path";
import Generator from "yeoman-generator";

import { getInstaller, getTemplate } from "./utils/helpers";

// Helper to get the template-directory content

const getFiles = (dir: string): string[] => {
  return fs.readdirSync(dir).reduce((list, file) => {
    const filePath = path.join(dir, file);
    const isDir = fs.statSync(filePath).isDirectory();

    return list.concat(isDir ? getFiles(filePath) : filePath);
  }, [] as string[]);
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
    public packageManager: string | undefined;
    public resolvedTemplatePath: string | undefined;
    public supportedTemplates: string[];
    public template: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public cli: any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor(args: any, opts: any) {
      super(args, opts);

      const { cli = {}, options } = opts || {};

      this.cli = cli;
      this.template = options.template;
      this.supportedTemplates = fs.readdirSync(templateDir);
    }

    public props: Generator.Question;
    public copy: (value: string, index: number, array: string[]) => void;
    public copyTpl: (value: string, index: number, array: string[]) => void;

    public async prompting(): Promise<void> {
      this.template = await getTemplate.call(this);
      this.resolvedTemplatePath = path.join(templateDir, this.template);
      this.props = await this.prompt(prompts);
      this.packageManager = await getInstaller.call(this);
    }

    public default(): void {
      const currentDirName = path.basename(this.destinationPath());

      if (currentDirName !== this.props.name) {
        this.log(`
				Your project must be inside a folder named ${this.props.name}
				I will create this folder for you.
                `);

        const pathToProjectDir: string = this.destinationPath(this.props.name as string);

        try {
          fs.mkdirSync(pathToProjectDir, { recursive: true });
        } catch (error) {
          this.cli.logger.error("Failed to create directory");
          this.cli.logger.error(error);
        }

        this.destinationRoot(pathToProjectDir);
      }
    }

    public writing(): void {
      const packageJsonTemplatePath = "../addon-template/package.json.js";
      this.fs.extendJSON(
        this.destinationPath("package.json"),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(packageJsonTemplatePath)(this.props.name),
      );

      let files = [];

      try {
        // An array of file paths (relative to `./templates`) of files to be copied to the generated project
        files = getFiles(this.resolvedTemplatePath as string);
      } catch (error) {
        this.cli.logger.error(`Failed to generate starter template.\n ${error}`);

        process.exit(2);
      }

      // Template file paths should be of the form `path/to/_file.js.tpl`
      const copyTemplateFiles = files.filter((filePath: string) =>
        path.basename(filePath).startsWith("_"),
      );

      // File paths should be of the form `path/to/file.js.tpl`
      const copyFiles = files.filter((filePath: string) => !copyTemplateFiles.includes(filePath));

      copyFiles.forEach((filePath: string) => {
        // `absolute-path/to/file.js.tpl` -> `destination-path/file.js`
        const destFilePath = path
          .relative(this.resolvedTemplatePath as string, filePath)
          .replace(".tpl", "");
        this.fs.copyTpl(filePath, this.destinationPath(destFilePath));
      });

      copyTemplateFiles.forEach((filePath: string) => {
        // `absolute-path/to/_file.js.tpl` -> `destination-path/file.js`
        const destFilePath = path
          .relative(this.resolvedTemplatePath as string, filePath)
          .replace("_", "")
          .replace(".tpl", "");
        this.fs.copyTpl(filePath, this.destinationPath(destFilePath), templateFn(this));
      });
    }

    public install(): void {
      const opts: {
        dev?: boolean;
        "save-dev"?: boolean;
      } = this.packageManager === "yarn" ? { dev: true } : { "save-dev": true };

      this.scheduleInstallTask(
        this.packageManager as string,
        ["webpack-defaults", "bluebird"],
        opts,
      );
    }
  };
};

export default addonGenerator;
