import { Command } from "commander";
import { resolve, dirname } from "path";
import { select } from "@inquirer/prompts";
import nodePlop, { PlopGenerator } from "node-plop";
import { fileURLToPath } from "url";

import { onSuccessHandler, onFailureHandler, logger } from "./utils/logger.js";
import { Answers, InitOptions, LoaderOptions, PluginOptions } from "./types";

const __dirname = dirname(fileURLToPath(import.meta.url));

const program = new Command();

const plop = await nodePlop(resolve(__dirname, "./plopfile.js"));

const baseAnswers: Answers = {
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
};
const initValues: Record<string, Answers> = {
  default: {
    ...baseAnswers,
  },
  react: {
    ...baseAnswers,
    langType: "ES6",
    useReactState: true,
    cssType: "CSS only",
  },
  vue: {
    ...baseAnswers,
    langType: "ES6",
    useVueStore: true,
    cssType: "CSS only",
  },
  svelte: {
    ...baseAnswers,
    langType: "ES6",
    cssType: "CSS only",
  },
};

const initGenerators: Record<string, PlopGenerator> = {
  default: plop.getGenerator("init-default"),
  react: plop.getGenerator("init-react"),
  vue: plop.getGenerator("init-vue"),
  svelte: plop.getGenerator("init-svelte"),
};
const loaderGenerators: Record<string, PlopGenerator> = {
  default: plop.getGenerator("loader-default"),
};

const pluginGenerators: Record<string, PlopGenerator> = {
  default: plop.getGenerator("plugin-default"),
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
  .action(async function (projectPath, opts: InitOptions) {
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

    projectPath = projectPath
      ? resolve(process.cwd(), projectPath)
      : initValues[templateOption].projectPath;

    try {
      if (force) {
        logger.warn("Skipping the prompt and using the default values");

        logger.info("Initializing a new Webpack project");
        await generator.runActions(
          {
            ...initValues[templateOption],
            projectPath,
          },
          {
            onSuccess: onSuccessHandler,
            onFailure: onFailureHandler,
          },
        );
      } else {
        const answers = { projectPath, ...(await generator.runPrompts()) };

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
program
  .command("loader")
  .aliases(["l", "ld"])
  .description("Initialize a new loader template.")
  .argument("[projectPath]", "Path to create the project")
  .option("-t --template <template>", "Template to be used for scaffolding", "default")
  .action(async function (projectPath, opts: LoaderOptions) {
    let templateOption = opts.template as string;
    let generator = loaderGenerators[templateOption];

    if (generator === undefined) {
      logger.warn(`${templateOption} is not a valid template, please select one from below`);
      const template = await select<string>({
        message: "Select a valid template from below",
        choices: Object.keys(loaderGenerators).map((key) => ({
          name: key,
          value: key.toLowerCase(),
        })),
      });
      templateOption = template;
      generator = loaderGenerators[template];
    }

    projectPath = projectPath
      ? resolve(process.cwd(), projectPath)
      : initValues[templateOption].projectPath;

    try {
      const answers = { projectPath, ...(await generator.runPrompts()) };

      await generator.runActions(answers, {
        onSuccess: onSuccessHandler,
        onFailure: onFailureHandler,
      });
      logger.success("Loader template has been successfully scaffolded.");
    } catch (error) {
      logger.error(`Failed to initialize the loader template!\n ${error}`);
      process.exit(2);
    }
  });
program
  .command("plugin")
  .aliases(["p", "pl"])
  .description("Initialize a new plugin template.")
  .argument("[projectPath]", "Path to create the project")
  .option("-t --template <template>", "Template to be used for scaffolding", "default")
  .action(async function (projectPath, opts: PluginOptions) {
    let templateOption = opts.template as string;
    let generator = pluginGenerators[templateOption];

    if (generator === undefined) {
      logger.warn(`${templateOption} is not a valid template, please select one from below`);
      const template = await select<string>({
        message: "Select a valid template from below",
        choices: Object.keys(pluginGenerators).map((key) => ({
          name: key,
          value: key.toLowerCase(),
        })),
      });
      templateOption = template;
      generator = pluginGenerators[template];
    }

    projectPath = projectPath
      ? resolve(process.cwd(), projectPath)
      : initValues[templateOption].projectPath;

    try {
      const answers = { projectPath, ...(await generator.runPrompts()) };

      await generator.runActions(answers, {
        onSuccess: onSuccessHandler,
        onFailure: onFailureHandler,
      });
      logger.success("Plugin template has been successfully scaffolded.");
    } catch (error) {
      logger.error(`Failed to initialize the plugin template!\n ${error}`);
      process.exit(2);
    }
  });

program.parse();
