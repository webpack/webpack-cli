// Cspell:ignore plopfile, plopfile.js
import { Command } from "commander";
import { resolve, dirname } from "path";
import nodePlop from "node-plop";
import { fileURLToPath } from "url";
import { PlopActionHooksChanges, PlopActionHooksFailures } from "./types";

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
    packageManager: "yarn",
  },
};

program
  .version("1.0.0", "-v, --version")
  .usage("[command] [options]")
  .helpOption("-h, --help", "Display help for command")
  .description("A CLI tool to generate a Webpack project");

program
  .command("init", { isDefault: true })
  .aliases(["i", "c", "create", "new"])
  .description("Initialize a new Webpack project")
  .argument("[projectPath]", "Path to create the project")
  .argument("[projectName]", "Name of the project")
  .option("-f, --force", "Skip the prompt and use the default values", false)
  .action(async function (projectPath, projectName, opts) {
    console.log("Initializing a new Webpack project");
    const { force } = opts;
    const initGenerator = plop.getGenerator("init");
    const byPassValues = [];
    if (projectPath) byPassValues.push(projectPath);
    if (projectName) byPassValues.push(projectName);
    try {
      if (force) {
        console.log("Skipping the prompt and using the default values");
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
        await initGenerator.runActions(answers, {
          onSuccess: onSuccessHandler,
          onFailure: onFailureHandler,
        });
      }
      console.log("Project initialised with webpack!");
    } catch (error) {
      console.log(`${error}`);
    }
  });

const onSuccessHandler = (change: PlopActionHooksChanges) => {
  console.log(`${change.path}`);
};
const onFailureHandler = (failure: PlopActionHooksFailures) => {
  throw new Error(failure.error);
};
program.parse();
