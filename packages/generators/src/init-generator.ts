import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

import { CustomGenerator } from "./types";
import { getInstaller, getTemplate } from "./utils/helpers";
import * as Question from "./utils/scaffold-utils";
import handlers from "./handlers";

export default class InitGenerator extends CustomGenerator {
  public configurationPath: string | undefined;
  public packageManager: string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public constructor(args: string | string[], opts: any) {
    super(args, opts);

    this.dependencies = ["webpack", "webpack-cli"];
    this.supportedTemplates = Object.keys(handlers);
  }

  public async prompting(): Promise<void> {
    if (!existsSync(this.generationPath)) {
      this.cli.logger.log(
        `${this.cli.colors.blue(
          "ℹ INFO ",
        )} supplied generation path doesn't exist, required folders will be created.`,
      );
      try {
        mkdirSync(this.generationPath, { recursive: true });
      } catch (error) {
        this.cli.logger.error(`Failed to create directory.\n ${error}`);
        process.exit(2);
      }
    }

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
        false,
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
