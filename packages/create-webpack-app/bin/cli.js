import { Command } from "commander";
import { resolve, join } from "path";
import nodePlop from "node-plop";
// Cspell:ignore plopfile, plopfile.js

const program = new Command();
const plop = await nodePlop("./lib/plopfile.js");
const defaultValues = {
  init: {
    projectPath: resolve(join(process.cwd(), ".")),
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
  .aliases(["i", "c", "create", "new"])
  .description("Initialize a new Webpack project")
  .argument("[projectPath]", "Path to create the project")
  .argument("[projectName]", "Name of the project")
  .option("-f, --force", "Skip the prompt and use the default values", false)
  .action(function (projectName, projectPath, opts) {
    console.log("Initializing a new Webpack project");
    const { force } = opts;
    const initGenerator = plop.getGenerator("init");
    const byPassValues = [];
    if (projectName) byPassValues.push(projectName);
    if (projectPath) byPassValues.push(projectPath);

    if (force) {
      console.log("Skipping the prompt and using the default values");
      initGenerator.runActions(defaultValues.init);
    } else {
      initGenerator.runPrompts(byPassValues).then((answers) => {
        initGenerator.runActions(answers);
      });
    }
  });

program.parse();
