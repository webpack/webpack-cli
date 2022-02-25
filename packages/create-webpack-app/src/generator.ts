import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

import { CustomGenerator } from "./types";
import { getInstaller, getTemplate } from "./helpers";
import * as Question from "./scaffold-utils";
import handlers from "./handlers";

/**
 *
 * Generator for initializing a webpack config
 *
 * @class 	Generator
 * @extends CustomGenerator
 * @returns {Void} After execution, transforms are triggered
 *
 */
export default class Generator extends CustomGenerator {
  public answers: Record<string, unknown>;
  public configurationPath!: string;
  public force: boolean;
  public generationPath: string;
  public packageManager!: string;
  public resolvedGenerationPath: string;
  public supportedTemplates: string[];
  public template: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public cli: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(args: any, opts: any) {
    super(args, opts);

    const { options } = opts;

    this.template = options.template;
    this.generationPath = options.generationPath;
    this.resolvedGenerationPath = path.resolve(process.cwd(), this.generationPath);
    this.force = options.force;
    this.dependencies = ["webpack", "webpack-cli"];
    this.supportedTemplates = Object.keys(handlers);
    this.answers = {};
    this.cli = opts.cli;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async prompting(): Promise<void | any> {
    if (!existsSync(this.resolvedGenerationPath)) {
      this.cli.logger.log(
        `${this.cli.colors.blue(
          "ℹ INFO ",
        )} supplied generation path doesn't exist, required folders will be created.`,
      );
      try {
        mkdirSync(this.resolvedGenerationPath, { recursive: true });
      } catch (error) {
        this.cli.logger.error(`Failed to create directory.\n ${error}`);
        process.exit(2);
      }
    }

    this.template = await getTemplate(this);

    await handlers[this.template].questions(this, Question);

    // Handle installation of prettier
    try {
      // eslint-disable-next-line node/no-extraneous-require
      require.resolve("prettier");
    } catch (err) {
      const { installPrettier } = await Question.Confirm(
        this,
        "installPrettier",
        "Do you like to install prettier to format generated configuration?",
        true,
        false,
      );

      if (installPrettier) {
        this.dependencies.push("prettier");
      }
    }
  }

  public async installPlugins(): Promise<void> {
    this.packageManager = await getInstaller(this);

    const opts: {
      dev?: boolean;
      "save-dev"?: boolean;
    } = this.packageManager === "yarn" ? { dev: true } : { "save-dev": true };

    this.scheduleInstallTask(this.packageManager, this.dependencies, opts, {
      cwd: this.generationPath,
    });
  }

  public writing(): void {
    this.cli.logger.log(`${this.cli.colors.blue("ℹ INFO ")} Initialising project...`);

    handlers[this.template].generate(this);
  }

  public end(): void {
    // Prettify configuration file if possible
    try {
      // eslint-disable-next-line node/no-extraneous-require, @typescript-eslint/no-var-requires
      const prettier = require("prettier");
      const source = readFileSync(this.configurationPath, { encoding: "utf8" });
      const formattedSource = prettier.format(source, { parser: "babel" });

      writeFileSync(this.configurationPath, formattedSource);
    } catch (err) {
      this.cli.logger.log(
        `${this.cli.colors.yellow(
          `⚠ Generated configuration may not be properly formatted as prettier is not installed.`,
        )}`,
      );

      return;
    }
  }
}
