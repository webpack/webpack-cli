// Cspell:ignore plopfile, plopfile.js
import { Command } from "commander";
import { resolve, dirname } from "path";
import nodePlop from "node-plop";
import { fileURLToPath } from "url";

// eslint-disable-next-line node/no-missing-import
import { onSuccessHandler, onFailureHandler, logger } from "./utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const program = new Command();
const plop = await nodePlop(resolve(__dirname, "./plopfile.js"));
const defaultValues = {
  init: {
    projectPath: process.cwd(),
    projectName: "webpack-project",
    langType: "none",
    devServer: true,
    htmlWebpackPlugin: true,
    workboxWebpackPlugin: true,
    cssType: "CSS only",
    isCSS: true,
    isPostCSS: true,
    extractPlugin: "No",
    packageManager: "npm",
  },
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
  .argument("[projectName]", "Name of the project")
  .option("-f, --force", "Skip the prompt and use the default values", false)
  .action(async function (projectPath, projectName, opts) {
    const { force } = opts;
    const initGenerator = plop.getGenerator("init");
    const byPassValues: Array<string> = [];

    if (projectPath) byPassValues.push(projectPath);
    if (projectName) byPassValues.push(projectName);
    try {
      if (force) {
        logger.warn("Skipping the prompt and using the default values");

        logger.info("Initializing a new Webpack project");
        await initGenerator.runActions(
          {
            ...defaultValues.init,
            projectName: byPassValues[1] ? byPassValues[1] : defaultValues.init.projectName,
            projectPath: byPassValues[0]
              ? resolve(process.cwd(), byPassValues[0])
              : defaultValues.init.projectPath,
          },
          {
            onSuccess: onSuccessHandler,
            onFailure: onFailureHandler,
          },
        );
      } else {
        const answers = await initGenerator.runPrompts(byPassValues);

        logger.info("Initializing a new Webpack project");
        await initGenerator.runActions(answers, {
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
