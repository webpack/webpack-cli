import { readFileSync, writeFileSync } from "fs";

import { CustomGenerator, InitGeneratorOptions, CustomGeneratorOptions } from "./types";
import { getInstaller, getTemplate } from "./utils/helpers";
import * as Question from "./utils/scaffold-utils";
import handlers from "./handlers";

export default class InitGenerator<
  T extends InitGeneratorOptions = InitGeneratorOptions,
  Z extends CustomGeneratorOptions<T> = CustomGeneratorOptions<T>,
> extends CustomGenerator<InitGeneratorOptions> {
  public configurationPath: string | undefined;

  public constructor(args: string | string[], opts: Z) {
    super(args, opts);

    this.dependencies = ["webpack", "webpack-cli"];
    this.supportedTemplates = Object.keys(handlers);
  }

  public async prompting(): Promise<void> {
    this.template = await getTemplate.call(this);

    await handlers[this.template as keyof typeof handlers].questions(this, Question);

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
        this.force,
      );

      if (installPrettier) {
        this.dependencies.push("prettier");
      }
    }
  }

  public async installPlugins(): Promise<void> {
    this.packageManager = await getInstaller.call(this);

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
    this.configurationPath = this.destinationPath("webpack.config.js");

    handlers[this.template as keyof typeof handlers].generate(this);
  }

  public end(): void {
    // Prettify configuration file if possible
    try {
      // eslint-disable-next-line node/no-extraneous-require, @typescript-eslint/no-var-requires
      const prettier = require("prettier");
      const source = readFileSync(this.configurationPath as string, { encoding: "utf8" });
      const formattedSource = prettier.format(source, { parser: "babel" });

      writeFileSync(this.configurationPath as string, formattedSource);
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
