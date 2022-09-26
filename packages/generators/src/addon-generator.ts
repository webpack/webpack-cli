import fs from "fs";
import path from "path";
import Generator from "yeoman-generator";

import { CustomGenerator } from "./types";
import type { CustomGeneratorOptions, BaseCustomGeneratorOptions } from "./types";
import { getInstaller, getTemplate } from "./utils/helpers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
Object.assign(Generator.prototype, require("yeoman-generator/lib/actions/install"));

// Helper to get the template-directory content
const getFiles = (dir: string): string[] => {
  return fs.readdirSync(dir).reduce((list, file) => {
    const filePath = path.join(dir, file);
    const isDir = fs.statSync(filePath).isDirectory();

    return list.concat(isDir ? getFiles(filePath) : filePath);
  }, [] as string[]);
};

abstract class AddonGenerator<
  T extends BaseCustomGeneratorOptions = BaseCustomGeneratorOptions,
  Z extends CustomGeneratorOptions<T> = CustomGeneratorOptions<T>,
> extends CustomGenerator<T, Z> {
  public props: Generator.Question | undefined;
  public resolvedTemplatePath: string | undefined;
}

export interface AddonGeneratorConstructor<
  T extends BaseCustomGeneratorOptions = BaseCustomGeneratorOptions,
  Z extends CustomGeneratorOptions<T> = CustomGeneratorOptions<T>,
> {
  new (args: string | string[], opts: Z): AddonGenerator<T, Z>;
}

const addonGenerator = <
  T extends BaseCustomGeneratorOptions = BaseCustomGeneratorOptions,
  Z extends CustomGeneratorOptions<T> = CustomGeneratorOptions<T>,
>(
  prompts: Generator.Questions,
  templateDir: string,
  templateFn: (instance: CustomGenerator<T, Z> & AddonGenerator) => Record<string, unknown>,
): AddonGeneratorConstructor<T, Z> => {
  return class extends CustomGenerator<T, Z> {
    public resolvedTemplatePath: string | undefined;
    public props: Generator.Question | undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor(args: string | string[], opts: any) {
      super(args, opts);

      this.supportedTemplates = fs.readdirSync(templateDir);
    }

    public async prompting(): Promise<void> {
      this.template = await getTemplate.call(this);
      this.resolvedTemplatePath = path.join(templateDir, this.template);
      this.props = await this.prompt(prompts);
      this.packageManager = await getInstaller.call(this);
    }

    public default(): void {
      const name = (this.props as Generator.Question).name as string;
      const currentDirName = path.basename(this.destinationPath());

      if (currentDirName !== name) {
        this.log(`
				Your project must be inside a folder named ${name}
				I will create this folder for you.
                `);

        const pathToProjectDir: string = this.destinationPath(name);

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
      const name = (this.props as Generator.Question).name as string;
      const resolvedTemplatePath = this.resolvedTemplatePath as string;
      const packageJsonTemplatePath = "../addon-template/package.json.js";

      this.fs.extendJSON(
        this.destinationPath("package.json"),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(packageJsonTemplatePath)(name),
      );

      let files = [];

      try {
        // An array of file paths (relative to `./templates`) of files to be copied to the generated project
        files = getFiles(resolvedTemplatePath);
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
        const destFilePath = path.relative(resolvedTemplatePath, filePath).replace(".tpl", "");

        this.fs.copyTpl(filePath, this.destinationPath(destFilePath));
      });

      copyTemplateFiles.forEach((filePath: string) => {
        // `absolute-path/to/_file.js.tpl` -> `destination-path/file.js`
        const destFilePath = path
          .relative(resolvedTemplatePath, filePath)
          .replace("_", "")
          .replace(".tpl", "");

        this.fs.copyTpl(filePath, this.destinationPath(destFilePath), templateFn(this));
      });
    }

    public install(): void {
      const packageManager = this.packageManager as string;
      const opts: {
        dev?: boolean;
        "save-dev"?: boolean;
      } = this.packageManager === "yarn" ? { dev: true } : { "save-dev": true };

      this.scheduleInstallTask(packageManager, ["webpack-defaults"], opts);
    }
  };
};

export default addonGenerator;
