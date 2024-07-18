// Cspell:ignore plopfile, plopfile.js
import { Command } from "commander";
import { resolve, dirname } from "path";
import { select } from "@inquirer/prompts";
import nodePlop, { PlopGenerator } from "node-plop";
import { fileURLToPath } from "url";

// eslint-disable-next-line node/no-missing-import
import { onSuccessHandler, onFailureHandler, logger } from "./utils/logger.js";
import { Answers } from "./types";

const __dirname = dirname(fileURLToPath(import.meta.url));

const program = new Command();

const plop = await nodePlop(resolve(__dirname, "./plopfile.js"));

const initValues: Record<string, Answers> = {
  default: {
    projectPath: process.cwd(),
    langType: "none",
    devServer: true,
    htmlWebpackPlugin: true,
    workboxWebpackPlugin: true,
    cssType: "none",
    isCSS: false,
    isPostCSS: false,
    extractPlugin: "No",
    packageManager: "npm",
  },
  react: {
    projectPath: process.cwd(),
    langType: "ES6",
    devServer: true,
    htmlWebpackPlugin: true,
    workboxWebpackPlugin: true,
    cssType: "none",
    isCSS: false,
    isPostCSS: false,
    extractPlugin: "No",
    packageManager: "npm",
  },
};

const initGenerators: Record<string, PlopGenerator> = {
  default: plop.getGenerator("init-default"),
  react: plop.getGenerator("init-react"),
};

program
  .version("1.0.0", "-v, --version")
  .usage("[command] [options]")
  .helpOption("-h, --help", "Display help for command")
  .description("A CLI tool to generate a Webpack project");

program
  .command("init", { isDefault: true })
  .aliases(["i", "n", "c", "create", "new"])
  .description("Initialize a new Webpack project")
  .argument("[projectPath]", "Path to create the project")
  .option("-f, --force", "Skip the prompt and use the default values", false)
  .option("-t --template <template>", "Template to be used for scaffolding", "default")
  .action(async function (projectPath, opts) {
    const { force } = opts;
    let templateOption = opts.template as string;
    let generator = initGenerators[templateOption];

    if (generator === undefined) {
      logger.warn(`${templateOption} is not a valid template, please select one from below`);
      const template = await select<string>({
        message: "Select a valid template from below",
        choices: Object.keys(initGenerators).map((key) => ({
          name: key,
          value: key.toLowerCase(),
        })),
      });
      templateOption = template;
      generator = initGenerators[templateOption];
    }
    const byPassValues: Array<string> = [];

    if (projectPath) byPassValues.push(projectPath);
    try {
      if (force) {
        logger.warn("Skipping the prompt and using the default values");

        logger.info("Initializing a new Webpack project");
        await generator.runActions(
          {
            ...initValues[templateOption],
            projectPath: byPassValues[0]
              ? resolve(process.cwd(), byPassValues[0])
              : initValues[templateOption].projectPath,
          },
          {
            onSuccess: onSuccessHandler,
            onFailure: onFailureHandler,
          },
        );
      } else {
        const answers = await generator.runPrompts(byPassValues);

        logger.info("Initializing a new Webpack project");
        await generator.runActions(answers, {
          onSuccess: onSuccessHandler,
          onFailure: onFailureHandler,
        });
      }
      logger.success("Project has been initialised with webpack!");
    } catch (error) {
      logger.error(`Failed to initialize the project with webpack!\n ${error}`);
      process.exit(2);
    }
  });

program.parse();
